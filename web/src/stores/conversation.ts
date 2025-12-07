import { create } from "zustand";

type IConversationStore = {
  selectedConversationId: string;
  setSelectedConversationId: (selectedConversationId: string) => void;
  numberConversation: number;
  setNumberConversation: (numberConversation: number) => void;
};

export const useConversationStore = create<IConversationStore>()(set => ({
  selectedConversationId: "",
  numberConversation: 0,
  setSelectedConversationId: selectedConversationId =>
    set(() => ({ selectedConversationId: selectedConversationId })),
  setNumberConversation: numberConversation =>
    set(() => ({ numberConversation: numberConversation })),
}));
