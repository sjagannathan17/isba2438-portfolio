export const projects = [
  {
    slug: "flex-competitive-intelligence",
    name: "Flex Competitive Intelligence",
    tag: "AI · Competitive Intelligence",
    blurb:
      "AI platform tracking competitors' AI capital spending from SEC filings, earnings calls, patents, and job posts.",
    summary:
      "An AI platform that tracks AI capital spending at 5 contract manufacturers using SEC filings, earnings calls, patents, and job posts, and answers natural-language questions about competitors.",
    why: "Flex's analysts spent hours reading financial documents by hand. We cut that manual analysis by 70% for about $30 a month, replacing a five-figure SaaS tool.",
    roleLabel: "My role",
    role: "AI Product Manager for an SCU industry practicum with Flex, January 2026 to present. I defined the scope and led delivery, built NLP pipelines to pull insights from earnings calls and investor communications, and implemented the RAG application with vector search.",
    tech: [
      "Python",
      "RAG with vector search",
      "web search",
      "NLP pipelines",
      "LangGraph",
      "ChromaDB",
      "FastAPI",
      "Next.js",
    ],
    link: {
      label: "View on GitHub",
      url: "https://github.com/sjagannathan17/flex-competitive-intelligence",
    },
  },
  {
    slug: "agri-intelligence-platform",
    name: "Agri-Intelligence Platform",
    tag: "AI · Social Impact",
    blurb:
      "WhatsApp AI system serving 22,000+ farmers in Zambia with local-language, risk-based advisories.",
    summary:
      "A WhatsApp-based AI system for Good Nature Agro in Zambia that sends farmers risk-based advisories by zone, and answers questions in English, Bemba, and Nyanja. It serves 22,000+ farmers.",
    why: "Smallholder farmers needed timely, local-language advice on a channel they already use.",
    roleLabel: "Team and context",
    role: "A team project for the SCU Analytics Showdown, Spring 2026, where we finished runner-up.",
    tech: [
      "Claude",
      "a 5-agent system",
      "WhatsApp",
      "two-stage XGBoost risk model (AUC 0.931)",
    ],
    link: {
      label: "View on GitHub",
      url: "https://github.com/sjagannathan17/agri-intelligence-platform",
    },
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
