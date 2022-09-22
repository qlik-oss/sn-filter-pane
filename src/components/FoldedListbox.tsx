import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getFieldName } from '../hooks/listbox/funcs';
import { IListLayout } from '../hooks/types';

export interface FoldedListboxProps {
  layout: IListLayout;
}

// TODO: Add Listbox in a popover when clicking this component.
export const FoldedListbox = ({ layout }: FoldedListboxProps) => {
  const [fieldName, setFieldName] = useState('');

  useEffect(() => {
    setFieldName(getFieldName(layout));
  }, [layout?.title || layout?.qListObject?.qDimensionInfo?.qFallbackTitle]);

  return (
    <>
      <Typography
        variant="h6"
        border={'1px solid lightgrey'}
        padding={'8px'}
      >
        {fieldName}
      </Typography>
    </>
  );
};
