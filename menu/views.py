# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S

from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
from .models import FoodCategory,FoodInformation,Food,Table

from datetime import datetime
from django.http import JsonResponse
import json

from menu.models import Table, FoodInformation, Order, Food, FoodCategory, TableOrder
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


def delete_table_order(request):

    if (request.method == 'POST'):
        try:
            table_order = TableOrder.objects.get(id = request.POST['table_order_id'])

            table_order.delete()
        except:
            print("System failed to delete")



def add_order(request):
    if request.method == 'POST':
        print("Order is ready to be sent")

        try:
            #Create objects below
            temp = TableOrder.objects.create(
                table = request.POST['table'],
                time = request.POST['time'],
                status = request.POST['status']

            )
            temp.save()
            temp2 = Order.objects.create(
                food = Food.objects.get(id = request.POST['food_id']),
                comment = request.POST['comment'],
                status = request.POST['status']
            )
            temp2.save()

            temp3 = Food.objects.create(
                name = request.POST['name'],
                price = request.POST['price'],
                category = request.POST['category'],
                information = request.POST['information'],
                description = request.POST['description']

            )
            temp3.save()
            temp2.Food.add(temp3)
            temp.orders.add(temp2)
            response = {
                'status': 1,
                'message': 'added food'
            }
        except Exception as e:
            print("EXCEPTION THROWN: ", e)

            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return JsonResponse(response)
    else:
        pass





















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
        temp_dict={"name":food_category_object.name,"id":food_category_object.id}
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
        temp_dict.update({"display": food_object.display})
        temp_dict.update({"name": food_object.name})
        temp_dict.update({"price": food_object.price})
        temp_dict.update({"category_id": food_object.category_id})
        temp_dict.update({"food_information": []})
        for category_id in food_object.information.all():
            temp_dict["food_information"].append({"id":category_id})
        temp_dict.update({"description": food_object.description})
        temp_dict.update({"picture": food_object.picture.__str__()})
        food_list.append(temp_dict)
    temp.update({"food_information":food_information_list,"food_categories":food_category_list,"foods":food_list})
    print(food_list)
    js_data = json.dumps(temp)
    context = {"category_list": js_data}

    print("Sending: ", context)
    return render(
        request, 'menu/templates/menu.html', context)

def welcome_page(request):
    print("called welcome_page")
    tables=Table.objects.all()
    table_list=[]
    for table in tables:
        table_list.append({"id":table.id})
    context={"tables":table_list}
    print("sending context: ",context)
    return render(request,'menu/templates/welcome_page.html',context)



