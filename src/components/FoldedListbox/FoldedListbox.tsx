import { Grid, Typography } from '@mui/material';
import React from 'react';
import { IListLayout } from '../../hooks/types';
import useFieldName from '../../hooks/use-field-name';
import { COLLAPSED_HEIGHT } from '../ListboxGrid/distribute-resources';
import SelectionSegmentsIndicator from './SelectionSegmentsIndicator';

export interface FoldedListboxProps {
  layout: IListLayout;
}

// TODO: Add Listbox in a popover when clicking this component.
export const FoldedListbox = ({ layout }: FoldedListboxProps) => {
  const fieldName = useFieldName(layout);

  return (
    <Grid
      container
      direction='column'
      justifyContent='space-between'
      alignItems='flex-start'
      border="1px solid #d9d9d9"
      borderRadius="3px"
      height={COLLAPSED_HEIGHT}
      overflow='hidden'
    >
      <Grid container flexGrow={1} alignItems={'center'} padding='0 8px'>
        <Typography variant="subtitle2" fontSize='13px'>
          {fieldName}
        </Typography>
      </Grid>
      <Grid item width='100%'>
        <SelectionSegmentsIndicator
          qDimensionInfo={layout.qListObject.qDimensionInfo}
        ></SelectionSegmentsIndicator>
      </Grid>
    </Grid>
  );
};
