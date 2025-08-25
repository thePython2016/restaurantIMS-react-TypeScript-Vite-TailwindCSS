from django.urls import path
from . import views

urlpatterns = [
    path("send-airtime/", views.send_airtime, name="send_airtime"),
]
