import React from 'react';
import { Dialog, Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface IAddToCartModalProps {
  visible: boolean;
  productName?: string;
  status: 'loading' | 'success';
}

const AddToCartModal: React.FC<IAddToCartModalProps> = ({ visible, productName, status }) => {
  return (
    <Dialog open={visible} disableEscapeKeyDown slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 320 } } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 5, px: 4, textAlign: 'center' }}>
        {status === 'loading' ? (
          <CircularProgress size={42} sx={{ color: 'primary.main' }} />
        ) : (
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main' }} />
        )}

        {status === 'loading' ? (
          <Typography sx={{ color: 'stone.700' }}>
            Đang thêm <Box component="strong" sx={{ color: 'stone.900' }}>{productName}</Box> vào giỏ hàng...
          </Typography>
        ) : (
          <Typography sx={{ color: 'success.main', fontWeight: 600 }}>
            <Box component="strong">{productName}</Box> đã được thêm thành công!
          </Typography>
        )}
      </Box>
    </Dialog>
  );
};

export default AddToCartModal;
