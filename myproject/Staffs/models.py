from django.db import models
class Staff(models.Model):
    ROLE_CHOICES = (
        ('Waiter', 'Waiter'),
        ('Chef', 'Chef'),
        ('Manager', 'Manager'),
        ('Cashier', 'Cashier'),
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    hire_date = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

class Meta:
        db_table = "staff"  # custom table name