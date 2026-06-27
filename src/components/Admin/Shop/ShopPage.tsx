import { Box, Group, Pagination } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import showSuccessNotification from '../../Toast/NotificationSuccess';
import { MOCK_SHOPS } from './data';
import Filter from './Filter';
import RejectShopModal from './RejectShopModal';
import ShopList from './ShopList';
import ShopReviewModal from './ShopReviewModal';
import type { AdminShop, ShopDateRange, ShopStatus } from './types';

const ITEMS_PER_PAGE = 10;

const getDateRangeFromParams = (params: URLSearchParams): ShopDateRange => {
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    if (!startDate || !endDate) return [null, null];

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (Number.isNaN(parsedStartDate.getTime()) || Number.isNaN(parsedEndDate.getTime())) {
        return [null, null];
    }

    return [parsedStartDate, parsedEndDate];
};

const ShopApprovalPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [initialParams] = useState(() => new URLSearchParams(location.search));

    const [shops, setShops] = useState<AdminShop[]>([]);
    const [selectedShop, setSelectedShop] = useState<AdminShop | null>(null);
    const [listLoading, setListLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(initialParams.get('status') || 'pending');
    const [searchTerm, setSearchTerm] = useState(initialParams.get('search') || '');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState(initialParams.get('search') || '');
    const [dateRange, setDateRange] = useState<ShopDateRange>(() => getDateRangeFromParams(initialParams));
    const [appliedDateRange, setAppliedDateRange] = useState<ShopDateRange>(() => getDateRangeFromParams(initialParams));
    const [page, setPage] = useState(Number(initialParams.get('page')) || 1);
    const [rejectionReason, setRejectionReason] = useState('');
    const [readOnlyReason, setReadOnlyReason] = useState(false);

    const [reviewModalOpened, { open: openReviewModal, close: closeReviewModal }] = useDisclosure(false);
    const [rejectModalOpened, { open: openRejectModal, close: closeRejectModal }] = useDisclosure(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShops(MOCK_SHOPS);
            setListLoading(false);
        }, 650);

        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', String(page));
        if (activeTab !== 'all') params.set('status', activeTab);
        if (appliedSearchTerm) params.set('search', appliedSearchTerm);
        if (appliedDateRange[0] && appliedDateRange[1]) {
            params.set('startDate', appliedDateRange[0].toISOString().split('T')[0]);
            params.set('endDate', appliedDateRange[1].toISOString().split('T')[0]);
        }

        const query = params.toString();
        navigate(`${location.pathname}${query ? `?${query}` : ''}`, { replace: true });
    }, [
        activeTab,
        appliedDateRange,
        appliedSearchTerm,
        location.pathname,
        navigate,
        page,
    ]);

    const filteredShops = useMemo(() => {
        const normalizedSearch = appliedSearchTerm.trim().toLocaleLowerCase('vi');
        const [startDate, endDate] = appliedDateRange;
        const startTime = startDate
            ? new Date(startDate).setHours(0, 0, 0, 0)
            : null;
        const endTime = endDate
            ? new Date(endDate).setHours(23, 59, 59, 999)
            : null;

        return shops.filter((shop) => {
            if (activeTab !== 'all' && shop.status !== activeTab) return false;

            if (normalizedSearch) {
                const searchableText = [
                    shop.id,
                    shop.name,
                    shop.owner.fullName,
                    shop.owner.email,
                    shop.owner.phoneNumber,
                ].join(' ').toLocaleLowerCase('vi');
                if (!searchableText.includes(normalizedSearch)) return false;
            }

            const createdTime = new Date(shop.createdAt).getTime();
            if (startTime !== null && createdTime < startTime) return false;
            if (endTime !== null && createdTime > endTime) return false;
            return true;
        });
    }, [activeTab, appliedDateRange, appliedSearchTerm, shops]);

    const totalPages = Math.max(1, Math.ceil(filteredShops.length / ITEMS_PER_PAGE));
    const paginatedShops = filteredShops.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const showListSkeleton = () => {
        setListLoading(true);
        window.setTimeout(() => setListLoading(false), 300);
    };

    const handleTabChange = (tab: string | null) => {
        if (!tab) return;
        setActiveTab(tab);
        setPage(1);
        showListSkeleton();
    };

    const handleApplyFilters = () => {
        setAppliedSearchTerm(searchTerm.trim());
        setAppliedDateRange(dateRange);
        setPage(1);
        showListSkeleton();
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setAppliedSearchTerm('');
        setDateRange([null, null]);
        setAppliedDateRange([null, null]);
        setActiveTab('pending');
        setPage(1);
        showListSkeleton();
    };

    const handleViewShop = (shop: AdminShop) => {
        setSelectedShop(shop);
        openReviewModal();
    };

    const handleOpenReject = (shop: AdminShop) => {
        setSelectedShop(shop);
        setRejectionReason('');
        setReadOnlyReason(false);
        closeReviewModal();
        openRejectModal();
    };

    const handleViewRejectionReason = (shop: AdminShop) => {
        setSelectedShop(shop);
        setRejectionReason(shop.reviewNote || 'Không có lý do từ chối.');
        setReadOnlyReason(true);
        openRejectModal();
    };

    const handleCloseRejectModal = () => {
        closeRejectModal();
        setSelectedShop(null);
        setRejectionReason('');
        setReadOnlyReason(false);
    };

    const handleApprove = (shop: AdminShop) => {
        setActionLoading(true);
        window.setTimeout(() => {
            setShops((currentShops) => currentShops.map((item) => (
                item.id === shop.id
                    ? { ...item, status: 'approved' as ShopStatus, reviewNote: 'Cửa hàng đạt chuẩn' }
                    : item
            )));
            setActionLoading(false);
            setSelectedShop(null);
            closeReviewModal();
            showSuccessNotification('Phê duyệt thành công', `Cửa hàng ${shop.name} đã được phê duyệt.`);
        }, 550);
    };

    const handleReject = () => {
        if (!selectedShop || !rejectionReason.trim()) return;
        const shop = selectedShop;

        setActionLoading(true);
        window.setTimeout(() => {
            setShops((currentShops) => currentShops.map((item) => (
                item.id === shop.id
                    ? { ...item, status: 'rejected' as ShopStatus, reviewNote: rejectionReason.trim() }
                    : item
            )));
            setActionLoading(false);
            handleCloseRejectModal();
            showSuccessNotification('Từ chối cửa hàng', `Đã cập nhật trạng thái của ${shop.name}.`);
        }, 550);
    };

    return (
        <Box>
            <Filter
                    date={dateRange}
                    searchTerm={searchTerm}
                    activeTab={activeTab}
                    shops={shops}
                    onDateChange={setDateRange}
                    onSearchChange={setSearchTerm}
                    onTabChange={handleTabChange}
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                />

                <ShopList
                    shops={paginatedShops}
                    loading={listLoading}
                    onViewShop={handleViewShop}
                    onApproveShop={handleApprove}
                    onRejectShop={handleOpenReject}
                    onViewRejectionReason={handleViewRejectionReason}
                />

                {!listLoading && (
                    <Group justify="flex-end" mt="md">
                        <Pagination
                            total={totalPages}
                            value={Math.min(page, totalPages)}
                            onChange={setPage}
                            size="sm"
                        />
                    </Group>
                )}

            <ShopReviewModal
                opened={reviewModalOpened}
                shop={selectedShop}
                loading={actionLoading}
                onClose={() => {
                    closeReviewModal();
                    setSelectedShop(null);
                }}
                onApprove={handleApprove}
                onReject={handleOpenReject}
            />

            <RejectShopModal
                opened={rejectModalOpened}
                shop={selectedShop}
                reason={rejectionReason}
                loading={actionLoading}
                readOnly={readOnlyReason}
                onClose={handleCloseRejectModal}
                onReasonChange={setRejectionReason}
                onConfirm={handleReject}
            />
        </Box>
    );
};

export default ShopApprovalPage;
