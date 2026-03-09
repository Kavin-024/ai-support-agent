import os
import uuid
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

messages_collection = db["messages"]
tickets_collection = db["tickets"]

# ── Clear existing seed data ──────────────────────────
tickets_collection.delete_many({})
messages_collection.delete_many({})
print("Cleared existing data...")

# ── Realistic summaries per intent ───────────────────
summaries = {
    "faq": [
        "User asked how to reset their password. Answered from FAQ.",
        "User enquired about refund policy. 30-day policy explained.",
        "User asked how to cancel subscription. Steps provided.",
        "User asked how to update email address. Guided to account settings.",
        "User asked about account verification time. FAQ answer provided.",
        "User asked how to delete their account. Warning and steps given.",
        "User asked how to upgrade subscription. Billing section explained.",
        "User asked about forgotten username. Email login suggested.",
    ],
    "billing": [
        "User reported duplicate charge on invoice. Escalated to billing team.",
        "User payment failed repeatedly. Card details issue suspected.",
        "User requested refund for unused subscription. Ticket raised.",
        "User disputed invoice amount. Escalated for manual review.",
        "User unable to update payment method. Technical team notified.",
    ],
    "technical": [
        "User reported app crashing on login. Bug escalated to tech team.",
        "User unable to access dashboard after update. Issue escalated.",
        "User reported broken page on mobile browser. Dev team notified.",
        "User experiencing slow load times. Infrastructure team alerted.",
    ],
    "complaint": [
        "User frustrated with slow response time. Escalated to manager.",
        "User unhappy with recent service changes. Feedback logged.",
        "User complained about billing transparency. Escalated.",
    ],
}

# ── Intent distribution ───────────────────────────────
intents = (
    ["faq"] * 8 +
    ["billing"] * 5 +
    ["technical"] * 4 +
    ["complaint"] * 3
)
random.shuffle(intents)

# ── Status distribution ───────────────────────────────
statuses = ["resolved"] * 12 + ["escalated"] * 5 + ["open"] * 3
random.shuffle(statuses)

# ── Sample conversations per intent ──────────────────
conversations = {
    "faq": [
        {"role": "user",      "content": "How do I reset my password?"},
        {"role": "assistant", "content": "You can reset your password by clicking Forgot Password on the login page and following the instructions sent to your email."},
        {"role": "user",      "content": "Thank you, that worked!"},
        {"role": "assistant", "content": "Great! Is there anything else I can help you with?"},
    ],
    "billing": [
        {"role": "user",      "content": "I was charged twice this month."},
        {"role": "assistant", "content": "I'm sorry to hear that. Your issue has been escalated to our billing team who will contact you within 24 hours."},
        {"role": "user",      "content": "Okay, please resolve it quickly."},
        {"role": "assistant", "content": "Absolutely. Our team will prioritise your case."},
    ],
    "technical": [
        {"role": "user",      "content": "The app keeps crashing when I log in."},
        {"role": "assistant", "content": "I'm sorry for the trouble. This has been escalated to our technical team who will contact you within 24 hours."},
        {"role": "user",      "content": "It has been happening since yesterday."},
        {"role": "assistant", "content": "Thank you for the context. Our team will investigate immediately."},
    ],
    "complaint": [
        {"role": "user",      "content": "Your service has been terrible lately."},
        {"role": "assistant", "content": "I sincerely apologise for the experience. Your feedback has been escalated to our support manager."},
        {"role": "user",      "content": "I hope this gets resolved soon."},
        {"role": "assistant", "content": "We take this seriously and will follow up with you shortly."},
    ],
}

# ── Insert tickets ────────────────────────────────────
tickets = []
message_docs = []
sessions_with_messages = 0

for i in range(20):
    session_id = str(uuid.uuid4())
    intent = intents[i]
    status = statuses[i]
    summary = random.choice(summaries[intent])
    created_at = datetime.utcnow() - timedelta(days=random.randint(0, 30))

    ticket = {
        "ticket_id": f"TICKET-{str(uuid.uuid4())[:8].upper()}",
        "session_id": session_id,
        "intent": intent,
        "status": status,
        "summary": summary,
        "created_at": created_at,
    }
    tickets.append(ticket)

    # Add messages for first 5 resolved tickets
    if status == "resolved" and sessions_with_messages < 5:
        for j, msg in enumerate(conversations[intent]):
            message_docs.append({
                "session_id": session_id,
                "role": msg["role"],
                "content": msg["content"],
                "timestamp": created_at + timedelta(minutes=j * 2),
            })
        sessions_with_messages += 1

# ── Write to MongoDB ──────────────────────────────────
tickets_collection.insert_many(tickets)
messages_collection.insert_many(message_docs)

print(f"✅ Inserted {len(tickets)} tickets")
print(f"✅ Inserted {len(message_docs)} messages")
print("Seed data ready for demo!")