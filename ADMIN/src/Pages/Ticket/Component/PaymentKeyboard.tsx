import React, { useState, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

interface PaymentKeyboardProps {
  total: number;
}

const PaymentKeyboard: React.FC<PaymentKeyboardProps> = ({ total }) => {
  const [input, setInput] = useState<string>('');
  const [given, setGiven] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const keyboardRef = useRef<any>(null);

  const quickAmounts: number[] = [10000, 20000, 50000, 100000, 200000, 500000];

  const handleQuickAmount = (amount: number) => {
    const strAmount = amount.toString();
    setInput(strAmount);
    keyboardRef.current?.setInput(strAmount);
    setGiven(amount);
    setChange(amount - total);
  };

  const onKeyPress = (button: string) => {
    if (button === '{bksp}') {
      setInput((prev) => {
        const updated = prev.slice(0, -1);
        keyboardRef.current?.setInput(updated);
        return updated;
      });
    } else if (button === '{enter}') {
      const amount = parseInt(input || '0', 10);
      setGiven(amount);
      setChange(amount - total);
      setInput('');
      keyboardRef.current?.setInput('');
    } else {
      setInput((prev) => {
        const updated = prev + button;
        keyboardRef.current?.setInput(updated);
        return updated;
      });
    }
  };

  const layout = {
    default: ['1 2 3', '4 5 6', '7 8 9', '000 0 {bksp}', '{enter}'],
  };

  return (
    <div className="max-w-md p-4 mx-auto bg-white rounded shadow">
      <h2 className="mb-4 text-xl font-bold">Thanh toán</h2>

      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span>Tổng cộng:</span>
          <span className="font-semibold text-red-500">{total.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Khách đưa:</span>
          <span className="font-semibold text-blue-600">{given.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between">
          <span>Trả lại:</span>
          <span className="font-semibold text-green-600">
            {change > 0 ? change.toLocaleString() : 0} đ
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            className="p-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handleQuickAmount(amount)}
          >
            {amount.toLocaleString()} đ
          </button>
        ))}
      </div>

      <div className="p-2 mb-3 font-mono text-xl text-right bg-gray-100 border rounded">
        {input || '0'}
      </div>

      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layout={layout}
        onKeyPress={onKeyPress}
        theme={'hg-theme-default myTheme'}
        buttonTheme={[
          {
            class: 'hg-highlight',
            buttons: '{enter}',
          },
        ]}
      />
    </div>
  );
};

export default PaymentKeyboard;
