import { useEffect, useReducer, useRef, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type SubscriptionCallback = (message: any) => void;

type State = {
    client: Client | null;
    subscriptions: Map<string, any>;
    isConnected: boolean;
}

type Action =
    | { type: 'SET_CLIENT'; payload: Client }
    | { type: 'SET_CONNECTED'; payload: boolean }
    | { type: 'ADD_SUBSCRIPTION'; payload: { destination: string; subscription: any } }
    | { type: 'REMOVE_SUBSCRIPTION'; payload: string }
    | { type: 'CLEAR_ALL' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_CLIENT':
            return { ...state, client: action.payload };
        case 'SET_CONNECTED':
            return { ...state, isConnected: action.payload };
        case 'ADD_SUBSCRIPTION':
            { const newSubs = new Map(state.subscriptions);
            newSubs.set(action.payload.destination, action.payload.subscription);
            return { ...state, subscriptions: newSubs }; }
        case 'REMOVE_SUBSCRIPTION':
            { const updatedSubscriptions = new Map(state.subscriptions);
            updatedSubscriptions.delete(action.payload);
            return { ...state, subscriptions: updatedSubscriptions }; }
        case 'CLEAR_ALL':
            return { client: null, subscriptions: new Map(), isConnected: false };
        default:
            return state;
    }
}

// Thời gian tối đa chờ CONNECT thành công trước khi tự huỷ và cho phép retry.
// Đây là lớp bảo vệ cuối cùng: nếu vì bất kỳ lý do gì (BE không phản hồi,
// mạng treo, BE âm thầm drop CONNECT frame...) mà không có callback nào
// của stomp.js được gọi, guard này đảm bảo isConnectingRef không bị kẹt mãi mãi.
const CONNECT_TIMEOUT_MS = 10000;

export const useWebSocketService = (
    webSocketUrl: string,
    onConnectCallback: () => void,
    onErrorCallback: (error: string) => void,
) => {
    const [state, dispatch] = useReducer(reducer, {
        client: null,
        subscriptions: new Map(),
        isConnected: false,
    });

    const clientRef = useRef<Client | null>(null);
    const onConnectRef = useRef(onConnectCallback);
    const onErrorRef = useRef(onErrorCallback);
    const isConnectingRef = useRef(false);
    const currentTokenRef = useRef<string | null>(null);
    const isMountedRef = useRef(true);
    const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Timeout riêng cho việc "chờ kết nối thành công", khác với connectTimeoutRef
    // (dùng để debounce trước khi bắt đầu connect).
    const connectionGuardRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Luôn cập nhật ref khi callback thay đổi
    useEffect(() => {
        onConnectRef.current = onConnectCallback;
        onErrorRef.current = onErrorCallback;
    }, [onConnectCallback, onErrorCallback]);

    // Helper: dọn timeout guard và reset trạng thái "đang connect"
    const clearConnectionGuard = useCallback(() => {
        if (connectionGuardRef.current) {
            clearTimeout(connectionGuardRef.current);
            connectionGuardRef.current = null;
        }
    }, []);

    const resetConnectingState = useCallback((reason: string) => {
        clearConnectionGuard();
        isConnectingRef.current = false;
        console.log(`🔓 isConnecting reset (${reason})`);
    }, [clearConnectionGuard]);

    const connect = useCallback((token: string) => {
        // Clear pending debounce timeout
        if (connectTimeoutRef.current) {
            clearTimeout(connectTimeoutRef.current);
            connectTimeoutRef.current = null;
        }

        // Kiểm tra component còn mounted không
        if (!isMountedRef.current) {
            console.log("⚠️ Component unmounted, skipping connection");
            return;
        }

        // Nếu đã connected với cùng token
        if (clientRef.current?.connected && currentTokenRef.current === token) {
            console.log("✅ WebSocket already connected with same token. Skipping...");
            return;
        }

        // Nếu đang connecting
        if (isConnectingRef.current) {
            console.log("⏳ Connection already in progress. Skipping...");
            return;
        }

        if (!token) {
            console.error("❌ No token provided for WebSocket connection");
            return;
        }

        // Disconnect client cũ nếu token khác
        if (clientRef.current && currentTokenRef.current !== token) {
            console.log("🔄 Token changed, disconnecting old client...");
            try {
                clientRef.current.deactivate();
            } catch (e) {
                console.warn("Error deactivating old client:", e);
            }
            clientRef.current = null;
            dispatch({ type: 'CLEAR_ALL' });
        }

        // Debounce connection để tránh React Strict Mode double mount
        console.log("⏱️ Scheduling WebSocket connection in 300ms...");
        connectTimeoutRef.current = setTimeout(() => {
            if (!isMountedRef.current) {
                console.log("⚠️ Component unmounted during debounce, aborting");
                return;
            }

            isConnectingRef.current = true;
            currentTokenRef.current = token;

            console.log("🔄 Initializing WebSocket Client...");

            // --- Connection guard timeout ---
            // Nếu sau CONNECT_TIMEOUT_MS mà không có callback nào của stomp.js
            // được gọi (onConnect / onStompError / onWebSocketError / onWebSocketClose),
            // nghĩa là server đã "nuốt" CONNECT frame (vd: reject nhưng không đóng
            // socket / không gửi ERROR). Ta chủ động huỷ và mở khoá để lần connect()
            // tiếp theo (thường mang token mới sau khi refresh) không bị chặn.
            clearConnectionGuard();
            connectionGuardRef.current = setTimeout(() => {
                if (!isConnectingRef.current) return; // đã tự resolve theo hướng khác rồi

                console.warn(`⏰ Connect timeout after ${CONNECT_TIMEOUT_MS}ms - forcing reset`);

                try {
                    clientRef.current?.deactivate();
                } catch (e) {
                    console.warn("Error deactivating timed-out client:", e);
                }
                clientRef.current = null;
                currentTokenRef.current = null;

                if (isMountedRef.current) {
                    dispatch({ type: 'CLEAR_ALL' });
                }

                resetConnectingState('connect-timeout');

                if (onErrorRef.current) {
                    onErrorRef.current('Connection timeout - server did not respond');
                }
            }, CONNECT_TIMEOUT_MS);

            const client = new Client({
                webSocketFactory: () => new SockJS(webSocketUrl),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                debug: (str) => {
                    if (!import.meta.env.DEV) return;

                    // Ẩn Authorization
                    if (str.includes('Authorization')) {
                        console.log(
                            str.replace(/Authorization:.*(\r?\n)?/g, 'Authorization: [HIDDEN]\n')
                        );
                    } else {
                        console.log(str);
                    }
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,

                onConnect: () => {
                    resetConnectingState('connected');

                    if (!isMountedRef.current) {
                        console.log("⚠️ Connected but component unmounted, disconnecting...");
                        client.deactivate();
                        return;
                    }

                    console.log('✅ WebSocket connected');
                    dispatch({ type: 'SET_CONNECTED', payload: true });

                    if (onConnectRef.current) {
                        onConnectRef.current();
                    }
                },

                onDisconnect: () => {
                    console.log('🔌 WebSocket disconnected');
                    resetConnectingState('disconnected');

                    if (isMountedRef.current) {
                        dispatch({ type: 'SET_CONNECTED', payload: false });
                    }
                },

                onStompError: error => {
                    console.error("❌ Stomp Error Header:", error.headers);
                    resetConnectingState('stomp-error');

                    if (onErrorRef.current) {
                        onErrorRef.current(error.headers['message'] || 'Unknown error');
                    }
                },

                onWebSocketError: (error) => {
                    console.error("❌ WebSocket Error:", error);
                    resetConnectingState('websocket-error');
                },

                onWebSocketClose: (evt) => {
                    console.log("🔌 Socket Closed with code:", evt.code, "reason:", evt.reason);
                    resetConnectingState('websocket-close');
                }
            });

            clientRef.current = client;
            client.activate();
            dispatch({ type: 'SET_CLIENT', payload: client });

        }, 300); // Debounce 300ms

    }, [webSocketUrl, clearConnectionGuard, resetConnectingState]);

    const subscribe = useCallback(
        (destination: string, callback: SubscriptionCallback) => {
            const client = clientRef.current;

            if (!client || !client.connected) {
                console.warn("⚠️ Client not connected yet, cannot subscribe to", destination);
                return;
            }

            if (state.subscriptions.has(destination)) {
                console.log("ℹ️ Already subscribed to", destination);
                return;
            }

            console.log("📡 Subscribing to:", destination);
            const subscription = client.subscribe(destination, (message: IMessage) => {
                if (!isMountedRef.current) return;

                if (message.body) {
                    try {
                        callback(JSON.parse(message.body));
                    } catch (error) {
                        console.error("❌ Error parsing message:", error);
                    }
                }
            });

            dispatch({ type: 'ADD_SUBSCRIPTION', payload: { destination, subscription } });
        },
        [state.subscriptions]
    );

    const send = useCallback((destination: string, body: Record<string, any> = {}) => {
        const client = clientRef.current;

        if (!client || !client.connected) {
            console.warn("⚠️ Cannot send: Client not connected");
            return;
        }

        try {
            client.publish({ destination, body: JSON.stringify(body) });
            console.log("📤 Sent to", destination);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    }, []);

    const unsubscribe = useCallback((destination: string) => {
        const subscription = state.subscriptions.get(destination);
        if (subscription) {
            console.log("🔕 Unsubscribing from:", destination);
            subscription.unsubscribe();
            dispatch({ type: 'REMOVE_SUBSCRIPTION', payload: destination });
        }
    }, [state.subscriptions]);

    const disconnect = useCallback(() => {
        const client = clientRef.current;

        // Luôn dọn guard timeout khi disconnect chủ động, tránh nó bắn ra
        // sau khi client đã bị null hoá.
        clearConnectionGuard();

        if (client) {
            console.log("🔌 Disconnecting WebSocket...");

            // Unsubscribe tất cả
            state.subscriptions.forEach(sub => {
                try {
                    sub.unsubscribe();
                } catch (e) {
                    console.warn("Error unsubscribing:", e);
                }
            });

            try {
                client.deactivate();
            } catch (e) {
                console.warn("Error deactivating client:", e);
            }

            clientRef.current = null;
            currentTokenRef.current = null;
            isConnectingRef.current = false;
            dispatch({ type: 'CLEAR_ALL' });
        }
    }, [state.subscriptions, clearConnectionGuard]);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            console.log("🧹 Component unmounting, cleaning up WebSocket...");
            isMountedRef.current = false;

            // Clear debounce timeout
            if (connectTimeoutRef.current) {
                clearTimeout(connectTimeoutRef.current);
                connectTimeoutRef.current = null;
            }

            // Clear connection guard timeout
            if (connectionGuardRef.current) {
                clearTimeout(connectionGuardRef.current);
                connectionGuardRef.current = null;
            }

            // Cleanup WebSocket
            if (clientRef.current) {
                try {
                    // Unsubscribe all
                    state.subscriptions.forEach(sub => {
                        try {
                            sub.unsubscribe();
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (e) {
                            // Ignore errors during cleanup
                        }
                    });

                    clientRef.current.deactivate();
                } catch (e) {
                    console.warn("Error during cleanup:", e);
                }

                clientRef.current = null;
                currentTokenRef.current = null;
                isConnectingRef.current = false;
            }
        };
    }, []); // Empty dependency array - chỉ chạy mount/unmount

    return {
        connect,
        subscribe,
        send,
        unsubscribe,
        disconnect,
        isConnected: state.isConnected
    };
}