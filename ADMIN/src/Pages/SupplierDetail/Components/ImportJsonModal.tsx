import React, { useState } from 'react';
import { Modal, Upload, Button, Typography, Alert, List, Space } from 'antd';
import { InboxOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { toast } from 'react-toastify';
import { COLOR_IMPORT_JSON_TEMPLATE } from '@/Constant/color-import-template';
import { downloadJsonTemplate } from '@/Utils/ulti';
import { useImportColorJson } from '../hooks/useImportJson';

const { Dragger } = Upload;
const { Text } = Typography;

interface ImportColorJsonModalProps {
  visible: boolean;
  onCancel: () => void;
  supplierId: string;
  onImportSuccess?: () => void;
}

const ImportColorJsonModal: React.FC<ImportColorJsonModalProps> = ({
  visible,
  onCancel,
  supplierId,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [rowErrors, setRowErrors] = useState<string[]>([]);

  const importMutation = useImportColorJson();

  const handleClose = () => {
    setFile(null);
    setFileList([]);
    setRowErrors([]);
    onCancel();
  };

  const handleDownloadTemplate = () => {
    downloadJsonTemplate(COLOR_IMPORT_JSON_TEMPLATE, 'color_import_template.json');
  };

  const handleOk = () => {
    if (!file) {
      toast.warn('Vui lòng chọn file JSON để import!');
      return;
    }

    importMutation.mutate(
      { supplierId, file },
      {
        onSuccess: (response) => {
          const result = response.data as (typeof response.data & {
            success?: boolean;
            errors?: string[];
          });
          const hasErrors = Array.isArray(result.errors) && result.errors.length > 0;

          if (result.success ?? !hasErrors) {
            toast.success(`Import thành công ${result.successCount}/${result.totalRows} màu!`);
            onImportSuccess?.();
            handleClose();
          } else {
            setRowErrors(result.errors ?? []);
          }
        },
      }
    );
  };

  return (
    <Modal
      title="Import màu từ file JSON"
      open={visible}
      onOk={handleOk}
      onCancel={handleClose}
      okText="Import"
      cancelText="Hủy"
      confirmLoading={importMutation.isPending}
      okButtonProps={{ disabled: !file || importMutation.isPending }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center">
          <Text type="secondary" className="text-xs">
            Chưa có file mẫu? Tải template để điền đúng định dạng.
          </Text>
          <Button size="small" icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
            Tải template
          </Button>
        </div>

        <Dragger
          accept=".json"
          maxCount={1}
          fileList={fileList}
          beforeUpload={(f) => {
            setFile(f);
            setFileList([{ uid: f.uid ?? f.name, name: f.name, status: 'done' } as UploadFile]);
            setRowErrors([]);
            return false;
          }}
          onRemove={() => {
            setFile(null);
            setFileList([]);
            setRowErrors([]);
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Kéo thả file JSON vào đây hoặc bấm để chọn</p>
        </Dragger>

        {rowErrors.length > 0 && (
          <Alert
            type="error"
            message={`Import thất bại — ${rowErrors.length} dòng lỗi, chưa có màu nào được lưu`}
            description={
              <List
                size="small"
                dataSource={rowErrors}
                renderItem={(err) => <List.Item className="text-xs">{err}</List.Item>}
              />
            }
          />
        )}
      </Space>
    </Modal>
  );
};

export default ImportColorJsonModal;