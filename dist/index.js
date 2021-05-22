import { EditorState } from '@codemirror/state';
export { Compartment, EditorSelection, EditorState } from '@codemirror/state';
export { StreamLanguage } from '@codemirror/stream-parser';
export { julia } from '@codemirror/legacy-modes/mode/julia';
import { lineNumbers } from '@codemirror/gutter';
import { highlightSpecialChars, drawSelection, highlightActiveLine, keymap } from '@codemirror/view';
export { EditorView, keymap } from '@codemirror/view';
import { history, historyKeymap } from '@codemirror/history';
export { history, historyKeymap } from '@codemirror/history';
import { defaultKeymap } from '@codemirror/commands';
export { defaultKeymap, indentLess, indentMore } from '@codemirror/commands';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { indentOnInput } from '@codemirror/language';
import { rectangularSelection } from '@codemirror/rectangular-selection';
import { foldGutter, foldKeymap } from '@codemirror/fold';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { commentKeymap } from '@codemirror/comment';

const basicSetup = [
    /*@__PURE__*/lineNumbers(),
    /*@__PURE__*/highlightSpecialChars(),
    /*@__PURE__*/history(),
    /*@__PURE__*/foldGutter(),
    /*@__PURE__*/drawSelection(),
    /*@__PURE__*/EditorState.allowMultipleSelections.of(true),
    /*@__PURE__*/indentOnInput(),
    defaultHighlightStyle.fallback,
    /*@__PURE__*/bracketMatching(),
    /*@__PURE__*/closeBrackets(),
    /*@__PURE__*/autocompletion(),
    /*@__PURE__*/rectangularSelection(),
    /*@__PURE__*/highlightActiveLine(),
    /*@__PURE__*/highlightSelectionMatches(),
    /*@__PURE__*/keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...completionKeymap,
        //    ...lint.lintKeymap,
    ]),
];

export { basicSetup };
