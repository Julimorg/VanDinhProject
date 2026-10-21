import React from 'react';
import { Card, CardContent, TextField, Chip, IconButton, Skeleton, Popover, Button, Stack, Typography } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

interface CartItem {
  cartItemId: string;
  product: {
    productName: string;
    productImage: string[];
    categoryName: string;
    productCode: string;
    productVolume: string;
    productUnit: string;
    productPrice: string;
    productQuantity: number;
  };
}

interface CartItemsCardProps {
  localCart: CartItem[];
  isLoading: boolean;
  handleQuantityChange: (cartItemId: string, value: number) => void;
  handleRemoveItem: (cartItemId: string) => void;
  formatCurrency: (amount: number) => string;
  handleUpdateItem: (cartItemId: string) => void;
}

const RemoveConfirmButton: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" color="error" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <DeleteOutlineRoundedIcon fontSize="small" />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Stack spacing={1} sx={{ p: 2, maxWidth: 240 }}>
          <Typography variant="body2" fontWeight={600}>Xóa sản phẩm</Typography>
          <Typography variant="caption" color="text.secondary">Bạn có chắc muốn xóa sản phẩm này?</Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" onClick={() => setAnchorEl(null)}>Hủy</Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => {
                onConfirm();
                setAnchorEl(null);
              }}
            >
              Xóa
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

const CartItemsCard: React.FC<CartItemsCardProps> = ({
  localCart,
  isLoading,
  handleQuantityChange,
  handleRemoveItem,
  formatCurrency,
  handleUpdateItem,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Skeleton variant="rounded" width={120} height={120} />
                <Stack flex={1} spacing={1}>
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="40%" />
                  <Skeleton width="80%" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-4">
      {localCart.map((item) => (
        <Card key={item.cartItemId} variant="outlined" className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <img
                  src={item.product.productImage[0]}
                  alt={item.product.productName}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product.productName}</h3>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={item.product.categoryName} color="info" size="small" />
                      <Chip label={item.product.productCode} size="small" variant="outlined" />
                    </Stack>
                  </div>
                  <RemoveConfirmButton onConfirm={() => handleRemoveItem(item.cartItemId)} />
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {item.product.productVolume} - {item.product.productUnit}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Số lượng:</span>
                      <TextField
                        type="number"
                        size="small"
                        value={item.product.productQuantity}
                        onChange={(e) => {
                          const value = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                          handleQuantityChange(item.cartItemId, value);
                        }}
                        slotProps={{ htmlInput: { min: 1, max: 100 } }}
                        className="w-20 sm:w-24"
                      />
                    </div>
                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      onClick={() => handleUpdateItem(item.cartItemId)}
                      className="sm:mt-0 mt-2 w-full sm:w-auto"
                    >
                      Cập nhật
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(parseFloat(item.product.productPrice) * item.product.productQuantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(parseFloat(item.product.productPrice))} / {item.product.productUnit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CartItemsCard;
