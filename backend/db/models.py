from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# request from frontend

class ChatRequest(BaseModel):
    session_id: str
    message: str


# response to frontend

class ChatResponse(BaseModel):
    response: str
    intent: str
    escalated: bool

# store chat messages

class MessageModel(BaseModel):
    session_id: str
    role: str
    content: str
    timestamp: datetime = datetime.utcnow()

# store support tickets

class TicketModel(BaseModel):
    ticket_id: str
    session_id: str
    intent: str
    status: str
    summary: Optional[str] = None
    created_at: datetime = datetime.utcnow()