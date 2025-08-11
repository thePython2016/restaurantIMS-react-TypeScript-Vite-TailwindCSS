from django.shortcuts import render

# Create your views here.


from django.utils.translation import gettext as _

def welcome_message():
    return _("Welcome to my site")
