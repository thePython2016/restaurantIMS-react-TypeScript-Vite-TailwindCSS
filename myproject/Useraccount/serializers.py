from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
    """
    Custom registration serializer that's compatible with the current
    dj-rest-auth and allauth versions.
    """
    
    def save(self, request):
        user = super().save(request)
        return user
    
    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }
    
    def custom_signup(self, request, user):
        # Add any custom signup logic here if needed
        pass
    
    def _has_phone_field(self):
        """
        Add this method to prevent the AttributeError
        """
        return False
