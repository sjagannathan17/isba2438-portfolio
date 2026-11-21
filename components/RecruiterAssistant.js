"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ASSISTANT_VERSION,
  assistantTopics,
  getTopic,
  loadAssistantState,
  saveAssistantState,
} from "@/lib/assistant";
import { validateContact } from "@/lib/validateContact";
import formStyles from "./ContactForm.module.css";
import styles from "./RecruiterAssistant.module.css";

const initialState = {
  selectedTopicId: null,
  history: [],
  explored: [],
  enquiry: { name: "", email: "", company: "", role: "", message: "" },
  sent: false,
};

const emptyEnquiry = { name: "", email: "", company: "", role: "", message: "" };

function enquiryMessage(explored) {
  const labels = explored
    .map((id) => getTopic(id)?.label)
    .filter(Boolean);
  if (labels.length === 0) {
    return "Opportunity: ";
  }
  return `Opportunity: \n\nTopics I explored: ${labels.join(", ")}`;
}

function ChatBubbleIcon() {
  return (
    <svg
      className={styles.bubbleIcon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3C6.9 3 3 6.4 3 10.6c0 2.3 1.2 4.3 3.1 5.7-.1.9-.6 2.3-1.8 3.4 0 0 2.9-.2 5.1-1.7.8.2 1.7.3 2.6.3 5.1 0 9-3.4 9-7.7S17.1 3 12 3Z"
        fill="currentColor"
      />
      <circle cx="8.2" cy="10.7" r="1.1" fill="var(--paper, #202322)" />
      <circle cx="12" cy="10.7" r="1.1" fill="var(--paper, #202322)" />
      <circle cx="15.8" cy="10.7" r="1.1" fill="var(--paper, #202322)" />
    </svg>
  );
}

export default function RecruiterAssistant() {
  const [state, setState] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [restored, setRestored] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [clearMenuOpen, setClearMenuOpen] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const openerRef = useRef(null);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const saved = loadAssistantState();
    if (saved) {
      setState({
        selectedTopicId: saved.selectedTopicId,
        history: saved.history,
        explored: saved.explored,
        enquiry: saved.enquiry,
        sent: saved.sent,
      });
      if (saved.sent) {
        setEnquiryOpen(true);
        setStatus("success");
      }
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) {
      return;
    }
    const saved = saveAssistantState({
      version: ASSISTANT_VERSION,
      selectedTopicId: state.selectedTopicId,
      history: state.history,
      explored: state.explored,
      enquiry: state.enquiry,
      sent: state.sent,
    });
    setSaveFailed(!saved);
  }, [state, restored]);

  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("srinidhi:open-assistant", handleOpenEvent);
    return () => window.removeEventListener("srinidhi:open-assistant", handleOpenEvent);
  }, []);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      requestAnimationFrame(() => panelRef.current?.focus());
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      setTimeout(() => openerRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKey = (event) => {
      if (event.key === "Escape") {
        if (clearMenuOpen) {
          setClearMenuOpen(false);
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, clearMenuOpen]);

  const historyLength = state.history.length;
  const enquiryOpenRef = useRef(enquiryOpen);
  enquiryOpenRef.current = enquiryOpen;
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!open || !scroller || enquiryOpenRef.current) {
      return;
    }
    scroller.scrollTop = scroller.scrollHeight;
  }, [historyLength, open]);

  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  function handleOpen() {
    setClearMenuOpen(false);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const topic = getTopic(state.selectedTopicId);
  const askedIds = new Set(
    state.history
      .filter((entry) => entry.role === "visitor" && entry.questionId)
      .map((entry) => entry.questionId)
  );

  function openTopic(topicId) {
    setState((current) => {
      const nextTopic = getTopic(topicId);
      if (!nextTopic || current.selectedTopicId === topicId) {
        return current;
      }
      const alreadyExplored = current.explored.includes(topicId);
      return {
        ...current,
        selectedTopicId: topicId,
        explored: alreadyExplored ? current.explored : [...current.explored, topicId],
        history: [
          ...current.history,
          {
            role: "assistant",
            text: `${nextTopic.label}: choose a question and I will answer from my portfolio.`,
          },
        ],
      };
    });
    setTopicsOpen(false);
  }

  function askQuestion(question) {
    setState((current) => ({
      ...current,
      history: [
        ...current.history,
        { role: "visitor", text: question.q, questionId: question.id },
        { role: "assistant", text: question.a, link: question.link ?? null },
      ],
    }));
  }

  function openEnquiry() {
    setEnquiryOpen(true);
    setTopicsOpen(false);
    setClearMenuOpen(false);
    setStatus((current) => (state.sent ? "success" : "idle"));
    setState((current) => {
      if (current.enquiry.message.trim() !== "" || current.sent) {
        return current;
      }
      return { ...current, enquiry: { ...current.enquiry, message: enquiryMessage(current.explored) } };
    });
    requestAnimationFrame(() => {
      document.getElementById("assistant-name")?.focus();
    });
  }

  function backToConversation() {
    setEnquiryOpen(false);
    setClearMenuOpen(false);
    setStatus((current) => (state.sent ? "success" : "idle"));
    requestAnimationFrame(() => panelRef.current?.focus());
  }

  function updateDraft(field) {
    return (event) => {
      const value = event.target.value;
      setState((current) => ({
        ...current,
        enquiry: { ...current.enquiry, [field]: value },
      }));
      setErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors;
        }
        const next = { ...currentErrors };
        delete next[field];
        return next;
      });
    };
  }

  async function handleSend(event) {
    event.preventDefault();
    if (status === "pending" || state.sent) {
      return;
    }
    const { valid, errors: validationErrors } = validateContact(state.enquiry);
    if (!valid) {
      setStatus("validation");
      setErrors(validationErrors);
      return;
    }
    setStatus("pending");
    setErrors({});
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.enquiry.name,
          email: state.enquiry.email,
          company: state.enquiry.company,
          role: state.enquiry.role,
          message: state.enquiry.message,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 201) {
        setStatus("success");
        setState((current) => ({
          ...current,
          sent: true,
          enquiry: { ...emptyEnquiry },
        }));
      } else if (response.status === 400) {
        setStatus("validation");
        setErrors(data.errors ?? { form: "Please check your entries and try again." });
      } else {
        setStatus("failure");
        setErrors(data.errors ?? {});
      }
    } catch {
      setStatus("failure");
    }
  }

  function handleClearDraft() {
    setState((current) => ({
      ...current,
      sent: false,
      enquiry: { ...emptyEnquiry },
    }));
    setStatus("idle");
    setErrors({});
    setClearMenuOpen(false);
  }

  function handleClearConversation() {
    setState((current) => ({
      ...current,
      selectedTopicId: null,
      history: [],
      explored: [],
    }));
    setClearMenuOpen(false);
  }

  const enquiry = state.enquiry;
  const exploredLabels = state.explored
    .map((id) => getTopic(id)?.label)
    .filter(Boolean);
  const pendingQuestions = topic
    ? topic.questions.filter((question) => !askedIds.has(question.id))
    : [];
  const fieldError = (field) =>
    errors[field] ? (
      <p id={`assistant-${field}-error`} className={formStyles.error}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <>
      <button
        type="button"
        ref={openerRef}
        className={open ? `${styles.launcher} ${styles.launcherHidden}` : styles.launcher}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="assistant-panel"
        onClick={handleOpen}
      >
        <ChatBubbleIcon />
        <span className={styles.launcherLabel}>Ask about Srinidhi</span>
      </button>

      {open && (
        <div
          id="assistant-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Srinidhi's recruiter assistant"
          tabIndex={-1}
          className={styles.panel}
        >
          <header className={styles.panelHead}>
            <div>
              <p className={styles.panelTitle}>Srinidhi&rsquo;s recruiter assistant</p>
              <p className={styles.panelSubtitle}>
                Explore my experience or leave an enquiry
              </p>
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={handleClose}
              aria-label="Close assistant"
            >
              Close
            </button>
          </header>

          {saveFailed && open && (
            <p className={styles.saveWarning} role="status">
              Changes could not be saved in this browser. Your session still
              works, but the draft will not survive leaving this page.
            </p>
          )}

          {enquiryOpen ? (
            <div className={styles.scrollArea}>
              <div className={styles.enquiry}>
                <p className={styles.enquiryTitle}>Prepare your enquiry</p>
                <p className={styles.enquiryIntro}>
                  This guided assistant prepares a real enquiry for Srinidhi.
                  Fill in the fields below and send it through her contact
                  inbox.
                </p>
                {state.sent ? (
                  <p className={formStyles.success} role="status">
                    Your enquiry was sent. Thank you for reaching out! Clear
                    the draft to prepare a new one.
                  </p>
                ) : (
                  <>
                    {exploredLabels.length > 0 && (
                      <p className={styles.enquirySummary}>
                        Topics you explored: {exploredLabels.join(", ")}. You
                        can edit everything below before sending.
                      </p>
                    )}
                    {status === "pending" && (
                      <p className={formStyles.pending} role="status">
                        Sending...
                      </p>
                    )}
                    {status === "failure" && (
                      <p className={formStyles.failure} role="alert">
                        Something went wrong sending your enquiry. Your draft
                        is preserved below. Please try again.
                      </p>
                    )}
                    {status === "validation" && (
                      <p className={formStyles.summary} role="alert">
                        Please fix the errors below and send your enquiry
                        again.
                      </p>
                    )}
                    {errors.form && (
                      <p className={formStyles.summary} role="alert">
                        {errors.form}
                      </p>
                    )}
                    <form onSubmit={handleSend} noValidate>
                      <div className={formStyles.field}>
                        <label htmlFor="assistant-name">Name</label>
                        <input
                          id="assistant-name"
                          name="name"
                          type="text"
                          value={enquiry.name}
                          onChange={updateDraft("name")}
                          aria-invalid={errors.name ? "true" : undefined}
                          aria-describedby={errors.name ? "assistant-name-error" : undefined}
                        />
                        {fieldError("name")}
                      </div>
                      <div className={formStyles.field}>
                        <label htmlFor="assistant-email">Email</label>
                        <input
                          id="assistant-email"
                          name="email"
                          type="email"
                          value={enquiry.email}
                          onChange={updateDraft("email")}
                          aria-invalid={errors.email ? "true" : undefined}
                          aria-describedby={errors.email ? "assistant-email-error" : undefined}
                        />
                        {fieldError("email")}
                      </div>
                      <div className={formStyles.field}>
                        <label htmlFor="assistant-company">Company</label>
                        <input
                          id="assistant-company"
                          name="company"
                          type="text"
                          value={enquiry.company}
                          onChange={updateDraft("company")}
                        />
                      </div>
                      <div className={formStyles.field}>
                        <label htmlFor="assistant-role">Role or opportunity</label>
                        <input
                          id="assistant-role"
                          name="role"
                          type="text"
                          value={enquiry.role}
                          onChange={updateDraft("role")}
                        />
                      </div>
                      <div className={formStyles.field}>
                        <label htmlFor="assistant-message">Your opportunity</label>
                        <textarea
                          id="assistant-message"
                          name="message"
                          rows={5}
                          value={enquiry.message}
                          onChange={updateDraft("message")}
                          aria-invalid={errors.message ? "true" : undefined}
                          aria-describedby={errors.message ? "assistant-message-error" : undefined}
                        />
                        {fieldError("message")}
                      </div>
                      <button
                        type="submit"
                        className={formStyles.submit}
                        disabled={status === "pending"}
                      >
                        {status === "pending" ? "Sending..." : "Send enquiry"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div ref={scrollRef} className={styles.scrollArea} aria-live="polite" aria-label="Assistant conversation">
              {state.history.length === 0 && (
                <div className={styles.assistantBubble}>
                  <span className={styles.messageLabel}>Assistant</span>
                  <p>
                    Hi! I&rsquo;m Srinidhi&rsquo;s guided assistant. Open
                    <strong> Topics</strong> below, pick a subject, then a
                    suggested question, and I&rsquo;ll answer with facts from
                    her portfolio. When you&rsquo;re ready, prepare an enquiry
                    and it goes straight to her inbox.
                  </p>
                </div>
              )}
              {state.history.map((entry, index) =>
                entry.role === "visitor" ? (
                  <div key={index} className={styles.visitorBubble}>
                    <span className={styles.messageLabel}>You</span>
                    <p>{entry.text}</p>
                  </div>
                ) : (
                  <div key={index} className={styles.assistantBubble}>
                    <span className={styles.messageLabel}>Assistant</span>
                    <p>
                      {entry.text}
                      {entry.link && (
                        <Link href={entry.link.href} className={styles.answerLink}>
                          {entry.link.label}
                        </Link>
                      )}
                    </p>
                  </div>
                )
              )}

              {pendingQuestions.length > 0 && (
                <div
                  className={styles.quickReplies}
                  role="group"
                  aria-label={`Questions about ${topic.label}`}
                >
                  {pendingQuestions.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      className={styles.quickReply}
                      onClick={() => askQuestion(question)}
                    >
                      {question.q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {topicsOpen && !enquiryOpen && (
            <div className={styles.topicsBar} role="group" aria-label="Assistant topics">
              {assistantTopics.map((assistantTopic) => {
                const selected = state.selectedTopicId === assistantTopic.id;
                return (
                  <button
                    key={assistantTopic.id}
                    type="button"
                    className={
                      selected ? `${styles.topic} ${styles.topicActive}` : styles.topic
                    }
                    aria-pressed={selected}
                    onClick={() => openTopic(assistantTopic.id)}
                  >
                    {assistantTopic.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles.footer}>
            {enquiryOpen ? (
              <button type="button" className={styles.footerPrimary} onClick={backToConversation}>
                Back to conversation
              </button>
            ) : (
              <button type="button" className={styles.footerPrimary} onClick={openEnquiry}>
                Prepare an enquiry
              </button>
            )}
            {!enquiryOpen && (
              <button
                type="button"
                className={styles.footerSecondary}
                aria-expanded={topicsOpen}
                onClick={() => setTopicsOpen((current) => !current)}
              >
                Topics
              </button>
            )}
            <button
              type="button"
              className={styles.footerSecondary}
              aria-expanded={clearMenuOpen}
              aria-haspopup="menu"
              onClick={() => setClearMenuOpen((current) => !current)}
            >
              Clear&hellip;
            </button>
            {clearMenuOpen && (
              <div className={styles.clearMenu} role="menu" aria-label="Clearing actions">
                {enquiryOpen && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.clearMenuItem}
                    onClick={handleClearDraft}
                  >
                    Clear draft
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  className={styles.clearMenuItem}
                  onClick={handleClearConversation}
                >
                  Clear conversation
                </button>
              </div>
            )}
          </div>

          <p className={styles.guidedNote}>
            This is a guided assistant with suggested questions, not free-text
            chat.
          </p>
        </div>
      )}
    </>
  );
}
