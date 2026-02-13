import {
    Box,
    Burger,
    CloseButton,
    Divider,
    Drawer,
    Group,
    Input,
    Stack,
    Text,
    UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { FaSearch, FaShoppingBag, FaStore } from 'react-icons/fa';
import {
    FiHeart,
    FiHome,
    FiLogIn,
    FiLogOut,
    FiMapPin,
    FiPackage,
    FiSettings,
    FiUser,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constant';
import { useAppSelector } from '../../hooks/useAppRedux';
import { useAuth } from '../../hooks/useAuth';
import showSuccessNotification from '../Toast/NotificationSuccess';
import SuggestSearch from './SuggestSearch';

const HeaderMobile: React.FC = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const { handleLogout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setShowSuggestions(true);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setShowSuggestions(false);
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('q')) {
            searchParams.delete('q');
            const newSearch = searchParams.toString();
            navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            if (!recentSearches.includes(searchValue.trim())) {
                recentSearches.unshift(searchValue.trim());
                if (recentSearches.length > 5) recentSearches.pop();
                localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            }
            navigate(`/products?q=${encodeURIComponent(searchValue)}`);
        }
        setShowSuggestions(false);
    };

    const handleOpenCart = () => {
        if (!isAuthenticated)
            showSuccessNotification('Thông báo', 'Đăng nhập để thực hiện chức năng nhé');
        else navigate(APP_ROUTES.CART);
    };

    return (
        <>
            {/* Mobile Header Bar */}
            <Group gap="sm" className="flex-shrink-0">
                <UnstyledButton
                    onClick={handleOpenCart}
                    className="relative text-contentText hover:text-primary transition-colors"
                >
                    <FaShoppingBag size={20} />
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {user?.cartCount || 0}
                    </span>
                </UnstyledButton>
                <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" />
            </Group>

            {/* Mobile Search Bar */}
            <Box mt="md">
                <form onSubmit={handleSearchSubmit}>
                    <Input
                        size="sm"
                        radius="md"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(true)}
                        leftSection={<FaSearch size={14} className="text-gray-400" />}
                        rightSectionPointerEvents="all"
                        rightSection={
                            searchValue && (
                                <CloseButton size="sm" onClick={handleClearSearch} />
                            )
                        }
                    />
                </form>
                <div className="relative">
                    <SuggestSearch
                        searchTerm={searchValue}
                        visible={showSuggestions}
                        onSelect={() => setShowSuggestions(false)}
                    />
                </div>
            </Box>

            {/* Mobile Drawer Menu */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                position="right"
                size="80%"
                padding="md"
                title={
                    <Text fw={600} size="lg">
                        Menu
                    </Text>
                }
            >
                <Stack gap="md">
                    {/* User Address */}
                    {isAuthenticated && user?.address && (
                        <Box className="bg-gray-50 p-3 rounded-lg">
                            <Group gap="xs" className="text-gray-600">
                                <FiMapPin size={14} />
                                <Text size="sm">
                                    {user?.address?.districtName}, {user?.address?.provinceName}
                                </Text>
                            </Group>
                        </Box>
                    )}

                    {/* Home */}
                    {location.pathname !== APP_ROUTES.HOME && (
                        <UnstyledButton
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                            component={Link}
                            to={APP_ROUTES.HOME}
                            onClick={closeDrawer}
                        >
                            <FiHome size={20} />
                            <Text>Trang chủ</Text>
                        </UnstyledButton>
                    )}

                    <Divider />

                    {/* Account Options */}
                    {isAuthenticated ? (
                        <>
                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                component={Link}
                                to={APP_ROUTES.USER_PROFILE}
                                onClick={closeDrawer}
                            >
                                <FiUser size={20} />
                                <Text>Thông tin tài khoản</Text>
                            </UnstyledButton>

                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                component={Link}
                                to="/settings/orders"
                                onClick={closeDrawer}
                            >
                                <FiPackage size={20} />
                                <Text>Đơn hàng của tôi</Text>
                            </UnstyledButton>

                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                component={Link}
                                to="/settings/wishlist"
                                onClick={closeDrawer}
                            >
                                <FiHeart size={20} />
                                <Text>Sản phẩm yêu thích</Text>
                            </UnstyledButton>

                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                component={Link}
                                to="/settings/addresses"
                                onClick={closeDrawer}
                            >
                                <FiMapPin size={20} />
                                <Text>Địa chỉ giao hàng</Text>
                            </UnstyledButton>

                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                component={Link}
                                to={APP_ROUTES.USER_SECURITY}
                                onClick={closeDrawer}
                            >
                                <FiSettings size={20} />
                                <Text>Cài đặt bảo mật</Text>
                            </UnstyledButton>

                            <Divider />

                            {user?.hasShop ? (
                                <UnstyledButton
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                    component={Link}
                                    to={APP_ROUTES.MYSHOP.BASE}
                                    onClick={closeDrawer}
                                >
                                    <FaStore size={20} />
                                    <Text>Quản lý cửa hàng</Text>
                                </UnstyledButton>
                            ) : (
                                <UnstyledButton
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                    component={Link}
                                    to={APP_ROUTES.SHOP_REGISTER}
                                    onClick={closeDrawer}
                                >
                                    <FaStore size={20} />
                                    <Text>Đăng ký cửa hàng</Text>
                                </UnstyledButton>
                            )}

                            <Divider />

                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg text-red-600"
                                onClick={() => {
                                    handleLogout();
                                    closeDrawer();
                                }}
                            >
                                <FiLogOut size={20} />
                                <Text>Đăng xuất</Text>
                            </UnstyledButton>
                        </>
                    ) : (
                        <>
                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                component={Link}
                                to="/login"
                                onClick={closeDrawer}
                            >
                                <FiLogIn size={20} />
                                <Text>Đăng nhập</Text>
                            </UnstyledButton>

                            <UnstyledButton
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                component={Link}
                                to="/register"
                                onClick={closeDrawer}
                            >
                                <BiUser size={20} />
                                <Text>Đăng ký</Text>
                            </UnstyledButton>
                        </>
                    )}

                    <Divider />
                </Stack>
            </Drawer>
        </>
    );
};

export default HeaderMobile;
