from django.conf.urls import include, url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views,db_insert
from django.views.generic import RedirectView
from django.contrib import admin
urlpatterns = [
                  path('',views.menu, name='menu'),
                  url(r'^add_stuff/$', views.add_stuff, name='add_stuff'),

                  url(r'^table_list/$', views.table_list, name='table_list'),

                  # temporary url's for populating database, this should be done from user's requests e.t.c.
                  url(r'^add_stuff/add_food_category/$', db_insert.add_food_category, name='add_food_category'),
                  url(r'^add_stuff/add_table/$', db_insert.add_table, name='add_table'),
                  url(r'^add_stuff/add_customer/$', db_insert.add_customer, name='add_customer'),
                  url(r'^add_stuff/add_order/$', db_insert.add_order, name='add_order'),
                  url(r'^add_stuff/add_food/$', db_insert.add_food, name='add_food'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
