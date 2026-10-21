import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Bat loi render bat ngo o bat ky component con nao, tranh ca app
 * trang xoa (white screen) - chi hong phan trong boundary nay.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', width: '100%', py: 8 }}>
            <Typography
              sx={{ fontSize: { xs: '4rem', md: '5rem' }, fontWeight: 900, color: 'stone.200', lineHeight: 1 }}
            >
              :(
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              Có lỗi xảy ra ngoài ý muốn
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4 }}>
              Trang bạn đang xem gặp sự cố. Hãy thử tải lại hoặc quay về trang chủ.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshRoundedIcon />}
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </Button>
              <Button variant="contained" color="primary" startIcon={<HomeRoundedIcon />} onClick={this.handleReset}>
                Về trang chủ
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
