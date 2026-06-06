import { Anchor, Container, Divider, Text, TextInput, Title } from "@mantine/core";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { Link, Outlet, useLocation } from "react-router-dom";

import { APP_ROUTES } from "../../constant";

const policyLinks = [
  { label: "Chính sách thử đồ ảo", path: APP_ROUTES.POLICY_TRY_ON },
  { label: "Chính sách đặt hàng", path: APP_ROUTES.POLICY_ORDER },
  { label: "Chính sách thanh toán", path: APP_ROUTES.POLICY_PAYMENT },
  { label: "Chính sách vận chuyển", path: APP_ROUTES.POLICY_SHIPPING },
  { label: "Chính sách đổi trả và hoàn tiền", path: APP_ROUTES.POLICY_REFUND },
  { label: "Chính sách bảo mật", path: APP_ROUTES.POLICY_PRIVACY },
  { label: "Chính sách cookie", path: APP_ROUTES.POLICY_COOKIES },
  { label: "Chính sách thành viên", path: APP_ROUTES.POLICY_MEMBERSHIP },
];

const PoliciesPage = () => {
  const location = useLocation();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const contentVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  return (
    <section className="bg-white">
      <Container size="lg" className="py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.header
            variants={itemVariants}
            className="sticky top-0 z-20 -mx-4 mb-8 flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:-mx-8 lg:px-8"
          >
            <Anchor component={Link} to={APP_ROUTES.HOME} underline="never" className="flex items-center gap-3">
              <span className="text-xl font-semibold text-gray-900">
                <span className="text-primary">Anreal</span> Shop
              </span>
            </Anchor>

            <TextInput
              className="w-full sm:w-80"
              placeholder="Tìm chính sách"
              aria-label="Tìm chính sách"
              size="sm"
              leftSection={<FiSearch size={16} className="text-gray-400" />}
            />
          </motion.header>

          <motion.div variants={itemVariants} className="mb-8">
            <Text size="sm" className="!text-gray-500 !mb-2">
              Trung tâm chính sách AnrealShop
            </Text>
            <Title order={1} className="!text-3xl md:!text-4xl !font-semibold !text-gray-900">
              Chính sách mua sắm
            </Title>
            <Text className="!mt-3 !text-gray-600 !leading-7 max-w-3xl">
              Các chính sách dưới đây giúp khách hàng và người bán hiểu rõ quy trình đặt hàng,
              thử đồ ảo, đổi trả và hoàn tiền khi sử dụng AnrealShop.
            </Text>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Divider className="!mb-8" />
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_minmax(0,1fr)]">
            <motion.aside
              variants={itemVariants}
              className="md:sticky md:top-24 md:self-start"
            >
              <Text size="sm" fw={700} className="!mb-3 !text-gray-900">
                Nội dung chính sách
              </Text>
              <nav className="flex flex-col gap-1">
                {policyLinks.map((link) => {
                  const isActive = location.pathname === link.path;

                  return (
                    <motion.div
                      key={link.path}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Anchor
                        component={Link}
                        to={link.path}
                        underline="never"
                        className={
                          [
                            "block rounded px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "!bg-gray-100 !text-gray-950 !font-semibold"
                              : "!text-gray-600 hover:!bg-gray-50 hover:!text-gray-900",
                          ].join(" ")
                        }
                      >
                        {link.label}
                      </Anchor>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.aside>

            <article className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </article>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default PoliciesPage;
