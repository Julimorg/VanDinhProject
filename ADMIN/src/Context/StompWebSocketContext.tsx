
import { StompWebSocketContextType } from '@/Provider/StompWebSocketProvider';
import { createContext } from 'react';

export const StompWebSocketContext = createContext<StompWebSocketContextType | null>(null);

