import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TicketDashboard from "../components/TicketDashboard";
import { getAllTickets } from "../services/api";

function AdminPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getAllTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const filtered = tickets.filter((t) => {
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchSearch =
      searchText === "" ||
      t.intent?.toLowerCase().includes(searchText.toLowerCase()) ||
      t.summary?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    escalated: tickets.filter((t) => t.status === "escalated").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#ffffff", fontWeight: "700", fontSize: "18px" }}>
          🎫 Support Admin Dashboard
        </div>
        <Link
          to="/"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: "13px",
            padding: "6px 12px",
            border: "1px solid #334155",
            borderRadius: "6px",
          }}
        >
          ← Back to Chat
        </Link>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Tickets", value: stats.total, color: "#1e293b", bg: "#ffffff" },
            { label: "Open", value: stats.open, color: "#d97706", bg: "#fffbeb" },
            { label: "Escalated", value: stats.escalated, color: "#dc2626", bg: "#fef2f2" },
            { label: "Resolved", value: stats.resolved, color: "#16a34a", bg: "#f0fdf4" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: stat.bg,
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              color: "#1e293b",
              cursor: "pointer",
            }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>

          <input
            type="text"
            placeholder="Search by intent or summary..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              outline: "none",
              color: "#1e293b",
            }}
          />
        </div>

        {/* Ticket Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading tickets...
          </div>
        ) : (
          <TicketDashboard tickets={filtered} />
        )}
      </div>
    </div>
  );
}

export default AdminPage;