from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
<<<<<<< HEAD
    path('', include('app_urls')),  # Include your app URLs
=======
    path('', include('backend.app_urls')),  # Include your app URLs
>>>>>>> df12485cdc20b355d9aa4f7bf4cb880c5fedca9b
] 