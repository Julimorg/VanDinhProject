import React from 'react';
import { Button } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
  return (
    <div className="flex gap-2">
      <Button
        icon={<AppstoreOutlined />}
        type={viewMode === 'grid' ? 'primary' : 'default'}
        onClick={() => onChange('grid')}
      />
      <Button
        icon={<UnorderedListOutlined />}
        type={viewMode === 'list' ? 'primary' : 'default'}
        onClick={() => onChange('list')}
      />
    </div>
  );
};

export default ViewToggle;