export const ASSISTANT_STORAGE_KEY = "srinidhi-portfolio-assistant-v1";
export const ASSISTANT_VERSION = 2;

export const assistantTopics = [
  {
    id: "background",
    label: "Background",
    questions: [
      {
        id: "background-who",
        q: "What is her background?",
        a: "Srinidhi is an electrical engineer (B.E. from SSN College of Engineering, 2014 to 2018) who moved into fintech payments and now builds AI products while completing an MS in Business Analytics at Santa Clara University, Data Science & AI track, graduating December 2026.",
        link: { href: "/about-me", label: "About Me" },
      },
      {
        id: "background-looking",
        q: "What roles is she looking for?",
        a: "Associate or early-career Product Manager roles in AI and fintech, full-time, starting after December 2026. She is open to relocating anywhere in the US.",
        link: { href: "/about-me", label: "About Me" },
      },
      {
        id: "background-teaching",
        q: "Is she involved at the university besides studying?",
        a: "Yes, she is a Graduate Teaching Assistant at Santa Clara for Operations & Supply Chain and Supply Chain Finance, mentoring 60+ graduate students.",
        link: { href: "/about-me", label: "About Me" },
      },
    ],
  },
  {
    id: "ai-projects",
    label: "AI projects",
    questions: [
      {
        id: "ai-flex-what",
        q: "What is the Flex project?",
        a: "Flex Competitive Intelligence is an AI platform that tracks AI capital spending at 5 contract manufacturers using SEC filings, earnings calls, patents, and job posts, and answers natural-language questions about competitors. It was built for an SCU industry practicum with Flex, January 2026 to present.",
        link: { href: "/projects/flex-competitive-intelligence", label: "Read the case study" },
      },
      {
        id: "ai-flex-role",
        q: "What did she build on the Flex project?",
        a: "She was the AI Product Manager: she defined the scope and led delivery, built NLP pipelines to pull insights from earnings calls and investor communications, and implemented the RAG application with vector search. The platform cut manual analysis by 70% for about $30 a month, replacing a five-figure SaaS tool.",
        link: { href: "/projects/flex-competitive-intelligence", label: "Read the case study" },
      },
      {
        id: "ai-agri-what",
        q: "What is the Agri project?",
        a: "The Agri-Intelligence Platform is a WhatsApp AI system for Good Nature Agro in Zambia, designed for 22,000+ smallholder farmers. It is a team project for the SCU Analytics Showdown and was runner-up in Spring 2026.",
        link: { href: "/projects/agri-intelligence-platform", label: "Read the case study" },
      },
      {
        id: "ai-agri-role",
        q: "What did she build on the Agri project?",
        a: "She built the two-stage XGBoost risk model (AUC 0.931) and the WhatsApp system that sends farmers risk-based advisories by zone in English, Bemba, and Nyanja.",
        link: { href: "/projects/agri-intelligence-platform", label: "Read the case study" },
      },
    ],
  },
  {
    id: "payments",
    label: "Payments experience",
    questions: [
      {
        id: "pay-where",
        q: "What payments experience does she have?",
        a: "About 2.5 years at iGreenData (a Synechron company) in Bengaluru, as Associate Engineer and then Engineer in Product & Release, 2021 to 2024.",
        link: { href: "/about-me", label: "About my experience" },
      },
      {
        id: "pay-golives",
        q: "What did the payment go-lives involve?",
        a: "She led go-live of RTGS and ACH payment systems in Samoa, Fiji, and Vanuatu, moving interbank settlement from up to 5 days to real time.",
        link: { href: "/about-me", label: "About my experience" },
      },
      {
        id: "pay-clients",
        q: "Did she work with clients directly?",
        a: "Yes. She worked with regional teams, clients, and stakeholders from the Singapore delivery hub, and built dashboards tracking 50+ KPIs across 12 institutions.",
        link: { href: "/about-me", label: "About my experience" },
      },
    ],
  },
  {
    id: "skills",
    label: "Skills and tools",
    questions: [
      {
        id: "skills-code",
        q: "What languages and frameworks does she use?",
        a: "Python, SQL, R, and JavaScript, with Pandas, scikit-learn, and PyTorch for data and modeling, plus FastAPI and Next.js for building.",
        link: { href: "/about-me", label: "Full skill list" },
      },
      {
        id: "skills-ai",
        q: "What AI tooling has she worked with?",
        a: "RAG, LLMs, multi-agent systems, LangGraph, LangChain, ChromaDB, FAISS, and model and LLM evaluation.",
        link: { href: "/about-me", label: "Full skill list" },
      },
      {
        id: "skills-product",
        q: "What product skills does she bring?",
        a: "PRDs, roadmapping, user research, A/B testing, stakeholder management, Agile, Figma, and Jira.",
        link: { href: "/about-me", label: "Full skill list" },
      },
    ],
  },
  {
    id: "opportunities",
    label: "Opportunities",
    questions: [
      {
        id: "opp-fit",
        q: "What roles fit her?",
        a: "Associate or early-career Product Manager roles in AI and fintech.",
        link: { href: "/about-me", label: "About Me" },
      },
      {
        id: "opp-start",
        q: "When can she start?",
        a: "Full-time, starting after December 2026.",
        link: { href: "/about-me", label: "About Me" },
      },
      {
        id: "opp-relocate",
        q: "Is she open to relocation?",
        a: "Yes, she is open to relocating anywhere in the US.",
        link: { href: "/about-me", label: "About Me" },
      },
    ],
  },
];

export function getTopic(topicId) {
  return assistantTopics.find((topic) => topic.id === topicId) ?? null;
}

function validMessage(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  if (entry.role !== "visitor" && entry.role !== "assistant") {
    return false;
  }
  if (typeof entry.text !== "string" || entry.text.length === 0 || entry.text.length > 2000) {
    return false;
  }
  if (entry.link != null) {
    const link = entry.link;
    if (
      typeof link !== "object" ||
      typeof link.href !== "string" ||
      typeof link.label !== "string" ||
      !link.href.startsWith("/")
    ) {
      return false;
    }
  }
  return true;
}

function validState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  let candidate = value;
  if (candidate.version === 1) {
    candidate = {
      ...candidate,
      version: ASSISTANT_VERSION,
      enquiry: { ...candidate.enquiry, company: "", role: "" },
    };
  }
  if (candidate.version !== ASSISTANT_VERSION) {
    return null;
  }
  if (candidate.selectedTopicId !== null && typeof candidate.selectedTopicId !== "string") {
    return null;
  }
  if (
    candidate.selectedTopicId !== null &&
    !assistantTopics.some((topic) => topic.id === candidate.selectedTopicId)
  ) {
    return null;
  }
  if (!Array.isArray(candidate.history) || candidate.history.length > 200) {
    return null;
  }
  if (!candidate.history.every(validMessage)) {
    return null;
  }
  if (!Array.isArray(candidate.explored) || candidate.explored.length > assistantTopics.length) {
    return null;
  }
  if (!candidate.explored.every((id) => assistantTopics.some((topic) => topic.id === id))) {
    return null;
  }
  const enquiry = candidate.enquiry;
  if (!enquiry || typeof enquiry !== "object" || Array.isArray(enquiry)) {
    return null;
  }
  if (
    typeof enquiry.name !== "string" ||
    enquiry.name.length > 200 ||
    typeof enquiry.email !== "string" ||
    enquiry.email.length > 320 ||
    typeof enquiry.company !== "string" ||
    enquiry.company.length > 200 ||
    typeof enquiry.role !== "string" ||
    enquiry.role.length > 200 ||
    typeof enquiry.message !== "string" ||
    enquiry.message.length > 5000
  ) {
    return null;
  }
  if (typeof candidate.sent !== "boolean") {
    return null;
  }
  return {
    version: ASSISTANT_VERSION,
    selectedTopicId: candidate.selectedTopicId,
    history: candidate.history,
    explored: candidate.explored,
    enquiry: {
      name: enquiry.name,
      email: enquiry.email,
      company: enquiry.company,
      role: enquiry.role,
      message: enquiry.message,
    },
    sent: candidate.sent,
  };
}

export function loadAssistantState() {
  if (typeof window === "undefined") {
    return null;
  }
  let raw;
  try {
    raw = window.localStorage.getItem(ASSISTANT_STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw == null) {
    return null;
  }
  try {
    return validState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveAssistantState(state) {
  if (typeof window === "undefined") {
    return false;
  }
  const validated = validState(state);
  if (!validated) {
    return false;
  }
  try {
    window.localStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(validated));
    return true;
  } catch {
    return false;
  }
}

export function clearAssistantState() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(ASSISTANT_STORAGE_KEY);
  } catch {
    return;
  }
}
