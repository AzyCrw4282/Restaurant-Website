# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S

from django.shortcuts import render
from django.http import HttpResponseRedirect
from menu.models import Table, FoodInformation, Order, Food, FoodCategory, TableOrder
from datetime import datetime
from django.http import JsonResponse
import json
import uuid

with open("config.json") as json_data_file:
    data = json.load(json_data_file)
table_order_states = data["table_order_states"]

UNSUCCESSFUL_RESPONSE = {
    'success': False,
    'message': 'FAILURE '
}
SUCCESSFUL_RESPONSE = {
    'success': True,
    'message': 'SUCCESS'
}


def db_objects_to_list_of_dicts(objects):
    '''
    converts multiple db objects to a list of its dictionaries
    :param objects:
    :return:
    '''
    list = []
    for db_object in objects:
        list.append(db_object.to_dict())
    return list


# ======= NORMAL HTTP REQUESTS: =======================
def welcome_page(request):
    '''
    serves the welcome page
    :param request:
    :return:
    '''
    return render(
        request, 'menu/templates/welcome_page.html', context={})


def menu_unsafe(request, table_id):
    """
    determines if the table id provide is relevant by creating a new table order with it.
    :param request:
    :return: menu.html with data (rendered)
    """

    # checking authenticity of the table code by creating a table order with the table foreign key table_id
    try:
        table_order = TableOrder.objects.create(
            id=uuid.uuid4().__str__(),
            table=Table.objects.get(id=table_id)
        )
        table_order.save()
        return HttpResponseRedirect("/menu/table_order/" + table_order.id + "/")
    except Exception as e:
        return HttpResponseRedirect("/menu/")


def menu_safe(request, table_order_id):
    """
    Serves Main menu screen with relevant data
    :param request:
    :return: menu.html with data (rendered)
    """


    try:
        TableOrder.objects.get(id=table_order_id)
    except:
        return HttpResponseRedirect("/menu/")

    response_dict = {
        "food_list": db_objects_to_list_of_dicts(Food.objects.all()),
        "category_list": db_objects_to_list_of_dicts(FoodCategory.objects.all()),
        "food_information_list": db_objects_to_list_of_dicts(FoodInformation.objects.all())}
    # converting to json
    response_json = json.dumps(response_dict)
    context = {"category_list": response_json}
    return render(
        request, 'menu/templates/menu.html', context)



def get_menu_popup_data(request, table_order_id):
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
        table_order = TableOrder.objects.get(id=table_order_id)
        table_order_items = table_order.order_set.all()

        # convert to dict:
        response_dict = {"table_order": table_order.to_dict()}
        # replace the order items (id's to the object dictionaries)
        temp = response_dict["table_order"]
        temp["orders"] = db_objects_to_list_of_dicts(table_order_items)
        # calc total price
        total_price = 0
        for order_item in table_order_items:
            total_price += order_item.food.price
        response_dict["table_order"].update({'total_price': total_price})

        response = {
            'success': True,
            'message': json.dumps(response_dict)  # Dumps data and creates a string
        }

        return JsonResponse(response)  # Response returned to ajax call


    except Exception as e:
        print("EXCEPTION menu_popup_update: ", e)
        return JsonResponse(UNSUCCESSFUL_RESPONSE)


# =========== INSERT INTO DB FUNCTIONS ==========================
def submit_order(request, table_order_id):
    '''
    This function changes the status of the order to confirmed.
    :param request:
    :param table_order_id:
    :return:
    '''
    print("CALLED SUBMIT ORDER")
    try:
        table_order = TableOrder.objects.get(id=table_order_id)
        if table_order.status == table_order_states["client_created"]:
            table_order.status = table_order_states["client_confirmed"]
            table_order.time = datetime.now()
            table_order.save()
            #     UPDATE THE WAITER HERE?
        return HttpResponseRedirect("/menu/table_order/" + table_order_id + "/")

    except Exception as e:
        print("FAIlED to submit order: ", e)
        print("redirecting")
        return HttpResponseRedirect("/menu/table_order/" + table_order_id + "/")


def add_food_to_order(request, table_order_id):
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
            table_order = TableOrder.objects.get(id=table_order_id)
            print("ORDER EXISTS ")
        except:
            response = UNSUCCESSFUL_RESPONSE
            return JsonResponse(response)

        try:
            if table_order.status == table_order_states["client_created"]:
                # try to create order object that is to be added to the table order
                order = Order.objects.create(
                    food=Food.objects.get(id=request.POST['food_id']),
                    comment=request.POST['comment'],
                    table_order=table_order
                )
                response = SUCCESSFUL_RESPONSE
            else:
                response = UNSUCCESSFUL_RESPONSE

        except Exception as e:
            print("FAILED TO CREATE ORDER: ", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)
    else:
        pass

def payment_redirect(request, table_order_id):


    return render(
        request, 'menu/templates/payment_redirect.html', context={})


# =========== DELETE FROM DB FUNCTIONS:=========================

def delete_food_from_order(request, table_order_id):
    '''
    removes a food from the table order relation
    :param request:
    :param table_order_id:
    :return:
    '''
    print("DELETING FOOD ORDER ITEM")
    try:
        table_order = TableOrder.objects.get(id=table_order_id)
        if table_order.status == table_order_states["client_created"]:
            order = table_order.order_set.get(id=request.POST["order_id"])
            order.delete()
            return JsonResponse(SUCCESSFUL_RESPONSE)
        else:
            print("UNSUCESSFUL")
            return JsonResponse(UNSUCCESSFUL_RESPONSE)


    except Exception as e:
        print("Failed reson: ", e)
        return JsonResponse(UNSUCCESSFUL_RESPONSE)


def delete_table_order(request, table_order_id):
    """
    Deletes table_order from the database if exists
    :param request:
    :return: success
    """
    if request.method == 'POST':
        try:
            table_order = TableOrder.objects.get(id=table_order_id)
            table_order.delete()
        except:
            print("System failed to delete")
