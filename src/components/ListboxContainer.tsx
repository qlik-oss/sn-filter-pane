import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { embed, stardust } from '@nebula.js/stardust';
import { getFieldName } from '../hooks/listbox/funcs';
import { IListBoxOptions, IListLayout } from '../hooks/types';

interface ListboxContainerProps {
  layout: IListLayout;
  app: EngineAPI.IApp;
  listboxOptions: IListBoxOptions;
}

const ListboxContainer = ({ layout, app, listboxOptions }: ListboxContainerProps) => {
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const elRef = useRef<HTMLElement>();

  useEffect(() => {
    const fieldName = getFieldName(layout);
    const nebbie = embed(app, {
      //   context: {
      //     language: translator.language,
      //   },
    });
    nebbie.field(fieldName).then((inst: stardust.FieldInstance) => setListboxInstance(inst));
  }, []);

  useEffect(() => {
    if (!elRef.current || !listboxInstance) {
      return undefined;
    }
    listboxInstance.mount(
      elRef.current,
      {
        ...listboxOptions,
        dense: false,
      },
    );

    return () => {
      listboxInstance.unmount();
    };
  }, [elRef.current, listboxInstance]);

  return (
    <>
      <Box
        height='100%'
        border='1px solid lightgrey'
        ref={elRef}
      />
    </>
  );
};

export default ListboxContainer;
