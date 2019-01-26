from django.conf.urls import include, url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views
from django.views.generic import RedirectView
from django.contrib import admin
urlpatterns = [
                  path('',views.menu, name='menu'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
