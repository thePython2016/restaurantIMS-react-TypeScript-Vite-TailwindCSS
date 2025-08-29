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
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from custom_password_reset import custom_password_reset
# from bulkSMS import views

# Create router for bulkSMS API
# router = DefaultRouter()
# router.register(r'sms-campaigns', views.SMSCampaignViewSet, basename='smscampaign')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Customers.urls'), name='customers'),
    path('', include('Useraccount.urls'), name='user'),
    
    # Custom and Djoser Authentication URLs
    path('auth/users/reset_password/', custom_password_reset, name='custom_password_reset'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # SMS app URLs
    # path('api/sms/', include('sms.urls')),
    
    # bulkSMS API URLs
    # path('api/', include(router.urls)),
    # path('api/sms/', include('bulkSMS.urls')),
    
    # Direct SMS endpoint for cleaner URL
    # path('', include('bulkSMS.urls')),
]


urlpatterns += [
    # path('admin/', admin.site.urls),
    path('', include('airtime.urls')),
]
# urlpatterns += [
#     # path('admin/', admin.site.urls),
#     path("api/", include("mambosms.urls")),

# ]
# project/urls.py


urlpatterns += [
    path("api/", include("mambosmssingle.urls")),
    path("api/", include("mambosmsbulk.urls")),
     path("", include("whatsapplinkin.urls")),  # include the app URLs
]

