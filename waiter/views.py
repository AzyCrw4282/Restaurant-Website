from django.shortcuts import render
from .forms import FoodForm
from menu.models import Food, TableOrder, Order
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
import json

with open('config.json') as json_data_file:
    data = json.load(json_data_file)
table_order_states = data["table_order_states"]

# Create your views here.
def get_waiter_card_data(request):
    return (1)
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


def waiter(request):
    # pass the order item's to the waiter
    table_orders = TableOrder.objects.all()
    data = {}
    data.update({"table_orders": []})
    table_order_list = data["table_orders"]
    for table_order in table_orders:
        if not table_order.status==table_order_states["client_created"]:
            table_order_items = table_order.orders.all()
            # convert to dict:
            temp_dict=table_order.to_dict()
            temp_dict["orders"]=db_objects_to_list_of_dicts(table_order.orders.all())
            total_price = 0
            for order_item in table_order_items:
                total_price += order_item.food.price
            temp_dict.update({"total_price":total_price,"table_number":table_order.table.number})
            table_order_list.append(temp_dict)
            # replace the order items (id's to the object dictionaries)
            # calc total price

    print("printing data", data)
    return render(request, "waiter/templates/Waiterver2.html", data)


def insert_stuff(request):
    if request.method == 'POST':
        print("received post request")
        form = FoodForm(request.POST, request.FILES)
        print("form recieved")
        print(form)
        if form.is_valid():
            print('form validated')
            instance = form.save(commit=False)
            instance.save()
            print("form saved")

    print("called insert stuff")
    user = request.user
    context = {'user': user, 'food_form': FoodForm()}
    return render(
        request, 'waiter/templates/insert_example.html', context)



def delete_food(request):
    print("called delete_food")
    if request.method == 'POST':
        print("received delete_food request")
        try:
            food_object = Food.objects.get(id=request.POST['food_id'])
            food_object.delete()
            print("delete successful?")
            HttpResponseRedirect("/menu/waiter/")

        except:
            print("error deleting food ")
            return



def archive_order(order):
    pass

def change_table_order_state(request):
    if request.method=='POST':
        print("changing state of table order")
        try:
            table_order = TableOrder.objects.get(id=request.POST["table_order_id"])
            table_order.status = request.POST["state"]
            print("STATE CHANGED TO: ",table_order.status)
            table_order.save()
        except Exception as e:
            print("FAILED:")
            print(e)







