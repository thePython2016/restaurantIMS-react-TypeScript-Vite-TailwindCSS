from django.urls import path
from auth_app import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('auth/google/', views.google_auth, name='google_auth'),
    path('auth/users/reset_password/', views.password_reset_request, name='password_reset_request'),
    path('auth/users/reset_password_confirm/', views.password_reset_confirm, name='password_reset_confirm'),
] 