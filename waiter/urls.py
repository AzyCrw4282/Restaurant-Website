from django.conf.urls import include, url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from django.views.generic import RedirectView
from django.contrib import admin

app_name = 'waiter'
urlpatterns = [
                  path('', views.main_page, name="main_page"),
                  url(r'^delete_food/$', views.delete_food, name='delete_food'),
                  url(r'^deselect_table/$', views.deselect_table, name='deselect_table'),
                  url(r'^select_table/$', views.select_table, name='select_table'),

                  # url redirection for states
                  url(r'^change_table_order_state/$', views.change_table_order_state, name='change_table_order_state'),


                  url(r'^get_table_order_list/$', views.get_table_order_list, name='get_table_order_list'),

                  url(r'^insert_stuff/$', views.insert_stuff, name='insert_stuff'),
                  url(r'^insert_stuff/add_information_to_food/$', views.add_information_to_food,
                      name='add_information_to_food'),

                  url(r'^insert_stuff/delete_table/$', views.delete_table, name='delete_table'),
                  url(r'^insert_stuff/add_table/$', views.add_table, name='add_food_category'),
                  url(r'^insert_stuff/add_food_information/$', views.add_food_information,
                      name='add_food_information'),
                  url(r'^insert_stuff/delete_food_information/$', views.delete_food_information,
                      name='delete_food_information'),
                  url(r'^insert_stuff/add_food_category/$', views.add_food_category, name='add_food_category'),
                  url(r'^insert_stuff/delete_food_category/$', views.delete_food_category,
                      name='delete_food_category'),
                  url(r'^insert_stuff/add_food/$', views.add_food, name='add_food'),
                  url(r'^insert_stuff/delete_food/$', views.delete_food, name='delete_food'),
                  url(r'^insert_stuff/delete_table_order/$', views.delete_table_order, name='delete_table_order'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
