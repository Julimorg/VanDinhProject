import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, ArrowForward } from '@mui/icons-material';

const banners = [
  {
    image: 'https://images2.thanhnien.vn/528068263637045248/2025/10/22/5-17611322637171472826509.png',
    eyebrow: 'Ưu đãi đặc biệt',
    title: 'Giảm đến 30%',
    subtitle: 'Sơn Dulux, Jotun, Nippon chính hãng — chất lượng châu Âu, giá Việt Nam.',
    cta: 'Xem khuyến mãi',
    gradient: 'linear-gradient(to right, rgba(120,53,15,0.85), rgba(28,25,23,0.5) 60%, transparent)',
  },
  {
    image: 'https://images2.thanhnien.vn/zoom/1200_630/528068263637045248/2025/10/22/1-17611322634222119188377-38-0-786-1429-crop-17611325524301732071931.jpg',
    eyebrow: 'Bộ sưu tập 2025',
    title: 'Màu Sắc Thời Thượng',
    subtitle: 'Xu hướng màu nội thất được các chuyên gia hàng đầu thế giới tuyển chọn.',
    cta: 'Khám phá bộ sưu tập',
    gradient: 'linear-gradient(to right, rgba(28,25,23,0.85), rgba(28,25,23,0.4) 60%, transparent)',
  },
  {
    image: 'https://www.decoratingmatters.co.uk/wp-content/uploads/2024/03/web_DULUX-TRADE-VINYL-MATT.jpg',
    eyebrow: 'Sơn chuyên nghiệp',
    title: 'Chống Thấm Tối Ưu',
    subtitle: 'Weathershield, Majestic, 4 Seasons — bảo vệ công trình bền vững nhiều thập kỷ.',
    cta: 'Tìm hiểu thêm',
    gradient: 'linear-gradient(to right, rgba(17,24,39,0.85), rgba(17,24,39,0.4) 60%, transparent)',
  },
];

const BannerCarousel: React.FC = () => {
  const autoplay = Autoplay({ delay: 6000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 50 }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Embla viewport */}
      <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'flex' }}>
          {banners.map((banner, idx) => (
            <Box
              key={idx}
              sx={{
                flex: '0 0 100%',
                minWidth: 0,
                position: 'relative',
                height: { xs: '56vw', md: '52vw' },
                minHeight: 280,
                maxHeight: 660,
              }}
            >
              {/* Image */}
              <Box
                component="img"
                src={banner.image}
                alt={banner.title}
                loading={idx === 0 ? 'eager' : 'lazy'}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Gradient overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: banner.gradient,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)',
                }}
              />

              {/* Decorative vertical line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { sm: 64, lg: 96 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1px',
                  height: { sm: 96, md: 160 },
                  bgcolor: 'rgba(255,255,255,0.3)',
                  display: { xs: 'none', sm: 'block' },
                }}
              />

              {/* Content */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  pb: { xs: 5, md: 8, lg: 12 },
                  pl: { xs: 3, sm: 8, lg: 12, xl: 16 },
                }}
              >
                <Box sx={{ maxWidth: 600 }}>
                  {/* Eyebrow */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ height: '1px', width: 32, bgcolor: '#f59e0b' }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: '#f59e0b',
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        fontSize: '0.7rem',
                      }}
                    >
                      {banner.eyebrow}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 900,
                      fontSize: { xs: '2.2rem', sm: '3rem', md: '3.75rem', lg: '4.5rem' },
                      lineHeight: 0.95,
                      letterSpacing: '-0.02em',
                      mb: { xs: 2, md: 3 },
                    }}
                  >
                    {banner.title}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      maxWidth: 420,
                      lineHeight: 1.7,
                      mb: { xs: 3, md: 4 },
                      fontSize: { xs: '0.85rem', md: '1rem' },
                    }}
                  >
                    {banner.subtitle}
                  </Typography>

                  {/* CTA */}
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                      bgcolor: '#f59e0b',
                      color: '#1c1917',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      borderRadius: 0,
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.2, md: 1.6 },
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#fbbf24',
                        boxShadow: 'none',
                        transform: 'none',
                      },
                    }}
                  >
                    {banner.cta}
                  </Button>
                </Box>
              </Box>

              {/* Slide number */}
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: { xs: 16, md: 40 },
                  right: { xs: 16, md: 64 },
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em',
                }}
              >
                {String(idx + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Prev / Next arrows */}
      <IconButton
        onClick={scrollPrev}
        sx={{
          position: 'absolute',
          left: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          borderRadius: 0,
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
          '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          zIndex: 10,
        }}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={scrollNext}
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          borderRadius: 0,
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
          '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          zIndex: 10,
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* Dot indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, md: 28 },
          right: { xs: 16, md: 64 },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 10,
        }}
      >
        {banners.map((_, i) => (
          <Box
            key={i}
            onClick={() => scrollTo(i)}
            sx={{
              height: '2px',
              width: i === selectedIndex ? 32 : 12,
              bgcolor: i === selectedIndex ? '#f59e0b' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.7)' },
            }}
          />
        ))}
      </Box>

      {/* Bottom accent */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(to right, #f59e0b, #fcd34d, transparent)',
        }}
      />
    </Box>
  );
};

export default BannerCarousel;