import Editor from '@draft-js-plugins/editor';

import React from 'react';

const TextEditor = ({ editorState, onChange }) => (
  <>
    <Editor
      editorState={editorState}
      onChange={onChange}
    />
  </>
);

export default TextEditor;