from django.db import models

# Create your models here.
class Table(models.Model):
    number_of_customers:models.IntegerField(default=0)
    reservation_date:models.DateField()


class Customer(models.Model):
    name=models.CharField(max_length=20)
    table=models.ForeignKey(Table,on_delete=models.CASCADE)
