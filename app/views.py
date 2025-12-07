import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.db import transaction

from .serializers import ConversationWithMessagesSerializer, WebhookSerializer, ConversationExternalIdSerializer, \
    ConversationsSerializer
from .enums import TypeRequestWebhookEnum
from .services import (
    get_conversation_by_external_id,
    create_conversation,
    close_conversation,
    is_valid_message_data,
    create_message,
    get_message_by_external_id,
    get_all_conversations
)

class WebhookView(APIView):
    def post(self, request):
        if not request.body:
            return Response(
                { 'message': 'The request body is empty' },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = json.loads(request.body)

        data_serializer = WebhookSerializer(data=data)
        
        if not data_serializer.is_valid():
            return Response(
                { 'message': 'The data structure sended is not allowed' },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        
        data_verified = data_serializer.validated_data

        type_webhook_message = data_verified['type']
        timestamp = data_verified['timestamp']
        external_id = data_verified['data']['id']

        is_refer_conversation = type_webhook_message == TypeRequestWebhookEnum.NEW_CONVERSATION.value \
            or type_webhook_message == TypeRequestWebhookEnum.CLOSE_CONVERSATION.value
        is_refer_message = type_webhook_message == TypeRequestWebhookEnum.NEW_MESSAGE.value

        if is_refer_conversation:
            conversation = get_conversation_by_external_id(external_id)
        elif is_refer_message:
            message_data_is_valid = is_valid_message_data(data_verified['data'])

            if not message_data_is_valid:
                return Response(
                    { 'message': 'The message data structure sended is not allowed' },
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            
            message_already_exists = get_message_by_external_id(external_id)

            if message_already_exists is not None:
                return Response(
                    { 'message': 'Message already exists' },
                    status=status.HTTP_409_CONFLICT
                )

            conversation_external_id = data_verified['data']['conversation_id']

            if conversation_external_id is None:
                return Response(
                    { 'message': 'The conversation_id is required' },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            conversation = get_conversation_by_external_id(conversation_external_id)
        else:
            return Response(
                { 'message': 'The webhook type is not recognized' },
                status=status.HTTP_405_METHOD_NOT_ALLOWED
            )

        try:
            with transaction.atomic():
                if type_webhook_message == TypeRequestWebhookEnum.NEW_CONVERSATION.value:
                    if conversation is not None:
                        return Response(
                            { 'message': 'Conversation already exists' },
                            status=status.HTTP_409_CONFLICT
                        )

                    return create_conversation(
                        external_id=external_id,
                        timestamp=timestamp
                    )
                
                if type_webhook_message == TypeRequestWebhookEnum.CLOSE_CONVERSATION.value:
                    if conversation.closed_at is not None:
                        return Response(
                            { 'message': 'Conversation already is closed' },
                            status=status.HTTP_409_CONFLICT
                        )

                    return close_conversation(
                        external_id=external_id,
                        timestamp=timestamp
                    )
                
                if type_webhook_message == TypeRequestWebhookEnum.NEW_MESSAGE.value:
                    if conversation is None:
                        return Response(
                            { 'message': 'Conversation not found' },
                            status=status.HTTP_404_NOT_FOUND
                        )

                    if conversation.closed_at is not None:
                        return Response(
                            { 'message': 'Cannot add messages to a closed conversation' },
                            status=status.HTTP_400_BAD_REQUEST
                        )                    

                    direction = data_verified['data']['direction']
                    content = data_verified['data']['content']

                    return create_message(
                        conversation=conversation,
                        external_id=external_id,
                        direction=direction,
                        content=content,
                        timestamp=timestamp
                    )
        except Exception as error:
            print('***** error', error)
            return Response(
                {"message": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ConversationDetailView(APIView):
    def get(self, request, external_id):
        external_id_serializer = ConversationExternalIdSerializer(data={"external_id": external_id})

        if not external_id_serializer.is_valid():
            return Response(
                { 'message': 'Parameter ID must be a valid UUID' },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        conversation = get_conversation_by_external_id(conversation_external_id=external_id)

        if conversation is None:
            return Response(
                {"message": "Conversation not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ConversationWithMessagesSerializer(conversation)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ConversationsView(APIView):
    def get(self, request):
        conversation = get_all_conversations()

        serializer = ConversationsSerializer(conversation, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
