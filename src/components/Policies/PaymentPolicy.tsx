import { Divider, List, Table, Text, Title } from "@mantine/core";

const PaymentPolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách thanh toán
      </Title>
      <Text className="!mt-4 !leading-7">
        Chính sách thanh toán mô tả các hình thức thanh toán được hỗ trợ trên AnrealShop, cách ghi
        nhận giao dịch, nguyên tắc bảo vệ thông tin thanh toán và hướng xử lý khi giao dịch lỗi,
        bị hủy hoặc cần hoàn tiền.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Phương thức thanh toán được hỗ trợ
      </Title>
      <Table.ScrollContainer minWidth={540} className="!mt-3">
        <Table withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Phương thức</Table.Th>
              <Table.Th>Trạng thái đơn</Table.Th>
              <Table.Th>Ghi chú</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Thanh toán khi nhận hàng</Table.Td>
              <Table.Td>Đơn được tạo sau khi khách xác nhận đặt hàng.</Table.Td>
              <Table.Td>Khách thanh toán cho đơn vị giao hàng khi nhận sản phẩm.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Thanh toán trực tuyến</Table.Td>
              <Table.Td>Đơn chỉ được ghi nhận thanh toán sau khi cổng thanh toán trả kết quả thành công.</Table.Td>
              <Table.Td>Có thể cần thêm thời gian đối soát nếu giao dịch bị treo hoặc gián đoạn.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Ví/số dư tài khoản</Table.Td>
              <Table.Td>Đơn được xử lý khi hệ thống trừ số dư thành công.</Table.Td>
              <Table.Td>Tài khoản có thể cần xác minh bảo mật trước khi sử dụng đầy đủ.</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Nguyên tắc xác nhận thanh toán
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Khách hàng cần kiểm tra tổng tiền, phí vận chuyển, ưu đãi và địa chỉ nhận hàng trước khi thanh toán.</List.Item>
        <List.Item>Giao dịch trực tuyến chỉ được xem là thành công khi hệ thống hoặc cổng thanh toán xác nhận thành công.</List.Item>
        <List.Item>Nếu khách hàng bị trừ tiền nhưng đơn chưa cập nhật, AnrealShop sẽ đối soát với cổng thanh toán trước khi xác nhận hoặc hoàn tiền.</List.Item>
        <List.Item>Khách hàng không nên chuyển khoản ngoài hệ thống, thanh toán vào tài khoản cá nhân hoặc làm theo hướng dẫn không thuộc kênh chính thức.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Bảo mật khi thanh toán
      </Title>
      <Text className="!mt-3 !leading-7">
        AnrealShop không yêu cầu khách hàng cung cấp mật khẩu ngân hàng, mã OTP, mã PIN, mã CVV
        hoặc thông tin đăng nhập ví điện tử qua chat, điện thoại hay email. Khách hàng cần tự bảo
        vệ thiết bị, tài khoản và thông tin xác thực cá nhân. Mọi yêu cầu thanh toán đáng ngờ nên
        được báo cho bộ phận hỗ trợ trước khi thực hiện.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Giao dịch lỗi hoặc bị hủy
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Nếu giao dịch thất bại, khách hàng có thể thử lại hoặc chọn phương thức thanh toán khác.</List.Item>
        <List.Item>Nếu giao dịch bị trừ tiền nhưng đơn chưa tạo, khoản tiền sẽ được kiểm tra và hoàn theo kết quả đối soát.</List.Item>
        <List.Item>Nếu đơn bị hủy sau khi đã thanh toán, khoản tiền hợp lệ sẽ được hoàn về phương thức thanh toán ban đầu hoặc ví/số dư theo quy trình.</List.Item>
        <List.Item>Thời gian hoàn tiền phụ thuộc vào ngân hàng, ví điện tử, cổng thanh toán và lịch làm việc của các bên liên quan.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Hóa đơn và chứng từ
      </Title>
      <Text className="!mt-3 !leading-7">
        Thông tin đơn hàng, lịch sử thanh toán, mã giao dịch và trạng thái hoàn tiền được lưu trong
        tài khoản của khách hàng nếu hệ thống hỗ trợ. Khi cần đối soát, khách hàng nên cung cấp mã
        đơn hàng, thời điểm thanh toán, số tiền, phương thức thanh toán và ảnh chụp thông báo giao
        dịch từ ngân hàng hoặc ví điện tử.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Phòng chống gian lận
      </Title>
      <Text className="!mt-3 !leading-7">
        AnrealShop có thể tạm giữ đơn hàng, yêu cầu xác minh hoặc từ chối giao dịch nếu phát hiện
        dấu hiệu bất thường như thanh toán từ nguồn không hợp lệ, lạm dụng khuyến mãi, giao dịch
        nhiều lần bất thường, tranh chấp không có căn cứ hoặc hành vi cố ý trục lợi.
      </Text>
    </div>
  );
};

export default PaymentPolicy;
