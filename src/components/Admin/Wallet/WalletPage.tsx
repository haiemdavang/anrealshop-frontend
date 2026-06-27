import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Group,
    Loader,
    Table,
    Text,
    Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useState } from 'react';
import { FiCheck, FiEye, FiX } from 'react-icons/fi';
import { getRejectReasons } from '../../../data/RejectData';
import { useURLParams } from '../../../hooks/useURLParams';
import { useWallet } from '../../../hooks/useWallet';
import { useWalletStatus } from '../../../hooks/useWalletStatus';
import type { AdminWalletDto, WalletStatus } from '../../../types/WalletType';
import { formatDate, formatPriceMasked } from '../../../untils/Untils';
import PaginationCustom from '../../common/PaginationCustom';
import RejectModal from '../../RejectModal/RejectModal';
import Filter from './Filter';
import VerificationDetailModal from './VerificationDetailModal';

const ITEMS_PER_PAGE = 10;

const WalletPage = () => {
    const { getParam, updateParams } = useURLParams();

    const [activeTab, setActiveTab] = useState(getParam('status') || 'ALL');
    const [searchTerm, setSearchTerm] = useState(getParam('search') || '');
    const [page, setPage] = useState(parseInt(getParam('page')) || 1);
    const [selectedWallet, setSelectedWallet] = useState<AdminWalletDto | null>(null);

    const [rejectModalOpened, { open: openRejectModal, close: closeRejectModal }] = useDisclosure(false);
    const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] = useDisclosure(false);

    const {
        wallets,
        totalPages,
        totalCount,
        currentPage,
        isLoading,
        walletStatusTabs,
        fetchWallets,
        approveWallet,
        rejectWallet,
        verificationDetail,
        isLoadingDetail,
        fetchVerificationDetail,
        clearVerificationDetail,
    } = useWallet({ initialParams: { page: 0, limit: ITEMS_PER_PAGE } });

    const {
        getVerificationStatusLabel,
        getVerificationBadgeColor,
        getWalletStatusLabel,
        getWalletStatusColor,
    } = useWalletStatus();

    const fetchData = useCallback(() => {
        const walletStatus = activeTab !== 'ALL' ? (activeTab as WalletStatus) : undefined;
        const searchUser = searchTerm.trim() || undefined;

        updateParams({
            page: page > 1 ? page : null,
            status: activeTab !== 'ALL' ? activeTab : null,
            search: searchUser || null,
        });

        return fetchWallets({
            page: page - 1,
            limit: ITEMS_PER_PAGE,
            walletStatus,
            searchUser,
            sortBy: 'newest',
        });
    }, [fetchWallets, activeTab, searchTerm, page, updateParams]);

    useEffect(() => {
        fetchData();
    }, [page]);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    useEffect(() => {
        if (page === 1) fetchData();
    }, [activeTab]);

    const handleApplyFilters = () => {
        setPage(1);
        fetchData();
    };

    const handleResetFilters = () => {
        setActiveTab('ALL');
        setSearchTerm('');
        setPage(1);
    };

    const handleTabChange = (tab: string | null) => {
        if (tab) setActiveTab(tab);
    };

    const handleApprove = async (wallet: AdminWalletDto) => {
        const success = await approveWallet(wallet.id);
        if (success) fetchData();
    };

    const handleOpenRejectModal = (wallet: AdminWalletDto) => {
        setSelectedWallet(wallet);
        openRejectModal();
    };

    const handleViewDetail = (wallet: AdminWalletDto) => {
        fetchVerificationDetail(wallet.id);
        openDetailModal();
    };

    const handleCloseDetailModal = () => {
        closeDetailModal();
        clearVerificationDetail();
    };

    const handleReject = async (reason: string) => {
        if (!selectedWallet) return;
        const success = await rejectWallet(selectedWallet.id, reason);
        if (success) fetchData();
        setSelectedWallet(null);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <Box>
                <Filter
                    searchTerm={searchTerm}
                    activeTab={activeTab}
                    walletStatusData={walletStatusTabs}
                    onSearchChange={setSearchTerm}
                    onTabChange={handleTabChange}
                    onResetFilters={handleResetFilters}
                    onApplyFilters={handleApplyFilters}
                />

                {isLoading ? (
                    <Group justify="center" py="xl">
                        <Loader size="md" />
                    </Group>
                ) : wallets.length === 0 ? (
                    <Text ta="center" py="xl" c="dimmed">
                        Không tìm thấy ví nào.
                    </Text>
                ) : (
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Người dùng</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Số điện thoại</Table.Th>
                                <Table.Th>Số dư</Table.Th>
                                <Table.Th>Trạng thái ví</Table.Th>
                                <Table.Th>Xác thực</Table.Th>
                                <Table.Th>Ngày tạo</Table.Th>
                                <Table.Th ta="center">Hành động</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {wallets.map((wallet) => (
                                <Table.Tr key={wallet.id}>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Avatar
                                                src={wallet.userAvatarUrl}
                                                size={36}
                                                radius="xl"
                                            >
                                                {wallet.userFullName?.charAt(0)?.toUpperCase()}
                                            </Avatar>
                                            <Text size="sm" fw={500}>
                                                {wallet.userFullName || '—'}
                                            </Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{wallet.userEmail || '—'}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{wallet.userPhoneNumber || '—'}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" fw={500}>
                                            {formatPriceMasked()}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={getWalletStatusColor(wallet.status)}
                                            variant="light"
                                            size="sm"
                                        >
                                            {getWalletStatusLabel(wallet.status)}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={getVerificationBadgeColor(wallet.verificationStatus)}
                                            variant="light"
                                            size="sm"
                                        >
                                            {getVerificationStatusLabel(wallet.verificationStatus)}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{wallet.createdAt ? formatDate(wallet.createdAt) : '—'}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs" justify="center">
                                            <Tooltip label="Xem chi tiết">
                                                <ActionIcon
                                                    variant="light"
                                                    color="blue"
                                                    size="sm"
                                                    onClick={() => handleViewDetail(wallet)}
                                                >
                                                    <FiEye size={14} />
                                                </ActionIcon>
                                            </Tooltip>
                                            {wallet.verificationStatus === 'CHO_DUYET' && (
                                                <>
                                                    <Tooltip label="Phê duyệt">
                                                        <ActionIcon
                                                            variant="light"
                                                            color="green"
                                                            size="sm"
                                                            onClick={() => handleApprove(wallet)}
                                                        >
                                                            <FiCheck size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Từ chối">
                                                        <ActionIcon
                                                            variant="light"
                                                            color="red"
                                                            size="sm"
                                                            onClick={() => handleOpenRejectModal(wallet)}
                                                        >
                                                            <FiX size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </>
                                            )}
                                            {wallet.verificationStatus !== 'CHO_DUYET' && (
                                                <Text size="xs" c="dimmed">—</Text>
                                            )}
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}

                {wallets.length !== 0 && <PaginationCustom
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                />}

            <RejectModal
                data={getRejectReasons('wallet')}
                opened={rejectModalOpened}
                onClose={closeRejectModal}
                onConfirm={handleReject}
                orderId={selectedWallet?.id || ''}
            />

            <VerificationDetailModal
                opened={detailModalOpened}
                onClose={handleCloseDetailModal}
                verification={verificationDetail}
                isLoading={isLoadingDetail}
            />
        </Box>
    );
};

export default WalletPage;
