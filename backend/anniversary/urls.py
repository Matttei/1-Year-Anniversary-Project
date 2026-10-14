from django.urls import path

from . import views, notifications

urlpatterns = [
    path("chatbot/question/", views.bot_question, name="bot_question"),
    path("chatbot/quiz/", views.bot_quiz, name="bot_quiz"),
    path("chatbot/quiz/check/", views.check_quiz_answer, name="bot_check_quiz"),
    path("chatbot/start/", views.start_conversation, name="start_conversation"),
    path('subscribe/', notifications.save_subscription, name="push-subscribe"),
    path("check_push/", views.check_push, name="check_push")
]