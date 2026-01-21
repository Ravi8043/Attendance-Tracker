from django.db import models
from subjects.models import Subject


class Attendance(models.Model):
    """
    Stores attendance status for a subject on a specific date.
    One record per subject per day.
    """

    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"
        NO_CLASS = "NO_CLASS", "No Class"

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )

    date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=Status.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("subject", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.subject.name} | {self.date} | {self.status}"

