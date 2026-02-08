import { useCallback, useEffect, useState } from 'react';
import { ChatService } from '../service/ChatService';
import type { ChatMessageResponse, ChatRoomResponse } from '../types/ChatType';
import showErrorNotification from '../components/Toast/NotificationError';
import { getErrorMessage } from '../untils/ErrorUntils';

// ======== Rooms Hook ========
interface UseChatRoomsState {
    rooms: ChatRoomResponse[];
    isLoading: boolean;
    error: string | null;
}

export const useChatRooms = () => {
    const [state, setState] = useState<UseChatRoomsState>({
        rooms: [],
        isLoading: false,
        error: null,
    });

    const fetchRooms = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const rooms = await ChatService.getCurrentUserRooms();
            setState({ rooms, isLoading: false, error: null });
        } catch (err) {
            const message = getErrorMessage(err);
            setState(prev => ({ ...prev, isLoading: false, error: message }));
            showErrorNotification('Lỗi', message);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const updateRoomLastMessage = useCallback((roomId: string, message: ChatMessageResponse) => {
        setState(prev => {
            const updatedRooms = prev.rooms.map(room =>
                room.roomId === roomId
                    ? { ...room, lastMessage: message, lastActive: message.createdAt }
                    : room
            );
            // Sort: room with latest message on top
            updatedRooms.sort((a, b) =>
                new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
            );
            return { ...prev, rooms: updatedRooms };
        });
    }, []);

    const incrementUnread = useCallback((roomId: string) => {
        setState(prev => ({
            ...prev,
            rooms: prev.rooms.map(room =>
                room.roomId === roomId
                    ? { ...room, unreadCount: room.unreadCount + 1 }
                    : room
            ),
        }));
    }, []);

    const clearUnread = useCallback((roomId: string) => {
        setState(prev => ({
            ...prev,
            rooms: prev.rooms.map(room =>
                room.roomId === roomId
                    ? { ...room, unreadCount: 0 }
                    : room
            ),
        }));
    }, []);

    return {
        ...state,
        fetchRooms,
        updateRoomLastMessage,
        incrementUnread,
        clearUnread,
    };
};

// ======== Messages Hook ========
interface UseChatMessagesState {
    messages: ChatMessageResponse[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
}

export const useChatMessages = (roomId: string | null) => {
    const [state, setState] = useState<UseChatMessagesState>({
        messages: [],
        isLoading: false,
        error: null,
        hasMore: true,
        currentPage: 0,
        totalPages: 0,
    });

    const fetchMessages = useCallback(async (page: number = 0) => {
        if (!roomId) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await ChatService.getRoomMessages(roomId, page, 20);
            setState(prev => ({
                ...prev,
                messages: page === 0
                    ? response.content.reverse()
                    : [...response.content.reverse(), ...prev.messages],
                isLoading: false,
                currentPage: response.number,
                totalPages: response.totalPages,
                hasMore: response.number + 1 < response.totalPages,
            }));
        } catch (err) {
            const message = getErrorMessage(err);
            setState(prev => ({ ...prev, isLoading: false, error: message }));
            showErrorNotification('Lỗi', message);
        }
    }, [roomId]);

    // Fetch first page when roomId changes
    useEffect(() => {
        if (roomId) {
            setState({
                messages: [],
                isLoading: false,
                error: null,
                hasMore: true,
                currentPage: 0,
                totalPages: 0,
            });
            fetchMessages(0);
        }
    }, [roomId, fetchMessages]);

    const loadMore = useCallback(() => {
        if (state.hasMore && !state.isLoading) {
            fetchMessages(state.currentPage + 1);
        }
    }, [state.hasMore, state.isLoading, state.currentPage, fetchMessages]);

    const addMessage = useCallback((message: ChatMessageResponse) => {
        setState(prev => ({
            ...prev,
            messages: [...prev.messages, message],
        }));
    }, []);

    return {
        ...state,
        fetchMessages,
        loadMore,
        addMessage,
    };
};
