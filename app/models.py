from django.db import models
from django.core.exceptions import ValidationError

class Conversation(models.Model):
  STATE_OPEN = 'OPEN'
  STATE_CLOSED = 'CLOSED'

  STATE_CHOICES = [
    (STATE_OPEN, STATE_OPEN),
    (STATE_CLOSED, STATE_CLOSED),
  ]

  external_id = models.UUIDField(
    editable=False,
    unique=True
  )
  created_at = models.DateTimeField(editable=False)
  closed_at = models.DateTimeField(blank=True, null=True, editable=False)
  state = models.CharField(max_length=6, choices=STATE_CHOICES, default=STATE_OPEN)

  def __str__(self):
    return f"Conversation {self.pk} - ({self.state})"


class Message(models.Model):
  DIRECTION_SENT = 'SENT'
  DIRECTION_RECEIVED = 'RECEIVED'

  DIRECTION_CHOICES = [
    (DIRECTION_SENT, DIRECTION_SENT),
    (DIRECTION_RECEIVED, DIRECTION_SENT),
  ]

  external_id = models.UUIDField(
    editable=False,
    unique=True
  )
  conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
  direction = models.CharField(max_length=8, choices=DIRECTION_CHOICES)
  content = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def clean(self):
    if self.conversation and self.conversation.state == Conversation.STATE_CLOSED:
      raise ValidationError('Cannot add messages to a closed conversation')

  def save(self, *args, **kwargs):
    self.full_clean()
    super().save(*args, **kwargs)

  def __str__(self):
    return f"Message {self.pk} - ({self.type})"