from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .africastalking_service import send_airtime
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def airtime_view(request):
    try:
        phone = request.data.get('phone')
        amount = request.data.get('amount')
        
        # Validate input
        if not phone or not amount:
            return Response({
                'error': 'Phone number and amount are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Log the request for debugging
        logger.info(f"Sending airtime request: phone={phone}, amount={amount}, user={request.user.username}")
        
        # Send airtime
        result = send_airtime(phone, amount)
        
        # Log the result
        logger.info(f"Airtime send result: {result}")
        
        # Check if there was an error
        if 'error' in result:
            return Response({
                'error': result['error']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Return success response
        return Response({
            'message': 'Airtime sent successfully',
            'transaction_id': result.get('responses', [{}])[0].get('transactionId', 'N/A'),
            'status': result.get('responses', [{}])[0].get('status', 'Unknown'),
            'details': result
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in airtime_view: {str(e)}")
        return Response({
            'error': 'An error occurred while sending airtime'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_airtime_config(request):
    """
    Test endpoint to check AfricasTalking configuration
    """
    try:
        from django.conf import settings
        
        config_info = {
            'username': getattr(settings, 'AFRICASTALKING_USERNAME', 'Not set'),
            'api_key_set': bool(getattr(settings, 'AFRICASTALKING_API_KEY', '')),
            'api_key_length': len(getattr(settings, 'AFRICASTALKING_API_KEY', '')),
        }
        
        # Test AfricasTalking initialization
        try:
            from .africastalking_service import airtime
            if airtime:
                config_info['initialization'] = 'Success'
            else:
                config_info['initialization'] = 'Failed - airtime object is None'
        except Exception as e:
            config_info['initialization'] = f'Failed - {str(e)}'
        
        return Response({
            'message': 'AfricasTalking configuration test',
            'config': config_info
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in test_airtime_config: {str(e)}")
        return Response({
            'error': f'Configuration test failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
