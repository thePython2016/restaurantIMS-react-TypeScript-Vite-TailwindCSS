from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import IntegrityError, models
from django.http import Http404
from .models import InventoryItems
from .serializers import InventoryItemsSerializer

class InventoryItemsViewSet(viewsets.ModelViewSet):
    queryset = InventoryItems.objects.all()
    serializer_class = InventoryItemsSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new inventory item"""
        try:
            data = request.data.copy()
            print(f"Received inventory data: {data}")  # Debug logging
            
            serializer = self.get_serializer(data=data)
            
            if serializer.is_valid():
                inventory_item = serializer.save()
                return Response({
                    'success': True,
                    'message': 'Inventory item created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except IntegrityError as e:
            if 'item_name' in str(e).lower():
                return Response({
                    'success': False,
                    'message': 'Item name already exists for this date',
                    'errors': {'item_name': ['This item already exists for the selected date']}
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error creating inventory item: {str(e)}")  # Debug logging
            return Response({
                'success': False,
                'message': f'An error occurred while creating inventory item: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def perform_create(self, serializer):
        """
        Perform the creation of the inventory item
        """
        serializer.save()
    
    def update(self, request, pk=None):
        """Update an inventory item"""
        try:
            inventory_item = InventoryItems.objects.get(pk=pk)
            serializer = self.get_serializer(inventory_item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except InventoryItems.DoesNotExist:
            return Response({'error': 'Inventory item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, pk=None):
        """Delete an inventory item"""
        try:
            inventory_item = InventoryItems.objects.get(pk=pk)
            inventory_item.delete()
            return Response({'message': 'Inventory item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except InventoryItems.DoesNotExist:
            return Response({'error': 'Inventory item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search inventory items"""
        try:
            query = request.GET.get('q', '')
            date_filter = request.GET.get('date_filter', '')
            
            queryset = self.get_queryset()
            
            if query:
                queryset = queryset.filter(
                    models.Q(item_name__icontains=query) |
                    models.Q(unit_of_measure__icontains=query)
                )
            
            if date_filter:
                queryset = queryset.filter(date=date_filter)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class InventoryItemsListViewSet(viewsets.ModelViewSet):
    """
    Separate ViewSet specifically for inventory items list operations
    This provides a different endpoint for inventory list functionality
    """
    queryset = InventoryItems.objects.all()
    serializer_class = InventoryItemsSerializer
    
    def list(self, request):
        """Get all inventory items with formatted data for frontend"""
        try:
            inventory_queryset = InventoryItems.objects.all()
            
            # Custom formatting for frontend
            inventory_data = []
            for item in inventory_queryset:
                item_dict = {
                    'id': item.id,
                    'date': item.date,
                    'item_name': item.item_name,
                    'unit_of_measure': item.unit_of_measure,
                }
                inventory_data.append(item_dict)
            
            return Response(inventory_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch inventory data: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, pk=None):
        """Get a specific inventory item by ID"""
        try:
            item = InventoryItems.objects.get(pk=pk)
            item_dict = {
                'id': item.id,
                'date': item.date,
                'item_name': item.item_name,
                'unit_of_measure': item.unit_of_measure,
            }
            return Response(item_dict, status=status.HTTP_200_OK)
        except InventoryItems.DoesNotExist:
            raise Http404("Inventory item not found")
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch inventory item: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, pk=None):
        """Update an inventory item"""
        try:
            item = InventoryItems.objects.get(pk=pk)
            serializer = self.get_serializer(item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except InventoryItems.DoesNotExist:
            return Response({'error': 'Inventory item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, pk=None):
        """Delete an inventory item"""
        try:
            item = InventoryItems.objects.get(pk=pk)
            item.delete()
            return Response({'message': 'Inventory item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except InventoryItems.DoesNotExist:
            return Response({'error': 'Inventory item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
