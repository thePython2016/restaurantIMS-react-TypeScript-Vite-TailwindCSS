# from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from .views import change_password


# urlpatterns = [
#     path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('change-password/', change_password, name='change_password'),
# ]


from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import change_password, test_google_auth, GoogleLogin, CustomRegisterView

urlpatterns = [
    # JWT Authentication
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password management
    path('change-password/', change_password, name='change_password'),
    path('change-password', change_password, name='change_password_no_slash'),
    
    # Custom registration endpoint
    path('auth/registration/', CustomRegisterView.as_view(), name='custom_register'),
    
    # Other dj-rest-auth endpoints
    path('auth/', include('dj_rest_auth.urls')),
    
    # Social authentication
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/test/', test_google_auth, name='test_google_auth'),
]
