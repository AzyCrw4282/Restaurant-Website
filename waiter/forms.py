from django import forms
from menu.models import Food,FoodCategory


# Food( _id ,display, name, price, category_id , information: MtM(FoodInformation), description, picture )
class FoodForm(forms.ModelForm):

    class Meta:
        model=Food
        fields=['name','price','description','picture','category','display']
    def save(self, commit=True):
        instance=super().save(commit=False)
        if commit:
            instance.save()
        return instance


# class CustomerForm(forms.ModelForm):
#     name = forms.CharField(label='customer name',max_length=20)
#     class Meta:
#         model = Customer
#         fields = ['name']
#     def save(self, commit=True):
#         instance = super().save(commit=False)
#         if commit:
#             instance.save()
#         return instance
#
