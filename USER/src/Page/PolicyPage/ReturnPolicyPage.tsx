import { Typography } from '@mui/material';
import InfoPageLayout from './InfoPageLayout';

export default function ReturnPolicyPage() {
  return (
    <InfoPageLayout
      eyebrow="Chính sách"
      title="Đổi trả & Bảo hành"
      subtitle="Cập nhật lần cuối: 10/2026"
    >
      <Typography component="h3">1. Điều kiện đổi trả</Typography>
      <Typography component="ul">
        <li>Sản phẩm còn nguyên tem, seal, chưa pha trộn, chưa qua sử dụng dưới mọi hình thức.</li>
        <li>Còn trong thời hạn <strong>7 ngày</strong> kể từ ngày nhận hàng.</li>
        <li>Có hóa đơn hoặc mã đơn hàng trên hệ thống.</li>
        <li>Sản phẩm bị lỗi từ nhà sản xuất, giao sai mẫu/màu so với đơn đặt, hoặc hư hỏng trong quá trình vận chuyển.</li>
      </Typography>
      <Typography component="p">
        Sơn đã pha màu theo yêu cầu riêng (pha màu theo mã màu khách chọn) không áp dụng đổi trả trừ trường hợp
        lỗi từ phía cửa hàng.
      </Typography>

      <Typography component="h3">2. Quy trình đổi trả</Typography>
      <Typography component="ul">
        <li>Liên hệ hotline hoặc trang Liên hệ trong vòng 7 ngày, cung cấp mã đơn hàng và lý do đổi trả.</li>
        <li>Cửa hàng xác nhận và sắp xếp lấy lại sản phẩm (miễn phí nếu lỗi từ cửa hàng/nhà sản xuất).</li>
        <li>Sau khi kiểm tra sản phẩm đổi trả hợp lệ, cửa hàng đổi sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc.</li>
      </Typography>

      <Typography component="h3">3. Hoàn tiền</Typography>
      <Typography component="p">
        Với đơn thanh toán COD, hoàn tiền được thực hiện qua chuyển khoản ngân hàng theo thông tin khách hàng
        cung cấp. Với đơn đã chuyển khoản QR, cửa hàng hoàn tiền về đúng tài khoản ngân hàng đã chuyển khoản
        ban đầu.
      </Typography>

      <Typography component="h3">4. Bảo hành</Typography>
      <Typography component="p">
        Các sản phẩm sơn được bảo hành theo đúng chính sách của từng hãng (Dulux, Jotun, Nippon, Kova, TOA...),
        thường từ 5-15 năm tùy dòng sản phẩm đối với lỗi màng sơn trong điều kiện thi công đúng kỹ thuật. Vui
        lòng giữ hóa đơn mua hàng để làm căn cứ bảo hành khi cần.
      </Typography>
    </InfoPageLayout>
  );
}
