from django import forms
from .models import Table
class TableForm(forms.ModelForm):
    '''
    table form for user to fill in and submit
    '''
    number_of_customers = forms.IntegerField(label='number of people:')
    reservation_date=forms.DateField(label='Reservation Date:')
    class Meta:
        model=Table
        fields=['number_of_customers','reservation_date']
    def save(self, commit=True):
        '''
        saves the form into the database
        :param commit:
        :return:
        '''
        instance=super().save(commit=False)
        if commit:
            instance.save()
        return instance


