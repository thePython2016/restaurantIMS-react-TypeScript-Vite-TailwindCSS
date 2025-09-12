




from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    # Map Django model fields to frontend expected field names
    name = serializers.CharField(source='itemName')
    description = serializers.CharField()
    category = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    availability = serializers.CharField()
    
    class Meta:
        model = Item
        fields = ['itemID', 'name', 'description', 'category', 'price', 'availability']