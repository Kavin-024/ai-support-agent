function Message({ role, content, escalated }) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          backgroundColor: isUser ? "#2563eb" : "#f1f5f9",
          color: isUser ? "#ffffff" : "#1e293b",
          fontSize: "14px",
          lineHeight: "1.5",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        {content}
      </div>

      {escalated && (
        <div
          style={{
            marginTop: "6px",
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "13px",
            maxWidth: "70%",
          }}
        >
          ⚠️ Your issue has been escalated. A human agent will contact you within 24 hours.
        </div>
      )}
    </div>
  );
}

export default Message;