import { ChatLayout } from "@/components/chat/ChatLayout";
import { useConversation, useConversations, useNewConversation, useSendMessage } from "@/hooks/querys";
import { useConversationStore } from "@/stores/conversation";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { selectedConversationId, setSelectedConversationId, setNumberConversation } = useConversationStore()

  const {
    data: conversations = [],
    error: conversationsError 
  } = useConversations();

  const {
    mutateAsync: createConversationMutate
  } = useNewConversation()

  const sendMessageMutation = useSendMessage();

  const handleSelectConversation = (id: string, selectedNumberConversation = 0) => {
    setSelectedConversationId(id);

    let numberConversationSelected = selectedNumberConversation

    if (selectedNumberConversation <= 0) {
      numberConversationSelected = conversations.length + 1
    }

    setNumberConversation(numberConversationSelected);
  };

  const handleCreateConversation = () => {
    const uuid_generated = uuidv4();

    createConversationMutate({ external_id: uuid_generated }).then(() => {
        handleSelectConversation(uuid_generated);
      })
  }

  const handleSendMessage = (content: string, direction: "RECEIVED" | "SENT") => {
    if (!selectedConversationId) return;

    const uuid_generated = uuidv4();

    sendMessageMutation.mutate(
      {
        externalId: uuid_generated,
        conversationId: selectedConversationId,
        content,
        direction
      },
      {
        onError: () => {
          toast.error("Falha ao enviar mensagem. Tente novamente.");
        },
      }
    );
  };

  if (conversationsError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-destructive font-medium">Erro ao carregar conversas.</p>
        <p className="text-sm text-muted-foreground">Verifique se a API está rodando.</p>
      </div>
    );
  }

  return (
    <ChatLayout
      conversations={conversations}
      onHandleCreateConversation={handleCreateConversation}
      selectedConversationId={selectedConversationId}
      onSelectConversation={handleSelectConversation}
      onSendMessage={handleSendMessage}
    />
  );
}
