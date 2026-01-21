from rest_framework import serializers
from .models import Subject

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_name', 'subject_code', 'owner', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        instance.subject_name = validated_data.get('subject_name', instance.subject_name)
        instance.subject_code = validated_data.get('subject_code', instance.subject_code)
        instance.save()
        return instance



