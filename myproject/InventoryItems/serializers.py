from rest_framework import serializers
from .models import InventoryItems
from datetime import date

class InventoryItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItems
        fields = '__all__'
    
    def validate_date(self, value):
        """
        Validate that the date is not in the future
        """
        if value > date.today():
            raise serializers.ValidationError("Date cannot be in the future.")
        return value
    
    def validate_item_name(self, value):
        """
        Validate item name is not empty and has reasonable length
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Item name cannot be empty.")
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Item name must be at least 2 characters long.")
        return value.strip()
    
    def validate_unit_of_measure(self, value):
        """
        Validate unit of measure
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Unit of measure cannot be empty.")
        
        valid_units = ['kg', 'g', 'l', 'ml', 'pcs', 'dozen', 'box', 'pack', 'bottle', 'can']
        if value.lower() not in valid_units:
            raise serializers.ValidationError(
                f"Invalid unit of measure. Valid options are: {', '.join(valid_units)}"
            )
        return value.lower()
    
    def validate(self, data):
        """
        Object-level validation
        """
        # Check for duplicate items on the same date
        if InventoryItems.objects.filter(
            item_name__iexact=data.get('item_name', ''),
            date=data.get('date'),
            unit_of_measure__iexact=data.get('unit_of_measure', '')
        ).exists():
            raise serializers.ValidationError(
                "An inventory item with this name, date, and unit of measure already exists."
            )
        
        return data
