from enum import Enum

class TypeRequestWebhookEnum(Enum):
  NEW_CONVERSATION = "NEW_CONVERSATION"
  NEW_MESSAGE = "NEW_MESSAGE"
  CLOSE_CONVERSATION = "CLOSE_CONVERSATION"

class DirectionMessageEnum(Enum):
  SENT = "SENT"
  RECEIVED = "RECEIVED"

typeRequestWebhookList = [typeRequestWebhook.value for typeRequestWebhook in TypeRequestWebhookEnum]
directionMessageList = [directionMessage.value for directionMessage in DirectionMessageEnum]