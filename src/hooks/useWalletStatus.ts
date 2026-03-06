import { useMemo } from 'react';
import type { IconType } from 'react-icons';
import { FiCheckCircle, FiClock, FiList, FiXCircle } from 'react-icons/fi';
import type { VerificationStatus, WalletStatus } from '../types/WalletType';

export const useWalletStatus = () => {
    return useMemo(() => {
        const getVerificationStatusIcon = (status: string): IconType => {
            switch (status) {
                case 'ALL': return FiList;
                case 'CHO_DUYET': return FiClock;
                case 'DA_XAC_THUC': return FiCheckCircle;
                case 'BI_TU_CHOI': return FiXCircle;
                default: return FiList;
            }
        };

        const getVerificationStatusColor = (status: string): string => {
            switch (status) {
                case 'ALL': return 'gray';
                case 'CHO_DUYET': return 'orange';
                case 'DA_XAC_THUC': return 'green';
                case 'BI_TU_CHOI': return 'red';
                default: return 'gray';
            }
        };

        const getVerificationStatusLabel = (status: string): string => {
            switch (status) {
                case 'ALL': return 'Tất cả';
                case 'CHO_DUYET': return 'Chờ duyệt';
                case 'DA_XAC_THUC': return 'Đã xác thực';
                case 'BI_TU_CHOI': return 'Bị từ chối';
                default: return status;
            }
        };

        const getWalletStatusLabel = (status: WalletStatus): string => {
            switch (status) {
                case 'DANG_HOAT_DONG': return 'Đang hoạt động';
                case 'TAM_KHOA': return 'Tạm khóa';
                case 'BI_VO_HIEU_HOA': return 'Bị vô hiệu hóa';
                default: return status;
            }
        };

        const getWalletStatusColor = (status: WalletStatus): string => {
            switch (status) {
                case 'DANG_HOAT_DONG': return 'green';
                case 'TAM_KHOA': return 'orange';
                case 'BI_VO_HIEU_HOA': return 'red';
                default: return 'gray';
            }
        };

        const getVerificationBadgeColor = (status: VerificationStatus): string => {
            switch (status) {
                case 'CHO_DUYET': return 'orange';
                case 'DA_XAC_THUC': return 'green';
                case 'BI_TU_CHOI': return 'red';
                default: return 'gray';
            }
        };

        return {
            getVerificationStatusIcon,
            getVerificationStatusColor,
            getVerificationStatusLabel,
            getWalletStatusLabel,
            getWalletStatusColor,
            getVerificationBadgeColor,
        };
    }, []);
};
