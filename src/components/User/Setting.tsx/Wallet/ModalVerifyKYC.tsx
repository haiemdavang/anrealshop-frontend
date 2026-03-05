import {
    Button,
    Divider,
    Group,
    Modal,
    ScrollArea,
    Stepper,
    Text,
} from '@mantine/core';
import { useState } from 'react';
import {
    FiCamera,
    FiCheck,
    FiCreditCard,
    FiLock,
    FiShield,
    FiUser,
} from 'react-icons/fi';
import { uploadToCloudinary } from '../../../../service/Cloundinary';
import { KycService } from '../../../../service/KycService';
import { WalletService } from '../../../../service/WalletService';
import type { DocumentType, VerifyWalletRequest } from '../../../../types/WalletType';
import { fileToBase64, formatDateForBe, parseDateString, urlToBase64 } from '../../../../untils/Untils';
import showErrorNotification from '../../../Toast/NotificationError';
import showSuccessNotification from '../../../Toast/NotificationSuccess';
import TabConfirm from './KYC/TabConfirm';
import TabFace from './KYC/TabFace';
import TabInfo from './KYC/TabInfo';
import TabPass from './KYC/TabPass';
import UploadDoc, { type ImageUploadState } from './KYC/UploadDoc';
import { getErrorMessage } from '../../../../untils/ErrorUntils';

interface ModalVerifyKYCProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ModalVerifyKYC = ({ opened, onClose, onSuccess }: ModalVerifyKYCProps) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isVerifyingFace, setIsVerifyingFace] = useState(false);

    // Step 0: Document images
    const [documentType, setDocumentType] = useState<DocumentType>('CCCD');
    const [frontImage, setFrontImage] = useState<ImageUploadState | null>(null);
    const [backImage, setBackImage] = useState<ImageUploadState | null>(null);

    // Step 1: Personal info (auto-filled from OCR)
    const [realFullName, setRealFullName] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

    // Step 2: Face
    const [portraitImage, setPortraitImage] = useState<ImageUploadState | null>(null);

    // Step 3: Payment password
    const [paymentPassword, setPaymentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleImageUpload = async (
        file: File,
        setter: (state: ImageUploadState | null) => void
    ) => {
        const tempUrl = URL.createObjectURL(file);
        setter({ url: tempUrl, isUploading: true, file });

        try {
            const { secure_url } = await uploadToCloudinary(file, 'image');
            URL.revokeObjectURL(tempUrl);
            setter({ url: secure_url, isUploading: false });
        } catch {
            setter({ url: tempUrl, isUploading: false, file });
            showErrorNotification('Lỗi', 'Tải ảnh lên thất bại. Vui lòng thử lại.');
        }
    };

    const removeImage = (setter: (state: ImageUploadState | null) => void, current: ImageUploadState | null) => {
        if (current?.url.startsWith('blob:')) {
            URL.revokeObjectURL(current.url);
        }
        setter(null);
    };

    const handleFaceCapture = async (file: File, previewUrl: string) => {
        setPortraitImage({ url: previewUrl, isUploading: true, file });
        try {
            const { secure_url } = await uploadToCloudinary(file, 'image');
            URL.revokeObjectURL(previewUrl);
            setPortraitImage({ url: secure_url, isUploading: false, file });
        } catch {
            setPortraitImage({ url: previewUrl, isUploading: false, file });
            showErrorNotification('Lỗi', 'Tải ảnh lên thất bại. Vui lòng thử lại.');
        }
    };

    const validateUpload = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!frontImage || frontImage.isUploading) newErrors.frontImage = 'Vui lòng tải ảnh mặt trước';
        if (!backImage || backImage.isUploading) newErrors.backImage = 'Vui lòng tải ảnh mặt sau';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateInfo = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!realFullName.trim()) newErrors.realFullName = 'Vui lòng nhập họ và tên';
        if (!documentNumber.trim()) newErrors.documentNumber = 'Vui lòng nhập số giấy tờ';
        if (documentType === 'CCCD' && documentNumber.trim().length !== 12) {
            newErrors.documentNumber = 'Số CCCD phải có 12 chữ số';
        }
        if (!dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFace = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!portraitImage || portraitImage.isUploading) newErrors.portraitImage = 'Vui lòng tải ảnh chân dung';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePass = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!paymentPassword) newErrors.paymentPassword = 'Vui lòng nhập mã PIN';
        if (paymentPassword.length !== 6) newErrors.paymentPassword = 'Mã PIN phải có 6 chữ số';
        if (paymentPassword !== confirmPassword) newErrors.confirmPassword = 'Mã PIN xác nhận không khớp';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDetectAndNext = async () => {
        if (!validateUpload()) return;

        setIsDetecting(true);
        try {
            // Convert front image to base64 for OCR
            const frontBase64 = frontImage!.file
                ? await fileToBase64(frontImage!.file)
                : await urlToBase64(frontImage!.url);

            const ocrResult = await KycService.scanId(frontBase64);

            // Auto-fill info from OCR
            if (ocrResult.fullName) setRealFullName(ocrResult.fullName);
            if (ocrResult.documentNumber) setDocumentNumber(ocrResult.documentNumber);
            if (ocrResult.dateOfBirth) {
                const parsed = parseDateString(ocrResult.dateOfBirth);
                if (parsed) setDateOfBirth(parsed);
            }
            if (ocrResult.documentType) setDocumentType(ocrResult.documentType);
        } catch {
            showErrorNotification('Thông báo', 'Không thể nhận dạng tự động. Vui lòng nhập thông tin thủ công.');
        } finally {
            setIsDetecting(false);
        }

        setActiveStep(1);
        setErrors({});
    };

    const handleVerifyFaceAndNext = async () => {
        if (!validateFace()) return;

        setIsVerifyingFace(true);
        try {
            const idBase64 = frontImage!.file
                ? await fileToBase64(frontImage!.file)
                : await urlToBase64(frontImage!.url);
            const selfieBase64 = portraitImage!.file
                ? await fileToBase64(portraitImage!.file)
                : await urlToBase64(portraitImage!.url);

            const result = await KycService.verifyFace(idBase64, selfieBase64);

            if (!result.matched) {
                showErrorNotification(
                    'Xác thực thất bại',
                    result.message || 'Khuôn mặt không khớp với ảnh trên giấy tờ. Vui lòng thử lại.'
                );
                return;
            }

            setActiveStep(3);
            setErrors({});
        } catch(Error : any) {
            showErrorNotification('Lỗi', getErrorMessage(Error) || 'Xác thực khuôn mặt thất bại. Vui lòng thử lại.');
        } finally {
            setIsVerifyingFace(false);
        }
    };

    const handleNext = () => {
        // Step 0 handled by handleDetectAndNext
        // Step 2 handled by handleVerifyFaceAndNext
        if (activeStep === 1 && !validateInfo()) return;
        if (activeStep === 3 && !validatePass()) return;

        if (activeStep < 4) {
            setActiveStep((prev) => prev + 1);
            setErrors({});
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setErrors({});
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const request: VerifyWalletRequest = {
                realFullName: realFullName.trim(),
                documentNumber: documentNumber.trim(),
                documentType,
                dateOfBirth: dateOfBirth ? formatDateForBe(dateOfBirth) : '',
                frontImageUrl: frontImage?.url || '',
                backImageUrl: backImage?.url || '',
                portraitImageUrl: portraitImage?.url || '',
                paymentPassword,
            };

            await WalletService.submitVerification(request);
            showSuccessNotification('Thành công', 'Đã gửi yêu cầu xác thực. Vui lòng chờ phê duyệt.');
            onSuccess();
            handleReset();
        } catch (error: any) {
            showErrorNotification('Lỗi', getErrorMessage(error) || 'Gửi xác thực thất bại. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setRealFullName('');
        setDocumentType('CCCD');
        setDocumentNumber('');
        setDateOfBirth(null);
        setFrontImage(null);
        setBackImage(null);
        setPortraitImage(null);
        setPaymentPassword('');
        setConfirmPassword('');
        setErrors({});
    };

    const isAnyUploading = frontImage?.isUploading || backImage?.isUploading || portraitImage?.isUploading;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <FiShield size={18} className="text-blue-500" />
                    <Text fw={600}>Xác thực danh tính (KYC)</Text>
                </Group>
            }
            centered
            size="80vw"
            closeOnClickOutside={false}
            padding="xl"
            styles={{
                content: {
                    height: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', 
                },
                body: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    paddingTop: 'var(--mantine-spacing-md)',
                },
            }}
        >
            <Stepper active={activeStep} size="sm" mb="md" mx="lg">
                <Stepper.Step label="Giấy tờ" icon={<FiCreditCard size={16} />} />
                <Stepper.Step label="Thông tin" icon={<FiUser size={16} />} />
                <Stepper.Step label="Chân dung" icon={<FiCamera size={16} />} />
                <Stepper.Step label="Mã PIN" icon={<FiLock size={16} />} />
                <Stepper.Step label="Xác nhận" icon={<FiCheck size={16} />} />
            </Stepper>

            <Divider mb="xl" />

            <ScrollArea.Autosize mah="40vh" offsetScrollbars>
                <div className="px-1">
                    {/* Step 0: Upload Document */}
                    {activeStep === 0 && (
                        <UploadDoc
                            documentType={documentType}
                            setDocumentType={setDocumentType}
                            frontImage={frontImage}
                            backImage={backImage}
                            onUploadFront={(file) => handleImageUpload(file, setFrontImage)}
                            onUploadBack={(file) => handleImageUpload(file, setBackImage)}
                            onRemoveFront={() => removeImage(setFrontImage, frontImage)}
                            onRemoveBack={() => removeImage(setBackImage, backImage)}
                            errors={errors}
                        />
                    )}

                    {/* Step 1: Personal Information (auto-filled from OCR) */}
                    {activeStep === 1 && (
                        <TabInfo
                            realFullName={realFullName}
                            setRealFullName={setRealFullName}
                            documentType={documentType}
                            documentNumber={documentNumber}
                            setDocumentNumber={setDocumentNumber}
                            dateOfBirth={dateOfBirth}
                            setDateOfBirth={setDateOfBirth}
                            errors={errors}
                        />
                    )}

                    {/* Step 2: Face / Portrait */}
                    {activeStep === 2 && (
                        <TabFace
                            portraitImage={portraitImage}
                            onCapture={handleFaceCapture}
                            onRemove={() => removeImage(setPortraitImage, portraitImage)}
                            errors={errors}
                        />
                    )}

                    {/* Step 3: Payment PIN */}
                    {activeStep === 3 && (
                        <TabPass
                            paymentPassword={paymentPassword}
                            setPaymentPassword={setPaymentPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            errors={errors}
                        />
                    )}

                    {/* Step 4: Confirmation */}
                    {activeStep === 4 && (
                        <TabConfirm
                            realFullName={realFullName}
                            documentType={documentType}
                            documentNumber={documentNumber}
                            dateOfBirth={dateOfBirth}
                            frontImage={frontImage}
                            backImage={backImage}
                            portraitImage={portraitImage}
                        />
                    )}
                </div>
            </ScrollArea.Autosize>

            {/* Navigation Buttons */}
            <Divider mt="xl" mb="lg" />
            <Group justify="space-between">
                <Button
                    variant="outline"
                    onClick={activeStep === 0 ? onClose : handleBack}
                >
                    {activeStep === 0 ? 'Hủy' : 'Quay lại'}
                </Button>

                {activeStep === 0 ? (
                    <Button
                        onClick={handleDetectAndNext}
                        loading={isDetecting}
                        disabled={!!isAnyUploading}
                    >
                        Tiếp theo
                    </Button>
                ) : activeStep === 2 ? (
                    <Button
                        onClick={handleVerifyFaceAndNext}
                        loading={isVerifyingFace}
                        disabled={!!isAnyUploading}
                    >
                        Xác thực khuôn mặt
                    </Button>
                ) : activeStep < 4 ? (
                    <Button
                        onClick={handleNext}
                        disabled={!!isAnyUploading}
                    >
                        Tiếp theo
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        leftSection={<FiShield size={16} />}
                        color="blue"
                    >
                        Gửi xác thực
                    </Button>
                )}
            </Group>
        </Modal>
    );
};

export default ModalVerifyKYC;
