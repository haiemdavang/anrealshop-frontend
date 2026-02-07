export type MessageType = 'text' | 'media';

export type SenderRole = 'USER' | 'SHOP';

export interface ChatMessageRequest {
    roomId: string;
    content: string;
    type?: MessageType;
}

export interface ChatMessageResponse {
    id: string;
    roomId: string;
    senderRole: SenderRole;
    type: MessageType;
    content: string;
    read: boolean;
    me: boolean;
    createdAt: string;
}

export interface ChatRoomResponse {
    roomId: string;
    partnerId: string;
    partnerName: string;
    partnerAvatar: string;
    myRole: SenderRole;
    lastMessage: ChatMessageResponse;
    unreadCount: number;
    lastActive: string;
}

export interface InitRoomRequest {
    shopId: string;
}

export interface InitRoomResponse {
    roomId: string;
    new: boolean;
    shopId: string;
    shopName: string;
    shopAvatar: string;
}

export interface ChatTypingPayload {
    roomId: string;
}

export interface ChatReadPayload {
    roomId: string;
}
