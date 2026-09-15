import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvironmentOutlined, PhoneOutlined, RightOutlined, ShopOutlined } from '@ant-design/icons';
import type { IGetAllSupplierResponse } from '../../../Interface/Supplier/IGetAllSuppliers';

interface SupplierCardProps {
  supplier: IGetAllSupplierResponse;
  /** Tuỳ biến path điều hướng nếu route thật khác /suppliers/:id */
  linkTo?: (supplierId: string) => string;
  /** Thứ tự trong danh sách — dùng để so le hiệu ứng xuất hiện, không bắt buộc */
  index?: number;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  linkTo = (id) => `/suppliers/${id}`,
  index = 0,
}) => {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(linkTo(supplier.supplierId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToDetail();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      className="supplier-card-enter group flex gap-4 p-4 bg-white border border-[#ECEAE5] rounded-lg cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(23,23,22,0.18)] hover:border-[#D8D5CE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      {/* Thumbnail — grayscale ở trạng thái nghỉ, hiện màu thật khi hover */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-md bg-[#F1F0EC]">
        {supplier.supplierImg ? (
          <img
            alt={supplier.supplierName}
            src={supplier.supplierImg}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#C9C6BE]">
            <ShopOutlined style={{ fontSize: 28 }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#171716] truncate">
            {supplier.supplierName}
          </h3>

          <div className="mt-1.5 flex items-start gap-1.5 text-sm text-[#8A867E]">
            <EnvironmentOutlined className="mt-0.5 flex-shrink-0 text-[#ADA99F]" />
            <span className="line-clamp-1">
              {supplier.supplierAddress || 'Chưa cập nhật địa chỉ'}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-[#6E6B66]">
            <PhoneOutlined className="flex-shrink-0 text-[#ADA99F]" />
            <span>{supplier.supplierPhone || 'Chưa cập nhật'}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#F1F0EC] flex items-center justify-between">
          <span className="text-xs text-[#ADA99F]">
            Cập nhật {formatDate(supplier.updateAt)}
          </span>
          <RightOutlined className="text-xs text-[#C9C6BE] group-hover:text-[#171716] group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;