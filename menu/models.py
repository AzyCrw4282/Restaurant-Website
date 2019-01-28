from django.db import models


# Create your models here
# Table( _id , max_customers )
class Table(models.Model):
    max_customers= models.IntegerField(default=0)



# Food( _id, name )
class Food(models.Model):
    name= models.CharField(default="",max_length=30)


# Customer ( _id , Table_id)
class Customer(models.Model):
    name= models.CharField(default="",max_length=20)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)


# Order( _id , Food_id , Table_id , Customer_id , time )
class Order(models.Model):
    food= models.ForeignKey(Food, on_delete=models.CASCADE)
    customer= models.ForeignKey(Customer, on_delete=models.CASCADE)
    time= models.DateTimeField(null=True)

# Table( _id , max_customers, )
#
# Customer ( _id , name , Table_id)
#
# Food( _id, name )
#
# Order( _id , Food_id  , Customer_id , time_of_order )
#
# waiter( _id , Order_id , Table_id , Customer_id )
