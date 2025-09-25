import React, { useState, useEffect } from 'react';
import ButtonText from '@/Components/ButtonText-H';
import { Icons } from '@/Components/Icons';
import { formatCurrency } from '@/Utils';

type ActionType = 'increase' | 'decrease' | 'remove' | 'set';

type SelectedItemProps = {
  title: string;
  price: number;
  quantity: number;
  onAction: (action: ActionType, value?: number) => void;

  type?: string;
};

const SelectedItem: React.FC<SelectedItemProps> = ({ title, price, quantity, onAction, type }) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const validateAndSetQuantity = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num)) {
      const clamped = Math.min(Math.max(num, 1), 20);
      setInputValue(clamped.toString());
      onAction('set', clamped);
    } else {
      setInputValue(quantity.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndSetQuantity();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <li className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-md gap-x-6">
      <div className="flex-1">
        <p className="text-base font-bold">{title}</p>
        {type && <p className="text-sm text-gray-500">{type}</p>}
      </div>

      <span className="mx-4 text-base font-semibold whitespace-nowrap">
        {formatCurrency(price)}
      </span>

      <div className="flex items-center mr-4 space-x-2">
        <ButtonText
          icon={<span>-</span>}
          onClick={() => {
            if (quantity > 1) {
              onAction('decrease');
            } else {
              onAction('remove');
            }
          }}
          className="flex items-center justify-center w-6 h-6 p-0 text-white bg-black border-none rounded-full"
        />

        <input
          type="number"
          min={1}
          max={20}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={validateAndSetQuantity}
          onKeyDown={handleKeyDown}
          className="w-12 text-center border border-gray-300 rounded-md no-spinner"
        />

        <ButtonText
          icon={<span>+</span>}
          onClick={() => onAction('increase')}
          className="flex items-center justify-center w-6 h-6 p-0 text-white bg-black border-none rounded-full"
          aria-label="Tăng số lượng"
        />
      </div>

      <ButtonText
        icon={
          <span role="img" aria-label="Xóa">
            <Icons.trash />
          </span>
        }
        onClick={() => onAction('remove')}
        className="text-red-500 bg-transparent border-none hover:text-red-700"
      />
    </li>
  );
};

export default SelectedItem;
