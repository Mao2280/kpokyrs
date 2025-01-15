from .views import *


def employee(router):
    router.register('employee', EmployeeViewSet, basename='employee')
    router.register('child', ChildViewSet, basename='child')
