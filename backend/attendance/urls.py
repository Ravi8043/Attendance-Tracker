from django.urls import path
from .views import (
    MarkAttendanceView,
    SubjectAttendanceListView,
    SubjectAttendanceStatsView,
    OverallAttendanceStatsView,
)

urlpatterns = [
    # Mark or update attendance for a subject on a specific date
    path("mark/", MarkAttendanceView.as_view(), name="mark-attendance"),

    # Get all attendance records for a subject (calendar view)
    path("subject/<int:subject_id>/records/", SubjectAttendanceListView.as_view(), name="subject-attendance-records"),

    # Get stats (present, absent, percentage) for a subject
    path("subject/<int:subject_id>/stats/", SubjectAttendanceStatsView.as_view(), name="subject-attendance-stats"),

    # Get overall attendance stats for the user (dashboard)
    path("overall-stats/", OverallAttendanceStatsView.as_view(), name="overall-attendance-stats"),
]
