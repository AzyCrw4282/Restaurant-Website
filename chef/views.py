from django.shortcuts import render
from menu.models import TableOrder
from menu.models imort Order

import json
# Create your views here.
with open('config.json') as json_data_file:
    data = json.load(json_data_file)
table_order_states = data["table_order_states"]


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


def chef(request):
    # pass the order item's to the waiter
    table_orders = TableOrder.objects.all()
    data = {}
    data.update({"table_orders": []})
    table_order_list = data["table_orders"]
    for table_order in table_orders:
        if table_order.status == table_order_states["waiter_confirmed"]:
            table_order_items = table_order.orders.all()
            # convert to dict:
            temp_dict = table_order.to_dict()
            temp_dict["orders"] = db_objects_to_list_of_dicts(table_order.orders.all())
            total_price = 0
            for order_item in table_order_items:
                total_price += order_item.food.price
            temp_dict.update({"total_price": total_price, "table_number": table_order.table.number})
            table_order_list.append(temp_dict)
            # replace the order items (id's to the object dictionaries)
            # calc total price

    print("printing data", data)

    return render(request,"chef/templates/KitchenView.html",{"table_orders":data})


def confirm_order(request):
    try:
        order = TableOrder.objects.get(request.POST["table_order_id"])
        order.waiter_confirmed = True
        order.save()
    except Exception as e:
        pass


def cancle_order(request):
    try:
        order = TableOrder.objects.get(request.POST["table_order_id"])
        order.delete()
    except Exception as e:
        pass

#Need to distinguish between removing single order and cancelling whole table order
def set_order_state(request,state):
    try:
        order = Order.objects.get(request.POST['order_id'])
        order.status = state
        order.save()
    except Exception as e:
        print(e)




def set_table_order_state(request,state):
    try:
        order = Order.objects.get(request.POST['table_order_id'])
        order.status = state
        order.save()
    except Exception as e:
        print(e)


























