from django.shortcuts import redirect


def login_redirect(request):
    return redirect('/accounts/login')

def menu_redirect(request):
    return redirect('/menu')
