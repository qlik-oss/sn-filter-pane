import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { embed, stardust } from "@nebula.js/stardust";
import { getFieldName } from "../hooks/listbox/funcs";
import { IListBoxOptions, IListLayout } from "../hooks/types";

interface ListboxContainerProps {
  layout: IListLayout;
  app: EngineAPI.IApp;
  listboxOptions: IListBoxOptions;
  containerHeight: number;
  width: number;
}

const ListboxContainer = ({ layout, app, listboxOptions, containerHeight, width }: ListboxContainerProps) => {

  const fieldName = getFieldName(layout);
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const elRef = useRef<HTMLElement>();
  const [height, setHeight] = React.useState(300);
  const [maxHeight, setMaxHeight] = React.useState(300);

  useEffect(() => {
    const nebbie = embed(app, {
      //   context: {
      //     language: translator.language,
      //   },
    });
    nebbie.field(fieldName).then((inst: any) => setListboxInstance(inst));
  }, []);

  useEffect(() => {
    if (!elRef.current || !listboxInstance) {
      return undefined;
    }
    listboxInstance.mount(
      elRef.current,
      {
        ...listboxOptions,
        ...{
          dense: false,
        }
      }
    );

    return () => {
      listboxInstance.unmount();
    };
  }, [elRef.current, listboxInstance]);

  useEffect(() => {
    setHeight(containerHeight);
  }, [containerHeight]);

  useEffect(() => {
    setMaxHeight(getBoxHeight(32))
  }, []);

  const getBoxHeight = (rowHeight: number) => {
    const bottomPadding = 4;
    const toolbarHeight = 48;
    const searchBarHeight = 40;
    const rowCount = layout.qListObject.qSize.qcy;
    const maxHeightL = elRef.current?.parentElement?.getBoundingClientRect().height ?? 500;
    // const maxHeight = 300;
    let height = Math.min((rowHeight * rowCount) + bottomPadding + toolbarHeight + searchBarHeight, maxHeightL);
    return height;
    // return maxHeightL;
  };

  return (
    <>
      {console.log('rendering listbox')}
      <Box
        className="listbox-container"
        sx={{
          height: height,
          maxHeight: maxHeight,
          // maxHeight: getBoxHeight(32),
          // width: width,
          // flexGrow: 1,
          // height: getBoxHeight(32),
          // height: '100%',
          border: '1px solid red',
        }}
        ref={elRef}
      />
    </>
  );
};

export default ListboxContainer;
