import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        bgcolor: 'rgba(12, 10, 9, 0.72)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backdropFilter: 'blur(2px)',
      }}
    >
      <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
      <Typography sx={{ color: 'white', fontWeight: 600 }}>Đang tải...</Typography>
    </Box>
  );
}
