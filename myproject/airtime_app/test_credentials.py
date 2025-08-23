#!/usr/bin/env python3
"""
Test AfricasTalking credentials and authentication
"""
import requests
import json
import os
import sys
import django

# Set up Django settings
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.conf import settings

def test_credentials():
    username = getattr(settings, 'AFRICASTALKING_USERNAME', 'sandbox')
    api_key = getattr(settings, 'AFRICASTALKING_API_KEY', '')
    
    print(f"Username: {username}")
    print(f"API Key: {api_key[:10]}...{api_key[-10:] if len(api_key) > 20 else '***'}")
    print(f"API Key length: {len(api_key)}")
    
    # Test 1: Check if credentials work with balance API
    print("\n=== Testing Balance API ===")
    try:
        url = "https://api.africastalking.com/version1/user"
        headers = {
            'ApiKey': api_key,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        data = {
            'username': username
        }
        
        response = requests.get(url, headers=headers, params=data)
        print(f"Balance API Status: {response.status_code}")
        print(f"Balance API Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Balance API authentication successful!")
        else:
            print("❌ Balance API authentication failed!")
            
    except Exception as e:
        print(f"❌ Balance API error: {str(e)}")
    
    # Test 2: Try airtime API with different auth methods
    print("\n=== Testing Airtime API Authentication ===")
    
    auth_methods = [
        # Method 1: ApiKey header
        {
            'headers': {'ApiKey': api_key, 'Content-Type': 'application/x-www-form-urlencoded'},
            'name': 'ApiKey Header'
        },
        # Method 2: Authorization header
        {
            'headers': {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/x-www-form-urlencoded'},
            'name': 'Bearer Token'
        },
        # Method 3: Basic auth
        {
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
            'auth': (username, api_key),
            'name': 'Basic Auth'
        }
    ]
    
    for method in auth_methods:
        print(f"\n--- Testing {method['name']} ---")
        try:
            url = "https://api.africastalking.com/version1/airtime/send"
            
            data = {
                'username': username,
                'recipients': json.dumps([{
                    'phoneNumber': '255123456789',
                    'currencyCode': 'TZS',
                    'amount': '10'
                }])
            }
            
            kwargs = {'headers': method['headers'], 'data': data}
            if 'auth' in method:
                kwargs['auth'] = method['auth']
            
            response = requests.post(url, **kwargs)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            
            if response.status_code == 200:
                print(f"✅ {method['name']} authentication successful!")
                break
            elif response.status_code == 401:
                print(f"❌ {method['name']} authentication failed (401)")
            else:
                print(f"⚠️ {method['name']} got status {response.status_code}")
                
        except Exception as e:
            print(f"❌ {method['name']} error: {str(e)}")

if __name__ == "__main__":
    test_credentials()
