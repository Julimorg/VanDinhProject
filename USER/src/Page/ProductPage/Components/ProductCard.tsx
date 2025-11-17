import React, { useState } from 'react';
import { Card, Button, Tag, Badge } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';

interface Product {
  productId: string;
  productName: string;
  productImage: string[];
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  productPrice: number;
  supplierName: string;
  colorName: string;
  categoryName: string;
  createAt: string;
  updateAt: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onViewDetail: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

// ImageSwiper Component
const ImageSwiper: React.FC<{
  images: string[];
  productName: string;
  className?: string;
}> = ({ images, productName, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const currentImage = imageErrors[currentIndex]
    ? 'https://via.placeholder.com/400x400?text=No+Image'
    : images[currentIndex];

  return (
    <div className={`relative group ${className}`}>
      <img
        src={currentImage}
        alt={`${productName} - ${currentIndex + 1}`}
        onError={() => handleImageError(currentIndex)}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next image"
          >
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                    ? 'bg-white w-6 h-2'
                    : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                  }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

// ProductCard Component
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onViewDetail,
  onAddToCart
}) => {

  const [quantity, setQuantity] = useState(1);

  const handleViewDetail = () => {
    onViewDetail(product.productId);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > product.productQuantity) value = product.productQuantity;
    setQuantity(value);
  };

  const quantityInput = (
    <div className="flex items-center gap-2 mb-3">
      <button
        className="px-2 py-1 bg-gray-200 rounded"
        onClick={() => handleQuantityChange(quantity - 1)}
      >-</button>
      <input
        type="number"
        value={quantity}
        min={1}
        max={product.productQuantity}
        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
        className="w-12 text-center border rounded"
      />
      <button
        className="px-2 py-1 bg-gray-200 rounded"
        onClick={() => handleQuantityChange(quantity + 1)}
      >+</button>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <Card className="mb-4 hover:shadow-lg transition-shadow duration-300" bodyStyle={{ padding: '16px' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
            <ImageSwiper images={product.productImage} productName={product.productName} className="w-full h-full" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
              <span className="text-2xl font-bold text-gray-900">${product.productPrice}</span>
            </div>
            <div className="mb-3">
              <Tag color="blue">{product.categoryName}</Tag>
              <Tag color="default">{product.colorName}</Tag>
            </div>
            <p className="text-sm text-gray-600 mb-2">Code: {product.productCode}</p>
            <p className="text-sm text-gray-600 mb-2">Supplier: {product.supplierName}</p>
            {quantityInput}
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <div className="text-sm">
                <Badge
                  status={product.productQuantity > 50 ? "success" : product.productQuantity > 10 ? "warning" : "error"}
                  text={`${product.productQuantity} in stock`}
                />
              </div>
              <div className="flex gap-2">
                <Button icon={<EyeOutlined />} onClick={handleViewDetail}>View Detail</Button>
                <Button type="primary" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} disabled={product.productQuantity === 0}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // grid view
  return (
    <Card hoverable className="h-full flex flex-col"
      cover={
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <ImageSwiper images={product.productImage} productName={product.productName} className="w-full h-full transition-transform duration-300 hover:scale-105" />
          {product.productQuantity < 20 && <Tag color="red" className="absolute top-2 left-2 z-20">Low Stock</Tag>}
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">{product.productName}</h3>
        <div className="mb-2"><Tag color="blue" className="text-xs">{product.categoryName}</Tag></div>
        <p className="text-xs text-gray-500 mb-1">SKU: {product.productCode}</p>
        <p className="text-xs text-gray-600 mb-3">{product.supplierName}</p>

        {quantityInput}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-gray-900">${product.productPrice}</span>
            <span className="text-xs text-gray-500">{product.productQuantity} in stock</span>
          </div>
          <div className="flex gap-2">
            <Button icon={<EyeOutlined />} className="flex-1" onClick={handleViewDetail}>Detail</Button>
            <Button type="primary" icon={<ShoppingCartOutlined />} className="flex-1" onClick={handleAddToCart} disabled={product.productQuantity === 0}>Add</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
