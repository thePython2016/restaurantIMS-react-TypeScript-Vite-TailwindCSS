from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('auth/google/', views.google_auth, name='google_auth'),
] 