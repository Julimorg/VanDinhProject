import React from 'react';
import { Card, CardHeader, CardContent, Radio, RadioGroup, FormControlLabel, Stack, Box, Typography } from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import { BANK_TRANSFER_INFO } from '../../../Constant/bankInfo';

interface PaymentMethodCardProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ value, onChange }) => {
  return (
    <Card variant="outlined" className="mb-4">
      <CardHeader title="Phương thức thanh toán" titleTypographyProps={{ fontSize: '0.95rem', fontWeight: 600 }} />
      <CardContent sx={{ pt: 0 }}>
        <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
          <Stack spacing={1}>
            <FormControlLabel
              value="CASH"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalShippingRoundedIcon fontSize="small" color="action" />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </Stack>
              }
            />
            <FormControlLabel
              value="BANK_TRANSFER"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <QrCode2RoundedIcon fontSize="small" color="action" />
                  <span>Chuyển khoản ngân hàng qua mã QR</span>
                </Stack>
              }
            />
          </Stack>
        </RadioGroup>

        {value === 'BANK_TRANSFER' && (
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'stone.50', border: '1px solid', borderColor: 'stone.200' }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Thông tin chuyển khoản
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ngân hàng: <strong>{BANK_TRANSFER_INFO.bankName}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Số tài khoản: <strong>{BANK_TRANSFER_INFO.accountNumber}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chủ tài khoản: <strong>{BANK_TRANSFER_INFO.accountHolder}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Vui lòng ghi rõ mã đơn hàng trong nội dung chuyển khoản. Mã QR chi tiết sẽ được gửi sau khi đơn hàng được xác nhận.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
