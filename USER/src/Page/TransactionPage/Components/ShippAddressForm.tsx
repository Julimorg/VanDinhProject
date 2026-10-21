import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, TextField, MenuItem, Switch, FormControlLabel, Typography, Stack } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useVietnamAddress } from '../../../Hook/useVietNamAddress';

interface Props {
  value: string;
  onChange: (address: string) => void;
}

const ShippingAddressForm: React.FC<Props> = ({ value, onChange }) => {
  const { provinces, isLoadingProvinces, useDistricts, useWards } = useVietnamAddress();
  const [manualMode, setManualMode] = useState(false);
  const [detailAddress, setDetailAddress] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [provinceCode, setProvinceCode] = useState<number | undefined>();
  const [districtCode, setDistrictCode] = useState<number | undefined>();
  const [wardCode, setWardCode] = useState<number | undefined>();

  const { data: districts = [], isLoading: loadingDistricts } = useDistricts(provinceCode);
  const { data: wards = [], isLoading: loadingWards } = useWards(districtCode);

  useEffect(() => {
    if (manualMode) {
      onChange(manualAddress);
      return;
    }
    const ward = wards.find((w) => w.code === wardCode)?.name || '';
    const district = districts.find((d) => d.code === districtCode)?.name || '';
    const province = provinces.find((p) => p.code === provinceCode)?.name || '';
    const full = [detailAddress, ward, district, province].filter(Boolean).join(', ');
    onChange(full);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualMode, manualAddress, detailAddress, wardCode, districtCode, provinceCode, wards, districts, provinces]);

  return (
    <Card variant="outlined" className="mb-4">
      <CardHeader
        title="Địa chỉ giao hàng"
        titleTypographyProps={{ fontSize: '0.95rem', fontWeight: 600 }}
        action={
          <FormControlLabel
            labelPlacement="start"
            control={<Switch size="small" checked={manualMode} onChange={(e) => setManualMode(e.target.checked)} />}
            label={
              <Typography variant="caption" color="text.secondary">
                Nhập thủ công
              </Typography>
            }
            sx={{ mr: 1 }}
          />
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Số nhà, tên đường..."
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <HomeRoundedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              },
            }}
          />

          {manualMode ? (
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="VD: 123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          ) : (
            <>
              <TextField
                select
                fullWidth
                size="small"
                label="Tỉnh/Thành phố"
                value={provinceCode ?? ''}
                disabled={isLoadingProvinces}
                onChange={(e) => {
                  const code = Number(e.target.value);
                  setProvinceCode(code);
                  setDistrictCode(undefined);
                  setWardCode(undefined);
                }}
              >
                {provinces.map((p) => (
                  <MenuItem key={p.code} value={p.code}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                size="small"
                label="Quận/Huyện"
                value={districtCode ?? ''}
                disabled={!provinceCode || loadingDistricts}
                onChange={(e) => {
                  const code = Number(e.target.value);
                  setDistrictCode(code);
                  setWardCode(undefined);
                }}
              >
                {districts.map((d) => (
                  <MenuItem key={d.code} value={d.code}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                size="small"
                label="Phường/Xã"
                value={wardCode ?? ''}
                disabled={!districtCode || loadingWards}
                onChange={(e) => setWardCode(Number(e.target.value))}
              >
                {wards.map((w) => (
                  <MenuItem key={w.code} value={w.code}>
                    {w.name}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          <Typography variant="body2" color="text.secondary">
            Địa chỉ nhận hàng: <strong>{value || 'Chưa có'}</strong>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ShippingAddressForm;
