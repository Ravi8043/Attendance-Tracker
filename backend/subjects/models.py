from django.db import models
from django.contrib.auth.models import User



class Subject(models.Model):
    subject_name = models.CharField(max_length=100)
    subject_code = models.CharField(max_length=20, blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subjects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('subject_name', 'owner')
        ordering = ['subject_name']

    def __str__(self):
        return self.subject_name