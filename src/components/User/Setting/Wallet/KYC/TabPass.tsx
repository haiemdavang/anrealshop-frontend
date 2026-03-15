import { PinInput, Stack, Text } from '@mantine/core';

interface TabPassProps {
    paymentPassword: string;
    setPaymentPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    errors: Record<string, string>;
}

const TabPass = ({
    paymentPassword,
    setPaymentPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
}: TabPassProps) => {
    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed">
                Tạo mã PIN thanh toán để bảo vệ các giao dịch của bạn.
            </Text>

            <div className="flex flex-col items-center">
                <Text size="sm" fw={500} mb={4}>
                    Mã PIN thanh toán <Text component="span" c="red">*</Text>
                </Text>
                <PinInput
                    length={6}
                    type="number"
                    mask
                    value={paymentPassword}
                    onChange={setPaymentPassword}
                    error={!!errors.paymentPassword}
                />
                {errors.paymentPassword && (
                    <Text size="xs" c="red" mt={4}>{errors.paymentPassword}</Text>
                )}
            </div>

            <div className="flex flex-col items-center">
                <Text size="sm" fw={500} mb={4}>
                    Xác nhận mã PIN <Text component="span" c="red">*</Text>
                </Text>
                <PinInput
                    length={6}
                    type="number"
                    mask
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                    <Text size="xs" c="red" mt={4}>{errors.confirmPassword}</Text>
                )}
            </div>
        </Stack>
    );
};

export default TabPass;
