import { useEffect, useReducer, useRef, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type SubscriptionCallback = (message: any) => void;

type State = {
    client: Client | null;
    subscriptions: Map<string, any>;
}

type Action =
    | { type: 'SET_CLIENT'; payload: Client }
    | { type: 'ADD_SUBSCRIPTION'; payload: { destination: string; subscription: any } }
    | { type: 'REMOVE_SUBSCRIPTION'; payload: string }
    | { type: 'CLEAR_CLIENT' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_CLIENT':
            return { ...state, client: action.payload };
        case 'ADD_SUBSCRIPTION':
            return { ...state, subscriptions: new Map(state.subscriptions).set(action.payload.destination, action.payload.subscription) };
        case 'REMOVE_SUBSCRIPTION':
            const updatedSubscriptions = new Map(state.subscriptions);
            updatedSubscriptions.delete(action.payload);
            return { ...state, subscriptions: updatedSubscriptions };
        case 'CLEAR_CLIENT':
            return { client: null, subscriptions: new Map() };
        default:
            return state;
    }
}

export const useWebSocketService = (
    webSocketUrl: string,
    onConnectCallback: () => void,
    onErrorCallback: (error: string) => void,
) => {
    const [state, dispatch] = useReducer(reducer, {
        client: null,
        subscriptions: new Map(),
    });

    const clientRef = useRef<Client | null>(null);

    const onConnectRef = useRef(onConnectCallback);
    const onErrorRef = useRef(onErrorCallback);

    // Luôn cập nhật ref khi callback thay đổi
    useEffect(() => {
        onConnectRef.current = onConnectCallback;
        onErrorRef.current = onErrorCallback;
    }, [onConnectCallback, onErrorCallback]);


    const connect = useCallback((token: string) => {
        // Nếu đã có client trong Ref, tuyệt đối không tạo mới.
        if (clientRef.current) {
            console.log("WebSocket already initialized. Skipping...");
            return;
        }

        if (!token) {
            console.error("No token provided for WebSocket connection");
            return;
        }

        console.log("Initializing WebSocket Client...");

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
                console.log('WebSocket connected');
                if (onConnectRef.current) onConnectRef.current();
            },
            onStompError: error => {
                console.error("Stomp Error Header:", error.headers);
                if (onErrorRef.current) onErrorRef.current(error.headers['message'] || 'Unknown error');
            },
            onWebSocketClose: (evt) => {
                console.log("Socket Closed with code:", evt.code, "reason:", evt.reason);
            }
        });


        clientRef.current = client;

        client.activate();
        dispatch({ type: 'SET_CLIENT', payload: client });

    }, [webSocketUrl]);

    const subscribe = useCallback(
        (destination: string, callback: SubscriptionCallback) => {
            const client = clientRef.current;

            if (!client || !client.connected) {
                console.warn("Client not connected yet, cannot subscribe to", destination);
                return;
            }

            if (state.subscriptions.has(destination)) {
                return;
            }

            console.log("Subscribing to:", destination);
            const subscription = client.subscribe(destination, (message: IMessage) => {
                if (message.body) {
                    callback(JSON.parse(message.body));
                }
            });

            dispatch({ type: 'ADD_SUBSCRIPTION', payload: { destination, subscription } });
        },
        [state.subscriptions]
    );

    const send = useCallback((destination: string, body: Record<string, any> = {}) => {
        const client = clientRef.current;
        if (!client || !client.connected) {
            return;
        }
        client.publish({ destination, body: JSON.stringify(body) });
    }, []);

    const unsubscribe = useCallback((destination: string) => {
        const subscription = state.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            dispatch({ type: 'REMOVE_SUBSCRIPTION', payload: destination });
        }
    }, [state.subscriptions]);

    const disconnect = useCallback(() => {
        const client = clientRef.current;
        if (client) {
            console.log("Disconnecting WebSocket...");
            // Unsubscribe tất cả
            state.subscriptions.forEach(sub => sub.unsubscribe());

            client.deactivate();

            clientRef.current = null;
            dispatch({ type: 'CLEAR_CLIENT' });
        }
    }, [state.subscriptions]);

    return { connect, subscribe, send, unsubscribe, disconnect, isConnected: !!state.client };
}