
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Card, Switch, Space, Typography, type FormInstance } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useVietnamAddress } from '../../../Hook/useVietNamAddress';

const { Text } = Typography;

interface Props {
  form: FormInstance;
}

const ShippingAddressForm: React.FC<Props> = ({ form }) => {
  const { provinces, isLoadingProvinces } = useVietnamAddress();
  const [manualMode, setManualMode] = useState(false);
  const [provinceCode, setProvinceCode] = useState<number | undefined>();
  const [districtCode, setDistrictCode] = useState<number | undefined>();

  const { data: districts = [], isLoading: loadingDistricts } = useVietnamAddress().useDistricts(provinceCode);
  const { data: wards = [], isLoading: loadingWards } = useVietnamAddress().useWards(districtCode);

  const updateAutoAddress = () => {
    if (manualMode) return;
    const detail = form.getFieldValue('detailAddress') || '';
    const ward = wards.find(w => w.code === form.getFieldValue('wardCode'))?.name || '';
    const district = districts.find(d => d.code === districtCode)?.name || '';
    const province = provinces.find(p => p.code === provinceCode)?.name || '';
    const full = [detail, ward, district, province].filter(Boolean).join(', ');
    form.setFieldsValue({ fullAddress: full });
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    form.setFieldsValue({ fullAddress: e.target.value });
  };

  useEffect(() => {
    if (!manualMode) updateAutoAddress();
  }, [provinceCode, districtCode, wards, manualMode]);

  return (
    <Card
      size="small"
      title="Địa chỉ giao hàng"
      className="mb-4"
      extra={
        <Space>
          <Text type="secondary">Nhập thủ công</Text>
          <Switch checked={manualMode} onChange={setManualMode} />
        </Space>
      }
    >
      <Form.Item name="detailAddress">
        <Input
          prefix={<HomeOutlined />}
          placeholder="Số nhà, tên đường..."
          onChange={manualMode ? handleManualChange : undefined}
        />
      </Form.Item>

      {manualMode ? (
        <Form.Item name="fullAddress" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ đầy đủ' }]}>
          <Input.TextArea
            rows={4}
            placeholder="VD: 123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
            onChange={handleManualChange}
          />
        </Form.Item>
      ) : (
        <>
          <Form.Item name="provinceCode" rules={[{ required: true }]}>
            <Select
              showSearch
              loading={isLoadingProvinces}
              placeholder="Tỉnh/Thành phố"
              onChange={(code: number) => {
                setProvinceCode(code);
                setDistrictCode(undefined);
                form.setFieldsValue({ districtCode: undefined, wardCode: undefined });
              }}
            >
              {provinces.map(p => <Select.Option key={p.code} value={p.code}>{p.name}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="districtCode" rules={[{ required: true }]}>
            <Select
              showSearch
              disabled={!provinceCode}
              loading={loadingDistricts}
              placeholder="Quận/Huyện"
              onChange={(code: number) => {
                setDistrictCode(code);
                form.setFieldsValue({ wardCode: undefined });
              }}
            >
              {districts.map(d => <Select.Option key={d.code} value={d.code}>{d.name}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="wardCode" rules={[{ required: true }]}>
            <Select
              showSearch
              disabled={!districtCode}
              loading={loadingWards}
              placeholder="Phường/Xã"
              onChange={updateAutoAddress}
            >
              {wards.map(w => <Select.Option key={w.code} value={w.code}>{w.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item name="fullAddress" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Text type="secondary">
        Địa chỉ nhận hàng: <strong>{form.getFieldValue('fullAddress') || 'Chưa có'}</strong>
      </Text>
    </Card>
  );
};

export default ShippingAddressForm;