import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import dayjs from "dayjs"
import { Conversation } from "@/types";
import { MessageCircleOffIcon, UserIcon } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string, numberConversationSelected: number) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
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

  const renderConversationTree = () => {
    if (conversations.length <= 0) {
      return <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
        <MessageCircleOffIcon size={48} className="text-muted-foreground mb-4"/>
        <h2 className="text-lg font-medium text-foreground mb-2">Nenhuma conversa encontrada</h2>
        <p className="text-sm text-muted-foreground">Inicie uma nova conversa para começar a interagir.</p>
      </div>;
    }

    return conversations.map((conversation, index) => (
      <button
        key={conversation.id}
        onClick={() => onSelect(conversation.external_id, index + 1)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group",
          selectedId === conversation.id
            ? "bg-primary/10 shadow-sm border border-primary/20"
            : "hover:bg-muted/50 border border-transparent hover:border-border/30"
        )}
      >
        <div className="relative">
          <Avatar className="h-8 w-8 border-2 border-background shadow-sm flex items-center justify-center">
            <UserIcon size={18}/>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className={cn(
              "font-semibold truncate text-sm",
              selectedId === conversation.id ? "text-primary" : "text-foreground"
            )}>
              Conversa {index + 1}
            </span>
          </div>

          {renderStateConversation(conversation.state, conversation.state === 'CLOSED' ? conversation.closed_at! : conversation.created_at)}
        </div>
      </button>
    ))
  }


  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-2 p-1">
        {renderConversationTree()}
      </div>
    </ScrollArea>
  );
}
