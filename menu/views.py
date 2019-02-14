# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S

from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
from .models import FoodCategory, FoodInformation, Food, Table

from datetime import datetime
from django.http import JsonResponse
import json
import uuid
from menu.models import Table, FoodInformation, Order, Food, FoodCategory, TableOrder

# from MenuView.models import
# from MenuView.forms import
# ---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES


UNSUCCESSFUL_RESPONSE = {
    'success': True,
    'message': 'FAILURE '
}
SUCCESSFUL_RESPONSE = {
    'success': False,
    'message': 'SUCCESS'
}


def menu(request):
    #     create a unique id as a temp solution for now and redirect the person to uuid/menu :D
    #     right now this is generated automatically,
    #   this should be done by some code the user can enter? discuss with client?
    tables=Table.objects.all()
    for table in tables:
        print("AVAILABLE TABLES:",table.id)
    return render(
        request, 'menu/templates/welcome_page.html',context={})


def menu_with_id(request, table_id):
    if request.method=='POST':
        print("TABLE ID: ",table_id)
    print("TABLE ID: ", table_id)

    try:
        Table.objects.get(id=table_id)
    except:
        HttpResponseRedirect("/menu/")
    """
    Serves Main menu screen with relevant data
    :param request:
    :return: menu.html with data (rendered)
    """
    print("called menu")
    # constructing categories object as described above:
    # temporary dictionary to which we will add the data to be sent from the database
    temp = {}
    # loading all the data from the database
    food_information_objects = FoodInformation.objects.all()
    food_objects = Food.objects.all()
    food_category_objects = FoodCategory.objects.all()

    # creating relevant data struture for each schema to be sent in json
    food_information_list = []
    for food_information_object in food_information_objects:
        temp_dict = {"id": food_information_object.id, "name": food_information_object.name}
        food_information_list.append(temp_dict)

    food_category_list = []
    for food_category_object in food_category_objects:
        temp_dict = {"name": food_category_object.name, "id": food_category_object.id}
        food_category_list.append(temp_dict)

    food_list = []
    for food_object in food_objects:
        temp_dict = {}
        temp_dict.update({"id": food_object.id})
        temp_dict.update({"display": food_object.display})
        temp_dict.update({"name": food_object.name})
        temp_dict.update({"price": food_object.price})
        temp_dict.update({"category_id": food_object.category_id})
        temp_dict.update({"food_information": []})
        for category_id in food_object.information.all():
            temp_dict["food_information"].append({"id": category_id})
        temp_dict.update({"description": food_object.description})
        temp_dict.update({"picture": food_object.picture.__str__()})
        food_list.append(temp_dict)

    #   updating the temp with the created data structures
    temp.update({"food_information": food_information_list, "food_categories": food_category_list, "foods": food_list})

    # converting to json
    js_data = json.dumps(temp)
    context = {"category_list": js_data}
    return render(
        request, 'menu/templates/menu.html', context)


def delete_food_from_order(request, table_id):
    print("DELETING FOOD ORDER ITEM")
    try:
        table_order = TableOrder.objects.get(id=table_id)
        if not table_order.submitted:
            order = table_order.orders.get(id=request.POST["order_id"])
            order.delete()
            return JsonResponse(SUCCESSFUL_RESPONSE)
        else:
            return JsonResponse(UNSUCCESSFUL_RESPONSE)


    except Exception as e:
        print("Failed reson: ", e)
        return JsonResponse(UNSUCCESSFUL_RESPONSE)


def delete_table_order(request, table_id):
    """
    Deletes table_order from the database if exists
    :param request:
    :return: success
    """
    if request.method == 'POST':
        try:
            table_order = TableOrder.objects.get(id=table_id)

            table_order.delete()
        except:
            print("System failed to delete")

def submit_order(request,table_id):
    print("CALLED SUBMIT ORDER")
    try:
        table_order=TableOrder.objects.get(id=table_id)
        table_order.submitted=True
        table_order.save()
    #     UPDATE THE WAITER HERE?
        return HttpResponseRedirect("/menu/"+table_id+"/")

    except Exception as e:
        print("FAIlED to submit order: ",e)
        print("redirecting")
        return HttpResponseRedirect("/menu/"+table_id+"/")

def get_menu_popup_data(request, table_id):
    """
    Updates the popup with current order
    :param request, contains 'order_id' (some key?) for now the table number
    :return: json containing table_order
    """
    #     try to get the table order
    print("CALLED MENU_POPUP_UPDATE")
    # check if the id is in the database first, if it is
    # try getting an order associated with that id

    try:
        table_order = TableOrder.objects.get(id=table_id)
        #     convert to the relevant format (json)
        data = {}
        data.update({"table_order": []})
        # need to pass each_order(name, price), total price
        total_price = 0
        orders=table_order.orders.all()
        print(orders)
        for order in orders:
            total_price += order.food.price
            food_name = order.food.name
            food_price = order.food.price
            data['table_order'].append({'order_id':order.id,'food_price': food_price, 'food_name': food_name, 'food_comment':order.comment})
        data.update({'total_price': total_price})
        if(table_order.submitted):
            status="submitted"
        else:
            status="not-submitted"
        data.update({"order_submitted":status})
        response = {
            'success': True,
            'message': json.dumps(data)#Dumps data and creates a string
        }
        return JsonResponse(response)#Response returned to ajax call


    except Exception as e:
        print("EXCEPTION menu_popup_update: ", e)
        return JsonResponse(UNSUCCESSFUL_RESPONSE)


def add_food_to_order(request, table_id):
    """
    Adds an order item to an existing table-order
    or to a new table-order
    :param request:
    :return: success/failure
    """
    # check if the id is in the database first, if it is
    # try getting an order associated with that id
    # or make a new order where the id is that id :D
    # add the stuff to that order
    # order get's deleted after half an hour
    if request.method == 'POST':
        # check if table_order exists given some arbitrary key
        # just using the table number for now.
        try:
            table_order = TableOrder.objects.get(id=table_id)
            print("ORDER EXISTS ")
        except:
            # doesnt exist so try making a new one
            print("ORDER DOES NOT EXIST CREATING ONE")
            try:
                table_order = TableOrder.objects.create(
                    id=table_id,
                    table=Table.objects.get(id=table_id),
                    time=request.POST['time'],
                    status=False
                )
                table_order.save()
            except Exception as e:
                # failure, print exception for debug
                print("FAILED TO CREATE ORDER: ", e)
                response = UNSUCCESSFUL_RESPONSE

                return JsonResponse(response)

        try:
            if not table_order.submitted:
                # try to create order object that is to be added to the table order
                order = Order.objects.create(
                    food=Food.objects.get(id=request.POST['food_id']),
                    comment="comment: " + request.POST['comment'],
                    status=False
                )
                table_order.orders.add(order)
                response = SUCCESSFUL_RESPONSE
            else:
                response = UNSUCCESSFUL_RESPONSE

        except Exception as e:
            print("FAILED TO CREATE ORDER: ", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)
    else:
        pass


def welcome_page(request):
    """
    This is an optional welcome page,
    most probably scrapped.
    :param request:
    :return:
    """
    print("called welcome_page")
    tables = Table.objects.all()
    table_list = []
    for table in tables:
        table_list.append({"id": table.id})
    context = {"tables": table_list}
    print("sending context: ", context)
    return render(request, 'menu/templates/welcome_page.html', context)
