import React, { type ReactNode } from 'react';

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, fullWidth = false }) => {
  return (
    <div className={`${fullWidth ? 'col-span-1 lg:col-span-2' : ''}`}>
      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-base font-medium text-gray-900 break-words">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoItem;