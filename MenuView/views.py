from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from django.contrib.auth.models import User

from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
# from MenuView.models import
# from MenuView.forms import
#---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES

def home(request):
    user = request.user
    context = {'user': user}
    return render(
        request, 'MenuView/templates/home.html', context

    )

