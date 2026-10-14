from django.db import models

class Memory(models.Model):
    CATEGORY_CHOICES = [
        ("prima_intalnire", "Prima intalnire"),
        ("primul_sarut", "Primul sarut"),
        ("aniversare", "Aniversare"),
        ("calatorie", "Calatorie"),
        ("moment_special", "Moment Special"),
        ("general", "General"),
    ]
    title = models.TextField(max_length=200)
    description = models.TextField()
    date = models.DateField(null=True, blank=True)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=50)
    keywords = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return self.title

class BotConversation(models.Model):
    MODE_CHOICES = [("intrebare", "Intrebare"), ("quiz", "Quiz")]

    mode = models.CharField(max_length=20, choices=MODE_CHOICES)
    log = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.mode} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"



class PushSubscription(models.Model):
    endpoint = models.URLField(unique=True, max_length=500)
    p256dh = models.CharField(max_length=255)
    auth = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    