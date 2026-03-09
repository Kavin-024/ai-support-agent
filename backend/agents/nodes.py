from langchain_groq import ChatGroq
from agents.state import AgentState
from data.faqs import FAQS
from dotenv import load_dotenv

load_dotenv()


# Initialize LLM
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)

# Valid intents — used for validation
VALID_INTENTS = {"greeting", "faq", "billing", "technical", "complaint", "goodbye"}


# -------------------------------
# 1️⃣ Intent Classifier Node
# -------------------------------
def classify_intent(state: AgentState):

    user_message = state["user_message"]

    prompt = f"""
    You are an intent classifier for a customer support system.

    Classify the user message into exactly one of these intents:

    - greeting   → user is saying hello or starting a conversation
                   Example: "Hi", "Hello", "Hey there"

    - faq        → user is asking a common question about account, password,
                   billing info, refund policy, subscription, email, or general how-to
                   Example: "how do I reset my password?", "what is your refund policy?",
                   "how do I cancel my subscription?", "how do I update my email?"

    - billing    → user has a payment problem, wrong charge, or invoice dispute
                   Example: "I was charged twice", "my payment failed", "I need a refund"

    - technical  → user has a bug, app error, or something is not working
                   Example: "the app is crashing", "I cannot log in", "the page is broken"

    - complaint  → user is angry or frustrated about service or experience
                   Example: "this is terrible service", "I am very unhappy", "you guys are awful"

    - goodbye    → user is ending the conversation
                   Example: "thanks bye", "goodbye", "that's all"

    User message: {user_message}

    Reply with only the intent word. Nothing else.
    """

    response = llm.invoke(prompt)
    detected = response.content.strip().lower()


    state["intent"] = detected if detected in VALID_INTENTS else "faq"

    return state

# -------------------------------
# 2️⃣ Router Function (not a node — used by conditional edge)
# -------------------------------
def route_intent(state: AgentState):

    intent = state["intent"]

    # greeting and goodbye go to faq_agent for a friendly response
    # billing, technical, complaint go straight to escalation
    if intent in ("faq", "greeting", "goodbye"):
        return "faq_agent"

    return "escalation_agent"


# -------------------------------
# 3️⃣ FAQ Agent Node
# -------------------------------
def faq_agent(state: AgentState):

    user_message = state["user_message"]
    intent = state["intent"]

    # Handle greeting and goodbye without hitting the FAQ list
    if intent == "greeting":
        state["faq_answer"] = "Hello! I am your AI support assistant. How can I help you today?"
        state["final_response"] = state["faq_answer"]
        return state

    if intent == "goodbye":
        state["faq_answer"] = "Thank you for contacting support. Have a great day!"
        state["final_response"] = state["faq_answer"]
        return state

    # Build FAQ text for the prompt
    faq_text = "\n".join(
        [f"Q: {faq['question']}\nA: {faq['answer']}" for faq in FAQS]
    )

    # Include last 4 conversation messages for context if available
    history_text = ""
    if state.get("conversation_history"):
        recent = state["conversation_history"][-4:]
        history_text = "\n".join(
            [f"{m['role'].capitalize()}: {m['content']}" for m in recent]
        )

    prompt = f"""
    You are a helpful customer support assistant.

    Previous conversation:
    {history_text if history_text else "No previous conversation."}

    FAQ list:
    {faq_text}

    User question: {user_message}

    Instructions:
    - If the user question matches or is related to any FAQ, return that FAQ answer directly.
    - If the question does not match any FAQ at all, reply with exactly one word: UNKNOWN
    - Do not add any extra explanation. Just return the answer or UNKNOWN.
    """

    response = llm.invoke(prompt)
    answer = response.content.strip()

    if answer.upper() == "UNKNOWN":
        # FAQ could not answer — escalate with a proper message
        state["escalated"] = True
        state["faq_answer"] = ""
        state["final_response"] = (
            "I was not able to find an answer for your question. "
            "Your issue has been escalated to a human support agent "
            "who will contact you shortly."
        )
    else:
        state["faq_answer"] = answer
        state["final_response"] = answer

    return state


# -------------------------------
# 4️⃣ Escalation Node
# -------------------------------
def escalation_agent(state: AgentState):

    state["escalated"] = True

    state["final_response"] = (
        "Your issue has been escalated to a human support agent. "
        "Our team will contact you within 24 hours."
    )

    return state


# -------------------------------
# 5️⃣ Summary Node
# -------------------------------
def summary_agent(state: AgentState):

    # final_response is always set by this point from either
    # faq_agent or escalation_agent — this is just a safety fallback
    if not state.get("final_response"):
        state["final_response"] = (
            "Thank you for contacting support. "
            "A team member will follow up with you shortly."
        )

    return state

