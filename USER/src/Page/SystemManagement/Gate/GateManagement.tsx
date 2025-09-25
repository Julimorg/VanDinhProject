import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { Trash2, Pencil } from 'lucide-react';

import { useQueryGate } from './Hooks/useQueryGate';
import { useState, type FC } from 'react';
import type { TGate, TUpdateGate } from '@/Interface/TGate';
import { useNavigate } from 'react-router-dom';
import GateConfigModal from './Components/GateConfigModal';

const GateManagement: FC = () => {
  const { getAllGate, updateGate, deleteGate } = useQueryGate();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedGate, setSelectedGate] = useState<TGate | null>(null);

  console.log(getAllGate.data?.data);

  const [updateForm] = Form.useForm();
  const navigate = useNavigate();

  const handleOpenUpdateModal = (gate: TGate) => {
    setSelectedGate(gate);
    updateForm.resetFields();
    setUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalVisible(false);
    setSelectedGate(null);
  };

  // const handleOpenConfigModal = (gate: TGate) => {
  //   setSelectedGate(gate);
  //   setConfigModalVisible(true);
  // };

  const handleCloseConfigModal = () => {
    setConfigModalVisible(false);
    setSelectedGate(null);
  };

  const handleUpdateGate = async (values: TUpdateGate) => {
    if (selectedGate) {
      updateGate.mutate(
        { id: selectedGate.id, data: values },
        {
          onSuccess: () => {
            handleCloseUpdateModal();
            message.success('Cập nhật thành công');
          },
          onError: (error) => {
            console.log(error);
            message.error('Không thể cập nhật cổng. Vui lòng thử lại.');
          },
        }
      );
    }
  };

  const handleDeleteGate = (id: string) => {
    if (id) {
      deleteGate.mutate(id, {
        onSuccess: () => {
          message.success('Xóa thành công');
        },
        onError: (error) => {
          message.error('Không thể xóa cổng. Vui lòng thử lại.');
          console.log(error);
        },
      });
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (index: number) => index + 1,
    },
    {
      title: 'Mã serial',
      dataIndex: 'serialNo',
      key: 'serialNo',
    },
    {
      title: 'Tên cổng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      render: (state: number) => (
        <Tag
          color={state ? 'success' : 'error'}
          icon={state ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {state ? 'Đã kết nối' : 'Mất kết nối'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: TGate) => (
        <Space size="middle">
          {/* <Tooltip title="Cấu hình cổng">
            <Button
              type="text"
              className="hover: bg-amber-50 text-amber-500"
              icon={<Settings className="w-4 h-4 text-base " />}
              onClick={() => handleOpenConfigModal(record)}
            />
          </Tooltip> */}
          <Tooltip title="Chi tiết cổng">
            <Button
              type="text"
              className="hover: bg-amber-50 text-amber-500"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/gate-detail/${record.id}`)}
            ></Button>
          </Tooltip>

          <Tooltip title="Sửa cổng">
            <Button
              type="text"
              className="text-blue-600 hover: bg-blue-50 "
              icon={<Pencil className="w-4 h-4 " />}
              onClick={() => handleOpenUpdateModal(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa cổng này?"
            description="Hành động này không thể hoàn tác. Dữ liệu của cổng sẽ bị xóa vĩnh viễn khỏi hệ thống."
            onConfirm={() => handleDeleteGate(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa cổng">
              <Button type="text" danger icon={<Trash2 className="w-5 h-5 " />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray-800">Quản lý cổng</h1>
      </div>

      {getAllGate.isLoading ? (
        <div className="flex items-center justify-center h-64 ">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={getAllGate.data?.data}
          rowKey="id"
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
          tableLayout={'auto'}
          scroll={{ x: 'max-content' }}
        />
      )}

      {/* Modal cập nhật cổng */}
      <Modal
        title={`Cập nhật cổng: ${selectedGate?.name}`}
        open={updateModalVisible}
        onCancel={handleCloseUpdateModal}
        footer={null}
      >
        <Form
          form={updateForm}
          onFinish={handleUpdateGate}
          layout="vertical"
          initialValues={{
            password: selectedGate?.password,
            name: selectedGate?.name,
            userName: selectedGate?.userName,
          }}
        >
          <Form.Item
            label="Tên cổng"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên cổng' }]}
          >
            <Input placeholder="Nhập tên cổng" />
          </Form.Item>
          <Form.Item
            label="Tên đăng nhập"
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <div className="flex justify-end w-full gap-2 ">
            <Button className="w-full " danger onClick={handleCloseUpdateModal}>
              Hủy
            </Button>
            <Button
              className="w-full "
              type="primary"
              htmlType="submit"
              loading={updateGate.isPending}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal cấu hình cổng */}
      {selectedGate && (
        <GateConfigModal
          key={selectedGate.id}
          open={configModalVisible}
          onCancel={handleCloseConfigModal}
          gate={selectedGate}
        />
      )}
    </div>
  );
};

export default GateManagement;
