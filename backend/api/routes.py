from fastapi import APIRouter
from agents.graph import graph
from agents.state import AgentState
from db.models import ChatRequest, ChatResponse
from db.mongodb import save_message, get_session_messages, create_ticket,  get_all_tickets

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    raw_history = get_session_messages(request.session_id)
    conversation_history = [
        {"role": m["role"], "content": m["content"]}
        for m in raw_history
    ]

    state: AgentState = {
        "session_id": request.session_id,
        "user_message": request.message,
        "conversation_history": conversation_history,
        "intent": "",
        "faq_answer": "",
        "escalated": False,
        "final_response": ""
    }

    result = graph.invoke(state)

    save_message(request.session_id, "user", request.message)
    save_message(request.session_id, "assistant", result["final_response"])
    create_ticket(request.session_id, result["intent"])

    return ChatResponse(
        response=result["final_response"],
        intent=result["intent"],
        escalated=result["escalated"]
    )

@router.get("/api/tickets")
def tickets():
    return get_all_tickets()