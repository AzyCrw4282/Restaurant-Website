from django.shortcuts import render
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from django.contrib.auth.models import User

from django.shortcuts import reverse, redirect, get_object_or_404
import os, hashlib
from django.core.files import File
# from menu.models import
# from menu.forms import
#---------THESE ARE FUNCTIONS THAT TAKE CARE OF USER'S REQUEST USING FORMS, DATABASE MODELS AND HTML-------------

# HOME/REPORTS/OWNFILES

def menu(request):
    user = request.user
    context = {'user': user}
    return render(
        request, 'menu/templates/index.html', context

    )

