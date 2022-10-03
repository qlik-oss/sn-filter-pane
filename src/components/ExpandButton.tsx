import { Button } from '@mui/material';
import React from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export interface FoldedListboxProps {
  onClick: () => void;
}

// TODO: Fire toggleExpand callback.
export const ExpandButton = ({ onClick }: FoldedListboxProps) => (
  <>
    <Button
      onClick={() => onClick()}
      disableRipple
      sx={{
        backgroundColor: '#F0F0F0',
        width: '100%',
      }}
    >
      <MoreHorizIcon sx={{ color: '#555555' }} />
    </Button>
  </>
);
