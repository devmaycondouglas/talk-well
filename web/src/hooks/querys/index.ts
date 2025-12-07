import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  closeConversation,
  fetchConversationDetails,
  fetchConversations,
  newConversation,
  sendMessage,
} from "@/services";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });
};

export const useConversation = (id?: string) => {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => fetchConversationDetails(id!),
    enabled: !!id,
    refetchInterval: 5000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.conversationId],
      });
    },
  });
};

export const useNewConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: newConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useCloseConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeConversation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.external_id],
      });

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
