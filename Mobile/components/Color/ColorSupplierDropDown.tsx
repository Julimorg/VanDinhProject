
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetSupplierSelections } from '@/hooks/Product/useGetSupplierSelection'; 

interface ColorSupplierDropdownProps {
  selectedSupplierName: string | null;
  onSelectSupplier: (supplierName: string | null) => void; 
}

export const ColorSupplierDropdown: React.FC<ColorSupplierDropdownProps> = ({
  selectedSupplierName,
  onSelectSupplier,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isLoading,
    error: fetchError,
  } = useGetSupplierSelections({
    enabled: isOpen, 
  });

  const suppliers = data?.data || [];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (supplierName: string) => {
    const newName = selectedSupplierName === supplierName ? null : supplierName;
    onSelectSupplier(newName);
    // Optional: đóng dropdown sau khi chọn
    // setIsOpen(false);
  };

  return (
    <View>
      {/* Nút mở dropdown */}
      <TouchableOpacity
        onPress={toggleDropdown}
        className="flex-row items-center justify-between py-4 border-b border-gray-200"
        activeOpacity={0.7}
      >
        <Text className="text-base font-medium text-gray-800">
          Nhà cung cấp{' '}
          {selectedSupplierName ? (
            <Text className="font-semibold text-blue-600">
              ({selectedSupplierName})
            </Text>
          ) : (
            ''
          )}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Danh sách khi mở */}
      {isOpen && (
        <View className="mt-4 mb-6 bg-gray-50 rounded-2xl shadow-md">
          <View className="max-h-80">
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              {/* Loading */}
              {isLoading ? (
                <View className="py-12 items-center">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="mt-4 text-gray-500">Đang tải danh sách...</Text>
                </View>
              ) : fetchError ? (
                <View className="py-12 items-center">
                  <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                  <Text className="mt-4 text-red-600 font-medium text-center">
                    Không thể tải danh sách nhà cung cấp
                  </Text>
                </View>
              ) : suppliers.length === 0 ? (
                <View className="py-12 items-center">
                  <Ionicons name="information-circle-outline" size={48} color="#6B7280" />
                  <Text className="mt-4 text-gray-500 text-center">
                    Không có nhà cung cấp nào
                  </Text>
                </View>
              ) : (
                <>
                  {suppliers.map((item) => (
                    <TouchableOpacity
                      key={item.supplierId}
                      onPress={() => handleSelect(item.supplierName)}
                      className="py-3.5 flex-row items-center"
                      activeOpacity={0.7}
                    >
                      {/* Checkmark */}
                      <View className="mr-4">
                        {selectedSupplierName === item.supplierName ? (
                          <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </View>
                        ) : (
                          <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
                        )}
                      </View>

                      {/* Tên nhà cung cấp */}
                      <Text
                        className={`text-base flex-1 ${
                          selectedSupplierName === item.supplierName
                            ? 'font-semibold text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.supplierName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};