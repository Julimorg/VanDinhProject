import { Box, Grid, Typography, Paper } from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import InfoPageLayout from './InfoPageLayout';

const values = [
  { icon: <VerifiedRoundedIcon />, title: 'Hàng chính hãng', desc: 'Toàn bộ sản phẩm có tem, phiếu bảo hành và hóa đơn đầy đủ từ nhà phân phối ủy quyền.' },
  { icon: <PaletteRoundedIcon />, title: 'Tư vấn màu miễn phí', desc: 'Đội ngũ tư vấn kỹ thuật hỗ trợ chọn màu, tính định mức sơn theo diện tích thi công thực tế.' },
  { icon: <LocalShippingRoundedIcon />, title: 'Giao hàng đúng hẹn', desc: 'Giao hàng nội thành trong 24-48h, đóng gói cẩn thận, kiểm tra hàng trước khi nhận.' },
  { icon: <SupportAgentRoundedIcon />, title: 'Hậu mãi tận tâm', desc: 'Hỗ trợ đổi trả, bảo hành theo đúng chính sách hãng, phản hồi khiếu nại trong 24h.' },
];

export default function AboutPage() {
  return (
    <InfoPageLayout
      eyebrow="Về chúng tôi"
      title="Vạn Đinh Paint"
      subtitle="Chuyên cung cấp sơn nội thất, ngoại thất và vật tư thi công chính hãng từ các thương hiệu hàng đầu."
    >
      <Typography component="p">
        <strong>Vạn Đinh Paint</strong> là cửa hàng chuyên cung cấp sơn và vật tư ngành sơn (dụng cụ thi công,
        hóa chất xử lý bề mặt...) tại TP. Hồ Chí Minh. Chúng tôi phân phối chính thức các thương hiệu sơn uy tín
        như Dulux, Jotun, Nippon, Kova, TOA, phục vụ cả khách hàng cá nhân (sơn nhà, sơn sửa chữa) lẫn đội thi
        công, nhà thầu (mua số lượng lớn, cần tư vấn kỹ thuật).
      </Typography>
      <Typography component="p">
        Nền tảng đặt hàng trực tuyến này được xây dựng để khách hàng có thể xem bảng màu, tra giá, đặt hàng và
        theo dõi đơn hàng mọi lúc, mọi nơi - không cần ra cửa hàng vẫn có thể lên đơn và nhận hàng tận nơi.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {values.map((v) => (
          <Grid key={v.title} size={{ xs: 12, sm: 6 }}>
            <Paper variant="outlined" sx={{ p: 2.5, height: '100%', borderRadius: 2 }}>
              <Box sx={{ color: 'primary.main', mb: 1.5, '& svg': { fontSize: 28 } }}>{v.icon}</Box>
              <Typography sx={{ fontWeight: 700, color: 'stone.900', mb: 0.5, fontSize: '0.95rem' }}>
                {v.title}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', lineHeight: 1.7 }}>
                {v.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </InfoPageLayout>
  );
}
