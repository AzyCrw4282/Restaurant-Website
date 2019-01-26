from django.conf.urls import include, url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from django.views.generic import RedirectView
from django.contrib import admin
urlpatterns = [
<<<<<<< HEAD:menu/urls.py
                  path('',views.menu, name='menu'),
=======
                  path('',views.home, name='MenuView'),
                  url(r'^table_list/$', views.table_list, name='table_list'),
                  url(r'^table_create/$', views.table_create, name='table_create'),
                  url(r'^table_list/(?P<table>\d+)/add_customer$', views.table_add_customer, name='table_add_customer'),

>>>>>>> master:MenuView/urls.py
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
