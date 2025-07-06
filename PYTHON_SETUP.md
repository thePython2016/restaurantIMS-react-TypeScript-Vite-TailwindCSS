# Python FastAPI Backend Setup

## 🐍 Python Backend Overview

I've converted your backend from Node.js to **Python** using modern, fast, and production-ready technologies:

- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **JWT** - Authentication
- **MySQL** - Database

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **MySQL Server** (version 8.0 or higher)
3. **pip** (Python package manager)

## 🚀 Quick Setup

### 1. Install Python Dependencies

```bash
# Install all required packages
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your database credentials
nano .env  # or use your preferred editor
```

### 3. Configure Database

```bash
# Connect to MySQL and create database
mysql -u root -p
CREATE DATABASE react_admin_db;
USE react_admin_db;
source database/schema.sql;
exit;
```

### 4. Run the Application

```bash
# Method 1: Using the run script
python run.py

# Method 2: Using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API Server:** http://localhost:8000
- **Interactive Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc

## 📁 Project Structure

```
app/
├── main.py              # FastAPI application entry point
├── core/
│   ├── config.py        # Configuration settings
│   └── security.py      # Security utilities
├── database/
│   └── __init__.py      # Database connection
├── models/
│   └── user.py          # SQLAlchemy models
├── schemas/
│   └── user.py          # Pydantic schemas
└── routers/
    └── auth.py          # Authentication routes
```

## 🔐 Authentication Flow

### Login Process:
1. User submits username/password
2. FastAPI validates credentials against database
3. Password is verified using bcrypt
4. JWT token is generated and returned
5. Token is used for subsequent API calls

### Security Features:
- ✅ **Password Hashing** with bcrypt
- ✅ **JWT Tokens** for authentication
- ✅ **CORS Protection**
- ✅ **Input Validation** with Pydantic
- ✅ **Rate Limiting** (can be added)
- ✅ **Role-based Access Control**

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Health Check
- `GET /api/health` - API health status

## 🧪 Testing the API

### 1. Using the Interactive Docs
Visit http://localhost:8000/docs to see the Swagger UI

### 2. Using curl
```bash
# Health check
curl http://localhost:8000/api/health

# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 3. Using Python requests
```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"username": "admin", "password": "admin123"}
)
token = response.json()["access_token"]

# Use token for authenticated requests
headers = {"Authorization": f"Bearer {token}"}
user_response = requests.get(
    "http://localhost:8000/api/auth/me",
    headers=headers
)
```

## 🔧 Development

### Adding New Models
1. Create model in `app/models/`
2. Create schema in `app/schemas/`
3. Create router in `app/routers/`
4. Add router to `app/main.py`

### Database Migrations
```bash
# Install Alembic (already in requirements.txt)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Add new table"

# Apply migration
alembic upgrade head
```

### Environment Variables
Key variables in `.env`:
```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# JWT
JWT_SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

## 🚀 Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🐛 Troubleshooting

### Common Issues:

1. **Import Errors**
   ```bash
   # Make sure you're in the project root
   export PYTHONPATH="${PYTHONPATH}:$(pwd)"
   ```

2. **Database Connection**
   ```bash
   # Check MySQL is running
   sudo systemctl status mysql
   
   # Test connection
   mysql -u root -p -h localhost
   ```

3. **Port Already in Use**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   
   # Kill process
   kill -9 <PID>
   ```

4. **Missing Dependencies**
   ```bash
   # Reinstall requirements
   pip install -r requirements.txt --force-reinstall
   ```

## 📊 Performance

FastAPI provides excellent performance:
- **Async/await** support
- **Automatic API documentation**
- **Type checking** with Pydantic
- **High performance** with uvicorn

## 🔗 Integration with React Frontend

The Python backend is designed to work seamlessly with your React frontend:

1. **CORS** is configured for React development servers
2. **JWT tokens** work with your existing auth context
3. **API endpoints** match your frontend expectations
4. **Error handling** provides consistent responses

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
- [Python JWT](https://python-jose.readthedocs.io/)

## 🎯 Next Steps

1. **Test the API** using the interactive docs
2. **Connect your React frontend** to the Python backend
3. **Add more models** (Staff, Customers, Menu, etc.)
4. **Implement additional features** as needed

Your Python backend is now ready to power your React admin dashboard! 🚀 