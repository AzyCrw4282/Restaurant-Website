from django.shortcuts import render
from .forms import FoodForm
from menu.models import Food
# Create your views here.
def waiter(request):
    pass

def insert_stuff(request):
    if request.method=='POST':
        print("received post request")
        form=FoodForm(request.POST,request.FILES)
        print("form recieved")
        print(form)
        if form.is_valid():
            print('form validated')
            instance=form.save(commit=False)
            instance.save()
            print("form saved")

    print("called inser stuff")
    user = request.user
    context = {'user': user,'food_form':FoodForm()}
    return render(
        request, 'waiter/templates/insert_example.html', context)

