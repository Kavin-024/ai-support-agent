from typing import TypedDict, List


class AgentState(TypedDict):
    session_id: str
    user_message: str
    conversation_history: List[dict]

    intent: str
    faq_answer: str
    escalated: bool

    final_response: str