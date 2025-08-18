import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

def test_email():
    try:
        print("🧪 Testing email configuration...")
        print(f"📧 From: {settings.DEFAULT_FROM_EMAIL}")
        print(f"🔧 SMTP Host: {settings.EMAIL_HOST}")
        print(f"🔧 SMTP Port: {settings.EMAIL_PORT}")
        
        # Test email configuration
        send_mail(
            subject='Password Reset Test - Django App',
            message='This is a test email from your Django application. If you receive this, your email configuration is working correctly!',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['infonet20th@gmail.com'],  # Send to yourself
            fail_silently=False,
        )
        print("✅ Email test successful! Check your email inbox.")
        print("📧 Email sent to: infonet20th@gmail.com")
    except Exception as e:
        print(f"❌ Email test failed: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your .env file has correct email settings")
        print("2. For Gmail, make sure you're using an App Password")
        print("3. Verify your email credentials are correct")
        print("4. Check if 2FA is enabled on your Google account")

if __name__ == '__main__':
    test_email()
