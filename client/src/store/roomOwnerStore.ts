import { create } from 'zustand';
// import {middlewares} from "./middlewares";
import { persist } from 'zustand/middleware';


interface AuthState {
  isOwner: boolean;
  roomId: string;
  makeRoom: (roomId: string) => void;
  closeRoom: () => void;
}

const useRoomOwnerStore = create<AuthState>()(
  persist(
    (set) => ({
      isOwner: false,
      roomId: '',
      makeRoom: (roomId: string) => set(() => ({
        isOwner: true,
        roomId,
      })),
      closeRoom: () => set(() => ({
        isOwner: false,
        roomId: '',
      }))
    }),
    { name: 'roomOwnerStore' }
  )
);

export default useRoomOwnerStore;
