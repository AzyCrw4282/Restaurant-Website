from django.shortcuts import render
from menu.models import TableOrder
from menu.models import Order
from django.http import JsonResponse

import random
import json


# Create your views here.
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
    converts multiple db objects to a list of it's dictionaries
    :param objects:
    :return:
    '''
    list = []
    for db_object in objects:
        list.append(db_object.to_dict())
    return list


def main_page(request):
    # pass the order item's to the waiter
    table_orders = TableOrder.objects.all()
    data = {}
    data.update({"table_orders": []})
    table_order_list = data["table_orders"]
    for table_order in table_orders:
        if table_order.status == table_order_states["waiter_confirmed"]:
            table_order_items = table_order.order_set.all()
            # convert to dict:
            temp_dict = table_order.to_dict()
            temp_dict["orders"] = db_objects_to_list_of_dicts(table_order.order_set.all())
            total_price = 0
            for order_item in table_order_items:
                total_price += order_item.food.price
            temp_dict.update({"total_price": total_price, "table_number": table_order.table.number})
            table_order_list.append(temp_dict)
            # replace the order items (id's to the object dictionaries)
            # calc total price


    return render(request, "chef/templates/KitchenView.html", {"table_orders": data})


# Need to distinguish between removing single order and cancelling whole table order
def get_order_states(request):
    '''
    returns a list of order states where the status is cooking or cooked
    in the relevant format.
    :param request:
    :return:
    '''
    if request.method == 'GET':
        response_dict = {}
        # SENDING ALL THE ORDERS TO THE CHEFS
        relevant_orders = TableOrder.objects.filter(status="waiter_confirmed")

        for table_order in relevant_orders:
            for order in table_order.order_set.all():
                response_dict.update({order.id: order.status})
        response = {
            'success': True,
            'message': json.dumps(response_dict)  # Dumps data and creates a string
        }

        return JsonResponse(response)  # Response returned to ajax call


def get_table_order_states(request):
    '''
    returns a list of table order states where the status is waiter confirmed (chef specific)
    in the relevant format.
    :param request:
    :return: JsonResponse
    '''
    if request.method == 'GET':
        response_list = []
        # SENDING ALL THE ORDERS TO THE CHEFS
        relevant_orders = TableOrder.objects.filter(status="waiter_confirmed")
        for table_order in relevant_orders.all():
            response_list.append(table_order.id)
        response = {
            'success': True,
            'message': json.dumps(response_list)  # Dumps data and creates a string
        }

        return JsonResponse(response)  # Response returned to ajax call


def change_order_state(request):
    '''
    Changes the state of an order to the requested status (from the chef)
    :param request: order_id
    :return:
    '''
    if request.method == 'POST':
        print("changing state of order")
        try:
            order = Order.objects.get(id=request.POST["order_id"])
            order.status = request.POST["state"]
            order.save()
            return JsonResponse(SUCCESSFUL_RESPONSE)
        except Exception as e:
            return JsonResponse(UNSUCCESSFUL_RESPONSE)


def change_table_order_state(request):
    '''
    Changes the state of a Table order to the requested state (from the chef)
    :param request: table_order_id
    :return:
    '''
    if request.method == 'POST':
        print("changing state of table order")
        try:
            table_order = TableOrder.objects.get(id=request.POST["table_order_id"])
            table_order.status = request.POST["state"]
            table_order.save()
            return JsonResponse(SUCCESSFUL_RESPONSE)
        except Exception as e:
            print(e)
            return JsonResponse(UNSUCCESSFUL_RESPONSE)

