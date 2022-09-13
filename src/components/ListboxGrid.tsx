import React from 'react';
import Grid from '@mui/material/Grid';
import { IListboxResource as IListboxResource } from '../hooks/types';
import ListboxContainer from './ListboxContainer';

export default function ListboxGrid(props: any) {
  const { resources, app, listboxOptions } = props;

  return (
    <Grid container className='filterpane-container'>
      {resources.map((resource: IListboxResource, index: number) => (
        <Grid item key={index}>
          <ListboxContainer layout={resource.layout} app={app} listboxOptions={listboxOptions} />
        </Grid>
      ))}
    </Grid>
  );
}
