import { useState } from 'react';
import { docApi } from '@/Api/docApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card } from 'antd';

const { Title } = Typography;

const ChangeInformation = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    navigate('/tickets');
  };

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    try {
      setLoading(true);
      await docApi.ChangePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      handleCancel();
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <Card
          title={
            <Title level={4} className="mb-0 text-center">
              Đổi mật khẩu
            </Title>
          }
          bordered={false}
          style={{ borderRadius: '8px' }}
        >
          <Form layout="vertical">
            <Form.Item label="Mật khẩu cũ" required>
              <Input.Password
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
                size="large"
              />
            </Form.Item>

            <Form.Item label="Mật khẩu mới" required>
              <Input.Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                size="large"
              />
            </Form.Item>

            <Form.Item label="Xác nhận mật khẩu" required>
              <Input.Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-3">
                <Button onClick={handleCancel}>Hủy bỏ</Button>
                <Button type="primary" loading={loading} onClick={handleSave}>
                  {loading ? 'Đang lưu...' : 'Lưu lại'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ChangeInformation;
