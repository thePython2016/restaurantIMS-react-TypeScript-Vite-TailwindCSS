import africastalking
import logging
from django.conf import settings

# Set up logging
logger = logging.getLogger(__name__)

# Get Africa's Talking credentials from Django settings
username = getattr(settings, 'AFRICASTALKING_USERNAME', 'sandbox')
api_key = getattr(settings, 'AFRICASTALKING_API_KEY', '')

# Initialize Africa's Talking
africastalking.initialize(username, api_key)
sms = africastalking.SMS 
# import africastalking

# username = "sandbox"  # or your live username
# api_key = "your_api_key"
# africastalking.initialize(username, api_key)
airtime = africastalking.Airtime 



def validate_phone_number(phone_number):
    """Validate and format phone number for Africa's Talking"""
    # Remove any non-digit characters except +
    cleaned = ''.join(c for c in phone_number if c.isdigit() or c == '+')
    
    # If number doesn't start with +, assume it's a Kenyan number
    if not cleaned.startswith('+'):
        if cleaned.startswith('0'):
            # Convert 07... to +254...
            cleaned = '+255' + cleaned[1:]
        else:
            # Assume it's already a country code
            cleaned = '+' + cleaned
    
    return cleaned

def send_bulk_sms(recipients, message):
    """
    Send bulk SMS using Africa's Talking
    
    Args:
        recipients (list): List of phone numbers
        message (str): SMS message content
    
    Returns:
        dict: Response from Africa's Talking API
    """
    try:
        # Check if API key is configured
        if not api_key:
            logger.error("Africa's Talking API key not configured")
            return {
                'error': "SMS service not properly configured",
                'message': 'Please configure Africa\'s Talking API key in settings'
            }
        
        # Validate and format phone numbers
        formatted_recipients = []
        for phone in recipients:
            formatted_phone = validate_phone_number(phone)
            formatted_recipients.append(formatted_phone)
        
        logger.info(f"Sending SMS to {len(formatted_recipients)} recipients: {formatted_recipients}")
        logger.info(f"Message: {message}")
        
        # Send SMS
        response = sms.send(message, formatted_recipients)
        
        logger.info(f"SMS API Response: {response}")
        
        # Check if the response indicates success
        if response and 'SMSMessageData' in response:
            recipients_data = response['SMSMessageData'].get('Recipients', [])
            success_count = sum(1 for r in recipients_data if r.get('status') == 'Success')
            failed_count = len(recipients_data) - success_count
            
            logger.info(f"SMS sent successfully: {success_count} successful, {failed_count} failed")
            
            return {
                'success': True,
                'message': f'SMS sent successfully to {success_count} recipients',
                'total_recipients': len(formatted_recipients),
                'successful': success_count,
                'failed': failed_count,
                'details': recipients_data,
                'raw_response': response
            }
        else:
            logger.error(f"Unexpected SMS API response format: {response}")
            return {
                'error': 'Unexpected response format from SMS service',
                'raw_response': response
            }
            
    except Exception as e:
        logger.error(f"Error sending SMS: {str(e)}")
        return {
            'error': str(e),
            'message': 'Failed to send SMS due to technical error'
        }
