from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, IntegerField
from rest_flex_fields import FlexFieldsModelSerializer
from django.contrib.auth.models import User


class CoreModelSerializer(FlexFieldsModelSerializer): 
    pass


class HistoryModelSerializer(CoreModelSerializer):
    id               = IntegerField          (source='history_id'   , read_only=True)
    obj_id           = IntegerField          (source='id'           , read_only=True)
    history_user_id  = PrimaryKeyRelatedField(source='history_user' , queryset=User.objects.all())


class UserSerializer(ModelSerializer):
    class Meta:
        model = User 
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
        ] 
