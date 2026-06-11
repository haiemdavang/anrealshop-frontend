import { API_ENDPOINTS } from "../constant";
import type {
    ChatMessageResponse,
    ChatRoomResponse,
    ChatbotRequest,
    ChatbotResponse,
    ChatbotHistoryResponse,
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

const askChatbot = async (request: ChatbotRequest): Promise<ChatbotResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CHAT.BOT, request);
    return response.data;
};

const askChatbotV2 = async (request: ChatbotRequest): Promise<ChatbotResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CHAT.BOT_V2, request);
    return response.data;
};

const getChatbotHistory = async (
    page: number = 0,
    size: number = 20
): Promise<PageResponse<ChatbotHistoryResponse>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CHAT.BOT_HISTORY, {
        params: { page, size },
    });
    return response.data;
};

const askGemini = async (tableName: string, fieldName: string, context: string): Promise<string> => {
    const payload = { tableName, fieldName, context };
    const response = await axiosInstance.post(API_ENDPOINTS.CHAT.GEMINI, payload);
    return response.data;
};

export const ChatService = {
    getCurrentUserRooms,
    getRoomMessages,
    initRoom,
    askChatbot,
    askChatbotV2,
    getChatbotHistory,
    askGemini,
};
