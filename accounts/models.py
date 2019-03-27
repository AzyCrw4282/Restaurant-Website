from django.db import models
from django.contrib.auth.models import User
from menu.models import Table

# Create your models here.
class Waiter(models.Model):
    waiter = models.OneToOneField(User, on_delete=models.CASCADE)
    tables=models.ManyToManyField(Table)
    def to_dict(self):
        table_list=[]
        for table in self.tables.all():
            table_list.append(table.to_dict())
        t_dict={"table_list":table_list}
        return t_dict