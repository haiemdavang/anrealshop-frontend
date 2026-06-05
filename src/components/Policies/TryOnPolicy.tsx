import { Divider, List, Text, Title } from "@mantine/core";

const TryOnPolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách sử dụng tính năng thử đồ ảo
      </Title>
      <Text className="!mt-4 !leading-7">
        Tính năng thử đồ ảo của AnrealShop giúp khách hàng hình dung sản phẩm khi mặc hoặc phối
        trên ảnh/camera. Kết quả hiển thị chỉ mang tính tham khảo, không thay thế việc đọc kỹ mô
        tả sản phẩm, bảng kích thước, chất liệu và đánh giá thực tế trước khi mua.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Phạm vi áp dụng
      </Title>
      <Text className="!mt-3 !leading-7">
        Chính sách này áp dụng cho mọi thao tác tải ảnh, chụp ảnh, sử dụng camera, phân tích dáng
        người, ghép thử sản phẩm và xem kết quả thử đồ ảo trên AnrealShop. Một số sản phẩm có thể
        chưa hỗ trợ thử đồ ảo nếu thiếu dữ liệu hình ảnh, kiểu dáng hoặc thông số phù hợp.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Yêu cầu đối với ảnh và camera
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Ảnh nên rõ nét, đủ sáng, không bị che khuất cơ thể hoặc sản phẩm cần thử.</List.Item>
        <List.Item>Người dùng nên đứng thẳng, giữ khoảng cách phù hợp với camera và hạn chế nền quá phức tạp.</List.Item>
        <List.Item>Không tải lên ảnh chứa nội dung nhạy cảm, ảnh của người khác khi chưa được đồng ý hoặc hình ảnh vi phạm pháp luật.</List.Item>
        <List.Item>Kết quả có thể kém chính xác nếu ảnh bị mờ, nghiêng, thiếu ánh sáng, dáng người bị che hoặc trang phục nền quá phức tạp.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Giới hạn của kết quả thử đồ
      </Title>
      <Text className="!mt-3 !leading-7">
        Kết quả thử đồ ảo có thể khác với sản phẩm thực tế do ánh sáng, màu màn hình, góc chụp,
        chất liệu, độ rũ vải, phom dáng, kích thước cơ thể và dữ liệu hình ảnh của sản phẩm.
        AnrealShop không cam kết kết quả ghép thử phản ánh tuyệt đối màu sắc, độ vừa vặn, độ dài,
        độ rộng hoặc cảm giác mặc thực tế.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Quyền riêng tư và dữ liệu hình ảnh
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Người dùng chỉ nên sử dụng ảnh của chính mình hoặc ảnh đã có quyền sử dụng hợp pháp.</List.Item>
        <List.Item>Ảnh/camera được dùng để tạo kết quả thử đồ và cải thiện trải nghiệm theo phạm vi hệ thống cho phép.</List.Item>
        <List.Item>AnrealShop không yêu cầu người dùng cung cấp ảnh nhạy cảm để sử dụng tính năng thử đồ.</List.Item>
        <List.Item>Người dùng không nên tải lên giấy tờ tùy thân, thông tin tài chính, địa chỉ riêng tư hoặc dữ liệu không cần thiết trong ảnh thử đồ.</List.Item>
        <List.Item>Nếu người dùng muốn xóa dữ liệu liên quan, vui lòng gửi yêu cầu hỗ trợ kèm thông tin tài khoản và thời điểm sử dụng tính năng.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Nội dung bị cấm
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Ảnh khỏa thân, khiêu dâm, bạo lực, thù ghét, quấy rối hoặc xâm phạm đời tư.</List.Item>
        <List.Item>Ảnh trẻ em hoặc người chưa thành niên trong ngữ cảnh không phù hợp.</List.Item>
        <List.Item>Ảnh giả mạo người khác nhằm lừa đảo, xúc phạm, mạo danh hoặc gây hiểu nhầm.</List.Item>
        <List.Item>Ảnh có chứa thông tin cá nhân nhạy cảm của bên thứ ba khi chưa được cho phép.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Trách nhiệm khi ra quyết định mua hàng
      </Title>
      <Text className="!mt-3 !leading-7">
        Khách hàng nên kết hợp kết quả thử đồ với bảng kích thước, số đo cơ thể, mô tả chất liệu,
        ảnh thật, đánh giá của người mua trước và tư vấn từ người bán. Nếu còn phân vân về kích
        thước hoặc phom dáng, khách hàng nên liên hệ shop trước khi đặt hàng để giảm rủi ro đổi
        trả.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        7. Lỗi kỹ thuật và gián đoạn dịch vụ
      </Title>
      <Text className="!mt-3 !leading-7">
        Tính năng thử đồ ảo có thể tạm thời không khả dụng do bảo trì, giới hạn thiết bị, trình
        duyệt, quyền camera, tốc độ mạng hoặc lỗi xử lý hình ảnh. AnrealShop có thể cập nhật,
        thay đổi hoặc tạm ngừng tính năng để cải thiện chất lượng mà không ảnh hưởng đến quyền
        lợi mua hàng cơ bản của khách hàng.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        8. Ảnh hưởng tới đổi trả
      </Title>
      <Text className="!mt-3 !leading-7">
        Việc sản phẩm thực tế không giống hoàn toàn kết quả thử đồ ảo không mặc nhiên là lỗi của
        sản phẩm. Yêu cầu đổi trả vẫn được xem xét theo chính sách đổi trả và hoàn tiền, dựa trên
        tình trạng sản phẩm thực tế, mô tả của người bán, bằng chứng khách hàng cung cấp và điều
        kiện áp dụng tại thời điểm mua.
      </Text>
    </div>
  );
};

export default TryOnPolicy;
