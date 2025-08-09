# from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from .views import change_password


# urlpatterns = [
#     path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('change-password/', change_password, name='change_password'),
# ]


from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import change_password, test_google_auth

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # POST with username & password
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # POST with refresh token
    path('change-password/', change_password, name='change_password'),  # POST for changing password
    path('change-password', change_password, name='change_password_no_slash'),  # POST for changing password (no trailing slash)
]
urlpatterns += [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/', include('allauth.urls')),  # Social login
]

from Useraccount.views import GoogleLogin

urlpatterns += [
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/test/', test_google_auth, name='test_google_auth')
]
