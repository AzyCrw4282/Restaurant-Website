from django.conf.urls import url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
app_name = 'chef'
urlpatterns = [
                  path('', views.main_page, name='main_page'),
                  url(r'^get_order_states/$', views.get_order_states, name='get_order_states'),
                  url(r'^get_table_order_states/$', views.get_table_order_states, name='get_table_order_states'),
                  url(r'^change_order_state/$', views.change_order_state, name='change_order_state'),
                  url(r'^change_table_order_state/$', views.change_table_order_state, name='change_table_order_state')
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
