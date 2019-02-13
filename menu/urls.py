from django.conf.urls import url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from waiter import views as waiter_views
from . import db_insert

urlpatterns = [
                  path('',views.menu, name='menu'),
                  url(r'^(?P<table_id>[^/]+)/$',views.menu_with_id, name='uuid_menu'),

                  url(r'^(?P<table_id>[^/]+)/delete_food_from_order/$', waiter_views.delete_food, name='delete_food_from_order'),
                  url(r'^(?P<table_id>[^/]+)/add_food_to_order/$', views.add_food_to_order, name='add_food_to_order'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
