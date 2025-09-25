import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Divider,
  Button,
  message,
  Tooltip,
  Modal,
  Form,
  Input,
} from 'antd';
import {
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';

import { useGetMomo } from '../Hooks/useGetMomo';
import { useUpdateMomo } from '../Hooks/useUpdateMomo';
import { useAddMomo } from '../Hooks/useAddMomo';

import Loading from '@/Components/Loading';
import TextBigTitle from '@/Components/TextBigTitle/TextBigTitle';

const MomoGeneral: React.FC = () => {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useGetMomo();
  const { mutate: updateMomo, isPending } = useUpdateMomo();
  const { mutate: addMomo } = useAddMomo();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    messageApi.success('Đã sao chép vào clipboard!');
  };

  const handleEdit = () => {
    if (data) {
      form.setFieldsValue(data);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  // const handleAdd = () => {
  //   form.resetFields();
  //   setIsEditMode(false);
  //   setIsModalOpen(true);
  // };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (isEditMode) {
        updateMomo(
          { ...values, id: data?.id },
          {
            onSuccess: () => {
              messageApi.success('Cập nhật thành công!');
              setIsModalOpen(false);
            },
            onError: () => {
              messageApi.error('Cập nhật thất bại!');
            },
          }
        );
      } else {
        addMomo(values, {
          onSuccess: () => {
            messageApi.success('Thêm mới thành công!');
            setIsModalOpen(false);
          },
          onError: () => {
            messageApi.error('Thêm mới thất bại!');
          },
        });
      }
    });
  };

  const renderField = (
    label: string,
    value: string,
    isSecret: boolean = false
  ) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <Typography.Text strong className="text-gray-700">
          {label}:
        </Typography.Text>{' '}
        <Typography.Text className="text-gray-600 break-all">
          {isSecret && !showSecretKey ? '********' : value}
        </Typography.Text>
      </div>
      <div className="flex items-center space-x-2">
        {isSecret && (
          <Tooltip
            title={showSecretKey ? 'Ẩn khóa bí mật' : 'Hiển thị khóa bí mật'}
          >
            <Button
              type="text"
              icon={showSecretKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowSecretKey(!showSecretKey)}
            />
          </Tooltip>
        )}
        <Tooltip title="Sao chép">
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(value)}
          />
        </Tooltip>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 h-[80rem]">
      {contextHolder}
      <Card
        className="rounded-2xl h-[60rem] shadow-lg"
        styles={{ body: { padding: '32px' } }}
      >
        <Typography.Title
          level={2}
          className="text-center mb-8 text-gray-800 font-semibold"
        >
          Thông tin thanh toán MoMo
        </Typography.Title>

        {isLoading && <Loading />}

        <div className="flex justify-between mt-6 h-20">
          {/* <Button type="primary" onClick={handleAdd}>
            Thêm công ty
          </Button> */}
          <Button type="primary" onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        </div>

        {data && !isLoading && !error ? (
          <Space direction="vertical" size="middle" className="w-full mt-4">
            {renderField('Tên tổ chức', data.org_name)}
            <Divider className="my-2" />
            {renderField('Tên miền MoMo', data.momoDomain)}
            <Divider className="my-2" />
            {renderField('ID', data.id, true)}
            <Divider className="my-2" />
            {renderField('Mã đối tác', data.partnerCode, true)}
            <Divider className="my-2" />
            {renderField('URL chuyển hướng', data.redirectUrl)}
            <Divider className="my-2" />
            {renderField('URL IPN', data.ipnUrl)}
            <Divider className="my-2" />
            {renderField('Khóa bí mật', data.secretKey, true)}
            <Divider className="my-2" />
            {renderField('Khóa truy cập', data.accessKey, true)}
          </Space>
        ) : (
          <div className="mt-10">
            <TextBigTitle
              $fontSize="30px"
              $color="#d9d9d9"
              $fontWeight="300"
              $textalign="center"
              title="Không có thông tin"
            />
          </div>
        )}
      </Card>

      <Modal
        title={isEditMode ? 'Cập nhật thông tin MoMo' : 'Thêm công ty MoMo'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isPending}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="org_name"
            label="Tên tổ chức"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="momoDomain" label="Tên miền MoMo">
            <Input />
          </Form.Item>
          <Form.Item name="partnerCode" label="Mã đối tác">
            <Input />
          </Form.Item>
          <Form.Item name="redirectUrl" label="URL chuyển hướng">
            <Input />
          </Form.Item>
          <Form.Item name="ipnUrl" label="URL IPN">
            <Input />
          </Form.Item>
          <Form.Item name="secretKey" label="Khóa bí mật">
            <Input.Password />
          </Form.Item>
          <Form.Item name="accessKey" label="Khóa truy cập">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MomoGeneral;
