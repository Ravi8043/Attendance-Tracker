from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .utils import calculate_stats


from .serializers import AttendanceSerializer
from .models import Attendance
from subjects.models import Subject

#this is to mark attendance for a subject on a specific date in calender
class MarkAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get("subject")
        date = request.data.get("date")
        status_value = request.data.get("status")

        if not all([subject_id, date, status_value]):
            return Response(
                {"detail": "subject, date and status are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subject = Subject.objects.get(
            id=subject_id,
            owner=request.user #here changed user to owner as i have the field name as owner
        )

        attendance, _ = Attendance.objects.update_or_create(
            subject=subject,
            date=date,
            defaults={"status": status_value},
        )

        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def delete(self, request):
        subject_id = request.data.get("subject")
        date = request.data.get("date")

        if not all([subject_id, date]):
            return Response(
                {"detail": "subject and date are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Attendance.objects.filter(
            subject__id=subject_id,
            subject__owner=request.user,
            date=date,
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
#this is to get attendance records for a specific subject
#in frontend think like click a subject -> see full attendance history
#The calendar (needs all attendance records → list) view for that subject
#this is for the info calendar to show which days were present/absent/no class
class SubjectAttendanceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, subject_id):
        subject = Subject.objects.get(
            id=subject_id,
            owner=request.user
        )

        records = Attendance.objects.filter(subject=subject)
        #here we pack the records into serializer to convert to json and 
        #send to frontend by response
        serializer = AttendanceSerializer(records, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    


#Stats (present, absent, percentage → summary) for a specific subject
#this is for the summary view for a subject

class SubjectAttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, subject_id):
        subject = Subject.objects.get(
            id=subject_id,
            owner=request.user
        )

        records = Attendance.objects.filter(subject=subject)
        stats = calculate_stats(records)

        return Response(stats, status=status.HTTP_200_OK)

class OverallAttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = Attendance.objects.filter(
            subject__owner=request.user #changed to owner from user
        )

        stats = calculate_stats(records)
        return Response(stats, status=status.HTTP_200_OK)
