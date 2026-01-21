from rest_framework import serializers
from .models import Timetable


class TimetableSerializer(serializers.ModelSerializer):
    day_label = serializers.CharField(
        source="get_day_of_week_display",
        read_only=True
    )

    class Meta:
        model = Timetable
        fields = [
            "id",
            "subject",
            "day_of_week",
            "day_label",
            "start_time",
            "end_time",
        ]
        read_only_fields = ["id"]