import { useCallback, useState } from 'react';
import { showErrorNotification } from '../components/Toast/NotificationError';
import { showSuccessNotification } from '../components/Toast/NotificationSuccess';
import { WalletService } from '../service/WalletService';
import type { AdminWalletDto, AdminWalletParams, UserVerificationDto } from '../types/WalletType';
import { getErrorMessage } from '../untils/ErrorUntils';

interface UseWalletProps {
    initialParams?: AdminWalletParams;
}

export const useWallet = ({ initialParams }: UseWalletProps = {}) => {
    const [wallets, setWallets] = useState<AdminWalletDto[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationDetail, setVerificationDetail] = useState<UserVerificationDto | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const fetchWallets = useCallback(async (params?: AdminWalletParams) => {
        setIsLoading(true);
        try {
            const mergedParams = { ...initialParams, ...params };
            const response = await WalletService.getAdminWallets(mergedParams);
            console.log('Fetched wallets:', response);
            setWallets(response.wallets);
            setTotalPages(response.totalPages);
            setTotalCount(response.totalCount);
            setCurrentPage((mergedParams.page ?? 0) + 1);
        } catch {
            showErrorNotification('Không thể tải danh sách ví');
        } finally {
            setIsLoading(false);
        }
    }, [initialParams]);

    const approveWallet = useCallback(async (id: string): Promise<boolean> => {
        try {
            await WalletService.approveVerification(id);
            showSuccessNotification('Đã phê duyệt xác thực ví thành công');
            return true;
        } catch(error: any) {
            showErrorNotification('Thông báo lỗi!', getErrorMessage(error) || 'Không thể phê duyệt xác thực ví');
            return false;
        }
    }, []);

    const rejectWallet = useCallback(async (id: string, reason: string): Promise<boolean> => {
        try {
            await WalletService.rejectVerification(id, reason);
            showSuccessNotification('Đã từ chối xác thực ví');
            return true;
        } catch(error: any) {
            showErrorNotification('Thông báo lỗi!', getErrorMessage(error) || 'Không thể từ chối xác thực ví');
            return false;
        }
    }, []);

    const walletStatusTabs: { id: string; count: number }[] = [
        { id: 'ALL', count: 0 },
        { id: 'DANG_HOAT_DONG', count: 0 },
        { id: 'TAM_KHOA', count: 0 },
        { id: 'BI_VO_HIEU_HOA', count: 0 },
    ];

    const fetchVerificationDetail = useCallback(async (id: string) => {
        setIsLoadingDetail(true);
        try {
            const detail = await WalletService.getWalletVerificationDetail(id);
            setVerificationDetail(detail);
        } catch (error: any) {
            showErrorNotification('Thông báo lỗi!', getErrorMessage(error) || 'Không thể tải thông tin xác thực');
        } finally {
            setIsLoadingDetail(false);
        }
    }, []);

    const clearVerificationDetail = useCallback(() => {
        setVerificationDetail(null);
    }, []);

    return {
        wallets,
        totalPages,
        totalCount,
        currentPage,
        isLoading,
        walletStatusTabs,
        verificationDetail,
        isLoadingDetail,
        fetchWallets,
        approveWallet,
        rejectWallet,
        fetchVerificationDetail,
        clearVerificationDetail,
    };
};
