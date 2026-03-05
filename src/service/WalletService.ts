import { API_ENDPOINTS } from "../constant";
import type { UserVerificationDto, VerifyPasswordResponse, VerifyWalletRequest, WalletDto } from "../types/WalletType";
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

export const WalletService = {
    getMyWallet,
    getMyVerification,
    submitVerification,
    verifyPassword,
};
