'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var state = require('@codemirror/state');
var streamParser = require('@codemirror/stream-parser');
var julia = require('@codemirror/legacy-modes/mode/julia');
var gutter = require('@codemirror/gutter');
var view = require('@codemirror/view');
var history = require('@codemirror/history');
var commands = require('@codemirror/commands');
var highlight = require('@codemirror/highlight');
var language = require('@codemirror/language');
var rectangularSelection = require('@codemirror/rectangular-selection');
var fold = require('@codemirror/fold');
var matchbrackets = require('@codemirror/matchbrackets');
var closebrackets = require('@codemirror/closebrackets');
var autocomplete = require('@codemirror/autocomplete');
var search = require('@codemirror/search');
var comment = require('@codemirror/comment');

const basicSetup = [
    gutter.lineNumbers(),
    view.highlightSpecialChars(),
    history.history(),
    fold.foldGutter(),
    view.drawSelection(),
    state.EditorState.allowMultipleSelections.of(true),
    language.indentOnInput(),
    highlight.defaultHighlightStyle.fallback,
    matchbrackets.bracketMatching(),
    closebrackets.closeBrackets(),
    autocomplete.autocompletion(),
    rectangularSelection.rectangularSelection(),
    view.highlightActiveLine(),
    search.highlightSelectionMatches(),
    view.keymap.of([
        ...closebrackets.closeBracketsKeymap,
        ...commands.defaultKeymap,
        ...search.searchKeymap,
        ...history.historyKeymap,
        ...fold.foldKeymap,
        ...comment.commentKeymap,
        ...autocomplete.completionKeymap,
        //    ...lint.lintKeymap,
    ]),
];

Object.defineProperty(exports, 'Compartment', {
    enumerable: true,
    get: function () {
        return state.Compartment;
    }
});
Object.defineProperty(exports, 'EditorSelection', {
    enumerable: true,
    get: function () {
        return state.EditorSelection;
    }
});
Object.defineProperty(exports, 'EditorState', {
    enumerable: true,
    get: function () {
        return state.EditorState;
    }
});
Object.defineProperty(exports, 'StreamLanguage', {
    enumerable: true,
    get: function () {
        return streamParser.StreamLanguage;
    }
});
Object.defineProperty(exports, 'julia', {
    enumerable: true,
    get: function () {
        return julia.julia;
    }
});
Object.defineProperty(exports, 'EditorView', {
    enumerable: true,
    get: function () {
        return view.EditorView;
    }
});
Object.defineProperty(exports, 'keymap', {
    enumerable: true,
    get: function () {
        return view.keymap;
    }
});
Object.defineProperty(exports, 'history', {
    enumerable: true,
    get: function () {
        return history.history;
    }
});
Object.defineProperty(exports, 'historyKeymap', {
    enumerable: true,
    get: function () {
        return history.historyKeymap;
    }
});
Object.defineProperty(exports, 'defaultKeymap', {
    enumerable: true,
    get: function () {
        return commands.defaultKeymap;
    }
});
Object.defineProperty(exports, 'indentLess', {
    enumerable: true,
    get: function () {
        return commands.indentLess;
    }
});
Object.defineProperty(exports, 'indentMore', {
    enumerable: true,
    get: function () {
        return commands.indentMore;
    }
});
Object.defineProperty(exports, 'HighlightStyle', {
    enumerable: true,
    get: function () {
        return highlight.HighlightStyle;
    }
});
Object.defineProperty(exports, 'tags', {
    enumerable: true,
    get: function () {
        return highlight.tags;
    }
});
exports.basicSetup = basicSetup;
