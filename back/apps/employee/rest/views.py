from apps.core.rest.views import CoreModelViewSet
from .serializers import *

# CRUD
# create
# read
# update
# delete
class EmployeeViewSet(CoreModelViewSet):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            """ SELECT * FROM employee_employee """
            return Employee.objects.all()
        else:
            return Employee.objects.all()
        

class ChildViewSet(CoreModelViewSet):
    serializer_class = ChildSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Child.objects.all()
        else:
            return Child.objects.all()