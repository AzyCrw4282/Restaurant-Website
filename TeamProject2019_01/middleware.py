import re
from django.conf import settings
from django.urls import reverse
from django.shortcuts import redirect
from django.contrib.auth import logout
from . import views

EXEMPT_URLS = [re.compile(settings.LOGIN_URL.lstrip('/'))]
if hasattr(settings, 'LOGIN_EXEMPT_URLS'):
    EXEMPT_URLS += [re.compile(url) for url in settings.LOGIN_EXEMPT_URLS]

STAFF_URLS =[]
if hasattr(settings, 'STAFF_URLS'):
    STAFF_URLS += [re.compile(url) for url in settings.STAFF_URLS]

# ---PREVENT USER FROM ACCESSING UNWANTED PAGES IF NOT LOGGED IN
class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        assert hasattr(request, 'user')
        path = request.path_info.lstrip('/')
        # if not request.user.is_authenticated:
        #     if not any(url.match(path) for url in EXEMPT_URLS):
        #         return redirect(settings.LOGIN_URL)
        # print("CURRENT URL: ",path)
        # print("EXEMPT URLS: ",EXEMPT_URLS)
        # print("STAFF URLS: ",STAFF_URLS)

        url_is_exempt = any(url.match(path) for url in EXEMPT_URLS)
        url_is_for_staff_only=any(url.match(path) for url in STAFF_URLS)
        # print("THIS IS EXEMPT ONLY URL", url_is_exempt)
        # print("THIS IS AN STAFF URL", url_is_for_staff_only)

        if path == reverse('accounts:logout').lstrip('/'):
            # print('logout matched')
            logout(request)
        if not(request.user.is_staff) and url_is_for_staff_only:
            # print("STAFF NOT AUTHENTICATED")
            return views.menu_redirect(request)

        if not(request.user.is_authenticated) and not(url_is_exempt):
            # print("redirect initiated")
            return views.menu_redirect(request)
