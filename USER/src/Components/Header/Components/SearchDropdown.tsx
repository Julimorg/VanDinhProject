import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  InputAdornment,
  Popper,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Dialog,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  ClickAwayListener,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from 'react-router-dom';
import { useSearchAll } from '../Hook/useSearchAll';
import type { ISearchAllResponse } from '../../../Interface/Elasticsearch/ISearchAll';

interface HeaderSearchProps {
  placeholder?: string;
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({ placeholder = 'Tìm kiếm sản phẩm...' }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const activeQuery = mobileOpen ? mobileQuery : query;

  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(activeQuery), 300);
    return () => clearTimeout(handler);
  }, [activeQuery]);

  const { data: searchData, isFetching } = useSearchAll(
    { keyword: debouncedQuery, page: 0, size: 10 },
    { enabled: debouncedQuery.trim().length > 0 }
  );

  const results = useMemo(() => {
    const content = searchData?.data?.content;
    return Array.isArray(content) ? (content as unknown as ISearchAllResponse[]) : [];
  }, [searchData?.data?.content]);

  const handleItemClick = (entityId: string, type: string) => {
    setOpen(false);
    setMobileOpen(false);
    setQuery('');
    setMobileQuery('');
    if (type === 'PRODUCT') {
      navigate(`/products/${entityId}`);
    }
  };

  const resultList = (emptyText: string) => (
    <List disablePadding>
      {isFetching ? (
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={22} />
        </Box>
      ) : results.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{emptyText}</Typography>
        </Box>
      ) : (
        results.map((item) => (
          <ListItemButton key={item.entityId} onClick={() => handleItemClick(item.entityId, item.type)}>
            <ListItemAvatar>
              <Avatar src={item.image} variant="rounded" sx={{ width: 42, height: 42 }} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={item.type === 'PRODUCT' ? `${item.price?.toLocaleString('vi-VN')} đ` : null}
              primaryTypographyProps={{ fontSize: '0.86rem', fontWeight: 600, color: 'stone.900', noWrap: true }}
              secondaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 700, color: 'primary.dark' }}
            />
          </ListItemButton>
        ))
      )}
    </List>
  );

  return (
    <>
      {/* Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'center', px: 2, maxWidth: 480, mx: 'auto' }}>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              size="small"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={(e) => {
                setOpen(true);
                setAnchorEl(e.currentTarget);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: 'stone.400', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { bgcolor: 'stone.50', borderRadius: 2 },
              }}
            />
            <Popper open={open && query.length > 0} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 1300, width: anchorEl?.clientWidth }}>
              <Paper elevation={6} sx={{ mt: 1, borderRadius: 2, maxHeight: 420, overflowY: 'auto' }}>
                {resultList(debouncedQuery ? 'Không tìm thấy kết quả' : 'Nhập để tìm kiếm')}
              </Paper>
            </Popper>
          </Box>
        </ClickAwayListener>
      </Box>

      {/* Mobile trigger */}
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        aria-label="Tìm kiếm"
      >
        <SearchRoundedIcon sx={{ color: 'stone.700' }} />
      </IconButton>

      {/* Mobile modal */}
      <Dialog
        fullScreen
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
          setMobileQuery('');
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <SearchRoundedIcon sx={{ color: 'stone.400' }} />
          <TextField
            autoFocus
            fullWidth
            variant="standard"
            placeholder={placeholder}
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { fontSize: 16 } }}
          />
          <IconButton
            onClick={() => {
              setMobileOpen(false);
              setMobileQuery('');
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        {mobileQuery.length > 0 && <Box sx={{ overflowY: 'auto' }}>{resultList('Không tìm thấy kết quả')}</Box>}
      </Dialog>
    </>
  );
};

export default HeaderSearch;
