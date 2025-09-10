from django.db import models
from Customer.models import Customer
from Staff.models import Staff

class Order(models.Model):
    orderNumber = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="orders")
    employee = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name="orders")
    orderDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.orderNumber}"
    class Meta:
        db_table = "order"  # custom table name