'use client';

import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { basicDark } from 'cm6-theme-basic-dark';
import { useTheme } from 'next-themes';
import React from 'react';

import '@mdxeditor/editor/style.css';
import './dark-editor.css';
import { cn } from '@/lib/utils';
import { EditorIF } from '@/types/global';

const Editor = ({ editorRef, value, fieldChange, ...props }: EditorIF) => {
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === 'dark' ? [basicDark] : [];

  const pluginMarkDown = [
    headingsPlugin(),
    listsPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    tablePlugin(),
    imagePlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
    codeMirrorPlugin({
      codeBlockLanguages: {
        css: 'css',
        txt: 'txt',
        sql: 'sql',
        html: 'html',
        saas: 'saas',
        scss: 'scss',
        bash: 'bash',
        json: 'json',
        js: 'javascript',
        ts: 'typescript',
        '': 'unspecified',
        tsx: 'TypeScript (React)',
        jsx: 'JavaScript (React)',
      },
      autoLoadLanguageSupport: true,
      codeMirrorExtensions: theme,
    }),
    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
    toolbarPlugin({
      toolbarContents: () => (
        <ConditionalContents
          options={[
            {
              when: (editor) => editor?.editorType === 'codeblock',
              contents: () => <ChangeCodeMirrorLanguage />,
            },
            {
              fallback: () => (
                <>
                  <UndoRedo />
                  <Separator />

                  <BoldItalicUnderlineToggles />
                  <Separator />

                  <ListsToggle />
                  <Separator />

                  <CreateLink />
                  <InsertImage />
                  <Separator />

                  <InsertTable />
                  <InsertThematicBreak />

                  <InsertCodeBlock />
                </>
              ),
            },
          ]}
        />
      ),
    }),
  ];

  return (
    <MDXEditor
      key={resolvedTheme}
      onChange={fieldChange}
      plugins={pluginMarkDown}
      {...props}
      className={cn(
        'background-light800_dark200 markdown-editor dark-editor m-px grid w-full rounded-md border-2',
        props.className,
      )}
      markdown={value}
      ref={editorRef}
    />
  );
};

export default Editor;
