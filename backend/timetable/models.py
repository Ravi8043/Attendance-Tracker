from django.db import models
from subjects.models import Subject

#here say dbms sub on Mon and Tues and wed
#3 objects of timetable for that subjects are created
#eg: Subject: DBMS
#Day: Mon, start_time: 10:00, end_time: 11:00 --> object 1
#Day: Tues, start_time: 11:00, end_time: 12:00 --> object 2
#Day: Wed, start_time: 12:00, end_time: 13:00   --> object 3
# we just filter timetable objects based on day of week to get the classes of that day

class Timetable(models.Model):
    class DayOfWeek(models.TextChoices):
        MONDAY = "MON", "Monday"
        TUESDAY = "TUE", "Tuesday"
        WEDNESDAY = "WED", "Wednesday"
        THURSDAY = "THU", "Thursday"
        FRIDAY = "FRI", "Friday"
        SATURDAY = "SAT", "Saturday"
        SUNDAY = "SUN", "Sunday"

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="timetable"
    )

    day_of_week = models.CharField(
        max_length=3,
        choices=DayOfWeek.choices
    )

    start_time = models.TimeField(
        null=True,
        blank=True
    )

    end_time = models.TimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("subject", "day_of_week")
        ordering = ["day_of_week"]

    def __str__(self):
        return f"{self.subject} - {self.get_day_of_week_display()}"

