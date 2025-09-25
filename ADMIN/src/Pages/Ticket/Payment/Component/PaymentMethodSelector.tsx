import React from 'react';
import cashimg from '@/Image/cash.jpg';
import momo from '@/Image/momo.png';

type PaymentMethod = 'cash' | 'momo';

interface Props {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<Props> = ({ selectedMethod, onSelect }) => {
  const methods: { key: PaymentMethod; label: string; img: string }[] = [
    { key: 'cash', label: 'Tiền mặt', img: cashimg },
    { key: 'momo', label: 'MoMo', img: momo },
  ];

  return (
    <div className="mt-6 text-xl">
      <p className="mb-2">Phương thức thanh toán:</p>
      <div className="space-y-4">
        {methods.map(({ key, label, img }) => (
          <label
            key={key}
            className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition ${
              selectedMethod === key
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-300 bg-white'
            }`}
            onClick={() => onSelect(key)}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === key
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-400 bg-white'
                }`}
              >
                {selectedMethod === key && <div className="w-2 h-2 bg-white rounded-full" />}
              </span>
              <span className="text-lg font-medium">{label}</span>
            </div>
            <img src={img} alt={label} className="object-contain w-16 h-16 border rounded" />
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
