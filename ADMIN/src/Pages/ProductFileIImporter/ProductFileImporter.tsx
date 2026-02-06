import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import { ICsvValidateResponse } from '@/Interface/File/ICvs';
import ExportSection from './Components/ExportSection';
import ImportSection from './Components/ImportSection';
import StatsCards from './Components/StatsCards';
import ValidationModal from './Components/ValidationModal';
import { useImportCsv, useValidateCsv, useDownloadTemplate, useExportAllProducts } from './Hook/useHandleCsvHook';


const ProductCsvManager: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ICsvValidateResponse['data'] | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const importCsvMutation = useImportCsv();
  const validateCsvMutation = useValidateCsv();
  const downloadTemplateMutation = useDownloadTemplate();
  const exportAllMutation = useExportAllProducts();

  
  const stats = {
    totalProducts: 1245,
    lastImport: '2 hours ago',
    successRate: 98.5,
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
      // Reset sau khi import thành công
      setSelectedFile(null);
      setValidationResult(null);
      setShowValidationModal(false);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <FileTextOutlined /> Quản lý sản phẩm qua CSV
          </h2>
          <p className="text-gray-500 text-base">
            Nhập / xuất dữ liệu sản phẩm bằng file CSV
          </p>
        </div>

        <StatsCards stats={stats} />

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <ImportSection
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              validationResult={validationResult}
              setValidationResult={setValidationResult}
              isValidating={validateCsvMutation.isPending}
              isImporting={importCsvMutation.isPending}
              onValidate={handleValidate}
              onImport={handleImport}
              onDownloadTemplate={() => downloadTemplateMutation.mutate()}
              isDownloadingTemplate={downloadTemplateMutation.isPending}
            />
          </Col>

          <Col xs={24} lg={10}>
            <ExportSection
              totalProducts={stats.totalProducts}
              onExportAll={() => exportAllMutation.mutate()}
              isExporting={exportAllMutation.isPending}
            />
          </Col>
        </Row>

        <ValidationModal
          open={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          validationResult={validationResult}
          onImport={handleImport}
          isImporting={importCsvMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ProductCsvManager;