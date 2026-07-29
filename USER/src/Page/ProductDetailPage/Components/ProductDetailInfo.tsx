// Components/ProductDetailInfo.tsx
import React from 'react';
import { Card, Typography, Empty } from 'antd';

const { Text } = Typography;

type ExtraSpecValue = string | number | boolean | null;

interface PaintDetailData {
  colorName?: string;
  colorCode?: string;
  hexCode?: string;
  surfaceType?: string;
  finishType?: string;
  volume?: string;
  extraSpecs?: Record<string, ExtraSpecValue>;
}
interface ToolDetailData {
  toolType?: string;
  volume?: string;
  extraSpecs?: Record<string, ExtraSpecValue>;
}
interface ChemicalDetailData {
  chemicalType?: string;
  volume?: string;
  extraSpecs?: Record<string, ExtraSpecValue>;
}

interface ProductDetailInfoProps {
  paintDetail?: PaintDetailData;
  toolDetail?: ToolDetailData;
  chemicalDetail?: ChemicalDetailData;
}

const Row: React.FC<{ label: string; value: React.ReactNode; swatch?: string }> = ({ label, value, swatch }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <Text type="secondary" className="text-sm">
      {label}
    </Text>
    <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
      {swatch && (
        <span className="inline-block w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: swatch }} />
      )}
      {value ?? 'N/A'}
    </span>
  </div>
);

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({ paintDetail, toolDetail, chemicalDetail }) => {
  const hasDetail = paintDetail || toolDetail || chemicalDetail;
  const title = paintDetail ? 'Paint Detail' : toolDetail ? 'Tool Detail' : chemicalDetail ? 'Chemical Detail' : 'Chi tiết';

  return (
    <Card title={title} className="!border-gray-100 !shadow-sm h-full">
      {paintDetail && (
        <>
          <Row label="Color Name" value={paintDetail.colorName} />
          <Row label="Color Code" value={paintDetail.colorCode} />
          <Row label="HEX Code" value={paintDetail.hexCode} swatch={paintDetail.hexCode} />
          <Row label="Surface Type" value={paintDetail.surfaceType} />
          <Row label="Volume" value={paintDetail.volume} />
          {paintDetail.finishType && <Row label="Finish Type" value={paintDetail.finishType} />}
        </>
      )}
      {toolDetail && (
        <>
          <Row label="Tool Type" value={String(toolDetail.toolType)} />
          <Row label="Volume / Size" value={toolDetail.volume} />
        </>
      )}
      {chemicalDetail && (
        <>
          <Row label="Chemical Type" value={String(chemicalDetail.chemicalType)} />
          <Row label="Volume" value={chemicalDetail.volume} />
        </>
      )}
      {!hasDetail && <Empty description="Chưa có thông tin chi tiết" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
  );
};

export default ProductDetailInfo;