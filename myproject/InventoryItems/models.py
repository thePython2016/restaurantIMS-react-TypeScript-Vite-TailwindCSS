from django.db import models

# Create your models here.
class InventoryItems(models.Model):
    date = models.DateField()  # from your form
    item_name = models.CharField(max_length=255)  # from your form
    unit_of_measure = models.CharField(max_length=50)  # from your form

    def __str__(self):
        return f"{self.item_name} ({self.quantity} {self.unit_of_measure})"

    class Meta:
        db_table = "InventoryItems"  # custom table name