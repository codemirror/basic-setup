import { EditorState, EditorSelection, Compartment, SelectionRange, Facet, StateField, StateEffect, Transaction, Text, combineConfig, Annotation } from "@codemirror/state"
import { StreamLanguage } from "@codemirror/stream-parser"
import { julia as julia_legacy } from "@codemirror/legacy-modes/mode/julia"
import { julia as julia_andrey } from "lang-julia"
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
import { indentOnInput, indentUnit, syntaxTree } from "@codemirror/language"
import { rectangularSelection } from "@codemirror/rectangular-selection"
import { foldGutter, foldKeymap } from "@codemirror/fold"
import { bracketMatching } from "@codemirror/matchbrackets"
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets"
import * as autocomplete from "@codemirror/autocomplete";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search"
import { completionKeymap } from "@codemirror/autocomplete"
import { commentKeymap } from "@codemirror/comment"
import { TreeCursor, NodeProp, parseMixed } from "@lezer/common"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { html, htmlLanguage } from "@codemirror/lang-html"
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript"
import { sql, PostgreSQL } from "@codemirror/lang-sql"
import { python, pythonLanguage } from "@codemirror/lang-python"
import {collab} from "@codemirror/collab"

export {
    Facet,
    StateField,
    StateEffect,
    Transaction,
    indentUnit,
    EditorState,
    EditorSelection,
    Compartment,
    EditorView,
    SelectionRange,
    placeholder,
    julia_legacy,
    julia_andrey,
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
    autocomplete,
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
    TreeCursor,
    Text,
    combineConfig,
    NodeProp,
    // Syntax Highlighting magic
    markdown,
    markdownLanguage,
    parseMixed,
    html,
    htmlLanguage,
    javascript,
    javascriptLanguage,
    sql,
    PostgreSQL,
    python,
    pythonLanguage,
    // Collaboration
    collab,
    Annotation
}
