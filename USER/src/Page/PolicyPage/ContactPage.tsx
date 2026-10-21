import { Box, Grid, Typography, Paper, TextField, Button } from '@mui/material';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { toast } from 'react-toastify';
import InfoPageLayout from './InfoPageLayout';

const info = [
  { icon: <LocationOnRoundedIcon />, label: 'Địa chỉ cửa hàng', value: '123 Đường Sơn, Phường 10, Quận 3, TP. Hồ Chí Minh' },
  { icon: <PhoneRoundedIcon />, label: 'Hotline', value: '0123 456 789' },
  { icon: <EmailRoundedIcon />, label: 'Email', value: 'info@vandinh.com' },
  { icon: <AccessTimeRoundedIcon />, label: 'Giờ mở cửa', value: 'T2 - T7: 7:30 - 18:00 · CN: 8:00 - 12:00' },
];

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <InfoPageLayout
      eyebrow="Liên hệ"
      title="Chúng tôi luôn sẵn sàng hỗ trợ"
      subtitle="Có thắc mắc về sản phẩm, đơn hàng hay cần tư vấn màu sơn? Liên hệ với chúng tôi qua các kênh bên dưới."
    >
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {info.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
            <Paper variant="outlined" sx={{ p: 2.25, display: 'flex', gap: 1.5, alignItems: 'flex-start', borderRadius: 2 }}>
              <Box sx={{ color: 'primary.main', mt: 0.25 }}>{item.icon}</Box>
              <Box>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary' }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'stone.900', mt: 0.25 }}>
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 800, color: 'stone.900', mb: 2 }}>Gửi yêu cầu hỗ trợ</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Họ và tên" required size="small" />
          <TextField label="Số điện thoại" required size="small" />
          <TextField label="Email" type="email" size="small" sx={{ gridColumn: { sm: 'span 2' } }} />
          <TextField
            label="Nội dung"
            required
            multiline
            minRows={4}
            size="small"
            sx={{ gridColumn: { sm: 'span 2' } }}
          />
          <Box sx={{ gridColumn: { sm: 'span 2' } }}>
            <Button type="submit" variant="contained" color="primary" endIcon={<SendRoundedIcon />}>
              Gửi yêu cầu
            </Button>
          </Box>
        </Box>
      </Paper>
    </InfoPageLayout>
  );
}
