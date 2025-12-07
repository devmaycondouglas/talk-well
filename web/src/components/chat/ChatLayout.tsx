import { useState } from "react";
import { Conversation, Message } from "@/types";
import { ConversationList } from "./ConversationList";
import { ChatArea } from "./ChatArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, MessageSquarePlus, Settings, PlusIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ButtonGroup } from "../ui/button-group";

interface ChatLayoutProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string, numberConversationSelected: number) => void;
  onSendMessage: (content: string, direction: "RECEIVED" | "SENT") => void;
  onHandleCreateConversation: () => void;
}

export function ChatLayout({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onSendMessage,
  onHandleCreateConversation
}: ChatLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400 font-heading">
            Mensagens
          </h1>
        </div>

        <div className="flex items-center justify-end">
          <Button onClick={onHandleCreateConversation}>
            <PlusIcon /> Nova Conversa
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-3">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={(id, numberConversationSelected) => {
            onSelectConversation(id, numberConversationSelected);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 lg:w-96 h-full border-r border-border/40 bg-background/30 backdrop-blur-xl z-10">
        <SidebarContent />
      </div>

      {/* Mobile Header & Drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md z-50 flex items-center px-4 justify-between">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-r border-border/40 bg-background/95 backdrop-blur-xl">
            <VisuallyHidden>
              <SheetTitle>Menu de Navegação</SheetTitle>
            </VisuallyHidden>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="font-heading font-bold text-lg">Chat</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 max-h-screen relative z-0 pt-16 md:pt-0">
        <ChatArea
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
}
