# 📧 Email Setup Guide for Password Reset

## 🚨 Current Status
- ✅ Django backend configured with Djoser
- ✅ React frontend configured for password reset
- ✅ Email settings added to Django
- ⚠️ Need to configure `.env` file with email credentials

## 🔧 Step 1: Configure Your .env File

Add these lines to your `.env` file in the project root:

```env
# Email Configuration (Gmail Example)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

## 🔑 Step 2: Get Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords" (under 2-Step Verification)
5. Select "Mail" and "Other (Custom name)"
6. Enter "Django App" as the name
7. Copy the 16-character password generated
8. Use this password in your `.env` file

## 🧪 Step 3: Test Email Configuration

Run this command to test your email setup:

```bash
cd backend
python test_email.py
```

## 🚀 Step 4: Start Both Servers

### Backend (Django):
```bash
cd backend
python manage.py runserver
```

### Frontend (React):
```bash
npm run dev
```

## 📧 Step 5: Test Password Reset Flow

1. Go to: `http://localhost:5173/password-reset`
2. Enter your email address
3. Click "Send Reset Link"
4. Check your email for the reset link
5. Click the link to reset your password

## 🔍 Troubleshooting

### If emails don't send:
1. Check your `.env` file has correct credentials
2. Verify you're using an App Password (not regular password)
3. Make sure both servers are running
4. Check the Django console for error messages

### If you get connection errors:
1. Check your internet connection
2. Verify Gmail SMTP settings are correct
3. Make sure 2FA is enabled on your Google account

### Alternative Email Providers:

#### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@outlook.com
EMAIL_HOST_PASSWORD=your-password
```

#### Yahoo:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@yahoo.com
EMAIL_HOST_PASSWORD=your-app-password
```

## 📞 Need Help?

If you're still having issues:
1. Check the Django server console for error messages
2. Verify your `.env` file is in the correct location
3. Make sure you're using the correct email credentials
4. Test with a simple email first before testing password reset
