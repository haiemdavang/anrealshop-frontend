import { Divider, List, Table, Text, Title } from "@mantine/core";

const CookiePolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách cookie
      </Title>
      <Text className="!mt-4 !leading-7">
        Chính sách cookie giải thích cách AnrealShop sử dụng cookie, bộ nhớ cục bộ và các công
        nghệ tương tự để duy trì phiên đăng nhập, ghi nhớ lựa chọn của người dùng, cải thiện hiệu
        năng, đo lường hoạt động và bảo vệ hệ thống khỏi hành vi gian lận.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Cookie là gì
      </Title>
      <Text className="!mt-3 !leading-7">
        Cookie là tệp dữ liệu nhỏ được trình duyệt lưu trên thiết bị khi người dùng truy cập
        website. Ngoài cookie, AnrealShop có thể sử dụng local storage, session storage, token
        trình duyệt hoặc mã nhận diện kỹ thuật tương tự để cung cấp trải nghiệm ổn định và an toàn.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Các loại cookie có thể sử dụng
      </Title>
      <Table.ScrollContainer minWidth={560} className="!mt-3">
        <Table withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Loại</Table.Th>
              <Table.Th>Mục đích</Table.Th>
              <Table.Th>Ví dụ sử dụng</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Cookie cần thiết</Table.Td>
              <Table.Td>Duy trì đăng nhập, bảo mật phiên và vận hành chức năng cơ bản.</Table.Td>
              <Table.Td>Giỏ hàng, phiên đăng nhập, chống giả mạo yêu cầu.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Cookie tùy chọn</Table.Td>
              <Table.Td>Ghi nhớ lựa chọn để cá nhân hóa trải nghiệm.</Table.Td>
              <Table.Td>Ngôn ngữ, địa chỉ mặc định, tùy chọn hiển thị.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Cookie phân tích</Table.Td>
              <Table.Td>Đo lường hiệu năng, phát hiện lỗi và cải thiện sản phẩm.</Table.Td>
              <Table.Td>Trang đã xem, thời gian tải, thao tác tìm kiếm.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Cookie bảo mật</Table.Td>
              <Table.Td>Nhận diện hoạt động bất thường và giảm rủi ro gian lận.</Table.Td>
              <Table.Td>Thiết bị đăng nhập, tần suất yêu cầu, dấu hiệu spam.</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Mục đích sử dụng
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Giữ trạng thái đăng nhập và giúp người dùng không phải nhập lại thông tin nhiều lần.</List.Item>
        <List.Item>Lưu giỏ hàng, sản phẩm đã xem, tùy chọn giao diện và một số thiết lập tài khoản.</List.Item>
        <List.Item>Đo lường chất lượng dịch vụ, tốc độ tải trang, lỗi hiển thị và hiệu quả tính năng.</List.Item>
        <List.Item>Phát hiện truy cập bất thường, tự động hóa độc hại, spam hoặc hành vi có rủi ro bảo mật.</List.Item>
        <List.Item>Hỗ trợ cá nhân hóa nội dung, gợi ý sản phẩm và cải thiện trải nghiệm mua sắm.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Cookie của bên thứ ba
      </Title>
      <Text className="!mt-3 !leading-7">
        Một số đối tác như cổng thanh toán, dịch vụ đăng nhập, công cụ phân tích hoặc nhà cung cấp
        hạ tầng có thể đặt cookie riêng khi người dùng sử dụng tính năng liên quan. Việc sử dụng
        cookie của các bên này chịu sự điều chỉnh bởi chính sách riêng của họ và chỉ được tích hợp
        trong phạm vi cần thiết cho hoạt động của AnrealShop.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Quản lý cookie
      </Title>
      <Text className="!mt-3 !leading-7">
        Người dùng có thể xóa hoặc chặn cookie trong cài đặt trình duyệt. Tuy nhiên, nếu tắt cookie
        cần thiết, một số chức năng như đăng nhập, thêm vào giỏ hàng, thanh toán, lưu tùy chọn hoặc
        bảo mật phiên có thể hoạt động không chính xác.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Thời gian lưu trữ
      </Title>
      <Text className="!mt-3 !leading-7">
        Cookie phiên thường hết hạn khi người dùng đóng trình duyệt hoặc đăng xuất. Cookie lâu dài
        có thể được lưu trong một khoảng thời gian nhất định để ghi nhớ tùy chọn và nâng cao bảo
        mật. AnrealShop có thể thay đổi thời gian lưu trữ theo nhu cầu vận hành và yêu cầu pháp lý.
      </Text>
    </div>
  );
};

export default CookiePolicy;
