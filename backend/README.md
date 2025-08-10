# Django Backend for React OAuth

This Django backend provides authentication endpoints for your React frontend, including Google OAuth integration.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Django settings
SECRET_KEY=your-django-secret-key-here
DEBUG=True

# JWT settings
JWT_SECRET_KEY=your-jwt-secret-key-here

# Google OAuth settings
GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set the authorized JavaScript origins to include your React app URL (e.g., `http://localhost:3000`)
6. Copy the Client ID and add it to your `.env` file

### 4. Initialize Database

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run the Server

```bash
python manage.py runserver
```

The server will start on `http://127.0.0.1:8000/`

## API Endpoints

### POST /login/
Regular username/password login

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "name": "John Doe"
  }
}
```

### POST /auth/google/
Google OAuth login

**Request:**
```json
{
  "access_token": "google_access_token_here"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user@gmail.com",
    "email": "user@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

## Features

- ✅ Google OAuth integration
- ✅ JWT token authentication
- ✅ CORS support for React frontend
- ✅ User creation/update from Google profile
- ✅ Secure token handling

## Troubleshooting

### 400 Bad Request on Google Login
- Make sure your Google Client ID is correct
- Verify the Google+ API is enabled in Google Cloud Console
- Check that your authorized origins include your React app URL

### CORS Errors
- Ensure your React app URL is in the `CORS_ALLOWED_ORIGINS` list in `settings.py`
- Make sure `django-cors-headers` is installed and configured

### JWT Token Issues
- Verify your `JWT_SECRET_KEY` is set in the `.env` file
- Check that PyJWT is installed correctly 