import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { embed, stardust } from "@nebula.js/stardust";
import { getFieldName } from "../hooks/listbox/funcs";
import { IListBoxOptions, IListLayout } from "../hooks/types";
import mergeListboxOptions from "../hooks/listbox/merge-listbox-options";

interface ListboxContainerProps {
  layout: IListLayout;
  app: EngineAPI.IApp;
  listboxOptions: IListBoxOptions;
}

const ListboxContainer = ({ layout, app, listboxOptions }: ListboxContainerProps) => {

  const fieldName = getFieldName(layout);
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const [containerElement, setContainerElement] = useState<HTMLDivElement>();

  const handleRef = useCallback((node: any) => {
    setContainerElement(node);
  }, []);

  useEffect(() => {
    const nebbie = embed(app, {
    //   context: {
    //     language: translator.language,
    //   },
    });
    nebbie.field(fieldName).then((inst: any) => setListboxInstance(inst));
  }, []);

  useEffect(() => {
    if (!containerElement || !listboxInstance) {
      return undefined;
    }

    const options = mergeListboxOptions(listboxOptions, fieldName, layout);
    listboxInstance.mount(containerElement, options);

    return () => {
      listboxInstance.unmount();
    };
  }, [containerElement, listboxInstance]);

  return (
    <Box
      className="listbox-container"
      sx={{
        height: 400,
      }}
      ref={handleRef}
    />
  );
};

export default ListboxContainer;
