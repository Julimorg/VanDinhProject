import React, { useState, useEffect, useRef } from 'react';
import { Empty, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useGetAllCarts } from './Hook/useGetAllCarts';
import { useAuthStoreCookiesStorage } from '../../Middleware/useAuthStore';
import { useUpdateCartItemQuantity } from './Hook/useUpdateCartItemQuantity';
import { useDeleteCartItem } from './Hook/useDeleteCartItem';
import { toast } from 'react-toastify';
import { useCartStore } from '../../Middleware/useCartStore';
import CartItemsCard from './Components/CartItemsCard';
import OrderSummary from './Components/OrderSummary';

const CartPage: React.FC = () => {
  const { id: userId } = useAuthStoreCookiesStorage();
  const { data: cartResponse, isLoading, isError, refetch } = useGetAllCarts(userId ?? '');
  const deleteCartItemMutation = useDeleteCartItem();
  const updateCartItemQuantityMutation = useUpdateCartItemQuantity({
    onSuccess: () => {
      toast.success('Cập nhật số lượng thành công');
      refetch();
    },
    onError: (err) => {
      // Sử dụng toast thay vì message để nhất quán
      toast.error('Cập nhật thất bại: ' + err.message);
    },
  });
  const setCartCount = useCartStore((state) => state.setCartCount);

  const [localCart, setLocalCart] = useState<any[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateCartItemQuantityMutation.mutate({ cartItemId, quantity: value });
    }, 500);
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
        // Khôi phục local state nếu lỗi
        setLocalCart((prev) => [...prev]);
      },
    });
  };

  // Xử lý lỗi
  if (isError) return <p className="p-8 text-center text-red-600">Không thể tải giỏ hàng.</p>;

  // Xử lý empty state
  if (!localCart.length && !isLoading)
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Giỏ hàng của bạn đang trống"
            className="my-16"
          >
            <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
              Tiếp tục mua sắm
            </Button>
          </Empty>
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
