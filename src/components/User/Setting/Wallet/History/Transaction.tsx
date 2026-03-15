import {
	Alert,
	Badge,
	Group,
	Loader,
	Paper,
	Table,
	Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { FiClock, FiCreditCard } from 'react-icons/fi';
import { WalletService } from '../../../../../service/WalletService';
import type { TransactionHistoryDto, TransactionStatus, TransactionType } from '../../../../../types/WalletType';
import { formatDate, formatPrice } from '../../../../../untils/Untils';
import { getErrorMessage } from '../../../../../untils/ErrorUntils';
import showErrorNotification from '../../../../Toast/NotificationError';

interface TransactionProps {
	hasWallet: boolean;
}

const Transaction = ({ hasWallet }: TransactionProps) => {
	const [transactions, setTransactions] = useState<TransactionHistoryDto[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchTransactions = async () => {
			if (!hasWallet) {
				setTransactions([]);
				return;
			}

			setIsLoading(true);
			try {
				const response = await WalletService.getTransactionHistory({
					page: 0,
					limit: 5,
					sortBy: 'newest',
				});
				setTransactions(response.transactions || []);
			} catch (error: any) {
				showErrorNotification('Lỗi', getErrorMessage(error) || 'Không thể tải lịch sử giao dịch.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchTransactions();
	}, [hasWallet]);

	const getTypeLabel = (type: TransactionType) => {
		switch (type) {
			case 'NAP_TIEN':
				return 'Nạp tiền';
			case 'RUT_TIEN':
				return 'Rút tiền';
			case 'THANH_TOAN':
				return 'Thanh toán';
			case 'NHAN_TIEN':
				return 'Nhận tiền';
			case 'HOAN_TIEN':
				return 'Hoàn tiền';
			default:
				return type;
		}
	};

	const getStatusColor = (status: TransactionStatus) => {
		switch (status) {
			case 'THANH_CONG':
				return 'green';
			case 'DANG_XU_LY':
				return 'orange';
			case 'THAT_BAI':
				return 'red';
			default:
				return 'gray';
		}
	};

	const getStatusLabel = (status: TransactionStatus) => {
		switch (status) {
			case 'THANH_CONG':
				return 'Thành công';
			case 'DANG_XU_LY':
				return 'Đang xử lý';
			case 'THAT_BAI':
				return 'Thất bại';
			default:
				return status;
		}
	};

	return (
		<Paper withBorder radius="md" p="lg" shadow="xs">
			<Group justify="space-between" mb="md">
				<Text fw={700}>Lịch sử giao dịch</Text>
				<Badge variant="light" color="gray">5 giao dịch gần nhất</Badge>
			</Group>

			{!hasWallet ? (
				<Alert icon={<FiCreditCard size={16} />} color="blue" variant="light">
					Chưa có dữ liệu giao dịch. Vui lòng xác thực để tạo ví.
				</Alert>
			) : isLoading ? (
				<Group justify="center" py="md">
					<Loader size="sm" />
				</Group>
			) : transactions.length === 0 ? (
				<Alert icon={<FiClock size={16} />} color="gray" variant="light">
					Chưa có giao dịch nào.
				</Alert>
			) : (
				<Table striped highlightOnHover withTableBorder>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Mã</Table.Th>
							<Table.Th>Loại</Table.Th>
							<Table.Th>Số tiền</Table.Th>
							<Table.Th>Trạng thái</Table.Th>
							<Table.Th>Thời gian</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{transactions.map((item) => (
							<Table.Tr key={item.id}>
								<Table.Td>
									<Text size="sm">{item.referenceCode || '—'}</Text>
								</Table.Td>
								<Table.Td>
									<Text size="sm">{getTypeLabel(item.transactionType)}</Text>
								</Table.Td>
								<Table.Td>
									<Text
										size="sm"
										fw={600}
										c={['NAP_TIEN', 'NHAN_TIEN', 'HOAN_TIEN'].includes(item.transactionType)
											? 'green'
											: 'red'}
									>
										{formatPrice(item.amount)}
									</Text>
								</Table.Td>
								<Table.Td>
									<Badge size="sm" color={getStatusColor(item.status)} variant="light">
										{getStatusLabel(item.status)}
									</Badge>
								</Table.Td>
								<Table.Td>
									<Text size="sm">{formatDate(item.createdAt)}</Text>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			)}
		</Paper>
	);
};

export default Transaction;
