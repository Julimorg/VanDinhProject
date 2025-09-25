import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
 
} from "react";
import mqtt, {
  type MqttClient,
  type IClientOptions,
  type IClientPublishOptions,
  type IClientSubscribeOptions,
  type MqttClientEventCallbacks,
 
} from "mqtt";
import { toast } from "react-toastify";

// Định nghĩa kiểu dữ liệu cho Context
interface MQTTContextType {
  client: MqttClient | null;
  isConnected: boolean;
  connectionStatus: string;
  subscribe: (topic: string, options?: IClientSubscribeOptions) => void;
  unsubscribe: (topic: string) => void;
  publish: (
    topic: string,
    message: string,
    options?: IClientPublishOptions
  ) => void;
  on: (
    event: string,
    callback: (topic?: string, message?: Buffer, packet?: any) => void
  ) => void;
  messages: Record<string, string>;
  connect: (url?: string, options?: IClientOptions) => void;
  disconnect: () => void;
}

// Khởi tạo giá trị mặc định cho Context
const defaultContext: MQTTContextType = {
  client: null,
  isConnected: false,
  connectionStatus: "Chưa kết nối",
  subscribe: () => {},
  unsubscribe: () => {},
  publish: () => {},
  on: () => {},
  messages: {},
  connect: () => {},
  disconnect: () => {},
};

// Tạo Context
const MQTTContext = createContext<MQTTContextType>(defaultContext);

// Props cho Provider
interface MQTTProviderProps {
  children: ReactNode;
  brokerUrl?: string;
  options?: IClientOptions;
  autoConnect?: boolean;
}

export const MQTTProvider = ({
  children,
  brokerUrl = "wss://broker.stlsolution.com/mqtt",
  options = {
    username: "e6ee248623694a749c4fbf2fcfbf5f57",
    password: "",
    port: 443,
    clientId: "octl_" + Math.random().toString(16).substring(2, 10),
    reconnectPeriod: 0, // Tắt kết nối tự động
    connectTimeout: 30000, // 30 giây timeout kết nối
    clean: true, // Xóa session cũ
  },
  autoConnect = false,
}: MQTTProviderProps) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Chưa kết nối");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasConnectedOnce, setHasConnectedOnce] = useState<boolean>(false);

  const connect = (url = brokerUrl, connectOptions = options) => {
    if (client) {
      client.end(true);
    }

    if (isConnecting) {
      console.log("Đang trong quá trình kết nối, bỏ qua yêu cầu kết nối mới");
      return;
    }

    if (isConnected && hasConnectedOnce) {
      console.log("Đã kết nối, không cần kết nối lại");
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionStatus("Đang kết nối...");
      const mqttClient = mqtt.connect(url, connectOptions);

      mqttClient.on("connect", () => {
        setClient(mqttClient);
        console.log("mqttClient", mqttClient);
        setIsConnected(true);
        setHasConnectedOnce(true);
        setConnectionStatus("Đã kết nối");
        console.log("Kết nối MQTT thành công");
        setIsConnecting(false);
      });

      mqttClient.on("error", (err) => {
        console.error("Lỗi kết nối MQTT:", err);
        setConnectionStatus(`Lỗi: ${err.message}`);
        setIsConnecting(false);
      });

      mqttClient.on("disconnect", () => {
        setIsConnected(false);
        setConnectionStatus("Đã ngắt kết nối");
        setIsConnecting(false);
      });

      mqttClient.on("offline", () => {
        setIsConnected(false);
        setConnectionStatus("Mất kết nối");
        setIsConnecting(false);

        // Kết nối lại khi mất kết nối
        setTimeout(() => {
          if (!isConnected && !isConnecting) {
            console.log("Đang thử kết nối lại sau khi mất kết nối...");
            connect(url, connectOptions);
          }
        }, 5000);
      });

      mqttClient.on("message", (topic, payload) => {
        setMessages((prev) => ({
          ...prev,
          [topic]: payload.toString(),
        }));
      });

      setClient(mqttClient);
    } catch (error) {
      console.error("Lỗi khi kết nối MQTT:", error);
      setConnectionStatus(
        `Lỗi: ${error instanceof Error ? error.message : "Không xác định"}`
      );
      setIsConnecting(false);
    }
  };

  // Ngắt kết nối
  const disconnect = () => {
    if (client) {
      client.end(true);
      setClient(null);
      setIsConnected(false);
      setConnectionStatus("Đã ngắt kết nối");
    }
  };

  // Đăng ký nhận tin nhắn từ topic
  const subscribe = (topic: string, options?: IClientSubscribeOptions) => {
    if (client && isConnected) {
      client.subscribe(topic, options || {}, (err) => {
        if (err) {
          toast.error(`Lỗi khi đăng ký topic ${topic}: ${err.message}`);
          console.error(`Lỗi khi đăng ký topic ${topic}:`, err);
        } else {
          console.log(`Đã đăng ký topic thành công: ${topic}`);
        }
      });
    } else {
      console.warn("Không thể đăng ký topic khi chưa kết nối");
    }
  };

  // Hủy đăng ký topic
  const unsubscribe = (topic: string) => {
    if (client && isConnected) {
      client.unsubscribe(topic, {}, (err) => {
        if (err) {
          console.error(`Lỗi khi hủy đăng ký topic ${topic}:`, err);
        } else {
          console.log(`Đã hủy đăng ký topic thành công: ${topic}`);
        }
      });
    }
  };

  // Gửi tin nhắn đến topic
  const publish = (
    topic: string,
    message: string,
    options?: IClientPublishOptions
  ) => {
    if (client && isConnected) {
      client.publish(topic, message, options || {}, (err) => {
        if (err) {
          console.error(`Lỗi khi gửi tin nhắn đến topic ${topic}:`, err);
        } else {
          console.log(`Đã gửi tin nhắn thành công đến topic: ${topic}`);
        }
      });
    } else {
      console.warn("Không thể gửi tin nhắn khi chưa kết nối");
    }
  };

  // Đăng ký lắng nghe sự kiện
  const on = (
    event: string,
    callback: (topic?: string, message?: Buffer, packet?: any) => void
  ) => {
    if (client) {
      client.on(event as keyof MqttClientEventCallbacks, callback);
    } else {
      console.warn("Không thể đăng ký sự kiện khi chưa kết nối");
    }
  };

  // Kết nối tự động nếu cần
  useEffect(() => {
    if (autoConnect && !hasConnectedOnce) {
      connect();
    }

    // Dọn dẹp khi unmount
    return () => {
      if (client) {
        client.end(true);
      }
    };
  }, []);

  // Giá trị cung cấp cho Context
  const contextValue: MQTTContextType = {
    client,
    isConnected,
    connectionStatus,
    subscribe,
    unsubscribe,
    publish,
    on,
    messages,
    connect,
    disconnect,
  };

  return (
    <MQTTContext.Provider value={contextValue}>{children}</MQTTContext.Provider>
  );
};

// Custom hook để sử dụng MQTTContext
export const useMQTT = () => {
  const context = useContext(MQTTContext);
  if (context === undefined) {
    throw new Error("useMQTT phải được sử dụng trong MQTTProvider");
  }
  return context;
};
