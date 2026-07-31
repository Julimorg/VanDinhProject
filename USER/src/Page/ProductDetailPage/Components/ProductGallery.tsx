// Components/ProductGallery.tsx
import React from 'react';
import { Image } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  previewImage: string;
  setPreviewImage: (img: string) => void;
}

const MAX_VISIBLE_THUMBS = 4;

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  previewImage,
  setPreviewImage,
}) => {
  React.useEffect(() => {
    if (images.length > 0) setPreviewImage(images[0]);
  }, [images, setPreviewImage]);

  const visibleThumbs = images.slice(0, MAX_VISIBLE_THUMBS);
  const remaining = images.length - MAX_VISIBLE_THUMBS;

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Thumbnails dọc — ẩn trên mobile rất nhỏ, chuyển ngang */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible">
          {visibleThumbs.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewImage(img)}
              className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                previewImage === img ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
              +{remaining}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 order-1 md:order-2 min-w-0">
        <div className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100">
          <Image
            src={previewImage || 'https://via.placeholder.com/500'}
            alt={productName}
            preview={{ src: previewImage }}
            className="w-full h-full object-contain p-4"
            fallback="https://via.placeholder.com/500?text=No+Image"
          />
        </div>
        <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-2">
          <ZoomInOutlined /> Click image to zoom
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;