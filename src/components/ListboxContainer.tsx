import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { embed, stardust } from "@nebula.js/stardust";
import { getFieldName } from "../hooks/listbox/funcs";
import { IListBoxOptions, IListLayout } from "../hooks/types";

interface ListboxContainerProps {
  layout: IListLayout;
  app: EngineAPI.IApp;
  listboxOptions: IListBoxOptions;
}

const ListboxContainer = ({ layout, app, listboxOptions }: ListboxContainerProps) => {

  const fieldName = getFieldName(layout);
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const elRef = useRef();

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

    listboxInstance.mount(elRef.current, listboxOptions);

    return () => {
      listboxInstance.unmount();
    };
  }, [elRef.current, listboxInstance]);

  return (
    <Box
      className="listbox-container"
      sx={{
        height: 400,
      }}
      ref={elRef}
    />
  );
};

export default ListboxContainer;
