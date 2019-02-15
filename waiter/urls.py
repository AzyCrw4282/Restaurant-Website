from django.conf.urls import include, url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views, db_insert
from django.views.generic import RedirectView
from django.contrib import admin
urlpatterns = [
                  path('',views.waiter, name='waiter'),
                  # temporary url's for populating database, this should be done from user's requests e.t.c.
                  url(r'^delete_food/$', views.delete_food, name='delete_food'),

#For testing      url(r'^welcome/$', views.waiter, name='waiter'),

                #URL to redirect adding data to the card
                  url(r'^get_waiter_card_data//$', views.get_waiter_card_data, name='get_waiter_card_data'),


                  url(r'^insert_stuff/$', views.insert_stuff, name='insert_stuff'),

                  url(r'^insert_stuff/delete_table/$', db_insert.delete_table, name='delete_table'),
                  url(r'^insert_stuff/add_table/$', db_insert.add_table, name='add_food_category'),
                  url(r'^insert_stuff/add_food_information/$', db_insert.add_food_information, name='add_food_information'),
                  url(r'^insert_stuff/delete_food_information/$', db_insert.delete_food_information, name='delete_food_information'),
                  url(r'^insert_stuff/add_food_category/$', db_insert.add_food_category, name='add_food_category'),
                  url(r'^insert_stuff/delete_food_category/$', db_insert.delete_food_category, name='delete_food_category'),
                  url(r'^insert_stuff/add_food/$', db_insert.add_food, name='add_food'),
                  url(r'^insert_stuff/delete_food/$', db_insert.delete_food, name='delete_food'),
                  url(r'^insert_stuff/delete_table_order/$', db_insert.delete_table_order, name='delete_table_order'),


              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
