import africastalking
import logging
import requests
import json
from django.conf import settings
from .mock_airtime_service import send_mock_airtime

# Set up logging
logger = logging.getLogger(__name__)

# Get Africa's Talking credentials from Django settings
username = getattr(settings, 'AFRICASTALKING_USERNAME', 'sandbox')
api_key = getattr(settings, 'AFRICASTALKING_API_KEY', '')

# Initialize AfricasTalking
try:
    africastalking.initialize(username, api_key)
    airtime = africastalking.Airtime
    logger.info(f"AfricasTalking initialized with username: {username}")
except Exception as e:
    logger.error(f"Failed to initialize AfricasTalking: {str(e)}")
    airtime = None

def send_airtime(phone_number, amount):
    """
    Send airtime to a phone number using AfricasTalking API
    
    Args:
        phone_number (str): The phone number to send airtime to
        amount (str/float): The amount of airtime to send
    
    Returns:
        dict: Response from AfricasTalking API or error message
    """
    try:
        # Validate inputs
        if not phone_number or not amount:
            logger.error("Missing phone_number or amount")
            return {"error": "Phone number and amount are required"}
        
        # Clean phone number (remove spaces, dashes, etc.)
        clean_phone = ''.join(filter(str.isdigit, str(phone_number)))
        
        # Add country code if not present (assuming Tanzania +255)
        if not clean_phone.startswith('255'):
            clean_phone = '255' + clean_phone.lstrip('0')
        
        # Format amount
        try:
            amount_float = float(amount)
            if amount_float <= 0:
                return {"error": "Amount must be greater than 0"}
        except ValueError:
            return {"error": "Invalid amount format"}
        
        logger.info(f"Attempting to send airtime: {amount_float} TZS to {clean_phone}")
        
        # Check if we should use mock service (for development/testing)
        use_mock = getattr(settings, 'USE_MOCK_AIRTIME', True)  # Default to mock for development
        
        if use_mock:
            logger.info("Using mock airtime service for development")
            return send_mock_airtime(clean_phone, amount_float)
        
        # Try direct REST API call first
        try:
            # AfricasTalking REST API endpoint
            url = "https://api.africastalking.com/version1/airtime/send"
            
            headers = {
                'ApiKey': api_key,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
            
            data = {
                'username': username,
                'recipients': json.dumps([{
                    'phoneNumber': clean_phone,
                    'currencyCode': 'TZS',
                    'amount': str(amount_float)
                }])
            }
            
            logger.info(f"Sending REST API request: {data}")
            response = requests.post(url, headers=headers, data=data)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"REST API success: {result}")
                return result
            else:
                logger.error(f"REST API error: {response.status_code} - {response.text}")
                # Fall back to SDK
                
        except Exception as rest_error:
            logger.warning(f"REST API failed, falling back to SDK: {str(rest_error)}")
        
        # Fallback to SDK method
        if not airtime:
            return {"error": "AfricasTalking service not initialized"}
        
        # Try SDK with different format
        airtime_data = {
            "phoneNumber": clean_phone,
            "currencyCode": "TZS",
            "amount": str(amount_float)
        }
        
        logger.info(f"Sending airtime with SDK data: {airtime_data}")
        response = airtime.send([airtime_data])
        
        logger.info(f"AfricasTalking SDK response: {response}")
        
        # Check if the response indicates success
        if response and 'responses' in response:
            for resp in response['responses']:
                if resp.get('status') == 'Success':
                    logger.info(f"Airtime sent successfully to {clean_phone}")
                    return response
                elif resp.get('status') == 'Failed':
                    error_msg = resp.get('errorMessage', 'Unknown error')
                    logger.error(f"Airtime send failed: {error_msg}")
                    return {"error": f"Airtime send failed: {error_msg}"}
        
        # If we get here, something unexpected happened
        logger.warning(f"Unexpected response format: {response}")
        return response
        
    except Exception as e:
        logger.error(f"Exception in send_airtime: {str(e)}")
        return {"error": f"Failed to send airtime: {str(e)}"}
