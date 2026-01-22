from datetime import date

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Timetable
from .serializers import TimetableSerializer
from subjects.models import Subject


class BulkAddTimetableView(APIView):
    """
    Endpoint to save multiple days for a subject in one request.
    Frontend sends a list of days (e.g., ["MON", "WED", "THU"]).
    Backend will create missing entries and delete days not in the list.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, subject_id):
        subject = Subject.objects.get(id=subject_id, user=request.user)
        days = request.data.get("days", [])

        if not isinstance(days, list) or not days:
            return Response(
                {"detail": "Please provide a non-empty list of days."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Delete timetable entries that are not in the list
        Timetable.objects.filter(subject=subject).exclude(day_of_week__in=days).delete()

        # Create missing entries
        for day in days:
            Timetable.objects.update_or_create(
                subject=subject,
                day_of_week=day
            )

        return Response(
            {"detail": "Timetable updated successfully."},
            status=status.HTTP_200_OK
        )

#If a DRF view defines only post(), opening its URL in the browser sends a GET request, 
# which results in the Browsable API form instead of JSON(like -- media type, content). 
# This is expected behavior and not an error.
class AddTimetableView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, subject_id):
        subject = Subject.objects.get(
            id=subject_id,
            user=request.user
        )

        serializer = TimetableSerializer(data=request.data)
        if serializer.is_valid():
            Timetable.objects.update_or_create(
                subject=subject,
                day_of_week=serializer.validated_data["day_of_week"],
                defaults={
                    "start_time": serializer.validated_data.get("start_time"),
                    "end_time": serializer.validated_data.get("end_time"),
                }
            )
            # Respond with success message i dont need to return the created object
            # since frontend already has the data it sent
            # i will view the timetable in a separate view called SubjectTimetableView
            return Response(
                {"detail": "Timetable saved successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubjectTimetableView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, subject_id):
        subject = Subject.objects.get(
            id=subject_id,
            user=request.user
        )

        timetable = Timetable.objects.filter(subject=subject)
        serializer = TimetableSerializer(timetable, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class TodayClassesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today_code = date.today().strftime("%a").upper()[:3]

        timetable = Timetable.objects.filter(
            subject__user=request.user,
            day_of_week=today_code
        )

        serializer = TimetableSerializer(timetable, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
