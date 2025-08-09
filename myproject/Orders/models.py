from django.db import models
class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Served', 'Served'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    )
    # customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    # staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name='orders')
    # items = models.ManyToManyField(Item, through='OrderItem')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"Order #{self.id} - {self.customer}"
    class Meta:
        db_table = "order"  # custom table name