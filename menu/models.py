from django.db import models
from django.utils.timezone import now

from datetime import datetime

# Create your models here

# CONVENTIONS:
# class title : CamelCase
# element naming: example_element
#

# notes:
# a constant system for max length should be looked into

# Table( _id , max_customers )
class Table(models.Model):
    max_customers = models.IntegerField(default=0)


# FoodAlergies( _id, name)
class FoodAllergies(models.Model):
    name = models.CharField(default="", max_length=30)


# FoodCategory( _id, name)
class FoodCategory(models.Model):
    name = models.CharField(default="", max_length=30)


# Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )
class Food(models.Model):
    name = models.CharField(default="", max_length=30)
    price = models.IntegerField(default=0)
    category = models.ForeignKey(FoodCategory, on_delete=models.CASCADE)
    allergy = models.ManyToManyField(FoodAllergies)


# Customer ( _id , Table_id)
class Customer(models.Model):
    name = models.CharField(default="", max_length=20)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)


# Order( _id , Food_id  , Customer_id , time )
class Order(models.Model):
    food = models.ManyToManyField(Food)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now=True, blank=True, null=True)

# Table( _id , max_customers, )
#
# Customer ( _id , name , Table_id)
#
# Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )
#
# FoodAlergies( _id, name)
#
# FoodCategory( _id, name)
#
# Order( _id , Food_id  , Customer_id , time_of_order )
#
# waiter( _id , Order_id , Table_id , Customer_id )
