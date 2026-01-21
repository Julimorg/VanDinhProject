import React, { useState, useEffect, useMemo } from 'react';
import { Card, Space, Typography } from 'antd';
import { Dayjs } from 'dayjs';
import { useUsers } from '@/Pages/UsersManagement/Hook/useGetUsers';
import { useDebounce } from '@/Hook/useDebounce';
import { useExportExcel } from './Hook/useExportExcel';
import { IUsersResponse } from '@/Interface/Users/IGetUsers';
import SearchBar from './Components/SearchBar';
import DateRangePicker from './Components/DateRangePicker';
import UserTable from './Components/UserTable';

const { Title, Text } = Typography;

const FileExporterPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [pageInfo, setPageInfo] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  });

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { mutate: exportExcel, isPending: isExporting } = useExportExcel();

  // Reset page when search changes
  useEffect(() => {
    setPageInfo(prev => ({ ...prev, number: 0 }));
  }, [debouncedSearch]);

  const { data, isLoading, error } = useUsers({
    page: pageInfo.number,
    size: pageInfo.size,
    keyword: debouncedSearch,
  });

  const users = useMemo(() => (data?.data?.content || []) as IUsersResponse[], [data]);
  const pagination = useMemo(() => data?.data?.page || pageInfo, [data, pageInfo]);

  // Check if all required fields are filled
  const isExportEnabled = useMemo(() => {
    return userId !== null && startDate !== null && endDate !== null;
  }, [userId, startDate, endDate]);

  const handleExportExcel = () => {
    if (!isExportEnabled || !userId || !startDate || !endDate) {
      return;
    }

    exportExcel({ userId, startDate, endDate });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPageInfo(prev => ({ 
      ...prev, 
      number: page - 1, 
      size: pageSize 
    }));
  };

  const handleSelectUser = (selectedUserId: string) => {
    setUserId(selectedUserId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="shadow-lg">
        <Space direction="vertical" size="large" className="w-full">
          {/* Header */}
          <div>
            <Title level={2} className="!mb-2">
              Xuất File Excel
            </Title>
            <Text type="secondary" className="text-sm sm:text-base">
              Chọn người dùng từ bảng và khoảng thời gian để xuất file Excel
            </Text>
          </div>

          {/* Search Section */}
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* User Table Section */}
          <UserTable
            users={users}
            isLoading={isLoading}
            error={error}
            pagination={pagination}
            onPageChange={handlePageChange}
            selectedUserId={userId}
            onSelectUser={handleSelectUser}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Date Range Section */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onExport={handleExportExcel}
            isExportEnabled={isExportEnabled}
            isLoading={isExporting}
            userId={userId}
          />
        </Space>
      </Card>
    </div>
  );
};

export default FileExporterPage;
