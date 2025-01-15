from django.db.models import Model, CharField, DateField, ForeignKey, CASCADE


class Employee(Model):
    fisrt_name = CharField(max_length=64)
    patronymic = CharField(max_length=64)
    last_name  = CharField(max_length=64)

    def __str__(self):
        return f"{self.id} {self.last_name} {self.fisrt_name} {self.patronymic}"


class Child(Model):
    fisrt_name = CharField(max_length=64)
    patronymic = CharField(max_length=64)
    last_name  = CharField(max_length=64)
    birthday   = DateField()
    parent     = ForeignKey(Employee, on_delete=CASCADE, related_name='children')

    def __str__(self):
        return f"{self.id} {self.birthday} = {self.last_name} {self.fisrt_name} {self.patronymic} ({self.parent})"
    