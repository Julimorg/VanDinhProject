import React from 'react';
import { Card, Form, Radio, Space } from 'antd';
import { CreditCardOutlined, WalletOutlined } from '@ant-design/icons';

const PaymentMethodCard: React.FC = () => {
  return (
    <Card size="small" title="Phương thức thanh toán">
      <Form.Item name="paymentMethod" rules={[{ required: true }]}>
        <Radio.Group>
          <Space direction="vertical" className="w-full">
            <Radio value="CASH">
              <Space><WalletOutlined /> Thanh toán khi nhận hàng (COD)</Space>
            </Radio>
            <Radio value="VN_PAY">
              <Space><CreditCardOutlined /> Thanh toán qua VNPay</Space>
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
    </Card>
  );
};

export default PaymentMethodCard;