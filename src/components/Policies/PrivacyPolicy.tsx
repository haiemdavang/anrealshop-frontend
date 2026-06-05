import { Divider, List, Text, Title } from "@mantine/core";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl text-gray-700">
      <Text size="sm" className="!text-gray-500 !mb-2">
        Cập nhật gần nhất: 05/06/2026
      </Text>
      <Title order={2} className="!text-2xl !font-semibold !text-gray-900">
        Chính sách bảo mật thông tin
      </Title>
      <Text className="!mt-4 !leading-7">
        Chính sách bảo mật giải thích cách AnrealShop thu thập, sử dụng, lưu trữ và bảo vệ thông
        tin cá nhân khi khách hàng tạo tài khoản, đặt hàng, thanh toán, sử dụng thử đồ ảo, trao
        đổi với người bán hoặc liên hệ bộ phận hỗ trợ.
      </Text>

      <Divider className="!my-7" />

      <Title order={3} className="!text-xl !font-semibold !text-gray-900">
        1. Thông tin có thể được thu thập
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Thông tin tài khoản như họ tên, email, số điện thoại, mật khẩu đã mã hóa và trạng thái xác minh.</List.Item>
        <List.Item>Thông tin giao nhận như địa chỉ, ghi chú giao hàng, lịch sử đơn hàng và mã vận đơn.</List.Item>
        <List.Item>Thông tin thanh toán cần thiết để ghi nhận giao dịch, đối soát, hoàn tiền và phòng chống gian lận.</List.Item>
        <List.Item>Dữ liệu sử dụng dịch vụ như sản phẩm đã xem, tìm kiếm, giỏ hàng, đánh giá, yêu thích và tương tác với shop.</List.Item>
        <List.Item>Ảnh hoặc dữ liệu camera khi người dùng chủ động sử dụng tính năng thử đồ ảo hoặc xác minh tài khoản.</List.Item>
        <List.Item>Thông tin kỹ thuật như địa chỉ IP, loại thiết bị, trình duyệt, thời gian truy cập và log lỗi để bảo mật hệ thống.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        2. Mục đích sử dụng thông tin
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Tạo và quản lý tài khoản người dùng, xác thực đăng nhập và bảo vệ tài khoản.</List.Item>
        <List.Item>Xử lý đơn hàng, thanh toán, giao nhận, đổi trả, hoàn tiền và chăm sóc khách hàng.</List.Item>
        <List.Item>Cá nhân hóa trải nghiệm mua sắm, gợi ý sản phẩm và cải thiện chất lượng dịch vụ.</List.Item>
        <List.Item>Phát hiện, ngăn chặn hành vi gian lận, spam, truy cập trái phép hoặc vi phạm chính sách.</List.Item>
        <List.Item>Tuân thủ yêu cầu pháp luật, quy định kế toán, thuế, khiếu nại và giải quyết tranh chấp khi cần.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        3. Chia sẻ thông tin với bên thứ ba
      </Title>
      <Text className="!mt-3 !leading-7">
        AnrealShop chỉ chia sẻ thông tin trong phạm vi cần thiết để vận hành dịch vụ, ví dụ chia
        sẻ địa chỉ và số điện thoại cho người bán hoặc đơn vị vận chuyển để giao hàng, chia sẻ dữ
        liệu giao dịch với cổng thanh toán để đối soát, hoặc cung cấp thông tin theo yêu cầu hợp
        pháp của cơ quan có thẩm quyền. AnrealShop không bán thông tin cá nhân của khách hàng.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        4. Lưu trữ và bảo vệ dữ liệu
      </Title>
      <Text className="!mt-3 !leading-7">
        Thông tin được lưu trữ trong thời gian cần thiết để cung cấp dịch vụ, xử lý nghĩa vụ pháp
        lý, giải quyết tranh chấp và bảo vệ quyền lợi của các bên. AnrealShop áp dụng các biện
        pháp kỹ thuật và tổ chức phù hợp như phân quyền truy cập, mã hóa mật khẩu, kiểm soát log
        và giám sát bất thường. Tuy nhiên, không có hệ thống trực tuyến nào có thể đảm bảo an toàn
        tuyệt đối trong mọi tình huống.
      </Text>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        5. Quyền của người dùng
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Yêu cầu xem, cập nhật hoặc chỉnh sửa thông tin tài khoản khi dữ liệu chưa chính xác.</List.Item>
        <List.Item>Yêu cầu hỗ trợ xóa hoặc hạn chế xử lý một số dữ liệu theo điều kiện hệ thống và quy định pháp luật.</List.Item>
        <List.Item>Thay đổi tùy chọn nhận thông báo tiếp thị nếu tính năng này được cung cấp.</List.Item>
        <List.Item>Gửi khiếu nại nếu cho rằng thông tin cá nhân bị sử dụng sai mục đích hoặc không đúng phạm vi đã thông báo.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        6. Trách nhiệm bảo mật của người dùng
      </Title>
      <List className="!mt-3 !leading-7" spacing="xs">
        <List.Item>Giữ bí mật mật khẩu, mã OTP, thiết bị đăng nhập và thông tin xác thực cá nhân.</List.Item>
        <List.Item>Không chia sẻ tài khoản cho người khác hoặc sử dụng tài khoản của người khác khi chưa được phép.</List.Item>
        <List.Item>Đăng xuất khỏi thiết bị công cộng và thông báo ngay nếu nghi ngờ tài khoản bị truy cập trái phép.</List.Item>
        <List.Item>Không gửi thông tin nhạy cảm qua chat nếu không cần thiết cho việc xử lý đơn hàng hoặc hỗ trợ.</List.Item>
      </List>

      <Title order={3} className="!mt-7 !text-xl !font-semibold !text-gray-900">
        7. Thay đổi chính sách
      </Title>
      <Text className="!mt-3 !leading-7">
        AnrealShop có thể cập nhật chính sách bảo mật để phù hợp với thay đổi sản phẩm, công nghệ,
        quy trình vận hành hoặc yêu cầu pháp luật. Phiên bản mới sẽ được đăng trên trang chính
        sách và có hiệu lực từ thời điểm công bố, trừ khi có thông báo khác.
      </Text>
    </div>
  );
};

export default PrivacyPolicy;
