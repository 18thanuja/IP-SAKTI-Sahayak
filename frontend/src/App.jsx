
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const languages = [
  { label: "English", value: "English" },
  { label: "తెలుగు", value: "Telugu" },
  { label: "हिन्दी", value: "Hindi" },
  { label: "தமிழ்", value: "Tamil" },
  { label: "ಕನ್ನಡ", value: "Kannada" },
];

const examples = [
  {
    icon: "⚖️",
    category: "PATENTS",
    question: "What makes an Ayurvedic invention patentable in India?",
  },
  {
    icon: "🌿",
    category: "TRADITIONAL KNOWLEDGE",
    question: "How can traditional Ayurvedic knowledge be protected?",
  },
  {
    icon: "🌍",
    category: "INTERNATIONAL",
    question: "How does WIPO support traditional knowledge protection?",
  },
  {
    icon: "📜",
    category: "REGULATIONS",
    question: "Which regulations apply to Ayurvedic medicines in India?",
  },
];

function citationMarkdown(content, citations = []) {
  if (!content) return "";

  return content.replace(
    /【Source\s+(\d+)】|\[Source\s+(\d+)\]/g,
    (match, first, second) => {
      const n = Number(first || second);
      const citation = citations[n - 1];

      if (!citation?.pdf_url) return `[Source ${n}]`;

      return `[Source ${n}](${citation.pdf_url})`;
    },
  );
}

export default function App() {
  const [language, setLanguage] = useState("English");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion(text = question) {
    const value = text.trim();
    if (!value || loading) return;

    setQuestion("");
    setError("");
    setMessages((previous) => [
      ...previous,
      { role: "user", content: value },
    ]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: value,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to get an answer.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer || "No answer was returned.",
          citations: data.citations || [],
          model: data.model || "",
        },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the backend. Check that FastAPI is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    if (loading) return;
    setMessages([]);
    setQuestion("");
    setError("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-symbol">✳</div>
          <div>
            <div className="brand-name">IP-SAKTI</div>
            <div className="brand-subtitle">SAHAYAK · AI RESEARCH</div>
          </div>
        </div>

        <button className="new-chat-button" onClick={newChat}>
          <span>＋</span> New conversation
        </button>

        <div className="side-label">YOUR RESEARCH SPACE</div>

        <div className="side-feature">
          <span className="feature-icon">⚖️</span>
          <div>
            <strong>Intellectual property</strong>
            <small>Patents, trademarks &amp; copyright</small>
          </div>
        </div>

        <div className="side-feature">
          <span className="feature-icon">🌱</span>
          <div>
            <strong>Ayurveda knowledge</strong>
            <small>Traditional knowledge &amp; regulation</small>
          </div>
        </div>

        <div className="side-feature">
          <span className="feature-icon">🌐</span>
          <div>
            <strong>Global frameworks</strong>
            <small>WIPO, treaties &amp; guidance</small>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="privacy-mark">✦</div>
          <p>Grounded in documents.<br />Designed for better research.</p>
          <span className="scope-pill">NATIONAL + INTERNATIONAL</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="mobile-brand">
            <span>✳</span> IP-SAKTI
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            Source-aware research
          </div>

          <label className="language-select">
            <span>文</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="Choose answer language"
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </header>

        <div className="chat-scroll">
          {messages.length === 0 ? (
            <section className="welcome">
              <div className="welcome-eyebrow">
                <span className="eyebrow-line" />
                KNOWLEDGE MEETS INNOVATION
                <span className="eyebrow-line" />
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="hero-orbit orbit-one" />
                <div className="hero-orbit orbit-two" />
                <div className="hero-plant">❧</div>
                <div className="hero-center">✳</div>
                <span className="hero-spark spark-one">✦</span>
                <span className="hero-spark spark-two">✧</span>
              </div>

              <h1>
                Ancient wisdom.
                <br />
                <span>Protected by knowledge.</span>
              </h1>

              <p className="hero-description">
                Explore intellectual property and regulatory guidance for
                Ayurveda, across Indian law and international frameworks.
                Ask in your language. Discover the evidence.
              </p>

              <div className="welcome-tags">
                <span>✦ Multilingual research</span>
                <span>↗ Source-linked answers</span>
                <span>◎ Official documents</span>
              </div>

              <div className="suggestions-heading">
                <span>✧</span> WHAT WOULD YOU LIKE TO EXPLORE?
              </div>

              <div className="suggestion-grid">
                {examples.map((item) => (
                  <button
                    className="suggestion-card"
                    key={item.category}
                    onClick={() => askQuestion(item.question)}
                    disabled={loading}
                  >
                    <div className="suggestion-top">
                      <span className="suggestion-icon">{item.icon}</span>
                      <span className="suggestion-arrow">↗</span>
                    </div>
                    <span className="suggestion-category">
                      {item.category}
                    </span>
                    <span className="suggestion-question">
                      {item.question}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="conversation">
              <div className="conversation-heading">
                <div>
                  <div className="section-kicker">YOUR RESEARCH SESSION</div>
                  <h2>Answers &amp; supporting evidence</h2>
                </div>
                <button className="text-button" onClick={newChat}>
                  ＋ New chat
                </button>
              </div>

              {messages.map((message, index) => (
                <article
                  className={`message-row ${message.role}`}
                  key={`${index}-${message.role}`}
                >
                  <div className="message-avatar">
                    {message.role === "user" ? "You" : "✳"}
                  </div>

                  <div className="message-body">
                    <div className="message-author">
                      {message.role === "user"
                        ? "YOU"
                        : "IP-SAKTI SAHAYAK"}
                    </div>

                    {message.role === "user" ? (
                      <div className="user-message">
                        {message.content}
                      </div>
                    ) : (
                      <>
                        <div className="answer-content">
                          <ReactMarkdown
                            components={{
                              a: ({ href, children, ...props }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  {...props}
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {citationMarkdown(
                              message.content,
                              message.citations,
                            )}
                          </ReactMarkdown>
                        </div>

                        {message.citations?.length > 0 && (
                          <div className="sources-section">
                            <div className="sources-heading">
                              <span>📚</span>
                              SUPPORTING DOCUMENTS
                              <span className="source-count">
                                {message.citations.length}
                              </span>
                            </div>

                            <div className="source-list">
                              {message.citations.map((citation, i) => (
                                <details
                                  className="source-card"
                                  key={`${citation.source}-${citation.page}-${i}`}
                                >
                                  <summary>
                                    <span className="pdf-icon">PDF</span>
                                    <span className="source-info">
                                      <strong>{citation.source}</strong>
                                      <small>
                                        Page {citation.page} · Evidence{" "}
                                        {i + 1}
                                      </small>
                                    </span>
                                    <span className="source-chevron">⌄</span>
                                  </summary>

                                  <div className="source-detail">
                                    {citation.text && (
                                      <p>{citation.text}</p>
                                    )}
                                    {citation.pdf_url && (
                                      <a
                                        className="open-pdf"
                                        href={citation.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Open original PDF <span>↗</span>
                                      </a>
                                    )}
                                  </div>
                                </details>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="answer-footer">
                          <span>✦ Evidence-based research</span>
                          {message.model && <span>{message.model}</span>}
                        </div>
                      </>
                    )}
                  </div>
                </article>
              ))}

              {loading && (
                <div className="loading-row">
                  <div className="message-avatar">✳</div>
                  <div>
                    <div className="message-author">SAHAYAK IS THINKING</div>
                    <div className="loading-card">
                      <span className="loading-leaf">✳</span>
                      <span>Searching documents and preparing your answer</span>
                      <span className="typing-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="error-message">⚠ {error}</div>}
            </section>
          )}

          {error && messages.length === 0 && (
            <div className="error-message welcome-error">⚠ {error}</div>
          )}
        </div>

        <footer className="composer-area">
          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              askQuestion();
            }}
          >
            <span className="composer-spark">✧</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  askQuestion();
                }
              }}
              placeholder={
                language === "Telugu"
                  ? "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి..."
                  : language === "Hindi"
                    ? "अपना प्रश्न यहाँ लिखें..."
                    : language === "Tamil"
                      ? "உங்கள் கேள்வியை இங்கே எழுதுங்கள்..."
                      : language === "Kannada"
                        ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                        : "Ask about patents, traditional knowledge, regulations..."
              }
              rows={1}
              aria-label="Enter your question"
              disabled={loading}
            />
            <button
              className="send-button"
              type="submit"
              disabled={!question.trim() || loading}
              aria-label="Send question"
            >
              {loading ? "…" : "↑"}
            </button>
          </form>

          <div className="composer-caption">
            <span>↵ Enter to send</span>
            <span>⇧ Shift + Enter for a new line</span>
            <span className="legal-note">
              For informational research only · Verify important legal claims
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
