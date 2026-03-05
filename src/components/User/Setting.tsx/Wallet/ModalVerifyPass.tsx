import {
    Image,
    Loader,
    Modal,
    PinInput,
    Stack,
    Text,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { WalletService } from '../../../../service/WalletService';

interface ModalVerifyPassProps {
    opened: boolean;
    onClose: () => void;
    onVerified: () => void;
}

const BOAN_IMAGES = [15, 16, 17, 18, 19, 20, 21];

const ModalVerifyPass = ({ opened, onClose, onVerified }: ModalVerifyPassProps) => {
    const randomImage = useMemo(
        () => BOAN_IMAGES[Math.floor(Math.random() * BOAN_IMAGES.length)],
        []
    );
    const [pin, setPin] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);

    const MAX_ATTEMPTS = 5;

    const handleVerify = async (value?: string) => {
        const pinValue = value ?? pin;
        if (pinValue.length !== 6) {
            setError('Vui lòng nhập đủ 6 chữ số');
            return;
        }

        if (attempts >= MAX_ATTEMPTS) {
            setError('Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau.');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            const result = await WalletService.verifyPassword(pinValue);

            if (result.verified) {
                handleReset();
                onVerified();
            } else {
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                const remaining = MAX_ATTEMPTS - newAttempts;
                setError(
                    remaining > 0
                        ? `Mã PIN không đúng. Còn ${remaining} lần thử.`
                        : 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau.'
                );
                setPin('');
            }
        } catch {
            setError('Xác thực thất bại. Vui lòng thử lại.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleReset = () => {
        setPin('');
        setError('');
        setAttempts(0);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={null}
            centered
            size="md"
            withCloseButton
            closeOnClickOutside={false}
            padding="xl"
            radius="lg"
            overlayProps={{
                backgroundOpacity: 0.4,
                blur: 8,
            }}
        >
            <Stack align="center" gap="lg" py="md">
                <Image
                    src={`/images/boan_khoan/${randomImage}.png`}
                    alt="Xác thực"
                    w={120}
                    h={120}
                    fit="contain"
                />

                <div className="text-center">
                    <Text fw={600} size="lg" mb={4}>
                        Xác thực mã PIN
                    </Text>
                    <Text size="sm" c="dimmed">
                        Nhập mã PIN thanh toán để truy cập ví của bạn
                    </Text>
                </div>

                <div className="flex flex-col items-center">
                    <PinInput
                        length={6}
                        type="number"
                        mask
                        size="lg"
                        value={pin}
                        onChange={(value) => {
                            setPin(value);
                            if (error) setError('');
                        }}
                        error={!!error}
                        disabled={isVerifying || attempts >= MAX_ATTEMPTS}
                        onComplete={(value) => handleVerify(value)}
                    />
                    {error && (
                        <Text size="xs" c="red" mt="xs" ta="center">
                            {error}
                        </Text>
                    )}
                    {isVerifying && (
                        <Loader size="sm" mt="xs" />
                    )}
                </div>
            </Stack>
        </Modal>
    );
};

export default ModalVerifyPass;
