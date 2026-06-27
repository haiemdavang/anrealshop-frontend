import { Divider, List, Table, Text, Title } from "@mantine/core";

const ShippingPolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách vận chuyển và giao nhận
      </Title>
      <Text className="!mt-4 !leading-7">
        Chính sách vận chuyển quy định cách Hai Lee phối hợp với người bán và đơn vị giao hàng
        để xử lý đơn, bàn giao sản phẩm và hỗ trợ khách hàng trong quá trình nhận hàng. Thời gian
        và phí vận chuyển có thể thay đổi theo địa chỉ, khối lượng, kích thước kiện hàng và năng
        lực phục vụ của từng đơn vị vận chuyển.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Phạm vi giao hàng
      </Title>
      <Text className="!mt-3 !leading-7">
        Hai Lee hỗ trợ giao hàng tới các khu vực mà đối tác vận chuyển có thể phục vụ. Một số
        địa chỉ vùng sâu, vùng xa, khu vực hạn chế giao nhận, tòa nhà yêu cầu quy định riêng hoặc
        khu vực bị ảnh hưởng bởi thời tiết, dịch bệnh, thiên tai có thể cần thêm thời gian xử lý.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Thời gian xử lý và giao hàng dự kiến
      </Title>
      <Table.ScrollContainer minWidth={540} className="!mt-3">
        <Table withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Giai đoạn</Table.Th>
              <Table.Th>Nội dung</Table.Th>
              <Table.Th>Lưu ý</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Xác nhận đơn</Table.Td>
              <Table.Td>Người bán kiểm tra tồn kho, phân loại sản phẩm và thông tin đơn.</Table.Td>
              <Table.Td>Có thể chậm hơn vào ngày lễ hoặc khi đơn cần xác minh.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Đóng gói</Table.Td>
              <Table.Td>Sản phẩm được kiểm tra, đóng gói và tạo vận đơn.</Table.Td>
              <Table.Td>Sản phẩm cồng kềnh hoặc dễ vỡ có thể cần đóng gói riêng.</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Vận chuyển</Table.Td>
              <Table.Td>Đơn vị vận chuyển nhận hàng và giao tới địa chỉ khách hàng.</Table.Td>
              <Table.Td>Thời gian phụ thuộc tuyến giao, thời tiết và trạng thái giao nhận thực tế.</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Phí vận chuyển
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Phí vận chuyển được tính theo địa chỉ nhận hàng, địa chỉ shop, cân nặng, kích thước và chính sách của đơn vị vận chuyển.</List.Item>
        <List.Item>Phí hiển thị tại bước thanh toán là mức dự kiến tại thời điểm đặt hàng.</List.Item>
        <List.Item>Mã miễn phí vận chuyển, ưu đãi hoặc hỗ trợ phí ship chỉ áp dụng khi đơn hàng đáp ứng đủ điều kiện.</List.Item>
        <List.Item>Nếu kiện hàng bị chia thành nhiều gói, phí vận chuyển có thể được tính riêng theo từng gói hàng.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Trách nhiệm của khách hàng khi nhận hàng
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Cung cấp địa chỉ, số điện thoại và ghi chú giao hàng chính xác trước khi đơn được bàn giao vận chuyển.</List.Item>
        <List.Item>Giữ liên lạc khi shipper gọi giao hàng và chuẩn bị thanh toán nếu chọn hình thức thanh toán khi nhận hàng.</List.Item>
        <List.Item>Kiểm tra tình trạng bên ngoài của gói hàng trước khi nhận, đặc biệt với kiện bị móp, rách, ướt hoặc có dấu hiệu đã mở.</List.Item>
        <List.Item>Quay video mở gói nếu sản phẩm có giá trị cao, dễ vỡ hoặc cần bằng chứng khi khiếu nại.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Giao hàng không thành công
      </Title>
      <Text className="!mt-3 !leading-7">
        Đơn hàng có thể giao không thành công nếu khách hàng không nghe máy, địa chỉ không rõ,
        khu vực không thể tiếp cận, khách hẹn lại nhiều lần hoặc từ chối nhận hàng. Sau số lần
        giao theo quy định của đơn vị vận chuyển, kiện hàng có thể được hoàn về người bán. Các
        khoản phí phát sinh, nếu có, sẽ được xử lý theo chính sách vận chuyển và thanh toán hiện hành.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Mất hàng, hư hỏng hoặc sai trạng thái
      </Title>
      <Text className="!mt-3 !leading-7">
        Nếu trạng thái hiển thị đã giao nhưng khách hàng chưa nhận được hàng, hoặc kiện hàng bị
        hư hỏng trong quá trình vận chuyển, khách hàng nên liên hệ hỗ trợ càng sớm càng tốt kèm
        mã đơn, mã vận đơn, hình ảnh gói hàng và mô tả sự việc. Hai Lee sẽ phối hợp với người
        bán và đơn vị vận chuyển để đối soát.
      </Text>
    </div>
  );
};

export default ShippingPolicy;
