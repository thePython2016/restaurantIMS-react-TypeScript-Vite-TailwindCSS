import logging
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

def send_mock_airtime(phone_number, amount):
    """
    Mock airtime service for development and testing
    
    Args:
        phone_number (str): The phone number to send airtime to
        amount (str/float): The amount of airtime to send
    
    Returns:
        dict: Mock response simulating AfricasTalking API
    """
    try:
        # Generate a mock transaction ID
        transaction_id = str(uuid.uuid4()).replace('-', '')[:16]
        
        # Simulate processing time
        import time
        time.sleep(0.5)  # Simulate API delay
        
        # Mock successful response
        mock_response = {
            "responses": [
                {
                    "phoneNumber": phone_number,
                    "status": "Success",
                    "transactionId": transaction_id,
                    "amount": str(amount),
                    "currencyCode": "TZS",
                    "errorMessage": None
                }
            ],
            "numSent": 1,
            "totalAmount": f"TZS {amount}",
            "totalDiscount": "TZS 0.00"
        }
        
        logger.info(f"Mock airtime sent successfully: {transaction_id} to {phone_number}")
        return mock_response
        
    except Exception as e:
        logger.error(f"Mock airtime error: {str(e)}")
        return {"error": f"Mock airtime failed: {str(e)}"}
