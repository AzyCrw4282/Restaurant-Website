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


def db_objects_to_list_of_dicts(objects):
    '''
    converts multiple db objects to a list of it's dictionaries
    :param objects:
    :return:
    '''
    list = []
    for db_object in objects:
        list.append(db_object.to_dict())
    return list


def menu(request):
    #     create a unique id as a temp solution for now and redirect the person to uuid/menu :D
    #     right now this is generated automatically,
    #   this should be done by some code the user can enter? discuss with client?
    tables = Table.objects.all()
    for table in tables:
        print("AVAILABLE TABLES:", table.id, ": ", table.number)
    return render(
        request, 'menu/templates/welcome_page.html', context={})
def menu_with_id(request, table_id):
    """
    Serves Main menu screen with relevant data
    :param request:
    :return: menu.html with data (rendered)
    """
    if request.method == 'POST':
        print("TABLE ID: ", table_id)
    print("TABLE ID: ", table_id)
    try:
        Table.objects.get(id=table_id)
    except:
        HttpResponseRedirect("/menu/")

    print("called menu")

    response_dict = {
        "food_list": db_objects_to_list_of_dicts(Food.objects.all()),
        "category_list": db_objects_to_list_of_dicts(FoodCategory.objects.all()),
        "food_information_list": db_objects_to_list_of_dicts(FoodInformation.objects.all())}

    # converting to json
    response_json = json.dumps(response_dict)
    context = {"category_list": response_json}
    return render(
        request, 'menu/templates/menu.html', context)


def get_menu_popup_data(request, table_id):
    """
    Updates the popup with current order
    :param request, contains 'order_id' (some key?) for now the table number
    :return: json containing the table order with the order items inside.
    """
    #     try to get the table order
    print("CALLED MENU_POPUP_UPDATE")
    # check if the id is in the database first, if it is
    # try getting an order associated with that id

    try:
        table_order = TableOrder.objects.get(id=table_id)
        table_order_items=TableOrder.orders.all()
        # convert to dict:
        response_dict={"table_order":table_order.to_dict()}
        # replace the order items (id's to the object dictionaries)
        temp=response_dict["table_order"]
        temp["orders"]=db_objects_to_list_of_dicts(table_order_items)
        # calc total price
        total_price=0
        for order_item in table_order_items:
            total_price+= order_item.food.price
        response_dict.update({'total_price': total_price})
        if (table_order.client_confirmed):
            status = "submitted"
        else:
            status = "not-submitted"
        response_dict.update({"order_submitted": status})
        response = {
            'success': True,
            'message': json.dumps(response_dict)  # Dumps data and creates a string
        }

        return JsonResponse(response)  # Response returned to ajax call


    except Exception as e:
        print("EXCEPTION menu_popup_update: ", e)
        return JsonResponse(UNSUCCESSFUL_RESPONSE)



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
    # return render(request, 'menu/templates/welcome_page.html', context)


# =========== INSET INTO DB FUNCTIONS ==========================
def submit_order(request, table_id):
    print("CALLED SUBMIT ORDER")
    try:
        table_order = TableOrder.objects.get(id=table_id)
        table_order.client_confirmed = True
        table_order.save()
        #     UPDATE THE WAITER HERE?
        return HttpResponseRedirect("/menu/" + table_id + "/")

    except Exception as e:
        print("FAIlED to submit order: ", e)
        print("redirecting")
        return HttpResponseRedirect("/menu/" + table_id + "/")

def add_food_to_order(request, table_id):
    """
    Adds an order item to an existing table-order
    or to a new table-order
    :param request:
    :return: success/failure
    """
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
                    client_confirmed=False,
                    chef_confirmed=False,
                    waiter_confirmed=False
                )
                table_order.save()
            except Exception as e:
                # failure, print exception for debug
                print("FAILED TO CREATE ORDER: ", e)
                response = UNSUCCESSFUL_RESPONSE

                return JsonResponse(response)

        try:
            if not table_order.client_confirmed:
                # try to create order object that is to be added to the table order
                order = Order.objects.create(
                    food=Food.objects.get(id=request.POST['food_id']),
                    comment="comment: " + request.POST['comment'],
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
# =========== DELETE FROM DB FUNCTIONS:=========================

def delete_food_from_order(request, table_id):
    print("DELETING FOOD ORDER ITEM")
    try:
        table_order = TableOrder.objects.get(id=table_id)
        if not table_order.client_confirmed:
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

