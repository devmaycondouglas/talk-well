import { cn } from "@/lib/utils";
import { Message } from "@/types";
import dayjs from "dayjs";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in slide-in-from-bottom-2 duration-300",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm",
          isCurrentUser
            ? "bg-primary/90 text-primary-foreground rounded-br-none"
            : "bg-card/80 text-card-foreground border border-border/50 rounded-bl-none"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span
          className={cn(
            "text-[10px] mt-1 block text-right opacity-70",
            isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {dayjs(message.created_at).format("DD/MM/YYYY HH:mm")}
        </span>
      </div>
    </div>
  );
}
