import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useGetAllCarts } from './Hook/useGetAllCarts';
import { useUpdateCartItemQuantity } from './Hook/useUpdateCartItemQuantity';
import { useDeleteCartItem } from './Hook/useDeleteCartItem';
import { toast } from 'react-toastify';
import { useCartStore } from '../../Middleware/useCartStore';
import CartItemsCard from './Components/CartItemsCard';
import OrderSummary from './Components/OrderSummary';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const { id: userId } = useAuthStore();
  const { data: cartResponse, isLoading, isError, refetch } = useGetAllCarts(userId ?? '');
  const deleteCartItemMutation = useDeleteCartItem();
  const updateCartItemQuantityMutation = useUpdateCartItemQuantity({
    onSuccess: () => {
      toast.success('Cập nhật số lượng thành công');
      refetch();
    },
    onError: (err) => {
      toast.error('Cập nhật thất bại: ' + err.message);
    },
  });
  const setCartCount = useCartStore((state) => state.setCartCount);
  const [localCart, setLocalCart] = useState<any[]>([]);

  useEffect(() => {
    if (cartResponse?.data?.items) {
      setLocalCart(cartResponse.data.items);
      const totalQuantity = cartResponse.data.items.reduce(
        (total, item) => total + item.product.productQuantity,
        0
      );
      setCartCount(totalQuantity);
    }
  }, [cartResponse?.data?.items]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const calculateTotal = () =>
    localCart.reduce(
      (total, item) => total + parseFloat(item.product.productPrice) * item.product.productQuantity,
      0
    );

  const calculateTotalQuantity = () =>
    localCart.reduce((total, item) => total + item.product.productQuantity, 0);

  const handleQuantityChange = (cartItemId: string, value: number) => {
    if (value < 1) return;
    setLocalCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, product: { ...item.product, productQuantity: value } }
          : item
      )
    );
  };

  const handleUpdateItem = (cartItemId: string) => {
    const item = localCart.find((i) => i.cartItemId === cartItemId);
    if (!item) {
      return;
    }

    updateCartItemQuantityMutation.mutate({
      cartItemId: item.cartItemId,
      quantity: item.product.productQuantity,
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setLocalCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));

    deleteCartItemMutation.mutate(cartItemId, {
      onSuccess: () => {
        toast.success('Xóa sản phẩm thành công');
        refetch();
      },
      onError: (err) => {
        toast.error('Xóa thất bại: ' + err.message);
        setLocalCart((prev) => [...prev]);
      },
    });
  };

  if (isError) return <p className="p-8 text-center text-red-600">Không thể tải giỏ hàng.</p>;

  if (!localCart.length && !isLoading)
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center my-16 gap-4 text-center">
            <p className="text-2xl font-semibold text-gray-800">Giỏ hàng của bạn đang trống</p>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              startIcon={<ShoppingCartOutlinedIcon />}
              size="large"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mt-2">{calculateTotalQuantity()} sản phẩm trong giỏ hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <CartItemsCard
            localCart={localCart}
            isLoading={isLoading}
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
            formatCurrency={formatCurrency}
            handleUpdateItem={handleUpdateItem}
          />

          <OrderSummary
            isLoading={isLoading}
            total={calculateTotal()}
            totalQuantity={calculateTotalQuantity()}
            formatCurrency={formatCurrency}
            userId={userId ?? ''}
            cartId={cartResponse?.data?.cartId ?? ''}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
