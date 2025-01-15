from rest_framework.serializers import PrimaryKeyRelatedField
from apps.core.rest.serializers import CoreModelSerializer
from ..models import *

# как мы превращаем данные в json и обратно
class EmployeeSerializer(CoreModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        expandable_fields = {
            'children': ('apps.employee.rest.ChildSerializer', {'many': True}),
        }


class ChildSerializer(CoreModelSerializer):
    parent_id = PrimaryKeyRelatedField(source='parent', queryset=Employee.objects.all())
    class Meta:
        model = Child
        exclude = ('parent', )
