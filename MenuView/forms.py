from django import forms
from MenuView.models import Table, Customer

class TableForm(forms.ModelForm):
    number_of_customers = forms.IntegerField(label='number of people:')
    reservation_date=forms.DateField(label='Reservation Date:')
    class Meta:
        model=Table
        fields=['number_of_customers','reservation_date']
    def save(self, commit=True):
        instance=super().save(commit=False)
        if commit:
            instance.save()
        return instance


class CustomerForm(forms.ModelForm):
    name = forms.CharField(label='customer name',max_length=20)
    class Meta:
        model = Customer
        fields = ['name']
    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
        return instance

