from django.conf.urls import url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from . import db_insert

urlpatterns = [
                  path('',views.menu, name='menu'),
                  url(r'^(?P<table_id>\d+)/add_table_order/$', db_insert.add_table_order, name='add_table_order'),


              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
