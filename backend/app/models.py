from django.contrib.auth.models import User
from django.db import models


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.IntegerField()
    developer = models.BooleanField(default=False)


class Forum(models.Model):
    # This should not default to null, but Django will interrupt the makemigrations
    # process, otherwise.
    account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)

    route = models.CharField(max_length=50, default="NULL")
    name = models.CharField(max_length=50)
    description = models.CharField()

    class License(models.TextChoices):
        MIT = "MIT"
        APACHE = "APACHE"
        BSD = "BSD"

    license = models.CharField(choices=License.choices)
    repository = models.CharField()
    website = models.CharField()


class Discussion(models.Model):
    # This should not default to null, but Django will interrupt the makemigrations
    # process, otherwise.
    route = models.CharField(max_length=6, default="NULL")
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE)

    # This should not default to null, but Django will interrupt the makemigrations
    # process, otherwise
    account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)

    title = models.CharField()
    description = models.CharField()


class Comment(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)

    # This should not default to null, but Django will interrupt the makemigrations
    # process, otherwise.
    account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)

    content = models.CharField()


class Key(models.Model):
    key = models.CharField()
    time = models.DateTimeField()
    used = models.BooleanField(default=False)
