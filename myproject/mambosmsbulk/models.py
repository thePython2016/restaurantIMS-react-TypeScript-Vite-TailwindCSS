from django.db import models
from django.contrib.auth.models import User

class SMSCampaign(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('partial', 'Partial Success')
    ]
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    recipients = models.TextField(help_text="Phone numbers separated by commas")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    total_recipients = models.IntegerField(default=0)
    successful_sends = models.IntegerField(default=0)
    failed_sends = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title

class SMSLog(models.Model):
    campaign = models.ForeignKey(SMSCampaign, on_delete=models.CASCADE, related_name='logs')
    recipient = models.CharField(max_length=20)
    status = models.CharField(max_length=50)
    message_id = models.CharField(max_length=100, blank=True)
    cost = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)