# THIS IS A PYTHON FILE PURELY FOR DATABASE INSER FUNCTIONS

from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
# from menu.models import
# from menu.forms import
from menu.models import Table, FoodInformation, Order, Food, FoodCategory, TableOrder
from datetime import datetime
from django.http import JsonResponse


# Table( _id  )
#
# FoodInformation( _id, name,description)
#
# FoodCategory( _id, name)
#
# Food( _id, display, name, price, category_id , information: MtM(FoodInformation), description, picture )
#
# Order( _id , Food_id  ,comment , status)
#
# TableOrder ( _id , order:MtM(Order),Table_id, time)
#

# TableOrder ( _id , orders:MtM(Order),Table_id, time)
# expecting data in post to be:
# {
#   "comment":int,
#   "orders": [
#       {"id":int,"comment":comment },
#       {"id":int,"comment":comment }
#   ]
# }

def add_table_order(request, table_id):
    print("called add_table_order")
    # expecting: name, price, category_id, description, picture)
    if request.method == 'POST':
        try:
            temp = TableOrder.objects.create(
                table_id=table_id,
                time=request.POST['time'],
            )
            temp.save()
            for order in request.POST['orders']:
                temp_order = Order.objects.create(
                    food_id=order["id"],
                    comment=order["comment"],
                )
                temp_order.save()
                temp.orders.add(temp_order)
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
