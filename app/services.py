from rest_framework.response import Response
from rest_framework import status

from django.db import IntegrityError
from django.core.exceptions import ValidationError

from .models import Conversation, Message
from .serializers import WebhookDataItemValidationNewMessageSerializer

def get_all_conversations():
    conversations = Conversation.objects.all().order_by('id')

    return conversations

def get_conversation_by_external_id(conversation_external_id):
    try:
        conversation = Conversation.objects.get(external_id=conversation_external_id)

        return conversation
    except Conversation.DoesNotExist:
        return None

def create_conversation(external_id, timestamp):
    try:
        conversation = Conversation()
        conversation.external_id = external_id
        conversation.created_at = timestamp
        conversation.save()

        return Response(None, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response(
            {"message": "Ocorreu um erro de violação de integridade"},
            status=status.HTTP_400_BAD_REQUEST,
        )

def close_conversation(external_id, timestamp):
    try:
        conversation = Conversation.objects.get(external_id=external_id)
        conversation.state = Conversation.STATE_CLOSED
        conversation.closed_at = timestamp
        conversation.save()

        return Response(None, status=status.HTTP_204_NO_CONTENT)
    except Conversation.DoesNotExist:
        return Response(
            {"message": "Conversation not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    
def is_valid_message_data(message_data):
    message_data_serializer = WebhookDataItemValidationNewMessageSerializer(data=message_data)
    
    if not message_data_serializer.is_valid():
        return False
    
    return True

def get_message_by_external_id(message_external_id):
    try:
        message = Message.objects.get(external_id=message_external_id)

        return message
    except Message.DoesNotExist:
        return None

def create_message(conversation, external_id, direction, content, timestamp):
    try:
        message = Message()
        message.conversation = conversation
        message.external_id = external_id
        message.direction = direction
        message.content = content
        message.created_at = timestamp
        message.save()

        return Response(None, status=status.HTTP_201_CREATED)
    except ValidationError as validation_error_message:
        return Response(
            {"message": str(validation_error_message)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except IntegrityError:
        return Response(
            {"message": "Ocorreu um erro de violação de integridade"},
            status=status.HTTP_400_BAD_REQUEST,
        )