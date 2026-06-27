import {
  ActionIcon,
  Avatar,
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton
} from '@mantine/core';
import {
  FiChevronDown,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useAppRedux';
import { useAuth } from '../../../hooks/useAuth';
import { NoticeModal } from '../../noticeModal/NoticeModal';

const AdminHeader: React.FC<{ toggleSidebar: () => void, sidebarOpened: boolean }> = ({ toggleSidebar, sidebarOpened }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const userMenuItems = [
    { label: 'Hồ sơ của tôi', icon: <FiUser size={14} />, path: '/admin/profile' },
    { label: 'Cài đặt tài khoản', icon: <FiSettings size={14} />, path: '/admin/settings' },
    { label: 'Trợ giúp', icon: <FiHelpCircle size={14} />, path: '/admin/help' },
    { label: 'Quay lại cửa hàng', icon: <FiHome size={14} />, path: '/' },
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'MY_SHOP':
        return 'Chủ cửa hàng';
      case 'USER':
        return 'Người dùng';
      default:
        return role;
    }
  };

  return (
    <div className="sticky top-0 z-10">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo và nút menu cho mobile */}
          <div className="flex items-center">
            <Burger
              size="sm"
              opened={sidebarOpened}
              onClick={toggleSidebar}
              className="mr-2 md:hidden"
            />
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <img src="/images/logo.jfif" alt="Hai Lee" className="h-8 w-auto" />
              <div className="font-semibold text-xl">
                <span className="text-primary">Admin</span>
                <span className="text-slate-700">System</span>
              </div>
            </Link>
          </div>

          {/* Phần bên phải: tìm kiếm, thông báo và người dùng */}
          <Group gap="md">
            {/* Tìm kiếm */}
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="xl"
              aria-label="Tìm kiếm"
            >
              <FiSearch size={20} className="text-gray-700" />
            </ActionIcon>

            {/* Tin nhắn */}
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="xl"
              aria-label="Tin nhắn"
              component={Link}
              to="/admin/messages"
            >
              <FiMessageSquare size={20} className="text-gray-700" />
            </ActionIcon>

            {/* Thông báo */}
            <NoticeModal isShop={false} />

            {/* Menu người dùng */}
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full transition-colors">
                  <Avatar
                    src={user?.avatarUrl || undefined}
                    alt={user?.fullName}
                    size="md"
                    radius="xl"
                  >
                    {!user?.avatarUrl && user?.fullName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <Text size="sm" fw={500}>
                      {user?.fullName || user?.username || 'Admin User'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user?.role ? getRoleLabel(user.role) : 'Quản trị viên'}
                    </Text>
                  </div>
                  <FiChevronDown size={14} className="hidden md:block text-gray-500" />
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                {userMenuItems.map((item, index) => (
                  <Menu.Item
                    key={index}
                    leftSection={item.icon}
                    component={Link}
                    to={item.path}
                  >
                    {item.label}
                  </Menu.Item>
                ))}

                <Menu.Divider />

                <Menu.Item
                  leftSection={<FiLogOut size={14} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </header>
    </div>
  );
};

export default AdminHeader;
