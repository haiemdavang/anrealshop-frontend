import { Divider, List, Table, Text, Title } from "@mantine/core";

const OrderPolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách đặt hàng, thanh toán và giao nhận
      </Title>
      <Text className="!mt-4 !leading-7">
        Chính sách này áp dụng cho mọi đơn hàng được tạo trên AnrealShop. Khi đặt hàng, khách
        hàng xác nhận đã kiểm tra thông tin sản phẩm, giá bán, phí vận chuyển, phương thức thanh
        toán và địa chỉ nhận hàng trước khi hoàn tất giao dịch.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Điều kiện tạo đơn hàng
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Khách hàng cần cung cấp họ tên, số điện thoại, địa chỉ nhận hàng và email chính xác.</List.Item>
        <List.Item>Sản phẩm phải còn hàng tại thời điểm hệ thống ghi nhận đơn.</List.Item>
        <List.Item>Thông tin phân loại như màu sắc, kích thước, số lượng phải được chọn trước khi thanh toán.</List.Item>
        <List.Item>AnrealShop có quyền yêu cầu xác minh thêm nếu đơn hàng có dấu hiệu bất thường hoặc thông tin giao nhận không đầy đủ.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Xác nhận đơn hàng
      </Title>
      <Text className="!mt-3 !leading-7">
        Sau khi khách hàng đặt hàng thành công, hệ thống sẽ ghi nhận đơn và gửi thông tin tới
        người bán. Đơn hàng chỉ được xem là đã xác nhận khi người bán hoặc hệ thống chấp nhận xử
        lý. Nếu sản phẩm hết hàng, sai giá do lỗi nhập liệu hoặc không thể giao đến khu vực nhận
        hàng, đơn có thể bị hủy và khoản thanh toán sẽ được hoàn theo chính sách hoàn tiền.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Giá bán, phí và khuyến mãi
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Giá hiển thị trên trang sản phẩm là giá bán tại thời điểm khách hàng xem sản phẩm.</List.Item>
        <List.Item>Tổng tiền đơn hàng có thể bao gồm giá sản phẩm, phí vận chuyển, phụ phí dịch vụ và khoản giảm giá nếu có.</List.Item>
        <List.Item>Mã giảm giá hoặc chương trình khuyến mãi chỉ áp dụng theo điều kiện hiển thị tại thời điểm đặt hàng.</List.Item>
        <List.Item>Nếu phát sinh sai lệch giá nghiêm trọng do lỗi hệ thống, AnrealShop sẽ thông báo cho khách hàng trước khi tiếp tục xử lý.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Phương thức thanh toán
      </Title>
      <Table.ScrollContainer minWidth={520} className="!mt-3">
        <Table withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Phương thức</Table.Th>
              <Table.Th>Thời điểm ghi nhận</Table.Th>
              <Table.Th>Lưu ý</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Thanh toán khi nhận hàng</Table.Td>
              <Table.Td>Khi khách hàng xác nhận đặt hàng</Table.Td>
              <Table.Td>Khách hàng thanh toán trực tiếp cho đơn vị giao hàng khi nhận sản phẩm.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Thanh toán trực tuyến</Table.Td>
              <Table.Td>Khi cổng thanh toán trả kết quả thành công</Table.Td>
              <Table.Td>Không chia sẻ mã OTP, mật khẩu hoặc thông tin thẻ cho bất kỳ bên nào.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Ví hoặc số dư tài khoản</Table.Td>
              <Table.Td>Khi hệ thống trừ số dư thành công</Table.Td>
              <Table.Td>Giao dịch có thể cần xác minh nếu tài khoản chưa hoàn tất bảo mật.</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Xử lý và giao hàng
      </Title>
      <Text className="!mt-3 !leading-7">
        Người bán chuẩn bị hàng sau khi đơn được xác nhận. Thời gian xử lý phụ thuộc vào loại sản
        phẩm, số lượng, lịch làm việc của shop và năng lực của đơn vị vận chuyển. Thời gian giao
        hàng dự kiến chỉ mang tính tham khảo và có thể thay đổi do thời tiết, địa chỉ xa, ngày lễ,
        yêu cầu kiểm tra bổ sung hoặc sự kiện bất khả kháng.
      </Text>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Khách hàng cần nghe điện thoại khi đơn vị vận chuyển liên hệ giao hàng.</List.Item>
        <List.Item>Địa chỉ nhận hàng nên có đầy đủ số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố.</List.Item>
        <List.Item>Nếu giao hàng không thành công nhiều lần do khách hàng không phản hồi, đơn có thể được hoàn về người bán.</List.Item>
        <List.Item>Khách hàng nên kiểm tra tình trạng gói hàng bên ngoài trước khi nhận.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Thay đổi hoặc hủy đơn
      </Title>
      <Text className="!mt-3 !leading-7">
        Khách hàng có thể yêu cầu hủy hoặc thay đổi đơn trước khi người bán bàn giao cho đơn vị
        vận chuyển. Sau khi đơn đã được giao cho vận chuyển, yêu cầu thay đổi địa chỉ, số điện
        thoại hoặc phân loại sản phẩm có thể không thực hiện được. Nếu khách hàng không còn nhu
        cầu nhận hàng, vui lòng thực hiện theo quy trình đổi trả hoặc từ chối nhận hàng theo hướng
        dẫn của hệ thống.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        7. Trách nhiệm của khách hàng
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Đọc kỹ mô tả, bảng kích thước, hình ảnh, đánh giá và chính sách riêng của sản phẩm trước khi mua.</List.Item>
        <List.Item>Không đặt hàng thử, đặt hộ không có sự đồng ý hoặc sử dụng thông tin người khác trái phép.</List.Item>
        <List.Item>Không lợi dụng chính sách hoàn tiền, khuyến mãi hoặc giao nhận để trục lợi.</List.Item>
        <List.Item>Bảo quản hóa đơn, mã đơn hàng, hình ảnh mở gói nếu cần khiếu nại.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        8. Khiếu nại đơn hàng
      </Title>
      <Text className="!mt-3 !leading-7">
        Khi phát sinh vấn đề về thiếu hàng, sai hàng, hàng hư hỏng hoặc trạng thái giao nhận không
        đúng thực tế, khách hàng nên gửi yêu cầu hỗ trợ kèm mã đơn hàng, hình ảnh/video mở gói và
        mô tả sự việc. AnrealShop sẽ phối hợp với người bán, đơn vị vận chuyển và cổng thanh toán
        để kiểm tra trong thời gian hợp lý.
      </Text>
    </div>
  );
};

export default OrderPolicy;
