from django.shortcuts import render
from .forms import FoodForm, FoodInformationForm
from menu.models import Food, TableOrder, FoodCategory, FoodInformation, Table, ArchivedTableOrder, Order
from django.http import Http404, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.http import HttpResponse
from django.http import JsonResponse

import json

UNSUCCESSFUL_RESPONSE = {
    'success': False,
    'message': 'FAILURE '
}
SUCCESSFUL_RESPONSE = {
    'success': True,
    'message': 'SUCCESS'
}

with open("../config.json") as json_data_file:
    data = json.load(json_data_file)
table_order_states = data["table_order_states"]


def db_objects_to_list_of_dicts(objects):
    '''
    converts multiple db objects to a list of its dictionaries
    :param objects:
    :return: [{obj1}{obj2}{objN}]
    '''
    list = []
    for db_object in objects:
        list.append(db_object.to_dict())
    return list


def main_page(request):
    # pass the order item's to the waiter
    try:

        table_orders = TableOrder.objects.all()
        data = {}
        data.update({"table_list": db_objects_to_list_of_dicts(Table.objects.all())})
        # send all the archived orders once as they will not be queried upon later (hopefully this is ok?)
        # this could be done perhaps with ajax over multiple requests but there is not time for that now.
        data.update({"table_orders": db_objects_to_list_of_dicts(ArchivedTableOrder.objects.all())})
        user_tables = {}
        for table in request.user.waiter.tables.all():
            user_tables.update({table.id: table.number})
        data.update({"user_tables": user_tables})
        return render(request, "waiter/templates/Waiterver2.html", data)
    except:
        print("User does not have the waiter relation:")
        return HttpResponseRedirect(reverse("menu:welcome_page"))


def insert_stuff(request):
    '''
    function for inserting items into the menu,
    using forms only.
    :param request:
    :return:
    '''
    if request.method == 'POST':
        print("received post request")
        print(request.POST)
        if 'ingredients' in request.POST:
            form = FoodInformationForm(request.POST)
        else:
            form = FoodForm(request.POST, request.FILES)
        if form.is_valid():
            print('form validated')
            instance = form.save(commit=False)
            instance.save()
            print("form saved")

    print("called insert stuff")
    user = request.user
    food_information_list = db_objects_to_list_of_dicts(FoodInformation.objects.all())
    food_list = db_objects_to_list_of_dicts(Food.objects.all())
    food_dict = {'food_list': food_list}
    context = {'food_information_list': food_information_list, 'food_dict': food_dict, 'user': user,
               'food_form': FoodForm(), 'food_information_form': FoodInformationForm()}
    return render(
        request, 'waiter/templates/insert_example.html', context)


def add_information_to_food(request):
    '''
    function to add an information propert to a food item
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            # get list of food information id's
            print(request.POST)
            information_list = json.loads(request.POST['information_list'])
            food_list = json.loads(request.POST["food_list"])

            print(food_list)
            print(information_list)
            for food_id in food_list:
                food = Food.objects.get(id=food_id)
                food.information.clear()
                for information_id in information_list:
                    information = FoodInformation.objects.get(id=information_id)
                    food.information.add(information)
                food.save()
            print("SUCCESSSSSSSSS")
            return JsonResponse(SUCCESSFUL_RESPONSE)

        except Exception as e:
            print("FAILED TO INSERT FOOD INFO: ", e)
            return JsonResponse(UNSUCCESSFUL_RESPONSE)
    return Http404


def delete_food_category(request):
    '''
    deletes a food category specified in the request
    :param request:
    :return:
    '''
    if request.method == "POST":
        try:
            id = request.POST["food_category_id"]
            FoodCategory.objects.get(id=id).delete()
            response = SUCCESSFUL_RESPONSE

        except Exception as e:
            print("FAILED TO DELETE CATEGORY: ", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def delete_unarchived_table_orders(request):
    '''
    deletes all unarchived orders
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            relevant_orders = TableOrder.objects.all().exclude(status="archived")
            relevant_orders.delete()
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("FAILED TO DELETE archived ORDERS: ", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def get_table_order_list(request):
    '''
    returns a list of all orders but the client created ones,
    in the relevant format.
    :param request:
    :return:
    '''
    if request.method == 'GET':
        # print("GETTING TABLE ORDER STATES: ")
        # pass the order item's to the waiter
        table_orders = TableOrder.objects.all().exclude(status="client_created")
        data = {}
        data.update({"table_orders": []})
        table_order_list = data["table_orders"]
        for table_order in table_orders:
            table_order_items = table_order.order_set.all()
            # convert to dict:
            temp_dict = table_order.to_dict()
            temp_dict["orders"] = db_objects_to_list_of_dicts(table_order.order_set.all())
            total_price = 0
            for order_item in table_order_items:
                total_price += order_item.food.price
            temp_dict.update({"total_price": total_price, "table_number": table_order.table.number})
            table_order_list.append(temp_dict)
            # replace the order items (id's to the object dictionaries)
            # calc total price

        response = {
            'success': True,
            'message': json.dumps(data)  # Dumps data and creates a string
        }
        return JsonResponse(response)  # Response returned to ajax call


def delete_food(request):
    '''
    deletes specified food item from db
    :param request:
    :return:
    '''
    print("called delete_food")
    if request.method == 'POST':
        print("received delete_food request")
        try:
            food_object = Food.objects.get(id=request.POST['food_id'])
            food_object.delete()
            print("delete successful?")
            response=SUCCESSFUL_RESPONSE
        except:
            print("error deleting food ")
            response=UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def archive_table_order(table_order_id, user):
    '''
    archives a table order into a separate db model
    and deletes the active one.
    :param table_order_id:
    :return:
    '''
    table_order = TableOrder.objects.get(id=table_order_id)
    table_order.waiter = user
    table_order.save()
    # set the waiter that archived the order as
    table_order_json = table_order.to_archived()
    archived_order = ArchivedTableOrder.objects.create(json_table_order=table_order_json,
                                                       id=table_order.id)
    archived_order.save()
    table_order.delete()


def recover_archived_table_order(table_order_id, status_to_recover_to):
    '''
    tries to recover an order from an archived state to an active state
    :param table_order_id:
    :return:
    '''
    print("UNARCHIVING")
    archived_table_order = ArchivedTableOrder.objects.get(id=table_order_id)
    # unpack the data
    data = archived_table_order.to_dict()
    orders = data["orders"]
    table_id = data["table"]
    time = data["time"]
    id = data["id"]
    print("GOT DATA")
    # try reconstructin all the orders then the table order
    table = Table.objects.get(id=table_id)
    table_order_restored = TableOrder.objects.create(id=id, status=status_to_recover_to, time=time,
                                                     table=table)
    table_order_restored.save()
    try:
        print("CREATED TABLE_ORDER")
        for order_data in orders:
            food = Food.objects.get(id=order_data["food"])
            order_status = order_data["status"]
            comment = order_data["comment"]
            ord_id = order_data["id"]
            obj = Order.objects.create(food=food, status=order_status, comment=comment,
                                       id=ord_id, table_order=table_order_restored)
            obj.save()
        print("SUCCESSFUL Restoration of order")
        archived_table_order.delete()
    except Exception as e:
        print("failed to add all orders", e)
        table_order_restored.delete()


def change_table_order_state(request):
    '''
    Changes the state of an order, archives it if necessary.
    :param request:
    :return:
    '''
    if request.method == 'POST':
        print("changing state of table order")
        try:
            table_order_id = request.POST["table_order_id"]
            status_to_change_to = request.POST["state"]
            if status_to_change_to == "archived":
                # if it is being changed to archived
                try:
                    archive_table_order(table_order_id, request.user.waiter)
                    response = SUCCESSFUL_RESPONSE
                except Exception as e:
                    response = UNSUCCESSFUL_RESPONSE
                    print("failed to convert to archived: ", e)
            else:
                # if it is restoring from archived or being changed to something other than archived.
                try:
                    # if it is a non-archived table order simply change the state
                    table_order = TableOrder.objects.get(id=table_order_id)
                    table_order.status = status_to_change_to
                    table_order.save()
                    response = SUCCESSFUL_RESPONSE
                    print("SUCCESSFUL status change of order")
                except Exception as e:
                    print("Failed to change state of normal order: ", e)
                    try:
                        # if it is an archived order requireing restoration:
                        if status_to_change_to != "archived":
                            recover_archived_table_order(table_order_id, status_to_change_to)
                            response = SUCCESSFUL_RESPONSE
                        else:
                            response = UNSUCCESSFUL_RESPONSE
                    except Exception as e:
                        response = UNSUCCESSFUL_RESPONSE
                        print("Failed to unarchive Table Order: ", e)
        except Exception as e:
            print("FAILED TO GET DATA? ", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)


def deselect_table(request):
    '''
    waiter request to deselect a table
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            table = Table.objects.get(id=request.POST["table_id"])
            request.user.waiter.tables.remove(table)

            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            response = UNSUCCESSFUL_RESPONSE
            print("failed to add table for user", e)
        return JsonResponse(response)


def select_table(request):
    '''
    waiter request to select a table
    :param request:
    :return:
    '''
    if request.method == 'POST':
        try:
            table = Table.objects.get(id=request.POST["table_id"])

            request.user.waiter.tables.add(table)
            # print(request.user.waiter.tables.all())

            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            response = UNSUCCESSFUL_RESPONSE
            print("failed to add table for user")
        return JsonResponse(response)


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
            temp = Table.objects.create(id=request.POST['table_id'], number=request.POST['table_number'])

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
    print(request.POST)
    if request.method == 'POST':  # post request of a form ok
        try:
            temp = FoodCategory(name=request.POST['food_category_name'])
            temp.save()
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("EXCEPTION THROWN: ", e)
            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)
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
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("EXCEPTION THROWN: ", e)

            response = UNSUCCESSFUL_RESPONSE
        return JsonResponse(response)
    else:
        pass




def confirm_table_order(request):
    print("called confirm_table_order")
    if request.method == 'POST':
        try:
            temp = Food.objects.get(id=request.POST["table_id"])
            temp.delete()
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("EXCEPTION THROWN: ", e)
            response = UNSUCCESSFUL_RESPONSE
        return HttpResponse(response)
    else:
        pass


def delete_table_order(request):
    print("called delete_table_order")
    if request.method == 'POST':
        try:
            temp = Food.objects.get(id=request.POST["table_order_id"])
            temp.delete()
            response = SUCCESSFUL_RESPONSE
        except Exception as e:
            print("EXCEPTION THROWN: ", e)
            response = UNSUCCESSFUL_RESPONSE
        return HttpResponse(response)
    else:
        pass
