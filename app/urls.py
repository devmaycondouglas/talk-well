from django.urls import path
from .views import WebhookView, ConversationDetailView, ConversationsView

urlpatterns = [
    path("webhook/", WebhookView.as_view(), name="webhook"),
    path("conversations/<str:external_id>/", ConversationDetailView.as_view(), name="conversation-detail"),
    path("conversations/", ConversationsView.as_view(), name="conversations-list"),
]
