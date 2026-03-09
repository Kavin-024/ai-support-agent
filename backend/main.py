from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router  



app = FastAPI(title="AI Support Agent")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(router)  

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ai-support-agent"
    }