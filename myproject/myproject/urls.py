"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from custom_password_reset import custom_password_reset


urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('Customers.urls'),name='customers'),
    path('',include('Useraccount.urls'),name='user')
]
# Custom and Djoser Authentication URLs
urlpatterns += [
    path('auth/users/reset_password/', custom_password_reset, name='custom_password_reset'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
]
