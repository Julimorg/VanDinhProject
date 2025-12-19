import { StompWebSocketContext } from "@/Context/StompWebSocketContext";
import { StompWebSocketContextType } from "@/Provider/StompWebSocketProvider";
import { useContext } from "react";

export const useStompWebSocket = (): StompWebSocketContextType => {
  const context = useContext(StompWebSocketContext);
  if (!context) {
    throw new Error('useStompWebSocket must be used within StompWebSocketProvider');
  }
  return context;
};