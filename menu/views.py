# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S

from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
from .models import Table, Customer, Order, Food, FoodCategory
from datetime import datetime
from django.http import JsonResponse
import json


# from MenuView.models import
# from MenuView.forms import
# ---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES


#
#
# Menu( _id, name )
# needs to pass categories object to menu in the form:
#  category_list={
#       "mains": [
#              {"name": "Tacos with cereal", "price": "£5"},
#              {"name": "Tacos", "price": "£2"},
#              {"name": "Tacos with toast", "price": "£3"}],
#       },
#       "sides":[
#               {"name": "Tacos with cereal", "price": "£5"},
#              {"name": "Tacos", "price": "£2"},
#              {"name": "Tacos with toast", "price": "£3"}],

#       ]
#  the schema is:


#  FoodCategory( _id, name)
#  Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )
def menu(request):
    print("called menu")
    # constructing categories object as described above:
    category_list = {}
    categories = FoodCategory.objects.all()

    for category in categories:
        foods_list = []
        print("CATEGORY: ", category.name)
        category_foods = category.food_set.all()

        for food in category_foods:
            food_dict = {}
            food_dict.update({"name": food.name})
            food_dict.update({"price": food.price})
            foods_list.append(food_dict)
        print("CATEGORY FOODS: ", foods_list)
        category_list.update({category.name: foods_list})
    js_data = json.dumps(category_list)
    context = {"category_list": js_data}
    print("Sending: ", context)
    return render(
        request, 'menu/templates/menu.html', context)


def add_stuff(request):
    print("called menu")
    user = request.user
    context = {'user': user}
    return render(
        request, 'menu/templates/insert_example.html', context)


# THE BELOW ARE JUST WORKING EXAMPLES FOR REFERENCE, TO BE SCRAPPED
def table_list(request):
    tables = Table.objects.all()
    for table in tables:
        print("tables: " + table.id)
    context = {'tables': tables}
    return render(request, 'menu/templates/tables.html', context)
