# import os
# from pathlib import Path
# import environ
# import warnings
# from django.utils.translation import gettext_lazy as _

# # -------------------------
# # Paths
# # -------------------------
# BASE_DIR = Path(__file__).resolve().parent.parent

# # -------------------------
# # Environment Variables
# # -------------------------
# env = environ.Env(DEBUG=(bool, False))
# env_file = os.path.join(BASE_DIR, '.env')

# if not os.path.exists(env_file):
#     raise FileNotFoundError(f"⚠️ .env file not found at {env_file}")

# env.read_env(env_file)

# # -------------------------
# # Security
# # -------------------------
# SECRET_KEY = env('SECRET_KEY')
# DEBUG = env('DEBUG')
# ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# # -------------------------
# # CORS
# # -------------------------
# CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
#     "http://localhost:5173",
#     "http://127.0.0.1:8000",
# ])
# CORS_ALLOW_CREDENTIALS = True

# # -------------------------
# # Applications
# # -------------------------
# INSTALLED_APPS = [
#     'corsheaders',
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     # Your apps
#     'Customers',
#     'Items',
#     'Menus',
#     'OrderItem',
#     'Staffs',
#     'Orders',
#     'Useraccount',
#     # Third-party
#     'rest_framework',
#     'rest_framework.authtoken',
#     'django.contrib.sites',
#     'allauth',
#     'allauth.account',
#     'allauth.socialaccount',
#     'allauth.socialaccount.providers.google',
#     'dj_rest_auth',
#     'dj_rest_auth.registration',
# ]

# # -------------------------
# # Middleware
# # -------------------------
# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.locale.LocaleMiddleware',  # NEW for translations
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
#     'allauth.account.middleware.AccountMiddleware',
# ]

# # -------------------------
# # URL / WSGI
# # -------------------------
# ROOT_URLCONF = 'myproject.urls'
# WSGI_APPLICATION = 'myproject.wsgi.application'

# # -------------------------
# # Templates
# # -------------------------
# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
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

# # -------------------------
# # Database
# # -------------------------
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

# # -------------------------
# # Password validation
# # -------------------------
# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# ]

# # -------------------------
# # Localization
# # -------------------------
# LANGUAGE_CODE = 'en'
# LANGUAGES = [
#     ('en', _('English')),
#     ('fr', _('French')),
#     ('sw', _('Swahili')),  # Example extra language
# ]
# LOCALE_PATHS = [BASE_DIR / 'locale']
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_L10N = True
# USE_TZ = True

# # -------------------------
# # Static files
# # -------------------------
# STATIC_URL = 'static/'
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # -------------------------
# # REST Framework
# # -------------------------
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#         'rest_framework.authentication.SessionAuthentication',
#     ],
# }

# # -------------------------
# # Email
# # -------------------------
# # EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
# EMAIL_HOST = env('EMAIL_HOST', default='')
# EMAIL_PORT = env('EMAIL_PORT', default=587)
# EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
# EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')
# EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
# DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='')

# # -------------------------
# # Djoser
# # -------------------------
# DJOSER = {
#     'PASSWORD_RESET_CONFIRM_URL': 'password-reset-confirm/{uid}/{token}',
#     'SEND_PASSWORD_RESET_EMAIL': True,
#     'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': True,
#     'EMAIL': {
#         'password_reset': 'djoser.email.PasswordResetEmail',
#     },
#     'SERIALIZERS': {},
# }

# # -------------------------
# # Sites Framework
# # -------------------------
# SITE_ID = 1

# # -------------------------
# # Authentication Backends
# # -------------------------
# AUTHENTICATION_BACKENDS = (
#     'django.contrib.auth.backends.ModelBackend',
#     'allauth.account.auth_backends.AuthenticationBackend',
# )

# # -------------------------
# # Google OAuth
# # -------------------------
# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
#         'SCOPE': ['profile', 'email'],
#         'AUTH_PARAMS': {'access_type': 'online'},
#         'OAUTH_PKCE_ENABLED': True,
#     }
# }

# # -------------------------
# # dj-rest-auth config
# # -------------------------
# REST_AUTH = {
#     'USE_JWT': True,
#     'JWT_AUTH_COOKIE': 'access_token',
#     'JWT_AUTH_REFRESH_COOKIE': 'refresh_token',
#     'JWT_AUTH_HTTPONLY': True,
#     'JWT_AUTH_SECURE': False,  # Change to True in production
#     'JWT_AUTH_SAMESITE': 'Lax',
#     'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
# }

# # -------------------------
# # allauth config
# # -------------------------
# ACCOUNT_LOGIN_METHODS = {"email"}
# ACCOUNT_SIGNUP_FIELDS = ["email*", "username*", "password1*", "password2*"]

# # -------------------------
# # Suppress warnings
# # -------------------------
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

# # -------------------------
# # Socialaccount config
# # -------------------------
# SOCIALACCOUNT_AUTO_SIGNUP = True
# SOCIALACCOUNT_EMAIL_REQUIRED = True
# SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'



import os
from pathlib import Path
import environ
import warnings
from django.utils.translation import gettext_lazy as _

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
]

# -------------------------
# Middleware
# -------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',  # NEW for translations
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
    ('sw', _('Swahili')),  # Example extra language
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
# Email
# -------------------------
# EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
# EMAIL_HOST = env('EMAIL_HOST', default='')
# EMAIL_PORT = env('EMAIL_PORT', default=587)
# EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
# EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')
# EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
# DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='')


# import os
# At the top of settings.py
from decouple import config

# Email configuration
EMAIL_BACKEND = config('EMAIL_BACKEND')
EMAIL_HOST = config('EMAIL_HOST')
EMAIL_PORT = config('EMAIL_PORT', cast=int)  # Cast to integer
EMAIL_USE_TLS = config('EMAIL_USE_TLS', cast=bool)  # Cast to boolean
EMAIL_USE_SSL = config('EMAIL_USE_SSL', cast=bool)  # Cast to boolean
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL')


# ALTERNATIVE EMAIL CONFIG
# At the top of settings.py
# import os
# from dotenv import load_dotenv

# load_dotenv()  # Load .env file

# # Email configuration
# EMAIL_BACKEND = os.getenv('EMAIL_BACKEND')
# EMAIL_HOST = os.getenv('EMAIL_HOST')
# EMAIL_PORT = int(os.getenv('EMAIL_PORT'))
# EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS') == 'True'
# EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL') == 'True'
# EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
# DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')
# -------------------------
# Djoser
# -------------------------
DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset-confirm/{uid}/{token}',
    'SEND_PASSWORD_RESET_EMAIL': True,
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': True,
    'EMAIL': {
        'password_reset': 'djoser.email.PasswordResetEmail',
    },
    'SERIALIZERS': {},
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
