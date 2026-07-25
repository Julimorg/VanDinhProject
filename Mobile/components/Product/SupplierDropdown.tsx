import React, { useState, useRef, useCallback, useMemo, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetSupplierSelections } from "../../hooks/Product/useGetSupplierSelection";

interface SupplierOption {
  supplierId: string;
  supplierName: string;
  supplierImg?: string;
  productCount?: number;
}

interface SupplierFilterDropdownProps {
  selectedSuppliers: string[];
  onChangeSuppliers: (names: string[]) => void;
}

const VISIBLE_LIMIT = 6;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DEFAULT_POS = { top: 140, right: 16 };

const SkeletonRow = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className="flex-row items-center py-3 px-1"
    >
      <View className="w-9 h-9 rounded-full bg-gray-200 mr-3" />
      <View className="flex-1">
        <View className="h-3.5 bg-gray-200 rounded w-1/2 mb-2" />
        <View className="h-3 bg-gray-200 rounded w-1/3" />
      </View>
      <View className="w-5 h-5 rounded-md bg-gray-200" />
    </Animated.View>
  );
};

const SupplierAvatar: React.FC<{ name: string; uri?: string }> = ({
  name,
  uri,
}) => {
  if (uri) {
    return (
      <View className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 mr-3">
        <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
      </View>
    );
  }
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <View className="w-9 h-9 rounded-full bg-blue-50 mr-3 items-center justify-center">
      <Text className="text-blue-600 font-bold text-sm">{initial}</Text>
    </View>
  );
};

const SupplierRow = memo<{
  item: SupplierOption;
  checked: boolean;
  onToggle: () => void;
}>(({ item, checked, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    activeOpacity={0.6}
    className="flex-row items-center py-3 px-1"
  >
    <SupplierAvatar name={item.supplierName} uri={item.supplierImg} />
    <View className="flex-1">
      <Text
        className={`text-[15px] ${checked ? "font-semibold text-gray-900" : "text-gray-800"}`}
        numberOfLines={1}
      >
        {item.supplierName}
      </Text>
      {typeof item.productCount === "number" && (
        <Text className="text-xs text-gray-400 mt-0.5">
          {item.productCount} sản phẩm
        </Text>
      )}
    </View>
    <View
      className={`w-5 h-5 rounded-md border-2 items-center justify-center ${
        checked ? "bg-blue-600 border-blue-600" : "border-gray-300"
      }`}
    >
      {checked && <Ionicons name="checkmark" size={14} color="#FFF" />}
    </View>
  </TouchableOpacity>
));
SupplierRow.displayName = "SupplierRow";

export const SupplierFilterDropdown: React.FC<SupplierFilterDropdownProps> = ({
  selectedSuppliers,
  onChangeSuppliers,
}) => {
  const anchorRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState(DEFAULT_POS);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const {
    data,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetSupplierSelections({
    enabled: isOpen,
  });

  const suppliers: SupplierOption[] = data?.data ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => s.supplierName.toLowerCase().includes(q));
  }, [suppliers, search]);

  const visibleSuppliers =
    showAll || search.trim() ? filtered : filtered.slice(0, VISIBLE_LIMIT);
  const hasMore = !showAll && !search.trim() && filtered.length > VISIBLE_LIMIT;
  const hasActive = selectedSuppliers.length > 0;

  const measure = useCallback(() => {
    requestAnimationFrame(() => {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        if (width === 0 && height === 0) return;
        setAnchorLayout({
          top: y + height + 8,
          right: Math.max(12, SCREEN_WIDTH - (x + width)),
        });
      });
    });
  }, []);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
    measure();
  }, [measure]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setShowAll(false);
  }, []);

  const toggleSupplier = useCallback(
    (name: string) => {
      onChangeSuppliers(
        selectedSuppliers.includes(name)
          ? selectedSuppliers.filter((s) => s !== name)
          : [...selectedSuppliers, name],
      );
    },
    [selectedSuppliers, onChangeSuppliers],
  );

  return (
    <>
      <View ref={anchorRef} onLayout={measure} collapsable={false}>
        <TouchableOpacity
          onPress={openDropdown}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          className={`flex-row items-center px-3 py-2 rounded-full border ${
            hasActive
              ? "bg-blue-50 border-blue-300"
              : "bg-white border-gray-200"
          }`}
        >
          <Ionicons
            name="people-outline"
            size={15}
            color={hasActive ? "#2563EB" : "#374151"}
          />
          <Text
            className={`ml-1.5 text-[13px] font-medium ${hasActive ? "text-blue-700" : "text-gray-700"}`}
          >
            Nhà cung cấp{hasActive ? ` (${selectedSuppliers.length})` : ""}
          </Text>
          <Ionicons
            name="chevron-down"
            size={13}
            color={hasActive ? "#2563EB" : "#9CA3AF"}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <Pressable className="flex-1" onPress={closeDropdown}>
          <View
            style={{
              position: "absolute",
              top: anchorLayout.top,
              right: anchorLayout.right,
            }}
            className="w-[280px] max-w-[85%] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Search box */}
              <View className="px-4 pt-4 pb-2">
                <Text className="text-base font-bold text-gray-900 mb-3">
                  Nhà cung cấp
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
                  <Ionicons name="search" size={16} color="#9CA3AF" />
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Tìm nhà cung cấp..."
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-sm text-gray-800 py-0"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch("")} hitSlop={6}>
                      <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Loading */}
              {isLoading === true && (
                <View className="px-4 pb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonRow key={i} />
                  ))}
                </View>
              )}

              {/* Error */}
              {isLoading === false && fetchError != null && (
                <View className="px-4 py-8 items-center">
                  <Ionicons
                    name="cloud-offline-outline"
                    size={32}
                    color="#EF4444"
                  />
                  <Text className="text-gray-600 text-sm mt-2 mb-3 text-center">
                    Không tải được danh sách nhà cung cấp
                  </Text>
                  <TouchableOpacity
                    onPress={() => refetch()}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white text-sm font-semibold">
                      Thử lại
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Empty */}
              {isLoading === false &&
                fetchError == null &&
                filtered.length === 0 && (
                  <View className="px-4 py-8 items-center">
                    <Text className="text-gray-500 text-sm">
                      Không tìm thấy nhà cung cấp phù hợp
                    </Text>
                  </View>
                )}

              {/* List */}
              {isLoading === false &&
                fetchError == null &&
                filtered.length > 0 && (
                  <ScrollView
                    style={{ maxHeight: 320 }}
                    className="px-4"
                    showsVerticalScrollIndicator
                    keyboardShouldPersistTaps="handled"
                  >
                    {visibleSuppliers.map((item) => (
                      <SupplierRow
                        key={item.supplierId}
                        item={item}
                        checked={selectedSuppliers.includes(item.supplierName)}
                        onToggle={() => toggleSupplier(item.supplierName)}
                      />
                    ))}
                  </ScrollView>
                )}

              {/* Footer */}
              <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100 mt-1">
                {hasMore ? (
                  <TouchableOpacity
                    onPress={() => setShowAll(true)}
                    className="flex-1 py-2"
                  >
                    <Text className="text-blue-600 text-sm font-semibold text-center">
                      Xem tất cả nhà cung cấp
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => onChangeSuppliers([])}
                    disabled={!hasActive}
                    className="py-2"
                  >
                    <Text
                      className={`text-sm font-medium ${hasActive ? "text-gray-500" : "text-gray-300"}`}
                    >
                      Bỏ chọn tất cả
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={closeDropdown} className="py-2 px-3">
                  <Text className="text-blue-600 text-sm font-bold">Xong</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
