import React from 'react';

interface QRCodeProps {
  src: string;
  mode?: 'inline' | 'modal';
  onClose?: () => void;
  title?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ src, mode = 'inline', onClose, title }) => {
  if (mode === 'inline') {
    return (
      <div className="flex flex-col items-center mt-4">
        <p className="mb-2 text-lg font-semibold">{title}</p>
        <img src={src} alt="QR code" className="w-48 h-48 border border-gray-300" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-full max-w-sm p-6 text-center text-gray-800 bg-white border border-gray-200 shadow-xl rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-green-700">Quét mã QR để thanh toán</h2>

        <div className="p-2 mx-auto bg-white border border-gray-300 rounded-md w-fit">
          <img src={src} alt="Mã QR thanh toán" className="object-contain w-56 h-56" />
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Sử dụng <strong>App MoMo</strong> hoặc ứng dụng camera hỗ trợ QR code để quét mã
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2 mt-6 text-white transition bg-green-600 rounded hover:bg-green-700"
        >
          Đóng mã QR
        </button>
      </div>
    </div>
  );
};

export default QRCode;
