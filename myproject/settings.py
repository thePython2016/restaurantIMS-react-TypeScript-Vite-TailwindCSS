# # # import os
# # # from pathlib import Path
# # # import environ
# # # import warnings

# # # # Initialize environment variables
# # # env = environ.Env(
# # #     DEBUG=(bool, False)
# # # )
# # # environ.Env.read_env()  # Reads .env file in the project root

# # # BASE_DIR = Path(__file__).resolve().parent.parent

# # # # Security
# # # SECRET_KEY = env('SECRET_KEY')
# # # DEBUG = env('DEBUG')
# # # ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# # # # CORS
# # # CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
# # #     "http://localhost:5173",
# # #     "http://127.0.0.1:8000",
# # # ])
# # # CORS_ALLOW_CREDENTIALS = True

# # # # Applications
# # # INSTALLED_APPS = [
# # #     'corsheaders',
# # #     'django.contrib.admin',
# # #     'django.contrib.auth',
# # #     'django.contrib.contenttypes',
# # #     'django.contrib.sessions',
# # #     'django.contrib.messages',
# # #     'django.contrib.staticfiles',
# # #     'Customers',
# # #     'Items',
# # #     'Menus',
# # #     'OrderItem',
# # #     'Staffs',
# # #     'Orders',
# # #     'Useraccount',
# # #     'rest_framework',
# # #     'rest_framework.authtoken',
# # #     'django.contrib.sites',
# # #     'allauth',
# # #     'allauth.account',
# # #     'allauth.socialaccount',
# # #     'allauth.socialaccount.providers.google',
# # #     'djoser',
# # #     'dj_rest_auth',
# # #     'dj_rest_auth.registration',
# # # ]

# # # MIDDLEWARE = [
# # #     'corsheaders.middleware.CorsMiddleware',
# # #     'django.middleware.common.CommonMiddleware',
# # #     'django.middleware.security.SecurityMiddleware',
# # #     'django.contrib.sessions.middleware.SessionMiddleware',
# # #     'django.middleware.csrf.CsrfViewMiddleware',
# # #     'django.contrib.auth.middleware.AuthenticationMiddleware',
# # #     'django.contrib.messages.middleware.MessageMiddleware',
# # #     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# # #     'allauth.account.middleware.AccountMiddleware',
# # # ]

# # # ROOT_URLCONF = 'myproject.urls'

# # # TEMPLATES = [
# # #     {
# # #         'BACKEND': 'django.template.backends.django.DjangoTemplates',
# # #         'DIRS': [BASE_DIR / 'templates'],
# # #         'APP_DIRS': True,
# # #         'OPTIONS': {
# # #             'context_processors': [
# # #                 'django.template.context_processors.request',
# # #                 'django.contrib.auth.context_processors.auth',
# # #                 'django.contrib.messages.context_processors.messages',
# # #             ],
# # #         },
# # #     },
# # # ]

# # # WSGI_APPLICATION = 'myproject.wsgi.application'

# # # # MySQL Configuration from .env
# # # DATABASES = {
# # #     'default': {
# # #         'ENGINE': 'django.db.backends.mysql',
# # #         'NAME': env('DB_NAME'),
# # #         'USER': env('DB_USER'),
# # #         'PASSWORD': env('DB_PASSWORD'),
# # #         'HOST': env('DB_HOST', default='localhost'),
# # #         'PORT': env('DB_PORT', default='3306'),
# # #     }
# # # }

# # # # Password validation
# # # AUTH_PASSWORD_VALIDATORS = [
# # #     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
# # #     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
# # #     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
# # #     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# # # ]

# # # # Localization
# # # LANGUAGE_CODE = 'en-us'
# # # TIME_ZONE = 'UTC'
# # # USE_I18N = True
# # # USE_TZ = True

# # # # Static files
# # # STATIC_URL = 'static/'

# # # DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # # # REST Framework
# # # REST_FRAMEWORK = {
# # #     'DEFAULT_AUTHENTICATION_CLASSES': [
# # #         'rest_framework_simplejwt.authentication.JWTAuthentication',
# # #         'rest_framework.authentication.SessionAuthentication',
# # #     ],
# # #     'DEFAULT_PERMISSION_CLASSES': [
# # #         'rest_framework.permissions.AllowAny',
# # #     ],
# # # }

# # # # Email Configuration - Using Gmail SMTP
# # # EMAIL_BACKEND = env('EMAIL_BACKEND')
# # # EMAIL_HOST = env('EMAIL_HOST')
# # # EMAIL_PORT = env.int('EMAIL_PORT')
# # # EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS')
# # # EMAIL_HOST_USER = env('EMAIL_HOST_USER')
# # # EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
# # # DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

# # # # Djoser settings - Simplified for development
# # # DJOSER = {
# # #     'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm?uid={uid}&token={token}',
# # #     'SEND_ACTIVATION_EMAIL': False,
# # #     'SEND_CONFIRMATION_EMAIL': False,
# # #     'PASSWORD_RESET_CONFIRM_RETYPE': False,
# # #     'LOGOUT_ON_PASSWORD_CHANGE': False,
# # #     'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
# # #     'PERMISSIONS': {
# # #         'password_reset': ['rest_framework.permissions.AllowAny'],
# # #         'password_reset_confirm': ['rest_framework.permissions.AllowAny'],
# # #     },
# # # }

# # # SITE_ID = 1
# # # SITE_NAME = 'ReactLife'
# # # DOMAIN = 'localhost:5173'
# # # PROTOCOL = 'http'

# # # AUTHENTICATION_BACKENDS = (
# # #     'django.contrib.auth.backends.ModelBackend',
# # #     'allauth.account.auth_backends.AuthenticationBackend',
# # # )

# # # SOCIALACCOUNT_PROVIDERS = {
# # #     'google': {
# # #         'SCOPE': ['profile', 'email'],
# # #         'AUTH_PARAMS': {'access_type': 'online'},
# # #         'OAUTH_PKCE_ENABLED': True,
# # #     }
# # # }

# # # # JWT Settings
# # # from datetime import timedelta
# # # SIMPLE_JWT = {
# # #     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
# # #     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
# # #     'ROTATE_REFRESH_TOKENS': False,
# # #     'BLACKLIST_AFTER_ROTATION': True,
# # #     'UPDATE_LAST_LOGIN': False,
# # #     'ALGORITHM': 'HS256',
# # #     'SIGNING_KEY': SECRET_KEY,
# # #     'VERIFYING_KEY': None,
# # #     'AUDIENCE': None,
# # #     'ISSUER': None,
# # #     'AUTH_HEADER_TYPES': ('Bearer',),
# # #     'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
# # #     'USER_ID_FIELD': 'id',
# # #     'USER_ID_CLAIM': 'user_id',
# # #     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
# # #     'TOKEN_TYPE_CLAIM': 'token_type',
# # #     'JTI_CLAIM': 'jti',
# # # }

# # # REST_AUTH = {
# # #     'SIGNUP_FIELDS': {
# # #         'username': {'required': True},
# # #         'email': {'required': True},
# # #         'password1': {'required': True},
# # #         'password2': {'required': True}
# # #     },
# # #     'USE_JWT': True,
# # #     'JWT_AUTH_COOKIE': 'access_token',
# # #     'JWT_AUTH_REFRESH_COOKIE': 'refresh_token',
# # #     'JWT_AUTH_HTTPONLY': True,
# # #     'JWT_AUTH_SECURE': False,
# # #     'JWT_AUTH_SAMESITE': 'Lax',
# # #     'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
# # # }

# # # ACCOUNT_LOGIN_METHODS = {'email'}
# # # ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
# # # ACCOUNT_EMAIL_VERIFICATION = 'none'
# # # ACCOUNT_UNIQUE_EMAIL = True
# # # ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
# # # ACCOUNT_EMAIL_SUBJECT_PREFIX = '[Your Site] '

# # # warnings.filterwarnings(
# # #     'ignore',
# # #     message='app_settings.USERNAME_REQUIRED is deprecated',
# # #     category=UserWarning,
# # #     module='dj_rest_auth.registration.serializers'
# # # )
# # # warnings.filterwarnings(
# # #     'ignore',
# # #     message='app_settings.EMAIL_REQUIRED is deprecated',
# # #     category=UserWarning,
# # #     module='dj_rest_auth.registration.serializers'
# # # )

# # # SOCIALACCOUNT_AUTO_SIGNUP = True
# # # SOCIALACCOUNT_EMAIL_REQUIRED = True
# # # SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'




# # import os
# # from pathlib import Path
# # import environ
# # import warnings

# # # Initialize environment variables
# # env = environ.Env(
# #     DEBUG=(bool, False)
# # )
# # environ.Env.read_env()  # Reads .env file in the project root

# # BASE_DIR = Path(__file__).resolve().parent.parent

# # # Security
# # SECRET_KEY = env('SECRET_KEY')
# # DEBUG = env('DEBUG')
# # ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# # # CORS
# # CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
# #     "http://localhost:5173",
# #     "http://127.0.0.1:8000",
# # ])
# # CORS_ALLOW_CREDENTIALS = True

# # # Applications
# # INSTALLED_APPS = [
# #     'corsheaders',
# #     'django.contrib.admin',
# #     'django.contrib.auth',
# #     'django.contrib.contenttypes',
# #     'django.contrib.sessions',
# #     'django.contrib.messages',
# #     'django.contrib.staticfiles',
# #     'Customers',
# #     'Items',
# #     'Menus',
# #     'OrderItem',
# #     'Staffs',
# #     'Orders',
# #     'Useraccount',
# #     'rest_framework',
# #     'rest_framework.authtoken',
# #     'django.contrib.sites',
# #     'allauth',
# #     'allauth.account',
# #     'allauth.socialaccount',
# #     'allauth.socialaccount.providers.google',
# #     'djoser',
# #     'dj_rest_auth',
# #     'dj_rest_auth.registration',
# # ]

# # MIDDLEWARE = [
# #     'corsheaders.middleware.CorsMiddleware',
# #     'django.middleware.common.CommonMiddleware',
# #     'django.middleware.security.SecurityMiddleware',
# #     'django.contrib.sessions.middleware.SessionMiddleware',
# #     'django.middleware.csrf.CsrfViewMiddleware',
# #     'django.contrib.auth.middleware.AuthenticationMiddleware',
# #     'django.contrib.messages.middleware.MessageMiddleware',
# #     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# #     'allauth.account.middleware.AccountMiddleware',
# # ]

# # ROOT_URLCONF = 'myproject.urls'

# # TEMPLATES = [
# #     {
# #         'BACKEND': 'django.template.backends.django.DjangoTemplates',
# #         'DIRS': [BASE_DIR / 'templates'],
# #         'APP_DIRS': True,
# #         'OPTIONS': {
# #             'context_processors': [
# #                 'django.template.context_processors.request',
# #                 'django.contrib.auth.context_processors.auth',
# #                 'django.contrib.messages.context_processors.messages',
# #             ],
# #         },
# #     },
# # ]

# # WSGI_APPLICATION = 'myproject.wsgi.application'

# # # MySQL Configuration from .env
# # DATABASES = {
# #     'default': {
# #         'ENGINE': 'django.db.backends.mysql',
# #         'NAME': env('DB_NAME'),
# #         'USER': env('DB_USER'),
# #         'PASSWORD': env('DB_PASSWORD'),
# #         'HOST': env('DB_HOST', default='localhost'),
# #         'PORT': env('DB_PORT', default='3306'),
# #     }
# # }

# # # Password validation
# # AUTH_PASSWORD_VALIDATORS = [
# #     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
# #     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
# #     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
# #     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# # ]

# # # Localization
# # LANGUAGE_CODE = 'en-us'
# # TIME_ZONE = 'UTC'
# # USE_I18N = True
# # USE_TZ = True

# # # Static files
# # STATIC_URL = 'static/'

# # DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # # REST Framework
# # REST_FRAMEWORK = {
# #     'DEFAULT_AUTHENTICATION_CLASSES': [
# #         'rest_framework_simplejwt.authentication.JWTAuthentication',
# #         'rest_framework.authentication.SessionAuthentication',
# #         'rest_framework.authentication.BasicAuthentication',
# #     ],
# #     'DEFAULT_PERMISSION_CLASSES': [
# #         'rest_framework.permissions.AllowAny',
# #     ],
# #     'DEFAULT_RENDERER_CLASSES': [
# #         'rest_framework.renderers.JSONRenderer',
# #     ],
# # }

# # # Email Configuration - Using Gmail SMTP
# # EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
# # EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
# # EMAIL_PORT = env.int('EMAIL_PORT', default=587)
# # EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
# # EMAIL_USE_SSL = env.bool('EMAIL_USE_SSL', default=False)
# # EMAIL_TIMEOUT = env.int('EMAIL_TIMEOUT', default=30)
# # EMAIL_HOST_USER = env('EMAIL_HOST_USER')
# # EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
# # DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

# # # Djoser settings - Simplified for development
# # DJOSER = {
# #     'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm?uid={uid}&token={token}',
# #     'SEND_ACTIVATION_EMAIL': False,
# #     'SEND_CONFIRMATION_EMAIL': False,
# #     'PASSWORD_RESET_CONFIRM_RETYPE': False,
# #     'LOGOUT_ON_PASSWORD_CHANGE': False,
# #     'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
# #     'DOMAIN': 'localhost:5173',
# #     'SITE_NAME': 'ReactLife',
# #     'PERMISSIONS': {
# #         'user': ['rest_framework.permissions.AllowAny'],
# #         'user_list': ['rest_framework.permissions.AllowAny'],
# #         'password_reset': ['rest_framework.permissions.AllowAny'],
# #         'password_reset_confirm': ['rest_framework.permissions.AllowAny'],
# #         'set_password': ['rest_framework.permissions.AllowAny'],
# #         'activation': ['rest_framework.permissions.AllowAny'],
# #         'resend_activation': ['rest_framework.permissions.AllowAny'],
# #         'username_reset': ['rest_framework.permissions.AllowAny'],
# #         'username_reset_confirm': ['rest_framework.permissions.AllowAny'],
# #         'set_username': ['rest_framework.permissions.AllowAny'],
# #         'user_create': ['rest_framework.permissions.AllowAny'],
# #         'user_delete': ['rest_framework.permissions.AllowAny'],
# #         'user_me': ['rest_framework.permissions.AllowAny'],
# #     },
# #     'SERIALIZERS': {
# #         'password_reset': 'djoser.serializers.PasswordResetSerializer',
# #         'password_reset_confirm': 'djoser.serializers.PasswordResetConfirmSerializer',
# #     },
# #     'HIDE_USERS': False,
# #     'TOKEN_MODEL': None,
# # }

# # SITE_ID = 1
# # SITE_NAME = 'ReactLife'
# # DOMAIN = 'localhost:5173'
# # PROTOCOL = 'http'

# # AUTHENTICATION_BACKENDS = (
# #     'django.contrib.auth.backends.ModelBackend',
# #     'allauth.account.auth_backends.AuthenticationBackend',
# # )

# # SOCIALACCOUNT_PROVIDERS = {
# #     'google': {
# #         'SCOPE': ['profile', 'email'],
# #         'AUTH_PARAMS': {'access_type': 'online'},
# #         'OAUTH_PKCE_ENABLED': True,
# #     }
# # }

# # # JWT Settings
# # from datetime import timedelta
# # SIMPLE_JWT = {
# #     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
# #     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
# #     'ROTATE_REFRESH_TOKENS': False,
# #     'BLACKLIST_AFTER_ROTATION': True,
# #     'UPDATE_LAST_LOGIN': False,
# #     'ALGORITHM': 'HS256',
# #     'SIGNING_KEY': SECRET_KEY,
# #     'VERIFYING_KEY': None,
# #     'AUDIENCE': None,
# #     'ISSUER': None,
# #     'AUTH_HEADER_TYPES': ('Bearer',),
# #     'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
# #     'USER_ID_FIELD': 'id',
# #     'USER_ID_CLAIM': 'user_id',
# #     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
# #     'TOKEN_TYPE_CLAIM': 'token_type',
# #     'JTI_CLAIM': 'jti',
# # }

# # REST_AUTH = {
# #     'SIGNUP_FIELDS': {
# #         'username': {'required': True},
# #         'email': {'required': True},
# #         'password1': {'required': True},
# #         'password2': {'required': True}
# #     },
# #     'USE_JWT': True,
# #     'JWT_AUTH_COOKIE': 'access_token',
# #     'JWT_AUTH_REFRESH_COOKIE': 'refresh_token',
# #     'JWT_AUTH_HTTPONLY': True,
# #     'JWT_AUTH_SECURE': False,
# #     'JWT_AUTH_SAMESITE': 'Lax',
# #     'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
# # }

# # ACCOUNT_LOGIN_METHODS = {'email'}
# # ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
# # ACCOUNT_EMAIL_VERIFICATION = 'none'
# # ACCOUNT_UNIQUE_EMAIL = True
# # ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
# # ACCOUNT_EMAIL_SUBJECT_PREFIX = '[Your Site] '

# # warnings.filterwarnings(
# #     'ignore',
# #     message='app_settings.USERNAME_REQUIRED is deprecated',
# #     category=UserWarning,
# #     module='dj_rest_auth.registration.serializers'
# # )
# # warnings.filterwarnings(
# #     'ignore',
# #     message='app_settings.EMAIL_REQUIRED is deprecated',
# #     category=UserWarning,
# #     module='dj_rest_auth.registration.serializers'
# # )

# # SOCIALACCOUNT_AUTO_SIGNUP = True
# # SOCIALACCOUNT_EMAIL_REQUIRED = True
# # SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'


# # NEW WITH SENDGRID TWILIO

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
#     "http://localhost:3000",  # Fixed: React default port
#     "http://localhost:5173",  # Vite port
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
#         'rest_framework.authentication.BasicAuthentication',
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.AllowAny',
#     ],
#     'DEFAULT_RENDERER_CLASSES': [
#         'rest_framework.renderers.JSONRenderer',
#     ],
# }

# # ================== EMAIL CONFIGURATION - SENDGRID ==================
# # Use SendGrid SMTP (recommended for production)
# # Replace this section in your settings.py:

# # ================== EMAIL CONFIGURATION - SENDGRID ==================
# # CRITICAL FIX: Make sure ONLY this email backend is active
# Eimport os
# from dotenv import load_dotenv

# load_dotenv()

# # SendGrid SMTP Configuration
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.sendgrid.net'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'apikey'  # This is literally 'apikey'
# EMAIL_HOST_PASSWORD = os.getenv('SENDGRID_API_KEY')
# DEFAULT_FROM_EMAIL = os.getenv('FROM_EMAIL')

# # Debug prints - but remove console backend override!
# # if DEBUG:
# #     print("=== EMAIL CONFIGURATION DEBUG ===")
# #     print(f"Email Backend: {EMAIL_BACKEND}")
# #     print(f"SendGrid API Key: {'✅ Set' if env('SENDGRID_API_KEY', default=None) else '❌ NOT SET'}")
# #     print(f"From Email: {DEFAULT_FROM_EMAIL}")
# #     print(f"Frontend URL: {FRONTEND_URL}")
# #     print("===================================")

# # ================== CRITICAL: REMOVE/COMMENT THIS ENTIRE SECTION ==================
# # FIND AND COMMENT OUT OR DELETE this at the bottom of your settings.py:
# # if DEBUG:
# #     # For development, you can uncomment this to see emails in console
# #     EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # ❌ DELETE THIS LINE!
# #     pass

# # ================== DJOSER CONFIGURATION - FIXED ==================
# DJOSER = {
#     # FIXED: Password Reset URLs to match your React routes
#     'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm?uid={uid}&token={token}',
#     'USERNAME_RESET_CONFIRM_URL': 'username/reset/confirm/{uid}/{token}',
#     'ACTIVATION_URL': 'activate/{uid}/{token}',
    
#     # Email Settings
#     'SEND_ACTIVATION_EMAIL': False,
#     'SEND_CONFIRMATION_EMAIL': True,
#     'PASSWORD_RESET_CONFIRM_RETYPE': True,
#     'LOGOUT_ON_PASSWORD_CHANGE': True,
#     'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
    
#     # CRITICAL: Site info for proper email generation
#     'DOMAIN': DOMAIN,
#     'SITE_NAME': SITE_NAME,
#     'LOGIN_FIELD': 'email',
    
#     # Permissions
#     'PERMISSIONS': {
#         'user': ['rest_framework.permissions.AllowAny'],
#         'user_list': ['rest_framework.permissions.AllowAny'],
#         'password_reset': ['rest_framework.permissions.AllowAny'],
#         'password_reset_confirm': ['rest_framework.permissions.AllowAny'],
#         'set_password': ['djoser.permissions.CurrentUserOrAdmin'],
#         'activation': ['rest_framework.permissions.AllowAny'],
#         'resend_activation': ['rest_framework.permissions.AllowAny'],
#         'username_reset': ['rest_framework.permissions.AllowAny'],
#         'username_reset_confirm': ['rest_framework.permissions.AllowAny'],
#         'set_username': ['djoser.permissions.CurrentUserOrAdmin'],
#         'user_create': ['rest_framework.permissions.AllowAny'],
#         'user_delete': ['djoser.permissions.CurrentUserOrAdmin'],
#         'user_me': ['rest_framework.permissions.IsAuthenticated'],
#     },
    
#     # Serializers
#     'SERIALIZERS': {
#         'password_reset': 'djoser.serializers.PasswordResetSerializer',
#         'password_reset_confirm': 'djoser.serializers.PasswordResetConfirmRetypeSerializer',
#         'user_create': 'djoser.serializers.UserCreateSerializer',
#         'user': 'djoser.serializers.UserSerializer',
#         'current_user': 'djoser.serializers.UserSerializer',
#     },
    
#     # Email Templates
#     'EMAIL': {
#         'password_reset': 'djoser.email.PasswordResetEmail',
#         'password_changed_confirmation': 'djoser.email.PasswordChangedConfirmationEmail',
#         'username_changed_confirmation': 'djoser.email.UsernameChangedConfirmationEmail',
#         'username_reset': 'djoser.email.UsernameResetEmail',
#     },
    
#     'HIDE_USERS': False,
#     'TOKEN_MODEL': None,
# }

# # ================== ALLAUTH CONFIGURATION ==================
# ACCOUNT_AUTHENTICATION_METHOD = 'email'
# ACCOUNT_EMAIL_REQUIRED = True
# ACCOUNT_EMAIL_VERIFICATION = 'none'  # Change to 'mandatory' if you want email verification
# ACCOUNT_UNIQUE_EMAIL = True
# ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
# ACCOUNT_USERNAME_REQUIRED = True
# ACCOUNT_EMAIL_SUBJECT_PREFIX = f'[{SITE_NAME}] '
# ACCOUNT_DEFAULT_HTTP_PROTOCOL = PROTOCOL

# # Login/Logout URLs
# LOGIN_URL = f'{FRONTEND_URL}/login'
# LOGIN_REDIRECT_URL = f'{FRONTEND_URL}/dashboard'
# LOGOUT_REDIRECT_URL = f'{FRONTEND_URL}/'

# # Password Reset Token Timeout (in seconds) - 24 hours
# PASSWORD_RESET_TIMEOUT = 86400

# # ================== SECURITY SETTINGS ==================
# if not DEBUG:
#     SECURE_SSL_REDIRECT = True
#     SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
#     SECURE_BROWSER_XSS_FILTER = True
#     SECURE_CONTENT_TYPE_NOSNIFF = True
#     X_FRAME_OPTIONS = 'DENY'
#     SECURE_HSTS_SECONDS = 31536000
#     SECURE_HSTS_INCLUDE_SUBDOMAINS = True
#     SECURE_HSTS_PRELOAD = True

# # ================== SOCIAL ACCOUNT SETTINGS ==================
# SOCIALACCOUNT_AUTO_SIGNUP = True
# SOCIALACCOUNT_EMAIL_REQUIRED = True
# SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'

# # ================== LOGGING CONFIGURATION ==================
# # Create logs directory if it doesn't exist
# LOGS_DIR = BASE_DIR / 'logs'
# LOGS_DIR.mkdir(exist_ok=True)

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'file': {
#             'level': 'INFO',
#             'class': 'logging.FileHandler',
#             'filename': LOGS_DIR / 'django.log',
#             'formatter': 'verbose',
#         },
#         'console': {
#             'level': 'DEBUG',
#             'class': 'logging.StreamHandler',
#             'formatter': 'simple',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['file', 'console'] if DEBUG else ['file'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#         'djoser': {
#             'handlers': ['file', 'console'] if DEBUG else ['file'],
#             'level': 'DEBUG' if DEBUG else 'INFO',
#             'propagate': True,
#         },
#         'django.core.mail': {
#             'handlers': ['file', 'console'] if DEBUG else ['file'],
#             'level': 'DEBUG' if DEBUG else 'INFO',
#             'propagate': True,
#         },
#     },
# }

# # ================== SUPPRESS WARNINGS ==================
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

# # ================== DEVELOPMENT SETTINGS ==================
# if DEBUG:
#     # For development, you can uncomment this to see emails in console
#     # EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
#     pass


import os
from pathlib import Path
import environ
import warnings
from datetime import timedelta

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

# Site Configuration
SITE_ID = 1
SITE_NAME = env('SITE_NAME', default='Your App Name')
DOMAIN = env('DOMAIN', default='localhost:3000')
PROTOCOL = env('PROTOCOL', default='http')
FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:3000')

# CORS Configuration
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    "http://localhost:3000",  # React default port
    "http://localhost:5173",  # Vite port
    "http://127.0.0.1:8000",
    FRONTEND_URL,
])
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = env.bool('CORS_ALLOW_ALL_ORIGINS', default=False)

# Applications
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    # Your apps
    'Customers',
    'Items',
    'Menus',
    'OrderItem',
    'Staffs',
    'Orders',
    'Useraccount',
    
    # Third-party packages
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'djoser',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'templated_mail',  # Required for custom email templates
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
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
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'

# Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST', default='localhost'),
        'PORT': env('DB_PORT', default='3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
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
TIME_ZONE = env('TIME_ZONE', default='UTC')
USE_I18N = True
USE_TZ = True

# Static and Media files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static'] if (BASE_DIR / 'static').exists() else []

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}

# Simple JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=env.int('JWT_ACCESS_TOKEN_LIFETIME', default=60)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=env.int('JWT_REFRESH_TOKEN_LIFETIME', default=7)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# ================== EMAIL CONFIGURATION - SENDGRID ==================
# CRITICAL: Set the correct email backend
# USE_CONSOLE_EMAIL = env.bool('USE_CONSOLE_EMAIL', default=False)

# if USE_CONSOLE_EMAIL:
#     # Console backend for debugging (emails print to console)
#     EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
#     print("⚠️  WARNING: Using console email backend - emails will NOT be sent!")
# else:
# SendGrid SMTP backend for real email delivery 
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_HOST_USER = 'apikey'  # This is literally 'apikey' for SendGrid
EMAIL_HOST_PASSWORD = env('SENDGRID_API_KEY')
EMAIL_TIMEOUT = 60
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='noreply@yourdomain.com')
SERVER_EMAIL = env('SERVER_EMAIL', default=DEFAULT_FROM_EMAIL)





# Validate SendGrid configuration


# ================== TWILIO CONFIGURATION ==================
TWILIO_ACCOUNT_SID = env('TWILIO_ACCOUNT_SID', default='')
TWILIO_AUTH_TOKEN = env('TWILIO_AUTH_TOKEN', default='')
TWILDEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='noreply@yourdomain.com')
SERVER_EMAIL = env('SERVER_EMAIL', default=DEFAULT_FROM_EMAIL)
TWILIO_PHONE_NUMBER = env('TWILIO_PHONE_NUMBER', default='')

# ================== DJOSER CONFIGURATION - COMPLETE ==================
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SEND_ACTIVATION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'USERNAME_RESET_CONFIRM_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
    'PASSWORD_RESET_CONFIRM_URL': f'auth/password-reset/{{uid}}/{{token}}',
    'USERNAME_RESET_CONFIRM_URL': f'auth/username-reset/{{uid}}/{{token}}',
    # 'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    # 'USERNAME_RESET_CONFIRM_URL': 'username/reset/confirm/{uid}/{token}',
    # 'ACTIVATION_URL': 'activate/{uid}/{token}',
    'ACTIVATION_URL': f'auth/activate/{{uid}}/{{token}}',
    'TOKEN_MODEL': None,  # Use JWT tokens instead of database tokens
    
    'SERIALIZERS': {
        'user_create': 'djoser.serializers.UserCreateSerializer',
        'user': 'djoser.serializers.UserSerializer',
        'current_user': 'djoser.serializers.UserSerializer',
        'user_delete': 'djoser.serializers.UserDeleteSerializer',
        'password_reset': 'djoser.serializers.SendEmailResetSerializer',
        'password_reset_confirm': 'djoser.serializers.PasswordResetConfirmSerializer',
        'password_reset_confirm_retype': 'djoser.serializers.PasswordResetConfirmRetypeSerializer',
        'set_password': 'djoser.serializers.SetPasswordSerializer',
        'set_password_retype': 'djoser.serializers.SetPasswordRetypeSerializer',
        'set_username': 'djoser.serializers.SetUsernameSerializer',
        'set_username_retype': 'djoser.serializers.SetUsernameRetypeSerializer',
        'username_reset': 'djoser.serializers.SendEmailResetSerializer',
        'username_reset_confirm': 'djoser.serializers.UsernameResetConfirmSerializer',
        'username_reset_confirm_retype': 'djoser.serializers.UsernameResetConfirmRetypeSerializer',
        'user_create_password_retype': 'djoser.serializers.UserCreatePasswordRetypeSerializer',
    },
    
    'EMAIL': {
        'activation': 'djoser.email.ActivationEmail',
        'confirmation': 'djoser.email.ConfirmationEmail',
        'password_reset': 'djoser.email.PasswordResetEmail',
        'password_changed_confirmation': 'djoser.email.PasswordChangedConfirmationEmail',
        'username_changed_confirmation': 'djoser.email.UsernameChangedConfirmationEmail',
        'username_reset': 'djoser.email.UsernameResetEmail',
    },
    
    'PERMISSIONS': {
        'activation': ['rest_framework.permissions.AllowAny'],
        'password_reset': ['rest_framework.permissions.AllowAny'],
        'password_reset_confirm': ['rest_framework.permissions.AllowAny'],
        'set_password': ['djoser.permissions.CurrentUserOrAdmin'],
        'username_reset': ['rest_framework.permissions.AllowAny'],
        'username_reset_confirm': ['rest_framework.permissions.AllowAny'],
        'set_username': ['djoser.permissions.CurrentUserOrAdmin'],
        'user_create': ['rest_framework.permissions.AllowAny'],
        'user_delete': ['djoser.permissions.CurrentUserOrAdmin'],
        'user': ['djoser.permissions.CurrentUserOrAdmin'],
        'user_list': ['djoser.permissions.CurrentUserOrAdmin'],
        'token_create': ['rest_framework.permissions.AllowAny'],
        'token_destroy': ['rest_framework.permissions.IsAuthenticated'],
    },
    
    'HIDE_USERS': True,
    'LOGOUT_ON_PASSWORD_CHANGE': True,
    'CREATE_SESSION_ON_LOGIN': False,
    'SOCIAL_AUTH_TOKEN_STRATEGY': 'djoser.social.token.jwt.TokenStrategy',
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': [
        f"{FRONTEND_URL}/auth/google",
        f"{FRONTEND_URL}/auth/callback",
    ],
}

# ================== ALLAUTH CONFIGURATION ==================
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = env('ACCOUNT_EMAIL_VERIFICATION', default='none')  # 'mandatory', 'optional', 'none'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_EMAIL_SUBJECT_PREFIX = f'[{SITE_NAME}] '
ACCOUNT_DEFAULT_HTTP_PROTOCOL = PROTOCOL
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3
ACCOUNT_LOGIN_ATTEMPTS_LIMIT = 5
ACCOUNT_LOGIN_ATTEMPTS_TIMEOUT = 300  # 5 minutes
ACCOUNT_LOGOUT_ON_GET = False
ACCOUNT_LOGOUT_REDIRECT_URL = f'{FRONTEND_URL}/'
ACCOUNT_SESSION_REMEMBER = True
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_USERNAME_BLACKLIST = ['admin', 'root', 'administrator', 'moderator']
ACCOUNT_USERNAME_MIN_LENGTH = 3
ACCOUNT_ADAPTER = 'allauth.account.adapter.DefaultAccountAdapter'
ACCOUNT_FORMS = {
    'login': 'allauth.account.forms.LoginForm',
    'signup': 'allauth.account.forms.SignupForm',
    'add_email': 'allauth.account.forms.AddEmailForm',
    'change_password': 'allauth.account.forms.ChangePasswordForm',
    'set_password': 'allauth.account.forms.SetPasswordForm',
    'reset_password': 'allauth.account.forms.ResetPasswordForm',
    'reset_password_from_key': 'allauth.account.forms.ResetPasswordKeyForm',
}

# Login/Logout URLs
# LOGIN_URL = f'{FRONTEND_URL}/login'
# LOGIN_REDIRECT_URL = f'{FRONTEND_URL}/dashboard'
# LOGOUT_REDIRECT_URL = f'{FRONTEND_URL}/'

# Password Reset Token Timeout (in seconds)
PASSWORD_RESET_TIMEOUT = env.int('PASSWORD_RESET_TIMEOUT', default=86400)  # 24 hours

# ================== DJ-REST-AUTH CONFIGURATION ==================
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'jwt-auth',
    'JWT_AUTH_REFRESH_COOKIE': 'jwt-refresh',
    'JWT_AUTH_SECURE': not DEBUG,
    'JWT_AUTH_HTTPONLY': True,
    'JWT_AUTH_SAMESITE': 'Lax',
    'JWT_TOKEN_CLAIMS_SERIALIZER': 'rest_framework_simplejwt.serializers.TokenObtainPairSerializer',
    'LOGIN_SERIALIZER': 'dj_rest_auth.serializers.LoginSerializer',
    'TOKEN_SERIALIZER': 'dj_rest_auth.serializers.TokenSerializer',
    'JWT_SERIALIZER': 'dj_rest_auth.serializers.JWTSerializer',
    'JWT_SERIALIZER_WITH_EXPIRATION': 'dj_rest_auth.serializers.JWTSerializerWithExpiration',
    'JWT_TOKEN_CLAIMS_SERIALIZER': 'rest_framework_simplejwt.serializers.TokenObtainPairSerializer',
    'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
    'PASSWORD_RESET_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetSerializer',
    'PASSWORD_RESET_CONFIRM_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetConfirmSerializer',
    'PASSWORD_CHANGE_SERIALIZER': 'dj_rest_auth.serializers.PasswordChangeSerializer',
    'REGISTER_SERIALIZER': 'dj_rest_auth.registration.serializers.RegisterSerializer',
    'REGISTER_PERMISSION_CLASSES': ('rest_framework.permissions.AllowAny',),
    'TOKEN_MODEL': 'rest_framework.authtoken.models.Token',
    'TOKEN_CREATOR': 'dj_rest_auth.utils.default_create_token',
    'PASSWORD_RESET_USE_EMAIL': True,
    'OLD_PASSWORD_FIELD_ENABLED': True,
    'LOGOUT_ON_PASSWORD_CHANGE': True,
    'SESSION_LOGIN': False,
    'REGISTER_THROTTLE_CLASSES': ('rest_framework.throttling.AnonRateThrottle',),
    'REGISTER_THROTTLE_SCOPE': 'dj_rest_auth_register',
}

# ================== SOCIAL ACCOUNT SETTINGS ==================
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
        'FETCH_USERINFO': True,
    }
}

# ================== SECURITY SETTINGS ==================
# CSRF Settings
CSRF_TRUSTED_ORIGINS = [
    FRONTEND_URL,
    *env.list('CSRF_TRUSTED_ORIGINS', default=[])
]
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_USE_SESSIONS = False

# Session Settings
SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_AGE = 1209600  # 2 weeks
SESSION_SAVE_EVERY_REQUEST = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# Security Headers
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# ================== CACHING CONFIGURATION ==================
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': env('REDIS_URL', default='redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'myproject',
        'TIMEOUT': 300,  # 5 minutes
    }
} if env('REDIS_URL', default=None) else {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# ================== LOGGING CONFIGURATION ==================
LOGS_DIR = BASE_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': LOGS_DIR / 'django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG' if DEBUG else 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'] if DEBUG else ['file'],
            'level': 'INFO',
            'propagate': True,
        },
        'djoser': {
            'handlers': ['file', 'console'] if DEBUG else ['file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
        'django.core.mail': {
            'handlers': ['file', 'console'] if DEBUG else ['file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
        'allauth': {
            'handlers': ['file', 'console'] if DEBUG else ['file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
        'myproject': {  # Your project name
            'handlers': ['file', 'console'] if DEBUG else ['file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
    },
}

# ================== RATE LIMITING ==================
# Add rate limiting for sensitive endpoints
RATELIMIT_ENABLE = env.bool('RATELIMIT_ENABLE', default=True)
RATELIMIT_USE_CACHE = 'default'
RATELIMIT_VIEW = 'myproject.views.ratelimited'

# ================== CUSTOM USER MODEL (if applicable) ==================
# Uncomment if you have a custom user model
# AUTH_USER_MODEL = 'Useraccount.CustomUser'

# ================== ADMIN CONFIGURATION ==================
ADMIN_URL = env('ADMIN_URL', default='admin/')
ADMINS = [
    ('Admin', env('ADMIN_EMAIL', default='admin@yourdomain.com')),
]
MANAGERS = ADMINS

# ================== FILE UPLOAD SETTINGS ==================
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000

# ================== INTERNATIONALIZATION ==================
USE_L10N = True
LOCALE_PATHS = [BASE_DIR / 'locale']

# ================== DEVELOPMENT SETTINGS ==================
if DEBUG:
    # Debug toolbar (install django-debug-toolbar for this)
    try:
        import debug_toolbar
        INSTALLED_APPS += ['debug_toolbar']
        MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
        INTERNAL_IPS = ['127.0.0.1', '::1']
        DEBUG_TOOLBAR_CONFIG = {
            'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
        }
    except ImportError:
        pass
    
    # Email debug information
    # print("=== EMAIL CONFIGURATION DEBUG ===")
    # print(f"Email Backend: {EMAIL_BACKEND}")
    # print(f"SendGrid API Key: {'✅ Set' if env('SENDGRID_API_KEY', default=None) else '❌ NOT SET'}")
    # print(f"From Email: {DEFAULT_FROM_EMAIL}")
    # print(f"Frontend URL: {FRONTEND_URL}")
    # print("===================================")

# ================== SUPPRESS WARNINGS ==================
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

# ================== HEALTH CHECK SETTINGS ==================
HEALTH_CHECK = {
    'DISK_USAGE_MAX': 90,  # Percent
    'MEMORY_MIN': 100,      # MB
}

# ================== BACKUP SETTINGS ==================
BACKUP_ENABLED = env.bool('BACKUP_ENABLED', default=False)
BACKUP_DIRECTORY = BASE_DIR / 'backups'
BACKUP_DIRECTORY.mkdir(exist_ok=True)

# ================== API VERSIONING ==================
REST_FRAMEWORK['DEFAULT_VERSIONING_CLASS'] = 'rest_framework.versioning.AcceptHeaderVersioning'
REST_FRAMEWORK['DEFAULT_VERSION'] = 'v1'
REST_FRAMEWORK['ALLOWED_VERSIONS'] = ['v1']