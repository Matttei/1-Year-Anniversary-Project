from datetime import date
from pywebpush import webpush, WebPushException
from django.conf import settings
from .models import PushSubscription
import json
import random


START_DATE = date(2025, 9, 11)


def get_todays_milestone():
    today = date.today()
    days = (today - START_DATE).days

    if days > 0 and days % 7 == 0 and days % 30 != 0:
        weeks = days // 7
        return f"🎉 {weeks} săptămâni împreună!"

    if today.day == START_DATE.day and today.month != START_DATE.month:
        months = (
            (today.year - START_DATE.year) * 12
            + today.month
            - START_DATE.month
        )
        return f"🎉 {months} luni împreună!"

    if (
        today.day == START_DATE.day
        and today.month == START_DATE.month
        and today.year > START_DATE.year
    ):
        years = today.year - START_DATE.year
        return f"🎉 {years} {'an' if years == 1 else 'ani'} împreună!"

    return None


def send_push(message, title):
    payload = json.dumps({
        "title": title,
        "body": message,
    })

    sent = False

    for sub in PushSubscription.objects.all():
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {
                        "p256dh": sub.p256dh,
                        "auth": sub.auth,
                    },
                },
                data=payload,
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={
                    "sub": settings.VAPID_CLAIM_EMAIL,
                },
            )

            print(f"✅ Push trimis către {sub.endpoint}")
            sent = True

        except WebPushException as ex:
            print(f"❌ Push eșuat pentru {sub.endpoint}: {ex}")

            if ex.response and ex.response.status_code == 410:
                sub.delete()

    return sent


def send_milestone_push():
    message = get_todays_milestone()

    if not message:
        return

    sent = send_push(message, "Aniversare 💕")

    if sent:
        print(f"🎉 Milestone trimis: {message}")


def send_random_push():
    messages = [
        "Matu te iubeste 💕",
        "Mi-e dor de tine 🥺💕",
        "Ești cea mai frumoasă persoană din viața mea ❤️",
        "Te iubesc din ce în ce mai mult 🦷",
        "Abia aștept să te văd 💕",
        "Un mic reminder că te iubesc enorm 🥰",
        "Te aștept la pervaz pui 🥺",
        "Te iubesc cel mai mult 💕",
        "Ești inima mea ❤️",
        "Te iubi mult mult multttttt 🥰",
    ]
    message = random.choice(messages)

    sent = send_push(message, "Te iubesc 💕")

    if sent:
        print(f"💌 Mesaj random trimis: {message}")


def check_pushes():
    milestone = get_todays_milestone()

    if milestone:
        send_milestone_push()
        return

    send_random_push()


def test_push():
    send_push(
        "Somn usorrrrrr 💕💕💕",
        "Te iubesc 💕",
    )