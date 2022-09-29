import { Typography } from '@mui/material';
import React from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { BUTTON_HEIGHT } from './ListboxGrid/distribute-resources';

export interface FoldedListboxProps {
  s?: string;
}

// TODO: Fire toggleExpand callback.
export const ExpandButton = ({ s }: FoldedListboxProps) => (
  <>
    <Typography
      variant="h6"
      border="1px solid lightgrey"
      padding="8px"
      sx={{
        backgroundColor: '#F0F0F0',
        width: '100%',
        height: `${BUTTON_HEIGHT}px`,
      }}
    >
      {s}
    </Typography>
  </>
);
