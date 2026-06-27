import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  NavLink,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import {
  FiAlertTriangle,
  FiBell,
  FiDatabase,
  FiGlobe,
  FiRefreshCcw,
  FiSave,
  FiSettings,
  FiShield,
  FiUsers,
} from 'react-icons/fi';
import showSuccessNotification from '../../Toast/NotificationSuccess';

type SettingTab = 'general' | 'access' | 'security' | 'notifications' | 'maintenance';

interface SystemSettingValues {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultLanguage: string;
  systemNotice: string;
  allowUserRegistration: boolean;
  allowShopRegistration: boolean;
  requireEmailVerification: boolean;
  autoApproveProducts: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  requireAdminTwoFactor: boolean;
  alertOnSuspiciousLogin: boolean;
  notifyNewUser: boolean;
  notifyShopRegistration: boolean;
  notifyProductApproval: boolean;
  notifySystemIncident: boolean;
  maintenanceMode: boolean;
}

const STORAGE_KEY = 'admin-system-settings';

const DEFAULT_SETTINGS: SystemSettingValues = {
  platformName: 'Hai Lee',
  supportEmail: 'lienhe@hailee.com',
  supportPhone: '1900 1234',
  defaultLanguage: 'vi',
  systemNotice: '',
  allowUserRegistration: true,
  allowShopRegistration: true,
  requireEmailVerification: true,
  autoApproveProducts: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  requireAdminTwoFactor: false,
  alertOnSuspiciousLogin: true,
  notifyNewUser: true,
  notifyShopRegistration: true,
  notifyProductApproval: true,
  notifySystemIncident: true,
  maintenanceMode: false,
};

const loadSettings = (): SystemSettingValues => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

interface SettingSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
}

const SettingSwitch = ({
  label,
  description,
  checked,
  onChange,
  color = 'blue',
}: SettingSwitchProps) => (
  <Group justify="space-between" align="center" wrap="nowrap" py="sm">
    <div>
      <Text size="sm" fw={600}>{label}</Text>
      <Text size="xs" c="dimmed" mt={3}>{description}</Text>
    </div>
    <Switch
      checked={checked}
      onChange={(event) => onChange(event.currentTarget.checked)}
      color={color}
      size="md"
    />
  </Group>
);

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [settings, setSettings] = useState<SystemSettingValues>(loadSettings);
  const [savedSettings, setSavedSettings] = useState<SystemSettingValues>(settings);
  const [resetOpened, { open: openReset, close: closeReset }] = useDisclosure(false);

  const updateSetting = <K extends keyof SystemSettingValues>(
    key: K,
    value: SystemSettingValues[K]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedSettings(settings);
    showSuccessNotification('Lưu thành công', 'Cài đặt hệ thống đã được cập nhật.');
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSavedSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    closeReset();
    showSuccessNotification('Đã khôi phục', 'Cài đặt hệ thống đã trở về mặc định.');
  };

  const tabs = [
    { id: 'general' as const, label: 'Thông tin chung', icon: FiGlobe },
    { id: 'access' as const, label: 'Đăng ký & xét duyệt', icon: FiUsers },
    { id: 'security' as const, label: 'Bảo mật', icon: FiShield },
    { id: 'notifications' as const, label: 'Thông báo', icon: FiBell },
    { id: 'maintenance' as const, label: 'Bảo trì hệ thống', icon: FiDatabase },
  ];

  return (
    <Box className="min-h-[calc(100vh-180px)] flex flex-col">
      <Group justify="space-between" align="flex-start" mb="lg" wrap="wrap">
        <div>
          <Group gap="xs">
            <FiSettings size={22} className="text-primary" />
            <Title order={2} size="h3">Cài đặt hệ thống</Title>
          </Group>
          <Text size="sm" c="dimmed" mt={5}>
            Quản lý cấu hình chung, quyền truy cập và an toàn của nền tảng.
          </Text>
        </div>
        <Group gap="xs">
          <Tooltip label="Khôi phục cấu hình mặc định">
            <ActionIcon variant="default" size="lg" onClick={openReset}>
              <FiRefreshCcw size={17} />
            </ActionIcon>
          </Tooltip>
          <Button
            leftSection={<FiSave size={16} />}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Lưu thay đổi
          </Button>
        </Group>
      </Group>

      <div className="grid flex-1 grid-cols-1 items-stretch gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
        <Paper withBorder radius="md" p="xs" className="h-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                label={tab.label}
                leftSection={<Icon size={16} />}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="rounded-md mb-1"
              />
            );
          })}
        </Paper>

        <Paper withBorder radius="md" p="lg" className="h-full min-h-[500px]">
          {activeTab === 'general' && (
            <Stack>
              <div>
                <Title order={4}>Thông tin nền tảng</Title>
                <Text size="sm" c="dimmed">Thông tin hiển thị và kênh hỗ trợ chính thức.</Text>
              </div>
              <Divider />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Tên nền tảng"
                  value={settings.platformName}
                  onChange={(event) => updateSetting('platformName', event.currentTarget.value)}
                  required
                />
                <Select
                  label="Ngôn ngữ mặc định"
                  value={settings.defaultLanguage}
                  onChange={(value) => updateSetting('defaultLanguage', value || 'vi')}
                  data={[
                    { value: 'vi', label: 'Tiếng Việt' },
                    { value: 'en', label: 'English' },
                  ]}
                />
                <TextInput
                  label="Email hỗ trợ"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(event) => updateSetting('supportEmail', event.currentTarget.value)}
                />
                <TextInput
                  label="Số điện thoại hỗ trợ"
                  value={settings.supportPhone}
                  onChange={(event) => updateSetting('supportPhone', event.currentTarget.value)}
                />
              </SimpleGrid>
              <Textarea
                label="Thông báo toàn hệ thống"
                description="Để trống nếu không muốn hiển thị thông báo."
                placeholder="Nhập nội dung thông báo..."
                minRows={4}
                value={settings.systemNotice}
                onChange={(event) => updateSetting('systemNotice', event.currentTarget.value)}
              />
            </Stack>
          )}

          {activeTab === 'access' && (
            <Stack>
              <div>
                <Title order={4}>Đăng ký và xét duyệt</Title>
                <Text size="sm" c="dimmed">Kiểm soát quyền tạo tài khoản, cửa hàng và sản phẩm.</Text>
              </div>
              <Divider />
              <SettingSwitch
                label="Cho phép đăng ký người dùng"
                description="Người dùng mới có thể tự tạo tài khoản."
                checked={settings.allowUserRegistration}
                onChange={(value) => updateSetting('allowUserRegistration', value)}
              />
              <Divider />
              <SettingSwitch
                label="Cho phép đăng ký cửa hàng"
                description="Người bán có thể gửi hồ sơ đăng ký cửa hàng."
                checked={settings.allowShopRegistration}
                onChange={(value) => updateSetting('allowShopRegistration', value)}
              />
              <Divider />
              <SettingSwitch
                label="Yêu cầu xác minh email"
                description="Tài khoản mới phải xác minh email trước khi sử dụng đầy đủ tính năng."
                checked={settings.requireEmailVerification}
                onChange={(value) => updateSetting('requireEmailVerification', value)}
              />
              <Divider />
              <SettingSwitch
                label="Tự động duyệt sản phẩm"
                description="Bỏ qua bước quản trị viên xét duyệt sản phẩm mới."
                checked={settings.autoApproveProducts}
                onChange={(value) => updateSetting('autoApproveProducts', value)}
                color="orange"
              />
            </Stack>
          )}

          {activeTab === 'security' && (
            <Stack>
              <div>
                <Title order={4}>Chính sách bảo mật</Title>
                <Text size="sm" c="dimmed">Thiết lập phiên đăng nhập và bảo vệ tài khoản quản trị.</Text>
              </div>
              <Divider />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <NumberInput
                  label="Thời gian phiên đăng nhập"
                  description="Số phút không hoạt động trước khi hết phiên."
                  min={5}
                  max={1440}
                  suffix=" phút"
                  value={settings.sessionTimeout}
                  onChange={(value) => updateSetting('sessionTimeout', Number(value) || 30)}
                />
                <NumberInput
                  label="Số lần đăng nhập sai tối đa"
                  description="Tài khoản sẽ bị khóa tạm thời khi vượt giới hạn."
                  min={3}
                  max={20}
                  value={settings.maxLoginAttempts}
                  onChange={(value) => updateSetting('maxLoginAttempts', Number(value) || 5)}
                />
              </SimpleGrid>
              <Divider />
              <SettingSwitch
                label="Xác thực hai lớp cho quản trị viên"
                description="Yêu cầu mã xác thực bổ sung khi đăng nhập trang quản trị."
                checked={settings.requireAdminTwoFactor}
                onChange={(value) => updateSetting('requireAdminTwoFactor', value)}
              />
              <Divider />
              <SettingSwitch
                label="Cảnh báo đăng nhập bất thường"
                description="Gửi cảnh báo khi phát hiện thiết bị hoặc vị trí đăng nhập lạ."
                checked={settings.alertOnSuspiciousLogin}
                onChange={(value) => updateSetting('alertOnSuspiciousLogin', value)}
              />
            </Stack>
          )}

          {activeTab === 'notifications' && (
            <Stack>
              <div>
                <Title order={4}>Thông báo quản trị</Title>
                <Text size="sm" c="dimmed">Chọn các sự kiện cần gửi thông báo đến quản trị viên.</Text>
              </div>
              <Divider />
              <SettingSwitch
                label="Người dùng đăng ký mới"
                description="Thông báo khi hệ thống có tài khoản mới."
                checked={settings.notifyNewUser}
                onChange={(value) => updateSetting('notifyNewUser', value)}
              />
              <Divider />
              <SettingSwitch
                label="Yêu cầu đăng ký cửa hàng"
                description="Thông báo ngay khi có hồ sơ cửa hàng cần xét duyệt."
                checked={settings.notifyShopRegistration}
                onChange={(value) => updateSetting('notifyShopRegistration', value)}
              />
              <Divider />
              <SettingSwitch
                label="Sản phẩm chờ xét duyệt"
                description="Thông báo khi người bán gửi sản phẩm mới."
                checked={settings.notifyProductApproval}
                onChange={(value) => updateSetting('notifyProductApproval', value)}
              />
              <Divider />
              <SettingSwitch
                label="Sự cố hệ thống"
                description="Ưu tiên cảnh báo lỗi dịch vụ và hoạt động bất thường."
                checked={settings.notifySystemIncident}
                onChange={(value) => updateSetting('notifySystemIncident', value)}
                color="red"
              />
            </Stack>
          )}

          {activeTab === 'maintenance' && (
            <Stack>
              <div>
                <Title order={4}>Bảo trì hệ thống</Title>
                <Text size="sm" c="dimmed">Quản lý trạng thái vận hành và dữ liệu tạm của nền tảng.</Text>
              </div>
              <Divider />
              <Alert
                color="orange"
                variant="light"
                icon={<FiAlertTriangle size={18} />}
                title="Thao tác nhạy cảm"
              >
                Khi bật chế độ bảo trì, người dùng thông thường có thể không truy cập được hệ thống.
              </Alert>
              <SettingSwitch
                label="Chế độ bảo trì"
                description="Chỉ quản trị viên được phép tiếp tục truy cập hệ thống."
                checked={settings.maintenanceMode}
                onChange={(value) => updateSetting('maintenanceMode', value)}
                color="orange"
              />
              <Divider />
              <Group justify="space-between" align="center" wrap="nowrap">
                <div>
                  <Text size="sm" fw={600}>Xóa bộ nhớ đệm</Text>
                  <Text size="xs" c="dimmed" mt={3}>
                    Làm mới dữ liệu cache phía trình duyệt của trang quản trị.
                  </Text>
                </div>
                <Button
                  variant="default"
                  onClick={() => showSuccessNotification('Hoàn tất', 'Bộ nhớ đệm đã được làm mới.')}
                >
                  Xóa cache
                </Button>
              </Group>
            </Stack>
          )}
        </Paper>
      </div>

      <Modal opened={resetOpened} onClose={closeReset} title="Khôi phục cài đặt mặc định" centered>
        <Text size="sm">
          Toàn bộ thay đổi đã lưu trên trình duyệt sẽ bị xóa. Bạn có chắc muốn tiếp tục?
        </Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeReset}>Hủy</Button>
          <Button color="red" onClick={handleReset}>Khôi phục</Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default SystemSettings;
