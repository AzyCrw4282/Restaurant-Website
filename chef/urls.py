from django.conf.urls import url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views

urlpatterns = [
                  path('',views.chef, name='chef'),
                  url(r'^chef/set_order_state/$',views.set_order_state(),name='set_order_state'),
                  url(r'^chef/set_table_order_state/$',views.set_table_order_state(),name='set_table_order_state')
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
