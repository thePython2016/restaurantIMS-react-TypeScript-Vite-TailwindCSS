import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

def test_email():
    try:
        # Test email configuration
        send_mail(
            subject='Password Reset Test',
            message='This is a test email from your Django application.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['test@example.com'],  # Replace with your email
            fail_silently=False,
        )
        print("✅ Email test successful! Check your email.")
    except Exception as e:
        print(f"❌ Email test failed: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your .env file has correct email settings")
        print("2. For Gmail, make sure you're using an App Password")
        print("3. Verify your email credentials are correct")

if __name__ == '__main__':
    test_email()
