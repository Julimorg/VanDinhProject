import React, { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type SortOptionType = { label: string; value: string };

export const SORT_OPTIONS: SortOptionType[] = [
  { label: "Mới nhất", value: "createAt,desc" },
  { label: "Giá tăng dần", value: "productPrice,asc" },
  { label: "Giá giảm dần", value: "productPrice,desc" },
  { label: "Tên A-Z", value: "productName,asc" },
];

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DEFAULT_POS = { top: 140, right: 16 };

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const anchorRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState(DEFAULT_POS);

  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  const measure = useCallback(() => {
    requestAnimationFrame(() => {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        if (width === 0 && height === 0) return;
        setPos({ top: y + height + 8, right: Math.max(12, SCREEN_WIDTH - (x + width)) });
      });
    });
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    measure();
  }, [measure]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <View ref={anchorRef} onLayout={measure} collapsable={false}>
        <TouchableOpacity
          onPress={open}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          className="flex-row items-center px-3 py-2 rounded-full border border-gray-200 bg-white"
        >
          <Ionicons name="swap-vertical-outline" size={15} color="#374151" />
          <Text className="ml-1.5 text-[13px] font-medium text-gray-700">Sắp xếp</Text>
          <Ionicons name="chevron-down" size={13} color="#9CA3AF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={close}>
        <Pressable className="flex-1" onPress={close}>
          <View
            style={{ position: "absolute", top: pos.top, right: pos.right }}
            className="w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2"
          >
            {SORT_OPTIONS.map((opt) => {
              const active = opt.value === current.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    close();
                  }}
                  className="flex-row items-center justify-between px-4 py-3"
                  activeOpacity={0.6}
                >
                  <Text className={`text-sm ${active ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                    {opt.label}
                  </Text>
                  {active && <Ionicons name="checkmark" size={16} color="#2563EB" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};