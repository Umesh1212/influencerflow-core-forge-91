"""
InfluencerFlow AI Platform - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers (will be created)
# from app.routers import auth, campaigns, creators, outreach, payments

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 InfluencerFlow API starting up...")
    yield
    # Shutdown
    print("🛑 InfluencerFlow API shutting down...")

# Create FastAPI app
app = FastAPI(
    title="InfluencerFlow AI Platform API",
    description="Automated influencer campaign management with AI-powered multilingual voice outreach",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "message": "InfluencerFlow AI Platform API",
        "status": "healthy",
        "version": "1.0.0",
        "features": [
            "AI-powered multilingual voice outreach",
            "Automated campaign management",
            "Creator discovery and matching",
            "Real-time performance tracking"
        ]
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": "2025-05-31T17:40:00Z",
        "services": {
            "database": "connected",
            "ai_services": "ready",
            "voice_synthesis": "ready"
        }
    }

# API Routes (to be implemented)
@app.get("/api/v1/test")
async def test_endpoint():
    """Test endpoint for development"""
    return {"message": "API is working!", "endpoint": "test"}

# Include routers when ready
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
# app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"])
# app.include_router(creators.router, prefix="/api/v1/creators", tags=["creators"])
# app.include_router(outreach.router, prefix="/api/v1/outreach", tags=["outreach"])
# app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 