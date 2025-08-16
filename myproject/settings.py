# import os
# from pathlib import Path
# import environ
# import warnings

# # Initialize environment variables
# env = environ.Env(
#     DEBUG=(bool, False)
# )
# environ.Env.read_env()  # Reads .env file in the project root

# BASE_DIR = Path(__file__).resolve().parent.parent

# # Security
# SECRET_KEY = env('SECRET_KEY')
# DEBUG = env('DEBUG')
# ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# # CORS
# CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
#     "http://localhost:5173",
#     "http://127.0.0.1:8000",
# ])
# CORS_ALLOW_CREDENTIALS = True

# # Applications
# INSTALLED_APPS = [
#     'corsheaders',
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'Customers',
#     'Items',
#     'Menus',
#     'OrderItem',
#     'Staffs',
#     'Orders',
#     'Useraccount',
#     'rest_framework',
#     'rest_framework.authtoken',
#     'django.contrib.sites',
#     'allauth',
#     'allauth.account',
#     'allauth.socialaccount',
#     'allauth.socialaccount.providers.google',
#     'djoser',
#     'dj_rest_auth',
#     'dj_rest_auth.registration',
# ]

# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
#     'allauth.account.middleware.AccountMiddleware',
# ]

# ROOT_URLCONF = 'myproject.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [BASE_DIR / 'templates'],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'myproject.wsgi.application'

# # MySQL Configuration from .env
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': env('DB_NAME'),
#         'USER': env('DB_USER'),
#         'PASSWORD': env('DB_PASSWORD'),
#         'HOST': env('DB_HOST', default='localhost'),
#         'PORT': env('DB_PORT', default='3306'),
#     }
# }

# # Password validation
# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# ]

# # Localization
# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True

# # Static files
# STATIC_URL = 'static/'

# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # REST Framework
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#         'rest_framework.authentication.SessionAuthentication',
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.AllowAny',
#     ],
# }

# # Email Configuration - Using Gmail SMTP
# EMAIL_BACKEND = env('EMAIL_BACKEND')
# EMAIL_HOST = env('EMAIL_HOST')
# EMAIL_PORT = env.int('EMAIL_PORT')
# EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS')
# EMAIL_HOST_USER = env('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
# DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

# # Djoser settings - Simplified for development
# DJOSER = {
#     'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm?uid={uid}&token={token}',
#     'SEND_ACTIVATION_EMAIL': False,
#     'SEND_CONFIRMATION_EMAIL': False,
#     'PASSWORD_RESET_CONFIRM_RETYPE': False,
#     'LOGOUT_ON_PASSWORD_CHANGE': False,
#     'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
#     'PERMISSIONS': {
#         'password_reset': ['rest_framework.permissions.AllowAny'],
#         'password_reset_confirm': ['rest_framework.permissions.AllowAny'],
#     },
# }

# SITE_ID = 1
# SITE_NAME = 'ReactLife'
# DOMAIN = 'localhost:5173'
# PROTOCOL = 'http'

# AUTHENTICATION_BACKENDS = (
#     'django.contrib.auth.backends.ModelBackend',
#     'allauth.account.auth_backends.AuthenticationBackend',
# )

# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
#         'SCOPE': ['profile', 'email'],
#         'AUTH_PARAMS': {'access_type': 'online'},
#         'OAUTH_PKCE_ENABLED': True,
#     }
# }

# # JWT Settings
# from datetime import timedelta
# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
#     'ROTATE_REFRESH_TOKENS': False,
#     'BLACKLIST_AFTER_ROTATION': True,
#     'UPDATE_LAST_LOGIN': False,
#     'ALGORITHM': 'HS256',
#     'SIGNING_KEY': SECRET_KEY,
#     'VERIFYING_KEY': None,
#     'AUDIENCE': None,
#     'ISSUER': None,
#     'AUTH_HEADER_TYPES': ('Bearer',),
#     'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
#     'USER_ID_FIELD': 'id',
#     'USER_ID_CLAIM': 'user_id',
#     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
#     'TOKEN_TYPE_CLAIM': 'token_type',
#     'JTI_CLAIM': 'jti',
# }

# REST_AUTH = {
#     'SIGNUP_FIELDS': {
#         'username': {'required': True},
#         'email': {'required': True},
#         'password1': {'required': True},
#         'password2': {'required': True}
#     },
#     'USE_JWT': True,
#     'JWT_AUTH_COOKIE': 'access_token',
#     'JWT_AUTH_REFRESH_COOKIE': 'refresh_token',
#     'JWT_AUTH_HTTPONLY': True,
#     'JWT_AUTH_SECURE': False,
#     'JWT_AUTH_SAMESITE': 'Lax',
#     'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
# }

# ACCOUNT_LOGIN_METHODS = {'email'}
# ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
# ACCOUNT_EMAIL_VERIFICATION = 'none'
# ACCOUNT_UNIQUE_EMAIL = True
# ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
# ACCOUNT_EMAIL_SUBJECT_PREFIX = '[Your Site] '

# warnings.filterwarnings(
#     'ignore',
#     message='app_settings.USERNAME_REQUIRED is deprecated',
#     category=UserWarning,
#     module='dj_rest_auth.registration.serializers'
# )
# warnings.filterwarnings(
#     'ignore',
#     message='app_settings.EMAIL_REQUIRED is deprecated',
#     category=UserWarning,
#     module='dj_rest_auth.registration.serializers'
# )

# SOCIALACCOUNT_AUTO_SIGNUP = True
# SOCIALACCOUNT_EMAIL_REQUIRED = True
# SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'




import os
from pathlib import Path
import environ
import warnings

# Initialize environment variables
env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env()  # Reads .env file in the project root

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# CORS
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    "http://localhost:5173",
    "http://127.0.0.1:8000",
])
CORS_ALLOW_CREDENTIALS = True

# Applications
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Customers',
    'Items',
    'Menus',
    'OrderItem',
    'Staffs',
    'Orders',
    'Useraccount',
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'djoser',
    'dj_rest_auth',
    'dj_rest_auth.registration',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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

WSGI_APPLICATION = 'myproject.wsgi.application'

# MySQL Configuration from .env
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

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Localization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# Email Configuration - Using Gmail SMTP
EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
EMAIL_USE_SSL = env.bool('EMAIL_USE_SSL', default=False)
EMAIL_TIMEOUT = env.int('EMAIL_TIMEOUT', default=30)
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

# Djoser settings - Simplified for development
DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm?uid={uid}&token={token}',
    'SEND_ACTIVATION_EMAIL': False,
    'SEND_CONFIRMATION_EMAIL': False,
    'PASSWORD_RESET_CONFIRM_RETYPE': False,
    'LOGOUT_ON_PASSWORD_CHANGE': False,
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
    'DOMAIN': 'localhost:5173',
    'SITE_NAME': 'ReactLife',
    'PERMISSIONS': {
        'user': ['rest_framework.permissions.AllowAny'],
        'user_list': ['rest_framework.permissions.AllowAny'],
        'password_reset': ['rest_framework.permissions.AllowAny'],
        'password_reset_confirm': ['rest_framework.permissions.AllowAny'],
        'set_password': ['rest_framework.permissions.AllowAny'],
        'activation': ['rest_framework.permissions.AllowAny'],
        'resend_activation': ['rest_framework.permissions.AllowAny'],
        'username_reset': ['rest_framework.permissions.AllowAny'],
        'username_reset_confirm': ['rest_framework.permissions.AllowAny'],
        'set_username': ['rest_framework.permissions.AllowAny'],
        'user_create': ['rest_framework.permissions.AllowAny'],
        'user_delete': ['rest_framework.permissions.AllowAny'],
        'user_me': ['rest_framework.permissions.AllowAny'],
    },
    'SERIALIZERS': {
        'password_reset': 'djoser.serializers.PasswordResetSerializer',
        'password_reset_confirm': 'djoser.serializers.PasswordResetConfirmSerializer',
    },
    'HIDE_USERS': False,
    'TOKEN_MODEL': None,
}

SITE_ID = 1
SITE_NAME = 'ReactLife'
DOMAIN = 'localhost:5173'
PROTOCOL = 'http'

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'OAUTH_PKCE_ENABLED': True,
    }
}

# JWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

REST_AUTH = {
    'SIGNUP_FIELDS': {
        'username': {'required': True},
        'email': {'required': True},
        'password1': {'required': True},
        'password2': {'required': True}
    },
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'access_token',
    'JWT_AUTH_REFRESH_COOKIE': 'refresh_token',
    'JWT_AUTH_HTTPONLY': True,
    'JWT_AUTH_SECURE': False,
    'JWT_AUTH_SAMESITE': 'Lax',
    'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
}

ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_SUBJECT_PREFIX = '[Your Site] '

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

SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'


