// Wallet Types - matching backend DTOs

export type WalletOwnerType = 'NGUOI_DUNG' | 'CUA_HANG';
export type WalletStatus = 'DANG_HOAT_DONG' | 'TAM_KHOA' | 'BI_VO_HIEU_HOA';
export type VerificationStatus = 'CHO_DUYET' | 'DA_XAC_THUC' | 'BI_TU_CHOI';
export type DocumentType = 'CCCD' | 'HO_CHIEU';

export interface WalletDto {
    id: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    availableBalance: number;
    currency: string;
    status: WalletStatus;
    verificationStatus: VerificationStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface VerifyWalletRequest {
    realFullName: string;
    documentNumber: string;
    documentType: DocumentType;
    dateOfBirth: string;
    frontImageUrl: string;
    backImageUrl: string;
    portraitImageUrl: string;
    paymentPassword: string;
}

export interface UserVerificationDto {
    id: string;
    realFullName: string;
    documentNumber: string;
    documentType: DocumentType;
    dateOfBirth: string;
    frontImageUrl: string;
    backImageUrl: string;
    portraitImageUrl: string;
    status: VerificationStatus;
    rejectionReason?: string;
    approvedAt?: string;
    createdAt: string;
}

// KYC Types - matching backend DTOs

export interface ScanIdRequest {
    imageBase64: string;
}

export interface ScanIdResponse {
    fullName: string;
    documentNumber: string;
    documentType: DocumentType;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    placeOfOrigin: string;
    placeOfResidence: string;
    expiryDate: string;
    rawText: string;
}

export interface VerifyFaceRequest {
    idImageBase64: string;
    selfieImageBase64: string;
}

export interface VerifyFaceResponse {
    matched: boolean;
    confidence: number;
    message: string;
    idFaceCount: number;
    selfieFaceCount: number;
}

export interface VerifyPasswordResponse {
    verified: boolean;
    message: string;
}
