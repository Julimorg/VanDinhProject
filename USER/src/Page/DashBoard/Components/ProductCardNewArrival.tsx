import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import {
  ShoppingCart,
  Visibility,
  FavoriteBorder,
  Favorite,
  Add,
  Remove,
} from '@mui/icons-material';
import { message } from 'antd';
import type { IGetProductNewArrival } from '../../../Interface/Product/IGetProductNewArrival';
import { useProductCardUtils } from '../../../Hook/useProductCardUltis';

interface ProductCardNewArrivalProps {
  product: IGetProductNewArrival[0];
  onViewDetail: (id: string) => void;
  onAddToCart: (product: IGetProductNewArrival[0], quantity: number) => void;
}

const ProductCardNewArrival: React.FC<ProductCardNewArrivalProps> = ({
  product,
  onViewDetail,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isWished, setIsWished] = useState(false);

  const utils = useProductCardUtils(product);
  const mainImage = product.productImage?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';
  const isLowStock = product.productQuantity < 10 && product.productQuantity > 0;

  const handleQuantity = (value: number) => {
    const result = utils.validateQuantity(value);
    setQuantity(result.value);
    if (result.warning) message.warning(result.warning);
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        bgcolor: 'white',
        border: '1px solid',
        borderColor: isHovered ? '#a8a29e' : '#e7e5e4',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.1)' : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        height: '100%',
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', bgcolor: '#fafaf9' }}>
        <Box
          component="img"
          src={mainImage}
          alt={product.productName}
          sx={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Chip label="MỚI" size="small" sx={{
            bgcolor: '#f59e0b', color: '#1c1917', fontWeight: 800,
            fontSize: '0.55rem', letterSpacing: '0.12em', height: 16,
            borderRadius: 0, '& .MuiChip-label': { px: 0.75 },
          }} />
          {isLowStock && (
            <Chip label="SẮP HẾT" size="small" sx={{
              bgcolor: '#dc2626', color: 'white', fontWeight: 700,
              fontSize: '0.5rem', height: 14, borderRadius: 0,
              '& .MuiChip-label': { px: 0.75 },
            }} />
          )}
          {utils.isOutOfStock && (
            <Chip label="HẾT HÀNG" size="small" sx={{
              bgcolor: '#44403c', color: 'white', fontWeight: 700,
              fontSize: '0.5rem', height: 14, borderRadius: 0,
              '& .MuiChip-label': { px: 0.75 },
            }} />
          )}
        </Box>

        {/* Wishlist */}
        <IconButton
          size="small"
          onClick={() => setIsWished(v => !v)}
          sx={{
            position: 'absolute', top: 4, right: 4,
            bgcolor: 'rgba(255,255,255,0.85)', borderRadius: 0,
            width: 26, height: 26,
            opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s',
            '&:hover': { bgcolor: '#fff5f5' },
          }}
        >
          {isWished
            ? <Favorite sx={{ fontSize: '0.75rem', color: '#ef4444' }} />
            : <FavoriteBorder sx={{ fontSize: '0.75rem', color: '#78716c' }} />
          }
        </IconButton>

        {/* Quick view */}
        <Box
          onClick={() => onViewDetail(product.productId)}
          sx={{
            position: 'absolute', inset: 'auto 0 0 0',
            bgcolor: 'rgba(28,25,23,0.85)', py: 0.75,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'all 0.25s ease', cursor: 'pointer',
          }}
        >
          <Visibility sx={{ fontSize: '0.7rem', color: 'white' }} />
          <Typography variant="caption" sx={{
            color: 'white', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', fontSize: '0.6rem',
          }}>
            Xem chi tiết
          </Typography>
        </Box>
      </Box>

      {/* Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1.25, gap: 0.75 }}>

        {/* Name */}
        <Typography sx={{
          fontWeight: 700, color: '#1c1917', lineHeight: 1.3, fontSize: '0.75rem',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.productName}
        </Typography>

        {/* Code & volume */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#a8a29e', fontFamily: 'monospace', fontSize: '0.6rem' }}>
            {product.productCode}
          </Typography>
          <Typography sx={{ color: '#a8a29e', fontFamily: 'monospace', fontSize: '0.6rem' }}>
            {product.productVolume} {product.productUnit}
          </Typography>
        </Box>

        <Box sx={{ height: '1px', bgcolor: '#f5f5f4' }} />

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 900, color: '#1c1917', fontSize: '0.85rem', lineHeight: 1 }}>
            {formatPrice(product.productPrice)}
          </Typography>
          {isLowStock && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.55rem', fontWeight: 600 }}>
              Còn {product.productQuantity}
            </Typography>
          )}
        </Box>

        {/* Quantity */}
        {utils.canAddToCart && (
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e7e5e4', width: 'fit-content' }}>
            <Box component="button" onClick={() => handleQuantity(quantity - 1)} disabled={quantity <= 1}
              sx={{
                px: 0.75, py: 0.4, border: 'none', bgcolor: 'transparent',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                opacity: quantity <= 1 ? 0.3 : 1, display: 'flex', alignItems: 'center',
              }}
            >
              <Remove sx={{ fontSize: '0.6rem' }} />
            </Box>
            <Typography sx={{ px: 1, fontWeight: 700, color: '#1c1917', fontSize: '0.7rem', minWidth: 20, textAlign: 'center' }}>
              {quantity}
            </Typography>
            <Box component="button" onClick={() => handleQuantity(quantity + 1)} disabled={quantity >= utils.maxOrderQuantity}
              sx={{
                px: 0.75, py: 0.4, border: 'none', bgcolor: 'transparent',
                cursor: quantity >= utils.maxOrderQuantity ? 'not-allowed' : 'pointer',
                opacity: quantity >= utils.maxOrderQuantity ? 0.3 : 1, display: 'flex', alignItems: 'center',
              }}
            >
              <Add sx={{ fontSize: '0.6rem' }} />
            </Box>
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 0.75, mt: 'auto' }}>
          <Box component="button" onClick={() => onViewDetail(product.productId)}
            sx={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              py: 0.75, border: '1px solid #e7e5e4', bgcolor: 'transparent', cursor: 'pointer',
              transition: 'all 0.2s', '&:hover': { borderColor: '#78716c' },
            }}
          >
            <Visibility sx={{ fontSize: '0.7rem', color: '#78716c' }} />
          </Box>

          <Box component="button" onClick={() => onAddToCart(product, quantity)} disabled={!utils.canAddToCart}
            sx={{
              flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
              py: 0.75, border: 'none',
              bgcolor: utils.canAddToCart ? '#1c1917' : '#e7e5e4',
              cursor: utils.canAddToCart ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              '&:hover': utils.canAddToCart ? { bgcolor: '#f59e0b' } : {},
            }}
          >
            <ShoppingCart sx={{ fontSize: '0.7rem', color: utils.canAddToCart ? 'white' : '#a8a29e' }} />
            <Typography sx={{
              fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.06em',
              textTransform: 'uppercase', color: utils.canAddToCart ? 'white' : '#a8a29e',
            }}>
              {utils.canAddToCart ? 'Thêm giỏ' : 'Hết hàng'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCardNewArrival;