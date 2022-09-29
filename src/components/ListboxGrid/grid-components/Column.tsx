import { Box } from '@mui/system';
import React from 'react';

export interface ColumnProps {
  children: React.ReactNode,
}

export const Column = ({ children }: ColumnProps) => (
  <Box height='100%'>
    {children}
  </Box>
);
