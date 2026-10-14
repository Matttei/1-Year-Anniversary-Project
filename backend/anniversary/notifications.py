from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PushSubscription

@api_view(['POST'])
def save_subscription(request):
    data = request.data
    PushSubscription.objects.update_or_create(
        endpoint = data['endpoint'],
        defaults={
            'p256dh': data['keys']['p256dh'],
            'auth': data['keys']['auth'],
        }
    )
    return Response({'status': 'ok'})