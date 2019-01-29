from django.conf.urls import include, url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from django.views.generic import RedirectView
from django.contrib import admin
urlpatterns = [
                  path('',views.menu, name='menu'),
                  url(r'^add_stuff/$', views.add_stuff, name='add_stuff'),

                  url(r'^table_list/$', views.table_list, name='table_list'),

                  url(r'^add_stuff/add_table/$', views.add_table, name='add_table'),
                  url(r'^add_stuff/add_customer/$', views.add_customer, name='add_customer'),
                  url(r'^add_stuff/add_order/$', views.add_order, name='add_order'),
                  url(r'^add_stuff/add_food/$', views.add_food, name='add_food'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
