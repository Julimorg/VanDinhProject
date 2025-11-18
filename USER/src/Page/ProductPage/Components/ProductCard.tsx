import React, { useState } from 'react';
import { Card, Button, Tag, Badge, message } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';

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

// ===================== ImageSwiper =====================
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
    ? 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image'
    : images[currentIndex] || 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image';

  return (
    <div className={`relative group ${className}`}>
      <img
        src={currentImage}
        alt={`${productName} - ${currentIndex + 1}`}
        onError={() => handleImageError(currentIndex)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
      />

      {images.length > 1 && (
        <>
          {/* Prev/Next buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex ? 'bg-white w-6 h-2' : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

// ===================== ProductCard =====================
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onViewDetail,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > product.productQuantity) {
      message.warning(`Chỉ còn ${product.productQuantity} sản phẩm!`);
      value = product.productQuantity;
    }
    setQuantity(value);
  };

  const isLowStock = product.productQuantity < 20;
  const isOutOfStock = product.productQuantity === 0;

  const quantityInput = (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => handleQuantityChange(quantity - 1)}
        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
        disabled={quantity <= 1}
      >
        <MinusOutlined className="text-xs" />
      </button>
      <input
        type="text"
        value={quantity}
        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
        className="w-12 h-9 text-center font-medium border-x border-gray-300 focus:outline-none"
      />
      <button
        onClick={() => handleQuantityChange(quantity + 1)}
        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
        disabled={quantity >= product.productQuantity}
      >
        <PlusOutlined className="text-xs" />
      </button>
    </div>
  );

  const commonCardContent = (
    <>
      <div className="relative group">
        <ImageSwiper
          images={product.productImage}
          productName={product.productName}
          className="h-48 md:h-56"
        />
        {isLowStock && !isOutOfStock && (
          <Tag color="red" className="absolute top-3 left-3 m-0 text-xs font-medium">
            Low Stock
          </Tag>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-xl z-10">
            <span className="text-white font-bold text-lg">Hết hàng</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
          {product.productName}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-green-600">
            ${product.productPrice.toLocaleString()}
          </span>
          <Badge
            count={product.productQuantity}
            style={{ backgroundColor: product.productQuantity > 50 ? '#52c41a' : product.productQuantity > 10 ? '#faad14' : '#ff4d4f' }}
            className="text-xs"
          />
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex justify-center">{quantityInput}</div>
          <div className="flex gap-2">
            <Button
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(product.productId)}
              block
              size="middle"
              className="flex-1"
            >
              Chi tiết
            </Button>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => onAddToCart(product, quantity)}
              disabled={isOutOfStock}
              block
              size="middle"
              className="flex-1"
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  if (viewMode === 'grid') {
    return (
      <Card
        hoverable
        cover={commonCardContent}
        className="h-full transition-all duration-300 hover:shadow-xl border-0 rounded-xl overflow-hidden bg-white"
        bodyStyle={{ padding: 0 }}
      />
    );
  }

  // LIST VIEW
  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-0 rounded-xl overflow-hidden bg-white">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-52 flex-shrink-0 relative">
          <ImageSwiper
            images={product.productImage}
            productName={product.productName}
            className="w-full aspect-square"
          />
          {isLowStock && !isOutOfStock && (
            <Tag color="red" className="absolute top-3 left-3 m-0 text-xs font-medium">
              Còn ít
            </Tag>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {product.productName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>SKU: <span className="font-mono">{product.productCode}</span></span>
              <span>•</span>
              <span>{product.supplierName}</span>
            </div>
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-3xl font-bold text-green-600">
                ${product.productPrice.toLocaleString()}
              </div>
              <Badge
                count={`${product.productQuantity} sản phẩm còn lại`}
                style={{ backgroundColor: product.productQuantity > 50 ? '#52c41a' : '#faad14' }}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-3">
              {quantityInput}
              <div className="flex gap-2">
                <Button icon={<EyeOutlined />} size="large" onClick={() => onViewDetail(product.productId)} />
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  onClick={() => onAddToCart(product, quantity)}
                  disabled={isOutOfStock}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
