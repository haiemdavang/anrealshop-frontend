import {
  Button,
  CloseButton,
  Container,
  Divider,
  Flex,
  Group,
  Input,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiUser } from "react-icons/bi";
import { FaSearch, FaShoppingBag, FaStore } from "react-icons/fa";
import {
  FiHeart,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiUser,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constant";
import { useAppSelector } from "../../hooks/useAppRedux";
import { useAuth } from "../../hooks/useAuth";
import HeaderMobile from "./HeaderMobile";
import SuggestSearch from "../header/SuggestSearch";
import showSuccessNotification from "../Toast/NotificationSuccess";

// Dữ liệu danh mục
const POPULAR_CATEGORIES = [
  { name: "Điện thoại", slug: "dien-thoai" },
  { name: "Laptop", slug: "laptop" },
  { name: "Thời trang nam", slug: "thoi-trang-nam" },
  { name: "Thời trang nữ", slug: "thoi-trang-nu" },
  { name: "Đồng hồ", slug: "dong-ho" },
  { name: "Đồng hồ", slug: "dong-ho" },
  { name: "Đồng hồ", slug: "dong-ho" },
];

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);


  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside để ẩn gợi ý tìm kiếm
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setShowSuggestions(false);
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("q")) {
      searchParams.delete("q");
      const newSearch = searchParams.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`, { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Lưu vào local storage nếu cần
      const recentSearches = JSON.parse(
        localStorage.getItem("recentSearches") || "[]"
      );
      if (!recentSearches.includes(searchValue.trim())) {
        recentSearches.unshift(searchValue.trim());
        if (recentSearches.length > 5) recentSearches.pop();
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
      }

      // Chuyển đến trang kết quả tìm kiếm
      navigate(`/products?q=${encodeURIComponent(searchValue)}`);
    }
    setShowSuggestions(false);
  };

  const handleOpenCart = () => {
    if (!isAuthenticated)
      showSuccessNotification(
        "Thông báo",
        "Đăng nhập để thực hiện chức năng nhé"
      );
    else navigate(APP_ROUTES.CART);
  };

  return (
    <motion.header
      className="bg-white shadow-sm py-3 backdrop-blur-md"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      style={{zIndex: 1}}
    >
      <Container size="xl">
        {/* Main header row */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              to="/"
              className="flex items-center gap-2 no-underline transition-transform duration-300 hover:scale-105"
            >
              <div className={`font-bold ${isMobile ? "text-lg" : "text-2xl"}`}>
                <span className="text-primary">Anreal</span>
                <span className="text-contentText">Shop</span>
              </div>
            </Link>
          </motion.div>

          {/* Search bar - Hidden on mobile, shown in drawer */}
          {!isMobile && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className={`flex-grow ${
                isTablet ? "max-w-[45%]" : "max-w-[50%]"
              }`}
            >
              <Stack gap={4}>
                <div className="relative" ref={searchContainerRef}>
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      size={isTablet ? "sm" : "md"}
                      radius="md"
                      className="w-full flex items-center gap-4 text-sm"
                      placeholder="Nhập từ khóa tìm kiếm..."
                      classNames={{
                        input: "placeholder:text-sm text-sm text-contentText",
                      }}
                      value={searchValue}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      rightSectionPointerEvents="all"
                      leftSection={
                        <FaSearch size={16} className="text-gray-400" />
                      }
                      rightSectionWidth={isTablet ? 100 : 144}
                      rightSection={
                        <div className="flex gap-1 items-center">
                          <CloseButton
                            size="sm"
                            className={`cursor-pointer ${
                              searchValue ? "visible" : "invisible"
                            }`}
                            aria-label="Clear input"
                            onClick={handleClearSearch}
                          />
                          <Divider size={"2"} orientation="vertical" />
                          <Button
                            variant="subtle"
                            radius="md"
                            type="submit"
                            size={isTablet ? "xs" : "sm"}
                          >
                            {isTablet ? <FaSearch size={14} /> : "Tìm kiếm"}
                          </Button>
                        </div>
                      }
                    />
                  </form>

                  {/* Gợi ý tìm kiếm */}
                  <SuggestSearch
                    searchTerm={searchValue}
                    visible={showSuggestions}
                    onSelect={() => setShowSuggestions(false)}
                  />
                </div>

                {/* Danh mục phổ biến - Hidden on tablet */}
                {!isTablet && (
                  <Flex justify="start">
                    <Group className="flex-wrap" gap="xs">
                      {POPULAR_CATEGORIES.slice(0, 5).map((category, index) => (
                        <Link
                          key={index}
                          to={`/category/${category.slug}`}
                          className="no-underline"
                        >
                          <Text
                            size="sm"
                            className="!text-gray-600 hover:!text-primary transition-colors px-1"
                          >
                            {category.name}
                          </Text>
                        </Link>
                      ))}
                    </Group>
                  </Flex>
                )}
              </Stack>
            </motion.div>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Stack gap="xs" className="flex items-center">
                <Group
                  gap={isTablet ? "sm" : "lg"}
                  className="flex mt-4 !justify-end items-center"
                >
                  {/* Home button */}
                  {location.pathname !== APP_ROUTES.HOME && !isTablet && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UnstyledButton
                        className="flex gap-2 hover:text-primary transition-colors"
                        component={Link}
                        to={APP_ROUTES.HOME}
                      >
                        <FiHome size={18} />
                        <Text size="sm">Trang chủ</Text>
                      </UnstyledButton>
                    </motion.div>
                  )}

                  {/* Account button with dropdown */}
                  <Menu
                    withArrow
                    trigger="hover"
                    openDelay={100}
                    closeDelay={200}
                    position="bottom-end"
                    shadow="md"
                    onOpen={() => setIsMenuOpen(true)}
                    onClose={() => setIsMenuOpen(false)}
                  >
                    <Menu.Target>
                      <UnstyledButton className="flex items-center gap-2 text-contentText hover:text-primary transition-colors">
                        <FiUser size={18} />
                        {!isTablet && <Text size="sm">Tài khoản</Text>}
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isAuthenticated ? (
                              <>
                                <Menu.Item
                                  leftSection={<BiUser size={16} />}
                                  component={Link}
                                  to={APP_ROUTES.USER_PROFILE}
                                >
                                  Thông tin tài khoản
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<FiPackage size={16} />}
                                  component={Link}
                                  to="/settings/orders"
                                >
                                  Đơn hàng của tôi
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<FiHeart size={16} />}
                                  component={Link}
                                  to="/settings/wishlist"
                                >
                                  Sản phẩm yêu thích
                                </Menu.Item>
                                <Menu.Divider />
                                {user?.hasShop ? (
                                  <Menu.Item
                                    component={Link}
                                    to={APP_ROUTES.MYSHOP.BASE}
                                    leftSection={<FaStore size={14} />}
                                  >
                                    Quản lý cửa hàng
                                  </Menu.Item>
                                ) : (
                                  <Menu.Item
                                    component={Link}
                                    to={APP_ROUTES.SHOP_REGISTER}
                                    leftSection={<FaStore size={14} />}
                                  >
                                    Đăng ký cửa hàng
                                  </Menu.Item>
                                )}

                                <Menu.Divider />
                                <Menu.Item
                                  leftSection={<FiLogOut size={16} />}
                                  color="red"
                                  onClick={handleLogout}
                                >
                                  <Text size="sm">Đăng xuất</Text>
                                </Menu.Item>
                              </>
                            ) : (
                              <>
                                <Menu.Item
                                  leftSection={<FiLogIn size={16} />}
                                  component={Link}
                                  to="/login"
                                >
                                  <Text size="sm">Đăng nhập</Text>
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<BiUser size={16} />}
                                  component={Link}
                                  to="/register"
                                >
                                  <Text size="sm">Đăng ký</Text>
                                </Menu.Item>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Menu.Dropdown>
                  </Menu>
                  <Divider size={"2"} orientation="vertical" />
                  {/* Cart button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UnstyledButton
                      className="flex items-center gap-2 mr-4 text-contentText hover:text-primary transition-colors"
                      onClick={handleOpenCart}
                    >
                      <div className="relative">
                        <FaShoppingBag size={18} />
                        <motion.span
                          className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                        >
                          {user?.cartCount || 0}
                        </motion.span>
                      </div>
                    </UnstyledButton>
                  </motion.div>
                </Group>
                {/* Address section - Hidden on tablet */}
                {!isTablet && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <Flex className="mt-1 mb-1 mr-2" justify="flex-end">
                      <Group gap="xs" className="text-gray-600 items-center">
                        {isAuthenticated ? (
                          <>
                            <FiMapPin size={14} />
                            {user?.address ? (
                              <Text size="sm">
                                Giao đến:{" "}
                                <Text
                                  component="span"
                                  size="sm"
                                  fw={600}
                                  className="hover:text-primary cursor-pointer"
                                >
                                  {user?.address?.districtName +
                                    ", " +
                                    user?.address?.provinceName ||
                                    "Nho cap nhat dia chi nhe"}
                                </Text>
                              </Text>
                            ) : (
                              <Text
                                size="sm"
                                className="hover:text-primary cursor-pointer"
                              >
                                Tạo địa chỉ mới
                              </Text>
                            )}
                          </>
                        ) : (
                          <Text size="sm">Đăng nhập để xem địa chỉ...</Text>
                        )}
                      </Group>
                    </Flex>
                  </motion.div>
                )}
              </Stack>
            </motion.div>
          )}

          {/* Mobile: HeaderMobile Component */}
          {isMobile && <HeaderMobile />}
        </div>

      </Container>
    </motion.header>
  );
};

export default Header;
