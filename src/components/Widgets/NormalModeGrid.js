// @ts-check

import React, { useEffect, useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { useSelector } from 'react-redux';
import GridLayout from '../GridLayout/GridLayout';
import { WidgetElement } from './WidgetElement';

function makeBlockStatic(layoutInfos) {
  return layoutInfos.map((info) => ({ ...info, static: true }));
}

function NormalModeGrid() {
  const { widgets } = useSelector((state) => ({
    widgets: state.info.widgets,
  }));
  const layoutInfo = widgets.list;
  const staticLayout = makeBlockStatic(layoutInfo);
  console.log('static 넣어줌');
  console.log(staticLayout);

  const Test = useMemo(() => {
    console.log('----------render---------');
    return (
      <GridLayout
        onLayoutChange={(layout) => {
          console.log('normalnoed changed!');
          console.log(layout);
        }}
        mylayout={staticLayout}
        className={css`
          margin: 0 auto;
          width: 100%;
        `}
      >
        {staticLayout.map((element) => (
          <div
            key={Number(element.i)}
            style={{ backgroundColor: 'lightgray', borderRadius: '10px' }}
          >
            <WidgetElement element={element} />
          </div>
        ))}
      </GridLayout>
    );
  }, [staticLayout]);

  // if (staticLayout.i !== undefined) setOpen(1);
  return <div style={{ position: 'relative' }}>{Test}</div>;
}

export default NormalModeGrid;
