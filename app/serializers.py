from rest_framework import serializers

from .enums import typeRequestWebhookList, directionMessageList
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
  class Meta:
    model = Message
    fields = ['id', 'external_id', 'direction', 'content', 'created_at']


class ConversationWithMessagesSerializer(serializers.ModelSerializer):
  messages = MessageSerializer(many=True, read_only=True)

  class Meta:
    model = Conversation
    fields = ['id', 'external_id', 'state', 'created_at', 'closed_at', 'messages']

class ConversationsSerializer(serializers.ModelSerializer):
  class Meta:
    model = Conversation
    fields = ['id', 'external_id','state', 'created_at', 'closed_at']

class WebhookDataItemSerializer(serializers.Serializer):
  id = serializers.UUIDField()
  conversation_id = serializers.UUIDField(required=False)
  direction = serializers.ChoiceField(choices=directionMessageList, required=False)
  content = serializers.CharField(required=False)

class WebhookSerializer(serializers.Serializer):
  type = serializers.ChoiceField(choices=typeRequestWebhookList)
  timestamp = serializers.DateTimeField()
  data = WebhookDataItemSerializer()

class WebhookDataItemValidationNewMessageSerializer(serializers.Serializer):
  id = serializers.UUIDField()
  conversation_id = serializers.UUIDField()
  direction = serializers.ChoiceField(choices=directionMessageList)
  content = serializers.CharField()

class ConversationExternalIdSerializer(serializers.Serializer):
  external_id = serializers.UUIDField()