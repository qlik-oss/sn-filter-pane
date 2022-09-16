import React, { useCallback, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { IListboxResource as IListboxResource } from '../hooks/types';
import ListboxContainer from './ListboxContainer';
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";
import ElementResizeListener from './ElementResizeListener';
import { Box } from '@mui/system';
import Masonry from '@mui/lab/Masonry';
import debounce from "lodash/debounce"

export default function ListboxGrid(props: any) {
  const { resources, app, listboxOptions } = props;
  const [maxHeight, setMaxHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const gridRef = useRef<any>();

  const handleResize = () => {
    // debounce(() => {
    setMaxHeight(gridRef.current?.offsetHeight);
    setWidth((gridRef.current?.offsetWidth / resources.length) - 4);
    // console.log({ settingNewHeight: maxHeight, width: width, oh: gridRef.current.offsetHeight, ow: gridRef.current.offsetWidth });
    // }, 300)
    // setMaxHeight('100%');
    // setMaxHeight(gridRef.current?.getBoundingClientRect().height);
    // setWidth((gridRef.current?.getBoundingClientRect().width / resources.length) - 4);

  };

  const dHandleResize = debounce(handleResize, 50);

  useEffect(() => {
    if (gridRef.current) {
      console.log('init resize');
      handleResize();
    }
  }, []);

  // TODO: Remove ResizableBox, only for developing purposes
  // return (
  //   <>
  //     <ResizableBox width={1100} height={1100} minConstraints={[100, 100]} maxConstraints={[1220, 1220]}>
  //       <ElementResizeListener onResize={resizing} />
  //       {/* <Box sx={{ flexGrow: 1 }}> */}
  //         <Grid container className='filterpane-container' sx={{ border: '1px solid green' }} ref={gridRef} spacing={{ xs: 1 }}>
  //           {resources.map((resource: IListboxResource, index: number) => (
  //             <Grid item key={index} xs='auto'>
  //               <ListboxContainer layout={resource.layout} app={app} listboxOptions={listboxOptions} maxHeight={maxHeight} width={width} />
  //             </Grid>
  //           ))}
  //         </Grid>
  //       {/* </Box> */}
  //     </ResizableBox>
  //   </>
  // );

  const getColumnCount = () => {
    switch (true) {
      case (width < 50):
        console.log(1, width);
        return 1;
      case (width < 100):
        console.log(2, width);
        return 2;
      case (width < 150):
        console.log(3, width);
        return 3;
      default:
        console.log(4, width);
        return 4;
    }
  }

  return (
    <>
      {console.log('rendering box')}
      <ResizableBox width={1100} height={1100} minConstraints={[100, 100]} maxConstraints={[1220, 1220]}>
        <Box sx={{ width: '100%', height: '100%' }} ref={gridRef}>
          <ElementResizeListener onResize={dHandleResize} />
          <Masonry sx={{ border: '1px solid green' }} spacing={{ xs: 1 }} columns={getColumnCount()} ref={gridRef}>
            {resources.map((resource: IListboxResource, index: number) => (
              <ListboxContainer key={index} layout={resource.layout} app={app} listboxOptions={listboxOptions} containerHeight={maxHeight} width={width} />
            ))}
          </Masonry>
        </Box>
      </ResizableBox>
    </>
  );

}


// Make a function that returns a number of how many listboxes that should be collapsed depending of the container size.



