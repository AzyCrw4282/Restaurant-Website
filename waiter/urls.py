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
                  url(r'^delete_table/$', db_insert.delete_table, name='delete_table'),
                  url(r'^add_table/$', db_insert.add_table, name='add_food_category'),
                  url(r'^add_food_information/$', db_insert.add_food_information, name='add_food_information'),
                  url(r'^delete_food_information/$', db_insert.delete_food_information, name='delete_food_information'),
                  url(r'^add_food_category/$', db_insert.add_food_category, name='add_food_category'),
                  url(r'^delete_food_category/$', db_insert.delete_food_category, name='delete_food_category'),
                  url(r'^add_food/$', db_insert.add_food, name='add_food'),
                  url(r'^delete_food/$', db_insert.delete_food, name='delete_food'),
                  url(r'^delete_table_order/$', db_insert.delete_table_order, name='delete_table_order'),


              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
