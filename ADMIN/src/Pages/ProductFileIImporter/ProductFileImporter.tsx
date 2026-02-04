import React, { useState } from 'react';
import {
  Card,
  Button,
  Upload,
  Table,
  Tabs,
  Statistic,
  Alert,
  Tag,
  Space,
  Divider,
  Modal,
  List,
  Typography,
  Badge,
  Row,
  Col,
  Select,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  InfoCircleOutlined,
  CloudUploadOutlined,
  HistoryOutlined,
  FilterOutlined,
} from '@ant-design/icons';

import { ICsvValidateResponse } from '@/Interface/File/ICvs';
import { useImportCsv, useValidateCsv, useDownloadTemplate, useExportAllProducts, useExportByCategory, useExportBySupplier, useRecentImports } from './Hook/useHandleCsvHook';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { TabPane } = Tabs;
const { Option } = Select;

const ProductCsvManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ICsvValidateResponse['data'] | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  // Hooks
  const importCsvMutation = useImportCsv();
  const validateCsvMutation = useValidateCsv();
  const downloadTemplateMutation = useDownloadTemplate();
  const exportAllMutation = useExportAllProducts();
  const exportByCategoryMutation = useExportByCategory();
  const exportBySupplierMutation = useExportBySupplier();
  const { data: recentImportsData, refetch: refetchRecentImports, isLoading: isLoadingHistory } = useRecentImports(10);

  // Dummy stats - có thể thay bằng API thực
  const stats = {
    totalProducts: 1245,
    lastImport: '2 hours ago',
    successRate: 98.5,
    pendingImports: 3,
  };

  // Dummy categories và suppliers - thay bằng API thực
  const categories = [
    { id: 'cat-1', name: 'Electronics' },
    { id: 'cat-2', name: 'Fashion' },
    { id: 'cat-3', name: 'Food & Beverage' },
  ];

  const suppliers = [
    { id: 'sup-1', name: 'Supplier A' },
    { id: 'sup-2', name: 'Supplier B' },
    { id: 'sup-3', name: 'Supplier C' },
  ];

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <Space>
          <FileExcelOutlined className="text-green-600" />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      responsive: ['md'] as any,
    },
    {
      title: 'Records',
      dataIndex: 'records',
      key: 'records',
      align: 'center' as const,
      render: (text: number) => <Badge count={text} showZero color="#52c41a" />,
    },
    {
      title: 'Errors',
      dataIndex: 'errors',
      key: 'errors',
      align: 'center' as const,
      render: (errors: number) => (
        <Tag color={errors === 0 ? 'success' : errors < 5 ? 'warning' : 'error'}>
          {errors} {errors === 1 ? 'error' : 'errors'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        const config: any = {
          success: { color: 'success', text: 'Success', icon: <CheckCircleOutlined /> },
          warning: { color: 'warning', text: 'Warning', icon: <ExclamationCircleOutlined /> },
          error: { color: 'error', text: 'Failed', icon: <ExclamationCircleOutlined /> },
        };
        const { color, text, icon } = config[status];
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
  ];

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    beforeUpload: (file: File) => {
      setSelectedFile(file);
      setValidationResult(null);
      return false;
    },
    onRemove: () => {
      setSelectedFile(null);
      setValidationResult(null);
    },
  };

  const handleDownloadTemplate = () => {
    downloadTemplateMutation.mutate();
  };

  const handleExportAll = () => {
    exportAllMutation.mutate();
  };

  const handleExportByCategory = () => {
    if (!selectedCategory) {
      Modal.warning({
        title: 'Chưa chọn danh mục',
        content: 'Vui lòng chọn danh mục trước khi export!',
      });
      return;
    }
    exportByCategoryMutation.mutate(selectedCategory);
  };

  const handleExportBySupplier = () => {
    if (!selectedSupplier) {
      Modal.warning({
        title: 'Chưa chọn nhà cung cấp',
        content: 'Vui lòng chọn nhà cung cấp trước khi export!',
      });
      return;
    }
    exportBySupplierMutation.mutate(selectedSupplier);
  };

  const handleValidate = async () => {
    if (!selectedFile) return;

    try {
      const result = await validateCsvMutation.mutateAsync(selectedFile);
      setValidationResult(result.data);
      setShowValidationModal(true);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      await importCsvMutation.mutateAsync(selectedFile);
      setSelectedFile(null);
      setValidationResult(null);
      setShowValidationModal(false);
      refetchRecentImports();
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const isUploading = importCsvMutation.isPending || validateCsvMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-2">
            <FileTextOutlined className="mr-3" />
            Product CSV Management
          </Title>
          <Text type="secondary" className="text-sm md:text-base">
            Import, export, and manage product data via CSV files
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Total Products"
                value={stats.totalProducts}
                valueStyle={{ color: '#1890ff', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}
                prefix={<FileExcelOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Last Import"
                value={stats.lastImport}
                valueStyle={{ color: '#52c41a', fontSize: window.innerWidth < 768 ? '16px' : '20px' }}
                prefix={<HistoryOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Success Rate"
                value={stats.successRate}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#52c41a', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Pending"
                value={stats.pendingImports}
                valueStyle={{ color: '#faad14', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Card className="shadow-md">
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            {/* Import Tab */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <UploadOutlined />
                  <span className="hidden sm:inline">Import CSV</span>
                  <span className="sm:hidden">Import</span>
                </span>
              }
              key="1"
            >
              <div className="space-y-6">
                {/* Instructions */}
                <Alert
                  message="Import Instructions"
                  description={
                    <div className="space-y-2 text-sm">
                      <p>1. Download the template CSV file to see the required format</p>
                      <p>2. Fill in your product data following the template structure</p>
                      <p>3. Upload your CSV file and validate it before importing</p>
                      <p>4. Review any errors or warnings before final import</p>
                    </div>
                  }
                  type="info"
                  icon={<InfoCircleOutlined />}
                  showIcon
                  className="mb-4"
                />

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="default"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadTemplate}
                    size="large"
                    loading={downloadTemplateMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    Download Template
                  </Button>
                  <Button icon={<InfoCircleOutlined />} size="large" className="w-full sm:w-auto">
                    View Guidelines
                  </Button>
                </div>

                <Divider />

                {/* Upload Area */}
                <div>
                  <Title level={4} className="!mb-4">
                    Upload CSV File
                  </Title>
                  <Dragger {...uploadProps} className="bg-gray-50 border-2 border-dashed hover:border-blue-400 transition-colors">
                    <p className="ant-upload-drag-icon">
                      <CloudUploadOutlined className="text-4xl md:text-5xl text-blue-500" />
                    </p>
                    <p className="ant-upload-text text-base md:text-lg font-semibold">Click or drag CSV file to this area</p>
                    <p className="ant-upload-hint text-xs md:text-sm px-4">
                      Support for a single CSV file upload. Maximum file size: 10MB
                    </p>
                  </Dragger>
                </div>

                {/* File Actions */}
                {selectedFile && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FileExcelOutlined className="text-2xl text-green-600" />
                        <div>
                          <Text strong className="block">
                            {selectedFile.name}
                          </Text>
                          <Text type="secondary" className="text-xs md:text-sm">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </Text>
                        </div>
                      </div>
                      <Space wrap>
                        <Button
                          type="default"
                          icon={<CheckCircleOutlined />}
                          onClick={handleValidate}
                          loading={validateCsvMutation.isPending}
                          className="w-full sm:w-auto"
                        >
                          Validate
                        </Button>
                        <Button
                          type="primary"
                          icon={<UploadOutlined />}
                          onClick={handleImport}
                          loading={importCsvMutation.isPending}
                          disabled={!validationResult?.is_valid}
                          className="w-full sm:w-auto"
                        >
                          Import Data
                        </Button>
                      </Space>
                    </div>
                  </div>
                )}

                {/* Validation Results */}
                {validationResult && (
                  <Alert
                    message={validationResult.is_valid ? 'Validation Passed' : 'Validation Failed'}
                    description={
                      <div className="space-y-2">
                        <p>Total rows: {validationResult.total_rows}</p>
                        <p>Errors: {validationResult.errors.length}</p>
                        {validationResult.warnings && validationResult.warnings.length > 0 && (
                          <p>Warnings: {validationResult.warnings.length}</p>
                        )}
                      </div>
                    }
                    type={validationResult.is_valid ? 'success' : 'error'}
                    showIcon
                    closable
                    onClose={() => setValidationResult(null)}
                  />
                )}
              </div>
            </TabPane>

            {/* Export Tab */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <DownloadOutlined />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </span>
              }
              key="2"
            >
              <div className="space-y-6">
                <Alert message="Export Options" description="Choose how you want to export your product data" type="info" showIcon icon={<InfoCircleOutlined />} />

                <Row gutter={[16, 16]}>
                  {/* Export All */}
                  <Col xs={24} md={12}>
                    <Card hoverable className="h-full border-2 hover:border-blue-400 transition-all">
                      <div className="text-center space-y-4">
                        <FileExcelOutlined className="text-5xl text-blue-500" />
                        <Title level={4}>Export All Products</Title>
                        <Paragraph type="secondary" className="text-sm">
                          Export complete product database to CSV file
                        </Paragraph>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={handleExportAll}
                          loading={exportAllMutation.isPending}
                          size="large"
                          block
                        >
                          Export All ({stats.totalProducts} products)
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  {/* Export by Category */}
                  <Col xs={24} md={12}>
                    <Card hoverable className="h-full border-2 hover:border-green-400 transition-all">
                      <div className="text-center space-y-4">
                        <FilterOutlined className="text-5xl text-green-500" />
                        <Title level={4}>Export by Category</Title>
                        <Paragraph type="secondary" className="text-sm">
                          Export products filtered by specific category
                        </Paragraph>
                        <Select
                          placeholder="Select category"
                          onChange={setSelectedCategory}
                          value={selectedCategory || undefined}
                          className="w-full mb-3"
                          size="large"
                        >
                          {categories.map((cat) => (
                            <Option key={cat.id} value={cat.id}>
                              {cat.name}
                            </Option>
                          ))}
                        </Select>
                        <Button
                          type="default"
                          icon={<DownloadOutlined />}
                          onClick={handleExportByCategory}
                          loading={exportByCategoryMutation.isPending}
                          size="large"
                          block
                        >
                          Export Selected Category
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  {/* Export by Supplier */}
                  <Col xs={24} md={12}>
                    <Card hoverable className="h-full border-2 hover:border-purple-400 transition-all">
                      <div className="text-center space-y-4">
                        <FilterOutlined className="text-5xl text-purple-500" />
                        <Title level={4}>Export by Supplier</Title>
                        <Paragraph type="secondary" className="text-sm">
                          Export products from specific supplier
                        </Paragraph>
                        <Select
                          placeholder="Select supplier"
                          onChange={setSelectedSupplier}
                          value={selectedSupplier || undefined}
                          className="w-full mb-3"
                          size="large"
                        >
                          {suppliers.map((sup) => (
                            <Option key={sup.id} value={sup.id}>
                              {sup.name}
                            </Option>
                          ))}
                        </Select>
                        <Button
                          type="default"
                          icon={<DownloadOutlined />}
                          onClick={handleExportBySupplier}
                          loading={exportBySupplierMutation.isPending}
                          size="large"
                          block
                        >
                          Export Selected Supplier
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  {/* Custom Export */}
                  <Col xs={24} md={12}>
                    <Card hoverable className="h-full border-2 hover:border-orange-400 transition-all">
                      <div className="text-center space-y-4">
                        <FilterOutlined className="text-5xl text-orange-500" />
                        <Title level={4}>Custom Filter Export</Title>
                        <Paragraph type="secondary" className="text-sm">
                          Apply custom filters to export specific products
                        </Paragraph>
                        <Button type="default" icon={<DownloadOutlined />} size="large" block>
                          Configure Filters
                        </Button>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            </TabPane>

            {/* History Tab */}
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <HistoryOutlined />
                  <span className="hidden sm:inline">Import History</span>
                  <span className="sm:hidden">History</span>
                </span>
              }
              key="3"
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <Title level={4} className="!mb-0">
                    Recent Imports
                  </Title>
                  <Button icon={<ReloadOutlined />} onClick={() => refetchRecentImports()} loading={isLoadingHistory}>
                    Refresh
                  </Button>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table
                    columns={columns}
                    dataSource={recentImportsData?.data || []}
                    rowKey="id"
                    loading={isLoadingHistory}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} imports`,
                    }}
                  />
                </div>

                {/* Mobile List */}
                <div className="md:hidden">
                  <List
                    loading={isLoadingHistory}
                    dataSource={recentImportsData?.data || []}
                    renderItem={(item: any) => (
                      <List.Item className="border border-gray-200 rounded-lg mb-3 p-4">
                        <div className="w-full space-y-2">
                          <div className="flex items-start justify-between">
                            <Space>
                              <FileExcelOutlined className="text-green-600 text-lg" />
                              <Text strong className="text-sm">
                                {item.fileName}
                              </Text>
                            </Space>
                            <Tag color={item.status === 'success' ? 'success' : 'warning'} icon={<CheckCircleOutlined />}>
                              {item.status}
                            </Tag>
                          </div>
                          <Text type="secondary" className="text-xs block">
                            {item.date}
                          </Text>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <div>
                              <Text className="text-xs">Records: </Text>
                              <Badge count={item.records} showZero color="#52c41a" />
                            </div>
                            <div>
                              <Text className="text-xs">Errors: </Text>
                              <Tag color={item.errors === 0 ? 'success' : 'warning'} className="text-xs">
                                {item.errors}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Validation Modal */}
        <Modal
          title="Validation Results"
          open={showValidationModal}
          onCancel={() => setShowValidationModal(false)}
          footer={[
            <Button key="close" onClick={() => setShowValidationModal(false)}>
              Close
            </Button>,
            <Button
              key="import"
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleImport}
              loading={importCsvMutation.isPending}
              disabled={!validationResult?.is_valid}
            >
              Proceed to Import
            </Button>,
          ]}
          width={700}
        >
          {validationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Statistic title="Total Rows" value={validationResult.total_rows} prefix={<FileTextOutlined />} />
                <Statistic
                  title="Errors"
                  value={validationResult.errors.length}
                  valueStyle={{ color: validationResult.errors.length > 0 ? '#cf1322' : '#52c41a' }}
                  prefix={<ExclamationCircleOutlined />}
                />
                <Statistic
                  title="Warnings"
                  value={validationResult.warnings?.length || 0}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ExclamationCircleOutlined />}
                />
              </div>

              {validationResult.errors.length > 0 && (
                <div>
                  <Title level={5}>Errors</Title>
                  <List
                    size="small"
                    dataSource={validationResult.errors}
                    renderItem={(item) => (
                      <List.Item>
                        <Text type="danger" className="text-sm">
                          {item}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
              )}

              {validationResult.warnings && validationResult.warnings.length > 0 && (
                <div>
                  <Title level={5}>Warnings</Title>
                  <List
                    size="small"
                    dataSource={validationResult.warnings}
                    renderItem={(item) => (
                      <List.Item>
                        <Text type="warning" className="text-sm">
                          {item}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ProductCsvManager;