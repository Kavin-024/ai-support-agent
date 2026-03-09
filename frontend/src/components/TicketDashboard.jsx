function TicketDashboard({ tickets }) {
  if (tickets.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#94a3b8",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        No tickets found.
      </div>
    );
  }

  function getStatusBadge(status) {
    const styles = {
      open:      { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
      escalated: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
      resolved:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    };
    const s = styles[status] || styles.open;
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          backgroundColor: s.bg,
          color: s.color,
          border: `1px solid ${s.border}`,
        }}
      >
        {status}
      </span>
    );
  }

function formatDate(dateStr) {
  if (!dateStr) return "—";
  
  // Force UTC interpretation by adding Z if not present
  const utcStr = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  
  return new Date(utcStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8fafc" }}>
            {["Ticket ID", "Intent", "Status", "Summary", "Created At"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr
              key={ticket.ticket_id || index}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <td style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", fontFamily: "monospace" }}>
                {(ticket.ticket_id || "—").substring(0, 14)}
              </td>
              <td style={{ padding: "12px 16px", fontSize: "13px", color: "#1e293b", textTransform: "capitalize" }}>
                {ticket.intent || "—"}
              </td>
              <td style={{ padding: "12px 16px" }}>
                {getStatusBadge(ticket.status)}
              </td>
              <td
                style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", maxWidth: "300px" }}
                title={ticket.summary || ""}
              >
                {ticket.summary
                  ? ticket.summary.length > 80
                    ? ticket.summary.substring(0, 80) + "..."
                    : ticket.summary
                  : "—"}
              </td>
              <td style={{ padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                {formatDate(ticket.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketDashboard;