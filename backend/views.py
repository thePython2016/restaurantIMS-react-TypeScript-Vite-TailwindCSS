from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.contrib.auth import login
import json
import requests
import jwt
from datetime import datetime, timedelta
import os
import urllib3
import warnings

# Suppress SSL warnings for development
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# You'll need to set these in your Django settings
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', 'your-google-client-id')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')

@csrf_exempt
@require_http_methods(["POST"])
def google_auth(request):
    """
    Handle Google OAuth authentication
    Expects: {"access_token": "google_access_token"}
    Returns: {"access_token": "jwt_token", "user": {...}}
    """
    try:
        data = json.loads(request.body)
        google_access_token = data.get('access_token')
        
        if not google_access_token:
            return JsonResponse({
                'error': 'Access token is required'
            }, status=400)
        
        # Verify the token with Google
        try:
            google_response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {google_access_token}'},
                timeout=10,
                verify=True  # Try with SSL verification first
            )
        except requests.exceptions.SSLError:
            # If SSL fails, try without verification (for development)
            google_response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {google_access_token}'},
                timeout=10,
                verify=False
            )
        except requests.exceptions.RequestException as e:
            return JsonResponse({
                'error': f'Failed to verify Google token: {str(e)}'
            }, status=500)
        
        if google_response.status_code != 200:
            return JsonResponse({
                'error': 'Invalid Google access token'
            }, status=400)
        
        user_info = google_response.json()
        email = user_info.get('email')
        name = user_info.get('name', '')
        picture = user_info.get('picture', '')
        
        if not email:
            return JsonResponse({
                'error': 'Email not provided by Google'
            }, status=400)
        
        # Get or create user
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                'email': email,
                'first_name': name.split()[0] if name else '',
                'last_name': ' '.join(name.split()[1:]) if name and len(name.split()) > 1 else '',
            }
        )
        
        # Update user info if not newly created
        if not created:
            user.email = email
            if name:
                user.first_name = name.split()[0]
                user.last_name = ' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
            user.save()
        
        # Create JWT token
        payload = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(days=7),  # 7 days expiry
            'iat': datetime.utcnow()
        }
        
        jwt_token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
        
        # Return success response
        return JsonResponse({
            'access_token': jwt_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'name': f"{user.first_name} {user.last_name}".strip(),
                'picture': picture
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """
    Handle regular username/password login
    Expects: {"username": "user", "password": "pass"}
    Returns: {"access": "jwt_token", "user": {...}}
    """
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({
                'error': 'Username and password are required'
            }, status=400)
        
        # Authenticate user
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user is None:
            return JsonResponse({
                'error': 'Invalid credentials'
            }, status=401)
        
        # Create JWT token
        payload = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(days=7),
            'iat': datetime.utcnow()
        }
        
        jwt_token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
        
        return JsonResponse({
            'access': jwt_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'name': f"{user.first_name} {user.last_name}".strip()
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'Server error: {str(e)}'
        }, status=500) 