# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S

from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
from .models import FoodCategory,FoodInformation,Food

from datetime import datetime
from django.http import JsonResponse
import json


# from MenuView.models import
# from MenuView.forms import
# ---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES


# FoodCategory( _id, name)
# Food( _id ,display, name, price, category_id , information: MtM(FoodInformation), description, picture )
# FoodInformation( _id, name,description)

# {
#     "food_information":[
#         {"id":id,"name":name},
#         {"id":id,"name":name}
#     ],
#     "food_categories":[
#         {"id":id,"name":name},
#         {"id":id,"name":name},
#         {"id":id,"name":name}
#     ],
# "foods":[
#     {"id":id,"display":display,"name":name,"price":price,"category_id":catogory_id,"food_information":[
#         {"id":id},
#         {"id":id},
#         {"id":id},
#     ],"description":description,"picture":picture},
# ]
#
# }
def menu(request):
    print("called menu")
    # constructing categories object as described above:
    temp={}

    food_information_objects=FoodInformation.objects.all()
    food_objects=Food.objects.all()
    food_category_objects=FoodCategory.objects.all()


    food_information_list=[]
    for food_information_object in food_information_objects:
        temp_dict={"id":food_information_object.id,"name":food_information_object.name}
        food_information_list.append(temp_dict)


    food_category_list=[]
    for food_category_object in food_category_objects:
        temp_dict={"name":food_category_object.name,"id":food_category_object}
        food_category_list.append(temp_dict)

    # "foods": [
        #     {"id":id,"display":display,"name":name,"price":price,"category_id":catogory_id,"food_information":[
        #         {"id":id},
        #         {"id":id},
        #         {"id":id},
        #     ],"description":description,"picture":picture},
        # ]

    food_list = []
    for food_object in food_objects:
        temp_dict={}
        temp_dict.update({"id":food_object.id})
        temp_dict.update({"display": food_object.dispaly})
        temp_dict.update({"name": food_object.name})
        temp_dict.update({"price": food_object.price})
        temp_dict.update({"category_id": food_object.category_id})
        temp_dict.update({"food_information": []})
        for category_id in food_object.food_information.all():
            temp_dict["food_information"].append({"id":category_id})
        temp_dict.update({"description": food_object.description})
        temp_dict.update({"picture": food_object.picture})
    temp.update({"food_information":food_information_list,"food_categories":food_category_list,"foods":food_list})
    js_data = json.dumps(temp)
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


