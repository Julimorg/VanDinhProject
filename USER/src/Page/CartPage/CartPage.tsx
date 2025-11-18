import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, InputNumber, Empty, Divider, Space, Image, Tag, Popconfirm, message, Skeleton } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useGetAllCarts } from './Hook/useGetAllCarts';
import { useAuthStoreCookiesStorage } from '../../Middleware/useAuthStore';
import { useUpdateCartItemQuantity } from './Hook/useUpdateCartItemQuantity';
import { useDeleteCartItem } from './Hook/useDeleteCartItem';
import { toast } from 'react-toastify';
import { useCartStore } from '../../Middleware/useCartStore';

const CartPage: React.FC = () => {
  const { id: userId } = useAuthStoreCookiesStorage();
  const { data: cartResponse, isLoading, isError, refetch } = useGetAllCarts(userId ?? '');
  const deleteCartItemMutation = useDeleteCartItem();
  const updateCartItemQuantityMutation = useUpdateCartItemQuantity({
    onSuccess: () => {
      toast.success('Cập nhật số lượng thành công');
      refetch();
    },
    onError: (err) => message.error('Cập nhật thất bại: ' + err.message),
  });
  const setCartCount = useCartStore(state => state.setCartCount);

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

  const calculateTotal = () => localCart.reduce(
    (total, item) => total + parseFloat(item.product.productPrice) * item.product.productQuantity,
    0
  );

  const calculateTotalQuantity = () => localCart.reduce(
    (total, item) => total + item.product.productQuantity,
    0
  );

  const handleQuantityChange = (cartItemId: string, value: number) => {
    if (value < 1) return;
    setLocalCart(prev =>
      prev.map(item =>
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
    setLocalCart(prev => prev.filter(item => item.cartItemId !== cartItemId));

    deleteCartItemMutation.mutate(cartItemId, {
      onSuccess: () => {
        toast.success('Xóa sản phẩm thành công');
        refetch();
      },
      onError: (err) => {
        message.error('Xóa thất bại: ' + err.message);
        setLocalCart(prev => [...prev]);
      }
    });
  };

  if (isError) return <p className="p-8 text-center text-red-600">Không thể tải giỏ hàng.</p>;

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
          <p className="text-gray-600 mt-2">
            {calculateTotalQuantity()} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Card key={idx}>
                    <Skeleton avatar paragraph={{ rows: 3 }} active />
                  </Card>
                ))
              : localCart.map(item => (
                  <Card key={item.cartItemId} className="hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.product.productImage[0]}
                          alt={item.product.productName}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product.productName}</h3>
                            <Space size="small" wrap>
                              <Tag color="blue">{item.product.categoryName}</Tag>
                              <Tag>{item.product.productCode}</Tag>
                            </Space>
                          </div>
                          <Popconfirm
                            title="Xóa sản phẩm"
                            description="Bạn có chắc muốn xóa sản phẩm này?"
                            onConfirm={() => handleRemoveItem(item.cartItemId)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {item.product.productVolume} - {item.product.productUnit}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <InputNumber
                              min={1}
                              max={100}
                              value={item.product.productQuantity}
                              onChange={(value) => handleQuantityChange(item.cartItemId, value!)}
                              className="w-24"
                            />
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
                  </Card>
                ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="text-green-600">Miễn phí</span>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  <Button type="primary" size="large" block className="mb-3">
                    Tiến hành thanh toán
                  </Button>

                  <Button size="large" block>
                    Tiếp tục mua sắm
                  </Button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">🎉 Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
