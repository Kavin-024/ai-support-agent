import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime


# Credentials

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

messages_collection = db["messages"]
tickets_collection = db["tickets"]



def save_message(session_id, role, content):
    message = {
        "session_id": session_id,
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow()
    }
    messages_collection.insert_one(message)


def get_session_messages(session_id):
    messages = list(messages_collection.find({"session_id": session_id}))
    return messages


def create_ticket(session_id, intent):
    ticket = {
        "ticket_id": f"TICKET-{session_id}",
        "session_id": session_id,
        "intent": intent,
        "status": "open",
        "created_at": datetime.utcnow()
    }

    tickets_collection.insert_one(ticket)


def get_all_tickets():
    tickets = list(
        tickets_collection.find().sort("created_at", -1).limit(100)
    )
    for ticket in tickets:
        ticket["_id"] = str(ticket["_id"])
    return tickets