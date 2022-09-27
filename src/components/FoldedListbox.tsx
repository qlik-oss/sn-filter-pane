import { Typography } from '@mui/material';
import React from 'react';
import { IListLayout } from '../hooks/types';
import useFieldName from '../hooks/use-field-name';

export interface FoldedListboxProps {
  layout: IListLayout;
}

// TODO: Add Listbox in a popover when clicking this component.
export const FoldedListbox = ({ layout }: FoldedListboxProps) => {
  const fieldName = useFieldName(layout);

  return (
    <>
      <Typography
        variant="h6"
        border="1px solid lightgrey"
        padding="8px"
      >
        {fieldName}
      </Typography>
    </>
  );
};
