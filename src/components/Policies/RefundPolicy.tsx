import { Divider, List, Table, Text, Title } from "@mantine/core";

const RefundPolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách đổi trả, hoàn tiền và khiếu nại
      </Title>
      <Text className="!mt-4 !leading-7">
        Chính sách này quy định các trường hợp khách hàng có thể yêu cầu đổi trả, hoàn tiền hoặc
        khiếu nại sau khi mua hàng trên AnrealShop. Mục tiêu là bảo vệ quyền lợi chính đáng của
        khách hàng, đồng thời đảm bảo người bán có đủ căn cứ để xử lý minh bạch.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Thời hạn gửi yêu cầu
      </Title>
      <Text className="!mt-3 !leading-7">
        Khách hàng nên gửi yêu cầu đổi trả hoặc hoàn tiền trong vòng 03 ngày kể từ khi trạng thái
        đơn hàng được cập nhật là đã giao thành công. Với sản phẩm lỗi kỹ thuật hoặc lỗi khó phát
        hiện ngay khi mở gói, thời hạn có thể được xem xét theo chính sách bảo hành hoặc cam kết
        riêng của người bán.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Trường hợp được hỗ trợ đổi trả
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Sản phẩm bị hư hỏng, bể vỡ, rách, bẩn hoặc biến dạng trước khi khách hàng nhận.</List.Item>
        <List.Item>Sản phẩm giao sai mẫu, sai màu, sai kích thước, sai phân loại hoặc thiếu phụ kiện so với đơn hàng.</List.Item>
        <List.Item>Sản phẩm không đúng mô tả chính: chất liệu, thông số, tình trạng, công năng hoặc thương hiệu.</List.Item>
        <List.Item>Sản phẩm đã qua sử dụng nhưng được mô tả là mới, hoặc có dấu hiệu không đúng cam kết của người bán.</List.Item>
        <List.Item>Đơn hàng bị giao thiếu số lượng, giao nhầm sản phẩm hoặc không nhận được hàng dù trạng thái hiển thị đã giao.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Trường hợp có thể bị từ chối
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Sản phẩm đã qua sử dụng, giặt, sửa, làm bẩn, làm mất tem nhãn hoặc mất phụ kiện đi kèm.</List.Item>
        <List.Item>Khách hàng chọn sai kích thước, màu sắc, địa chỉ hoặc thay đổi ý định nhưng sản phẩm không hỗ trợ đổi trả theo nhu cầu cá nhân.</List.Item>
        <List.Item>Yêu cầu gửi quá thời hạn và không có lý do hợp lệ.</List.Item>
        <List.Item>Không cung cấp được hình ảnh, video, mã đơn hàng hoặc bằng chứng cần thiết để đối chiếu.</List.Item>
        <List.Item>Sản phẩm thuộc nhóm không áp dụng đổi trả vì lý do vệ sinh, cá nhân hóa, đặt may riêng hoặc đã được thông báo rõ trước khi mua.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Điều kiện sản phẩm khi hoàn trả
      </Title>
      <Text className="!mt-3 !leading-7">
        Sản phẩm hoàn trả cần được đóng gói cẩn thận, còn đầy đủ hộp, túi, tem, nhãn, phụ kiện,
        quà tặng kèm và chứng từ nếu có. Khách hàng không nên tự ý gửi hàng về khi chưa có hướng
        dẫn từ hệ thống hoặc bộ phận hỗ trợ, vì việc gửi sai địa chỉ có thể làm kéo dài thời gian
        xử lý.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Quy trình xử lý yêu cầu
      </Title>
      <Table.ScrollContainer minWidth={560} className="!mt-3">
        <Table withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Bước</Table.Th>
              <Table.Th>Nội dung xử lý</Table.Th>
              <Table.Th>Thông tin cần chuẩn bị</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>1</Table.Td>
              <Table.Td>Gửi yêu cầu đổi trả hoặc hoàn tiền trên hệ thống.</Table.Td>
              <Table.Td>Mã đơn hàng, lý do yêu cầu, mô tả vấn đề.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>2</Table.Td>
              <Table.Td>AnrealShop và người bán kiểm tra bằng chứng.</Table.Td>
              <Table.Td>Ảnh sản phẩm, ảnh bao bì, video mở gói nếu có.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>3</Table.Td>
              <Table.Td>Khách hàng gửi trả hàng theo hướng dẫn nếu yêu cầu hợp lệ.</Table.Td>
              <Table.Td>Mã vận đơn hoàn trả, tình trạng đóng gói.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>4</Table.Td>
              <Table.Td>Hoàn tiền, đổi sản phẩm hoặc từ chối kèm lý do.</Table.Td>
              <Table.Td>Tài khoản nhận tiền hoặc phương thức thanh toán ban đầu.</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Phí vận chuyển hoàn trả
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Nếu lỗi thuộc về người bán, sản phẩm hoặc quá trình vận chuyển, khách hàng sẽ được hỗ trợ phí hoàn trả theo hướng dẫn của hệ thống.</List.Item>
        <List.Item>Nếu khách hàng đổi trả vì nhu cầu cá nhân và sản phẩm có hỗ trợ đổi trả, khách hàng có thể cần tự thanh toán phí vận chuyển phát sinh.</List.Item>
        <List.Item>Trường hợp hai bên có thỏa thuận riêng, chi phí sẽ được xử lý theo thỏa thuận được ghi nhận trên hệ thống hoặc kênh hỗ trợ chính thức.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        7. Phương thức và thời gian hoàn tiền
      </Title>
      <Text className="!mt-3 !leading-7">
        Khoản hoàn tiền thường được trả về phương thức thanh toán ban đầu hoặc ví/số dư tài khoản
        trên AnrealShop tùy trạng thái giao dịch. Thời gian ghi nhận phụ thuộc vào cổng thanh toán,
        ngân hàng, ví điện tử và lịch làm việc của các bên liên quan. Nếu đơn hàng có sử dụng mã
        giảm giá, điểm thưởng hoặc ưu đãi, giá trị hoàn có thể được tính theo số tiền thực thanh
        toán sau khuyến mãi.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        8. Hoàn tiền một phần
      </Title>
      <Text className="!mt-3 !leading-7">
        Với đơn hàng gồm nhiều sản phẩm, AnrealShop có thể hỗ trợ hoàn tiền một phần cho sản phẩm
        lỗi, thiếu hoặc không đúng mô tả mà không cần hủy toàn bộ đơn. Phí vận chuyển, mã giảm giá
        và ưu đãi đi kèm sẽ được phân bổ theo quy định hệ thống tại thời điểm xử lý.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        9. Gian lận và lạm dụng chính sách
      </Title>
      <Text className="!mt-3 !leading-7">
        AnrealShop có quyền từ chối hỗ trợ, tạm khóa tính năng hoặc chuyển thông tin cho bên có
        thẩm quyền nếu phát hiện hành vi tráo hàng, cố ý làm hư hỏng sản phẩm, gửi bằng chứng
        giả, tạo nhiều tài khoản để trục lợi hoặc lợi dụng quy trình hoàn tiền.
      </Text>
    </div>
  );
};

export default RefundPolicy;
