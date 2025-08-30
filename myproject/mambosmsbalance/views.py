import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sms_balance(request):
    """
    Get SMS balance from Mambo SMS service
    Requires user to be logged in
    """
    try:
        # Make API call to Mambo SMS
        url = f"{settings.MAMBO_SMS_BASE_URL}/api/v1/sms/balance"
        headers = {
            "Authorization": f"Bearer {settings.MAMBO_SMS_API_KEY}",
            "Content-Type": "application/json",
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        # Return formatted response matching the expected structure
        return Response({
            'success': True,
            'balance': data,  # Return the entire balance object
            'message': 'Balance retrieved successfully',
            'raw_data': data  # Include original response for debugging
        })
        
    except requests.exceptions.RequestException as e:
        return Response({
            'success': False,
            'error': 'Failed to connect to SMS service',
            'message': str(e)
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': 'An unexpected error occurred',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
