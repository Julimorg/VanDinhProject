import { Typography } from '@mui/material';
import InfoPageLayout from './InfoPageLayout';

export default function PrivacyPage() {
  return (
    <InfoPageLayout eyebrow="Pháp lý" title="Chính sách bảo mật" subtitle="Cập nhật lần cuối: 10/2026">
      <Typography component="h3">1. Thông tin chúng tôi thu thập</Typography>
      <Typography component="ul">
        <li>Thông tin tài khoản: họ tên, email, số điện thoại, địa chỉ giao hàng.</li>
        <li>Thông tin đơn hàng: sản phẩm đã mua, giá trị đơn hàng, hình thức thanh toán đã chọn.</li>
        <li>Dữ liệu sử dụng: lịch sử duyệt sản phẩm, giỏ hàng, để cải thiện trải nghiệm mua sắm.</li>
      </Typography>
      <Typography component="p">
        Chúng tôi <strong>không thu thập và không lưu trữ</strong> thông tin thẻ ngân hàng hay mật khẩu ngân
        hàng điện tử của bạn, vì hệ thống hiện chỉ hỗ trợ thanh toán COD và chuyển khoản thủ công qua QR - mọi
        giao dịch chuyển khoản diễn ra trực tiếp giữa bạn và ngân hàng của bạn.
      </Typography>

      <Typography component="h3">2. Mục đích sử dụng thông tin</Typography>
      <Typography component="ul">
        <li>Xử lý và giao đơn hàng đến đúng địa chỉ bạn cung cấp.</li>
        <li>Liên hệ xác nhận đơn hàng, thanh toán hoặc hỗ trợ khi có sự cố.</li>
        <li>Gửi thông báo về trạng thái đơn hàng qua hệ thống thông báo trong ứng dụng.</li>
        <li>Cải thiện chất lượng sản phẩm, dịch vụ dựa trên dữ liệu sử dụng tổng hợp (ẩn danh).</li>
      </Typography>

      <Typography component="h3">3. Chia sẻ thông tin với bên thứ ba</Typography>
      <Typography component="p">
        Chúng tôi chỉ chia sẻ thông tin cần thiết (họ tên, số điện thoại, địa chỉ) với đơn vị vận chuyển để
        thực hiện giao hàng. Chúng tôi không bán, cho thuê hay trao đổi thông tin cá nhân của bạn cho bất kỳ
        bên thứ ba nào khác nhằm mục đích quảng cáo.
      </Typography>

      <Typography component="h3">4. Bảo mật thông tin</Typography>
      <Typography component="p">
        Mật khẩu tài khoản được mã hóa, không ai (kể cả nhân viên cửa hàng) có thể xem được mật khẩu gốc của
        bạn. Vui lòng không chia sẻ mật khẩu đăng nhập cho người khác và đăng xuất khi sử dụng thiết bị dùng
        chung.
      </Typography>

      <Typography component="h3">5. Quyền của bạn</Typography>
      <Typography component="ul">
        <li>Xem và chỉnh sửa thông tin cá nhân bất kỳ lúc nào trong mục "Hồ sơ của tôi".</li>
        <li>Yêu cầu xóa tài khoản và dữ liệu cá nhân bằng cách liên hệ hotline/email hỗ trợ.</li>
        <li>Yêu cầu giải thích rõ về cách dữ liệu của bạn được sử dụng.</li>
      </Typography>

      <Typography component="h3">6. Liên hệ về quyền riêng tư</Typography>
      <Typography component="p">
        Mọi thắc mắc liên quan đến chính sách bảo mật, vui lòng liên hệ qua email{' '}
        <strong>info@vandinh.com</strong> hoặc hotline <strong>0123 456 789</strong>.
      </Typography>
    </InfoPageLayout>
  );
}
