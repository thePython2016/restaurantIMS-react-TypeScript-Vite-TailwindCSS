#!/usr/bin/env python3
"""
FastAPI Application Runner
"""
import uvicorn
from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    print("🚀 Starting React Admin Dashboard API...")
    print(f"📊 Environment: {settings.ENVIRONMENT}")
    print(f"🌐 Server: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 API Docs: http://{settings.HOST}:{settings.PORT}/docs")
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    ) 