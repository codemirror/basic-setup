'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var state = require('@codemirror/state');
var streamParser = require('@codemirror/stream-parser');
var julia = require('@codemirror/legacy-modes/mode/julia');
var langJulia = require('lang-julia');
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
var common = require('@lezer/common');



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
Object.defineProperty(exports, 'SelectionRange', {
	enumerable: true,
	get: function () {
		return state.SelectionRange;
	}
});
Object.defineProperty(exports, 'StreamLanguage', {
	enumerable: true,
	get: function () {
		return streamParser.StreamLanguage;
	}
});
Object.defineProperty(exports, 'julia_legacy', {
	enumerable: true,
	get: function () {
		return julia.julia;
	}
});
Object.defineProperty(exports, 'julia_andrey', {
	enumerable: true,
	get: function () {
		return langJulia.julia;
	}
});
Object.defineProperty(exports, 'lineNumbers', {
	enumerable: true,
	get: function () {
		return gutter.lineNumbers;
	}
});
Object.defineProperty(exports, 'Decoration', {
	enumerable: true,
	get: function () {
		return view.Decoration;
	}
});
Object.defineProperty(exports, 'EditorView', {
	enumerable: true,
	get: function () {
		return view.EditorView;
	}
});
Object.defineProperty(exports, 'ViewPlugin', {
	enumerable: true,
	get: function () {
		return view.ViewPlugin;
	}
});
Object.defineProperty(exports, 'ViewUpdate', {
	enumerable: true,
	get: function () {
		return view.ViewUpdate;
	}
});
Object.defineProperty(exports, 'WidgetType', {
	enumerable: true,
	get: function () {
		return view.WidgetType;
	}
});
Object.defineProperty(exports, 'drawSelection', {
	enumerable: true,
	get: function () {
		return view.drawSelection;
	}
});
Object.defineProperty(exports, 'highlightSpecialChars', {
	enumerable: true,
	get: function () {
		return view.highlightSpecialChars;
	}
});
Object.defineProperty(exports, 'keymap', {
	enumerable: true,
	get: function () {
		return view.keymap;
	}
});
Object.defineProperty(exports, 'placeholder', {
	enumerable: true,
	get: function () {
		return view.placeholder;
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
Object.defineProperty(exports, 'defaultHighlightStyle', {
	enumerable: true,
	get: function () {
		return highlight.defaultHighlightStyle;
	}
});
Object.defineProperty(exports, 'tags', {
	enumerable: true,
	get: function () {
		return highlight.tags;
	}
});
Object.defineProperty(exports, 'indentOnInput', {
	enumerable: true,
	get: function () {
		return language.indentOnInput;
	}
});
Object.defineProperty(exports, 'syntaxTree', {
	enumerable: true,
	get: function () {
		return language.syntaxTree;
	}
});
Object.defineProperty(exports, 'rectangularSelection', {
	enumerable: true,
	get: function () {
		return rectangularSelection.rectangularSelection;
	}
});
Object.defineProperty(exports, 'foldGutter', {
	enumerable: true,
	get: function () {
		return fold.foldGutter;
	}
});
Object.defineProperty(exports, 'foldKeymap', {
	enumerable: true,
	get: function () {
		return fold.foldKeymap;
	}
});
Object.defineProperty(exports, 'bracketMatching', {
	enumerable: true,
	get: function () {
		return matchbrackets.bracketMatching;
	}
});
Object.defineProperty(exports, 'closeBrackets', {
	enumerable: true,
	get: function () {
		return closebrackets.closeBrackets;
	}
});
Object.defineProperty(exports, 'closeBracketsKeymap', {
	enumerable: true,
	get: function () {
		return closebrackets.closeBracketsKeymap;
	}
});
Object.defineProperty(exports, 'autocompletion', {
	enumerable: true,
	get: function () {
		return autocomplete.autocompletion;
	}
});
Object.defineProperty(exports, 'completionKeymap', {
	enumerable: true,
	get: function () {
		return autocomplete.completionKeymap;
	}
});
Object.defineProperty(exports, 'highlightSelectionMatches', {
	enumerable: true,
	get: function () {
		return search.highlightSelectionMatches;
	}
});
Object.defineProperty(exports, 'searchKeymap', {
	enumerable: true,
	get: function () {
		return search.searchKeymap;
	}
});
Object.defineProperty(exports, 'commentKeymap', {
	enumerable: true,
	get: function () {
		return comment.commentKeymap;
	}
});
Object.defineProperty(exports, 'TreeCursor', {
	enumerable: true,
	get: function () {
		return common.TreeCursor;
	}
});
