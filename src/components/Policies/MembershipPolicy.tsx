import { Divider, List, Table, Text, Title } from "@mantine/core";

const MembershipPolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách thành viên
      </Title>
      <Text className="!mt-4 !leading-7">
        Chính sách thành viên quy định quyền lợi, trách nhiệm và điều kiện sử dụng tài khoản trên
        Hai Lee. Chính sách này áp dụng cho khách hàng mua sắm, người dùng có tài khoản, thành
        viên tham gia chương trình ưu đãi và người bán sử dụng các tính năng liên quan.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Đăng ký và quản lý tài khoản
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Người dùng cần cung cấp thông tin chính xác khi đăng ký, bao gồm họ tên, email, số điện thoại và thông tin xác minh nếu có.</List.Item>
        <List.Item>Mỗi người dùng nên sử dụng một tài khoản chính để quản lý đơn hàng, địa chỉ, ưu đãi và lịch sử giao dịch.</List.Item>
        <List.Item>Người dùng chịu trách nhiệm bảo mật mật khẩu, mã OTP, thiết bị đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.</List.Item>
        <List.Item>Hai Lee có thể yêu cầu xác minh thêm khi tài khoản có dấu hiệu bất thường hoặc cần bảo vệ quyền lợi giao dịch.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Hạng thành viên và quyền lợi
      </Title>
      <Table.ScrollContainer minWidth={560} className="!mt-3">
        <Table withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nội dung</Table.Th>
              <Table.Th>Cách áp dụng</Table.Th>
              <Table.Th>Lưu ý</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Ưu đãi thành viên</Table.Td>
              <Table.Td>Có thể dựa trên lịch sử mua hàng, chương trình khuyến mãi hoặc điều kiện hệ thống.</Table.Td>
              <Table.Td>Không quy đổi thành tiền mặt nếu chương trình không nêu rõ.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Tích lũy quyền lợi</Table.Td>
              <Table.Td>Có thể được ghi nhận sau khi đơn hàng hoàn tất và không phát sinh hoàn trả.</Table.Td>
              <Table.Td>Đơn bị hủy, hoàn tiền hoặc gian lận có thể không được tính.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Hỗ trợ tài khoản</Table.Td>
              <Table.Td>Thành viên có thể nhận hỗ trợ về đơn hàng, thanh toán, đổi trả và bảo mật.</Table.Td>
              <Table.Td>Cần cung cấp mã đơn hoặc thông tin xác minh khi được yêu cầu.</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Quy định sử dụng ưu đãi
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Mã giảm giá, điểm thưởng, voucher hoặc quyền lợi thành viên chỉ áp dụng theo điều kiện của từng chương trình.</List.Item>
        <List.Item>Ưu đãi có thể giới hạn theo thời gian, ngành hàng, shop, giá trị đơn, phương thức thanh toán hoặc khu vực giao hàng.</List.Item>
        <List.Item>Hai Lee có thể thu hồi ưu đãi nếu phát hiện đơn hàng bị hủy, hoàn trả, lạm dụng hoặc không đáp ứng điều kiện.</List.Item>
        <List.Item>Ưu đãi không được mua bán, chuyển nhượng hoặc sử dụng cho mục đích gian lận.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Hành vi không được phép
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Tạo nhiều tài khoản để lạm dụng khuyến mãi, hoàn tiền, đánh giá hoặc chương trình thành viên.</List.Item>
        <List.Item>Cung cấp thông tin giả, mạo danh người khác hoặc sử dụng trái phép tài khoản của bên thứ ba.</List.Item>
        <List.Item>Can thiệp hệ thống, khai thác lỗi, spam, quấy rối người bán hoặc gây ảnh hưởng đến trải nghiệm người dùng khác.</List.Item>
        <List.Item>Đặt hàng ảo, đánh giá không trung thực, tráo hàng, khiếu nại gian dối hoặc cố ý trục lợi từ chính sách.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Tạm khóa, giới hạn hoặc chấm dứt tài khoản
      </Title>
      <Text className="!mt-3 !leading-7">
        Hai Lee có thể tạm khóa, giới hạn tính năng, thu hồi ưu đãi hoặc chấm dứt tài khoản nếu
        phát hiện vi phạm chính sách, rủi ro bảo mật, tranh chấp nghiêm trọng hoặc yêu cầu từ cơ
        quan có thẩm quyền. Trong trường hợp phù hợp, người dùng có thể được yêu cầu cung cấp thêm
        thông tin để xác minh và khôi phục quyền sử dụng.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Rời chương trình thành viên
      </Title>
      <Text className="!mt-3 !leading-7">
        Người dùng có thể ngừng sử dụng tài khoản hoặc gửi yêu cầu hỗ trợ liên quan đến dữ liệu cá
        nhân theo chính sách bảo mật. Một số thông tin giao dịch vẫn có thể được lưu trong thời
        gian cần thiết để phục vụ kế toán, đối soát, giải quyết khiếu nại và tuân thủ quy định pháp luật.
      </Text>
    </div>
  );
};

export default MembershipPolicy;
