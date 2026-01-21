import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export interface StatusConfig {
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  text: string;
  borderColor: string;
}

export const getStatusConfig = (status: string): StatusConfig => {
  const configs: Record<string, StatusConfig> = {
    'approved': {
      color: '#059669',
      bgColor: '#f0fdf4',
      icon: <CheckCircleOutlined />,
      text: 'Đã duyệt',
      borderColor: '#d1fae5'
    },
    'pending': {
      color: '#d97706',
      bgColor: '#fefce8',
      icon: <ClockCircleOutlined />,
      text: 'Chờ duyệt',
      borderColor: '#fef3c7'
    },
    'canceled': {
      color: '#dc2626',
      bgColor: '#fef2f2',
      icon: <CloseCircleOutlined />,
      text: 'Đã hủy',
      borderColor: '#fee2e2'
    }
  };
  return configs[status] || configs['pending'];
};
