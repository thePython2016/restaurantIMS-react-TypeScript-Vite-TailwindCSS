#!/usr/bin/env python3
"""
<<<<<<< HEAD
Django Application Runner
"""
import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).resolve().parent / 'backend'
sys.path.insert(0, str(backend_dir))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

if __name__ == "__main__":
    print("🚀 Starting Django Backend...")
    print("🌐 Server: http://127.0.0.1:8000")
    print("📚 Admin: http://127.0.0.1:8000/admin")
    
    # Setup Django
    django.setup()
    
    # Run Django development server
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver', '127.0.0.1:8000']) 
=======
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
>>>>>>> df12485cdc20b355d9aa4f7bf4cb880c5fedca9b
