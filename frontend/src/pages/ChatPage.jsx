import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import InputBox from "../components/InputBox";
import { generateSessionId, sendMessage } from "../services/api";

const STORAGE_KEY = "chat_messages";
const SESSION_KEY = "chat_session_id";

const defaultMessage = {
  id: 1,
  role: "assistant",
  content: "Hi! I am your AI support assistant. How can I help you today?",
  escalated: false,
};

function ChatPage() {
  // Keep same session ID across page navigations
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const newId = generateSessionId();
    localStorage.setItem(SESSION_KEY, newId);
    return newId;
  });

  // Load messages from localStorage on first render
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [defaultMessage];
    } catch {
      return [defaultMessage];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function handleSend(text) {
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      escalated: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await sendMessage(sessionId, text);
      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: result.response,
        escalated: result.escalated,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        escalated: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearChat() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    const newId = generateSessionId();
    localStorage.setItem(SESSION_KEY, newId);
    setMessages([defaultMessage]);
    window.location.reload();
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px",
          backgroundColor: "#1e293b",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ color: "#ffffff", fontWeight: "700", fontSize: "16px" }}>
              AI Support Agent
            </div>
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>
              Always here to help
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleClearChat}
            style={{
              color: "#94a3b8",
              backgroundColor: "transparent",
              border: "1px solid #334155",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            New Chat
          </button>
          <Link
            to="/admin"
            style={{
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "13px",
              padding: "6px 12px",
              border: "1px solid #334155",
              borderRadius: "6px",
            }}
          >
            Admin Dashboard →
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: "760px",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 0 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <ChatBox messages={messages} isLoading={isLoading} />
        <InputBox onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}

export default ChatPage;