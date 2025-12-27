import { create } from "zustand";

export type ModalType =
  | "create-workspace"
  | "invite-people"
  | "create-document";

export interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: Record<string, unknown>) => void;
  onClose: () => void;
  data?: Record<string, unknown>;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type, data) =>
    set({
      isOpen: true,
      type,
      data,
    }),
  onClose: () => set({ type: null, isOpen: false }),
}));
