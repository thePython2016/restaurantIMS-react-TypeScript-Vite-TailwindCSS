import os
from pathlib import Path
import environ
import warnings
from django.utils.translation import gettext_lazy as _
from decouple import config

# -------------------------
# Paths
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------
# Environment Variables
# -------------------------
env = environ.Env(DEBUG=(bool, False))
env_file = os.path.join(BASE_DIR, '.env')

if not os.path.exists(env_file):
    raise FileNotFoundError(f"⚠️ .env file not found at {env_file}")

env.read_env(env_file)

# -------------------------
# Security
# -------------------------
SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# -------------------------
# CORS
# -------------------------
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    "http://localhost:5173",
    "http://127.0.0.1:8000",
])
CORS_ALLOW_CREDENTIALS = True

# -------------------------
# Applications
# -------------------------
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Your apps
    'Customers',
    'Items',
    'Menus',
    'OrderItem',
    'Staffs',
    'Orders',
    'Useraccount',
    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'djoser',
]

# -------------------------
# Middleware
# -------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

# -------------------------
# URL / WSGI
# -------------------------
ROOT_URLCONF = 'myproject.urls'
WSGI_APPLICATION = 'myproject.wsgi.application'

# -------------------------
# Templates
# -------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# -------------------------
# Database
# -------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST', default='localhost'),
        'PORT': env('DB_PORT', default='3306'),
    }
}

# -------------------------
# Password validation
# -------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# -------------------------
# Localization
# -------------------------
LANGUAGE_CODE = 'en'
LANGUAGES = [
    ('en', _('English')),
    ('fr', _('French')),
    ('sw', _('Swahili')),
]
LOCALE_PATHS = [BASE_DIR / 'locale']
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# -------------------------
# Static files
# -------------------------
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -------------------------
# REST Framework
# -------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}

# -------------------------
# Email Configuration (SendGrid SMTP - Single Sender)
# -------------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apikey'  # This is literally 'apikey'
EMAIL_HOST_PASSWORD = config('SENDGRID_API_KEY', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='infonet20th@gmail.com')
SERVER_EMAIL = config('SERVER_EMAIL', default='infonet20th@gmail.com')

# -------------------------
# Site Configuration
# -------------------------
SITE_ID = 1
SITE_NAME = config('SITE_NAME', default='ReactLife')
DOMAIN = config('FRONTEND_DOMAIN', default='localhost:5173')

# -------------------------
# Djoser Configuration
# -------------------------
DJOSER = {
    'DOMAIN': DOMAIN,
    'SITE_NAME': SITE_NAME,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'EMAIL': {
        'activation': 'djoser.email.ActivationEmail',
        'confirmation': 'djoser.email.ConfirmationEmail',
        'password_reset': 'djoser.email.PasswordResetEmail',
        'password_changed_confirmation': 'djoser.email.PasswordChangedConfirmationEmail',
    },
}

# -------------------------
# Sites Framework
# -------------------------
SITE_ID = 1

# -------------------------
# Authentication Backends
# -------------------------
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

# -------------------------
# Google OAuth
# -------------------------
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'OAUTH_PKCE_ENABLED': True,
    }
}

# -------------------------
# dj-rest-auth config
# -------------------------
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'access_token',
    'JWT_AUTH_REFRESH_COOKIE': 'refresh_token',
    'JWT_AUTH_HTTPONLY': True,
    'JWT_AUTH_SECURE': False,  # Change to True in production
    'JWT_AUTH_SAMESITE': 'Lax',
    'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
}

# -------------------------
# allauth config
# -------------------------
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "username*", "password1*", "password2*"]

# -------------------------
# Suppress warnings
# -------------------------
warnings.filterwarnings(
    'ignore',
    message='app_settings.USERNAME_REQUIRED is deprecated',
    category=UserWarning,
    module='dj_rest_auth.registration.serializers'
)
warnings.filterwarnings(
    'ignore',
    message='app_settings.EMAIL_REQUIRED is deprecated',
    category=UserWarning,
    module='dj_rest_auth.registration.serializers'
)

# -------------------------
# Socialaccount config
# -------------------------
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'