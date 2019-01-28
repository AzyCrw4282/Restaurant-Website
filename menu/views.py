from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
# from menu.models import
# from menu.forms import
from .models import Table, Customer, Order, Food
from .forms import TableForm, CustomerForm
from datetime import datetime


# from MenuView.models import
# from MenuView.forms import
# ---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES


#
#
# Menu( _id, name )
#
#
def menu(request):
    print("called menu")
    user = request.user
    context = {'user': user}
    return render(
        request, 'menu/templates/index.html', context)


# Customer ( _id , name , Table_id)
def add_customer(request):
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
            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return HttpResponse(response, mimetype='application/json')
    else:
        pass


# Table( _id , max_customers, )
def add_table(request):
    print("FUNCTION ADD TABLE")
    if request.method == 'POST':
        print("RECIEVED POST TESTING DATA")
        try:
            temp = Table(max_customers=request.POST['max_customers'])
            temp.save()
            print("OBJECT SAVED REDIRECTING")
            print("added object to table db")
            HttpResponseRedirect(reverse('table_list'))
        except Exception as e:
            print("EXCEPTION THROWN: ",e)
            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return HttpResponseRedirect('')
    else:
        pass


# Food( _id, name )
def add_food(request):
    if request.method == 'POST':
        try:
            temp = Food.objects.create(name=request.POST['name'])
            temp.save()
            response = {
                'status': 1,
                'message': 'added customer'
            }
        except Exception as e:
            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return HttpResponse(response, mimetype='application/json')
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
# Order( _id , Menu_id , Table_id , Customer_id , time_of_order )
def add_order(request):
    # Order( _id , Food_id , Table_id , Customer_id , time_of_order )
    if request.method == 'POST':
        try:
            food = request.POST['food']
            table = request.POST['table']
            customer = request.POST['customer']
            date_time = request.POST['time_of_order']
            # date time in format: 'Mon, 23 May 2016 08:30:15 GMT'
            date_object = datetime.strptime(date_time, '%a, %d %B %Y %H:%M:%S GMT')
            order = Order.objects.create(food=food, table=table, customer=customer,
                                         time_of_order=date_object)
            order.save()
            response = {
                'status': 1,
                'message': 'Order Successful'
            }
        except Exception as e:
            response = {
                'status': 0,
                'message': 'Oops something went wrong - ' + str(e)
            }
        return HttpResponse(response, mimetype='application/json')
    else:
        pass


# THE BELOW ARE JUST WORKING EXAMPLES FOR REFERENCE, TO BE SCRAPPED
def table_list(request):
    tables = Table.objects.all()
    for table in tables:
        print("tables: " + table.id)
    context = {'tables': tables}
    return render(request, 'menu/templates/tables.html', context)
