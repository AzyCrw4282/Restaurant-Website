
# THIS IS A PYTHON FILE PURELY FOR DATABASE INSER FUNCTIONS

from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
# from menu.models import
# from menu.forms import
from .models import Table, Customer, Order, Food, FoodCategory
from datetime import datetime
from django.http import JsonResponse

#  FoodCategory( _id, name)
def add_food_category(request):
    print("called add_category")
    if request.method == 'POST':
        try:
            temp = FoodCategory(name=request.POST['name'])
            temp.save()
            response = {
                'status': 1,
                'message': 'added category'
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
# Customer ( _id , name , Table_id)
def add_customer(request):
    print("called add_customer")

    if request.method == 'POST':
        try:
            temp = Customer(name=request.POST['name'],
                            table_id=request.POST['table_id'])
            temp.save()
            response = {
                'status': 1,
                'message': 'added customer'
            }
        except Exception as e:
            print("EXCEPTION THROWN: ",e)

            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return JsonResponse(response)
    else:
        pass


# Table( _id , max_customers, )
def add_table(request):
    print("called add_table")

    if request.method == 'POST':
        try:
            temp = Table(max_customers=request.POST['max_customers'])
            temp.save()
            response = {
                'status': 0,
                'message': 'added table'
            }
        except Exception as e:
            print("EXCEPTION THROWN: ", e)
            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return HttpResponse(response)
    else:
        pass


# remember no need to add mtm fields here, they can be added dynamically once an object is created
#  Food( _id, name,price, category_id , allergy: MtM(FoodAllergies) )
def add_food(request):
    print("called add_food")

    if request.method == 'POST':
        try:
            temp = Food.objects.create(name=request.POST['name'],
                                       price=request.POST['price'],
                                       category_id=request.POST['category_id'],
                                       )
            temp.save()
            response = {
                'status': 1,
                'message': 'added food'
            }
        except Exception as e:
            print("EXCEPTION THROWN: ",e)

            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return JsonResponse(response)
    else:
        pass


# responds to code in json:
#  $.post( "{% url 'order' %}",
#  {
#      csrfmiddlewaretoken: '{{ csrf_token}}' ,
#      food : food_id, //pass the score here
#      table: table_id  // pass the win value here
#      customer: customer_id
#      time_of_order: format('Mon, 23 May 2016 08:30:15 GMT')
#
#
#  },
# Order( _id , Food_id , Table_id , Customer_id: MtM(Customer) , time )
def add_order(request):
    print("RECIEVE ORDER REQUEST")
    # Order( _id , Food_id , Table_id , Customer_id , time )
    if request.method == 'POST':
        try:

            food_id = request.POST['food_id']
            food=Food.objects.get(id=food_id)
            customer = request.POST['customer_id']
            date_time = request.POST['time']
            print(date_time)
            try:
                order=Order.objects.get(customer_id=customer)
            except:
                order = Order.objects.create(customer_id=customer,
                                         time=date_time)
            order.save()
            order.food.add(food)
            response = {
                'status': 1,
                'message': 'Order Successful'
            }
        except Exception as e:
            print("EXCEPTION THROWN: ",e)
            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return JsonResponse(response)
    else:
        pass

