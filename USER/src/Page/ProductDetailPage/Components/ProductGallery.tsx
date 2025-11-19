
import React from 'react';
import { Image, Button } from 'antd';
import { HeartOutlined, ShareAltOutlined } from '@ant-design/icons';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  previewImage: string;
  setPreviewImage: (img: string) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  previewImage,
  setPreviewImage,
}) => {
  React.useEffect(() => {
    if (images.length > 0) setPreviewImage(images[0]);
  }, [images, setPreviewImage]);

  return (
    <div className="sticky top-6 space-y-6">
      {/* Main Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white">
        <Image
          src={previewImage || 'https://via.placeholder.com/800'}
          alt={productName}
          preview={{ src: previewImage }}
          className="w-full aspect-square object-cover"
          fallback="https://via.placeholder.com/800?text=No+Image"
        />

        <div className="absolute top-4 right-4 flex flex-col gap-3">
          <Button type="text" shape="circle" size="large" icon={<HeartOutlined />} className="bg-white/90 backdrop-blur shadow-lg hover:scale-110 transition" />
          <Button type="text" shape="circle" size="large" icon={<ShareAltOutlined />} className="bg-white/90 backdrop-blur shadow-lg hover:scale-110 transition" />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewImage(img)}
              className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all duration-300 ${
                previewImage === img
                  ? 'border-blue-600 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;