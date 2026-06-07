import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
  Facebook,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Khuyến mãi', href: '/promotions' },
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Chính sách', href: '/policy' },
  ];

  const socials = [
    { icon: <Facebook sx={{ fontSize: '1.1rem' }} />, href: 'https://facebook.com/vandinhpaint', hoverColor: '#1877f2' },
    { icon: <Instagram sx={{ fontSize: '1.1rem' }} />, href: 'https://instagram.com/vandinhpaint', hoverColor: '#e1306c' },
    { icon: <YouTube sx={{ fontSize: '1.1rem' }} />, href: 'https://youtube.com/@vandinhpaint', hoverColor: '#ff0000' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#141210',
        color: 'white',
        pt: { xs: 8, md: 12 },
        pb: 4,
        mt: 'auto',
        borderTop: '3px solid #f59e0b',
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 3, md: 6, lg: 8 } }}>
        <Grid container spacing={{ xs: 5, md: 6 }}>

          {/* ── Col 1: Brand ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Logo / Brand name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  width: 36, height: 36,
                  bgcolor: '#f59e0b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 900, color: '#1c1917', fontSize: '1rem', lineHeight: 1 }}>V</Typography>
              </Box>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'white' }}>
                Vạn Đinh Paint
              </Typography>
            </Box>

            <Typography sx={{ color: '#a8a29e', fontSize: '0.82rem', lineHeight: 1.8, mb: 2 }}>
              Chuyên cung cấp sơn nội thất, ngoại thất chính hãng từ các thương hiệu hàng đầu thế giới.
            </Typography>

            {/* Brand tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {['Dulux', 'Jotun', 'Nippon', 'Kova', 'TOA'].map(b => (
                <Box key={b} sx={{
                  px: 1.25, py: 0.4,
                  border: '1px solid #292524',
                  color: '#a8a29e', fontSize: '0.65rem', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  {b}
                </Box>
              ))}
            </Box>

            {/* Tagline */}
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #292524' }}>
              <Typography sx={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Uy tín · Chất lượng · Giá tốt nhất TP.HCM
              </Typography>
            </Box>
          </Grid>

          {/* ── Col 2: Links ── */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography sx={{
              color: 'white', fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2.5,
            }}>
              Liên kết
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {links.map(link => (
                <Box
                  key={link.href}
                  component="a"
                  href={link.href}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.75,
                    color: '#78716c', fontSize: '0.82rem',
                    textDecoration: 'none', transition: 'color 0.2s',
                    '&:hover': { color: '#f59e0b' },
                    '&:hover .arrow': { opacity: 1, transform: 'translateX(2px)' },
                  }}
                >
                  <ArrowForward
                    className="arrow"
                    sx={{ fontSize: '0.65rem', opacity: 0, transition: 'all 0.2s' }}
                  />
                  {link.label}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* ── Col 3: Contact ── */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography sx={{
              color: 'white', fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2.5,
            }}>
              Liên hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                {
                  icon: <LocationOn sx={{ fontSize: '0.9rem', color: '#f59e0b', mt: '2px', flexShrink: 0 }} />,
                  content: '123 Đường Sơn, Phường 10, Quận 3, TP. Hồ Chí Minh',
                  href: undefined,
                },
                {
                  icon: <Phone sx={{ fontSize: '0.9rem', color: '#f59e0b', flexShrink: 0 }} />,
                  content: '0123 456 789',
                  href: 'tel:0123456789',
                },
                {
                  icon: <Email sx={{ fontSize: '0.9rem', color: '#f59e0b', flexShrink: 0 }} />,
                  content: 'info@vandinh.com',
                  href: 'mailto:info@vandinh.com',
                },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                  {item.icon}
                  {item.href ? (
                    <Box component="a" href={item.href} sx={{
                      color: '#78716c', fontSize: '0.8rem', textDecoration: 'none',
                      transition: 'color 0.2s', '&:hover': { color: '#f59e0b' },
                    }}>
                      {item.content}
                    </Box>
                  ) : (
                    <Typography sx={{ color: '#78716c', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      {item.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* ── Col 4: Social ── */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography sx={{
              color: 'white', fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2.5,
            }}>
              Theo dõi
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {socials.map((s, i) => (
                <Box
                  key={i}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38, height: 38,
                    border: '1px solid #292524',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#78716c', transition: 'all 0.25s',
                    '&:hover': { bgcolor: s.hoverColor, borderColor: s.hoverColor, color: 'white', transform: 'translateY(-2px)' },
                  }}
                >
                  {s.icon}
                </Box>
              ))}
            </Box>

            <Typography sx={{ color: '#57534e', fontSize: '0.78rem', lineHeight: 1.7 }}>
              Theo dõi để nhận tư vấn màu sắc miễn phí và cập nhật ưu đãi hấp dẫn nhất.
            </Typography>

            {/* Working hours */}
            <Box sx={{ mt: 2.5, p: 1.5, border: '1px solid #292524' }}>
              <Typography sx={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.75 }}>
                Giờ mở cửa
              </Typography>
              <Typography sx={{ color: '#78716c', fontSize: '0.75rem' }}>
                Thứ 2 – Thứ 7: 7:30 – 18:00
              </Typography>
              <Typography sx={{ color: '#78716c', fontSize: '0.75rem' }}>
                Chủ nhật: 8:00 – 12:00
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* ── Bottom bar ── */}
        <Box sx={{ mt: 8, pt: 3, borderTop: '1px solid #292524', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ color: '#57534e', fontSize: '0.75rem' }}>
            © {currentYear} Cửa hàng sơn Vạn Đinh. All rights reserved.
          </Typography>
          <Typography sx={{ color: '#3c3835', fontSize: '0.7rem' }}>
            Thiết kế & phát triển bởi{' '}
            <Box component="span" sx={{ color: '#78716c' }}>Fong & GDKelvin</Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;