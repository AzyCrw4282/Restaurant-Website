from django.db import models

# Create your models here.
class Table(models.Model):
    number_of_customers:models.IntegerField(default=0)
    reservation_date:models.DateField()


class Menu(models.Model):
    menu_item_id:models.IntegerField(default=0)
    menu_food:models.CharField(max_length=30)



class Order(models.Model):
    order_id:models.IntegerField(default=0)



class Customer(models.Model):
    customer_id:models.IntegerField(default=0)
    table_id =  models.ForeignKey(Table, on_delete=models.CASCADE)

    """name: models.CharField(max_length=20)
    table = models.ForeignKey(Table,on_delete=models.CASCADE)"""

