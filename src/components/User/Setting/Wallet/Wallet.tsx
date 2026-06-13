import {
	Alert,
	Badge,
	Button,
	Group,
	Loader,
	Paper,
	Stack,
	Text,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiCreditCard } from 'react-icons/fi';
import { WalletService } from '../../../../service/WalletService';
import type { UserVerificationDto, WalletDto } from '../../../../types/WalletType';
import { formatDate, formatPrice } from '../../../../untils/Untils';
import showSuccessNotification from '../../../Toast/NotificationSuccess';
import Transaction from './History/Transaction';
import ModalVerifyKYC from './ModalVerifyKYC';
import ModalVerifyPass from './ModalVerifyPass';

const Wallet = () => {
	const [wallet, setWallet] = useState<WalletDto | null>(null);
	const [verification, setVerification] = useState<UserVerificationDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasWallet, setHasWallet] = useState(false);
	const [isUnlocked, setIsUnlocked] = useState(false);
	const [verifyPassOpened, setVerifyPassOpened] = useState(false);
	const [verifyKycOpened, setVerifyKycOpened] = useState(false);

	const loadWalletData = useCallback(async () => {
		setIsLoading(true);

		let fetchedWallet: WalletDto | null = null;
		let walletExists = false;

		try {
			const walletData = await WalletService.getMyWallet();
			fetchedWallet = walletData;
			walletExists = true;
		} catch (error: any) {
		}

		let fetchedVerification: UserVerificationDto | null = null;
		try {
			fetchedVerification = await WalletService.getMyVerification();
		} catch (error: any) {
		}

		setWallet(fetchedWallet);
		setVerification(fetchedVerification);
		setHasWallet(walletExists);
		setIsUnlocked(!walletExists);
		setVerifyPassOpened(walletExists);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		loadWalletData();
	}, [loadWalletData]);

	const getVerificationBadge = () => {
		if (wallet?.verificationStatus === 'DA_XAC_THUC') {
			return <Badge color="green">Đã xác thực</Badge>;
		}
		if (wallet?.verificationStatus === 'CHO_DUYET') {
			return <Badge color="orange">Chờ duyệt</Badge>;
		}
		if (wallet?.verificationStatus === 'BI_TU_CHOI') {
			return <Badge color="red">Bị từ chối</Badge>;
		}
		return <Badge color="gray">Chưa xác thực</Badge>;
	};

	const handleKycSuccess = async () => {
		setVerifyKycOpened(false);
		showSuccessNotification('Thành công', 'Đã gửi yêu cầu xác thực ví.');
		await loadWalletData();
	};

	const handleDevelopingFeature = () => {
		showSuccessNotification('Thông báo hệ thống', 'Chức năng đang được phát triển');
	};

	if (isLoading) {
		return (
			<Group justify="center" py="xl">
				<Loader />
			</Group>
		);
	}

	return (
		<>
			<Stack gap="md" mih={"465px"}>
				<Paper withBorder radius="lg" p="lg" shadow="sm">
					<Stack gap="md">
						<Group justify="space-between" align="flex-start">
							<div>
								<Text fw={700} size="lg">Ví của tôi</Text>
								<Text size="sm" c="dimmed">Quản lý số dư và trạng thái xác thực ví</Text>
							</div>
							{getVerificationBadge()}
						</Group>

						{hasWallet && wallet ? (
							<Stack gap={6}>
								<Text size="sm" c="dimmed">Số dư khả dụng</Text>
								<Group justify="space-between" align="center" wrap="nowrap">
									<Text fw={700} size="xl">
										{isUnlocked ? formatPrice(wallet.availableBalance) : '***.** ₫'}
									</Text>
									<Button
										onClick={handleDevelopingFeature}
										disabled={!hasWallet || !isUnlocked || wallet.verificationStatus !== 'DA_XAC_THUC'}
									>
										Chuyển / Rút tiền
									</Button>
								</Group>
								<Text size="xs" c="dimmed">
									Tạo lúc: {formatDate(wallet.createdAt)}
								</Text>
							</Stack>
						) : (
							<Stack gap="xs">
								<Alert icon={<FiCreditCard size={16} />} color="blue" variant="light">
									Bạn chưa có ví thanh toán. Vui lòng xác thực danh tính để khởi tạo ví.
								</Alert>
								<Group>
									<Button onClick={() => setVerifyKycOpened(true)}>Xác thực ngay</Button>
								</Group>
							</Stack>
						)}
					</Stack>
				</Paper>

				{verification?.status === 'CHO_DUYET' && (
					<Alert icon={<FiClock size={16} />} color="orange" variant="light">
						Hồ sơ xác thực của bạn đang chờ phê duyệt.
					</Alert>
				)}

				{verification?.status === 'DA_XAC_THUC' && (
					<Alert icon={<FiCheckCircle size={16} />} color="green" variant="light">
						Ví đã xác thực thành công. Bạn có thể sử dụng đầy đủ tính năng thanh toán.
					</Alert>
				)}

				{verification?.status === 'BI_TU_CHOI' && (
					<Stack gap="sm">
						<Alert icon={<FiAlertCircle size={16} />} color="red" variant="light">
							Yêu cầu xác thực bị từ chối.
							{verification.rejectionReason ? ` Lý do: ${verification.rejectionReason}` : ''}
						</Alert>
						<Group>
							<Button variant="outline" onClick={() => setVerifyKycOpened(true)}>
								Gửi lại xác thực
							</Button>
						</Group>
					</Stack>
				)}

				<Transaction hasWallet={hasWallet} />
			</Stack>

			<ModalVerifyPass
				opened={hasWallet && verifyPassOpened && !isUnlocked}
				onClose={() => window.history.back()}
				onVerified={() => {
					setIsUnlocked(true);
					setVerifyPassOpened(false);
				}}
			/>

			<ModalVerifyKYC
				opened={verifyKycOpened}
				onClose={() => setVerifyKycOpened(false)}
				onSuccess={handleKycSuccess}
			/>
		</>
	);
};

export default Wallet;
