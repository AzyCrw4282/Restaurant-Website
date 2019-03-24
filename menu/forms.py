from django import forms
from .models import Table
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


