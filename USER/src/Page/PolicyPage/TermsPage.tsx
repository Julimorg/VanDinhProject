import { Typography } from '@mui/material';
import InfoPageLayout from './InfoPageLayout';

export default function TermsPage() {
  return (
    <InfoPageLayout eyebrow="Pháp lý" title="Điều khoản dịch vụ" subtitle="Cập nhật lần cuối: 10/2026">
      <Typography component="p">
        Bằng việc truy cập và sử dụng website/ứng dụng của Vạn Đinh Paint, bạn đồng ý tuân thủ các điều khoản
        dưới đây. Vui lòng đọc kỹ trước khi đặt hàng.
      </Typography>

      <Typography component="h3">1. Tài khoản người dùng</Typography>
      <Typography component="ul">
        <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập (mật khẩu) của tài khoản mình.</li>
        <li>Thông tin đăng ký (họ tên, số điện thoại, địa chỉ) cần chính xác để đảm bảo quá trình giao hàng.</li>
        <li>Chúng tôi có quyền tạm khóa tài khoản nếu phát hiện hành vi gian lận hoặc vi phạm điều khoản.</li>
      </Typography>

      <Typography component="h3">2. Đặt hàng & xác nhận</Typography>
      <Typography component="p">
        Đơn hàng được xác nhận là đơn thành công sau khi bạn hoàn tất bước xác nhận địa chỉ giao hàng và hình
        thức thanh toán (COD hoặc chuyển khoản QR). Giá sản phẩm hiển thị tại thời điểm đặt hàng là giá cuối
        cùng, đã bao gồm các khoản áp dụng theo quy định hiện hành (nếu có).
      </Typography>

      <Typography component="h3">3. Giá & khuyến mãi</Typography>
      <Typography component="p">
        Giá sản phẩm có thể thay đổi theo thời điểm mà không cần báo trước, tuy nhiên không ảnh hưởng đến các
        đơn hàng đã được xác nhận trước đó. Các chương trình khuyến mãi (nếu có) áp dụng theo thời gian và điều
        kiện được công bố cụ thể tại thời điểm triển khai.
      </Typography>

      <Typography component="h3">4. Quyền sở hữu trí tuệ</Typography>
      <Typography component="p">
        Toàn bộ nội dung, hình ảnh, logo trên nền tảng thuộc quyền sở hữu của Vạn Đinh Paint hoặc được cấp phép
        sử dụng hợp pháp. Không sao chép, phân phối lại dưới mọi hình thức khi chưa có sự đồng ý bằng văn bản.
      </Typography>

      <Typography component="h3">5. Giới hạn trách nhiệm</Typography>
      <Typography component="p">
        Chúng tôi nỗ lực đảm bảo thông tin sản phẩm (màu sắc hiển thị, thông số kỹ thuật) chính xác nhất có
        thể, tuy nhiên màu sắc thực tế có thể chênh lệch nhẹ so với hình ảnh do điều kiện màn hình hiển thị.
        Vui lòng tham khảo bảng màu thực tế tại cửa hàng hoặc liên hệ tư vấn trước khi đặt số lượng lớn.
      </Typography>

      <Typography component="h3">6. Thay đổi điều khoản</Typography>
      <Typography component="p">
        Điều khoản này có thể được cập nhật theo thời gian. Phiên bản mới nhất luôn được đăng tải tại trang
        này, ngày cập nhật được ghi rõ ở đầu trang.
      </Typography>
    </InfoPageLayout>
  );
}
