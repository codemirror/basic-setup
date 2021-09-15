import * as _codemirror_state from '@codemirror/state';
export { Compartment, EditorSelection, EditorState } from '@codemirror/state';
export { StreamLanguage } from '@codemirror/stream-parser';
export { julia } from '@codemirror/legacy-modes/mode/julia';
export { EditorView, keymap } from '@codemirror/view';
export { history, historyKeymap } from '@codemirror/history';
export { defaultKeymap, indentLess, indentMore } from '@codemirror/commands';
export { HighlightStyle, tags } from '@codemirror/highlight';

declare const basicSetup: _codemirror_state.Extension[];

export { basicSetup };
