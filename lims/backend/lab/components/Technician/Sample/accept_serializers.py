from rest_framework import serializers
from lab.models import Sample


class AcceptSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        fields = '__all__'
