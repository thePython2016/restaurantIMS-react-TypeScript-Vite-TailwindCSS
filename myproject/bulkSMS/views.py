from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import json
from .models import SMSCampaign
from .serializers import SMSCampaignSerializer
from .services.sms_service import send_bulk_sms

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_sms_view(request):
    if request.method == 'POST':
        try:
            data = request.data
            message = data.get('message')
            recipients = data.get('recipients', [])
            
            if not message:
                return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not recipients:
                return Response({'error': 'At least one recipient is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create a campaign
            campaign_data = {
                'title': f'SMS Campaign - {len(recipients)} recipients',
                'message': message,
                'recipients': ','.join(recipients),
                'status': 'draft'
            }
            
            serializer = SMSCampaignSerializer(data=campaign_data)
            if serializer.is_valid():
                campaign = serializer.save(created_by=request.user)
                
                # Actually send SMS messages using the SMS service
                sms_response = send_bulk_sms(recipients, message)
                
                # Check if SMS was sent successfully
                if 'error' in sms_response:
                    # Update campaign status to failed
                    campaign.status = 'failed'
                    campaign.save()
                    return Response({
                        'error': f'Failed to send SMS: {sms_response["error"]}',
                        'campaign_id': campaign.id
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    # Update campaign status to sent
                    campaign.status = 'sent'
                    campaign.save()
                    return Response({
                        'success': True,
                        'message': f'SMS sent successfully to {len(recipients)} recipients',
                        'campaign_id': campaign.id,
                        'sms_response': sms_response
                    }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# AIRTIME API CONFIG
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .africastalking_service import send_airtime

# @api_view(['POST'])
# def airtime_view(request):
#     phone = request.data.get('phone')
#     amount = request.data.get('amount')
#     result = send_airtime(phone, amount)
#     return Response(result)
