from django.urls import path
from django.conf.urls import url
from django.conf.urls import include
from django.contrib.auth.views import LoginView, LogoutView
from . import views

# ----------URL'S AVAILABLE FOR ACTIVITIES RELATED TO USER MODEL SPECIFICALLY-------------
app_name = 'accounts'
urlpatterns = [
    url(r'^login/$', LoginView.as_view(), {'template_name': 'accounts/templates/registration/login.html'},
        name='login'),
    url(r'authenticated/$', views.login_redirect,name='login_redirect'),
    url(r'^logout/$', LogoutView.as_view(), {'template_name': 'accounts/templates/registration/logout.html'},
        name='logout'),
    url(r'^manager/$', views.manager, name='manager'),
    url(r'^manager/create_account/$', views.create_account, name='create_account'),
    url(r'^manager/delete_account/$', views.delete_account, name='delete_account'),
    url(r'^manager/delete_old_table_orders/$', views.delete_old_table_orders, name='delete_old_table_orders'),
    url(r'^manager/get_all_orders_cost_date/$', views.get_all_orders_cost_date,
        name='get_all_orders_cost_date'),
    url(r'^manager/generate_random_orders/$', views.generate_random_orders, name='generate_random_orders'),
    url(r'^manager/delete_fake_orders/$', views.delete_fake_orders, name='delete_fake_orders'),

]
