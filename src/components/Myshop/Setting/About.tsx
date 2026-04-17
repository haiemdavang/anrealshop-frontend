import {
    Avatar,
    Box,
    Button,
    Divider,
    FileButton,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { FiCamera, FiLink, FiSave, FiShoppingBag, FiX } from 'react-icons/fi';
import authService from '../../../service/AuthService';
import { uploadToCloudinary } from '../../../service/Cloundinary';
import ShopService from '../../../service/ShopService';
import { showErrorNotification } from '../../Toast/NotificationError';
import showSuccessNotification from '../../Toast/NotificationSuccess';
import { buildPath } from '../../../untils/Untils';

export interface ShopFormData {
    name: string;
    description: string;
    urlSlug: string;
    avatarUrl: string;
    avatarFile: File | null;
}

const About: React.FC = () => {
    const [saving, setSaving] = useState(false);
    const [, { open: openSaved, close: closeSaved }] = useDisclosure(false);

    const [shopData, setShopData] = useState<ShopFormData>({
        name: '',
        description: '',
        urlSlug: '',
        avatarUrl: '',
        avatarFile: null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>('https://i.pravatar.cc/150?img=12');

    const fetchShopInfo = async () => {
        try {
            const info = await authService.getShopInfo();
            const shopId = info.id;
            try {
                const detail = await ShopService.getShopDetails(shopId);
                const detailData = detail as any;

                setShopData({
                    name: info.name || '',
                    description: detailData.description || '',
                    urlSlug: info.shopUrl || '',
                    avatarUrl: info.avatarUrl || '',
                    avatarFile: null,
                });
                if (info.avatarUrl) setAvatarPreview(info.avatarUrl);
            } catch (e) {
                setShopData({
                    name: info.name || '',
                    description: '',
                    urlSlug: info.shopUrl || '',
                    avatarUrl: info.avatarUrl || '',
                    avatarFile: null,
                });
                if (info.avatarUrl) setAvatarPreview(info.avatarUrl);
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin cửa hàng", error);
        }
    };

    useEffect(() => {
        fetchShopInfo();
    }, []);

    const handleChange = (field: keyof ShopFormData, value: any) => {
        setShopData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'name') {
                newData.urlSlug = buildPath(value as string);
            }
            return newData;
        });
    };

    const handleAvatarChange = (file: File | null) => {
        handleChange('avatarFile', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            let finalAvatarUrl = shopData.avatarUrl;
            if (shopData.avatarFile) {
                const uploadRes = await uploadToCloudinary(shopData.avatarFile, 'image');
                finalAvatarUrl = uploadRes.secure_url;
            }

            await ShopService.updateShop({
                name: shopData.name,
                description: shopData.description,
                urlSlug: shopData.urlSlug,
                avatarUrl: finalAvatarUrl,
            });

            setShopData(prev => ({ ...prev, avatarUrl: finalAvatarUrl, avatarFile: null }));

            openSaved();
            showSuccessNotification('Đã lưu thành công', 'Thông tin cửa hàng đã được cập nhật');
            setTimeout(closeSaved, 3000);
        } catch (error) {
            console.error('Lỗi khi lưu thông tin:', error);
            showErrorNotification('Lưu thất bại', 'Có lỗi xảy ra khi lưu thông tin cửa hàng. Kiểm tra kĩ thông tin URL (không dùng ký tự đặc biệt).');
        } finally {
            setSaving(false);
        }
    };

    const resetSettings = () => {
        fetchShopInfo();
        showSuccessNotification('Thông báo', 'Đã khôi phục dữ liệu ban đầu');
    };

    return (
        <Stack gap="lg">
            {/* Section title */}
            <Box>
                <Title order={4} className="text-slate-800">Thông tin cửa hàng</Title>
                <Text size="sm" c="dimmed" mt={2}>
                    Cập nhật thông tin chi tiết hiển thị trên cửa hàng của bạn
                </Text>
            </Box>
            <Divider />

            {/* Avatar section */}
            <Paper radius="md" p="md" className="bg-slate-50 border border-slate-100">
                <Group gap="xl" align="center">
                    <Box className="relative">
                        <Avatar
                            src={avatarPreview}
                            size={88}
                            radius="50%"
                            className="ring-4 ring-white shadow-md"
                        />
                        <FileButton onChange={handleAvatarChange} accept="image/png,image/jpeg,image/webp">
                            {(props) => (
                                <button
                                    {...props}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/90 transition-colors"
                                >
                                    <FiCamera size={13} />
                                </button>
                            )}
                        </FileButton>
                    </Box>
                    <Box>
                        <Text fw={600} size="sm" className="text-slate-800">{shopData.name || 'Chưa có tên cửa hàng'}</Text>
                        <Text size="xs" c="dimmed" mt={2}>{shopData.urlSlug ? `@${shopData.urlSlug}` : 'Chưa có đường dẫn'}</Text>
                        <Text size="xs" c="dimmed" mt={1}>
                            Định dạng hỗ trợ: JPG, PNG, WEBP · Tối đa 5MB
                        </Text>
                    </Box>
                </Group>
            </Paper>

            {/* Form fields */}
            <Box>
                <Text fw={600} size="sm" className="text-slate-700" mb="sm">Thông tin cơ bản</Text>
                <Stack gap="sm">
                    <Group grow>
                        <TextInput
                            label="Tên cửa hàng"
                            placeholder="Nhập tên cửa hàng của bạn"
                            value={shopData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            leftSection={<FiShoppingBag size={14} />}
                            required
                        />
                        <TextInput
                            label="Đường dẫn cửa hàng (URL slug)"
                            placeholder="vi-du-ten-shop"
                            value={shopData.urlSlug}
                            onChange={(e) => handleChange('urlSlug', e.target.value)}
                            leftSection={<FiLink size={14} />}
                            disabled
                        />
                    </Group>
                    <Textarea
                        label="Mô tả cửa hàng"
                        placeholder="Hãy viết vài điều giới thiệu về cửa hàng của bạn..."
                        value={shopData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        autosize
                        minRows={3}
                        maxRows={5}
                    />
                </Stack>
            </Box>

            <Divider />

            {/* Actions */}
            <Group justify="flex-end" gap="sm">
                <Button variant="subtle" color="gray" leftSection={<FiX size={14} />} onClick={resetSettings}>
                    Đặt lại
                </Button>
                <Button leftSection={<FiSave size={14} />} onClick={saveSettings} loading={saving}>
                    Lưu thay đổi
                </Button>
            </Group>
        </Stack>
    );
};

export default About;