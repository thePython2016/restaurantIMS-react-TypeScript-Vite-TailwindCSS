from django.urls import path
<<<<<<< HEAD
from auth_app import views
=======
from . import views
>>>>>>> df12485cdc20b355d9aa4f7bf4cb880c5fedca9b

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('auth/google/', views.google_auth, name='google_auth'),
<<<<<<< HEAD
    path('auth/users/reset_password/', views.password_reset_request, name='password_reset_request'),
    path('auth/users/reset_password_confirm/', views.password_reset_confirm, name='password_reset_confirm'),
=======
>>>>>>> df12485cdc20b355d9aa4f7bf4cb880c5fedca9b
] 