from django.shortcuts import render
from menu.models import TableOrder
from menu.models import Order
# Create your views here.
def chef(request):
    table_orders = TableOrder.objects.all()
    data = {}
    data.update({"table_orders": []})
    table_order_list = data["table_orders"]
    for table_order in table_orders:
        if table_order.client_confirmed:
            table_order_order_list = []

            for order_object in table_order.orders.all():
                table_order_list_order = {}
                table_order_list_order.update(
                    {"id": order_object.id, "food_name": order_object.food.name, "comment": order_object.comment})
                table_order_order_list.append(table_order_list_order)

            table_order_list.append({"id": table_order.id, "table_number": table_order.table.number,
                                     "waiter_confirmed": table_order.waiter_confirmed.__str__(),
                                     "time": table_order.time.__str__(), "orders": table_order_order_list})
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


























