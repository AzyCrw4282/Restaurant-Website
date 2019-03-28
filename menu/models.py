from django.contrib.auth.models import Group
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
import json
import os

# Table( _id  )
with open("config.json") as json_data_file:
    data = json.load(json_data_file)
table_order_states = data["table_order_states"]
order_states = data["order_states"]


# class Waiter(models.Model):
#     member=models.user
class Table(models.Model):
    '''
    Table Model
    '''
    number = models.IntegerField(default=0)
    id = models.TextField(primary_key=True)

    def to_dict(self):
        '''
        converts data held into dictionary format
        :return: dictionary
        '''
        dict = {"number": self.number, "id": self.id}
        return dict


class Waiter(models.Model):
    '''
    Waiter model (for waiter gorup)
    '''
    waiter = models.OneToOneField(User, on_delete=models.CASCADE)
    tables = models.ManyToManyField(Table)

    def to_dict(self):
        '''
        returns data held in dict format
        :return: dictionary
        '''
        table_list = []
        for table in self.tables.all():
            table_list.append(table.to_dict())
        t_dict = {"username": self.waiter.username, "table_list": table_list}
        return t_dict


# FoodInformation( _id, name,ingredients)
class FoodInformation(models.Model):
    '''
    Food information model
    '''
    name = models.CharField(default="", max_length=30)
    ingredients = models.CharField(default="", max_length=200)

    def to_dict(self):
        '''
        returns data held in dict format
        :return: dictionary
        '''
        dict = {"name": self.name, "id": self.id, "ingredients": self.ingredients}
        return dict


# FoodCategory( _id, name)
class FoodCategory(models.Model):
    '''
    Food category model
    '''
    name = models.CharField(default="", max_length=30)

    def to_dict(self):
        dict = {"name": self.name, "id": self.id}
        return dict


def get_image_path(instance, filename):
    '''
    gets the path to to the image directory and appends the file name to it
    :param instance:
    :param filename:
    :return: directory path
    '''
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
        '''
        returns all the information on this model in a dictionary format.
        :return:
        '''
        dict = {"name": self.name, "price": self.price, "id": self.id, "category": self.category.id,
                "information": [], "description": self.description, "picture": self.picture.__str__(),
                "display": self.display.__str__()}
        for info in self.information.all():
            dict["information"].append(info.id)
        return dict


# Archived table order
class ArchivedTableOrder(models.Model):
    json_table_order = models.TextField(max_length=2000)
    id = models.TextField(primary_key=True)

    def to_dict(self):
        '''
        returns the stored "state" of itself
        :return:
        '''
        dict = json.loads(self.json_table_order)
        return dict

    def to_chart_data(self):
        '''
        unpacks and creates a dictionary of relevant held data for the chart
        :return:
        '''
        table_order = self.to_dict()
        total = 0
        for order in table_order["orders"]:
            total += order["food_price"]
        dict = {"time": table_order["time"].__str__(), "total": total, "waiter": table_order["waiter"]}
        return dict


# TableOrder ( _id , orders:MtM(Order),Table_id, time, status)
class TableOrder(models.Model):
    waiter = models.ForeignKey(Waiter, on_delete=models.SET_NULL, default=None, null=True)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    time = models.DateTimeField(default=datetime.now(), auto_now=False, blank=True, null=True)
    status = models.TextField(default=table_order_states["client_created"])
    id = models.TextField(primary_key=True)

    def to_archived(self):
        '''
        returns all information required to save an archived instance of the order
        :return:
        '''
        waiter_username = "none"
        if (self.waiter != None):
            waiter_username = self.waiter.waiter.username
        dict = {"orders": [], "table": self.table.id, "time": self.time.__str__(), "status": "archived",
                "id": self.id, "table_number": self.table.number, "waiter": waiter_username}
        for order in self.order_set.all():
            dict["orders"].append(order.to_dict())

        return json.dumps(dict)

    def to_dict(self):
        '''
        returns all the information on this model in a dictionary format.
        :return:
        '''
        waiter_username = "none"

        if (self.waiter != None):
            waiter_username = self.waiter.waiter.username
        dict = {"orders": [], "table": self.table.id, "time": self.time.__str__(), "status": self.status,
                "id": self.id, "waiter": waiter_username}
        for order in self.order_set.all():
            dict["orders"].append(order.id)
        return dict


# Order( _id , Food_id  ,comment , status)
class Order(models.Model):
    '''
    Order model
    '''
    table_order = models.ForeignKey(TableOrder, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    comment = models.CharField(default="", max_length=200)
    status = models.TextField(default=order_states["cooking"])

    def to_dict(self):
        '''
        converts the data held to a dictionary
        :return: dictionary
        '''
        dict = {"food": self.food.id, "food_name": self.food.name, "food_price": self.food.price,
                "comment": self.comment, "id": self.id, "status": self.status, "table_order": self.table_order.id}
        return dict

# Create your models here.

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
