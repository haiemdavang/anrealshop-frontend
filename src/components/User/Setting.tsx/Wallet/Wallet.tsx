import {
    Badge,
    Box,
    Button,
    Divider,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiDollarSign,
    FiLock,
    FiShield,
    FiXCircle,
} from 'react-icons/fi';
import { WalletService } from '../../../../service/WalletService';
import type { VerificationStatus, WalletDto, WalletStatus } from '../../../../types/WalletType';
import { formatPrice } from '../../../../untils/Untils';
import ModalVerifyKYC from './ModalVerifyKYC';
import ModalVerifyPass from './ModalVerifyPass';

const Wallet = () => {
    const [wallet, setWallet] = useState<WalletDto | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasWallet, setHasWallet] = useState(true);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [kycModalOpened, setKycModalOpened] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const walletData = await WalletService.getMyWallet();
            setWallet(walletData);
            setHasWallet(true);
        } catch {
            setHasWallet(false);
            setIsUnlocked(true); // no wallet = skip password gate
        }

        try {
            const verificationData = await WalletService.getMyVerification();
            setVerificationStatus(verificationData.status);
        } catch {
            // no verification yet
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center h-[60vh]">
                <Loader size="lg" />
            </Box>
        );
    }

    // Password gate — show PIN modal if wallet exists but not yet unlocked
    if (hasWallet && !isUnlocked) {
        return (
            <ModalVerifyPass
                opened={true}
                onClose={() => window.history.back()}
                onVerified={() => setIsUnlocked(true)}
            />
        );
    }

    return (
        <div className="overflow-hidden">
            <Group justify="space-between" mb="lg">
                <Title order={4} className="text-slate-800">
                    Ví của tôi
                </Title>
            </Group>

            {/* Wallet Balance Card */}
            <Paper
                withBorder
                radius="md"
                p="xl"
                className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mb-6"
            >
                <Group justify="space-between" align="flex-start">
                    <div>
                        <Group gap="xs" mb="xs">
                            <FiCreditCard size={20} className="text-slate-300" />
                            <Text size="sm" className="text-slate-300">
                                Số dư khả dụng
                            </Text>
                        </Group>
                        <Text size="xl" fw={700} className="text-white" style={{ fontSize: '2rem' }}>
                            {hasWallet && wallet ? formatPrice(wallet.availableBalance) : formatPrice(0)}
                        </Text>
                        {wallet && (
                            <Text size="xs" className="text-slate-400" mt="xs">
                                Đơn vị: {wallet.currency}
                            </Text>
                        )}
                    </div>
                    <div className="text-right">
                        {hasWallet && wallet ? (
                            <WalletStatusBadge status={wallet.status} />
                        ) : (
                            <Badge color="gray" variant="light" size="lg">
                                Chưa kích hoạt
                            </Badge>
                        )}
                    </div>
                </Group>
            </Paper>

            {/* Quick Actions */}
            {hasWallet && wallet?.status === 'DANG_HOAT_DONG' && (
                <Group gap="sm" mb="lg">
                    <Button
                        variant="light"
                        leftSection={<FiDollarSign size={16} />}
                        size="sm"
                    >
                        Nạp tiền
                    </Button>
                    <Button
                        variant="light"
                        color="teal"
                        leftSection={<FiDollarSign size={16} />}
                        size="sm"
                    >
                        Rút tiền
                    </Button>
                    <Button
                        variant="light"
                        color="violet"
                        leftSection={<FiClock size={16} />}
                        size="sm"
                    >
                        Lịch sử giao dịch
                    </Button>
                </Group>
            )}

            <Divider mb="lg" />

            {/* Verification Section */}
            <Title order={5} mb="md" className="text-slate-700">
                <Group gap="xs">
                    <FiShield size={18} />
                    Xác thực danh tính (KYC)
                </Group>
            </Title>

            {verificationStatus === 'DA_XAC_THUC' ? (
                <Paper withBorder p="lg" radius="md" className="text-center">
                    <ThemeIcon size={48} radius="xl" color="green" variant="light" className="mx-auto mb-3">
                        <FiCheckCircle size={24} />
                    </ThemeIcon>
                    <Text fw={500} mb="xs">Đã xác thực danh tính</Text>
                    <Text size="sm" c="dimmed">Tài khoản của bạn đã được xác thực thành công.</Text>
                </Paper>
            ) : verificationStatus === 'CHO_DUYET' ? (
                <Paper withBorder p="lg" radius="md" className="text-center">
                    <ThemeIcon size={48} radius="xl" color="yellow" variant="light" className="mx-auto mb-3">
                        <FiClock size={24} />
                    </ThemeIcon>
                    <Text fw={500} mb="xs">Đang chờ duyệt</Text>
                    <Text size="sm" c="dimmed">Yêu cầu xác thực của bạn đang được xử lý. Vui lòng chờ.</Text>
                </Paper>
            ) : verificationStatus === 'BI_TU_CHOI' ? (
                <Paper withBorder p="lg" radius="md" className="text-center">
                    <ThemeIcon size={48} radius="xl" color="red" variant="light" className="mx-auto mb-3">
                        <FiXCircle size={24} />
                    </ThemeIcon>
                    <Text fw={500} mb="xs">Xác thực bị từ chối</Text>
                    <Text size="sm" c="dimmed" mb="md">
                        Yêu cầu xác thực của bạn đã bị từ chối. Vui lòng gửi lại.
                    </Text>
                    <Button
                        leftSection={<FiShield size={16} />}
                        variant="filled"
                        color="red"
                        onClick={() => setKycModalOpened(true)}
                    >
                        Gửi lại xác thực
                    </Button>
                </Paper>
            ) : (
                <Paper withBorder p="lg" radius="md" className="text-center">
                    <ThemeIcon size={48} radius="xl" color="orange" variant="light" className="mx-auto mb-3">
                        <FiAlertCircle size={24} />
                    </ThemeIcon>
                    <Text fw={500} mb="xs">
                        Chưa xác thực danh tính
                    </Text>
                    <Text size="sm" c="dimmed" mb="md">
                        Xác thực danh tính để sử dụng đầy đủ tính năng ví, bao gồm nạp tiền, rút tiền và thanh toán.
                    </Text>
                    <Button
                        leftSection={<FiShield size={16} />}
                        variant="filled"
                        onClick={() => setKycModalOpened(true)}
                    >
                        Xác thực ngay
                    </Button>
                </Paper>
            )}

            {/* Wallet Info */}
            {hasWallet && wallet && (
                <>
                    <Divider my="lg" />
                    <Title order={5} mb="md" className="text-slate-700">
                        Thông tin ví
                    </Title>
                    <Paper withBorder p="md" radius="md">
                        <Stack gap="sm">
                            <InfoRow label="Mã ví" value={wallet.id} />
                            <InfoRow label="Loại ví" value={getOwnerTypeLabel(wallet.ownerType)} />
                            <InfoRow label="Trạng thái" value={getWalletStatusLabel(wallet.status)} />
                            <InfoRow label="Ngày tạo" value={wallet.createdAt} />
                            {wallet.updatedAt && (
                                <InfoRow label="Cập nhật" value={wallet.updatedAt} />
                            )}
                        </Stack>
                    </Paper>
                </>
            )}
            <ModalVerifyKYC
                opened={kycModalOpened}
                onClose={() => setKycModalOpened(false)}
                onSuccess={() => {
                    setKycModalOpened(false);
                    fetchData();
                }}
            />
        </div>
    );
};

// --------------- Sub-components ---------------

const WalletStatusBadge = ({ status }: { status: WalletStatus }) => {
    const config = {
        DANG_HOAT_DONG: { color: 'green', label: 'Đang hoạt động', icon: <FiCheckCircle size={14} /> },
        TAM_KHOA: { color: 'yellow', label: 'Tạm khóa', icon: <FiLock size={14} /> },
        BI_VO_HIEU_HOA: { color: 'red', label: 'Vô hiệu hóa', icon: <FiXCircle size={14} /> },
    }[status] || { color: 'gray', label: status, icon: null };

    return (
        <Badge
            color={config.color}
            variant="light"
            size="lg"
            leftSection={config.icon}
        >
            {config.label}
        </Badge>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <Group justify="space-between">
        <Text size="sm" c="dimmed">{label}</Text>
        <Text size="sm" fw={500}>{value}</Text>
    </Group>
);

// --------------- Helpers ---------------

const getOwnerTypeLabel = (type: string) => {
    switch (type) {
        case 'NGUOI_DUNG': return 'Người dùng';
        case 'CUA_HANG': return 'Cửa hàng';
        default: return type;
    }
};

const getWalletStatusLabel = (status: string) => {
    switch (status) {
        case 'DANG_HOAT_DONG': return 'Đang hoạt động';
        case 'TAM_KHOA': return 'Tạm khóa';
        case 'BI_VO_HIEU_HOA': return 'Vô hiệu hóa';
        default: return status;
    }
};

export default Wallet;
