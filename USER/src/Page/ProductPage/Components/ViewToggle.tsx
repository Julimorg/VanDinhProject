import React from 'react';
import { IconButton } from '@mui/material';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
  disabled?: boolean;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange, disabled }) => {
  return (
    <div className="flex gap-2">
      <IconButton
        onClick={() => onChange('grid')}
        disabled={disabled}
        size="small"
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: viewMode === 'grid' ? 'secondary.main' : 'stone.300',
          bgcolor: viewMode === 'grid' ? 'secondary.main' : 'transparent',
          color: viewMode === 'grid' ? 'white' : 'stone.600',
          '&:hover': { bgcolor: viewMode === 'grid' ? 'secondary.dark' : 'stone.50' },
        }}
      >
        <AppsRoundedIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={() => onChange('list')}
        disabled={disabled}
        size="small"
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: viewMode === 'list' ? 'secondary.main' : 'stone.300',
          bgcolor: viewMode === 'list' ? 'secondary.main' : 'transparent',
          color: viewMode === 'list' ? 'white' : 'stone.600',
          '&:hover': { bgcolor: viewMode === 'list' ? 'secondary.dark' : 'stone.50' },
        }}
      >
        <ViewListRoundedIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default ViewToggle;
