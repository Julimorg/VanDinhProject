import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import InfoPageLayout from './InfoPageLayout';

const faqs = [
  {
    q: 'Tôi có thể thanh toán bằng những hình thức nào?',
    a: 'Hiện tại cửa hàng hỗ trợ 2 hình thức: Thanh toán khi nhận hàng (COD - trả tiền mặt cho nhân viên giao hàng), và Chuyển khoản ngân hàng qua mã QR hiển thị khi đặt hàng. Chúng tôi tạm thời chưa hỗ trợ thanh toán online qua cổng thanh toán (thẻ/ví điện tử).',
  },
  {
    q: 'Chuyển khoản QR thì đơn hàng được xử lý khi nào?',
    a: 'Sau khi chuyển khoản, đơn hàng của bạn ở trạng thái "Chờ xác nhận thanh toán". Nhân viên sẽ đối soát với ngân hàng và xác nhận trong vòng 30 phút - 2 giờ làm việc, sau đó đơn mới chuyển sang bước đóng gói & giao hàng.',
  },
  {
    q: 'Thời gian giao hàng là bao lâu?',
    a: 'Nội thành TP.HCM: 24-48 giờ làm việc. Các tỉnh/thành khác: 2-5 ngày làm việc tùy khu vực, thông qua đơn vị vận chuyển liên kết.',
  },
  {
    q: 'Tôi có thể đổi/trả sản phẩm đã mua không?',
    a: 'Có. Sản phẩm còn nguyên seal, chưa pha trộn/sử dụng có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Chi tiết xem tại trang Chính sách đổi trả & bảo hành.',
  },
  {
    q: 'Làm sao để biết lượng sơn cần mua cho diện tích nhà tôi?',
    a: 'Liên hệ hotline hoặc gửi yêu cầu qua trang Liên hệ, đội ngũ kỹ thuật sẽ tư vấn định mức sơn dựa trên diện tích và loại bề mặt thi công của bạn, hoàn toàn miễn phí.',
  },
  {
    q: 'Tôi có thể hủy đơn hàng sau khi đặt không?',
    a: 'Bạn có thể hủy đơn khi đơn đang ở trạng thái "Chờ xác nhận" (Pending), trước khi cửa hàng duyệt đơn. Sau khi đơn đã được duyệt (Approved) và đang giao, vui lòng liên hệ hotline để được hỗ trợ.',
  },
];

export default function FaqPage() {
  return (
    <InfoPageLayout
      eyebrow="Hỗ trợ"
      title="Câu hỏi thường gặp"
      subtitle="Tổng hợp các thắc mắc phổ biến nhất về đặt hàng, thanh toán và vận chuyển."
    >
      {faqs.map((item, i) => (
        <Accordion
          key={i}
          disableGutters
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px !important',
            mb: 1.25,
            '&:before': { display: 'none' },
            overflow: 'hidden',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'stone.900' }}>{item.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ fontSize: '0.88rem', color: 'text.secondary', lineHeight: 1.8 }}>{item.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </InfoPageLayout>
  );
}
