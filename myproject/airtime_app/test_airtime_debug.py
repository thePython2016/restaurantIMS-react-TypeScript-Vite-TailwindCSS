#!/usr/bin/env python3
"""
Debug script to test AfricasTalking airtime API formats
"""
import africastalking
from django.conf import settings
import json

def test_airtime_formats():
    # Initialize AfricasTalking
    username = getattr(settings, 'AFRICASTALKING_USERNAME', 'sandbox')
    api_key = getattr(settings, 'AFRICASTALKING_API_KEY', '')
    
    print(f"Username: {username}")
    print(f"API Key length: {len(api_key)}")
    
    africastalking.initialize(username, api_key)
    airtime = africastalking.Airtime
    
    # Test phone number
    test_phone = "255123456789"
    test_amount = "10"
    
    # Let's inspect the airtime object
    print(f"\n=== Inspecting airtime object ===")
    print(f"airtime type: {type(airtime)}")
    print(f"airtime methods: {[method for method in dir(airtime) if not method.startswith('_')]}")
    
    # Try to find the correct method
    if hasattr(airtime, 'send'):
        print(f"\n=== Testing airtime.send method ===")
        print(f"send method signature: {airtime.send}")
        
        # Try different parameter formats
        test_cases = [
            # Case 1: List with dict
            ([{"phoneNumber": test_phone, "currencyCode": "TZS", "amount": test_amount}], "Case 1"),
            # Case 2: Direct dict
            ({"phoneNumber": test_phone, "currencyCode": "TZS", "amount": test_amount}, "Case 2"),
            # Case 3: Different key names
            ([{"phoneNumber": test_phone, "currency": "TZS", "amount": test_amount}], "Case 3"),
            # Case 4: With recipient key
            ([{"recipient": {"phoneNumber": test_phone, "currencyCode": "TZS", "amount": test_amount}}], "Case 4"),
        ]
        
        for test_data, case_name in test_cases:
            print(f"\n--- {case_name} ---")
            try:
                response = airtime.send(test_data)
                print(f"✅ Success: {json.dumps(response, indent=2)}")
                break
            except Exception as e:
                print(f"❌ Error: {str(e)}")
    
    # Try alternative methods if they exist
    if hasattr(airtime, 'send_airtime'):
        print(f"\n=== Testing airtime.send_airtime method ===")
        try:
            response = airtime.send_airtime(test_phone, test_amount, "TZS")
            print(f"send_airtime response: {json.dumps(response, indent=2)}")
        except Exception as e:
            print(f"send_airtime error: {str(e)}")
    
    # Check if there are other airtime-related methods
    airtime_methods = [method for method in dir(airtime) if 'airtime' in method.lower()]
    print(f"\n=== Other airtime methods found: {airtime_methods} ===")

if __name__ == "__main__":
    # Set up Django settings
    import os
    import sys
    import django
    
    # Add the project root to Python path
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
    django.setup()
    
    test_airtime_formats()
