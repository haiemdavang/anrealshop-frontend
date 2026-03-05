import { API_ENDPOINTS } from "../constant";
import type { ScanIdResponse, VerifyFaceResponse } from "../types/WalletType";
import { axiosInstance } from "./AxiosInstant";

const scanId = async (imageBase64: string): Promise<ScanIdResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.KYC.SCAN_ID, { imageBase64 });
    return response.data;
};

const verifyFace = async (idImageBase64: string, selfieImageBase64: string): Promise<VerifyFaceResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.KYC.VERIFY_FACE, { idImageBase64, selfieImageBase64 });
    return response.data;
};

export const KycService = {
    scanId,
    verifyFace,
};
