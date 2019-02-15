from django.shortcuts import render
from .forms import FoodForm
from menu.models import Food,TableOrder,Order
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
import json

# Create your views here.
def get_waiter_card_data(request):
    return (1)

def waiter(request):
    # pass the order item's to the waiter
    table_orders=TableOrder.objects.all()
    data={}
    data.update({"table_orders":[]})
    table_order_list=data["table_orders"]
    for table_order in table_orders:
        if table_order.client_confirmed:
            table_order_order_list=[]
            for order_object in table_order.orders.all():
                table_order_list_order = {}
                table_order_list_order.update({"id":order_object.id,"food_name":order_object.food.name,"comment":order_object.comment})
                table_order_order_list.append(table_order_list_order)
            table_order_list.append({"id":table_order.id,"table_number":table_order.table.number,
                         "waiter_confirmed":table_order.waiter_confirmed.__str__(),"time":table_order.time.__str__(),"orders":table_order_order_list})
    print("printing data",data)
    return render(request,"waiter/templates/WaiterTest.html",{"table_orders":data})


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
