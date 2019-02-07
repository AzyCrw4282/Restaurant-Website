from django.conf.urls import url
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views

urlpatterns = [
                  path('',views.chef, name='chef'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
