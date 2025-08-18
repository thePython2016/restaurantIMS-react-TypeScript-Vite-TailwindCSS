import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from django.contrib.auth.models import User

# Create test user
try:
    user = User.objects.create_user('testuser', 'test@example.com', 'testpass123')
    print(f"User created successfully: {user.username}")
except Exception as e:
    print(f"Error creating user: {e}")
