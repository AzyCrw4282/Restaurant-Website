# THIS IS A PYTHON FILE FOR HANDELING GENERAL REQUESTS FROM URL'S
from hashlib import md5
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
from menu.models import Table, Order, Food, ArchivedTableOrder, TableOrder
from menu.models import Waiter
from django.contrib.auth.models import Group, Permission
from django.http import JsonResponse
from django.core.mail import send_mail
from datetime import timedelta, datetime
from waiter.views import archive_table_order
import json
import uuid
import string

import random

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
    user = request.user

    if user.groups.filter(name="waiter"):
        return HttpResponseRedirect(reverse("waiter:main_page"))
    if user.groups.filter(name="chef"):
        return HttpResponseRedirect(reverse("chef:main_page"))
    if user.is_staff:
        return (HttpResponseRedirect(reverse("accounts:manager")))
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
    all_groups = []
    for group in Group.objects.all():
        all_groups.append(group.name)
    data = {"group_list": all_groups, "user_list": []}
    print(all_groups)
    for user in User.objects.all():
        groups = user.groups.all()
        group_list = []
        for group in groups:
            group_list.append(group.name)
        data["user_list"].append(
            {"group_list": group_list, "id": user.id, "username": user.username, "email": user.email,
             "full_name": user.get_full_name()})
    for table in tables:
        print("AVAILABLE TABLES:", table.id, ": ", table.number)
    return render(
        request, 'accounts/templates/manager.html', context=data)


def get_all_orders_cost_date(request):
    if request.method == 'GET':
        list = []
        for object in ArchivedTableOrder.objects.all():
            list.append(object.to_chart_data())
        response = {
            'success': True,
            'message': json.dumps(list)  # Dumps data and creates a string
        }
        return JsonResponse(response)  # Response returned to ajax call


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


def add_waiter_relation(user):
    '''
    adds a waiter one to one relation (group property)
    :param user:
    :return:
    '''
    waiter = Waiter(waiter=user)
    waiter.save()
    for table in Table.objects.all():
        waiter.tables.add(table)
    waiter.save()


def add_user_to_group(user, group_name):
    '''
    adds a user to an existing group
    :param user:
    :param group_name:
    :return:
    '''
    group, boolean = Group.objects.get_or_create(name=group_name)
    print(group)

    group.user_set.add(user)
    if group_name == "waiter":
        add_waiter_relation(user)


def remove_user_from_group(user, group_name):
    '''0 PM' does not match format '%m/%d/%Y %I:%M %p
    removes user from a group
    :param user:
    :param group_name:
    :return:
    '''
    group = Group.objects.get(name=group_name)
    print(group)
    group.user_set.remove(user)
    if group_name == "waiter":
        user.waiter.delete()


def remove_from_group(request):
    '''
    removes a user from a group from a post request
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            group_name = request.POST["group_name"]
            user_name = request.POST["user_name"]
            print("REMOVING USER FROM ", group_name," user:", user_name)
            user = User.objects.get(username=user_name)
            remove_user_from_group(user, group_name)
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("failed to remove user from group", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def add_to_group(request):
    '''
    adds a user from a group from a post request
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            group_name = request.POST["group_name"]
            user_name = request.POST["user_name"]
            user = User.objects.get(username=user_name)
            add_user_to_group(user, group_name)
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("failed to ad user to group", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


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
            password = randomString(6)
            # this is so the user does not need to create groups manually or go through permissions,
            # it is a quick hack as the strucuture is simple
            new_user = User.objects.create(username=user_name, email=email)
            new_user.set_password(password)
            new_user.is_staff = False
            new_user.save()
            add_user_to_group(new_user, group_name)
            send_mail('Oaxaca Registration Details',
                      "Please follow the privided link with username and password to log in: Link: " + "http://project-oaxaca.herokuapp.com" + reverse(
                          "accounts:login") + "Username: " + user_name + " Password: " + password,
                      'TeamProject201901@gmail.com',
                      [email],
                      fail_silently=False)
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("FAILED TO CREATE USER:", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def delete_account(request):
    '''
    delete a user by id
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            print("DELTING ACCOUNT: ", request.POST["id"])
            user = User.objects.get(id=request.POST["id"])
            user.delete()
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("FAILED TO CREATE USER:", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def purge_unconfirmed_orders(request):
    '''
    deletes all unconfirmed orders older than 1 day
    :param request:
    :return:
    '''
    print("PURGING irrelevant")
    try:
        orders = TableOrder.objects.filter(posting_date__gte=datetime.now() - timedelta(days=1))
        orders.objects.filter(status="client_created").delete()
    except Exception as e:
        print("NOT DELETED: ", e)


def purge_all_orders_by_days(request):
    '''
    deletes all orders allder than specified number of days
    :param request:
    :return:
    '''
    print("PURGING by days")
    try:
        TableOrder.objects.filter(posting_date__gte=datetime.now() - timedelta(days=request.POST["days"])).delete()
    except Exception as e:
        print("NOT DELETED: ", e)


def delete_fake_orders(request):
    '''
    deletes all orders that have a status not specified in the config file
    :param request:
    :return:
    '''
    relevant_orders = TableOrder.objects.all()
    for order in relevant_orders:
        if order.status not in table_order_states:
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
    '''
    generates 5000 random orders into archive between two dates
    :param request:
    :return:
    '''
    # no limit for now but easily imposed if required, will simply generate 100 fake orders.
    try:
        d1 = datetime.now()-timedelta(days=2)
        d2 = datetime.now()
        all_tables = Table.objects.all()

        date_list = []
        for i in range(0, 500):
            date_list.append(random_date(d1, d2))
        print("date list created")
        print(sorted(date_list))
        for rand_date in sorted(date_list):
            table = random.choice(all_tables)
            table_order = TableOrder.objects.create(time=rand_date, table=table, status="fake", id=uuid.uuid4())
            table_order.save()
            print(table_order.time)


            for j in range(0, random.randrange(2, 10)):
                order = Order.objects.create(table_order=table_order, food=random.choice(Food.objects.all()))
                order.save()
            archive_table_order(table_order.id,random.choice(Waiter.objects.all()))

        return JsonResponse(SUCCESSFUL_RESPONSE)

    except Exception as e:
        print("failed to generate ", e)
        return JsonResponse(UNSUCCESSFUL_RESPONSE)


def delete_old_table_orders(request):
    '''
    deletes all table orders older than specified number of days
    since the user has created them.
    :param request: Post contains days: int
    :return:
    '''
    if request.method == 'POST':
        try:
            days = int(request.POST["days"])
            print("DELETING ORDERS OLDER THAN: ", days)
            relevant_orders = ArchivedTableOrder.objects.all()
            delete_before_date = datetime.now() - timedelta(days=days)
            for order in relevant_orders:
                data = order.to_dict()
                time_string = data["time"]
                # remove colon as this is a python bug:
                # we are removing in days, time zone does not matter
                time_string = time_string[:-6]
                print("TIME DELTA: ", time_string)
                print("time:", delete_before_date)
                time = datetime.strptime(time_string, '%Y-%m-%d %H:%M:%S.%f')
                print("CONVERTED TIME:", time)
                if time < delete_before_date:
                    order.delete()

        except Exception as e:
            print("FAILED TO DELETE TABLE ORDERS: ", e)
    return JsonResponse(SUCCESSFUL_RESPONSE)

# def view_profile(request):
#     args = {'user': request.user}
#     return render(request, 'accounts/templates/registration/profile.html', args)
#
