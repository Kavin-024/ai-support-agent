import { useState } from "react";

function InputBox({ onSend, disabled }) {
  const [text, setText] = useState("");

  function handleSend() {
    if (text.trim() === "" || disabled) return;
    onSend(text.trim());
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "12px 16px",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your message..."
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          fontSize: "14px",
          outline: "none",
          backgroundColor: disabled ? "#f8fafc" : "#ffffff",
          color: "#1e293b",
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || text.trim() === ""}
        style={{
          padding: "10px 20px",
          borderRadius: "24px",
          border: "none",
          backgroundColor: disabled || text.trim() === "" ? "#94a3b8" : "#2563eb",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "600",
          cursor: disabled || text.trim() === "" ? "not-allowed" : "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default InputBox;