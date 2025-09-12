from django.db import models

class Item(models.Model):
    itemID = models.AutoField(primary_key=True)
    itemName = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)  # Changed from TextField to CharField
    price = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.CharField(max_length=20, default='Available')  # Added availability field

    def __str__(self):
        return self.itemName
    
    class Meta:
        db_table = "Item"  # custom table name