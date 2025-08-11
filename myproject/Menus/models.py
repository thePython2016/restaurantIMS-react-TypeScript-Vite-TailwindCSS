from django.db import models
class Menu(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    # items = models.ManyToManyField(Item, related_name='menus')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "menu"  # custom table name