from django.conf.urls import url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from waiter import views as waiter_views
from . import db_insert

urlpatterns = [
                  path('',views.menu, name='menu'),
                  url(r'^delete_food/$', waiter_views.delete_food, name='delete_food'),
                  url(r'^add_food_to_order/$', views.add_food_to_order, name='add_table_order'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
