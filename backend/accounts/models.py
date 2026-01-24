from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    id_card_number = models.CharField(max_length=20, unique=True)


    def __str__(self):
        return self.id_card_number  # or self.username, up to you
