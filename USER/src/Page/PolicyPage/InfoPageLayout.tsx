import { type ReactNode, useEffect, useRef } from 'react';
import { Box, Container, Typography, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { fadeInUp } from '../../Utils/animations';

const INFO_LINKS = [
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Liên hệ', href: '/contact' },
  { label: 'Câu hỏi thường gặp', href: '/faq' },
  { label: 'Chính sách vận chuyển & thanh toán', href: '/shipping-policy' },
  { label: 'Chính sách đổi trả & bảo hành', href: '/return-policy' },
  { label: 'Điều khoản dịch vụ', href: '/terms' },
  { label: 'Chính sách bảo mật', href: '/privacy' },
];

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Khung chung cho cac trang thong tin/chinh sach: hero + sidebar dieu huong + noi dung. */
export default function InfoPageLayout({ eyebrow, title, subtitle, children }: Props) {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (contentRef.current) fadeInUp(contentRef.current, { delay: 80 });
  }, [location.pathname]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
      {/* Hero */}
      <Box
        sx={{
          bgcolor: 'stone.900',
          color: 'white',
          py: { xs: 6, md: 8 },
          backgroundImage: 'radial-gradient(circle at 15% 30%, rgba(245,158,11,0.18), transparent 45%)',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', mb: 1.5 }}
          >
            {eyebrow}
          </Typography>
          <Typography variant="h3" sx={{ color: 'white', fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: 'stone.400', mt: 1.5, maxWidth: 620, fontSize: '0.95rem', lineHeight: 1.7 }}>
              {subtitle}
            </Typography>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Sidebar nav */}
          <Paper
            variant="outlined"
            sx={{
              width: { xs: '100%', md: 260 },
              flexShrink: 0,
              position: { md: 'sticky' },
              top: { md: 24 },
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <List disablePadding>
              {INFO_LINKS.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <ListItemButton
                    key={item.href}
                    component={Link}
                    to={item.href}
                    selected={active}
                    sx={{
                      py: 1.25,
                      borderLeft: '3px solid',
                      borderLeftColor: active ? 'primary.main' : 'transparent',
                      bgcolor: active ? 'amber.50' : 'transparent',
                      '&:hover': { bgcolor: 'stone.100' },
                    }}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: active ? 700 : 500,
                        color: active ? 'stone.900' : 'text.secondary',
                      }}
                    >
                      {item.label}
                    </ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          {/* Content */}
          <Box
            ref={contentRef}
            sx={{
              flex: 1,
              minWidth: 0,
              '& h3': { fontSize: '1.2rem', fontWeight: 800, color: 'stone.900', mt: 4, mb: 1.5, '&:first-of-type': { mt: 0 } },
              '& p': { fontSize: '0.94rem', lineHeight: 1.85, color: 'stone.700', mb: 1.75 },
              '& ul, & ol': { pl: 3, mb: 1.75, color: 'stone.700' },
              '& li': { fontSize: '0.94rem', lineHeight: 1.85, mb: 0.5 },
              '& strong': { color: 'stone.900' },
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
