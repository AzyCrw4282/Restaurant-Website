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

# Table( _id  )
class Table(models.Model):
    pass


# FoodInformation( _id, name,description)
class FoodInformation(models.Model):
    name = models.CharField(default="", max_length=30)
    ingredients = models.CharField(default="", max_length=200)


# FoodCategory( _id, name)
class FoodCategory(models.Model):
    name = models.CharField(default="", max_length=30)


# Food( _id, name,price, category_id , information: MtM(FoodInformation),description,picture )
class Food(models.Model):
    name = models.CharField(default="", max_length=30)
    price = models.FloatField(default=0)
    category = models.ForeignKey(FoodCategory, on_delete=models.CASCADE)
    information = models.ManyToManyField(FoodInformation)
    description = models.CharField(default="", max_length=200)
    picture = models.ImageField


# Order( _id , Food_id  ,comment , status)
class Order(models.Model):
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    comment = models.CharField(default="", max_length=200)
    status = models.BooleanField(default="")


# TableOrder ( _id , order:MtM(Order),Table_id, time)
class TableOrder(models.Model):
    order = models.ManyToManyField(Order)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
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
