
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetProductDetail } from '@/hooks/Product/useGetProductDetail';
import { formatCurrency } from '@/Utils/utils';
import { ProductImageCarousel } from '@/components/ProductDetail/ProductImageSwiper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  // Nếu dùng React Navigation:
  // const route = useRoute();
  // const { productId } = route.params as { productId: string };

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetProductDetail(productId);

  const product = data?.data;

  // Loading state
  if (isLoading || isRefetching) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#EC4899" />
        <Text className="mt-4 text-gray-600">Đang tải chi tiết sản phẩm...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-8">
        <Text className="text-red-600 text-center text-lg font-medium mb-6">
          Không thể tải thông tin sản phẩm
        </Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text className="text-blue-600 text-lg underline">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ProductImageCarousel images={product.productImage} />

        {/* Phần nội dung chi tiết */}
        <View className="bg-white rounded-t-3xl -mt-8 px-6 pt-10 pb-12 shadow-lg">
          {/* Tên sản phẩm */}
          <Text className="text-2xl font-extrabold text-gray-900 mb-4">
            {product.productName}
          </Text>

          {/* Giá và giảm giá */}
          <View className="flex-row items-end mb-4">
            <Text className="text-3xl font-bold text-pink-600">
              {formatCurrency(product.productPrice)}
            </Text>

            {product.discount > 0 && (
              <Text className="text-lg text-gray-500 line-through ml-4">
                {formatCurrency(
                  Math.round(product.productPrice / (1 - product.discount / 100))
                )}
              </Text>
            )}
          </View>

          {/* Tag giảm giá */}
          {product.discount > 0 && (
            <View className="bg-pink-100 px-4 py-2 rounded-full self-start mb-6">
              <Text className="text-pink-700 font-bold">
                Giảm {product.discount}%
              </Text>
            </View>
          )}

          {/* Thông tin chi tiết dạng bảng */}
          <View className="space-y-4">
            <InfoRow label="Mã sản phẩm" value={product.productCode} />
            <InfoRow label="Danh mục" value={product.categoryName} />
            <InfoRow label="Nhà cung cấp" value={product.supplierName} />
            <InfoRow label="Màu sắc" value={product.colorName || 'Không có'} />
            <InfoRow
              label="Dung tích"
              value={
                product.productVolume && product.productUnit
                  ? `${product.productVolume} ${product.productUnit}`
                  : 'Không có'
              }
            />
            <InfoRow
              label="Tồn kho"
              value={`${product.productQuantity} sản phẩm`}
            />
          </View>

          {/* Mô tả sản phẩm */}
          <View className="mt-8">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Mô tả sản phẩm
            </Text>
            <Text className="text-base text-gray-700 leading-7">
              {product.productDescription || 'Không có mô tả chi tiết.'}
            </Text>
          </View>

          {/* Ngày tạo / cập nhật (tùy chọn hiển thị) */}
          {/* <View className="mt-6 pt-6 border-t border-gray-200">
            <Text className="text-sm text-gray-500">
              Cập nhật lần cuối: {new Date(product.updateAt).toLocaleDateString('vi-VN')}
            </Text>
          </View> */}
        </View>
      </ScrollView>

      {/* Có thể thêm fixed bottom bar sau này (giỏ hàng, liên hệ,...) */}
      {/* <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity className="bg-pink-600 py-4 rounded-xl flex-row justify-center items-center">
          <Ionicons name="cart-outline" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-3">Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

// Component nhỏ tái sử dụng cho các dòng thông tin
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View className="flex-row justify-between py-3 border-b border-gray-100">
    <Text className="text-gray-600 font-medium w-32">{label}</Text>
    <Text className="text-gray-900 font-semibold text-right flex-1">
      {value}
    </Text>
  </View>
);