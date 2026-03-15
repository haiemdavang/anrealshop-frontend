import { API_ENDPOINTS } from "../constant";
import type {
    AdminWalletDto,
    AdminWalletListResponse,
    AdminWalletParams,
    TransactionHistoryListResponse,
    TransactionParams,
    UserVerificationDto,
    VerifyPasswordResponse,
    VerifyWalletRequest,
    WalletDto
} from "../types/WalletType";
import { axiosInstance } from "./AxiosInstant";

const getMyWallet = async (): Promise<WalletDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WALLET.ME);
    return response.data;
};

const getMyVerification = async (): Promise<UserVerificationDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WALLET.VERIFICATION);
    return response.data;
};

const submitVerification = async (request: VerifyWalletRequest): Promise<UserVerificationDto> => {
    const response = await axiosInstance.post(API_ENDPOINTS.WALLET.VERIFY, request);
    return response.data;
};

const verifyPassword = async (paymentPassword: string): Promise<VerifyPasswordResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.WALLET.VERIFY_PASSWORD, { paymentPassword });
    return response.data;
};

const getTransactionHistory = async (params: TransactionParams): Promise<TransactionHistoryListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WALLET.TRANSACTIONS, { params });
    return response.data;
};

// Admin APIs
const getAdminWallets = async (params: AdminWalletParams): Promise<AdminWalletListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WALLET.ADMIN_WALLETS, { params });
    return response.data;
};

const approveVerification = async (id: string): Promise<AdminWalletDto> => {
    const response = await axiosInstance.put(API_ENDPOINTS.WALLET.ADMIN_APPROVE(id));
    return response.data;
};

const rejectVerification = async (id: string, reason: string): Promise<AdminWalletDto> => {
    const response = await axiosInstance.put(API_ENDPOINTS.WALLET.ADMIN_REJECT(id), { reason });
    return response.data;
};

const getWalletVerificationDetail = async (id: string): Promise<UserVerificationDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.WALLET.ADMIN_VERIFICATION_DETAIL(id));
    return response.data;
};

export const WalletService = {
    getMyWallet,
    getMyVerification,
    submitVerification,
    verifyPassword,
    getTransactionHistory,
    getAdminWallets,
    approveVerification,
    rejectVerification,
    getWalletVerificationDetail,
};
