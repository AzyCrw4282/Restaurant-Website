from django import forms
from menu.models import Food, FoodInformation


# Food( _id ,display, name, price, category_id , information: MtM(FoodInformation), description, picture )
class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        fields = ['name', 'price', 'description', 'picture', 'category', 'display']

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
        return instance


class FoodInformationForm(forms.ModelForm):
    class Meta:
        model = FoodInformation
        fields = ['name', 'ingredients']

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
        return instance

