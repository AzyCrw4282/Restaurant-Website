from django.db import models
from django.contrib.auth.models import Group
from django.utils.timezone import now
import json
from datetime import datetime
import os
import uuid

# Create your models here

# CONVENTIONS:
# class title : CamelCase
# element naming: example_element
#

# notes:
# a constant system for max length should be looked into
from django.db import models
from django.utils.timezone import now
import json
from datetime import datetime
import os
import uuid

# Create your models here

# CONVENTIONS:
# class title : CamelCase
# element naming: example_element
#

# notes:
# a constant system for max length should be looked into

# Table( _id  )
with open('config.json') as json_data_file:
    data = json.load(json_data_file)
table_order_states = data["table_order_states"]
order_states = data["order_states"]


# class Waiter(models.Model):
#     member=models.user
class Table(models.Model):
    number = models.IntegerField(default=0)
    id = models.TextField(primary_key=True)

    def to_dict(self):
        dict = {"number": self.number, "id": self.id}
        return dict


# FoodInformation( _id, name,ingredients)
class FoodInformation(models.Model):
    name = models.CharField(default="", max_length=30)
    ingredients = models.CharField(default="", max_length=200)

    def to_dict(self):
        dict = {"name": self.name, "id": self.id, "ingredients": self.ingredients}
        return dict


# FoodCategory( _id, name)
class FoodCategory(models.Model):
    name = models.CharField(default="", max_length=30)

    def to_dict(self):
        dict = {"name": self.name, "id": self.id}
        return dict


def get_image_path(instance, filename):
    print(os.path.join('img/food/', filename))
    return os.path.join('img/food/', filename)


# Food( _id ,display, name, price, category_id , information: MtM(FoodInformation), description, picture )
class Food(models.Model):
    name = models.CharField(default="", max_length=30)
    price = models.FloatField(default=0)
    category = models.ForeignKey(FoodCategory, on_delete=models.CASCADE)
    information = models.ManyToManyField(FoodInformation)
    description = models.CharField(default="", max_length=200)
    picture = models.ImageField(upload_to='img/food/', blank=True, null=True)
    display = models.BooleanField(default=True)

    def to_dict(self):
        dict = {"name": self.name, "price": self.price, "id": self.id, "category": self.category.id,
                "information": [], "description": self.description, "picture": self.picture.__str__(),
                "display": self.display.__str__()}
        for info in self.information.all():
            dict["information"].append(info.id)
        return dict


# Order( _id , Food_id  ,comment , status)
class Order(models.Model):
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    comment = models.CharField(default="", max_length=200)
    status = models.TextField(default=order_states["cooking"])

    def to_dict(self):
        dict = {"food": self.food.id, "food_name": self.food.name, "food_price": self.food.price,
                "comment": self.comment, "id": self.id, "status": self.status}
        return dict


# TableOrder ( _id , orders:MtM(Order),Table_id, time, status)
class TableOrder(models.Model):
    orders = models.ManyToManyField(Order)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now=False, blank=True, null=True)
    status = models.TextField(default=table_order_states["client_created"])
    id = models.TextField(primary_key=True)

    def to_cost_date(self):
        total = 0
        for order in self.orders.all():
            total += order.food.price
        dict = {self.time.__str__(): total}

        return dict

    def to_dict(self):
        dict = {"orders": [], "table": self.table.id, "time": self.time.__str__(), "status": self.status,
                "id": self.id}
        for order in self.orders.all():
            dict["orders"].append(order.id)
        return dict

# Table( _id  )
#
# FoodInformation( _id, name,description)
#
# FoodCategory( _id, name)
#
# Food( _id, display, name, price, category_id , information: MtM(FoodInformation), description, picture )
#
# Order( _id , Food_id  ,comment , status)
#
# TableOrder ( _id , orders:MtM(Order),Table_id, time)
#
