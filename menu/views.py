# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S

from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
from .models import FoodCategory,Table
from datetime import datetime
from django.http import JsonResponse
import json


# from MenuView.models import
# from MenuView.forms import
# ---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES


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

def welcome_page(request):
    print("called welcome_page")
    tables=Table.objects.all()
    context={"tables":tables}
    return render(request,'menu/templates/welcome_page.html',context)

def add_stuff(request):
    print("called menu")
    user = request.user
    context = {'user': user}
    return render(
        request, 'menu/templates/../waiter/templates/insert_example.html', context)


