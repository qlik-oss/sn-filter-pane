import { Grid } from '@mui/material';
import React from 'react';

export type ColumnItemProps = {
  height: string,
  children: React.ReactNode,
}

export const ColumnItem = ({ height, children, ...rest }: ColumnItemProps) => (
  <Grid item height={height} paddingTop='8px' width='100%' {...rest}>
    {children}
  </Grid>
);
