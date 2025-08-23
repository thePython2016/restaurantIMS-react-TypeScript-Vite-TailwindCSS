from django.urls import path
from .views import send_sms_view

urlpatterns = [
    path('api/send-sms/', send_sms_view, name='send_sms'),
]
# # FOR AIRTIME CONFIG
# from .views import airtime_view

# # urlpatterns += [
# #     path('send-airtime/', airtime_view),
# # ]
