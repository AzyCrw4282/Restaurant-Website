# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S
from hashlib import md5
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
from menu.models import Table, FoodInformation, Order, Food, FoodCategory, TableOrder
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from django.core.mail import send_mail
import json
import uuid
import string

import random
from datetime import timedelta, datetime

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

def login_redirect(request):
    user=request.user

    if user.groups.filter(name="waiter"):
        return HttpResponseRedirect(reverse("waiter:main_page"))
    if user.groups.filter(name="chef"):
        return HttpResponseRedirect(reverse("chef:main_page"))
    if user.is_staff:
        return(HttpResponseRedirect(reverse("accounts:manager")))
    return HttpResponseRedirect(reverse("menu:welcome_page"))

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
    data={"user_list":[]}
    for user in User.objects.all():
        group_name=""
        if user.is_staff:
            group_name="admin"
        if user.groups.filter(name="waiter"):
            group_name="waiter"

        if user.groups.filter(name="chef"):
            group_name="chef"

        data["user_list"].append({"group_name":group_name,"id":user.id,"username":user.username,"email":user.email,"full_name":user.get_full_name()})
    for table in tables:
        print("AVAILABLE TABLES:", table.id, ": ", table.number)
    return render(
        request, 'accounts/templates/manager.html', context=data)


def get_all_orders_cost_date(request):
    if request.method == 'GET':
        list = []
        for object in TableOrder.objects.all():
            list.append(object.to_cost_date())
        response = {
            'success': True,
            'message': json.dumps(list)  # Dumps data and creates a string
        }
        return JsonResponse(response)  # Response returned to ajax call


def check_if_exists_waiter_group():
    '''
    this function auto creates the waiter group with the relevant permissions
    Permissions at this stage are not required given that
    waiter can simply not have staff status.
    :param request:
    :return:
    '''
    print("CREATING WAITER GROUP")
    Group.objects.get_or_create(name="waiter")


def create_chef_group():
    '''
    creates a chef group if needed, no permissions required as chef
    is logged in, this should be implemented if there is time, however
    it does not affect security as url's are protected and chef does not have
    administrator status.
    :param request:
    :return:
    '''
    print("CREATING GROUP CHEF")
    Group.objects.get_or_create(name="chef")


def randomString(stringLength):
    '''
    This function is coppied to generate a random string.
    (for the password)
    url: https://pynative.com/python-generate-random-string/
    :param stringLength:
    :return:
    '''
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))

def create_account(request):
    '''
    auto create an account with relevant provided details,
    send email with password and link to login page.
    :param request:
    :return:
    '''
    print("CREATING ACCOUNT")
    if request.method == 'POST':
        try:
            group_name = request.POST["group_name"]
            user_name = request.POST["user_name"]
            email = request.POST["email"]
            password=randomString(6)
            # this is so the user does not need to create groups manually or go through permissions,
            # it is a quick hack as the strucuture is simple
            if group_name=="waiter" or group_name== "chef":
                try:
                    group = Group.objects.get(name=group_name)
                except:
                    if group_name=="waiter":
                        check_if_exists_waiter_group()
                    else:
                        create_chef_group()
            group = Group.objects.get(name=group_name)

            new_user = User.objects.create(username=user_name,email=email)
            new_user.set_password(password)
            new_user.is_staff = False
            new_user.save()
            group.user_set.add(new_user)
            group.save()
            send_mail('Oaxaca Registration Details',
                      "Please follow the privided link with username and password to log in: Link: "+"http://project-oaxaca.herokuapp.com"+reverse("accounts:login")+"Username: "+ user_name+" Password: "+password,
                      'TeamProject201901@gmail.com',
                      [email],
                      fail_silently=False)
            response=SUCCESSFUL_RESPONSE
        except Exception as e:
            print("FAILED TO CREATE USER:", e)
            response=UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)



def delete_account(request):
    '''
    delete a user by id
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            print("DELTING ACCOUNT: ",request.POST["id"])
            user = User.objects.get(id=request.POST["id"])
            user.delete()
            response=SUCCESSFUL_RESPONSE
        except Exception as e:
            print("FAILED TO CREATE USER:", e)
            response=UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def purge_unconfirmed_orders(request):
    print("PURGING irrelevant")
    try:
        orders = TableOrder.objects.filter(posting_date__gte=datetime.now() - timedelta(days=1))
        orders.objects.filter(status="client_created").delete()
    except Exception as e:
        print("NOT DELETED: ", e)


def purge_all_orders_by_days(request):
    print("PURGING by days")
    try:
        TableOrder.objects.filter(posting_date__gte=datetime.now() - timedelta(days=request.POST["days"])).delete()
    except Exception as e:
        print("NOT DELETED: ", e)


def delete_fake_orders(request):
    relevant_orders = TableOrder.objects.all().filter(status="fake")
    for order in relevant_orders:
        order.delete()
    return JsonResponse(SUCCESSFUL_RESPONSE)


def random_date(start, end):
    """
    This function belongs to https://stackoverflow.com/questions/553303/generate-a-random-date-between-two-other-dates
    It is just used to generate random orders
    This function will return a random datetime between two datetime
    objects.
    """
    delta = end - start
    micro_seconds = 1000000 * 60 * 60 * 24 * delta.days
    random_micro = random.randrange(0, micro_seconds)
    return start + timedelta(microseconds=random_micro)


def generate_random_orders(request):
    # no limit for now but easily imposed if required, will simply generate 100 fake orders.
    try:
        d1 = datetime.strptime('6/1/2018 1:30 PM', '%m/%d/%Y %I:%M %p')
        d2 = datetime.strptime('3/1/2019 4:50 AM', '%m/%d/%Y %I:%M %p')
        all_tables = Table.objects.all()
        all_foods = Food.objects.all()
        date_list = []
        for i in range(0, 1000):
            date_list.append(random_date(d1, d2))

        for rand_date in sorted(date_list):
            table = random.choice(all_tables)
            table_order = TableOrder.objects.create(time=rand_date, table=table, status="fake", id=uuid.uuid4())
            table_order.save()
            print(table_order.time)
            for j in range(0, random.randrange(2, 10)):
                order = Order.objects.create(food=random.choice(all_foods))
                order.save()
                table_order.orders.add(order)
            table_order.save()
        return JsonResponse(SUCCESSFUL_RESPONSE)

    except Exception as e:
        print("failed to generate ", e)
        return JsonResponse(UNSUCCESSFUL_RESPONSE)


# def view_profile(request):
#     args = {'user': request.user}
#     return render(request, 'accounts/templates/registration/profile.html', args)
#

