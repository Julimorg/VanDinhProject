import { useEffect, useRef } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import { fadeInUp } from '../../Utils/animations';

export default function NotFoundPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) fadeInUp(ref.current);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Box ref={ref} sx={{ textAlign: 'center', width: '100%', py: 8 }}>
        <Typography
          sx={{
            fontSize: { xs: '5.5rem', md: '8rem' },
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #78716c 0%, #1c1917 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, mb: 1, fontWeight: 800 }}>
          Không tìm thấy trang này
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: 420, mx: 'auto' }}>
          Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi. Hãy quay lại trang chủ để tiếp tục mua sắm.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBackRoundedIcon />}
          >
            Quay lại
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            color="primary"
            startIcon={<StorefrontRoundedIcon />}
          >
            Về trang chủ
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
