const BASE_URL = "http://ai-support-agent-production-e967.up.railway.app";

// Generate a random session ID for each new chat
export function generateSessionId() {
  return Math.random().toString(36).substring(2, 10);
}

// Send a message to the backend
export async function sendMessage(sessionId, message) {
  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
    // returns { response, intent, escalated }

  } catch (error) {
    throw new Error("Failed to send message: " + error.message);
  }
}

// Get all tickets for admin dashboard
export async function getAllTickets() {
  try {
    const response = await fetch(`${BASE_URL}/api/tickets`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    throw new Error("Failed to fetch tickets: " + error.message);
  }
}