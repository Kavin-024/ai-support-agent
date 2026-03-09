import { useEffect, useRef } from "react";
import Message from "./Message";

function ChatBox({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map((msg) => (
        <Message
          key={msg.id}
          role={msg.role}
          content={msg.content}
          escalated={msg.escalated}
        />
      ))}

      {isLoading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "10px 14px",
            backgroundColor: "#f1f5f9",
            borderRadius: "18px 18px 18px 4px",
            width: "fit-content",
            marginBottom: "12px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#94a3b8",
                animation: "bounce 1.2s infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes bounce {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-6px); }
            }
          `}</style>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;