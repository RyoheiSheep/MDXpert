// src/Editor.tsx
import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<h1>はじめに</h1><p>ここに本文を入力します。</p>',
  });

  return (
    <div style={{ padding: '20px' }}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
