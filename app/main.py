from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn
from datetime import datetime
import os
from dotenv import load_dotenv

# Import routers
from app.routers import auth, staff, customers, menu, orders, reports
from app.database import engine, Base
from app.core.config import settings

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting FastAPI application...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down FastAPI application...")

# Create FastAPI app
app = FastAPI(
    title="React Admin Dashboard API",
    description="Backend API for React Admin Dashboard with MySQL database",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure properly for production
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(staff.router, prefix="/api/staff", tags=["Staff Management"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customer Management"])
app.include_router(menu.router, prefix="/api/menu", tags=["Menu Management"])
app.include_router(orders.router, prefix="/api/orders", tags=["Order Management"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "React Admin Dashboard API",
        "docs": "/docs",
        "health": "/api/health"
    }

# 404 handler
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "success": False,
        "message": "API endpoint not found",
        "path": str(request.url.path)
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 