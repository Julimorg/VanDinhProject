import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
}

/** Tieu de section dung chung: eyebrow (nhan vang) + title lon + mo ta ngan. */
export default function SectionHeading({ eyebrow, title, description, align = 'left', action }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'flex-end' },
        justifyContent: 'space-between',
        gap: 3,
        flexWrap: 'wrap',
        mb: { xs: 4, md: 5 },
        textAlign: align,
      }}
    >
      <Box sx={{ maxWidth: 640, mx: align === 'center' ? 'auto' : 0 }}>
        {eyebrow && (
          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h4"
          sx={{ color: 'stone.900', fontSize: { xs: '1.6rem', md: '2.1rem' } }}
        >
          {title}
        </Typography>
        {description && (
          <Typography sx={{ color: 'text.secondary', mt: 1.25, fontSize: '0.95rem', lineHeight: 1.7 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
