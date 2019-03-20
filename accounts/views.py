# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S

from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
from menu.models import Table, FoodInformation, Order, Food, FoodCategory, TableOrder
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from datetime import datetime
from django.http import JsonResponse
import json
import uuid

with open('config.json') as json_data_file:
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

user = User.objects.get(id=1)


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


def manager(request):
    '''
    manager page, needs to see:
    all orders?
    auto create new account to a specifed group?
    auto delete accounts by id?
    auto create the waiter group?
    auto create the chef group?
    :param request:
    :return:
    '''
    tables = Table.objects.all()
    for table in tables:
        print("AVAILABLE TABLES:", table.id, ": ", table.number)
    return render(
        request, 'accounts/templates/manager.html', context={})


def get_all_orders_cost_date(request):
    if request.method == 'GET':
        list = []
        for object in TableOrder.objects.all():
            list.append(object.to_cost_date())
        return JsonResponse(json.dumps(list))

def create_waiter_group(request):
    '''
    this function auto creates the waiter group with the relevant permissions
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            group = Group.objects.get_or_create(name="waiter")

            create_table_order_pm = ContentType.objects.get_for_model(model=TableOrder)
            alter_menu_pm = ContentType.objects.get_for_model(model=Food)
            alter_menu_pm1 = ContentType.objects.get_for_model(model=FoodInformation)
            alter_menu_pm2 = ContentType.objects.get_for_model(model=FoodCategory)
            alter_menu_pm3 = ContentType.objects.get_for_model(model=Table)
            alter_menu_pm4 = ContentType.objects.get_for_model(model=Order)
            group.permissions.add(create_table_order_pm)
            group.permissions.add(alter_menu_pm)
            group.permissions.add(alter_menu_pm1)
            group.permissions.add(alter_menu_pm2)
            group.permissions.add(alter_menu_pm3)
            group.permissions.add(alter_menu_pm4)
            group.save()
            print("SUCCESSFULLY CREATED GROUP")
        except Exception as e:
            print("FAILED TO CREATE GROUP: ", e)
    pass


def create_chef_group(request):
    '''
    this function auto creates the waiter group with the relevant permissions
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            group = Group.objects.get_or_create(name="chef")
            create_table_order_pm = ContentType.objects.get_for_model(model=TableOrder)
            group.permissions.add(create_table_order_pm)
            group.save()
            print("SUCCESSFULLY CREATED GROUP")
        except Exception as e:
            print("FAILED TO CREATE GROUP: ", e)
    pass


def create_account(request):
    '''
    auto create an account with relevant provided details

    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            group_name = request.POST["group_name"]
            group = Group.objects.get(name=group_name)
            new_user = User.objects.create()
            new_user.is_staff = False
            new_user.save()
            group.user_set.add(new_user)
            group.save()
        except Exception as e:
            print("FAILED TO CREATE USER:", e)


def delete_account(request):
    '''
    delete a user by id
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            new_user = request.POST["user_id"]
            new_user.delete()
        except Exception as e:
            print("FAILED TO CREATE USER:", e)
