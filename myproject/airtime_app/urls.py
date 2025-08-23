from django.urls import path
from .views import airtime_view, test_airtime_config

urlpatterns = [
    path('send-airtime/', airtime_view),
    path('test-config/', test_airtime_config),
]
