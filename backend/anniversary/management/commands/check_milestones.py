from django.core.management.base import BaseCommand
from anniversary.tasks import check_pushes


class Command(BaseCommand):
    help = "Verifică și trimite notificările push"

    def handle(self, *args, **kwargs):
        check_pushes()