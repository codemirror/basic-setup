import { EditorState, EditorSelection, Compartment } from "@codemirror/state"
import { StreamLanguage } from "@codemirror/stream-parser"
import { julia } from "@codemirror/legacy-modes/mode/julia"
import { lineNumbers } from "@codemirror/gutter"
import {
    keymap,
    EditorView,
    highlightSpecialChars,
    drawSelection,
    highlightActiveLine,
    placeholder,
    Decoration,
    ViewUpdate,
    ViewPlugin,
    WidgetType,
} from "@codemirror/view"
import { historyKeymap, history } from "@codemirror/history"
import { defaultKeymap, indentMore, indentLess } from "@codemirror/commands"
import { defaultHighlightStyle, tags, HighlightStyle } from "@codemirror/highlight"
import { indentOnInput, syntaxTree } from "@codemirror/language"
import { rectangularSelection } from "@codemirror/rectangular-selection"
import { foldGutter, foldKeymap } from "@codemirror/fold"
import { bracketMatching } from "@codemirror/matchbrackets"
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets"
import { autocompletion } from "@codemirror/autocomplete"
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search"
import { completionKeymap } from "@codemirror/autocomplete"
import { commentKeymap } from "@codemirror/comment"

export {
    EditorState,
    EditorSelection,
    Compartment,
    EditorView,
    placeholder,
    julia,
    keymap,
    history,
    historyKeymap,
    defaultKeymap,
    StreamLanguage,
    indentMore,
    indentLess,
    tags,
    HighlightStyle,
    syntaxTree,
    autocompletion,
    lineNumbers,
    highlightSpecialChars,
    foldGutter,
    drawSelection,
    indentOnInput,
    defaultHighlightStyle,
    bracketMatching,
    closeBrackets,
    rectangularSelection,
    highlightSelectionMatches,
    closeBracketsKeymap,
    searchKeymap,
    foldKeymap,
    commentKeymap,
    completionKeymap,
    Decoration,
    ViewUpdate,
    ViewPlugin,
    WidgetType,
}
