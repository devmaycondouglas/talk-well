import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageCircleXIcon, Send, UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { useConversationStore } from "@/stores/conversation";
import dayjs from "dayjs";
import { useCloseConversation, useConversation } from "@/hooks/querys";

interface ChatAreaProps {
  onSendMessage: (content: string, direction: "RECEIVED" | "SENT") => void;
}

export function ChatArea({
  onSendMessage
}: ChatAreaProps) {
  const { selectedConversationId, numberConversation } = useConversationStore()

    const { 
      data: conversationData, 
      isLoading: isLoadingMessages 
    } = useConversation(selectedConversationId);

  const [newMessage, setNewMessage] = useState("");
  const [direction, setDirection] = useState<"RECEIVED" | "SENT">("SENT");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutate: closeConversationMutate } = useCloseConversation()

  const renderStateConversation = (state: 'CLOSED' | 'OPEN', timestamp: string) => {
    const datetimeFormated = dayjs(timestamp).format('DD/MM/YYYY HH:mm');

    if (state === 'CLOSED') {
      return <span className="text-xs bg-destructive text-white font-medium py-1 px-2 rounded-sm">
        Fechada em {datetimeFormated}
      </span>;
    }

    return <span className="text-xs bg-emerald-500 text-white font-medium py-1 px-2 rounded-sm">
      Aberta em {datetimeFormated}
    </span>;
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [isLoadingMessages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage, direction);
      setNewMessage("");
    }
  };

  if (!selectedConversationId || !conversationData) {
    return (
      <div className="h-full flex flex-col my-2 items-center justify-center text-muted-foreground bg-muted/10 rounded-2xl border border-border/40 backdrop-blur-sm p-8 text-center">
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Send className="h-10 w-10 text-primary/40" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">Selecione uma conversa</h3>
        <p className="max-w-xs opacity-70">Escolha um contato na lista ao lado para começar a trocar mensagens.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-screen m-2 bg-card/40 backdrop-blur-md rounded-2xl border border-border/60 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between bg-background/40 backdrop-blur-md z-10 min-h-14">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/50 shadow-sm flex items-center justify-center">
            <UserIcon />
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm leading-none mb-1">Conversa {numberConversation}</h2>
            {renderStateConversation(conversationData?.conversation.state, conversationData?.conversation.state === 'CLOSED' ? conversationData?.conversation.closed_at! : conversationData?.conversation.created_at)}
          </div>
        </div>

        {
          conversationData?.conversation.state === 'OPEN' && 
          <Button variant="destructive" size="sm" onClick={() => closeConversationMutate({ external_id: conversationData?.conversation.external_id })}>
            <MessageCircleXIcon /> <span className="hidden md:block">Fechar Conversar</span>
          </Button>
        }
      </div>

      <ScrollArea className="overflow-auto max-h-[440px] md:max-h-full p-4 bg-linear-to-b from-transparent to-background/20">
        <div className="flex flex-col justify-end space-y-4 py-4">
          {isLoadingMessages ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conversationData.messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 opacity-50">
              <p>Nenhuma mensagem ainda.</p>
              <p className="text-xs mt-1">Envie um "Olá" para começar!</p>
            </div>
          ) : (
            conversationData.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isCurrentUser={msg.direction === "SENT"}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {
        conversationData?.conversation.state === 'OPEN' && 
        <div className="p-2 bg-background/60 backdrop-blur-md border-t border-border/40 min-h-20 overflow-auto scroll-auto max-h-[50%]">
          <form onSubmit={handleSend} className="flex items-center gap-2 relative">
            <Select value={direction} onValueChange={(value) => setDirection(value as "RECEIVED" | "SENT")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="SENT">Enviar</SelectItem>
                  <SelectItem value="RECEIVED">Receber</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="pr-12 py-6 rounded-full border-border/60 bg-background/50 focus-visible:ring-primary/30 shadow-sm"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!newMessage.trim()}
              className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 shadow-md transition-all duration-300 hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div> 
      }
    </div>
  );
}
