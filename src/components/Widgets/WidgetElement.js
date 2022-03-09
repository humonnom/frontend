/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSet, settingSet } from '../../asset';
import {
  createReplacementModalAction,
  createReplacementWidgetsAction,
} from '../../redux/slice';
import {
  ACTION_CREATE,
  ACTION_DELETE,
  TYPE_IMAGE,
  TYPE_MOUSE,
  TYPE_VIDEO,
  TYPE_NONEDISPLAY,
  TYPE_NEW,
} from '../../utils/constantValue';
import ImageBox from './Image/ImageBox';
import VideoBox from './Video/VideoBox';
import MouseOverBox from './MouseOver/MouseOverBox';
import NewBox from './New/NewBox';
import { WIDGET_COMMON_RADIUS } from '../../styles/style';
import { convertType2String, isTmpWidget } from '../../utils/util';

export function WidgetElement({
  element,
  mode,
  setIsWidgetOverlap,
  setSelectedWidget,
}) {
  const [hover, setHover] = useState(false);
  const layout = element;
  const { widgets, modal } = useSelector((state) => ({
    widgets: state.info.widgets,
    modal: state.info.modal,
  }));
  const dispatch = useDispatch();

  // dispatch
  const openEditWindow = (id) => {
    dispatch(
      createReplacementModalAction({
        ...modal,
        imgInputWindow: true,
        imgChangeTargetId: id,
      })
    );
  };

  const updateWidgets = (newWidgetList) => {
    dispatch(
      createReplacementWidgetsAction({
        ...widgets,
        list: newWidgetList,
      })
    );
  };

  const openEditModalByType = (id, type) => {
    const stringType = convertType2String(type);
    dispatch(
      createReplacementModalAction({
        ...modal,
        imgChangeTargetId: id,
        popUpWindow: true,
        popUpWindowType: stringType,
      })
    );
  };

  function getNewWidgetList(targetItemIndex, newAction) {
    const newList = JSON.parse(JSON.stringify(widgets.list));
    const found = newList.find((widget) => widget.i === targetItemIndex);
    if (found.widget_action === ACTION_CREATE && newAction === ACTION_DELETE) {
      found.widget_action = newAction;
    } else if (found.widget_action !== ACTION_CREATE) {
      found.widget_action = newAction;
    }
    return newList;
  }

  function classifyBox(curInfo) {
    if (curInfo.widget_type === TYPE_NEW) {
      return <NewBox />;
    } else if (curInfo.widget_type === TYPE_IMAGE) {
      return <ImageBox element={element} mode={mode} />;
    } else if (curInfo.widget_type === TYPE_VIDEO) {
      return <VideoBox element={element} mode={mode} />;
    } else if (curInfo.widget_type === TYPE_MOUSE) {
      return <MouseOverBox element={element} />;
    } else if (curInfo.widget_type === TYPE_NONEDISPLAY) {
      return <></>;
    } else {
      return (
        <div
          key={curInfo.i}
          style={{ backgroundColor: 'lightgray', borderRadius: '10px' }}
        >
          <center className='text'>
            {curInfo.x}, {curInfo.y}
          </center>
        </div>
      );
    }
  }

  return (
    <div
      key={parseInt(layout.i, 10)}
      css={[widgetFrame]}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {mode === 'edit' && hover && (
        <>
          <div css={[positionAbsolute, hoverBackground]} />
          <button
            type='button'
            css={[commonBtn, closeBtn]}
            onClick={() => {
              const newWidgetList = getNewWidgetList(layout.i, 'D');
              updateWidgets(newWidgetList);
              setIsWidgetOverlap(false);
            }}
          >
            <div css={closeBtnImg}>
              <img alt='img' height='50px' src={closeSet} />
            </div>
          </button>
          <button
            type='button'
            css={[commonBtn, settingBtn]}
            onClick={() => {
              if (isTmpWidget(layout.widget_type)) {
                openEditWindow(layout.i);
                setSelectedWidget(layout.i);
              } else {
                openEditModalByType(layout.i, layout.widget_type);
              }

              const newWidgetList = getNewWidgetList(layout.i, 'E');
              updateWidgets(newWidgetList);
            }}
          >
            <div css={settingBtnImg}>
              <img alt='img' height='50px' src={settingSet} />
            </div>
          </button>
        </>
      )}
      {classifyBox(layout)}
    </div>
  );
}

const widgetFrame = css`
  background-color: white;
  width: 100%;
  height: 100%;
  border-radius: ${WIDGET_COMMON_RADIUS};
`;

const positionAbsolute = css`
  position: absolute;
`;

const hoverBackground = css`
  width: 100%;
  height: 100%;
  border-radius: ${WIDGET_COMMON_RADIUS};
  opacity: 0.2;
  background-color: #000;
`;

const commonBtn = css`
  appearance: none;
  position: absolute;
  border-radius: 50%;
  border: none;
  background-color: #fff;
  overflow: hidden;
`;

const closeBtn = css`
  top: 10px;
  right: 42px;
  width: 25px;
  height: 25px;
  &:hover {
    background-color: #222;
  }
`;

const closeBtnImg = css`
  position: absolute;
  top: 0px;
  right: 0px;
  &:hover {
    top: -25px;
  }
`;

const settingBtn = css`
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  &:hover {
    background-color: #222;
  }
`;

const settingBtnImg = css`
  position: absolute;
  top: 0px;
  right: 0px;
  &:hover {
    top: -25px;
  }
`;
