import { Typography } from '@mui/material';
import InfoPageLayout from './InfoPageLayout';

export default function ShippingPolicyPage() {
  return (
    <InfoPageLayout
      eyebrow="Chính sách"
      title="Vận chuyển & Thanh toán"
      subtitle="Cập nhật lần cuối: 10/2026"
    >
      <Typography component="h3">1. Hình thức thanh toán</Typography>
      <Typography component="p">
        Để đảm bảo an toàn giao dịch, cửa hàng hiện chỉ hỗ trợ <strong>2 hình thức thanh toán thủ công</strong>,
        chưa tích hợp cổng thanh toán online:
      </Typography>
      <Typography component="ul">
        <li>
          <strong>Thanh toán khi nhận hàng (COD - Ship code):</strong> bạn thanh toán bằng tiền mặt trực tiếp
          cho nhân viên giao hàng khi nhận được sản phẩm. Vui lòng kiểm tra hàng trước khi thanh toán.
        </li>
        <li>
          <strong>Chuyển khoản ngân hàng qua mã QR:</strong> khi xác nhận đơn hàng, hệ thống sẽ hiển thị mã QR
          và thông tin tài khoản ngân hàng của cửa hàng. Sau khi chuyển khoản đúng số tiền và nội dung được
          hướng dẫn, đơn hàng sẽ ở trạng thái <strong>"Chờ xác nhận thanh toán"</strong> cho đến khi nhân viên
          đối soát và xác nhận đã nhận được tiền (thường trong 30 phút - 2 giờ làm việc).
        </li>
      </Typography>
      <Typography component="p">
        Chúng tôi không yêu cầu bạn cung cấp thông tin thẻ ngân hàng hay mật khẩu ngân hàng điện tử ở bất kỳ
        bước nào. Mọi yêu cầu cung cấp các thông tin này đều không phải từ Vạn Đinh Paint.
      </Typography>

      <Typography component="h3">2. Phạm vi & thời gian giao hàng</Typography>
      <Typography component="ul">
        <li><strong>Nội thành TP. Hồ Chí Minh:</strong> 24 - 48 giờ làm việc kể từ khi đơn được xác nhận.</li>
        <li><strong>Các tỉnh/thành khác:</strong> 2 - 5 ngày làm việc, thông qua đơn vị vận chuyển liên kết.</li>
        <li>Đơn hàng đặt sau 17:00 hoặc vào ngày nghỉ sẽ được xử lý vào ngày làm việc tiếp theo.</li>
      </Typography>

      <Typography component="h3">3. Phí vận chuyển</Typography>
      <Typography component="p">
        Phí vận chuyển được tính dựa trên khối lượng/thể tích đơn hàng và khoảng cách giao hàng, hiển thị cụ
        thể trước khi bạn xác nhận đặt hàng. Miễn phí giao hàng nội thành cho đơn hàng từ 2.000.000₫ trở lên.
      </Typography>

      <Typography component="h3">4. Kiểm tra hàng khi nhận</Typography>
      <Typography component="p">
        Vui lòng kiểm tra tình trạng bên ngoài thùng/can sơn, số lượng và mã sản phẩm trước khi ký nhận. Nếu
        phát hiện sai sót, hãy từ chối nhận hàng hoặc ghi chú với nhân viên giao hàng và liên hệ hotline ngay
        trong ngày để được hỗ trợ đổi hàng.
      </Typography>
    </InfoPageLayout>
  );
}
