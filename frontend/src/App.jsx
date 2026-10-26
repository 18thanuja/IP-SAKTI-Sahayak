

import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

import "./index.css";

import "./app.css";



const API_URL = (

  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

).replace(/\/$/, "");



const HISTORY_KEY = "ip-sakti-chat-history-v1";



const languages = [

  "English", "Telugu", "Hindi", "Tamil", "Kannada",

  "Malayalam", "Bengali", "Marathi", "Gujarati", "Punjabi",

  "Urdu", "Odia", "Assamese", "French", "Spanish",

  "German", "Arabic", "Chinese", "Japanese"

];



const voiceLanguages = {
  English: "en-IN",
  Telugu: "te-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Bengali: "bn-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Punjabi: "pa-IN",
  Urdu: "ur-IN",
  Odia: "or-IN",
  Assamese: "as-IN",
  French: "fr-FR",
  Spanish: "es-ES",
  German: "de-DE",
  Arabic: "ar-SA",
  Chinese: "zh-CN",
  Japanese: "ja-JP"
};

function getVoiceLanguage(language) {
  return voiceLanguages[language] || "en-IN";
}

function cleanTextForSpeech(text) {
  return String(text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[#*_>`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const examples = [

  {

    icon: "⚖️",

    category: "PATENTS",

    question: "Can traditional Ayurvedic knowledge be patented?",

    detail: "Understand patent eligibility and traditional knowledge."

  },

  {

    icon: "🌿",

    category: "TRADITIONAL KNOWLEDGE",

    question: "How is Ayurvedic knowledge protected in India?",

    detail: "Explore relevant laws and protection mechanisms."

  },

  {

    icon: "🌍",

    category: "INTERNATIONAL",

    question: "What international rules protect genetic resources?",

    detail: "Explore international frameworks and agreements."

  },

  {

    icon: "📜",

    category: "REGULATIONS",

    question: "Which regulations apply to Ayurvedic products?",

    detail: "Find relevant regulatory requirements and sources."

  }

];



function readHistory() {

  try {

    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

    return Array.isArray(saved) ? saved : [];

  } catch {

    return [];

  }

}



function makeId() {

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

}



function getTitle(question) {

  return question.trim().length > 42

    ? `${question.trim().slice(0, 42)}…`

    : question.trim() || "New conversation";

}



function Brand() {

  return (

    <div className="brand">

      <div className="brand-symbol">✳</div>

      <div>

        <div className="brand-name">IP-SAKTI</div>

        <div className="brand-subtitle">SAHAYAK · KNOWLEDGE COMPANION</div>

      </div>

    </div>

  );

}



function LanguagePicker({ language, setLanguage }) {

  return (

    <label className="language-select">

      <span aria-hidden="true">文</span>

      <select

        value={language}

        onChange={(event) => setLanguage(event.target.value)}

        aria-label="Answer language"

      >

        {languages.map((item) => (

          <option key={item} value={item}>{item}</option>

        ))}

      </select>

    </label>

  );

}



function SourceCards({ citations = [] }) {

  if (!Array.isArray(citations) || citations.length === 0) return null;



  return (

    <section className="sources-section">

      <div className="sources-heading">

        <span>▤</span>

        <span>REFERENCE SOURCES</span>

        <span className="source-count">{citations.length}</span>

      </div>



      <div className="source-list">

        {citations.map((source, index) => {

          const title =

            source.title ||

            source.source ||

            source.filename ||

            `Reference ${index + 1}`;



          const url = source.pdf_url || source.url || source.link;



          return (

            <details className="source-card" key={`${title}-${index}`}>

              <summary>

                <span className="pdf-icon">PDF</span>

                <span className="source-info">

                  <strong>{title}</strong>

                  <small>

                    {source.page ? `Page ${source.page}` : "Source document"}

                  </small>

                </span>

                <span className="source-chevron">⌄</span>

              </summary>



              <div className="source-detail">

                {source.text && <p>{source.text}</p>}

                {source.excerpt && <p>{source.excerpt}</p>}



                {url && (

                  <a

                    className="open-pdf"

                    href={url}

                    target="\_blank"

                    rel="noreferrer"

                  >

                    Open source document ↗

                  </a>

                )}

              </div>

            </details>

          );

        })}

      </div>

    </section>

  );

}



function Message({ message, onSpeak, speaking, onStopSpeaking }) {

  const isUser = message.role === "user";



  return (

    <article className={`message-row ${isUser ? "user" : "assistant"}`}>

      <div className="message-avatar">

        {isUser ? "You" : "✳"}

      </div>



      <div className="message-body">

        <div className="message-author">

          {isUser ? "YOU" : "IP-SAKTI SAHAYAK"}

        </div>



        {isUser ? (

          <div className="user-message">{message.content}</div>

        ) : (

          <>

            <div className="answer-content">

              <ReactMarkdown

                components={{

                  a: ({ href, children, ...props }) => (

                    <a

                      href={href}

                      target="\_blank"

                      rel="noreferrer"

                      {...props}

                    >

                      {children}

                    </a>

                  )

                }}

              >

                {message.content || ""}

              </ReactMarkdown>

            </div>

            <button
              type="button"
              onClick={() =>
                speaking
                  ? onStopSpeaking()
                  : onSpeak(message.content, message.id)
              }
              style={{
                marginTop: "10px",
                padding: "7px 12px",
                border: "1px solid rgba(76, 99, 76, 0.25)",
                borderRadius: "8px",
                background: "transparent",
                cursor: "pointer",
                fontSize: "13px"
              }}
              aria-label={speaking ? "Stop speaking" : "Listen to answer"}
            >
              {speaking ? "⏹ Stop" : "🔊 Listen"}
            </button>

            <SourceCards citations={message.citations} />

          </>

        )}

      </div>

    </article>

  );

}



export default function App() {

  const [history, setHistory] = useState(readHistory);

  const [activeId, setActiveId] = useState(null);

  const [messages, setMessages] = useState([]);

  const [question, setQuestion] = useState("");

  const [language, setLanguage] = useState("English");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);



  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getVoiceLanguage(language);

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();

      if (transcript) {
        setQuestion(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      if (event.error === "not-allowed") {
        alert("Microphone permission was blocked. Please allow microphone access.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Unable to start voice input:", err);
      setIsListening(false);
    }
  }

  function speakAnswer(text, messageId) {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getVoiceLanguage(language);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }

  const isChat = messages.length > 0;



  useEffect(() => {

    try {

      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    } catch {

      // The current conversation remains usable if storage is unavailable.

    }

  }, [history]);



  function newChat() {

    setActiveId(null);

    setMessages([]);

    setQuestion("");

    setError("");

    setLoading(false);

    setSidebarOpen(false);

  }



  function openChat(item) {

    setActiveId(item.id);

    setMessages(item.messages || []);

    setQuestion("");

    setError("");

    setSidebarOpen(false);

  }



  function deleteChat(id) {

    setHistory((previous) => previous.filter((item) => item.id !== id));



    if (activeId === id) newChat();

  }



  function saveConversation(id, nextMessages) {

    setHistory((previous) => {

      const existing = previous.find((item) => item.id === id);

      const firstQuestion =

        nextMessages.find((message) => message.role === "user")?.content || "";



      const updated = {

        id,

        title: existing?.title || getTitle(firstQuestion),

        updatedAt: Date.now(),

        messages: nextMessages

      };



      return [

        updated,

        ...previous.filter((item) => item.id !== id)

      ];

    });

  }



  async function askQuestion(value = question) {

    const text = value.trim();

    if (!text || loading) return;



    const conversationId = activeId || makeId();

    const userMessage = {

      role: "user",

      content: text,

      id: makeId()

    };



    const nextMessages = [...messages, userMessage];



    setActiveId(conversationId);

    setMessages(nextMessages);

    setQuestion("");

    setError("");

    setLoading(true);

    setSidebarOpen(false);



    try {

      const response = await fetch(`${API_URL}/ask`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          question: text,

          language

        })

      });



      if (!response.ok) {

        const detail = await response.text();

        throw new Error(detail || `Request failed (${response.status})`);

      }



      const data = await response.json();



      const answerMessage = {

        role: "assistant",

        content: data.answer || "No answer was returned.",

        citations: data.citations || [],

        model: data.model || "",

        id: makeId()

      };



      const completedMessages = [...nextMessages, answerMessage];

      setMessages(completedMessages);

      saveConversation(conversationId, completedMessages);

    } catch (err) {

      setError(

        `Unable to get an answer. Check that the backend is running and reachable. ${

          err.message || ""

        }`

      );

      saveConversation(conversationId, nextMessages);

    } finally {

      setLoading(false);

    }

  }



  function handleSubmit(event) {

    event.preventDefault();

    askQuestion();

  }



  function handleKeyDown(event) {

    if (event.key === "Enter" && !event.shiftKey) {

      event.preventDefault();

      askQuestion();

    }

  }



  const visibleHistory = history.filter((item) =>

    (item.title || "").toLowerCase().includes(search.toLowerCase())

  );



  return (

    <div className="app-shell">

      {sidebarOpen && (

        <button

          className="mobile-scrim"

          aria-label="Close sidebar"

          onClick={() => setSidebarOpen(false)}

        />

      )}



      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <Brand />



        <button className="new-chat-button" onClick={newChat}>

          <span>＋</span> New conversation

        </button>



        <div className="history-heading-row">

          <span className="side-label">YOUR CONVERSATIONS</span>

          <button

            className="history-clear-button"

            onClick={() => {

              if (window.confirm("Clear all saved conversations?")) {

                setHistory([]);

                newChat();

              }

            }}

          >

            Clear

          </button>

        </div>



        <input

          className="history-search"

          value={search}

          onChange={(event) => setSearch(event.target.value)}

          placeholder="Search conversations..."

          aria-label="Search conversations"

        />



        <div className="history-list">

          {visibleHistory.length === 0 ? (

            <div className="history-empty">

              Your conversations will appear here.

            </div>

          ) : (

            visibleHistory.map((item) => (

              <div

                className={`history-item ${

                  item.id === activeId ? "active" : ""

                }`}

                key={item.id}

              >

                <button

                  className="history-open-button"

                  onClick={() => openChat(item)}

                >

                  <span className="history-item-icon">▤</span>

                  <span className="history-item-text">

                    <strong>{item.title}</strong>

                    <small>

                      {new Date(item.updatedAt || Date.now()).toLocaleDateString()}

                    </small>

                  </span>

                </button>



                <button

                  className="history-delete-button"

                  title="Delete conversation"

                  aria-label={`Delete ${item.title}`}

                  onClick={() => deleteChat(item.id)}

                >

                  ×

                </button>

              </div>

            ))

          )}

        </div>



        <div className="research-label side-label">KNOWLEDGE SCOPE</div>



        <div className="side-feature">

          <span className="feature-icon">⚖</span>

          <div>

            <strong>Intellectual property</strong>

            <small>Patents, copyright and trademarks</small>

          </div>

        </div>



        <div className="side-feature">

          <span className="feature-icon">🌿</span>

          <div>

            <strong>Ayurveda regulations</strong>

            <small>Traditional knowledge and policy</small>

          </div>

        </div>



        <div className="side-feature">

          <span className="feature-icon">🌐</span>

          <div>

            <strong>National + international</strong>

            <small>Indian laws and global frameworks</small>

          </div>

        </div>



        <div className="sidebar-bottom">

          <div className="privacy-mark">✳</div>

          <p>Traditional knowledge deserves careful research and protection.</p>

          <span className="scope-pill">SOURCE-GROUNDED AI</span>

          <small className="local-storage-note">

            Conversation history is saved in this browser.

          </small>

        </div>

      </aside>



      <main className="main-panel">

        <header className="topbar">

          <button

            className="menu-toggle"

            aria-label="Open sidebar"

            onClick={() => setSidebarOpen(true)}

          >

            ☰

          </button>



          <div className="mobile-brand">

            <span>✳</span> IP-SAKTI

          </div>



          <div className="topbar-status">

            <span className="status-dot" />

            Knowledge assistant

          </div>



          <LanguagePicker language={language} setLanguage={setLanguage} />

        </header>



        <div className="chat-scroll">

          {!isChat ? (

            <section className="welcome">

              <div className="welcome-eyebrow">

                <span className="eyebrow-line" />

                IP-SAKTI SAHAYAK

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

                Protecting tradition.

                <br />

                <span>Empowering innovation.</span>

              </h1>



              <p className="hero-description">

                Explore intellectual property and regulatory guidance for

                Ayurveda through national laws and international frameworks.

                Ask a question to get started.

              </p>



              <div className="welcome-tags">

                <span>Multilingual</span>

                <span>Source-linked</span>

                <span>Document-grounded</span>

              </div>



              <div className="suggestions-heading">

                <span>✧</span> SUGGESTED QUESTIONS

              </div>



              <div className="suggestion-grid">

                {examples.map((example) => (

                  <button

                    className="suggestion-card"

                    key={example.question}

                    onClick={() => askQuestion(example.question)}

                    disabled={loading}

                  >

                    <div className="suggestion-top">

                      <span className="suggestion-icon">{example.icon}</span>

                      <span className="suggestion-arrow">↗</span>

                    </div>

                    <span className="suggestion-category">

                      {example.category}

                    </span>

                    <span className="suggestion-question">

                      {example.question}

                    </span>

                    <span className="suggestion-detail">{example.detail}</span>

                  </button>

                ))}

              </div>



              {error && <div className="error-message welcome-error">{error}</div>}

            </section>

          ) : (

            <section className="conversation">

              <div className="conversation-heading">

                <div>

                  <div className="section-kicker">YOUR RESEARCH SESSION</div>

                  <h2>Conversation</h2>

                </div>

                <button className="text-button" onClick={newChat}>

                  ＋ New chat

                </button>

              </div>



              {messages.map((message) => (

                <Message
                  key={message.id || makeId()}
                  message={message}
                  onSpeak={speakAnswer}
                  onStopSpeaking={stopSpeaking}
                  speaking={speakingMessageId === message.id}
                />

              ))}



              {loading && (

                <div className="loading-row">

                  <div className="message-avatar">✳</div>

                  <div className="loading-card">

                    <span className="loading-leaf">✳</span>

                    Researching your question

                    <span className="typing-dots">

                      <i /><i /><i />

                    </span>

                  </div>

                </div>

              )}



              {error && <div className="error-message">{error}</div>}

            </section>

          )}

        </div>



        <div className={`composer-area ${!isChat ? "landing-composer-area" : ""}`}>

          <form className="composer" onSubmit={handleSubmit}>

            <span className="composer-spark">✳</span>

            <textarea

              value={question}

              onChange={(event) => setQuestion(event.target.value)}

              onKeyDown={handleKeyDown}

              placeholder="Ask about patents, traditional knowledge, regulations..."

              rows={1}

              aria-label="Ask a question"

              disabled={loading}

            />

            <button
              type="button"
              onClick={startVoiceInput}
              disabled={loading || isListening}
              className="voice-button"
              style={{
                width: "42px",
                height: "42px",
                marginRight: "6px",
                border: "1px solid rgba(76, 99, 76, 0.25)",
                borderRadius: "10px",
                background: isListening ? "#e8efe5" : "transparent",
                cursor: loading || isListening ? "default" : "pointer",
                fontSize: "18px",
                flexShrink: 0
              }}
              aria-label="Speak your question"
              title={isListening ? "Listening..." : "Speak your question"}
            >
              {isListening ? "🎙️" : "🎤"}
            </button>

            <button

              type="submit"

              className="send-button"

              disabled={loading || !question.trim()}

              aria-label="Send question"

            >

              {loading ? "…" : "↑"}

            </button>

          </form>



          <div className="composer-caption">

            <span>Enter to ask · Shift + Enter for a new line</span>

            <span className="legal-note">

              AI responses can be imperfect. Check the cited sources.

            </span>

          </div>

        </div>

      </main>

    </div>

  );

}
