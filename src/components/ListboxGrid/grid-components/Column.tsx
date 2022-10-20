import { Box } from '@mui/material';
import React from 'react';

export interface ColumnProps {
  children: React.ReactNode,
  lastColumn: boolean,
}

export const Column = ({ children, lastColumn }: ColumnProps) => (
  <Box
    height='100%'
    paddingRight={lastColumn ? undefined : '8px'}
  >
    {children}
  </Box>
);
