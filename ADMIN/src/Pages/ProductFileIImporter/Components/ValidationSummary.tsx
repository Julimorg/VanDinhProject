import { Alert } from 'antd';

interface Props {
  result: any;
  onClose: () => void;
}

export default function ValidationSummary({ result, onClose }: Props) {
  return (
    <Alert
      message={result.is_valid ? 'Kiểm tra hợp lệ' : 'Kiểm tra thất bại'}
      description={
        <div className="space-y-1">
          <p>Tổng dòng: {result.total_rows}</p>
          <p>Lỗi: {result.errors.length}</p>
          {result.warnings?.length > 0 && <p>Cảnh báo: {result.warnings.length}</p>}
        </div>
      }
      type={result.is_valid ? 'success' : 'error'}
      showIcon
      closable
      onClose={onClose}
    />
  );
}