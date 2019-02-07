from django.urls import path
from django.conf.urls import url
from django.conf.urls import include
from django.contrib.auth.views import LoginView,LogoutView
#----------URL'S AVAILABLE FOR ACTIVITIES RELATED TO USER MODEL SPECIFICALLY-------------
app_name = 'accounts'
urlpatterns=[
    url(r'^login/$', LoginView.as_view(), {'template_name': 'accounts/templates/registration/login.html'}, name='login'),
    url(r'^logout/$', LogoutView.as_view(), {'template_name': 'accounts/templates/registration/logout.html'}, name='logout'),
]
