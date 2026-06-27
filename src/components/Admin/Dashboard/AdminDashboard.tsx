import { CompositeChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Progress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiTrendingUp,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../../constant';
import {
  ADMIN_DASHBOARD_STATS,
  ADMIN_PENDING_TASKS,
  ADMIN_RECENT_ACTIVITIES,
  ADMIN_REVENUE_DATA,
} from './data';

const AdminDashboard = () => {
  return (
    <Box>

      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md" mb="md">
        {ADMIN_DASHBOARD_STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <Paper withBorder radius="md" p="md" className="h-full hover:shadow-md transition-shadow">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <div>
                    <Text size="sm" c="dimmed" fw={500}>
                      {stat.label}
                    </Text>
                    <Text size="xl" fw={700} mt={6} className="text-slate-800">
                      {stat.value}
                    </Text>
                    <Text size="xs" mt={6} className={stat.color}>
                      {stat.change}
                    </Text>
                  </div>
                  <ThemeIcon
                    size={42}
                    radius="md"
                    variant="transparent"
                    className={`${stat.background} ${stat.color}`}
                  >
                    <Icon size={21} />
                  </ThemeIcon>
                </Group>
              </Paper>
            </motion.div>
          );
        })}
      </SimpleGrid>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <Paper withBorder radius="md" p="md" className="min-w-0 overflow-hidden">
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={600}>Doanh thu và đơn hàng</Text>
              <Text size="xs" c="dimmed">
                Thống kê hoạt động trong 7 ngày gần nhất
              </Text>
            </div>
            <Group gap={6}>
              <FiTrendingUp size={16} className="text-emerald-600" />
              <Text size="sm" fw={600} className="text-emerald-600">
                +12,5%
              </Text>
            </Group>
          </Group>

          <CompositeChart
            h={270}
            w="100%"
            data={ADMIN_REVENUE_DATA}
            dataKey="day"
            series={[
              {
                name: 'revenue',
                label: 'Doanh thu (triệu ₫)',
                color: 'blue.6',
                type: 'bar',
                yAxisId: 'left',
              },
              {
                name: 'orders',
                label: 'Đơn hàng',
                color: 'cyan.6',
                type: 'line',
                yAxisId: 'right',
              },
            ]}
            curveType="monotone"
            withLegend
            withDots
            withRightYAxis
            gridAxis="xy"
            tickLine="none"
            maxBarWidth={44}
            yAxisProps={{
              width: 58,
              tickFormatter: (value) => `${value}tr`,
            }}
            rightYAxisProps={{
              width: 42,
              tickFormatter: (value) => String(value),
            }}
            barProps={{ radius: [5, 5, 0, 0] }}
          />
        </Paper>

        <Paper withBorder radius="md" p="md">
          <Text fw={600}>Công việc cần xử lý</Text>
          <Text size="xs" c="dimmed" mb="lg">
            Các yêu cầu đang chờ quản trị viên
          </Text>

          <Stack gap="lg">
            {ADMIN_PENDING_TASKS.map((task) => {
              const Icon = task.icon;
              return (
                <Box key={task.label}>
                  <Group justify="space-between" mb={7} wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                      <ThemeIcon color={task.color} variant="light" size="md" radius="md">
                        <Icon size={15} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={600}>
                          {task.label}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {task.count} yêu cầu
                        </Text>
                      </div>
                    </Group>
                    <Button
                      component={Link}
                      to={task.path}
                      variant="subtle"
                      size="compact-xs"
                      rightSection={<FiArrowRight size={13} />}
                    >
                      Xử lý
                    </Button>
                  </Group>
                  <Progress value={task.progress} color={task.color} size="xs" radius="xl" />
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </div>

      <Paper withBorder radius="md" p="md" mt="md">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600}>Hoạt động gần đây</Text>
            <Text size="xs" c="dimmed">
              Những cập nhật mới nhất trong hệ thống
            </Text>
          </div>
          <Button
            component={Link}
            to={APP_ROUTES.ADMIN.REPORTS}
            variant="subtle"
            size="xs"
            rightSection={<FiArrowRight size={13} />}
          >
            Xem báo cáo
          </Button>
        </Group>

        <ScrollArea>
          <Table verticalSpacing="sm" horizontalSpacing="md" miw={720}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Hoạt động</Table.Th>
                <Table.Th>Nhóm</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th>Thời gian</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ADMIN_RECENT_ACTIVITIES.map((activity) => {
                const Icon = activity.icon;
                const pending = activity.status === 'Đang chờ';
                return (
                  <Table.Tr key={activity.id}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <ThemeIcon color={activity.color} variant="light" size="md" radius="xl">
                          <Icon size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="sm" fw={500}>
                            {activity.content}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {activity.id}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{activity.type}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={pending ? 'orange' : 'green'} variant="light">
                        {activity.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {activity.time}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
