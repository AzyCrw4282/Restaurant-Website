from django.shortcuts import render
from .forms import FoodForm
from menu.models import Food
from django.http import Http404, StreamingHttpResponse, HttpResponseRedirect, HttpResponse


# Create your views here.
def waiter(request):
    return render(request,"waiter/templates/Waitercard.html",{})


def get_waiter_card_data(request):













    return (1)










def insert_stuff(request):
    if request.method == 'POST':
        print("received post request")
        form = FoodForm(request.POST, request.FILES)
        print("form recieved")
        print(form)
        if form.is_valid():
            print('form validated')
            instance = form.save(commit=False)
            instance.save()
            print("form saved")

    print("called insert stuff")
    user = request.user
    context = {'user': user, 'food_form': FoodForm()}
    return render(
        request, 'waiter/templates/insert_example.html', context)


def delete_food(request):
    print("called delete_food")
    if request.method == 'POST':
        print("received delete_food request")
        try:
            food_object = Food.objects.get(id=request.POST['food_id'])
            food_object.delete()
            print("delete successful?")
            HttpResponseRedirect("/menu/waiter/")

        except:
            print("error deleting food ")
            return
