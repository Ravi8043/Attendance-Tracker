from django.urls import path
from .views import AddTimetableView, SubjectTimetableView, TodayClassesView, BulkAddTimetableView

urlpatterns = [
    path('subject/<int:subject_id>/add/', AddTimetableView.as_view(), name='add-timetable'),
    path('subject/<int:subject_id>/bulk/', BulkAddTimetableView.as_view(), name='bulk-add-timetable'),
    path('subject/<int:subject_id>/', SubjectTimetableView.as_view(), name='subject-timetable'),
    path('today/', TodayClassesView.as_view(), name='today-classes'),
]
