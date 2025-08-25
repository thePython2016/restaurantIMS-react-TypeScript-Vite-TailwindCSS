import africastalking
import json
import re
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Set up logging
logger = logging.getLogger(__name__)

def validate_phone_number(phone_number):
    """Validate and format phone number for Africa's Talking"""
    # Remove any non-digit characters except +
    cleaned = ''.join(c for c in phone_number if c.isdigit() or c == '+')
    
    # If number doesn't start with +, assume it's a Kenyan number
    if not cleaned.startswith('+'):
        if cleaned.startswith('0'):
            # Convert 07... to +254...
            cleaned = '+254' + cleaned[1:]
        else:
            # Assume it's already a country code
            cleaned = '+' + cleaned
    
    return cleaned

@csrf_exempt
def send_airtime(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            logger.info(f"Received airtime request: {data}")
            
            # Extract numeric amount from the string (remove "KES " prefix)
            amount_str = data.get("amount", "")
            # Use regex to extract only the numeric part
            amount_match = re.search(r'\d+', amount_str)
            if not amount_match:
                return JsonResponse({
                    "error": "Invalid amount format",
                    "message": "Amount must be a valid number"
                }, status=400)
            
            amount = amount_match.group()
            phone_number = validate_phone_number(data.get("phoneNumber"))
            
            logger.info(f"Processing airtime: Phone={phone_number}, Amount={amount}")
            
            # Get Africa's Talking credentials from Django settings (same as SMS service)
            username = getattr(settings, 'AFRICASTALKING_USERNAME', 'sandbox')
            api_key = getattr(settings, 'AFRICASTALKING_API_KEY', '')
            
            # Check if API key is configured
            if not api_key:
                logger.error("Africa's Talking API key not configured")
                return JsonResponse({
                    "error": "API credentials not configured",
                    "message": "Please check your environment variables"
                }, status=500)
            
            # Initialize Africa's Talking (same as SMS service)
            africastalking.initialize(username, api_key)
            airtime = africastalking.Airtime
            
            logger.info("Africa's Talking initialized successfully")
            
            # Send airtime using the SDK
            response = airtime.send(
                phone_number=phone_number,
                amount=amount,
                currency_code="KES"
            )
            
            logger.info(f"Airtime sent successfully: {response}")
            
            return JsonResponse({
                "success": True,
                "message": "Airtime sent successfully",
                "data": response
            })
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return JsonResponse({
                "error": "Invalid JSON data",
                "message": "Please check your request format"
            }, status=400)
        except Exception as e:
            logger.error(f"Airtime error: {str(e)}", exc_info=True)
            return JsonResponse({
                "error": str(e),
                "message": "Failed to send airtime. Please try again.",
                "details": f"Error type: {type(e).__name__}"
            }, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
