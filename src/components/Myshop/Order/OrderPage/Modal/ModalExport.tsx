import { Button, Group, Modal, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import { FiCalendar, FiDownload } from 'react-icons/fi';
import type { PreparingStatus } from '../../../../../hooks/useOrder';
import { OrderService } from '../../../../../service/OrderService';
import showErrorNotification from '../../../../Toast/NotificationError';
import showSuccessNotification from '../../../../Toast/NotificationSuccess';
import { formatDateForBe } from '../../../../../untils/Untils';

interface ModalExportProps {
    opened: boolean;
    onClose: () => void;
    preparingStatus: PreparingStatus;
}

const ModalExport = ({ opened, onClose, preparingStatus }: ModalExportProps) => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        const [startDate, endDate] = dateRange;
        if (!startDate || !endDate || isExporting) return;

        setIsExporting(true);
        try {
            const formattedStartDate = formatDateForBe(startDate);
            const formattedEndDate = formatDateForBe(endDate);
            const exportStatus = preparingStatus === 'all'
                ? 'all'
                : preparingStatus.toUpperCase() as 'PREPARING' | 'CONFIRMED';

            const { file, filename } = await OrderService.exportMyShopOrders({
                preparingStatus: exportStatus,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            });

            const downloadUrl = URL.createObjectURL(file);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = filename
                || `don-hang-${formattedStartDate.split('-').reverse().join('')}-${formattedEndDate.split('-').reverse().join('')}.xlsx`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
            URL.revokeObjectURL(downloadUrl);

            showSuccessNotification('Thành công', 'Dữ liệu đơn hàng đã được xuất thành công.');
            onClose();
        } catch {
            showErrorNotification('Xuất dữ liệu thất bại', 'Không thể xuất dữ liệu đơn hàng. Vui lòng thử lại.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Xuất dữ liệu" size="md" centered >
            <div className="min-h-[40vh] relative">
                <Text size="sm" mb="md">Chọn khoảng thời gian để xuất dữ liệu đơn hàng</Text>


                <DatePickerInput
                    type="range"
                    placeholder="Chọn khoảng thời gian"
                    value={dateRange}
                    onChange={setDateRange}
                    clearable
                    valueFormat="DD/MM/YYYY"
                    locale="vi"
                    leftSection={<FiCalendar size={16} />}
                    // rightSection={!equalDateWithDefault() ? (
                    //     <ActionIcon size="sm" variant="subtle" onClick={() => onDateChange(getDefaultDateRange_Now_Yesterday())}>
                    //         <FiX size={14} />
                    //     </ActionIcon>
                    // ) : <></>}
                    style={{ minWidth: '300px' }}
                />

            </div>
            <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={onClose}>Hủy</Button>
                <Button
                    leftSection={<FiDownload size={16} />}
                    onClick={handleExport}
                    disabled={!dateRange[0] || !dateRange[1] || isExporting}
                    loading={isExporting}
                >
                    Xuất dữ liệu
                </Button>
            </Group>
        </Modal>
    );
};

export default ModalExport;
