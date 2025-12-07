import { api } from "@/lib/api";
import { Conversation, ConversationDetails, Message } from "@/types";
import dayjs from "dayjs";

export const fetchConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get("/conversations");
  return data;
};

export const fetchConversationDetails = async (
  id: string
): Promise<{ conversation: Conversation; messages: Message[] }> => {
  const { data } = await api.get<ConversationDetails>(`/conversations/${id}`);

  return {
    conversation: data,
    messages: data.messages || [],
  };
};

export const sendMessage = async ({
  content,
  externalId,
  conversationId,
  direction,
}: {
  externalId: string;
  conversationId: string;
  content: string;
  direction: "RECEIVED" | "SENT";
}) => {
  const payload = {
    type: "NEW_MESSAGE",
    timestamp: dayjs().toISOString(),
    data: {
      id: externalId,
      content,
      conversation_id: conversationId,
      direction,
    },
  };

  const { data } = await api.post("/webhook/", payload);
  return data;
};

export const newConversation = async ({
  external_id,
}: {
  external_id: string;
}) => {
  const payload = {
    type: "NEW_CONVERSATION",
    timestamp: dayjs().toISOString(),
    data: {
      id: external_id,
    },
  };

  const { data } = await api.post("/webhook/", payload);

  return data;
};

export const closeConversation = async ({
  external_id,
}: {
  external_id: string;
}) => {
  const payload = {
    type: "CLOSE_CONVERSATION",
    timestamp: dayjs().toISOString(),
    data: {
      id: external_id,
    },
  };

  const { data } = await api.post("/webhook/", payload);

  return data;
};
