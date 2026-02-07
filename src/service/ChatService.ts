import { API_ENDPOINTS } from "../constant";
import type {
    ChatMessageResponse,
    ChatRoomResponse,
    InitRoomRequest,
    InitRoomResponse,
} from "../types/ChatType";
import { axiosInstance } from "./AxiosInstant";

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

const getCurrentUserRooms = async (): Promise<ChatRoomResponse[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CHAT.ROOMS);
    return response.data;
};

const getRoomMessages = async (
    roomId: string,
    page: number = 0,
    size: number = 20
): Promise<PageResponse<ChatMessageResponse>> => {
    const response = await axiosInstance.get(
        API_ENDPOINTS.CHAT.ROOM_MESSAGES(roomId),
        { params: { page, size } }
    );
    return response.data;
};

const initRoom = async (request: InitRoomRequest): Promise<InitRoomResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CHAT.INIT_ROOM, request);
    return response.data;
};

export const ChatService = {
    getCurrentUserRooms,
    getRoomMessages,
    initRoom,
};
