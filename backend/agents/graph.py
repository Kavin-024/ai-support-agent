from langgraph.graph import StateGraph, END

from agents.state import AgentState
from agents.nodes import (
    classify_intent,
    route_intent,
    faq_agent,
    escalation_agent,
    summary_agent
)

workflow = StateGraph(AgentState)

workflow.add_node("intent_classifier", classify_intent)
workflow.add_node("faq_agent", faq_agent)
workflow.add_node("escalation_agent", escalation_agent)
workflow.add_node("summary_agent", summary_agent)

workflow.set_entry_point("intent_classifier")

workflow.add_conditional_edges(
    "intent_classifier",
    route_intent,
    {
        "faq_agent": "faq_agent",
        "escalation_agent": "escalation_agent",
    },
)

workflow.add_edge("faq_agent", "summary_agent")
workflow.add_edge("escalation_agent", "summary_agent")

workflow.add_edge("summary_agent", END)

graph = workflow.compile()