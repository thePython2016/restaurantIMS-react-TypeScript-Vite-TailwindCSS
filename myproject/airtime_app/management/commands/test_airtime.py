from django.core.management.base import BaseCommand
from django.conf import settings
from airtime_app.africastalking_service import send_airtime
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Test AfricasTalking airtime configuration and sending'

    def add_arguments(self, parser):
        parser.add_argument(
            '--phone',
            type=str,
            help='Phone number to test airtime sending (optional)',
        )
        parser.add_argument(
            '--amount',
            type=float,
            default=10.0,
            help='Amount to send for testing (default: 10.0)',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Testing AfricasTalking Configuration...'))
        
        # Check configuration
        username = getattr(settings, 'AFRICASTALKING_USERNAME', 'Not set')
        api_key = getattr(settings, 'AFRICASTALKING_API_KEY', '')
        
        self.stdout.write(f'Username: {username}')
        self.stdout.write(f'API Key set: {"Yes" if api_key else "No"}')
        self.stdout.write(f'API Key length: {len(api_key)}')
        
        if not api_key:
            self.stdout.write(
                self.style.ERROR('❌ AFRICASTALKING_API_KEY is not set in your .env file!')
            )
            return
        
        if username == 'sandbox':
            self.stdout.write(
                self.style.WARNING('⚠️  Using sandbox mode. Real airtime will not be sent.')
            )
        
        # Test phone number provided
        test_phone = options['phone']
        test_amount = options['amount']
        
        if test_phone:
            self.stdout.write(f'\nTesting airtime send to: {test_phone}')
            self.stdout.write(f'Amount: {test_amount} TZS')
            
            result = send_airtime(test_phone, test_amount)
            
            if 'error' in result:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error: {result["error"]}')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Airtime send result: {result}')
                )
        else:
            self.stdout.write(
                self.style.WARNING('\nNo phone number provided. Use --phone to test actual airtime sending.')
            )
        
        self.stdout.write(
            self.style.SUCCESS('\nConfiguration test completed!')
        )
