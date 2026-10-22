import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
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
      className="supplier-card-enter group flex flex-col h-full bg-white border border-stone-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(23,23,22,0.28)] hover:border-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      {/* Cover image — to, full mau, khong grayscale */}
      <div className="relative w-full aspect-[16/9] flex-shrink-0 overflow-hidden bg-stone-100">
        {supplier.supplierImg ? (
          <img
            alt={supplier.supplierName}
            src={supplier.supplierImg}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <StorefrontRoundedIcon sx={{ fontSize: 56 }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
        <h3 className="absolute bottom-3 left-4 right-4 text-lg font-bold text-white leading-snug line-clamp-1">
          {supplier.supplierName}
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 gap-2.5">
        <div className="flex items-start gap-2 text-sm text-stone-600">
          <RoomRoundedIcon className="mt-0.5 flex-shrink-0 text-stone-400" sx={{ fontSize: 18 }} />
          <span className="line-clamp-2">
            {supplier.supplierAddress || 'Chưa cập nhật địa chỉ'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-stone-600">
          <PhoneRoundedIcon className="flex-shrink-0 text-stone-400" sx={{ fontSize: 18 }} />
          <span className="truncate">{supplier.supplierPhone || 'Chưa cập nhật'}</span>
        </div>

        {supplier.supplierEmail && (
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <MailRoundedIcon className="flex-shrink-0 text-stone-400" sx={{ fontSize: 18 }} />
            <span className="truncate">{supplier.supplierEmail}</span>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <span className="text-xs text-stone-400">
            Cập nhật {formatDate(supplier.updateAt)}
          </span>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              goToDetail();
            }}
            startIcon={<PaletteOutlinedIcon sx={{ fontSize: 16 }} />}
            endIcon={<ChevronRightRoundedIcon sx={{ fontSize: 16 }} className="transition-transform duration-300 group-hover:translate-x-0.5" />}
            sx={{ borderRadius: '4px', fontSize: '0.72rem', flexShrink: 0 }}
          >
            Bảng màu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
