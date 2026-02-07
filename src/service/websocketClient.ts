import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_API_URL } from '../constant';
import showErrorNotification from '../components/Toast/NotificationError';
import NoticeService from './NoticeService';
import type { ChatMessageResponse, ChatTypingPayload } from '../types/ChatType';

const WS_URL = `${BASE_API_URL}/ws_drew`;
const DESTINATION_NOTICE = '/user/queue/notifications';
const DESTINATION_CHAT = '/user/queue/chats';
const DESTINATION_TYPING = '/user/queue/chats/typing';

let stompClient: Client | null = null;

// ========== Chat message listener system ==========
type ChatMessageListener = (message: ChatMessageResponse) => void;
const chatListeners = new Set<ChatMessageListener>();

export function onChatMessage(listener: ChatMessageListener): () => void {
  chatListeners.add(listener);
  return () => { chatListeners.delete(listener); };
}

function notifyChatListeners(message: ChatMessageResponse) {
  chatListeners.forEach(listener => listener(message));
}

// ========== Typing listener system ==========
type TypingListener = (payload: ChatTypingPayload) => void;
const typingListeners = new Set<TypingListener>();

export function onTyping(listener: TypingListener): () => void {
  typingListeners.add(listener);
  return () => { typingListeners.delete(listener); };
}

function notifyTypingListeners(payload: ChatTypingPayload) {
  typingListeners.forEach(listener => listener(payload));
}

function ensureClient(): Client {
  if (stompClient) return stompClient;
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(
        WS_URL,
        undefined,
        { transports: ['websocket', 'xhr-streaming', 'xhr-polling'], withCredentials: true } as any
      ),
    reconnectDelay: 0,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });

  stompClient.onConnect = () => {
    stompClient!.subscribe('/topic/public', (response) => {
      console.log('Received message:', response.body);
    });

    stompClient!.subscribe(DESTINATION_NOTICE, (msg: IMessage) => {
      NoticeService.showPrivateNotice(JSON.parse(msg.body));
    });

    stompClient!.subscribe(DESTINATION_CHAT, (msg: IMessage) => {
      try {
        const chatMsg: ChatMessageResponse = JSON.parse(msg.body);
        notifyChatListeners(chatMsg);
      } catch (e) {
        console.error('Failed to parse chat message:', e);
      }
    });

    stompClient!.subscribe(DESTINATION_TYPING, (msg: IMessage) => {
      try {
        const payload: ChatTypingPayload = JSON.parse(msg.body);
        notifyTypingListeners(payload);
      } catch (e) {
        console.error('Failed to parse typing payload:', e);
      }
    });
  };

  stompClient.onStompError = (frame) => {
    showErrorNotification('Thông báo lỗi hệ thống', frame.headers['message'] || 'An error occurred with the WebSocket connection.');
  };

  stompClient.onWebSocketError = (event) => {
    showErrorNotification('Thông báo lỗi hệ thống', event.headers['message'] || 'An error occurred with the WebSocket connection.');
  };

  return stompClient;
}

export function connectWs(): void {
  if (stompClient?.active) {
    return;
  }

  if (stompClient && !stompClient.active) {
    stompClient = null;
  }

  const client = ensureClient();
  client.activate();
}

export function disconnectWs(): void {
  if (stompClient?.active) {
    stompClient.deactivate();
    stompClient = null;
  }
}


export function sendMessage(destination: string, body: any) {
  if (!stompClient || !stompClient.active) {
    return;
  }

  stompClient.publish({
    destination: '/app_message' + destination,
    body: JSON.stringify(body),
  });
}

export function sendTyping(roomId: string) {
  sendMessage('/chat.typing', { roomId });
}

export function sendRead(roomId: string) {
  sendMessage('/chat.read', { roomId });
}