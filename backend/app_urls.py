from django.urls import path
from auth_app import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('auth/google/', views.google_auth, name='google_auth'),
    path('auth/registration/', views.registration_view, name='registration'),
] 