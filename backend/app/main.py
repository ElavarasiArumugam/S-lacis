from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import breeding
from app.routers import production
from app.routers import animals
from app.routers import alerts
from app.routers import analytics



# Database imports
from app.database import engine
from app import models

# Router imports
from app.routers import auth, animals, chatbot, health

# Create tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="S-LACIS API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(animals.router)
app.include_router(chatbot.router)
app.include_router(health.router)
app.include_router(breeding.router)
app.include_router(production.router)
app.include_router(alerts.router)
# Root route
@app.get("/")
def root():
    return {
        "status": "online",
        "message": "S-LACIS Backend is running!"
    }
app.include_router(analytics.router)