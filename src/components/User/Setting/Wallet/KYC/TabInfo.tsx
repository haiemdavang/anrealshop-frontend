import { Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { FiCreditCard, FiUser } from 'react-icons/fi';
import type { DocumentType } from '../../../../../types/WalletType';
import '@mantine/dates/styles.css';

interface TabInfoProps {
    realFullName: string;
    setRealFullName: (value: string) => void;
    documentType: DocumentType;
    documentNumber: string;
    setDocumentNumber: (value: string) => void;
    dateOfBirth: Date | null;
    setDateOfBirth: (value: Date | null) => void;
    errors: Record<string, string>;
}

const TabInfo = ({
    realFullName,
    setRealFullName,
    documentType,
    documentNumber,
    setDocumentNumber,
    dateOfBirth,
    setDateOfBirth,
    errors,
}: TabInfoProps) => {
    return (
        <Stack gap="md">
            <TextInput
                label="Họ và tên (theo giấy tờ)"
                placeholder="Nguyễn Văn A"
                value={realFullName}
                onChange={(e) => setRealFullName(e.currentTarget.value)}
                error={errors.realFullName}
                required
                leftSection={<FiUser size={16} />}
            />

            <TextInput
                label={documentType === 'CCCD' ? 'Số CCCD' : 'Số hộ chiếu'}
                placeholder={documentType === 'CCCD' ? '001234567890' : 'B1234567'}
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.currentTarget.value)}
                error={errors.documentNumber}
                required
                leftSection={<FiCreditCard size={16} />}
            />

            <DateInput
                label="Ngày sinh"
                placeholder="Chọn ngày sinh"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                error={errors.dateOfBirth}
                required
                maxDate={new Date()}
                valueFormat="DD/MM/YYYY"
            />
        </Stack>
    );
};

export default TabInfo;
