from django.db import models
class Item(models.Model):
    itemID = models.AutoField(primary_key=True)
    itemName = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.itemName
    class Meta:
        db_table = "Item"  # custom table name