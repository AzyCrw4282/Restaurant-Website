from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import reverse, redirect, get_object_or_404
<<<<<<< HEAD:menu/views.py
import os, hashlib
from django.core.files import File
# from menu.models import
# from menu.forms import
=======
from MenuView.models import Table,Customer
from MenuView.forms import TableForm,CustomerForm
# from MenuView.models import
# from MenuView.forms import
>>>>>>> master:MenuView/views.py
#---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES

def menu(request):
    user = request.user
    context = {'user': user}
    return render(
<<<<<<< HEAD:menu/views.py
        request, 'menu/templates/index.html', context
=======
        request, 'MenuView/templates/home.html', context)

def table_list(request):
    tables=Table.objects.all()
    customers=Customer.objects.all()

    context={'tables':tables,'customers':customers}
    return render(request,'MenuView/templates/tables.html',context)

def table_create(request):
    if request.method=='POST':
        form=TableForm(request.POST)
        if form.is_valid():
            instance=form.save()
            instance.save()
            return HttpResponseRedirect(reverse('table_list'))
    else:
        form=TableForm()
    return render(request,'MenuView/templates/table_create.html',{'form':form})

def table_add_customer(request,table=None):
    table=get_object_or_404(Table,id=table)

    if request.method=='POST':
        form = CustomerForm(request.POST)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.table = table
            instance.save()
            return HttpResponseRedirect(reverse('table_list'))
    else:
        form = CustomerForm()
    context={'form': form,'table':table}
    return render(request,'MenuView/templates/table_specified_customer_add.html',context)
>>>>>>> master:MenuView/views.py


