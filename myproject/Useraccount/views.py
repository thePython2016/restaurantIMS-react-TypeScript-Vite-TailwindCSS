from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        if not current_password or not new_password or not confirm_password:
            return Response({
                'error': 'All fields are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({
                'error': 'New password and confirm password do not match'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        
        if not check_password(current_password, user.password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.password = make_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# GOOGLE AUTH
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from allauth.socialaccount.models import SocialAccount
from rest_framework_simplejwt.tokens import RefreshToken
import requests

# Test endpoint for debugging
@api_view(['POST'])
def test_google_auth(request):
    """Test endpoint to debug Google auth issues"""
    return Response({
        'message': 'Test endpoint working',
        'received_data': request.data,
        'headers': dict(request.headers)
    })

User = get_user_model()

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    
    def post(self, request, *args, **kwargs):
        # Debug: Print request data
        print("Request data:", request.data)
        print("Request headers:", request.headers)
        
        access_token = request.data.get('access_token')
        
        if not access_token:
            print("No access token provided")
            return Response(
                {'error': 'Access token is required', 'received_data': request.data}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            print(f"Making request to Google with token: {access_token[:20]}...")
            
            # Get user info from Google
            google_response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            
            print(f"Google response status: {google_response.status_code}")
            print(f"Google response: {google_response.text}")
            
            google_user_info = google_response.json()
            
            if 'error' in google_user_info:
                print(f"Google API error: {google_user_info}")
                return Response(
                    {'error': 'Invalid access token', 'google_error': google_user_info}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            email = google_user_info.get('email')
            if not email:
                print("No email in Google response")
                return Response(
                    {'error': 'Email not provided by Google', 'google_data': google_user_info}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print(f"Processing user with email: {email}")
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
                print(f"Existing user found: {user.username}")
            except User.DoesNotExist:
                # Create new user
                username = email.split('@')[0]  # Use email prefix as username
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=google_user_info.get('given_name', ''),
                    last_name=google_user_info.get('family_name', ''),
                    password=None  # No password for social login
                )
                user.set_unusable_password()
                user.save()
                print(f"New user created: {user.username}")
            
            # Create or get social account
            social_account, created = SocialAccount.objects.get_or_create(
                user=user,
                provider='google',
                defaults={
                    'uid': google_user_info.get('id'),
                    'extra_data': google_user_info
                }
            )
            
            if created:
                print(f"Social account created for user: {user.username}")
            else:
                print(f"Social account already exists for user: {user.username}")
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }
            
            print(f"Successfully generated tokens for user: {user.username}")
            return Response(response_data)
            
        except Exception as e:
            print(f"Exception occurred: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )