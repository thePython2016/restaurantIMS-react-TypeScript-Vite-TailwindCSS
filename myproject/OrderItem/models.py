from django.db import models

# Create your models here.
class OrderItem(models.Model):
    # order = models.ForeignKey(Order, on_delete=models.CASCADE)
    # item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.item.name} (x{self.quantity}) for Order #{self.order.id}"
    class Meta:
        db_table = "orderitem"  # custom table name