from django.conf.urls import url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from TeamProject2019_01.views import menu_redirect
from waiter import views as waiter_views

app_name = 'menu'
urlpatterns = [
                  path('', views.welcome_page, name='welcome_page'),
                  url(r'^/$', menu_redirect, name='none'),
                  url(r'^(?P<table_id>[^/]+)/$', views.menu_unsafe, name='menu_unsafe'),
                  url(r'^table_order/(?P<table_order_id>[^/]+)/$', views.menu_safe, name='menu_safe'),

                  url(r'^table_order/(?P<table_order_id>[^/]+)/submit_order/$', views.submit_order,
                      name='submit_order'),
                  url(r'^table_order/(?P<table_order_id>[^/]+)/get_menu_popup_data/$', views.get_menu_popup_data,
                      name='get_menu_popup_data'),
                  url(r'^table_order/[^/]+/delete_food_from_menu/$', waiter_views.delete_food,
                      name='delete_food_from_menu'),
                  url(r'^table_order/(?P<table_order_id>[^/]+)/delete_food_from_order/$', views.delete_food_from_order,
                      name='delete_food_from_order'),
                  url(r'^table_order/(?P<table_order_id>[^/]+)/add_food_to_order/$', views.add_food_to_order,
                      name='add_food_to_order'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
