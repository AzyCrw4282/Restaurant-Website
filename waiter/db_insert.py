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


# Table( _id  )
def delete_table(request):
    print("called delete_table")
    if request.method == 'POST':
        try:
            temp = Table.objects.get(id=request.POST["table_id"])
            temp.delete()
            response = {
                'status': 0,
                'message': 'deleted table'
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


# Table( _id  )
def add_table(request):
    print("called add_table")

    if request.method == 'POST':
        try:
            temp = Table()
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


# FoodInformation( _id, name)
def add_food_information(request):
    print("called add_food_info")
    if request.method == 'POST':
        try:
            temp = FoodInformation(name=request.POST['food_information_name'])
            temp.save()
            response = {
                'status': 1,
                'message': 'added FoodInfo'
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


def delete_food_information(request):
    print("called delete_food_info")
    if request.method == 'POST':
        try:
            temp = FoodInformation.objects.get(id=request.POST["food_information_id"])
            temp.delete()
            response = {
                'status': 0,
                'message': 'deleted table'
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


# FoodCategory( _id, name)
def add_food_category(request):
    print("called add_category")
    if request.method == 'POST':
        try:
            temp = FoodCategory(name=request.POST['food_category_name'])
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


def delete_food_category(request):
    print("called delete_food_category")
    if request.method == 'POST':
        try:
            temp = FoodCategory.objects.get(id=request.POST["food_category_id"])
            temp.delete()
            response = {
                'status': 0,
                'message': 'deleted table'
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


# do this with a standard form because I don't know how to add the picture manually.
def add_food(request):
    print("called add_food")
    # expecting: name, price, category_id, description, picture)
    if request.method == 'POST':
        try:
            temp = Food.objects.create(
                name=request.POST['food_name'],
                price=request.POST['food_price'],
                category_id=request.POST['food_category_id'],
                description=request.POST['food_description'],
                picture=request.POST['food_picture']
            )
            temp.save()
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


def delete_food(request):
    print("called delete_food")
    if request.method == 'POST':
        try:
            temp = Food.objects.get(id=request.POST["food_id"])
            temp.delete()
            response = {
                'status': 0,
                'message': 'deleted table'
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


def confirm_table_order(request):
    print("called confirm_table_order")
    if request.method == 'POST':
        try:
            temp = Food.objects.get(id=request.POST["table_id"])
            temp.delete()
            response = {
                'status': 0,
                'message': 'deleted table'
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


def delete_table_order(request):
    print("called delete_table_order")
    if request.method == 'POST':
        try:
            temp = Food.objects.get(id=request.POST["table_order_id"])
            temp.delete()
            response = {
                'status': 0,
                'message': 'deleted table'
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
