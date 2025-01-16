import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { createSelector } from 'reselect';
import { isDonationModalOpenSelector } from '../../../redux/selectors';
import {
  canFocusEditorSelector,
  consoleOutputSelector,
  visibleEditorsSelector
} from '../redux/selectors';
import { getTargetEditor } from '../utils/get-target-editor';
import './editor.css';
import { FileKey } from '../../../redux/prop-types';
import Editor, { type EditorProps } from './editor';

export type VisibleEditors = {
  indexhtml?: boolean;
  indexjsx?: boolean;
  stylescss?: boolean;
  scriptjs?: boolean;
  datajson?: boolean;
  indexts?: boolean;
  mainpy?: boolean;
};
type MultifileEditorProps = Pick<
  EditorProps,
  | 'usesMultifileEditor'
  | 'showProjectPreview'
  | 'title'
  | 'resizeProps'
  | 'isUsingKeyboardInTablist'
  | 'isMobileLayout'
  | 'initialTests'
  | 'editorRef'
  | 'containerRef'
  | 'block'
  | 'superBlock'
  | 'challengeFiles'
  | 'description'
  // We use dimensions to trigger a re-render of the editor
  | 'dimensions'
> & {
  visibleEditors: VisibleEditors;
};

const mapStateToProps = createSelector(
  visibleEditorsSelector,
  canFocusEditorSelector,
  consoleOutputSelector,
  isDonationModalOpenSelector,
  (
    visibleEditors: VisibleEditors,
    canFocus: boolean,
    output: string[],
    open
  ) => ({
    visibleEditors,
    canFocus: open ? false : canFocus,
    output
  })
);

const MultifileEditor = (props: MultifileEditorProps) => {
  const {
    block,
    superBlock,
    challengeFiles,
    containerRef,
    description,
    editorRef,
    initialTests,
    isMobileLayout,
    isUsingKeyboardInTablist,
    resizeProps,
    title,
    visibleEditors: {
      stylescss,
      indexhtml,
      scriptjs,
      datajson,
      indexts,
      indexjsx,
      mainpy
    },
    usesMultifileEditor,
    showProjectPreview
  } = props;
  // TODO: the tabs mess up the rendering (scroll doesn't work properly and
  // the in-editor description)

  const reflexProps = {
    propagateDimensions: true
  };

  const targetEditor = getTargetEditor(challengeFiles);

  // Only one editor should be focused and that should happen once, after it has
  // been mounted. This ref allows the editors to coordinate, without having to
  // resort to redux.
  const canFocusOnMountRef = useRef(true);

  const editorKeys = [];

  if (indexhtml) editorKeys.push('indexhtml');
  if (stylescss) editorKeys.push('stylescss');
  if (scriptjs) editorKeys.push('scriptjs');
  if (indexjsx) editorKeys.push('indexjsx');
  if (mainpy) editorKeys.push('mainpy');
  if (indexts) editorKeys.push('indexts');
  if (datajson) editorKeys.push('datajson');

  const editorAndSplitterKeys = editorKeys.reduce((acc: string[] | [], key) => {
    if (acc.length === 0) {
      return [key];
    } else {
      return [...acc, `${key}-splitter`, key];
    }
  }, []);

  return (
    <ReflexContainer
      orientation='horizontal'
      {...reflexProps}
      {...resizeProps}
      className='editor-container'
    >
      <ReflexElement flex={10} {...reflexProps} {...resizeProps}>
        <ReflexContainer orientation='vertical'>
          {editorAndSplitterKeys.map(key => {
            const isSplitter = key.endsWith('-splitter');
            if (isSplitter) {
              return (
                <ReflexSplitter propagate={true} {...resizeProps} key={key} />
              );
            } else {
              return (
                <ReflexElement
                  data-playwright-test-label={`editor-container-${key}`}
                  {...reflexProps}
                  {...resizeProps}
                  key={key}
                >
                  <Editor
                    canFocusOnMountRef={canFocusOnMountRef}
                    block={block}
                    superBlock={superBlock}
                    challengeFiles={challengeFiles}
                    containerRef={containerRef}
                    description={targetEditor === key ? description : ''}
                    editorRef={editorRef}
                    fileKey={key as FileKey}
                    initialTests={initialTests}
                    isMobileLayout={isMobileLayout}
                    isUsingKeyboardInTablist={isUsingKeyboardInTablist}
                    resizeProps={resizeProps}
                    dimensions={props.dimensions ?? { height: 0, width: 0 }}
                    title={title}
                    usesMultifileEditor={usesMultifileEditor}
                    showProjectPreview={showProjectPreview}
                  />
                </ReflexElement>
              );
            }
          })}
        </ReflexContainer>
      </ReflexElement>
    </ReflexContainer>
  );
};

MultifileEditor.displayName = 'MultifileEditor';

export default connect(mapStateToProps)(MultifileEditor);
