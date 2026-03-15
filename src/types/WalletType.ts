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

// Transaction Types
export type TransactionType = 'NAP_TIEN' | 'RUT_TIEN' | 'THANH_TOAN' | 'NHAN_TIEN' | 'HOAN_TIEN';
export type TransactionStatus = 'THANH_CONG' | 'THAT_BAI' | 'DANG_XU_LY';

export interface TransactionHistoryDto {
    id: string;
    walletId: string;
    transactionType: TransactionType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    status: TransactionStatus;
    referenceCode: string;
    description: string;
    createdAt: string;
}

export interface TransactionHistoryListResponse {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    transactions: TransactionHistoryDto[];
}

export interface TransactionParams {
    page?: number;
    limit?: number;
    transactionType?: TransactionType;
    sortBy?: string;
}

// Admin types
export interface AdminWalletDto {
    id: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    availableBalance: number;
    currency: string;
    status: WalletStatus;
    verificationStatus: VerificationStatus;
    createdAt: string;
    updatedAt?: string;
    userEmail: string;
    userFullName: string;
    userAvatarUrl: string;
    userPhoneNumber: string;
}

export interface AdminWalletListResponse {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    wallets: AdminWalletDto[];
}

export interface AdminWalletParams {
    page?: number;
    limit?: number;
    searchUser?: string;
    walletStatus?: WalletStatus;
    sortBy?: string;
}
