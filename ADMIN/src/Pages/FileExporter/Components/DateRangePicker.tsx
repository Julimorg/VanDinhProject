import React from 'react';
import { DatePicker, Button, Card, Space, Typography, Row, Col } from 'antd';
import { DownloadOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';

const { Text } = Typography;

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onExport: () => void;
  isExportEnabled: boolean;
  isLoading?: boolean;
  userId: string | null;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
  isExportEnabled,
  isLoading = false,
  userId,
}) => {
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <Card size="small" className="bg-blue-50 border-blue-200">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-blue-600" />
          <Text strong className="text-base sm:text-lg">
            Chọn khoảng thời gian
          </Text>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={6}>
            <div>
              <Text className="block mb-2 text-sm sm:text-base">Ngày bắt đầu</Text>
              <DatePicker
                value={startDate}
                onChange={onStartDateChange}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày bắt đầu"
                size="large"
                className="w-full"
                disabledDate={disabledDate}
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <div>
              <Text className="block mb-2 text-sm sm:text-base">Ngày kết thúc</Text>
              <DatePicker
                value={endDate}
                onChange={onEndDateChange}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày kết thúc"
                size="large"
                className="w-full"
                disabledDate={(current) => {
                  if (!startDate) return current && current > dayjs().endOf('day');
                  return current && (current > dayjs().endOf('day') || current < startDate.startOf('day'));
                }}
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} className="flex items-end">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={onExport}
              disabled={!isExportEnabled}
              loading={isLoading}
              size="large"
              block
              className="h-full"
              style={{ minHeight: '40px' }}
            >
              <span className="hidden sm:inline">Xuất File Excel</span>
              <span className="sm:hidden">Xuất Excel</span>
            </Button>
          </Col>
        </Row>
        {!isExportEnabled && (
          <Text type="secondary" className="text-xs sm:text-sm">
            * Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc để xuất file
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default DateRangePicker;

