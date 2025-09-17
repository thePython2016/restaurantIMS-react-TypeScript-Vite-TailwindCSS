from django.db import models

class Inventory(models.Model):
    inventoryID = models.AutoField(primary_key=True)
    itemName = models.CharField(max_length=100, null=False, blank=False)
    description = models.TextField(null=True, blank=True, default='')
    unitOfMeasure = models.CharField(max_length=20, null=False, blank=False)  # e.g., 'kg', 'liters', 'pieces'
    quantity = models.PositiveIntegerField(default=0)
    reorderLevel = models.PositiveIntegerField(default=0)
    dateAdded = models.DateField(auto_now_add=True)
    lastUpdated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.itemName} ({self.quantity} {self.unitOfMeasure})"
    
    class Meta:
        db_table = "Inventory"
        verbose_name_plural = "Inventory Items"
