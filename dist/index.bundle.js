// node_modules/@codemirror/text/dist/index.js
var extend = /* @__PURE__ */ "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((s) => s ? parseInt(s, 36) : 1);
for (let i = 1; i < extend.length; i++)
  extend[i] += extend[i - 1];
function isExtendingChar(code) {
  for (let i = 1; i < extend.length; i += 2)
    if (extend[i] > code)
      return extend[i - 1] <= code;
  return false;
}
function isRegionalIndicator(code) {
  return code >= 127462 && code <= 127487;
}
var ZWJ = 8205;
function findClusterBreak(str, pos, forward = true) {
  return (forward ? nextClusterBreak : prevClusterBreak)(str, pos);
}
function nextClusterBreak(str, pos) {
  if (pos == str.length)
    return pos;
  if (pos && surrogateLow(str.charCodeAt(pos)) && surrogateHigh(str.charCodeAt(pos - 1)))
    pos--;
  let prev = codePointAt(str, pos);
  pos += codePointSize(prev);
  while (pos < str.length) {
    let next = codePointAt(str, pos);
    if (prev == ZWJ || next == ZWJ || isExtendingChar(next)) {
      pos += codePointSize(next);
      prev = next;
    } else if (isRegionalIndicator(next)) {
      let countBefore = 0, i = pos - 2;
      while (i >= 0 && isRegionalIndicator(codePointAt(str, i))) {
        countBefore++;
        i -= 2;
      }
      if (countBefore % 2 == 0)
        break;
      else
        pos += 2;
    } else {
      break;
    }
  }
  return pos;
}
function prevClusterBreak(str, pos) {
  while (pos > 0) {
    let found = nextClusterBreak(str, pos - 2);
    if (found < pos)
      return found;
    pos--;
  }
  return 0;
}
function surrogateLow(ch) {
  return ch >= 56320 && ch < 57344;
}
function surrogateHigh(ch) {
  return ch >= 55296 && ch < 56320;
}
function codePointAt(str, pos) {
  let code0 = str.charCodeAt(pos);
  if (!surrogateHigh(code0) || pos + 1 == str.length)
    return code0;
  let code1 = str.charCodeAt(pos + 1);
  if (!surrogateLow(code1))
    return code0;
  return (code0 - 55296 << 10) + (code1 - 56320) + 65536;
}
function fromCodePoint(code) {
  if (code <= 65535)
    return String.fromCharCode(code);
  code -= 65536;
  return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
function codePointSize(code) {
  return code < 65536 ? 1 : 2;
}
function countColumn(string2, tabSize, to = string2.length) {
  let n = 0;
  for (let i = 0; i < to; ) {
    if (string2.charCodeAt(i) == 9) {
      n += tabSize - n % tabSize;
      i++;
    } else {
      n++;
      i = findClusterBreak(string2, i);
    }
  }
  return n;
}
function findColumn(string2, col, tabSize) {
  for (let i = 0, n = 0; i < string2.length; ) {
    if (n >= col)
      return i;
    n += string2.charCodeAt(i) == 9 ? tabSize - n % tabSize : 1;
    i = findClusterBreak(string2, i);
  }
  return string2.length;
}
var Text = class {
  constructor() {
  }
  lineAt(pos) {
    if (pos < 0 || pos > this.length)
      throw new RangeError(`Invalid position ${pos} in document of length ${this.length}`);
    return this.lineInner(pos, false, 1, 0);
  }
  line(n) {
    if (n < 1 || n > this.lines)
      throw new RangeError(`Invalid line number ${n} in ${this.lines}-line document`);
    return this.lineInner(n, true, 1, 0);
  }
  replace(from, to, text) {
    let parts = [];
    this.decompose(0, from, parts, 2);
    if (text.length)
      text.decompose(0, text.length, parts, 1 | 2);
    this.decompose(to, this.length, parts, 1);
    return TextNode.from(parts, this.length - (to - from) + text.length);
  }
  append(other) {
    return this.replace(this.length, this.length, other);
  }
  slice(from, to = this.length) {
    let parts = [];
    this.decompose(from, to, parts, 0);
    return TextNode.from(parts, to - from);
  }
  eq(other) {
    if (other == this)
      return true;
    if (other.length != this.length || other.lines != this.lines)
      return false;
    let a = new RawTextCursor(this), b = new RawTextCursor(other);
    for (; ; ) {
      a.next();
      b.next();
      if (a.lineBreak != b.lineBreak || a.done != b.done || a.value != b.value)
        return false;
      if (a.done)
        return true;
    }
  }
  iter(dir = 1) {
    return new RawTextCursor(this, dir);
  }
  iterRange(from, to = this.length) {
    return new PartialTextCursor(this, from, to);
  }
  iterLines(from, to) {
    let inner;
    if (from == null) {
      inner = this.iter();
    } else {
      if (to == null)
        to = this.lines + 1;
      let start = this.line(from).from;
      inner = this.iterRange(start, Math.max(start, to == this.lines + 1 ? this.length : to <= 1 ? 0 : this.line(to - 1).to));
    }
    return new LineCursor(inner);
  }
  toString() {
    return this.sliceString(0);
  }
  toJSON() {
    let lines = [];
    this.flatten(lines);
    return lines;
  }
  static of(text) {
    if (text.length == 0)
      throw new RangeError("A document must have at least one line");
    if (text.length == 1 && !text[0])
      return Text.empty;
    return text.length <= 32 ? new TextLeaf(text) : TextNode.from(TextLeaf.split(text, []));
  }
};
if (typeof Symbol != "undefined")
  Text.prototype[Symbol.iterator] = function() {
    return this.iter();
  };
var TextLeaf = class extends Text {
  constructor(text, length = textLength(text)) {
    super();
    this.text = text;
    this.length = length;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(target, isLine, line, offset) {
    for (let i = 0; ; i++) {
      let string2 = this.text[i], end = offset + string2.length;
      if ((isLine ? line : end) >= target)
        return new Line(offset, end, line, string2);
      offset = end + 1;
      line++;
    }
  }
  decompose(from, to, target, open) {
    let text = from <= 0 && to >= this.length ? this : new TextLeaf(sliceText(this.text, from, to), Math.min(to, this.length) - Math.max(0, from));
    if (open & 1) {
      let prev = target.pop();
      let joined = appendText(text.text, prev.text.slice(), 0, text.length);
      if (joined.length <= 32) {
        target.push(new TextLeaf(joined, prev.length + text.length));
      } else {
        let mid = joined.length >> 1;
        target.push(new TextLeaf(joined.slice(0, mid)), new TextLeaf(joined.slice(mid)));
      }
    } else {
      target.push(text);
    }
  }
  replace(from, to, text) {
    if (!(text instanceof TextLeaf))
      return super.replace(from, to, text);
    let lines = appendText(this.text, appendText(text.text, sliceText(this.text, 0, from)), to);
    let newLen = this.length + text.length - (to - from);
    if (lines.length <= 32)
      return new TextLeaf(lines, newLen);
    return TextNode.from(TextLeaf.split(lines, []), newLen);
  }
  sliceString(from, to = this.length, lineSep = "\n") {
    let result = "";
    for (let pos = 0, i = 0; pos <= to && i < this.text.length; i++) {
      let line = this.text[i], end = pos + line.length;
      if (pos > from && i)
        result += lineSep;
      if (from < end && to > pos)
        result += line.slice(Math.max(0, from - pos), to - pos);
      pos = end + 1;
    }
    return result;
  }
  flatten(target) {
    for (let line of this.text)
      target.push(line);
  }
  static split(text, target) {
    let part = [], len = -1;
    for (let line of text) {
      part.push(line);
      len += line.length + 1;
      if (part.length == 32) {
        target.push(new TextLeaf(part, len));
        part = [];
        len = -1;
      }
    }
    if (len > -1)
      target.push(new TextLeaf(part, len));
    return target;
  }
};
var TextNode = class extends Text {
  constructor(children, length) {
    super();
    this.children = children;
    this.length = length;
    this.lines = 0;
    for (let child of children)
      this.lines += child.lines;
  }
  lineInner(target, isLine, line, offset) {
    for (let i = 0; ; i++) {
      let child = this.children[i], end = offset + child.length, endLine = line + child.lines - 1;
      if ((isLine ? endLine : end) >= target)
        return child.lineInner(target, isLine, line, offset);
      offset = end + 1;
      line = endLine + 1;
    }
  }
  decompose(from, to, target, open) {
    for (let i = 0, pos = 0; pos <= to && i < this.children.length; i++) {
      let child = this.children[i], end = pos + child.length;
      if (from <= end && to >= pos) {
        let childOpen = open & ((pos <= from ? 1 : 0) | (end >= to ? 2 : 0));
        if (pos >= from && end <= to && !childOpen)
          target.push(child);
        else
          child.decompose(from - pos, to - pos, target, childOpen);
      }
      pos = end + 1;
    }
  }
  replace(from, to, text) {
    if (text.lines < this.lines)
      for (let i = 0, pos = 0; i < this.children.length; i++) {
        let child = this.children[i], end = pos + child.length;
        if (from >= pos && to <= end) {
          let updated = child.replace(from - pos, to - pos, text);
          let totalLines = this.lines - child.lines + updated.lines;
          if (updated.lines < totalLines >> 5 - 1 && updated.lines > totalLines >> 5 + 1) {
            let copy = this.children.slice();
            copy[i] = updated;
            return new TextNode(copy, this.length - (to - from) + text.length);
          }
          return super.replace(pos, end, updated);
        }
        pos = end + 1;
      }
    return super.replace(from, to, text);
  }
  sliceString(from, to = this.length, lineSep = "\n") {
    let result = "";
    for (let i = 0, pos = 0; i < this.children.length && pos <= to; i++) {
      let child = this.children[i], end = pos + child.length;
      if (pos > from && i)
        result += lineSep;
      if (from < end && to > pos)
        result += child.sliceString(from - pos, to - pos, lineSep);
      pos = end + 1;
    }
    return result;
  }
  flatten(target) {
    for (let child of this.children)
      child.flatten(target);
  }
  static from(children, length = children.reduce((l, ch) => l + ch.length + 1, -1)) {
    let lines = 0;
    for (let ch of children)
      lines += ch.lines;
    if (lines < 32) {
      let flat = [];
      for (let ch of children)
        ch.flatten(flat);
      return new TextLeaf(flat, length);
    }
    let chunk = Math.max(32, lines >> 5), maxChunk = chunk << 1, minChunk = chunk >> 1;
    let chunked = [], currentLines = 0, currentLen = -1, currentChunk = [];
    function add2(child) {
      let last;
      if (child.lines > maxChunk && child instanceof TextNode) {
        for (let node of child.children)
          add2(node);
      } else if (child.lines > minChunk && (currentLines > minChunk || !currentLines)) {
        flush();
        chunked.push(child);
      } else if (child instanceof TextLeaf && currentLines && (last = currentChunk[currentChunk.length - 1]) instanceof TextLeaf && child.lines + last.lines <= 32) {
        currentLines += child.lines;
        currentLen += child.length + 1;
        currentChunk[currentChunk.length - 1] = new TextLeaf(last.text.concat(child.text), last.length + 1 + child.length);
      } else {
        if (currentLines + child.lines > chunk)
          flush();
        currentLines += child.lines;
        currentLen += child.length + 1;
        currentChunk.push(child);
      }
    }
    function flush() {
      if (currentLines == 0)
        return;
      chunked.push(currentChunk.length == 1 ? currentChunk[0] : TextNode.from(currentChunk, currentLen));
      currentLen = -1;
      currentLines = currentChunk.length = 0;
    }
    for (let child of children)
      add2(child);
    flush();
    return chunked.length == 1 ? chunked[0] : new TextNode(chunked, length);
  }
};
Text.empty = /* @__PURE__ */ new TextLeaf([""], 0);
function textLength(text) {
  let length = -1;
  for (let line of text)
    length += line.length + 1;
  return length;
}
function appendText(text, target, from = 0, to = 1e9) {
  for (let pos = 0, i = 0, first = true; i < text.length && pos <= to; i++) {
    let line = text[i], end = pos + line.length;
    if (end >= from) {
      if (end > to)
        line = line.slice(0, to - pos);
      if (pos < from)
        line = line.slice(from - pos);
      if (first) {
        target[target.length - 1] += line;
        first = false;
      } else
        target.push(line);
    }
    pos = end + 1;
  }
  return target;
}
function sliceText(text, from, to) {
  return appendText(text, [""], from, to);
}
var RawTextCursor = class {
  constructor(text, dir = 1) {
    this.dir = dir;
    this.done = false;
    this.lineBreak = false;
    this.value = "";
    this.nodes = [text];
    this.offsets = [dir > 0 ? 1 : (text instanceof TextLeaf ? text.text.length : text.children.length) << 1];
  }
  nextInner(skip, dir) {
    this.done = this.lineBreak = false;
    for (; ; ) {
      let last = this.nodes.length - 1;
      let top2 = this.nodes[last], offsetValue = this.offsets[last], offset = offsetValue >> 1;
      let size = top2 instanceof TextLeaf ? top2.text.length : top2.children.length;
      if (offset == (dir > 0 ? size : 0)) {
        if (last == 0) {
          this.done = true;
          this.value = "";
          return this;
        }
        if (dir > 0)
          this.offsets[last - 1]++;
        this.nodes.pop();
        this.offsets.pop();
      } else if ((offsetValue & 1) == (dir > 0 ? 0 : 1)) {
        this.offsets[last] += dir;
        if (skip == 0) {
          this.lineBreak = true;
          this.value = "\n";
          return this;
        }
        skip--;
      } else if (top2 instanceof TextLeaf) {
        let next = top2.text[offset + (dir < 0 ? -1 : 0)];
        this.offsets[last] += dir;
        if (next.length > Math.max(0, skip)) {
          this.value = skip == 0 ? next : dir > 0 ? next.slice(skip) : next.slice(0, next.length - skip);
          return this;
        }
        skip -= next.length;
      } else {
        let next = top2.children[offset + (dir < 0 ? -1 : 0)];
        if (skip > next.length) {
          skip -= next.length;
          this.offsets[last] += dir;
        } else {
          if (dir < 0)
            this.offsets[last]--;
          this.nodes.push(next);
          this.offsets.push(dir > 0 ? 1 : (next instanceof TextLeaf ? next.text.length : next.children.length) << 1);
        }
      }
    }
  }
  next(skip = 0) {
    if (skip < 0) {
      this.nextInner(-skip, -this.dir);
      skip = this.value.length;
    }
    return this.nextInner(skip, this.dir);
  }
};
var PartialTextCursor = class {
  constructor(text, start, end) {
    this.value = "";
    this.done = false;
    this.cursor = new RawTextCursor(text, start > end ? -1 : 1);
    this.pos = start > end ? text.length : 0;
    this.from = Math.min(start, end);
    this.to = Math.max(start, end);
  }
  nextInner(skip, dir) {
    if (dir < 0 ? this.pos <= this.from : this.pos >= this.to) {
      this.value = "";
      this.done = true;
      return this;
    }
    skip += Math.max(0, dir < 0 ? this.pos - this.to : this.from - this.pos);
    let limit = dir < 0 ? this.pos - this.from : this.to - this.pos;
    if (skip > limit)
      skip = limit;
    limit -= skip;
    let { value } = this.cursor.next(skip);
    this.pos += (value.length + skip) * dir;
    this.value = value.length <= limit ? value : dir < 0 ? value.slice(value.length - limit) : value.slice(0, limit);
    this.done = !this.value;
    return this;
  }
  next(skip = 0) {
    if (skip < 0)
      skip = Math.max(skip, this.from - this.pos);
    else if (skip > 0)
      skip = Math.min(skip, this.to - this.pos);
    return this.nextInner(skip, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
};
var LineCursor = class {
  constructor(inner) {
    this.inner = inner;
    this.afterBreak = true;
    this.value = "";
    this.done = false;
  }
  next(skip = 0) {
    let { done, lineBreak, value } = this.inner.next(skip);
    if (done) {
      this.done = true;
      this.value = "";
    } else if (lineBreak) {
      if (this.afterBreak) {
        this.value = "";
      } else {
        this.afterBreak = true;
        this.next();
      }
    } else {
      this.value = value;
      this.afterBreak = false;
    }
    return this;
  }
  get lineBreak() {
    return false;
  }
};
var Line = class {
  constructor(from, to, number2, text) {
    this.from = from;
    this.to = to;
    this.number = number2;
    this.text = text;
  }
  get length() {
    return this.to - this.from;
  }
};

// node_modules/@codemirror/state/dist/index.js
var DefaultSplit = /\r\n?|\n/;
var MapMode = /* @__PURE__ */ function(MapMode2) {
  MapMode2[MapMode2["Simple"] = 0] = "Simple";
  MapMode2[MapMode2["TrackDel"] = 1] = "TrackDel";
  MapMode2[MapMode2["TrackBefore"] = 2] = "TrackBefore";
  MapMode2[MapMode2["TrackAfter"] = 3] = "TrackAfter";
  return MapMode2;
}(MapMode || (MapMode = {}));
var ChangeDesc = class {
  constructor(sections) {
    this.sections = sections;
  }
  get length() {
    let result = 0;
    for (let i = 0; i < this.sections.length; i += 2)
      result += this.sections[i];
    return result;
  }
  get newLength() {
    let result = 0;
    for (let i = 0; i < this.sections.length; i += 2) {
      let ins = this.sections[i + 1];
      result += ins < 0 ? this.sections[i] : ins;
    }
    return result;
  }
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  iterGaps(f) {
    for (let i = 0, posA = 0, posB = 0; i < this.sections.length; ) {
      let len = this.sections[i++], ins = this.sections[i++];
      if (ins < 0) {
        f(posA, posB, len);
        posB += len;
      } else {
        posB += ins;
      }
      posA += len;
    }
  }
  iterChangedRanges(f, individual = false) {
    iterChanges(this, f, individual);
  }
  get invertedDesc() {
    let sections = [];
    for (let i = 0; i < this.sections.length; ) {
      let len = this.sections[i++], ins = this.sections[i++];
      if (ins < 0)
        sections.push(len, ins);
      else
        sections.push(ins, len);
    }
    return new ChangeDesc(sections);
  }
  composeDesc(other) {
    return this.empty ? other : other.empty ? this : composeSets(this, other);
  }
  mapDesc(other, before = false) {
    return other.empty ? this : mapSet(this, other, before);
  }
  mapPos(pos, assoc = -1, mode = MapMode.Simple) {
    let posA = 0, posB = 0;
    for (let i = 0; i < this.sections.length; ) {
      let len = this.sections[i++], ins = this.sections[i++], endA = posA + len;
      if (ins < 0) {
        if (endA > pos)
          return posB + (pos - posA);
        posB += len;
      } else {
        if (mode != MapMode.Simple && endA >= pos && (mode == MapMode.TrackDel && posA < pos && endA > pos || mode == MapMode.TrackBefore && posA < pos || mode == MapMode.TrackAfter && endA > pos))
          return null;
        if (endA > pos || endA == pos && assoc < 0 && !len)
          return pos == posA || assoc < 0 ? posB : posB + ins;
        posB += ins;
      }
      posA = endA;
    }
    if (pos > posA)
      throw new RangeError(`Position ${pos} is out of range for changeset of length ${posA}`);
    return posB;
  }
  touchesRange(from, to = from) {
    for (let i = 0, pos = 0; i < this.sections.length && pos <= to; ) {
      let len = this.sections[i++], ins = this.sections[i++], end = pos + len;
      if (ins >= 0 && pos <= to && end >= from)
        return pos < from && end > to ? "cover" : true;
      pos = end;
    }
    return false;
  }
  toString() {
    let result = "";
    for (let i = 0; i < this.sections.length; ) {
      let len = this.sections[i++], ins = this.sections[i++];
      result += (result ? " " : "") + len + (ins >= 0 ? ":" + ins : "");
    }
    return result;
  }
  toJSON() {
    return this.sections;
  }
  static fromJSON(json) {
    if (!Array.isArray(json) || json.length % 2 || json.some((a) => typeof a != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new ChangeDesc(json);
  }
};
var ChangeSet = class extends ChangeDesc {
  constructor(sections, inserted) {
    super(sections);
    this.inserted = inserted;
  }
  apply(doc2) {
    if (this.length != doc2.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    iterChanges(this, (fromA, toA, fromB, _toB, text) => doc2 = doc2.replace(fromB, fromB + (toA - fromA), text), false);
    return doc2;
  }
  mapDesc(other, before = false) {
    return mapSet(this, other, before, true);
  }
  invert(doc2) {
    let sections = this.sections.slice(), inserted = [];
    for (let i = 0, pos = 0; i < sections.length; i += 2) {
      let len = sections[i], ins = sections[i + 1];
      if (ins >= 0) {
        sections[i] = ins;
        sections[i + 1] = len;
        let index = i >> 1;
        while (inserted.length < index)
          inserted.push(Text.empty);
        inserted.push(len ? doc2.slice(pos, pos + len) : Text.empty);
      }
      pos += len;
    }
    return new ChangeSet(sections, inserted);
  }
  compose(other) {
    return this.empty ? other : other.empty ? this : composeSets(this, other, true);
  }
  map(other, before = false) {
    return other.empty ? this : mapSet(this, other, before, true);
  }
  iterChanges(f, individual = false) {
    iterChanges(this, f, individual);
  }
  get desc() {
    return new ChangeDesc(this.sections);
  }
  filter(ranges) {
    let resultSections = [], resultInserted = [], filteredSections = [];
    let iter = new SectionIter(this);
    done:
      for (let i = 0, pos = 0; ; ) {
        let next = i == ranges.length ? 1e9 : ranges[i++];
        while (pos < next || pos == next && iter.len == 0) {
          if (iter.done)
            break done;
          let len = Math.min(iter.len, next - pos);
          addSection(filteredSections, len, -1);
          let ins = iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0;
          addSection(resultSections, len, ins);
          if (ins > 0)
            addInsert(resultInserted, resultSections, iter.text);
          iter.forward(len);
          pos += len;
        }
        let end = ranges[i++];
        while (pos < end) {
          if (iter.done)
            break done;
          let len = Math.min(iter.len, end - pos);
          addSection(resultSections, len, -1);
          addSection(filteredSections, len, iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0);
          iter.forward(len);
          pos += len;
        }
      }
    return {
      changes: new ChangeSet(resultSections, resultInserted),
      filtered: new ChangeDesc(filteredSections)
    };
  }
  toJSON() {
    let parts = [];
    for (let i = 0; i < this.sections.length; i += 2) {
      let len = this.sections[i], ins = this.sections[i + 1];
      if (ins < 0)
        parts.push(len);
      else if (ins == 0)
        parts.push([len]);
      else
        parts.push([len].concat(this.inserted[i >> 1].toJSON()));
    }
    return parts;
  }
  static of(changes, length, lineSep) {
    let sections = [], inserted = [], pos = 0;
    let total = null;
    function flush(force = false) {
      if (!force && !sections.length)
        return;
      if (pos < length)
        addSection(sections, length - pos, -1);
      let set = new ChangeSet(sections, inserted);
      total = total ? total.compose(set.map(total)) : set;
      sections = [];
      inserted = [];
      pos = 0;
    }
    function process2(spec) {
      if (Array.isArray(spec)) {
        for (let sub of spec)
          process2(sub);
      } else if (spec instanceof ChangeSet) {
        if (spec.length != length)
          throw new RangeError(`Mismatched change set length (got ${spec.length}, expected ${length})`);
        flush();
        total = total ? total.compose(spec.map(total)) : spec;
      } else {
        let { from, to = from, insert: insert2 } = spec;
        if (from > to || from < 0 || to > length)
          throw new RangeError(`Invalid change range ${from} to ${to} (in doc of length ${length})`);
        let insText = !insert2 ? Text.empty : typeof insert2 == "string" ? Text.of(insert2.split(lineSep || DefaultSplit)) : insert2;
        let insLen = insText.length;
        if (from == to && insLen == 0)
          return;
        if (from < pos)
          flush();
        if (from > pos)
          addSection(sections, from - pos, -1);
        addSection(sections, to - from, insLen);
        addInsert(inserted, sections, insText);
        pos = to;
      }
    }
    process2(changes);
    flush(!total);
    return total;
  }
  static empty(length) {
    return new ChangeSet(length ? [length, -1] : [], []);
  }
  static fromJSON(json) {
    if (!Array.isArray(json))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let sections = [], inserted = [];
    for (let i = 0; i < json.length; i++) {
      let part = json[i];
      if (typeof part == "number") {
        sections.push(part, -1);
      } else if (!Array.isArray(part) || typeof part[0] != "number" || part.some((e, i2) => i2 && typeof e != "string")) {
        throw new RangeError("Invalid JSON representation of ChangeSet");
      } else if (part.length == 1) {
        sections.push(part[0], 0);
      } else {
        while (inserted.length < i)
          inserted.push(Text.empty);
        inserted[i] = Text.of(part.slice(1));
        sections.push(part[0], inserted[i].length);
      }
    }
    return new ChangeSet(sections, inserted);
  }
};
function addSection(sections, len, ins, forceJoin = false) {
  if (len == 0 && ins <= 0)
    return;
  let last = sections.length - 2;
  if (last >= 0 && ins <= 0 && ins == sections[last + 1])
    sections[last] += len;
  else if (len == 0 && sections[last] == 0)
    sections[last + 1] += ins;
  else if (forceJoin) {
    sections[last] += len;
    sections[last + 1] += ins;
  } else
    sections.push(len, ins);
}
function addInsert(values, sections, value) {
  if (value.length == 0)
    return;
  let index = sections.length - 2 >> 1;
  if (index < values.length) {
    values[values.length - 1] = values[values.length - 1].append(value);
  } else {
    while (values.length < index)
      values.push(Text.empty);
    values.push(value);
  }
}
function iterChanges(desc, f, individual) {
  let inserted = desc.inserted;
  for (let posA = 0, posB = 0, i = 0; i < desc.sections.length; ) {
    let len = desc.sections[i++], ins = desc.sections[i++];
    if (ins < 0) {
      posA += len;
      posB += len;
    } else {
      let endA = posA, endB = posB, text = Text.empty;
      for (; ; ) {
        endA += len;
        endB += ins;
        if (ins && inserted)
          text = text.append(inserted[i - 2 >> 1]);
        if (individual || i == desc.sections.length || desc.sections[i + 1] < 0)
          break;
        len = desc.sections[i++];
        ins = desc.sections[i++];
      }
      f(posA, endA, posB, endB, text);
      posA = endA;
      posB = endB;
    }
  }
}
function mapSet(setA, setB, before, mkSet = false) {
  let sections = [], insert2 = mkSet ? [] : null;
  let a = new SectionIter(setA), b = new SectionIter(setB);
  for (let posA = 0, posB = 0; ; ) {
    if (a.ins == -1) {
      posA += a.len;
      a.next();
    } else if (b.ins == -1 && posB < posA) {
      let skip = Math.min(b.len, posA - posB);
      b.forward(skip);
      addSection(sections, skip, -1);
      posB += skip;
    } else if (b.ins >= 0 && (a.done || posB < posA || posB == posA && (b.len < a.len || b.len == a.len && !before))) {
      addSection(sections, b.ins, -1);
      while (posA > posB && !a.done && posA + a.len < posB + b.len) {
        posA += a.len;
        a.next();
      }
      posB += b.len;
      b.next();
    } else if (a.ins >= 0) {
      let len = 0, end = posA + a.len;
      for (; ; ) {
        if (b.ins >= 0 && posB > posA && posB + b.len < end) {
          len += b.ins;
          posB += b.len;
          b.next();
        } else if (b.ins == -1 && posB < end) {
          let skip = Math.min(b.len, end - posB);
          len += skip;
          b.forward(skip);
          posB += skip;
        } else {
          break;
        }
      }
      addSection(sections, len, a.ins);
      if (insert2)
        addInsert(insert2, sections, a.text);
      posA = end;
      a.next();
    } else if (a.done && b.done) {
      return insert2 ? new ChangeSet(sections, insert2) : new ChangeDesc(sections);
    } else {
      throw new Error("Mismatched change set lengths");
    }
  }
}
function composeSets(setA, setB, mkSet = false) {
  let sections = [];
  let insert2 = mkSet ? [] : null;
  let a = new SectionIter(setA), b = new SectionIter(setB);
  for (let open = false; ; ) {
    if (a.done && b.done) {
      return insert2 ? new ChangeSet(sections, insert2) : new ChangeDesc(sections);
    } else if (a.ins == 0) {
      addSection(sections, a.len, 0, open);
      a.next();
    } else if (b.len == 0 && !b.done) {
      addSection(sections, 0, b.ins, open);
      if (insert2)
        addInsert(insert2, sections, b.text);
      b.next();
    } else if (a.done || b.done) {
      throw new Error("Mismatched change set lengths");
    } else {
      let len = Math.min(a.len2, b.len), sectionLen = sections.length;
      if (a.ins == -1) {
        let insB = b.ins == -1 ? -1 : b.off ? 0 : b.ins;
        addSection(sections, len, insB, open);
        if (insert2 && insB)
          addInsert(insert2, sections, b.text);
      } else if (b.ins == -1) {
        addSection(sections, a.off ? 0 : a.len, len, open);
        if (insert2)
          addInsert(insert2, sections, a.textBit(len));
      } else {
        addSection(sections, a.off ? 0 : a.len, b.off ? 0 : b.ins, open);
        if (insert2 && !b.off)
          addInsert(insert2, sections, b.text);
      }
      open = (a.ins > len || b.ins >= 0 && b.len > len) && (open || sections.length > sectionLen);
      a.forward2(len);
      b.forward(len);
    }
  }
}
var SectionIter = class {
  constructor(set) {
    this.set = set;
    this.i = 0;
    this.next();
  }
  next() {
    let { sections } = this.set;
    if (this.i < sections.length) {
      this.len = sections[this.i++];
      this.ins = sections[this.i++];
    } else {
      this.len = 0;
      this.ins = -2;
    }
    this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted } = this.set, index = this.i - 2 >> 1;
    return index >= inserted.length ? Text.empty : inserted[index];
  }
  textBit(len) {
    let { inserted } = this.set, index = this.i - 2 >> 1;
    return index >= inserted.length && !len ? Text.empty : inserted[index].slice(this.off, len == null ? void 0 : this.off + len);
  }
  forward(len) {
    if (len == this.len)
      this.next();
    else {
      this.len -= len;
      this.off += len;
    }
  }
  forward2(len) {
    if (this.ins == -1)
      this.forward(len);
    else if (len == this.ins)
      this.next();
    else {
      this.ins -= len;
      this.off += len;
    }
  }
};
var SelectionRange = class {
  constructor(from, to, flags) {
    this.from = from;
    this.to = to;
    this.flags = flags;
  }
  get anchor() {
    return this.flags & 16 ? this.to : this.from;
  }
  get head() {
    return this.flags & 16 ? this.from : this.to;
  }
  get empty() {
    return this.from == this.to;
  }
  get assoc() {
    return this.flags & 4 ? -1 : this.flags & 8 ? 1 : 0;
  }
  get bidiLevel() {
    let level = this.flags & 3;
    return level == 3 ? null : level;
  }
  get goalColumn() {
    let value = this.flags >> 5;
    return value == 33554431 ? void 0 : value;
  }
  map(change, assoc = -1) {
    let from = change.mapPos(this.from, assoc), to = change.mapPos(this.to, assoc);
    return from == this.from && to == this.to ? this : new SelectionRange(from, to, this.flags);
  }
  extend(from, to = from) {
    if (from <= this.anchor && to >= this.anchor)
      return EditorSelection.range(from, to);
    let head = Math.abs(from - this.anchor) > Math.abs(to - this.anchor) ? from : to;
    return EditorSelection.range(this.anchor, head);
  }
  eq(other) {
    return this.anchor == other.anchor && this.head == other.head;
  }
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  static fromJSON(json) {
    if (!json || typeof json.anchor != "number" || typeof json.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return EditorSelection.range(json.anchor, json.head);
  }
};
var EditorSelection = class {
  constructor(ranges, mainIndex = 0) {
    this.ranges = ranges;
    this.mainIndex = mainIndex;
  }
  map(change, assoc = -1) {
    if (change.empty)
      return this;
    return EditorSelection.create(this.ranges.map((r) => r.map(change, assoc)), this.mainIndex);
  }
  eq(other) {
    if (this.ranges.length != other.ranges.length || this.mainIndex != other.mainIndex)
      return false;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(other.ranges[i]))
        return false;
    return true;
  }
  get main() {
    return this.ranges[this.mainIndex];
  }
  asSingle() {
    return this.ranges.length == 1 ? this : new EditorSelection([this.main]);
  }
  addRange(range, main = true) {
    return EditorSelection.create([range].concat(this.ranges), main ? 0 : this.mainIndex + 1);
  }
  replaceRange(range, which = this.mainIndex) {
    let ranges = this.ranges.slice();
    ranges[which] = range;
    return EditorSelection.create(ranges, this.mainIndex);
  }
  toJSON() {
    return { ranges: this.ranges.map((r) => r.toJSON()), main: this.mainIndex };
  }
  static fromJSON(json) {
    if (!json || !Array.isArray(json.ranges) || typeof json.main != "number" || json.main >= json.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new EditorSelection(json.ranges.map((r) => SelectionRange.fromJSON(r)), json.main);
  }
  static single(anchor, head = anchor) {
    return new EditorSelection([EditorSelection.range(anchor, head)], 0);
  }
  static create(ranges, mainIndex = 0) {
    if (ranges.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let pos = 0, i = 0; i < ranges.length; i++) {
      let range = ranges[i];
      if (range.empty ? range.from <= pos : range.from < pos)
        return normalized(ranges.slice(), mainIndex);
      pos = range.to;
    }
    return new EditorSelection(ranges, mainIndex);
  }
  static cursor(pos, assoc = 0, bidiLevel, goalColumn) {
    return new SelectionRange(pos, pos, (assoc == 0 ? 0 : assoc < 0 ? 4 : 8) | (bidiLevel == null ? 3 : Math.min(2, bidiLevel)) | (goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431) << 5);
  }
  static range(anchor, head, goalColumn) {
    let goal = (goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431) << 5;
    return head < anchor ? new SelectionRange(head, anchor, 16 | goal) : new SelectionRange(anchor, head, goal);
  }
};
function normalized(ranges, mainIndex = 0) {
  let main = ranges[mainIndex];
  ranges.sort((a, b) => a.from - b.from);
  mainIndex = ranges.indexOf(main);
  for (let i = 1; i < ranges.length; i++) {
    let range = ranges[i], prev = ranges[i - 1];
    if (range.empty ? range.from <= prev.to : range.from < prev.to) {
      let from = prev.from, to = Math.max(range.to, prev.to);
      if (i <= mainIndex)
        mainIndex--;
      ranges.splice(--i, 2, range.anchor > range.head ? EditorSelection.range(to, from) : EditorSelection.range(from, to));
    }
  }
  return new EditorSelection(ranges, mainIndex);
}
function checkSelection(selection, docLength) {
  for (let range of selection.ranges)
    if (range.to > docLength)
      throw new RangeError("Selection points outside of document");
}
var nextID = 0;
var Facet = class {
  constructor(combine, compareInput, compare2, isStatic, extensions) {
    this.combine = combine;
    this.compareInput = compareInput;
    this.compare = compare2;
    this.isStatic = isStatic;
    this.extensions = extensions;
    this.id = nextID++;
    this.default = combine([]);
  }
  static define(config2 = {}) {
    return new Facet(config2.combine || ((a) => a), config2.compareInput || ((a, b) => a === b), config2.compare || (!config2.combine ? sameArray : (a, b) => a === b), !!config2.static, config2.enables);
  }
  of(value) {
    return new FacetProvider([], this, 0, value);
  }
  compute(deps, get) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new FacetProvider(deps, this, 1, get);
  }
  computeN(deps, get) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new FacetProvider(deps, this, 2, get);
  }
  from(field, get) {
    if (!get)
      get = (x) => x;
    return this.compute([field], (state) => get(state.field(field)));
  }
};
function sameArray(a, b) {
  return a == b || a.length == b.length && a.every((e, i) => e === b[i]);
}
var FacetProvider = class {
  constructor(dependencies, facet, type, value) {
    this.dependencies = dependencies;
    this.facet = facet;
    this.type = type;
    this.value = value;
    this.id = nextID++;
  }
  dynamicSlot(addresses) {
    var _a;
    let getter = this.value;
    let compare2 = this.facet.compareInput;
    let idx = addresses[this.id] >> 1, multi = this.type == 2;
    let depDoc = false, depSel = false, depAddrs = [];
    for (let dep of this.dependencies) {
      if (dep == "doc")
        depDoc = true;
      else if (dep == "selection")
        depSel = true;
      else if ((((_a = addresses[dep.id]) !== null && _a !== void 0 ? _a : 1) & 1) == 0)
        depAddrs.push(addresses[dep.id]);
    }
    return (state, tr) => {
      if (!tr || tr.reconfigured) {
        state.values[idx] = getter(state);
        return 1;
      } else {
        let depChanged = depDoc && tr.docChanged || depSel && (tr.docChanged || tr.selection) || depAddrs.some((addr) => (ensureAddr(state, addr) & 1) > 0);
        if (!depChanged)
          return 0;
        let newVal = getter(state), oldVal = tr.startState.values[idx];
        if (multi ? compareArray(newVal, oldVal, compare2) : compare2(newVal, oldVal))
          return 0;
        state.values[idx] = newVal;
        return 1;
      }
    };
  }
};
function compareArray(a, b, compare2) {
  if (a.length != b.length)
    return false;
  for (let i = 0; i < a.length; i++)
    if (!compare2(a[i], b[i]))
      return false;
  return true;
}
function dynamicFacetSlot(addresses, facet, providers) {
  let providerAddrs = providers.map((p) => addresses[p.id]);
  let providerTypes = providers.map((p) => p.type);
  let dynamic = providerAddrs.filter((p) => !(p & 1));
  let idx = addresses[facet.id] >> 1;
  return (state, tr) => {
    let oldAddr = !tr ? null : tr.reconfigured ? tr.startState.config.address[facet.id] : idx << 1;
    let changed = oldAddr == null;
    for (let dynAddr of dynamic) {
      if (ensureAddr(state, dynAddr) & 1)
        changed = true;
    }
    if (!changed)
      return 0;
    let values = [];
    for (let i = 0; i < providerAddrs.length; i++) {
      let value = getAddr(state, providerAddrs[i]);
      if (providerTypes[i] == 2)
        for (let val of value)
          values.push(val);
      else
        values.push(value);
    }
    let newVal = facet.combine(values);
    if (oldAddr != null && facet.compare(newVal, getAddr(tr.startState, oldAddr)))
      return 0;
    state.values[idx] = newVal;
    return 1;
  };
}
function maybeIndex(state, id) {
  let found = state.config.address[id];
  return found == null ? null : found >> 1;
}
var initField = /* @__PURE__ */ Facet.define({ static: true });
var StateField = class {
  constructor(id, createF, updateF, compareF, spec) {
    this.id = id;
    this.createF = createF;
    this.updateF = updateF;
    this.compareF = compareF;
    this.spec = spec;
    this.provides = void 0;
  }
  static define(config2) {
    let field = new StateField(nextID++, config2.create, config2.update, config2.compare || ((a, b) => a === b), config2);
    if (config2.provide)
      field.provides = config2.provide(field);
    return field;
  }
  create(state) {
    let init = state.facet(initField).find((i) => i.field == this);
    return ((init === null || init === void 0 ? void 0 : init.create) || this.createF)(state);
  }
  slot(addresses) {
    let idx = addresses[this.id] >> 1;
    return (state, tr) => {
      if (!tr || tr.reconfigured && maybeIndex(tr.startState, this.id) == null) {
        state.values[idx] = this.create(state);
        return 1;
      }
      let oldVal, changed = 0;
      if (tr.reconfigured) {
        oldVal = tr.startState.values[maybeIndex(tr.startState, this.id)];
        changed = 1;
      } else {
        oldVal = tr.startState.values[idx];
      }
      let value = this.updateF(oldVal, tr);
      if (!changed && !this.compareF(oldVal, value))
        changed = 1;
      if (changed)
        state.values[idx] = value;
      return changed;
    };
  }
  init(create) {
    return [this, initField.of({ field: this, create })];
  }
  get extension() {
    return this;
  }
};
var Prec_ = { fallback: 3, default: 2, extend: 1, override: 0 };
function prec(value) {
  return (ext) => new PrecExtension(ext, value);
}
var Prec = {
  fallback: /* @__PURE__ */ prec(Prec_.fallback),
  default: /* @__PURE__ */ prec(Prec_.default),
  extend: /* @__PURE__ */ prec(Prec_.extend),
  override: /* @__PURE__ */ prec(Prec_.override)
};
var PrecExtension = class {
  constructor(inner, prec2) {
    this.inner = inner;
    this.prec = prec2;
  }
};
var Compartment = class {
  of(ext) {
    return new CompartmentInstance(this, ext);
  }
  reconfigure(content2) {
    return Compartment.reconfigure.of({ compartment: this, extension: content2 });
  }
  get(state) {
    return state.config.compartments.get(this);
  }
};
var CompartmentInstance = class {
  constructor(compartment, inner) {
    this.compartment = compartment;
    this.inner = inner;
  }
};
var Configuration = class {
  constructor(base2, compartments, dynamicSlots, address, staticValues) {
    this.base = base2;
    this.compartments = compartments;
    this.dynamicSlots = dynamicSlots;
    this.address = address;
    this.staticValues = staticValues;
    this.statusTemplate = [];
    while (this.statusTemplate.length < dynamicSlots.length)
      this.statusTemplate.push(0);
  }
  staticFacet(facet) {
    let addr = this.address[facet.id];
    return addr == null ? facet.default : this.staticValues[addr >> 1];
  }
  static resolve(base2, compartments, oldState) {
    let fields = [];
    let facets = Object.create(null);
    let newCompartments = new Map();
    for (let ext of flatten(base2, compartments, newCompartments)) {
      if (ext instanceof StateField)
        fields.push(ext);
      else
        (facets[ext.facet.id] || (facets[ext.facet.id] = [])).push(ext);
    }
    let address = Object.create(null);
    let staticValues = [];
    let dynamicSlots = [];
    for (let field of fields) {
      address[field.id] = dynamicSlots.length << 1;
      dynamicSlots.push((a) => field.slot(a));
    }
    for (let id in facets) {
      let providers = facets[id], facet = providers[0].facet;
      if (providers.every((p) => p.type == 0)) {
        address[facet.id] = staticValues.length << 1 | 1;
        let value = facet.combine(providers.map((p) => p.value));
        let oldAddr = oldState ? oldState.config.address[facet.id] : null;
        if (oldAddr != null) {
          let oldVal = getAddr(oldState, oldAddr);
          if (facet.compare(value, oldVal))
            value = oldVal;
        }
        staticValues.push(value);
      } else {
        for (let p of providers) {
          if (p.type == 0) {
            address[p.id] = staticValues.length << 1 | 1;
            staticValues.push(p.value);
          } else {
            address[p.id] = dynamicSlots.length << 1;
            dynamicSlots.push((a) => p.dynamicSlot(a));
          }
        }
        address[facet.id] = dynamicSlots.length << 1;
        dynamicSlots.push((a) => dynamicFacetSlot(a, facet, providers));
      }
    }
    return new Configuration(base2, newCompartments, dynamicSlots.map((f) => f(address)), address, staticValues);
  }
};
function flatten(extension, compartments, newCompartments) {
  let result = [[], [], [], []];
  let seen = new Map();
  function inner(ext, prec2) {
    let known = seen.get(ext);
    if (known != null) {
      if (known >= prec2)
        return;
      let found = result[known].indexOf(ext);
      if (found > -1)
        result[known].splice(found, 1);
      if (ext instanceof CompartmentInstance)
        newCompartments.delete(ext.compartment);
    }
    seen.set(ext, prec2);
    if (Array.isArray(ext)) {
      for (let e of ext)
        inner(e, prec2);
    } else if (ext instanceof CompartmentInstance) {
      if (newCompartments.has(ext.compartment))
        throw new RangeError(`Duplicate use of compartment in extensions`);
      let content2 = compartments.get(ext.compartment) || ext.inner;
      newCompartments.set(ext.compartment, content2);
      inner(content2, prec2);
    } else if (ext instanceof PrecExtension) {
      inner(ext.inner, ext.prec);
    } else if (ext instanceof StateField) {
      result[prec2].push(ext);
      if (ext.provides)
        inner(ext.provides, prec2);
    } else if (ext instanceof FacetProvider) {
      result[prec2].push(ext);
      if (ext.facet.extensions)
        inner(ext.facet.extensions, prec2);
    } else {
      let content2 = ext.extension;
      if (!content2)
        throw new Error(`Unrecognized extension value in extension set (${ext}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      inner(content2, prec2);
    }
  }
  inner(extension, Prec_.default);
  return result.reduce((a, b) => a.concat(b));
}
function ensureAddr(state, addr) {
  if (addr & 1)
    return 2;
  let idx = addr >> 1;
  let status = state.status[idx];
  if (status == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (status & 2)
    return status;
  state.status[idx] = 4;
  let changed = state.config.dynamicSlots[idx](state, state.applying);
  return state.status[idx] = 2 | changed;
}
function getAddr(state, addr) {
  return addr & 1 ? state.config.staticValues[addr >> 1] : state.values[addr >> 1];
}
var languageData = /* @__PURE__ */ Facet.define();
var allowMultipleSelections = /* @__PURE__ */ Facet.define({
  combine: (values) => values.some((v) => v),
  static: true
});
var lineSeparator = /* @__PURE__ */ Facet.define({
  combine: (values) => values.length ? values[0] : void 0,
  static: true
});
var changeFilter = /* @__PURE__ */ Facet.define();
var transactionFilter = /* @__PURE__ */ Facet.define();
var transactionExtender = /* @__PURE__ */ Facet.define();
var readOnly = /* @__PURE__ */ Facet.define({
  combine: (values) => values.length ? values[0] : false
});
var Annotation = class {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  static define() {
    return new AnnotationType();
  }
};
var AnnotationType = class {
  of(value) {
    return new Annotation(this, value);
  }
};
var StateEffectType = class {
  constructor(map) {
    this.map = map;
  }
  of(value) {
    return new StateEffect(this, value);
  }
};
var StateEffect = class {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  map(mapping) {
    let mapped = this.type.map(this.value, mapping);
    return mapped === void 0 ? void 0 : mapped == this.value ? this : new StateEffect(this.type, mapped);
  }
  is(type) {
    return this.type == type;
  }
  static define(spec = {}) {
    return new StateEffectType(spec.map || ((v) => v));
  }
  static mapEffects(effects, mapping) {
    if (!effects.length)
      return effects;
    let result = [];
    for (let effect of effects) {
      let mapped = effect.map(mapping);
      if (mapped)
        result.push(mapped);
    }
    return result;
  }
};
StateEffect.reconfigure = /* @__PURE__ */ StateEffect.define();
StateEffect.appendConfig = /* @__PURE__ */ StateEffect.define();
var Transaction = class {
  constructor(startState, changes, selection, effects, annotations, scrollIntoView2) {
    this.startState = startState;
    this.changes = changes;
    this.selection = selection;
    this.effects = effects;
    this.annotations = annotations;
    this.scrollIntoView = scrollIntoView2;
    this._doc = null;
    this._state = null;
    if (selection)
      checkSelection(selection, changes.newLength);
    if (!annotations.some((a) => a.type == Transaction.time))
      this.annotations = annotations.concat(Transaction.time.of(Date.now()));
  }
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  get state() {
    if (!this._state)
      this.startState.applyTransaction(this);
    return this._state;
  }
  annotation(type) {
    for (let ann of this.annotations)
      if (ann.type == type)
        return ann.value;
    return void 0;
  }
  get docChanged() {
    return !this.changes.empty;
  }
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  isUserEvent(event) {
    let e = this.annotation(Transaction.userEvent);
    return e && (e == event || e.length > event.length && e.slice(0, event.length) == event && e[event.length] == ".");
  }
};
Transaction.time = /* @__PURE__ */ Annotation.define();
Transaction.userEvent = /* @__PURE__ */ Annotation.define();
Transaction.addToHistory = /* @__PURE__ */ Annotation.define();
Transaction.remote = /* @__PURE__ */ Annotation.define();
function joinRanges(a, b) {
  let result = [];
  for (let iA = 0, iB = 0; ; ) {
    let from, to;
    if (iA < a.length && (iB == b.length || b[iB] >= a[iA])) {
      from = a[iA++];
      to = a[iA++];
    } else if (iB < b.length) {
      from = b[iB++];
      to = b[iB++];
    } else
      return result;
    if (!result.length || result[result.length - 1] < from)
      result.push(from, to);
    else if (result[result.length - 1] < to)
      result[result.length - 1] = to;
  }
}
function mergeTransaction(a, b, sequential) {
  var _a;
  let mapForA, mapForB, changes;
  if (sequential) {
    mapForA = b.changes;
    mapForB = ChangeSet.empty(b.changes.length);
    changes = a.changes.compose(b.changes);
  } else {
    mapForA = b.changes.map(a.changes);
    mapForB = a.changes.mapDesc(b.changes, true);
    changes = a.changes.compose(mapForA);
  }
  return {
    changes,
    selection: b.selection ? b.selection.map(mapForB) : (_a = a.selection) === null || _a === void 0 ? void 0 : _a.map(mapForA),
    effects: StateEffect.mapEffects(a.effects, mapForA).concat(StateEffect.mapEffects(b.effects, mapForB)),
    annotations: a.annotations.length ? a.annotations.concat(b.annotations) : b.annotations,
    scrollIntoView: a.scrollIntoView || b.scrollIntoView
  };
}
function resolveTransactionInner(state, spec, docSize) {
  let sel = spec.selection, annotations = asArray(spec.annotations);
  if (spec.userEvent)
    annotations = annotations.concat(Transaction.userEvent.of(spec.userEvent));
  return {
    changes: spec.changes instanceof ChangeSet ? spec.changes : ChangeSet.of(spec.changes || [], docSize, state.facet(lineSeparator)),
    selection: sel && (sel instanceof EditorSelection ? sel : EditorSelection.single(sel.anchor, sel.head)),
    effects: asArray(spec.effects),
    annotations,
    scrollIntoView: !!spec.scrollIntoView
  };
}
function resolveTransaction(state, specs, filter) {
  let s = resolveTransactionInner(state, specs.length ? specs[0] : {}, state.doc.length);
  if (specs.length && specs[0].filter === false)
    filter = false;
  for (let i = 1; i < specs.length; i++) {
    if (specs[i].filter === false)
      filter = false;
    let seq = !!specs[i].sequential;
    s = mergeTransaction(s, resolveTransactionInner(state, specs[i], seq ? s.changes.newLength : state.doc.length), seq);
  }
  let tr = new Transaction(state, s.changes, s.selection, s.effects, s.annotations, s.scrollIntoView);
  return extendTransaction(filter ? filterTransaction(tr) : tr);
}
function filterTransaction(tr) {
  let state = tr.startState;
  let result = true;
  for (let filter of state.facet(changeFilter)) {
    let value = filter(tr);
    if (value === false) {
      result = false;
      break;
    }
    if (Array.isArray(value))
      result = result === true ? value : joinRanges(result, value);
  }
  if (result !== true) {
    let changes, back;
    if (result === false) {
      back = tr.changes.invertedDesc;
      changes = ChangeSet.empty(state.doc.length);
    } else {
      let filtered = tr.changes.filter(result);
      changes = filtered.changes;
      back = filtered.filtered.invertedDesc;
    }
    tr = new Transaction(state, changes, tr.selection && tr.selection.map(back), StateEffect.mapEffects(tr.effects, back), tr.annotations, tr.scrollIntoView);
  }
  let filters = state.facet(transactionFilter);
  for (let i = filters.length - 1; i >= 0; i--) {
    let filtered = filters[i](tr);
    if (filtered instanceof Transaction)
      tr = filtered;
    else if (Array.isArray(filtered) && filtered.length == 1 && filtered[0] instanceof Transaction)
      tr = filtered[0];
    else
      tr = resolveTransaction(state, asArray(filtered), false);
  }
  return tr;
}
function extendTransaction(tr) {
  let state = tr.startState, extenders = state.facet(transactionExtender), spec = tr;
  for (let i = extenders.length - 1; i >= 0; i--) {
    let extension = extenders[i](tr);
    if (extension && Object.keys(extension).length)
      spec = mergeTransaction(tr, resolveTransactionInner(state, extension, tr.changes.newLength), true);
  }
  return spec == tr ? tr : new Transaction(state, tr.changes, tr.selection, spec.effects, spec.annotations, spec.scrollIntoView);
}
var none = [];
function asArray(value) {
  return value == null ? none : Array.isArray(value) ? value : [value];
}
var CharCategory = /* @__PURE__ */ function(CharCategory2) {
  CharCategory2[CharCategory2["Word"] = 0] = "Word";
  CharCategory2[CharCategory2["Space"] = 1] = "Space";
  CharCategory2[CharCategory2["Other"] = 2] = "Other";
  return CharCategory2;
}(CharCategory || (CharCategory = {}));
var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
var wordChar;
try {
  wordChar = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch (_) {
}
function hasWordChar(str) {
  if (wordChar)
    return wordChar.test(str);
  for (let i = 0; i < str.length; i++) {
    let ch = str[i];
    if (/\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch)))
      return true;
  }
  return false;
}
function makeCategorizer(wordChars) {
  return (char) => {
    if (!/\S/.test(char))
      return CharCategory.Space;
    if (hasWordChar(char))
      return CharCategory.Word;
    for (let i = 0; i < wordChars.length; i++)
      if (char.indexOf(wordChars[i]) > -1)
        return CharCategory.Word;
    return CharCategory.Other;
  };
}
var EditorState = class {
  constructor(config2, doc2, selection, tr = null) {
    this.config = config2;
    this.doc = doc2;
    this.selection = selection;
    this.applying = null;
    this.status = config2.statusTemplate.slice();
    if (tr && tr.startState.config == config2) {
      this.values = tr.startState.values.slice();
    } else {
      this.values = config2.dynamicSlots.map((_) => null);
      if (tr)
        for (let id in config2.address) {
          let cur2 = config2.address[id], prev = tr.startState.config.address[id];
          if (prev != null && (cur2 & 1) == 0)
            this.values[cur2 >> 1] = getAddr(tr.startState, prev);
        }
    }
    this.applying = tr;
    if (tr)
      tr._state = this;
    for (let i = 0; i < this.config.dynamicSlots.length; i++)
      ensureAddr(this, i << 1);
    this.applying = null;
  }
  field(field, require2 = true) {
    let addr = this.config.address[field.id];
    if (addr == null) {
      if (require2)
        throw new RangeError("Field is not present in this state");
      return void 0;
    }
    ensureAddr(this, addr);
    return getAddr(this, addr);
  }
  update(...specs) {
    return resolveTransaction(this, specs, true);
  }
  applyTransaction(tr) {
    let conf = this.config, { base: base2, compartments } = conf;
    for (let effect of tr.effects) {
      if (effect.is(Compartment.reconfigure)) {
        if (conf) {
          compartments = new Map();
          conf.compartments.forEach((val, key) => compartments.set(key, val));
          conf = null;
        }
        compartments.set(effect.value.compartment, effect.value.extension);
      } else if (effect.is(StateEffect.reconfigure)) {
        conf = null;
        base2 = effect.value;
      } else if (effect.is(StateEffect.appendConfig)) {
        conf = null;
        base2 = asArray(base2).concat(effect.value);
      }
    }
    new EditorState(conf || Configuration.resolve(base2, compartments, this), tr.newDoc, tr.newSelection, tr);
  }
  replaceSelection(text) {
    if (typeof text == "string")
      text = this.toText(text);
    return this.changeByRange((range) => ({
      changes: { from: range.from, to: range.to, insert: text },
      range: EditorSelection.cursor(range.from + text.length)
    }));
  }
  changeByRange(f) {
    let sel = this.selection;
    let result1 = f(sel.ranges[0]);
    let changes = this.changes(result1.changes), ranges = [result1.range];
    let effects = asArray(result1.effects);
    for (let i = 1; i < sel.ranges.length; i++) {
      let result = f(sel.ranges[i]);
      let newChanges = this.changes(result.changes), newMapped = newChanges.map(changes);
      for (let j = 0; j < i; j++)
        ranges[j] = ranges[j].map(newMapped);
      let mapBy = changes.mapDesc(newChanges, true);
      ranges.push(result.range.map(mapBy));
      changes = changes.compose(newMapped);
      effects = StateEffect.mapEffects(effects, newMapped).concat(StateEffect.mapEffects(asArray(result.effects), mapBy));
    }
    return {
      changes,
      selection: EditorSelection.create(ranges, sel.mainIndex),
      effects
    };
  }
  changes(spec = []) {
    if (spec instanceof ChangeSet)
      return spec;
    return ChangeSet.of(spec, this.doc.length, this.facet(EditorState.lineSeparator));
  }
  toText(string2) {
    return Text.of(string2.split(this.facet(EditorState.lineSeparator) || DefaultSplit));
  }
  sliceDoc(from = 0, to = this.doc.length) {
    return this.doc.sliceString(from, to, this.lineBreak);
  }
  facet(facet) {
    let addr = this.config.address[facet.id];
    if (addr == null)
      return facet.default;
    ensureAddr(this, addr);
    return getAddr(this, addr);
  }
  toJSON(fields) {
    let result = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (fields)
      for (let prop in fields) {
        let value = fields[prop];
        if (value instanceof StateField)
          result[prop] = value.spec.toJSON(this.field(fields[prop]), this);
      }
    return result;
  }
  static fromJSON(json, config2 = {}, fields) {
    if (!json || typeof json.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let fieldInit = [];
    if (fields)
      for (let prop in fields) {
        let field = fields[prop], value = json[prop];
        fieldInit.push(field.init((state) => field.spec.fromJSON(value, state)));
      }
    return EditorState.create({
      doc: json.doc,
      selection: EditorSelection.fromJSON(json.selection),
      extensions: config2.extensions ? fieldInit.concat([config2.extensions]) : fieldInit
    });
  }
  static create(config2 = {}) {
    let configuration = Configuration.resolve(config2.extensions || [], new Map());
    let doc2 = config2.doc instanceof Text ? config2.doc : Text.of((config2.doc || "").split(configuration.staticFacet(EditorState.lineSeparator) || DefaultSplit));
    let selection = !config2.selection ? EditorSelection.single(0) : config2.selection instanceof EditorSelection ? config2.selection : EditorSelection.single(config2.selection.anchor, config2.selection.head);
    checkSelection(selection, doc2.length);
    if (!configuration.staticFacet(allowMultipleSelections))
      selection = selection.asSingle();
    return new EditorState(configuration, doc2, selection);
  }
  get tabSize() {
    return this.facet(EditorState.tabSize);
  }
  get lineBreak() {
    return this.facet(EditorState.lineSeparator) || "\n";
  }
  get readOnly() {
    return this.facet(readOnly);
  }
  phrase(phrase) {
    for (let map of this.facet(EditorState.phrases))
      if (Object.prototype.hasOwnProperty.call(map, phrase))
        return map[phrase];
    return phrase;
  }
  languageDataAt(name2, pos, side = -1) {
    let values = [];
    for (let provider of this.facet(languageData)) {
      for (let result of provider(this, pos, side)) {
        if (Object.prototype.hasOwnProperty.call(result, name2))
          values.push(result[name2]);
      }
    }
    return values;
  }
  charCategorizer(at) {
    return makeCategorizer(this.languageDataAt("wordChars", at).join(""));
  }
  wordAt(pos) {
    let { text, from, length } = this.doc.lineAt(pos);
    let cat = this.charCategorizer(pos);
    let start = pos - from, end = pos - from;
    while (start > 0) {
      let prev = findClusterBreak(text, start, false);
      if (cat(text.slice(prev, start)) != CharCategory.Word)
        break;
      start = prev;
    }
    while (end < length) {
      let next = findClusterBreak(text, end);
      if (cat(text.slice(end, next)) != CharCategory.Word)
        break;
      end = next;
    }
    return start == end ? null : EditorSelection.range(start + from, end + from);
  }
};
EditorState.allowMultipleSelections = allowMultipleSelections;
EditorState.tabSize = /* @__PURE__ */ Facet.define({
  combine: (values) => values.length ? values[0] : 4
});
EditorState.lineSeparator = lineSeparator;
EditorState.readOnly = readOnly;
EditorState.phrases = /* @__PURE__ */ Facet.define();
EditorState.languageData = languageData;
EditorState.changeFilter = changeFilter;
EditorState.transactionFilter = transactionFilter;
EditorState.transactionExtender = transactionExtender;
Compartment.reconfigure = /* @__PURE__ */ StateEffect.define();
function combineConfig(configs, defaults3, combine = {}) {
  let result = {};
  for (let config2 of configs)
    for (let key of Object.keys(config2)) {
      let value = config2[key], current = result[key];
      if (current === void 0)
        result[key] = value;
      else if (current === value || value === void 0)
        ;
      else if (Object.hasOwnProperty.call(combine, key))
        result[key] = combine[key](current, value);
      else
        throw new Error("Config merge conflict for field " + key);
    }
  for (let key in defaults3)
    if (result[key] === void 0)
      result[key] = defaults3[key];
  return result;
}

// node_modules/@lezer/common/dist/index.js
var DefaultBufferLength = 1024;
var nextPropID = 0;
var Range = class {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
};
var NodeProp = class {
  constructor(config2 = {}) {
    this.id = nextPropID++;
    this.perNode = !!config2.perNode;
    this.deserialize = config2.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
  }
  add(match) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    if (typeof match != "function")
      match = NodeType.match(match);
    return (type) => {
      let result = match(type);
      return result === void 0 ? null : [this, result];
    };
  }
};
NodeProp.closedBy = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.openedBy = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.group = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.contextHash = new NodeProp({ perNode: true });
NodeProp.lookAhead = new NodeProp({ perNode: true });
NodeProp.mounted = new NodeProp({ perNode: true });
var noProps = Object.create(null);
var NodeType = class {
  constructor(name2, props, id, flags = 0) {
    this.name = name2;
    this.props = props;
    this.id = id;
    this.flags = flags;
  }
  static define(spec) {
    let props = spec.props && spec.props.length ? Object.create(null) : noProps;
    let flags = (spec.top ? 1 : 0) | (spec.skipped ? 2 : 0) | (spec.error ? 4 : 0) | (spec.name == null ? 8 : 0);
    let type = new NodeType(spec.name || "", props, spec.id, flags);
    if (spec.props)
      for (let src of spec.props) {
        if (!Array.isArray(src))
          src = src(type);
        if (src) {
          if (src[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          props[src[0].id] = src[1];
        }
      }
    return type;
  }
  prop(prop) {
    return this.props[prop.id];
  }
  get isTop() {
    return (this.flags & 1) > 0;
  }
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  get isError() {
    return (this.flags & 4) > 0;
  }
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  is(name2) {
    if (typeof name2 == "string") {
      if (this.name == name2)
        return true;
      let group = this.prop(NodeProp.group);
      return group ? group.indexOf(name2) > -1 : false;
    }
    return this.id == name2;
  }
  static match(map) {
    let direct = Object.create(null);
    for (let prop in map)
      for (let name2 of prop.split(" "))
        direct[name2] = map[prop];
    return (node) => {
      for (let groups = node.prop(NodeProp.group), i = -1; i < (groups ? groups.length : 0); i++) {
        let found = direct[i < 0 ? node.name : groups[i]];
        if (found)
          return found;
      }
    };
  }
};
NodeType.none = new NodeType("", Object.create(null), 0, 8);
var NodeSet = class {
  constructor(types2) {
    this.types = types2;
    for (let i = 0; i < types2.length; i++)
      if (types2[i].id != i)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  extend(...props) {
    let newTypes = [];
    for (let type of this.types) {
      let newProps = null;
      for (let source of props) {
        let add2 = source(type);
        if (add2) {
          if (!newProps)
            newProps = Object.assign({}, type.props);
          newProps[add2[0].id] = add2[1];
        }
      }
      newTypes.push(newProps ? new NodeType(type.name, newProps, type.id, type.flags) : type);
    }
    return new NodeSet(newTypes);
  }
};
var CachedNode = new WeakMap();
var Tree = class {
  constructor(type, children, positions, length, props) {
    this.type = type;
    this.children = children;
    this.positions = positions;
    this.length = length;
    this.props = null;
    if (props && props.length) {
      this.props = Object.create(null);
      for (let [prop, value] of props)
        this.props[typeof prop == "number" ? prop : prop.id] = value;
    }
  }
  toString() {
    let mounted = this.prop(NodeProp.mounted);
    if (mounted && !mounted.overlay)
      return mounted.tree.toString();
    let children = "";
    for (let ch of this.children) {
      let str = ch.toString();
      if (str) {
        if (children)
          children += ",";
        children += str;
      }
    }
    return !this.type.name ? children : (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (children.length ? "(" + children + ")" : "");
  }
  cursor(pos, side = 0) {
    let scope = pos != null && CachedNode.get(this) || this.topNode;
    let cursor = new TreeCursor(scope);
    if (pos != null) {
      cursor.moveTo(pos, side);
      CachedNode.set(this, cursor._tree);
    }
    return cursor;
  }
  fullCursor() {
    return new TreeCursor(this.topNode, 1);
  }
  get topNode() {
    return new TreeNode(this, 0, 0, null);
  }
  resolve(pos, side = 0) {
    return this.cursor(pos, side).node;
  }
  resolveInner(pos, side = 0) {
    let result = this.topNode;
    for (; ; ) {
      let inner = result.enter(pos, side);
      if (!inner)
        return result;
      result = inner;
    }
  }
  iterate(spec) {
    let { enter, leave, from = 0, to = this.length } = spec;
    for (let c = this.cursor(), get = () => c.node; ; ) {
      let mustLeave = false;
      if (c.from <= to && c.to >= from && (c.type.isAnonymous || enter(c.type, c.from, c.to, get) !== false)) {
        if (c.firstChild())
          continue;
        if (!c.type.isAnonymous)
          mustLeave = true;
      }
      for (; ; ) {
        if (mustLeave && leave)
          leave(c.type, c.from, c.to, get);
        mustLeave = c.type.isAnonymous;
        if (c.nextSibling())
          break;
        if (!c.parent())
          return;
        mustLeave = true;
      }
    }
  }
  prop(prop) {
    return !prop.perNode ? this.type.prop(prop) : this.props ? this.props[prop.id] : void 0;
  }
  get propValues() {
    let result = [];
    if (this.props)
      for (let id in this.props)
        result.push([+id, this.props[id]]);
    return result;
  }
  balance(config2 = {}) {
    return this.children.length <= 8 ? this : balanceRange(this.type, this.children, this.positions, 0, this.children.length, 0, this.length, (children, positions, length) => new Tree(this.type, children, positions, length, this.propValues), config2.makeTree || ((children, positions, length) => new Tree(NodeType.none, children, positions, length)));
  }
  static build(data) {
    return buildTree(data);
  }
};
Tree.empty = new Tree(NodeType.none, [], [], 0);
var FlatBufferCursor = class {
  constructor(buffer, index) {
    this.buffer = buffer;
    this.index = index;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new FlatBufferCursor(this.buffer, this.index);
  }
};
var TreeBuffer = class {
  constructor(buffer, length, set) {
    this.buffer = buffer;
    this.length = length;
    this.set = set;
  }
  get type() {
    return NodeType.none;
  }
  toString() {
    let result = [];
    for (let index = 0; index < this.buffer.length; ) {
      result.push(this.childString(index));
      index = this.buffer[index + 3];
    }
    return result.join(",");
  }
  childString(index) {
    let id = this.buffer[index], endIndex = this.buffer[index + 3];
    let type = this.set.types[id], result = type.name;
    if (/\W/.test(result) && !type.isError)
      result = JSON.stringify(result);
    index += 4;
    if (endIndex == index)
      return result;
    let children = [];
    while (index < endIndex) {
      children.push(this.childString(index));
      index = this.buffer[index + 3];
    }
    return result + "(" + children.join(",") + ")";
  }
  findChild(startIndex, endIndex, dir, pos, side) {
    let { buffer } = this, pick = -1;
    for (let i = startIndex; i != endIndex; i = buffer[i + 3]) {
      if (checkSide(side, pos, buffer[i + 1], buffer[i + 2])) {
        pick = i;
        if (dir > 0)
          break;
      }
    }
    return pick;
  }
  slice(startI, endI, from, to) {
    let b = this.buffer;
    let copy = new Uint16Array(endI - startI);
    for (let i = startI, j = 0; i < endI; ) {
      copy[j++] = b[i++];
      copy[j++] = b[i++] - from;
      copy[j++] = b[i++] - from;
      copy[j++] = b[i++] - startI;
    }
    return new TreeBuffer(copy, to - from, this.set);
  }
};
function checkSide(side, pos, from, to) {
  switch (side) {
    case -2:
      return from < pos;
    case -1:
      return to >= pos && from < pos;
    case 0:
      return from < pos && to > pos;
    case 1:
      return from <= pos && to > pos;
    case 2:
      return to > pos;
    case 4:
      return true;
  }
}
function enterUnfinishedNodesBefore(node, pos) {
  let scan = node.childBefore(pos);
  while (scan) {
    let last = scan.lastChild;
    if (!last || last.to != scan.to)
      break;
    if (last.type.isError && last.from == last.to) {
      node = scan;
      scan = last.prevSibling;
    } else {
      scan = last;
    }
  }
  return node;
}
var TreeNode = class {
  constructor(node, _from, index, _parent) {
    this.node = node;
    this._from = _from;
    this.index = index;
    this._parent = _parent;
  }
  get type() {
    return this.node.type;
  }
  get name() {
    return this.node.type.name;
  }
  get from() {
    return this._from;
  }
  get to() {
    return this._from + this.node.length;
  }
  nextChild(i, dir, pos, side, mode = 0) {
    for (let parent = this; ; ) {
      for (let { children, positions } = parent.node, e = dir > 0 ? children.length : -1; i != e; i += dir) {
        let next = children[i], start = positions[i] + parent._from;
        if (!checkSide(side, pos, start, start + next.length))
          continue;
        if (next instanceof TreeBuffer) {
          if (mode & 2)
            continue;
          let index = next.findChild(0, next.buffer.length, dir, pos - start, side);
          if (index > -1)
            return new BufferNode(new BufferContext(parent, next, i, start), null, index);
        } else if (mode & 1 || (!next.type.isAnonymous || hasChild(next))) {
          let mounted;
          if (next.props && (mounted = next.prop(NodeProp.mounted)) && !mounted.overlay)
            return new TreeNode(mounted.tree, start, i, parent);
          let inner = new TreeNode(next, start, i, parent);
          return mode & 1 || !inner.type.isAnonymous ? inner : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, pos, side);
        }
      }
      if (mode & 1 || !parent.type.isAnonymous)
        return null;
      if (parent.index >= 0)
        i = parent.index + dir;
      else
        i = dir < 0 ? -1 : parent._parent.node.children.length;
      parent = parent._parent;
      if (!parent)
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(0, 1, 0, 4);
  }
  get lastChild() {
    return this.nextChild(this.node.children.length - 1, -1, 0, 4);
  }
  childAfter(pos) {
    return this.nextChild(0, 1, pos, 2);
  }
  childBefore(pos) {
    return this.nextChild(this.node.children.length - 1, -1, pos, -2);
  }
  enter(pos, side, overlays = true, buffers = true) {
    let mounted;
    if (overlays && (mounted = this.node.prop(NodeProp.mounted)) && mounted.overlay) {
      let rPos = pos - this.from;
      for (let { from, to } of mounted.overlay) {
        if ((side > 0 ? from <= rPos : from < rPos) && (side < 0 ? to >= rPos : to > rPos))
          return new TreeNode(mounted.tree, mounted.overlay[0].from + this.from, -1, this);
      }
    }
    return this.nextChild(0, 1, pos, side, buffers ? 0 : 2);
  }
  nextSignificantParent() {
    let val = this;
    while (val.type.isAnonymous && val._parent)
      val = val._parent;
    return val;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index + 1, 1, 0, 4) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index - 1, -1, 0, 4) : null;
  }
  get cursor() {
    return new TreeCursor(this);
  }
  get tree() {
    return this.node;
  }
  toTree() {
    return this.node;
  }
  resolve(pos, side = 0) {
    return this.cursor.moveTo(pos, side).node;
  }
  enterUnfinishedNodesBefore(pos) {
    return enterUnfinishedNodesBefore(this, pos);
  }
  getChild(type, before = null, after = null) {
    let r = getChildren(this, type, before, after);
    return r.length ? r[0] : null;
  }
  getChildren(type, before = null, after = null) {
    return getChildren(this, type, before, after);
  }
  toString() {
    return this.node.toString();
  }
};
function getChildren(node, type, before, after) {
  let cur2 = node.cursor, result = [];
  if (!cur2.firstChild())
    return result;
  if (before != null) {
    while (!cur2.type.is(before))
      if (!cur2.nextSibling())
        return result;
  }
  for (; ; ) {
    if (after != null && cur2.type.is(after))
      return result;
    if (cur2.type.is(type))
      result.push(cur2.node);
    if (!cur2.nextSibling())
      return after == null ? result : [];
  }
}
var BufferContext = class {
  constructor(parent, buffer, index, start) {
    this.parent = parent;
    this.buffer = buffer;
    this.index = index;
    this.start = start;
  }
};
var BufferNode = class {
  constructor(context, _parent, index) {
    this.context = context;
    this._parent = _parent;
    this.index = index;
    this.type = context.buffer.set.types[context.buffer.buffer[index]];
  }
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  child(dir, pos, side) {
    let { buffer } = this.context;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.context.start, side);
    return index < 0 ? null : new BufferNode(this.context, this, index);
  }
  get firstChild() {
    return this.child(1, 0, 4);
  }
  get lastChild() {
    return this.child(-1, 0, 4);
  }
  childAfter(pos) {
    return this.child(1, pos, 2);
  }
  childBefore(pos) {
    return this.child(-1, pos, -2);
  }
  enter(pos, side, overlays, buffers = true) {
    if (!buffers)
      return null;
    let { buffer } = this.context;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], side > 0 ? 1 : -1, pos - this.context.start, side);
    return index < 0 ? null : new BufferNode(this.context, this, index);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(dir) {
    return this._parent ? null : this.context.parent.nextChild(this.context.index + dir, dir, 0, 4);
  }
  get nextSibling() {
    let { buffer } = this.context;
    let after = buffer.buffer[this.index + 3];
    if (after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length))
      return new BufferNode(this.context, this._parent, after);
    return this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer } = this.context;
    let parentStart = this._parent ? this._parent.index + 4 : 0;
    if (this.index == parentStart)
      return this.externalSibling(-1);
    return new BufferNode(this.context, this._parent, buffer.findChild(parentStart, this.index, -1, 0, 4));
  }
  get cursor() {
    return new TreeCursor(this);
  }
  get tree() {
    return null;
  }
  toTree() {
    let children = [], positions = [];
    let { buffer } = this.context;
    let startI = this.index + 4, endI = buffer.buffer[this.index + 3];
    if (endI > startI) {
      let from = buffer.buffer[this.index + 1], to = buffer.buffer[this.index + 2];
      children.push(buffer.slice(startI, endI, from, to));
      positions.push(0);
    }
    return new Tree(this.type, children, positions, this.to - this.from);
  }
  resolve(pos, side = 0) {
    return this.cursor.moveTo(pos, side).node;
  }
  enterUnfinishedNodesBefore(pos) {
    return enterUnfinishedNodesBefore(this, pos);
  }
  toString() {
    return this.context.buffer.childString(this.index);
  }
  getChild(type, before = null, after = null) {
    let r = getChildren(this, type, before, after);
    return r.length ? r[0] : null;
  }
  getChildren(type, before = null, after = null) {
    return getChildren(this, type, before, after);
  }
};
var TreeCursor = class {
  constructor(node, mode = 0) {
    this.mode = mode;
    this.buffer = null;
    this.stack = [];
    this.index = 0;
    this.bufferNode = null;
    if (node instanceof TreeNode) {
      this.yieldNode(node);
    } else {
      this._tree = node.context.parent;
      this.buffer = node.context;
      for (let n = node._parent; n; n = n._parent)
        this.stack.unshift(n.index);
      this.bufferNode = node;
      this.yieldBuf(node.index);
    }
  }
  get name() {
    return this.type.name;
  }
  yieldNode(node) {
    if (!node)
      return false;
    this._tree = node;
    this.type = node.type;
    this.from = node.from;
    this.to = node.to;
    return true;
  }
  yieldBuf(index, type) {
    this.index = index;
    let { start, buffer } = this.buffer;
    this.type = type || buffer.set.types[buffer.buffer[index]];
    this.from = start + buffer.buffer[index + 1];
    this.to = start + buffer.buffer[index + 2];
    return true;
  }
  yield(node) {
    if (!node)
      return false;
    if (node instanceof TreeNode) {
      this.buffer = null;
      return this.yieldNode(node);
    }
    this.buffer = node.context;
    return this.yieldBuf(node.index, node.type);
  }
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  enterChild(dir, pos, side) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(dir < 0 ? this._tree.node.children.length - 1 : 0, dir, pos, side, this.mode));
    let { buffer } = this.buffer;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.buffer.start, side);
    if (index < 0)
      return false;
    this.stack.push(this.index);
    return this.yieldBuf(index);
  }
  firstChild() {
    return this.enterChild(1, 0, 4);
  }
  lastChild() {
    return this.enterChild(-1, 0, 4);
  }
  childAfter(pos) {
    return this.enterChild(1, pos, 2);
  }
  childBefore(pos) {
    return this.enterChild(-1, pos, -2);
  }
  enter(pos, side, overlays = true, buffers = true) {
    if (!this.buffer)
      return this.yield(this._tree.enter(pos, side, overlays, buffers));
    return buffers ? this.enterChild(1, pos, side) : false;
  }
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & 1 ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let parent = this.mode & 1 ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    this.buffer = null;
    return this.yieldNode(parent);
  }
  sibling(dir) {
    if (!this.buffer)
      return !this._tree._parent ? false : this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + dir, dir, 0, 4, this.mode));
    let { buffer } = this.buffer, d = this.stack.length - 1;
    if (dir < 0) {
      let parentStart = d < 0 ? 0 : this.stack[d] + 4;
      if (this.index != parentStart)
        return this.yieldBuf(buffer.findChild(parentStart, this.index, -1, 0, 4));
    } else {
      let after = buffer.buffer[this.index + 3];
      if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3]))
        return this.yieldBuf(after);
    }
    return d < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, 0, 4, this.mode)) : false;
  }
  nextSibling() {
    return this.sibling(1);
  }
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(dir) {
    let index, parent, { buffer } = this;
    if (buffer) {
      if (dir > 0) {
        if (this.index < buffer.buffer.buffer.length)
          return false;
      } else {
        for (let i = 0; i < this.index; i++)
          if (buffer.buffer.buffer[i + 3] < this.index)
            return false;
      }
      ({ index, parent } = buffer);
    } else {
      ({ index, _parent: parent } = this._tree);
    }
    for (; parent; { index, _parent: parent } = parent) {
      if (index > -1)
        for (let i = index + dir, e = dir < 0 ? -1 : parent.node.children.length; i != e; i += dir) {
          let child = parent.node.children[i];
          if (this.mode & 1 || child instanceof TreeBuffer || !child.type.isAnonymous || hasChild(child))
            return false;
        }
    }
    return true;
  }
  move(dir, enter) {
    if (enter && this.enterChild(dir, 0, 4))
      return true;
    for (; ; ) {
      if (this.sibling(dir))
        return true;
      if (this.atLastNode(dir) || !this.parent())
        return false;
    }
  }
  next(enter = true) {
    return this.move(1, enter);
  }
  prev(enter = true) {
    return this.move(-1, enter);
  }
  moveTo(pos, side = 0) {
    while (this.from == this.to || (side < 1 ? this.from >= pos : this.from > pos) || (side > -1 ? this.to <= pos : this.to < pos))
      if (!this.parent())
        break;
    while (this.enterChild(1, pos, side)) {
    }
    return this;
  }
  get node() {
    if (!this.buffer)
      return this._tree;
    let cache = this.bufferNode, result = null, depth = 0;
    if (cache && cache.context == this.buffer) {
      scan:
        for (let index = this.index, d = this.stack.length; d >= 0; ) {
          for (let c = cache; c; c = c._parent)
            if (c.index == index) {
              if (index == this.index)
                return c;
              result = c;
              depth = d + 1;
              break scan;
            }
          index = this.stack[--d];
        }
    }
    for (let i = depth; i < this.stack.length; i++)
      result = new BufferNode(this.buffer, result, this.stack[i]);
    return this.bufferNode = new BufferNode(this.buffer, result, this.index);
  }
  get tree() {
    return this.buffer ? null : this._tree.node;
  }
};
function hasChild(tree) {
  return tree.children.some((ch) => ch instanceof TreeBuffer || !ch.type.isAnonymous || hasChild(ch));
}
function buildTree(data) {
  var _a;
  let { buffer, nodeSet: nodeSet2, maxBufferLength = DefaultBufferLength, reused = [], minRepeatType = nodeSet2.types.length } = data;
  let cursor = Array.isArray(buffer) ? new FlatBufferCursor(buffer, buffer.length) : buffer;
  let types2 = nodeSet2.types;
  let contextHash = 0, lookAhead = 0;
  function takeNode(parentStart, minPos, children2, positions2, inRepeat) {
    let { id, start, end, size } = cursor;
    let lookAheadAtStart = lookAhead;
    while (size < 0) {
      cursor.next();
      if (size == -1) {
        let node2 = reused[id];
        children2.push(node2);
        positions2.push(start - parentStart);
        return;
      } else if (size == -3) {
        contextHash = id;
        return;
      } else if (size == -4) {
        lookAhead = id;
        return;
      } else {
        throw new RangeError(`Unrecognized record size: ${size}`);
      }
    }
    let type = types2[id], node, buffer2;
    let startPos = start - parentStart;
    if (end - start <= maxBufferLength && (buffer2 = findBufferSize(cursor.pos - minPos, inRepeat))) {
      let data2 = new Uint16Array(buffer2.size - buffer2.skip);
      let endPos = cursor.pos - buffer2.size, index = data2.length;
      while (cursor.pos > endPos)
        index = copyToBuffer(buffer2.start, data2, index);
      node = new TreeBuffer(data2, end - buffer2.start, nodeSet2);
      startPos = buffer2.start - parentStart;
    } else {
      let endPos = cursor.pos - size;
      cursor.next();
      let localChildren = [], localPositions = [];
      let localInRepeat = id >= minRepeatType ? id : -1;
      let lastGroup = 0, lastEnd = end;
      while (cursor.pos > endPos) {
        if (localInRepeat >= 0 && cursor.id == localInRepeat && cursor.size >= 0) {
          if (cursor.end <= lastEnd - maxBufferLength) {
            makeRepeatLeaf(localChildren, localPositions, start, lastGroup, cursor.end, lastEnd, localInRepeat, lookAheadAtStart);
            lastGroup = localChildren.length;
            lastEnd = cursor.end;
          }
          cursor.next();
        } else {
          takeNode(start, endPos, localChildren, localPositions, localInRepeat);
        }
      }
      if (localInRepeat >= 0 && lastGroup > 0 && lastGroup < localChildren.length)
        makeRepeatLeaf(localChildren, localPositions, start, lastGroup, start, lastEnd, localInRepeat, lookAheadAtStart);
      localChildren.reverse();
      localPositions.reverse();
      if (localInRepeat > -1 && lastGroup > 0) {
        let make = makeBalanced(type);
        node = balanceRange(type, localChildren, localPositions, 0, localChildren.length, 0, end - start, make, make);
      } else {
        node = makeTree(type, localChildren, localPositions, end - start, lookAheadAtStart - end);
      }
    }
    children2.push(node);
    positions2.push(startPos);
  }
  function makeBalanced(type) {
    return (children2, positions2, length2) => {
      let lookAhead2 = 0, lastI = children2.length - 1, last, lookAheadProp;
      if (lastI >= 0 && (last = children2[lastI]) instanceof Tree) {
        if (!lastI && last.type == type && last.length == length2)
          return last;
        if (lookAheadProp = last.prop(NodeProp.lookAhead))
          lookAhead2 = positions2[lastI] + last.length + lookAheadProp;
      }
      return makeTree(type, children2, positions2, length2, lookAhead2);
    };
  }
  function makeRepeatLeaf(children2, positions2, base2, i, from, to, type, lookAhead2) {
    let localChildren = [], localPositions = [];
    while (children2.length > i) {
      localChildren.push(children2.pop());
      localPositions.push(positions2.pop() + base2 - from);
    }
    children2.push(makeTree(nodeSet2.types[type], localChildren, localPositions, to - from, lookAhead2 - to));
    positions2.push(from - base2);
  }
  function makeTree(type, children2, positions2, length2, lookAhead2 = 0, props) {
    if (contextHash) {
      let pair2 = [NodeProp.contextHash, contextHash];
      props = props ? [pair2].concat(props) : [pair2];
    }
    if (lookAhead2 > 25) {
      let pair2 = [NodeProp.lookAhead, lookAhead2];
      props = props ? [pair2].concat(props) : [pair2];
    }
    return new Tree(type, children2, positions2, length2, props);
  }
  function findBufferSize(maxSize, inRepeat) {
    let fork = cursor.fork();
    let size = 0, start = 0, skip = 0, minStart = fork.end - maxBufferLength;
    let result = { size: 0, start: 0, skip: 0 };
    scan:
      for (let minPos = fork.pos - maxSize; fork.pos > minPos; ) {
        let nodeSize2 = fork.size;
        if (fork.id == inRepeat && nodeSize2 >= 0) {
          result.size = size;
          result.start = start;
          result.skip = skip;
          skip += 4;
          size += 4;
          fork.next();
          continue;
        }
        let startPos = fork.pos - nodeSize2;
        if (nodeSize2 < 0 || startPos < minPos || fork.start < minStart)
          break;
        let localSkipped = fork.id >= minRepeatType ? 4 : 0;
        let nodeStart2 = fork.start;
        fork.next();
        while (fork.pos > startPos) {
          if (fork.size < 0) {
            if (fork.size == -3)
              localSkipped += 4;
            else
              break scan;
          } else if (fork.id >= minRepeatType) {
            localSkipped += 4;
          }
          fork.next();
        }
        start = nodeStart2;
        size += nodeSize2;
        skip += localSkipped;
      }
    if (inRepeat < 0 || size == maxSize) {
      result.size = size;
      result.start = start;
      result.skip = skip;
    }
    return result.size > 4 ? result : void 0;
  }
  function copyToBuffer(bufferStart, buffer2, index) {
    let { id, start, end, size } = cursor;
    cursor.next();
    if (size >= 0 && id < minRepeatType) {
      let startIndex = index;
      if (size > 4) {
        let endPos = cursor.pos - (size - 4);
        while (cursor.pos > endPos)
          index = copyToBuffer(bufferStart, buffer2, index);
      }
      buffer2[--index] = startIndex;
      buffer2[--index] = end - bufferStart;
      buffer2[--index] = start - bufferStart;
      buffer2[--index] = id;
    } else if (size == -3) {
      contextHash = id;
    } else if (size == -4) {
      lookAhead = id;
    }
    return index;
  }
  let children = [], positions = [];
  while (cursor.pos > 0)
    takeNode(data.start || 0, data.bufferStart || 0, children, positions, -1);
  let length = (_a = data.length) !== null && _a !== void 0 ? _a : children.length ? positions[0] + children[0].length : 0;
  return new Tree(types2[data.topID], children.reverse(), positions.reverse(), length);
}
var nodeSizeCache = new WeakMap();
function nodeSize(balanceType, node) {
  if (!balanceType.isAnonymous || node instanceof TreeBuffer || node.type != balanceType)
    return 1;
  let size = nodeSizeCache.get(node);
  if (size == null) {
    size = node.children.reduce((s, ch) => s + nodeSize(balanceType, ch), 1);
    nodeSizeCache.set(node, size);
  }
  return size;
}
function balanceRange(type, children, positions, from, to, start, length, mkTop, mkTree) {
  let total = 0;
  for (let i = from; i < to; i++)
    total += nodeSize(type, children[i]);
  let maxChild = Math.ceil(total * 1.5 / 8);
  let localChildren = [], localPositions = [];
  function divide(children2, positions2, from2, to2, offset) {
    for (let i = from2; i < to2; ) {
      let groupFrom = i, groupStart = positions2[i], groupSize = nodeSize(type, children2[i]);
      i++;
      for (; i < to2; i++) {
        let nextSize = nodeSize(type, children2[i]);
        if (groupSize + nextSize >= maxChild)
          break;
        groupSize += nextSize;
      }
      if (i == groupFrom + 1) {
        if (groupSize > maxChild) {
          let only = children2[groupFrom];
          divide(only.children, only.positions, 0, only.children.length, positions2[groupFrom] + offset);
          continue;
        }
        localChildren.push(children2[groupFrom]);
      } else {
        let length2 = positions2[i - 1] + children2[i - 1].length - groupStart;
        localChildren.push(balanceRange(type, children2, positions2, groupFrom, i, groupStart, length2, null, mkTree));
      }
      localPositions.push(groupStart + offset - start);
    }
  }
  divide(children, positions, from, to, 0);
  return (mkTop || mkTree)(localChildren, localPositions, length);
}
var TreeFragment = class {
  constructor(from, to, tree, offset, openStart = false, openEnd = false) {
    this.from = from;
    this.to = to;
    this.tree = tree;
    this.offset = offset;
    this.open = (openStart ? 1 : 0) | (openEnd ? 2 : 0);
  }
  get openStart() {
    return (this.open & 1) > 0;
  }
  get openEnd() {
    return (this.open & 2) > 0;
  }
  static addTree(tree, fragments = [], partial = false) {
    let result = [new TreeFragment(0, tree.length, tree, 0, false, partial)];
    for (let f of fragments)
      if (f.to > tree.length)
        result.push(f);
    return result;
  }
  static applyChanges(fragments, changes, minGap = 128) {
    if (!changes.length)
      return fragments;
    let result = [];
    let fI = 1, nextF = fragments.length ? fragments[0] : null;
    for (let cI = 0, pos = 0, off = 0; ; cI++) {
      let nextC = cI < changes.length ? changes[cI] : null;
      let nextPos = nextC ? nextC.fromA : 1e9;
      if (nextPos - pos >= minGap)
        while (nextF && nextF.from < nextPos) {
          let cut = nextF;
          if (pos >= cut.from || nextPos <= cut.to || off) {
            let fFrom = Math.max(cut.from, pos) - off, fTo = Math.min(cut.to, nextPos) - off;
            cut = fFrom >= fTo ? null : new TreeFragment(fFrom, fTo, cut.tree, cut.offset + off, cI > 0, !!nextC);
          }
          if (cut)
            result.push(cut);
          if (nextF.to > nextPos)
            break;
          nextF = fI < fragments.length ? fragments[fI++] : null;
        }
      if (!nextC)
        break;
      pos = nextC.toA;
      off = nextC.toA - nextC.toB;
    }
    return result;
  }
};
var Parser = class {
  startParse(input, fragments, ranges) {
    if (typeof input == "string")
      input = new StringInput(input);
    ranges = !ranges ? [new Range(0, input.length)] : ranges.length ? ranges.map((r) => new Range(r.from, r.to)) : [new Range(0, 0)];
    return this.createParse(input, fragments || [], ranges);
  }
  parse(input, fragments, ranges) {
    let parse = this.startParse(input, fragments, ranges);
    for (; ; ) {
      let done = parse.advance();
      if (done)
        return done;
    }
  }
};
var StringInput = class {
  constructor(string2) {
    this.string = string2;
  }
  get length() {
    return this.string.length;
  }
  chunk(from) {
    return this.string.slice(from);
  }
  get lineChunks() {
    return false;
  }
  read(from, to) {
    return this.string.slice(from, to);
  }
};

// node_modules/style-mod/src/style-mod.js
var C = "\u037C";
var COUNT = typeof Symbol == "undefined" ? "__" + C : Symbol.for(C);
var SET = typeof Symbol == "undefined" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet");
var top = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : {};
var StyleModule = class {
  constructor(spec, options) {
    this.rules = [];
    let { finish } = options || {};
    function splitSelector(selector) {
      return /^@/.test(selector) ? [selector] : selector.split(/,\s*/);
    }
    function render(selectors, spec2, target, isKeyframes) {
      let local = [], isAt = /^@(\w+)\b/.exec(selectors[0]), keyframes = isAt && isAt[1] == "keyframes";
      if (isAt && spec2 == null)
        return target.push(selectors[0] + ";");
      for (let prop in spec2) {
        let value = spec2[prop];
        if (/&/.test(prop)) {
          render(prop.split(/,\s*/).map((part) => selectors.map((sel) => part.replace(/&/, sel))).reduce((a, b) => a.concat(b)), value, target);
        } else if (value && typeof value == "object") {
          if (!isAt)
            throw new RangeError("The value of a property (" + prop + ") should be a primitive value.");
          render(splitSelector(prop), value, local, keyframes);
        } else if (value != null) {
          local.push(prop.replace(/_.*/, "").replace(/[A-Z]/g, (l) => "-" + l.toLowerCase()) + ": " + value + ";");
        }
      }
      if (local.length || keyframes) {
        target.push((finish && !isAt && !isKeyframes ? selectors.map(finish) : selectors).join(", ") + " {" + local.join(" ") + "}");
      }
    }
    for (let prop in spec)
      render(splitSelector(prop), spec[prop], this.rules);
  }
  getRules() {
    return this.rules.join("\n");
  }
  static newName() {
    let id = top[COUNT] || 1;
    top[COUNT] = id + 1;
    return C + id.toString(36);
  }
  static mount(root, modules) {
    (root[SET] || new StyleSet(root)).mount(Array.isArray(modules) ? modules : [modules]);
  }
};
var adoptedSet = null;
var StyleSet = class {
  constructor(root) {
    if (!root.head && root.adoptedStyleSheets && typeof CSSStyleSheet != "undefined") {
      if (adoptedSet) {
        root.adoptedStyleSheets = [adoptedSet.sheet].concat(root.adoptedStyleSheets);
        return root[SET] = adoptedSet;
      }
      this.sheet = new CSSStyleSheet();
      root.adoptedStyleSheets = [this.sheet].concat(root.adoptedStyleSheets);
      adoptedSet = this;
    } else {
      this.styleTag = (root.ownerDocument || root).createElement("style");
      let target = root.head || root;
      target.insertBefore(this.styleTag, target.firstChild);
    }
    this.modules = [];
    root[SET] = this;
  }
  mount(modules) {
    let sheet = this.sheet;
    let pos = 0, j = 0;
    for (let i = 0; i < modules.length; i++) {
      let mod = modules[i], index = this.modules.indexOf(mod);
      if (index < j && index > -1) {
        this.modules.splice(index, 1);
        j--;
        index = -1;
      }
      if (index == -1) {
        this.modules.splice(j++, 0, mod);
        if (sheet)
          for (let k = 0; k < mod.rules.length; k++)
            sheet.insertRule(mod.rules[k], pos++);
      } else {
        while (j < index)
          pos += this.modules[j++].rules.length;
        pos += mod.rules.length;
        j++;
      }
    }
    if (!sheet) {
      let text = "";
      for (let i = 0; i < this.modules.length; i++)
        text += this.modules[i].getRules() + "\n";
      this.styleTag.textContent = text;
    }
  }
};

// node_modules/@codemirror/rangeset/dist/index.js
var RangeValue = class {
  eq(other) {
    return this == other;
  }
  range(from, to = from) {
    return new Range2(from, to, this);
  }
};
RangeValue.prototype.startSide = RangeValue.prototype.endSide = 0;
RangeValue.prototype.point = false;
RangeValue.prototype.mapMode = MapMode.TrackDel;
var Range2 = class {
  constructor(from, to, value) {
    this.from = from;
    this.to = to;
    this.value = value;
  }
};
function cmpRange(a, b) {
  return a.from - b.from || a.value.startSide - b.value.startSide;
}
var Chunk = class {
  constructor(from, to, value, maxPoint) {
    this.from = from;
    this.to = to;
    this.value = value;
    this.maxPoint = maxPoint;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  findIndex(pos, side, end, startAt = 0) {
    let arr = end ? this.to : this.from;
    for (let lo = startAt, hi = arr.length; ; ) {
      if (lo == hi)
        return lo;
      let mid = lo + hi >> 1;
      let diff = arr[mid] - pos || (end ? this.value[mid].endSide : this.value[mid].startSide) - side;
      if (mid == lo)
        return diff >= 0 ? lo : hi;
      if (diff >= 0)
        hi = mid;
      else
        lo = mid + 1;
    }
  }
  between(offset, from, to, f) {
    for (let i = this.findIndex(from, -1e9, true), e = this.findIndex(to, 1e9, false, i); i < e; i++)
      if (f(this.from[i] + offset, this.to[i] + offset, this.value[i]) === false)
        return false;
  }
  map(offset, changes) {
    let value = [], from = [], to = [], newPos = -1, maxPoint = -1;
    for (let i = 0; i < this.value.length; i++) {
      let val = this.value[i], curFrom = this.from[i] + offset, curTo = this.to[i] + offset, newFrom, newTo;
      if (curFrom == curTo) {
        let mapped = changes.mapPos(curFrom, val.startSide, val.mapMode);
        if (mapped == null)
          continue;
        newFrom = newTo = mapped;
      } else {
        newFrom = changes.mapPos(curFrom, val.startSide);
        newTo = changes.mapPos(curTo, val.endSide);
        if (newFrom > newTo || newFrom == newTo && val.startSide > 0 && val.endSide <= 0)
          continue;
      }
      if ((newTo - newFrom || val.endSide - val.startSide) < 0)
        continue;
      if (newPos < 0)
        newPos = newFrom;
      if (val.point)
        maxPoint = Math.max(maxPoint, newTo - newFrom);
      value.push(val);
      from.push(newFrom - newPos);
      to.push(newTo - newPos);
    }
    return { mapped: value.length ? new Chunk(from, to, value, maxPoint) : null, pos: newPos };
  }
};
var RangeSet = class {
  constructor(chunkPos, chunk, nextLayer = RangeSet.empty, maxPoint) {
    this.chunkPos = chunkPos;
    this.chunk = chunk;
    this.nextLayer = nextLayer;
    this.maxPoint = maxPoint;
  }
  get length() {
    let last = this.chunk.length - 1;
    return last < 0 ? 0 : Math.max(this.chunkEnd(last), this.nextLayer.length);
  }
  get size() {
    if (this.isEmpty)
      return 0;
    let size = this.nextLayer.size;
    for (let chunk of this.chunk)
      size += chunk.value.length;
    return size;
  }
  chunkEnd(index) {
    return this.chunkPos[index] + this.chunk[index].length;
  }
  update(updateSpec) {
    let { add: add2 = [], sort = false, filterFrom = 0, filterTo = this.length } = updateSpec;
    let filter = updateSpec.filter;
    if (add2.length == 0 && !filter)
      return this;
    if (sort)
      add2.slice().sort(cmpRange);
    if (this.isEmpty)
      return add2.length ? RangeSet.of(add2) : this;
    let cur2 = new LayerCursor(this, null, -1).goto(0), i = 0, spill = [];
    let builder = new RangeSetBuilder();
    while (cur2.value || i < add2.length) {
      if (i < add2.length && (cur2.from - add2[i].from || cur2.startSide - add2[i].value.startSide) >= 0) {
        let range = add2[i++];
        if (!builder.addInner(range.from, range.to, range.value))
          spill.push(range);
      } else if (cur2.rangeIndex == 1 && cur2.chunkIndex < this.chunk.length && (i == add2.length || this.chunkEnd(cur2.chunkIndex) < add2[i].from) && (!filter || filterFrom > this.chunkEnd(cur2.chunkIndex) || filterTo < this.chunkPos[cur2.chunkIndex]) && builder.addChunk(this.chunkPos[cur2.chunkIndex], this.chunk[cur2.chunkIndex])) {
        cur2.nextChunk();
      } else {
        if (!filter || filterFrom > cur2.to || filterTo < cur2.from || filter(cur2.from, cur2.to, cur2.value)) {
          if (!builder.addInner(cur2.from, cur2.to, cur2.value))
            spill.push(new Range2(cur2.from, cur2.to, cur2.value));
        }
        cur2.next();
      }
    }
    return builder.finishInner(this.nextLayer.isEmpty && !spill.length ? RangeSet.empty : this.nextLayer.update({ add: spill, filter, filterFrom, filterTo }));
  }
  map(changes) {
    if (changes.length == 0 || this.isEmpty)
      return this;
    let chunks = [], chunkPos = [], maxPoint = -1;
    for (let i = 0; i < this.chunk.length; i++) {
      let start = this.chunkPos[i], chunk = this.chunk[i];
      let touch = changes.touchesRange(start, start + chunk.length);
      if (touch === false) {
        maxPoint = Math.max(maxPoint, chunk.maxPoint);
        chunks.push(chunk);
        chunkPos.push(changes.mapPos(start));
      } else if (touch === true) {
        let { mapped, pos } = chunk.map(start, changes);
        if (mapped) {
          maxPoint = Math.max(maxPoint, mapped.maxPoint);
          chunks.push(mapped);
          chunkPos.push(pos);
        }
      }
    }
    let next = this.nextLayer.map(changes);
    return chunks.length == 0 ? next : new RangeSet(chunkPos, chunks, next, maxPoint);
  }
  between(from, to, f) {
    if (this.isEmpty)
      return;
    for (let i = 0; i < this.chunk.length; i++) {
      let start = this.chunkPos[i], chunk = this.chunk[i];
      if (to >= start && from <= start + chunk.length && chunk.between(start, from - start, to - start, f) === false)
        return;
    }
    this.nextLayer.between(from, to, f);
  }
  iter(from = 0) {
    return HeapCursor.from([this]).goto(from);
  }
  get isEmpty() {
    return this.nextLayer == this;
  }
  static iter(sets, from = 0) {
    return HeapCursor.from(sets).goto(from);
  }
  static compare(oldSets, newSets, textDiff, comparator, minPointSize = -1) {
    let a = oldSets.filter((set) => set.maxPoint >= 500 || !set.isEmpty && newSets.indexOf(set) < 0 && set.maxPoint >= minPointSize);
    let b = newSets.filter((set) => set.maxPoint >= 500 || !set.isEmpty && oldSets.indexOf(set) < 0 && set.maxPoint >= minPointSize);
    let sharedChunks = findSharedChunks(a, b);
    let sideA = new SpanCursor(a, sharedChunks, minPointSize);
    let sideB = new SpanCursor(b, sharedChunks, minPointSize);
    textDiff.iterGaps((fromA, fromB, length) => compare(sideA, fromA, sideB, fromB, length, comparator));
    if (textDiff.empty && textDiff.length == 0)
      compare(sideA, 0, sideB, 0, 0, comparator);
  }
  static eq(oldSets, newSets, from = 0, to) {
    if (to == null)
      to = 1e9;
    let a = oldSets.filter((set) => !set.isEmpty && newSets.indexOf(set) < 0);
    let b = newSets.filter((set) => !set.isEmpty && oldSets.indexOf(set) < 0);
    if (a.length != b.length)
      return false;
    if (!a.length)
      return true;
    let sharedChunks = findSharedChunks(a, b);
    let sideA = new SpanCursor(a, sharedChunks, 0).goto(from), sideB = new SpanCursor(b, sharedChunks, 0).goto(from);
    for (; ; ) {
      if (sideA.to != sideB.to || !sameValues(sideA.active, sideB.active) || sideA.point && (!sideB.point || !sideA.point.eq(sideB.point)))
        return false;
      if (sideA.to >= to)
        return true;
      sideA.next();
      sideB.next();
    }
  }
  static spans(sets, from, to, iterator, minPointSize = -1) {
    let cursor = new SpanCursor(sets, null, minPointSize).goto(from), pos = from;
    let open = cursor.openStart;
    for (; ; ) {
      let curTo = Math.min(cursor.to, to);
      if (cursor.point) {
        iterator.point(pos, curTo, cursor.point, cursor.activeForPoint(cursor.to), open);
        open = cursor.openEnd(curTo) + (cursor.to > curTo ? 1 : 0);
      } else if (curTo > pos) {
        iterator.span(pos, curTo, cursor.active, open);
        open = cursor.openEnd(curTo);
      }
      if (cursor.to > to)
        break;
      pos = cursor.to;
      cursor.next();
    }
    return open;
  }
  static of(ranges, sort = false) {
    let build = new RangeSetBuilder();
    for (let range of ranges instanceof Range2 ? [ranges] : sort ? lazySort(ranges) : ranges)
      build.add(range.from, range.to, range.value);
    return build.finish();
  }
};
RangeSet.empty = /* @__PURE__ */ new RangeSet([], [], null, -1);
function lazySort(ranges) {
  if (ranges.length > 1)
    for (let prev = ranges[0], i = 1; i < ranges.length; i++) {
      let cur2 = ranges[i];
      if (cmpRange(prev, cur2) > 0)
        return ranges.slice().sort(cmpRange);
      prev = cur2;
    }
  return ranges;
}
RangeSet.empty.nextLayer = RangeSet.empty;
var RangeSetBuilder = class {
  constructor() {
    this.chunks = [];
    this.chunkPos = [];
    this.chunkStart = -1;
    this.last = null;
    this.lastFrom = -1e9;
    this.lastTo = -1e9;
    this.from = [];
    this.to = [];
    this.value = [];
    this.maxPoint = -1;
    this.setMaxPoint = -1;
    this.nextLayer = null;
  }
  finishChunk(newArrays) {
    this.chunks.push(new Chunk(this.from, this.to, this.value, this.maxPoint));
    this.chunkPos.push(this.chunkStart);
    this.chunkStart = -1;
    this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint);
    this.maxPoint = -1;
    if (newArrays) {
      this.from = [];
      this.to = [];
      this.value = [];
    }
  }
  add(from, to, value) {
    if (!this.addInner(from, to, value))
      (this.nextLayer || (this.nextLayer = new RangeSetBuilder())).add(from, to, value);
  }
  addInner(from, to, value) {
    let diff = from - this.lastTo || value.startSide - this.last.endSide;
    if (diff <= 0 && (from - this.lastFrom || value.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    if (diff < 0)
      return false;
    if (this.from.length == 250)
      this.finishChunk(true);
    if (this.chunkStart < 0)
      this.chunkStart = from;
    this.from.push(from - this.chunkStart);
    this.to.push(to - this.chunkStart);
    this.last = value;
    this.lastFrom = from;
    this.lastTo = to;
    this.value.push(value);
    if (value.point)
      this.maxPoint = Math.max(this.maxPoint, to - from);
    return true;
  }
  addChunk(from, chunk) {
    if ((from - this.lastTo || chunk.value[0].startSide - this.last.endSide) < 0)
      return false;
    if (this.from.length)
      this.finishChunk(true);
    this.setMaxPoint = Math.max(this.setMaxPoint, chunk.maxPoint);
    this.chunks.push(chunk);
    this.chunkPos.push(from);
    let last = chunk.value.length - 1;
    this.last = chunk.value[last];
    this.lastFrom = chunk.from[last] + from;
    this.lastTo = chunk.to[last] + from;
    return true;
  }
  finish() {
    return this.finishInner(RangeSet.empty);
  }
  finishInner(next) {
    if (this.from.length)
      this.finishChunk(false);
    if (this.chunks.length == 0)
      return next;
    let result = new RangeSet(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(next) : next, this.setMaxPoint);
    this.from = null;
    return result;
  }
};
function findSharedChunks(a, b) {
  let inA = new Map();
  for (let set of a)
    for (let i = 0; i < set.chunk.length; i++)
      if (set.chunk[i].maxPoint < 500)
        inA.set(set.chunk[i], set.chunkPos[i]);
  let shared = new Set();
  for (let set of b)
    for (let i = 0; i < set.chunk.length; i++)
      if (inA.get(set.chunk[i]) == set.chunkPos[i])
        shared.add(set.chunk[i]);
  return shared;
}
var LayerCursor = class {
  constructor(layer, skip, minPoint, rank = 0) {
    this.layer = layer;
    this.skip = skip;
    this.minPoint = minPoint;
    this.rank = rank;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(pos, side = -1e9) {
    this.chunkIndex = this.rangeIndex = 0;
    this.gotoInner(pos, side, false);
    return this;
  }
  gotoInner(pos, side, forward) {
    while (this.chunkIndex < this.layer.chunk.length) {
      let next = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(next) || this.layer.chunkEnd(this.chunkIndex) < pos || next.maxPoint < this.minPoint))
        break;
      this.chunkIndex++;
      forward = false;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let rangeIndex = this.layer.chunk[this.chunkIndex].findIndex(pos - this.layer.chunkPos[this.chunkIndex], side, true);
      if (!forward || this.rangeIndex < rangeIndex)
        this.setRangeIndex(rangeIndex);
    }
    this.next();
  }
  forward(pos, side) {
    if ((this.to - pos || this.endSide - side) < 0)
      this.gotoInner(pos, side, true);
  }
  next() {
    for (; ; ) {
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9;
        this.value = null;
        break;
      } else {
        let chunkPos = this.layer.chunkPos[this.chunkIndex], chunk = this.layer.chunk[this.chunkIndex];
        let from = chunkPos + chunk.from[this.rangeIndex];
        this.from = from;
        this.to = chunkPos + chunk.to[this.rangeIndex];
        this.value = chunk.value[this.rangeIndex];
        this.setRangeIndex(this.rangeIndex + 1);
        if (this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
    }
  }
  setRangeIndex(index) {
    if (index == this.layer.chunk[this.chunkIndex].value.length) {
      this.chunkIndex++;
      if (this.skip) {
        while (this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]))
          this.chunkIndex++;
      }
      this.rangeIndex = 0;
    } else {
      this.rangeIndex = index;
    }
  }
  nextChunk() {
    this.chunkIndex++;
    this.rangeIndex = 0;
    this.next();
  }
  compare(other) {
    return this.from - other.from || this.startSide - other.startSide || this.to - other.to || this.endSide - other.endSide;
  }
};
var HeapCursor = class {
  constructor(heap) {
    this.heap = heap;
  }
  static from(sets, skip = null, minPoint = -1) {
    let heap = [];
    for (let i = 0; i < sets.length; i++) {
      for (let cur2 = sets[i]; !cur2.isEmpty; cur2 = cur2.nextLayer) {
        if (cur2.maxPoint >= minPoint)
          heap.push(new LayerCursor(cur2, skip, minPoint, i));
      }
    }
    return heap.length == 1 ? heap[0] : new HeapCursor(heap);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(pos, side = -1e9) {
    for (let cur2 of this.heap)
      cur2.goto(pos, side);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      heapBubble(this.heap, i);
    this.next();
    return this;
  }
  forward(pos, side) {
    for (let cur2 of this.heap)
      cur2.forward(pos, side);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      heapBubble(this.heap, i);
    if ((this.to - pos || this.value.endSide - side) < 0)
      this.next();
  }
  next() {
    if (this.heap.length == 0) {
      this.from = this.to = 1e9;
      this.value = null;
      this.rank = -1;
    } else {
      let top2 = this.heap[0];
      this.from = top2.from;
      this.to = top2.to;
      this.value = top2.value;
      this.rank = top2.rank;
      if (top2.value)
        top2.next();
      heapBubble(this.heap, 0);
    }
  }
};
function heapBubble(heap, index) {
  for (let cur2 = heap[index]; ; ) {
    let childIndex = (index << 1) + 1;
    if (childIndex >= heap.length)
      break;
    let child = heap[childIndex];
    if (childIndex + 1 < heap.length && child.compare(heap[childIndex + 1]) >= 0) {
      child = heap[childIndex + 1];
      childIndex++;
    }
    if (cur2.compare(child) < 0)
      break;
    heap[childIndex] = cur2;
    heap[index] = child;
    index = childIndex;
  }
}
var SpanCursor = class {
  constructor(sets, skip, minPoint) {
    this.minPoint = minPoint;
    this.active = [];
    this.activeTo = [];
    this.activeRank = [];
    this.minActive = -1;
    this.point = null;
    this.pointFrom = 0;
    this.pointRank = 0;
    this.to = -1e9;
    this.endSide = 0;
    this.openStart = -1;
    this.cursor = HeapCursor.from(sets, skip, minPoint);
  }
  goto(pos, side = -1e9) {
    this.cursor.goto(pos, side);
    this.active.length = this.activeTo.length = this.activeRank.length = 0;
    this.minActive = -1;
    this.to = pos;
    this.endSide = side;
    this.openStart = -1;
    this.next();
    return this;
  }
  forward(pos, side) {
    while (this.minActive > -1 && (this.activeTo[this.minActive] - pos || this.active[this.minActive].endSide - side) < 0)
      this.removeActive(this.minActive);
    this.cursor.forward(pos, side);
  }
  removeActive(index) {
    remove(this.active, index);
    remove(this.activeTo, index);
    remove(this.activeRank, index);
    this.minActive = findMinIndex(this.active, this.activeTo);
  }
  addActive(trackOpen) {
    let i = 0, { value, to, rank } = this.cursor;
    while (i < this.activeRank.length && this.activeRank[i] <= rank)
      i++;
    insert(this.active, i, value);
    insert(this.activeTo, i, to);
    insert(this.activeRank, i, rank);
    if (trackOpen)
      insert(trackOpen, i, this.cursor.from);
    this.minActive = findMinIndex(this.active, this.activeTo);
  }
  next() {
    let from = this.to, wasPoint = this.point;
    this.point = null;
    let trackOpen = this.openStart < 0 ? [] : null, trackExtra = 0;
    for (; ; ) {
      let a = this.minActive;
      if (a > -1 && (this.activeTo[a] - this.cursor.from || this.active[a].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[a] > from) {
          this.to = this.activeTo[a];
          this.endSide = this.active[a].endSide;
          break;
        }
        this.removeActive(a);
        if (trackOpen)
          remove(trackOpen, a);
      } else if (!this.cursor.value) {
        this.to = this.endSide = 1e9;
        break;
      } else if (this.cursor.from > from) {
        this.to = this.cursor.from;
        this.endSide = this.cursor.startSide;
        break;
      } else {
        let nextVal = this.cursor.value;
        if (!nextVal.point) {
          this.addActive(trackOpen);
          this.cursor.next();
        } else if (wasPoint && this.cursor.to == this.to && this.cursor.from < this.cursor.to && nextVal.endSide == this.endSide) {
          this.cursor.next();
        } else {
          this.point = nextVal;
          this.pointFrom = this.cursor.from;
          this.pointRank = this.cursor.rank;
          this.to = this.cursor.to;
          this.endSide = nextVal.endSide;
          if (this.cursor.from < from)
            trackExtra = 1;
          this.cursor.next();
          if (this.to > from)
            this.forward(this.to, this.endSide);
          break;
        }
      }
    }
    if (trackOpen) {
      let openStart = 0;
      while (openStart < trackOpen.length && trackOpen[openStart] < from)
        openStart++;
      this.openStart = openStart + trackExtra;
    }
  }
  activeForPoint(to) {
    if (!this.active.length)
      return this.active;
    let active = [];
    for (let i = this.active.length - 1; i >= 0; i--) {
      if (this.activeRank[i] < this.pointRank)
        break;
      if (this.activeTo[i] > to || this.activeTo[i] == to && this.active[i].endSide >= this.point.endSide)
        active.push(this.active[i]);
    }
    return active.reverse();
  }
  openEnd(to) {
    let open = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > to; i--)
      open++;
    return open;
  }
};
function compare(a, startA, b, startB, length, comparator) {
  a.goto(startA);
  b.goto(startB);
  let endB = startB + length;
  let pos = startB, dPos = startB - startA;
  for (; ; ) {
    let diff = a.to + dPos - b.to || a.endSide - b.endSide;
    let end = diff < 0 ? a.to + dPos : b.to, clipEnd = Math.min(end, endB);
    if (a.point || b.point) {
      if (!(a.point && b.point && (a.point == b.point || a.point.eq(b.point)) && sameValues(a.activeForPoint(a.to + dPos), b.activeForPoint(b.to))))
        comparator.comparePoint(pos, clipEnd, a.point, b.point);
    } else {
      if (clipEnd > pos && !sameValues(a.active, b.active))
        comparator.compareRange(pos, clipEnd, a.active, b.active);
    }
    if (end > endB)
      break;
    pos = end;
    if (diff <= 0)
      a.next();
    if (diff >= 0)
      b.next();
  }
}
function sameValues(a, b) {
  if (a.length != b.length)
    return false;
  for (let i = 0; i < a.length; i++)
    if (a[i] != b[i] && !a[i].eq(b[i]))
      return false;
  return true;
}
function remove(array, index) {
  for (let i = index, e = array.length - 1; i < e; i++)
    array[i] = array[i + 1];
  array.pop();
}
function insert(array, index, value) {
  for (let i = array.length - 1; i >= index; i--)
    array[i + 1] = array[i];
  array[index] = value;
}
function findMinIndex(value, array) {
  let found = -1, foundPos = 1e9;
  for (let i = 0; i < array.length; i++)
    if ((array[i] - foundPos || value[i].endSide - value[found].endSide) < 0) {
      found = i;
      foundPos = array[i];
    }
  return found;
}

// node_modules/w3c-keyname/index.es.js
var base = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'",
  229: "q"
};
var shift = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"',
  229: "Q"
};
var chrome = typeof navigator != "undefined" && /Chrome\/(\d+)/.exec(navigator.userAgent);
var safari = typeof navigator != "undefined" && /Apple Computer/.test(navigator.vendor);
var gecko = typeof navigator != "undefined" && /Gecko\/\d+/.test(navigator.userAgent);
var mac = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
var ie = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
var brokenModifierNames = chrome && (mac || +chrome[1] < 57) || gecko && mac;
for (i = 0; i < 10; i++)
  base[48 + i] = base[96 + i] = String(i);
var i;
for (i = 1; i <= 24; i++)
  base[i + 111] = "F" + i;
var i;
for (i = 65; i <= 90; i++) {
  base[i] = String.fromCharCode(i + 32);
  shift[i] = String.fromCharCode(i);
}
var i;
for (code in base)
  if (!shift.hasOwnProperty(code))
    shift[code] = base[code];
var code;
function keyName(event) {
  var ignoreKey = brokenModifierNames && (event.ctrlKey || event.altKey || event.metaKey) || (safari || ie) && event.shiftKey && event.key && event.key.length == 1;
  var name2 = !ignoreKey && event.key || (event.shiftKey ? shift : base)[event.keyCode] || event.key || "Unidentified";
  if (name2 == "Esc")
    name2 = "Escape";
  if (name2 == "Del")
    name2 = "Delete";
  if (name2 == "Left")
    name2 = "ArrowLeft";
  if (name2 == "Up")
    name2 = "ArrowUp";
  if (name2 == "Right")
    name2 = "ArrowRight";
  if (name2 == "Down")
    name2 = "ArrowDown";
  return name2;
}

// node_modules/@codemirror/view/dist/index.js
function getSelection(root) {
  return root.getSelection ? root.getSelection() : document.getSelection();
}
function contains(dom, node) {
  return node ? dom.contains(node.nodeType != 1 ? node.parentNode : node) : false;
}
function deepActiveElement() {
  let elt = document.activeElement;
  while (elt && elt.shadowRoot)
    elt = elt.shadowRoot.activeElement;
  return elt;
}
function hasSelection(dom, selection) {
  if (!selection.anchorNode)
    return false;
  try {
    return contains(dom, selection.anchorNode);
  } catch (_) {
    return false;
  }
}
function clientRectsFor(dom) {
  if (dom.nodeType == 3)
    return textRange(dom, 0, dom.nodeValue.length).getClientRects();
  else if (dom.nodeType == 1)
    return dom.getClientRects();
  else
    return [];
}
function isEquivalentPosition(node, off, targetNode, targetOff) {
  return targetNode ? scanFor(node, off, targetNode, targetOff, -1) || scanFor(node, off, targetNode, targetOff, 1) : false;
}
function domIndex(node) {
  for (var index = 0; ; index++) {
    node = node.previousSibling;
    if (!node)
      return index;
  }
}
function scanFor(node, off, targetNode, targetOff, dir) {
  for (; ; ) {
    if (node == targetNode && off == targetOff)
      return true;
    if (off == (dir < 0 ? 0 : maxOffset(node))) {
      if (node.nodeName == "DIV")
        return false;
      let parent = node.parentNode;
      if (!parent || parent.nodeType != 1)
        return false;
      off = domIndex(node) + (dir < 0 ? 0 : 1);
      node = parent;
    } else if (node.nodeType == 1) {
      node = node.childNodes[off + (dir < 0 ? -1 : 0)];
      if (node.nodeType == 1 && node.contentEditable == "false")
        return false;
      off = dir < 0 ? maxOffset(node) : 0;
    } else {
      return false;
    }
  }
}
function maxOffset(node) {
  return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length;
}
var Rect0 = { left: 0, right: 0, top: 0, bottom: 0 };
function flattenRect(rect, left) {
  let x = left ? rect.left : rect.right;
  return { left: x, right: x, top: rect.top, bottom: rect.bottom };
}
function windowRect(win) {
  return {
    left: 0,
    right: win.innerWidth,
    top: 0,
    bottom: win.innerHeight
  };
}
var ScrollSpace = 5;
function scrollRectIntoView(dom, rect, side) {
  let doc2 = dom.ownerDocument, win = doc2.defaultView;
  for (let cur2 = dom.parentNode; cur2; ) {
    if (cur2.nodeType == 1) {
      let bounding, top2 = cur2 == doc2.body;
      if (top2) {
        bounding = windowRect(win);
      } else {
        if (cur2.scrollHeight <= cur2.clientHeight && cur2.scrollWidth <= cur2.clientWidth) {
          cur2 = cur2.parentNode;
          continue;
        }
        let rect2 = cur2.getBoundingClientRect();
        bounding = {
          left: rect2.left,
          right: rect2.left + cur2.clientWidth,
          top: rect2.top,
          bottom: rect2.top + cur2.clientHeight
        };
      }
      let moveX = 0, moveY = 0;
      if (rect.top < bounding.top) {
        moveY = -(bounding.top - rect.top + ScrollSpace);
        if (side > 0 && rect.bottom > bounding.bottom + moveY)
          moveY = rect.bottom - bounding.bottom + moveY + ScrollSpace;
      } else if (rect.bottom > bounding.bottom) {
        moveY = rect.bottom - bounding.bottom + ScrollSpace;
        if (side < 0 && rect.top - moveY < bounding.top)
          moveY = -(bounding.top + moveY - rect.top + ScrollSpace);
      }
      if (rect.left < bounding.left) {
        moveX = -(bounding.left - rect.left + ScrollSpace);
        if (side > 0 && rect.right > bounding.right + moveX)
          moveX = rect.right - bounding.right + moveX + ScrollSpace;
      } else if (rect.right > bounding.right) {
        moveX = rect.right - bounding.right + ScrollSpace;
        if (side < 0 && rect.left < bounding.left + moveX)
          moveX = -(bounding.left + moveX - rect.left + ScrollSpace);
      }
      if (moveX || moveY) {
        if (top2) {
          win.scrollBy(moveX, moveY);
        } else {
          if (moveY) {
            let start = cur2.scrollTop;
            cur2.scrollTop += moveY;
            moveY = cur2.scrollTop - start;
          }
          if (moveX) {
            let start = cur2.scrollLeft;
            cur2.scrollLeft += moveX;
            moveX = cur2.scrollLeft - start;
          }
          rect = {
            left: rect.left - moveX,
            top: rect.top - moveY,
            right: rect.right - moveX,
            bottom: rect.bottom - moveY
          };
        }
      }
      if (top2)
        break;
      cur2 = cur2.assignedSlot || cur2.parentNode;
    } else if (cur2.nodeType == 11) {
      cur2 = cur2.host;
    } else {
      break;
    }
  }
}
var DOMSelection = class {
  constructor() {
    this.anchorNode = null;
    this.anchorOffset = 0;
    this.focusNode = null;
    this.focusOffset = 0;
  }
  eq(domSel) {
    return this.anchorNode == domSel.anchorNode && this.anchorOffset == domSel.anchorOffset && this.focusNode == domSel.focusNode && this.focusOffset == domSel.focusOffset;
  }
  set(domSel) {
    this.anchorNode = domSel.anchorNode;
    this.anchorOffset = domSel.anchorOffset;
    this.focusNode = domSel.focusNode;
    this.focusOffset = domSel.focusOffset;
  }
};
var preventScrollSupported = null;
function focusPreventScroll(dom) {
  if (dom.setActive)
    return dom.setActive();
  if (preventScrollSupported)
    return dom.focus(preventScrollSupported);
  let stack = [];
  for (let cur2 = dom; cur2; cur2 = cur2.parentNode) {
    stack.push(cur2, cur2.scrollTop, cur2.scrollLeft);
    if (cur2 == cur2.ownerDocument)
      break;
  }
  dom.focus(preventScrollSupported == null ? {
    get preventScroll() {
      preventScrollSupported = { preventScroll: true };
      return true;
    }
  } : void 0);
  if (!preventScrollSupported) {
    preventScrollSupported = false;
    for (let i = 0; i < stack.length; ) {
      let elt = stack[i++], top2 = stack[i++], left = stack[i++];
      if (elt.scrollTop != top2)
        elt.scrollTop = top2;
      if (elt.scrollLeft != left)
        elt.scrollLeft = left;
    }
  }
}
var scratchRange;
function textRange(node, from, to = from) {
  let range = scratchRange || (scratchRange = document.createRange());
  range.setEnd(node, to);
  range.setStart(node, from);
  return range;
}
function dispatchKey(elt, name2, code) {
  let options = { key: name2, code: name2, keyCode: code, which: code, cancelable: true };
  let down = new KeyboardEvent("keydown", options);
  down.synthetic = true;
  elt.dispatchEvent(down);
  let up = new KeyboardEvent("keyup", options);
  up.synthetic = true;
  elt.dispatchEvent(up);
  return down.defaultPrevented || up.defaultPrevented;
}
var _plainTextSupported = null;
function contentEditablePlainTextSupported() {
  if (_plainTextSupported == null) {
    _plainTextSupported = false;
    let dummy = document.createElement("div");
    try {
      dummy.contentEditable = "plaintext-only";
      _plainTextSupported = dummy.contentEditable == "plaintext-only";
    } catch (_) {
    }
  }
  return _plainTextSupported;
}
var DOMPos = class {
  constructor(node, offset, precise = true) {
    this.node = node;
    this.offset = offset;
    this.precise = precise;
  }
  static before(dom, precise) {
    return new DOMPos(dom.parentNode, domIndex(dom), precise);
  }
  static after(dom, precise) {
    return new DOMPos(dom.parentNode, domIndex(dom) + 1, precise);
  }
};
var none$3 = [];
var ContentView = class {
  constructor() {
    this.parent = null;
    this.dom = null;
    this.dirty = 2;
  }
  get editorView() {
    if (!this.parent)
      throw new Error("Accessing view in orphan content view");
    return this.parent.editorView;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(view) {
    let pos = this.posAtStart;
    for (let child of this.children) {
      if (child == view)
        return pos;
      pos += child.length + child.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(view) {
    return this.posBefore(view) + view.length;
  }
  coordsAt(_pos, _side) {
    return null;
  }
  sync(track) {
    var _a;
    if (this.dirty & 2) {
      let parent = this.dom, pos = null;
      for (let child of this.children) {
        if (child.dirty) {
          let next2 = pos ? pos.nextSibling : parent.firstChild;
          if (!child.dom && next2 && !((_a = ContentView.get(next2)) === null || _a === void 0 ? void 0 : _a.parent))
            child.reuseDOM(next2);
          child.sync(track);
          child.dirty = 0;
        }
        if (track && track.node == parent && pos != child.dom)
          track.written = true;
        syncNodeInto(parent, pos, child.dom);
        pos = child.dom;
      }
      let next = pos ? pos.nextSibling : parent.firstChild;
      if (next && track && track.node == parent)
        track.written = true;
      while (next)
        next = rm(next);
    } else if (this.dirty & 1) {
      for (let child of this.children)
        if (child.dirty) {
          child.sync(track);
          child.dirty = 0;
        }
    }
  }
  reuseDOM(_dom) {
    return false;
  }
  localPosFromDOM(node, offset) {
    let after;
    if (node == this.dom) {
      after = this.dom.childNodes[offset];
    } else {
      let bias = maxOffset(node) == 0 ? 0 : offset == 0 ? -1 : 1;
      for (; ; ) {
        let parent = node.parentNode;
        if (parent == this.dom)
          break;
        if (bias == 0 && parent.firstChild != parent.lastChild) {
          if (node == parent.firstChild)
            bias = -1;
          else
            bias = 1;
        }
        node = parent;
      }
      if (bias < 0)
        after = node;
      else
        after = node.nextSibling;
    }
    if (after == this.dom.firstChild)
      return 0;
    while (after && !ContentView.get(after))
      after = after.nextSibling;
    if (!after)
      return this.length;
    for (let i = 0, pos = 0; ; i++) {
      let child = this.children[i];
      if (child.dom == after)
        return pos;
      pos += child.length + child.breakAfter;
    }
  }
  domBoundsAround(from, to, offset = 0) {
    let fromI = -1, fromStart = -1, toI = -1, toEnd = -1;
    for (let i = 0, pos = offset, prevEnd = offset; i < this.children.length; i++) {
      let child = this.children[i], end = pos + child.length;
      if (pos < from && end > to)
        return child.domBoundsAround(from, to, pos);
      if (end >= from && fromI == -1) {
        fromI = i;
        fromStart = pos;
      }
      if (pos > to && child.dom.parentNode == this.dom) {
        toI = i;
        toEnd = prevEnd;
        break;
      }
      prevEnd = end;
      pos = end + child.breakAfter;
    }
    return {
      from: fromStart,
      to: toEnd < 0 ? offset + this.length : toEnd,
      startDOM: (fromI ? this.children[fromI - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: toI < this.children.length && toI >= 0 ? this.children[toI].dom : null
    };
  }
  markDirty(andParent = false) {
    this.dirty |= 2;
    this.markParentsDirty(andParent);
  }
  markParentsDirty(childList) {
    for (let parent = this.parent; parent; parent = parent.parent) {
      if (childList)
        parent.dirty |= 2;
      if (parent.dirty & 1)
        return;
      parent.dirty |= 1;
      childList = false;
    }
  }
  setParent(parent) {
    if (this.parent != parent) {
      this.parent = parent;
      if (this.dirty)
        this.markParentsDirty(true);
    }
  }
  setDOM(dom) {
    if (this.dom)
      this.dom.cmView = null;
    this.dom = dom;
    dom.cmView = this;
  }
  get rootView() {
    for (let v = this; ; ) {
      let parent = v.parent;
      if (!parent)
        return v;
      v = parent;
    }
  }
  replaceChildren(from, to, children = none$3) {
    this.markDirty();
    for (let i = from; i < to; i++) {
      let child = this.children[i];
      if (child.parent == this)
        child.parent = null;
    }
    this.children.splice(from, to - from, ...children);
    for (let i = 0; i < children.length; i++)
      children[i].setParent(this);
  }
  ignoreMutation(_rec) {
    return false;
  }
  ignoreEvent(_event) {
    return false;
  }
  childCursor(pos = this.length) {
    return new ChildCursor(this.children, pos, this.children.length);
  }
  childPos(pos, bias = 1) {
    return this.childCursor().findPos(pos, bias);
  }
  toString() {
    let name2 = this.constructor.name.replace("View", "");
    return name2 + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (name2 == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(node) {
    return node.cmView;
  }
};
ContentView.prototype.breakAfter = 0;
function rm(dom) {
  let next = dom.nextSibling;
  dom.parentNode.removeChild(dom);
  return next;
}
function syncNodeInto(parent, after, dom) {
  let next = after ? after.nextSibling : parent.firstChild;
  if (dom.parentNode == parent)
    while (next != dom)
      next = rm(next);
  else
    parent.insertBefore(dom, next);
}
var ChildCursor = class {
  constructor(children, pos, i) {
    this.children = children;
    this.pos = pos;
    this.i = i;
    this.off = 0;
  }
  findPos(pos, bias = 1) {
    for (; ; ) {
      if (pos > this.pos || pos == this.pos && (bias > 0 || this.i == 0 || this.children[this.i - 1].breakAfter)) {
        this.off = pos - this.pos;
        return this;
      }
      let next = this.children[--this.i];
      this.pos -= next.length + next.breakAfter;
    }
  }
};
var [nav, doc] = typeof navigator != "undefined" ? [navigator, document] : [{ userAgent: "", vendor: "", platform: "" }, { documentElement: { style: {} } }];
var ie_edge = /* @__PURE__ */ /Edge\/(\d+)/.exec(nav.userAgent);
var ie_upto10 = /* @__PURE__ */ /MSIE \d/.test(nav.userAgent);
var ie_11up = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nav.userAgent);
var ie2 = !!(ie_upto10 || ie_11up || ie_edge);
var gecko2 = !ie2 && /* @__PURE__ */ /gecko\/(\d+)/i.test(nav.userAgent);
var chrome2 = !ie2 && /* @__PURE__ */ /Chrome\/(\d+)/.exec(nav.userAgent);
var webkit = "webkitFontSmoothing" in doc.documentElement.style;
var safari2 = !ie2 && /* @__PURE__ */ /Apple Computer/.test(nav.vendor);
var browser = {
  mac: /* @__PURE__ */ /Mac/.test(nav.platform),
  ie: ie2,
  ie_version: ie_upto10 ? doc.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0,
  gecko: gecko2,
  gecko_version: gecko2 ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(nav.userAgent) || [0, 0])[1] : 0,
  chrome: !!chrome2,
  chrome_version: chrome2 ? +chrome2[1] : 0,
  ios: safari2 && (/* @__PURE__ */ /Mobile\/\w+/.test(nav.userAgent) || nav.maxTouchPoints > 2),
  android: /* @__PURE__ */ /Android\b/.test(nav.userAgent),
  webkit,
  safari: safari2,
  webkit_version: webkit ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
  tabSize: doc.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
var none$2 = [];
var InlineView = class extends ContentView {
  become(_other) {
    return false;
  }
  getSide() {
    return 0;
  }
};
InlineView.prototype.children = none$2;
var MaxJoinLen = 256;
var TextView = class extends InlineView {
  constructor(text) {
    super();
    this.text = text;
  }
  get length() {
    return this.text.length;
  }
  createDOM(textDOM) {
    this.setDOM(textDOM || document.createTextNode(this.text));
  }
  sync(track) {
    if (!this.dom)
      this.createDOM();
    if (this.dom.nodeValue != this.text) {
      if (track && track.node == this.dom)
        track.written = true;
      this.dom.nodeValue = this.text;
    }
  }
  reuseDOM(dom) {
    if (dom.nodeType != 3)
      return false;
    this.createDOM(dom);
    return true;
  }
  merge(from, to, source) {
    if (source && (!(source instanceof TextView) || this.length - (to - from) + source.length > MaxJoinLen))
      return false;
    this.text = this.text.slice(0, from) + (source ? source.text : "") + this.text.slice(to);
    this.markDirty();
    return true;
  }
  slice(from) {
    let result = new TextView(this.text.slice(from));
    this.text = this.text.slice(0, from);
    return result;
  }
  localPosFromDOM(node, offset) {
    return node == this.dom ? offset : offset ? this.text.length : 0;
  }
  domAtPos(pos) {
    return new DOMPos(this.dom, pos);
  }
  domBoundsAround(_from, _to, offset) {
    return { from: offset, to: offset + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(pos, side) {
    return textCoords(this.dom, pos, side);
  }
};
var MarkView = class extends InlineView {
  constructor(mark, children = [], length = 0) {
    super();
    this.mark = mark;
    this.children = children;
    this.length = length;
    for (let ch of children)
      ch.setParent(this);
  }
  createDOM() {
    let dom = document.createElement(this.mark.tagName);
    if (this.mark.class)
      dom.className = this.mark.class;
    if (this.mark.attrs)
      for (let name2 in this.mark.attrs)
        dom.setAttribute(name2, this.mark.attrs[name2]);
    this.setDOM(dom);
  }
  sync(track) {
    if (!this.dom || this.dirty & 4)
      this.createDOM();
    super.sync(track);
  }
  merge(from, to, source, openStart, openEnd) {
    if (source && (!(source instanceof MarkView && source.mark.eq(this.mark)) || from && openStart <= 0 || to < this.length && openEnd <= 0))
      return false;
    mergeInlineChildren(this, from, to, source ? source.children : none$2, openStart - 1, openEnd - 1);
    this.markDirty();
    return true;
  }
  slice(from) {
    let result = [], off = 0, detachFrom = -1, i = 0;
    for (let elt of this.children) {
      let end = off + elt.length;
      if (end > from)
        result.push(off < from ? elt.slice(from - off) : elt);
      if (detachFrom < 0 && off >= from)
        detachFrom = i;
      off = end;
      i++;
    }
    let length = this.length - from;
    this.length = from;
    if (detachFrom > -1)
      this.replaceChildren(detachFrom, this.children.length);
    return new MarkView(this.mark, result, length);
  }
  domAtPos(pos) {
    return inlineDOMAtPos(this.dom, this.children, pos);
  }
  coordsAt(pos, side) {
    return coordsInChildren(this, pos, side);
  }
};
function textCoords(text, pos, side) {
  let length = text.nodeValue.length;
  if (pos > length)
    pos = length;
  let from = pos, to = pos, flatten2 = 0;
  if (pos == 0 && side < 0 || pos == length && side >= 0) {
    if (!(browser.chrome || browser.gecko)) {
      if (pos) {
        from--;
        flatten2 = 1;
      } else {
        to++;
        flatten2 = -1;
      }
    }
  } else {
    if (side < 0)
      from--;
    else
      to++;
  }
  let rects = textRange(text, from, to).getClientRects();
  if (!rects.length)
    return Rect0;
  let rect = rects[(flatten2 ? flatten2 < 0 : side >= 0) ? 0 : rects.length - 1];
  if (browser.safari && !flatten2 && rect.width == 0)
    rect = Array.prototype.find.call(rects, (r) => r.width) || rect;
  return flatten2 ? flattenRect(rect, flatten2 < 0) : rect;
}
var WidgetView = class extends InlineView {
  constructor(widget, length, side) {
    super();
    this.widget = widget;
    this.length = length;
    this.side = side;
  }
  static create(widget, length, side) {
    return new (widget.customView || WidgetView)(widget, length, side);
  }
  slice(from) {
    let result = WidgetView.create(this.widget, this.length - from, this.side);
    this.length -= from;
    return result;
  }
  sync() {
    if (!this.dom || !this.widget.updateDOM(this.dom)) {
      this.setDOM(this.widget.toDOM(this.editorView));
      this.dom.contentEditable = "false";
    }
  }
  getSide() {
    return this.side;
  }
  merge(from, to, source, openStart, openEnd) {
    if (source && (!(source instanceof WidgetView) || !this.widget.compare(source.widget) || from > 0 && openStart <= 0 || to < this.length && openEnd <= 0))
      return false;
    this.length = from + (source ? source.length : 0) + (this.length - to);
    return true;
  }
  become(other) {
    if (other.length == this.length && other instanceof WidgetView && other.side == this.side) {
      if (this.widget.constructor == other.widget.constructor) {
        if (!this.widget.eq(other.widget))
          this.markDirty(true);
        this.widget = other.widget;
        return true;
      }
    }
    return false;
  }
  ignoreMutation() {
    return true;
  }
  ignoreEvent(event) {
    return this.widget.ignoreEvent(event);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return Text.empty;
    let top2 = this;
    while (top2.parent)
      top2 = top2.parent;
    let view = top2.editorView, text = view && view.state.doc, start = this.posAtStart;
    return text ? text.slice(start, start + this.length) : Text.empty;
  }
  domAtPos(pos) {
    return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(pos, side) {
    let rects = this.dom.getClientRects(), rect = null;
    if (!rects.length)
      return Rect0;
    for (let i = pos > 0 ? rects.length - 1 : 0; ; i += pos > 0 ? -1 : 1) {
      rect = rects[i];
      if (pos > 0 ? i == 0 : i == rects.length - 1 || rect.top < rect.bottom)
        break;
    }
    return pos == 0 && side > 0 || pos == this.length && side <= 0 ? rect : flattenRect(rect, pos == 0);
  }
};
var CompositionView = class extends WidgetView {
  domAtPos(pos) {
    return new DOMPos(this.widget.text, pos);
  }
  sync() {
    if (!this.dom)
      this.setDOM(this.widget.toDOM());
  }
  localPosFromDOM(node, offset) {
    return !offset ? 0 : node.nodeType == 3 ? Math.min(offset, this.length) : this.length;
  }
  ignoreMutation() {
    return false;
  }
  get overrideDOMText() {
    return null;
  }
  coordsAt(pos, side) {
    return textCoords(this.widget.text, pos, side);
  }
};
function mergeInlineChildren(parent, from, to, elts, openStart, openEnd) {
  let cur2 = parent.childCursor();
  let { i: toI, off: toOff } = cur2.findPos(to, 1);
  let { i: fromI, off: fromOff } = cur2.findPos(from, -1);
  let dLen = from - to;
  for (let view of elts)
    dLen += view.length;
  parent.length += dLen;
  let { children } = parent;
  if (fromI == toI && fromOff) {
    let start = children[fromI];
    if (elts.length == 1 && start.merge(fromOff, toOff, elts[0], openStart, openEnd))
      return;
    if (elts.length == 0) {
      start.merge(fromOff, toOff, null, openStart, openEnd);
      return;
    }
    let after = start.slice(toOff);
    if (after.merge(0, 0, elts[elts.length - 1], 0, openEnd))
      elts[elts.length - 1] = after;
    else
      elts.push(after);
    toI++;
    openEnd = toOff = 0;
  }
  if (toOff) {
    let end = children[toI];
    if (elts.length && end.merge(0, toOff, elts[elts.length - 1], 0, openEnd)) {
      elts.pop();
      openEnd = elts.length ? 0 : openStart;
    } else {
      end.merge(0, toOff, null, 0, 0);
    }
  } else if (toI < children.length && elts.length && children[toI].merge(0, 0, elts[elts.length - 1], 0, openEnd)) {
    elts.pop();
    openEnd = elts.length ? 0 : openStart;
  }
  if (fromOff) {
    let start = children[fromI];
    if (elts.length && start.merge(fromOff, start.length, elts[0], openStart, 0)) {
      elts.shift();
      openStart = elts.length ? 0 : openEnd;
    } else {
      start.merge(fromOff, start.length, null, 0, 0);
    }
    fromI++;
  } else if (fromI && elts.length) {
    let end = children[fromI - 1];
    if (end.merge(end.length, end.length, elts[0], openStart, 0)) {
      elts.shift();
      openStart = elts.length ? 0 : openEnd;
    }
  }
  while (fromI < toI && elts.length && children[toI - 1].become(elts[elts.length - 1])) {
    elts.pop();
    toI--;
    openEnd = elts.length ? 0 : openStart;
  }
  while (fromI < toI && elts.length && children[fromI].become(elts[0])) {
    elts.shift();
    fromI++;
    openStart = elts.length ? 0 : openEnd;
  }
  if (!elts.length && fromI && toI < children.length && children[toI].merge(0, 0, children[fromI - 1], openStart, openEnd))
    fromI--;
  if (elts.length || fromI != toI)
    parent.replaceChildren(fromI, toI, elts);
}
function inlineDOMAtPos(dom, children, pos) {
  let i = 0;
  for (let off = 0; i < children.length; i++) {
    let child = children[i], end = off + child.length;
    if (end == off && child.getSide() <= 0)
      continue;
    if (pos > off && pos < end && child.dom.parentNode == dom)
      return child.domAtPos(pos - off);
    if (pos <= off)
      break;
    off = end;
  }
  for (; i > 0; i--) {
    let before = children[i - 1].dom;
    if (before.parentNode == dom)
      return DOMPos.after(before);
  }
  return new DOMPos(dom, 0);
}
function joinInlineInto(parent, view, open) {
  let last, { children } = parent;
  if (open > 0 && view instanceof MarkView && children.length && (last = children[children.length - 1]) instanceof MarkView && last.mark.eq(view.mark)) {
    joinInlineInto(last, view.children[0], open - 1);
  } else {
    children.push(view);
    view.setParent(parent);
  }
  parent.length += view.length;
}
function coordsInChildren(view, pos, side) {
  for (let off = 0, i = 0; i < view.children.length; i++) {
    let child = view.children[i], end = off + child.length, next;
    if ((side <= 0 || end == view.length || child.getSide() > 0 ? end >= pos : end > pos) && (pos < end || i + 1 == view.children.length || (next = view.children[i + 1]).length || next.getSide() > 0)) {
      let flatten2 = 0;
      if (end == off) {
        if (child.getSide() <= 0)
          continue;
        flatten2 = side = -child.getSide();
      }
      let rect = child.coordsAt(pos - off, side);
      return flatten2 && rect ? flattenRect(rect, side < 0) : rect;
    }
    off = end;
  }
  let last = view.dom.lastChild;
  if (!last)
    return view.dom.getBoundingClientRect();
  let rects = clientRectsFor(last);
  return rects[rects.length - 1];
}
function combineAttrs(source, target) {
  for (let name2 in source) {
    if (name2 == "class" && target.class)
      target.class += " " + source.class;
    else if (name2 == "style" && target.style)
      target.style += ";" + source.style;
    else
      target[name2] = source[name2];
  }
  return target;
}
function attrsEq(a, b) {
  if (a == b)
    return true;
  if (!a || !b)
    return false;
  let keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length != keysB.length)
    return false;
  for (let key of keysA) {
    if (keysB.indexOf(key) == -1 || a[key] !== b[key])
      return false;
  }
  return true;
}
function updateAttrs(dom, prev, attrs) {
  if (prev) {
    for (let name2 in prev)
      if (!(attrs && name2 in attrs))
        dom.removeAttribute(name2);
  }
  if (attrs) {
    for (let name2 in attrs)
      if (!(prev && prev[name2] == attrs[name2]))
        dom.setAttribute(name2, attrs[name2]);
  }
}
var WidgetType = class {
  eq(_widget) {
    return false;
  }
  updateDOM(_dom) {
    return false;
  }
  compare(other) {
    return this == other || this.constructor == other.constructor && this.eq(other);
  }
  get estimatedHeight() {
    return -1;
  }
  ignoreEvent(_event) {
    return true;
  }
  get customView() {
    return null;
  }
};
var BlockType = /* @__PURE__ */ function(BlockType2) {
  BlockType2[BlockType2["Text"] = 0] = "Text";
  BlockType2[BlockType2["WidgetBefore"] = 1] = "WidgetBefore";
  BlockType2[BlockType2["WidgetAfter"] = 2] = "WidgetAfter";
  BlockType2[BlockType2["WidgetRange"] = 3] = "WidgetRange";
  return BlockType2;
}(BlockType || (BlockType = {}));
var Decoration = class extends RangeValue {
  constructor(startSide, endSide, widget, spec) {
    super();
    this.startSide = startSide;
    this.endSide = endSide;
    this.widget = widget;
    this.spec = spec;
  }
  get heightRelevant() {
    return false;
  }
  static mark(spec) {
    return new MarkDecoration(spec);
  }
  static widget(spec) {
    let side = spec.side || 0;
    if (spec.block)
      side += (2e8 + 1) * (side > 0 ? 1 : -1);
    return new PointDecoration(spec, side, side, !!spec.block, spec.widget || null, false);
  }
  static replace(spec) {
    let block = !!spec.block;
    let { start, end } = getInclusive(spec);
    let startSide = block ? -2e8 * (start ? 2 : 1) : 1e8 * (start ? -1 : 1);
    let endSide = block ? 2e8 * (end ? 2 : 1) : 1e8 * (end ? 1 : -1);
    return new PointDecoration(spec, startSide, endSide, block, spec.widget || null, true);
  }
  static line(spec) {
    return new LineDecoration(spec);
  }
  static set(of, sort = false) {
    return RangeSet.of(of, sort);
  }
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : false;
  }
};
Decoration.none = RangeSet.empty;
var MarkDecoration = class extends Decoration {
  constructor(spec) {
    let { start, end } = getInclusive(spec);
    super(1e8 * (start ? -1 : 1), 1e8 * (end ? 1 : -1), null, spec);
    this.tagName = spec.tagName || "span";
    this.class = spec.class || "";
    this.attrs = spec.attributes || null;
  }
  eq(other) {
    return this == other || other instanceof MarkDecoration && this.tagName == other.tagName && this.class == other.class && attrsEq(this.attrs, other.attrs);
  }
  range(from, to = from) {
    if (from >= to)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(from, to);
  }
};
MarkDecoration.prototype.point = false;
var LineDecoration = class extends Decoration {
  constructor(spec) {
    super(-1e8, -1e8, null, spec);
  }
  eq(other) {
    return other instanceof LineDecoration && attrsEq(this.spec.attributes, other.spec.attributes);
  }
  range(from, to = from) {
    if (to != from)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(from, to);
  }
};
LineDecoration.prototype.mapMode = MapMode.TrackBefore;
LineDecoration.prototype.point = true;
var PointDecoration = class extends Decoration {
  constructor(spec, startSide, endSide, block, widget, isReplace) {
    super(startSide, endSide, widget, spec);
    this.block = block;
    this.isReplace = isReplace;
    this.mapMode = !block ? MapMode.TrackDel : startSide < 0 ? MapMode.TrackBefore : MapMode.TrackAfter;
  }
  get type() {
    return this.startSide < this.endSide ? BlockType.WidgetRange : this.startSide < 0 ? BlockType.WidgetBefore : BlockType.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && this.widget.estimatedHeight >= 5;
  }
  eq(other) {
    return other instanceof PointDecoration && widgetsEq(this.widget, other.widget) && this.block == other.block && this.startSide == other.startSide && this.endSide == other.endSide;
  }
  range(from, to = from) {
    if (this.isReplace && (from > to || from == to && this.startSide > 0 && this.endSide < 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && to != from)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(from, to);
  }
};
PointDecoration.prototype.point = true;
function getInclusive(spec) {
  let { inclusiveStart: start, inclusiveEnd: end } = spec;
  if (start == null)
    start = spec.inclusive;
  if (end == null)
    end = spec.inclusive;
  return { start: start || false, end: end || false };
}
function widgetsEq(a, b) {
  return a == b || !!(a && b && a.compare(b));
}
function addRange(from, to, ranges, margin = 0) {
  let last = ranges.length - 1;
  if (last >= 0 && ranges[last] + margin > from)
    ranges[last] = Math.max(ranges[last], to);
  else
    ranges.push(from, to);
}
var LineView = class extends ContentView {
  constructor() {
    super(...arguments);
    this.children = [];
    this.length = 0;
    this.prevAttrs = void 0;
    this.attrs = null;
    this.breakAfter = 0;
  }
  merge(from, to, source, takeDeco, openStart, openEnd) {
    if (source) {
      if (!(source instanceof LineView))
        return false;
      if (!this.dom)
        source.transferDOM(this);
    }
    if (takeDeco)
      this.setDeco(source ? source.attrs : null);
    mergeInlineChildren(this, from, to, source ? source.children : none$1, openStart, openEnd);
    return true;
  }
  split(at) {
    let end = new LineView();
    end.breakAfter = this.breakAfter;
    if (this.length == 0)
      return end;
    let { i, off } = this.childPos(at);
    if (off) {
      end.append(this.children[i].slice(off), 0);
      this.children[i].merge(off, this.children[i].length, null, 0, 0);
      i++;
    }
    for (let j = i; j < this.children.length; j++)
      end.append(this.children[j], 0);
    while (i > 0 && this.children[i - 1].length == 0) {
      this.children[i - 1].parent = null;
      i--;
    }
    this.children.length = i;
    this.markDirty();
    this.length = at;
    return end;
  }
  transferDOM(other) {
    if (!this.dom)
      return;
    other.setDOM(this.dom);
    other.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs;
    this.prevAttrs = void 0;
    this.dom = null;
  }
  setDeco(attrs) {
    if (!attrsEq(this.attrs, attrs)) {
      if (this.dom) {
        this.prevAttrs = this.attrs;
        this.markDirty();
      }
      this.attrs = attrs;
    }
  }
  append(child, openStart) {
    joinInlineInto(this, child, openStart);
  }
  addLineDeco(deco) {
    let attrs = deco.spec.attributes;
    if (attrs)
      this.attrs = combineAttrs(attrs, this.attrs || {});
  }
  domAtPos(pos) {
    return inlineDOMAtPos(this.dom, this.children, pos);
  }
  sync(track) {
    if (!this.dom || this.dirty & 4) {
      this.setDOM(document.createElement("div"));
      this.dom.className = "cm-line";
      this.prevAttrs = this.attrs ? null : void 0;
    }
    if (this.prevAttrs !== void 0) {
      updateAttrs(this.dom, this.prevAttrs, this.attrs);
      this.dom.classList.add("cm-line");
      this.prevAttrs = void 0;
    }
    super.sync(track);
    let last = this.dom.lastChild;
    while (last && ContentView.get(last) instanceof MarkView)
      last = last.lastChild;
    if (!last || last.nodeName != "BR" && ContentView.get(last) instanceof WidgetView && (!browser.ios || !this.children.some((ch) => ch instanceof TextView))) {
      let hack = document.createElement("BR");
      hack.cmIgnore = true;
      this.dom.appendChild(hack);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let totalWidth = 0;
    for (let child of this.children) {
      if (!(child instanceof TextView))
        return null;
      let rects = clientRectsFor(child.dom);
      if (rects.length != 1)
        return null;
      totalWidth += rects[0].width;
    }
    return {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: totalWidth / this.length
    };
  }
  coordsAt(pos, side) {
    return coordsInChildren(this, pos, side);
  }
  match(_other) {
    return false;
  }
  get type() {
    return BlockType.Text;
  }
  static find(docView, pos) {
    for (let i = 0, off = 0; ; i++) {
      let block = docView.children[i], end = off + block.length;
      if (end >= pos) {
        if (block instanceof LineView)
          return block;
        if (block.length)
          return null;
      }
      off = end + block.breakAfter;
    }
  }
};
var none$1 = [];
var BlockWidgetView = class extends ContentView {
  constructor(widget, length, type) {
    super();
    this.widget = widget;
    this.length = length;
    this.type = type;
    this.breakAfter = 0;
  }
  merge(from, to, source, _takeDeco, openStart, openEnd) {
    if (source && (!(source instanceof BlockWidgetView) || !this.widget.compare(source.widget) || from > 0 && openStart <= 0 || to < this.length && openEnd <= 0))
      return false;
    this.length = from + (source ? source.length : 0) + (this.length - to);
    return true;
  }
  domAtPos(pos) {
    return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
  }
  split(at) {
    let len = this.length - at;
    this.length = at;
    return new BlockWidgetView(this.widget, len, this.type);
  }
  get children() {
    return none$1;
  }
  sync() {
    if (!this.dom || !this.widget.updateDOM(this.dom)) {
      this.setDOM(this.widget.toDOM(this.editorView));
      this.dom.contentEditable = "false";
    }
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : Text.empty;
  }
  domBoundsAround() {
    return null;
  }
  match(other) {
    if (other instanceof BlockWidgetView && other.type == this.type && other.widget.constructor == this.widget.constructor) {
      if (!other.widget.eq(this.widget))
        this.markDirty(true);
      this.widget = other.widget;
      this.length = other.length;
      this.breakAfter = other.breakAfter;
      return true;
    }
    return false;
  }
  ignoreMutation() {
    return true;
  }
  ignoreEvent(event) {
    return this.widget.ignoreEvent(event);
  }
};
var ContentBuilder = class {
  constructor(doc2, pos, end) {
    this.doc = doc2;
    this.pos = pos;
    this.end = end;
    this.content = [];
    this.curLine = null;
    this.breakAtStart = 0;
    this.openStart = -1;
    this.openEnd = -1;
    this.text = "";
    this.textOff = 0;
    this.cursor = doc2.iter();
    this.skip = pos;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let last = this.content[this.content.length - 1];
    return !last.breakAfter && !(last instanceof BlockWidgetView && last.type == BlockType.WidgetBefore);
  }
  getLine() {
    if (!this.curLine)
      this.content.push(this.curLine = new LineView());
    return this.curLine;
  }
  addWidget(view) {
    this.curLine = null;
    this.content.push(view);
  }
  finish() {
    if (!this.posCovered())
      this.getLine();
  }
  wrapMarks(view, active) {
    for (let mark of active)
      view = new MarkView(mark, [view], view.length);
    return view;
  }
  buildText(length, active, openStart) {
    while (length > 0) {
      if (this.textOff == this.text.length) {
        let { value, lineBreak, done } = this.cursor.next(this.skip);
        this.skip = 0;
        if (done)
          throw new Error("Ran out of text content when drawing inline views");
        if (lineBreak) {
          if (!this.posCovered())
            this.getLine();
          if (this.content.length)
            this.content[this.content.length - 1].breakAfter = 1;
          else
            this.breakAtStart = 1;
          this.curLine = null;
          length--;
          continue;
        } else {
          this.text = value;
          this.textOff = 0;
        }
      }
      let take = Math.min(this.text.length - this.textOff, length, 512);
      this.getLine().append(this.wrapMarks(new TextView(this.text.slice(this.textOff, this.textOff + take)), active), openStart);
      this.textOff += take;
      length -= take;
      openStart = 0;
    }
  }
  span(from, to, active, openStart) {
    this.buildText(to - from, active, openStart);
    this.pos = to;
    if (this.openStart < 0)
      this.openStart = openStart;
  }
  point(from, to, deco, active, openStart) {
    let len = to - from;
    if (deco instanceof PointDecoration) {
      if (deco.block) {
        let { type } = deco;
        if (type == BlockType.WidgetAfter && !this.posCovered())
          this.getLine();
        this.addWidget(new BlockWidgetView(deco.widget || new NullWidget("div"), len, type));
      } else {
        let widget = this.wrapMarks(WidgetView.create(deco.widget || new NullWidget("span"), len, deco.startSide), active);
        this.getLine().append(widget, openStart);
      }
    } else if (this.doc.lineAt(this.pos).from == this.pos) {
      this.getLine().addLineDeco(deco);
    }
    if (len) {
      if (this.textOff + len <= this.text.length) {
        this.textOff += len;
      } else {
        this.skip += len - (this.text.length - this.textOff);
        this.text = "";
        this.textOff = 0;
      }
      this.pos = to;
    }
    if (this.openStart < 0)
      this.openStart = openStart;
  }
  static build(text, from, to, decorations2) {
    let builder = new ContentBuilder(text, from, to);
    builder.openEnd = RangeSet.spans(decorations2, from, to, builder);
    if (builder.openStart < 0)
      builder.openStart = builder.openEnd;
    builder.finish();
    return builder;
  }
};
var NullWidget = class extends WidgetType {
  constructor(tag) {
    super();
    this.tag = tag;
  }
  eq(other) {
    return other.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(elt) {
    return elt.nodeName.toLowerCase() == this.tag;
  }
};
var none2 = [];
var clickAddsSelectionRange = /* @__PURE__ */ Facet.define();
var dragMovesSelection$1 = /* @__PURE__ */ Facet.define();
var mouseSelectionStyle = /* @__PURE__ */ Facet.define();
var exceptionSink = /* @__PURE__ */ Facet.define();
var updateListener = /* @__PURE__ */ Facet.define();
var inputHandler = /* @__PURE__ */ Facet.define();
var scrollTo = /* @__PURE__ */ StateEffect.define({
  map: (range, changes) => range.map(changes)
});
function logException(state, exception, context) {
  let handler = state.facet(exceptionSink);
  if (handler.length)
    handler[0](exception);
  else if (window.onerror)
    window.onerror(String(exception), context, void 0, void 0, exception);
  else if (context)
    console.error(context + ":", exception);
  else
    console.error(exception);
}
var editable = /* @__PURE__ */ Facet.define({ combine: (values) => values.length ? values[0] : true });
var PluginFieldProvider = class {
  constructor(field, get) {
    this.field = field;
    this.get = get;
  }
};
var PluginField = class {
  from(get) {
    return new PluginFieldProvider(this, get);
  }
  static define() {
    return new PluginField();
  }
};
PluginField.decorations = /* @__PURE__ */ PluginField.define();
PluginField.atomicRanges = /* @__PURE__ */ PluginField.define();
PluginField.scrollMargins = /* @__PURE__ */ PluginField.define();
var nextPluginID = 0;
var viewPlugin = /* @__PURE__ */ Facet.define();
var ViewPlugin = class {
  constructor(id, create, fields) {
    this.id = id;
    this.create = create;
    this.fields = fields;
    this.extension = viewPlugin.of(this);
  }
  static define(create, spec) {
    let { eventHandlers, provide, decorations: decorations2 } = spec || {};
    let fields = [];
    if (provide)
      for (let provider of Array.isArray(provide) ? provide : [provide])
        fields.push(provider);
    if (eventHandlers)
      fields.push(domEventHandlers.from((value) => ({ plugin: value, handlers: eventHandlers })));
    if (decorations2)
      fields.push(PluginField.decorations.from(decorations2));
    return new ViewPlugin(nextPluginID++, create, fields);
  }
  static fromClass(cls, spec) {
    return ViewPlugin.define((view) => new cls(view), spec);
  }
};
var domEventHandlers = /* @__PURE__ */ PluginField.define();
var PluginInstance = class {
  constructor(spec) {
    this.spec = spec;
    this.mustUpdate = null;
    this.value = null;
  }
  takeField(type, target) {
    for (let { field, get } of this.spec.fields)
      if (field == type)
        target.push(get(this.value));
  }
  update(view) {
    if (!this.value) {
      try {
        this.value = this.spec.create(view);
      } catch (e) {
        logException(view.state, e, "CodeMirror plugin crashed");
        return PluginInstance.dummy;
      }
    } else if (this.mustUpdate) {
      let update = this.mustUpdate;
      this.mustUpdate = null;
      if (!this.value.update)
        return this;
      try {
        this.value.update(update);
      } catch (e) {
        logException(update.state, e, "CodeMirror plugin crashed");
        if (this.value.destroy)
          try {
            this.value.destroy();
          } catch (_) {
          }
        return PluginInstance.dummy;
      }
    }
    return this;
  }
  destroy(view) {
    var _a;
    if ((_a = this.value) === null || _a === void 0 ? void 0 : _a.destroy) {
      try {
        this.value.destroy();
      } catch (e) {
        logException(view.state, e, "CodeMirror plugin crashed");
      }
    }
  }
};
PluginInstance.dummy = /* @__PURE__ */ new PluginInstance(/* @__PURE__ */ ViewPlugin.define(() => ({})));
var editorAttributes = /* @__PURE__ */ Facet.define({
  combine: (values) => values.reduce((a, b) => combineAttrs(b, a), {})
});
var contentAttributes = /* @__PURE__ */ Facet.define({
  combine: (values) => values.reduce((a, b) => combineAttrs(b, a), {})
});
var decorations = /* @__PURE__ */ Facet.define();
var styleModule = /* @__PURE__ */ Facet.define();
var ChangedRange = class {
  constructor(fromA, toA, fromB, toB) {
    this.fromA = fromA;
    this.toA = toA;
    this.fromB = fromB;
    this.toB = toB;
  }
  join(other) {
    return new ChangedRange(Math.min(this.fromA, other.fromA), Math.max(this.toA, other.toA), Math.min(this.fromB, other.fromB), Math.max(this.toB, other.toB));
  }
  addToSet(set) {
    let i = set.length, me = this;
    for (; i > 0; i--) {
      let range = set[i - 1];
      if (range.fromA > me.toA)
        continue;
      if (range.toA < me.fromA)
        break;
      me = me.join(range);
      set.splice(i - 1, 1);
    }
    set.splice(i, 0, me);
    return set;
  }
  static extendWithRanges(diff, ranges) {
    if (ranges.length == 0)
      return diff;
    let result = [];
    for (let dI = 0, rI = 0, posA = 0, posB = 0; ; dI++) {
      let next = dI == diff.length ? null : diff[dI], off = posA - posB;
      let end = next ? next.fromB : 1e9;
      while (rI < ranges.length && ranges[rI] < end) {
        let from = ranges[rI], to = ranges[rI + 1];
        let fromB = Math.max(posB, from), toB = Math.min(end, to);
        if (fromB <= toB)
          new ChangedRange(fromB + off, toB + off, fromB, toB).addToSet(result);
        if (to > end)
          break;
        else
          rI += 2;
      }
      if (!next)
        return result;
      new ChangedRange(next.fromA, next.toA, next.fromB, next.toB).addToSet(result);
      posA = next.toA;
      posB = next.toB;
    }
  }
};
var ViewUpdate = class {
  constructor(view, state, transactions = none2) {
    this.view = view;
    this.state = state;
    this.transactions = transactions;
    this.flags = 0;
    this.startState = view.state;
    this.changes = ChangeSet.empty(this.startState.doc.length);
    for (let tr of transactions)
      this.changes = this.changes.compose(tr.changes);
    let changedRanges = [];
    this.changes.iterChangedRanges((fromA, toA, fromB, toB) => changedRanges.push(new ChangedRange(fromA, toA, fromB, toB)));
    this.changedRanges = changedRanges;
    let focus = view.hasFocus;
    if (focus != view.inputState.notifiedFocused) {
      view.inputState.notifiedFocused = focus;
      this.flags |= 1;
    }
    if (this.docChanged)
      this.flags |= 2;
  }
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  get geometryChanged() {
    return this.docChanged || (this.flags & (16 | 2)) > 0;
  }
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  get docChanged() {
    return this.transactions.some((tr) => tr.docChanged);
  }
  get selectionSet() {
    return this.transactions.some((tr) => tr.selection);
  }
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
};
var DocView = class extends ContentView {
  constructor(view) {
    super();
    this.view = view;
    this.compositionDeco = Decoration.none;
    this.decorations = [];
    this.minWidth = 0;
    this.minWidthFrom = 0;
    this.minWidthTo = 0;
    this.impreciseAnchor = null;
    this.impreciseHead = null;
    this.setDOM(view.contentDOM);
    this.children = [new LineView()];
    this.children[0].setParent(this);
    this.updateInner([new ChangedRange(0, 0, 0, view.state.doc.length)], this.updateDeco(), 0);
  }
  get root() {
    return this.view.root;
  }
  get editorView() {
    return this.view;
  }
  get length() {
    return this.view.state.doc.length;
  }
  update(update) {
    let changedRanges = update.changedRanges;
    if (this.minWidth > 0 && changedRanges.length) {
      if (!changedRanges.every(({ fromA, toA }) => toA < this.minWidthFrom || fromA > this.minWidthTo)) {
        this.minWidth = 0;
      } else {
        this.minWidthFrom = update.changes.mapPos(this.minWidthFrom, 1);
        this.minWidthTo = update.changes.mapPos(this.minWidthTo, 1);
      }
    }
    if (this.view.inputState.composing < 0)
      this.compositionDeco = Decoration.none;
    else if (update.transactions.length)
      this.compositionDeco = computeCompositionDeco(this.view, update.changes);
    let forceSelection = (browser.ie || browser.chrome) && !this.compositionDeco.size && update && update.state.doc.lines != update.startState.doc.lines;
    let prevDeco = this.decorations, deco = this.updateDeco();
    let decoDiff = findChangedDeco(prevDeco, deco, update.changes);
    changedRanges = ChangedRange.extendWithRanges(changedRanges, decoDiff);
    let pointerSel = update.transactions.some((tr) => tr.isUserEvent("select.pointer"));
    if (this.dirty == 0 && changedRanges.length == 0 && !(update.flags & (4 | 8)) && update.state.selection.main.from >= this.view.viewport.from && update.state.selection.main.to <= this.view.viewport.to) {
      this.updateSelection(forceSelection, pointerSel);
      return false;
    } else {
      this.updateInner(changedRanges, deco, update.startState.doc.length, forceSelection, pointerSel);
      return true;
    }
  }
  updateInner(changes, deco, oldLength, forceSelection = false, pointerSel = false) {
    this.updateChildren(changes, deco, oldLength);
    let { observer } = this.view;
    observer.ignore(() => {
      this.dom.style.height = this.view.viewState.domHeight + "px";
      this.dom.style.minWidth = this.minWidth ? this.minWidth + "px" : "";
      let track = browser.chrome || browser.ios ? { node: observer.selectionRange.focusNode, written: false } : void 0;
      this.sync(track);
      this.dirty = 0;
      if (track && (track.written || observer.selectionRange.focusNode != track.node))
        forceSelection = true;
      this.updateSelection(forceSelection, pointerSel);
      this.dom.style.height = "";
    });
  }
  updateChildren(changes, deco, oldLength) {
    let cursor = this.childCursor(oldLength);
    for (let i = changes.length - 1; ; i--) {
      let next = i >= 0 ? changes[i] : null;
      if (!next)
        break;
      let { fromA, toA, fromB, toB } = next;
      let { content: content2, breakAtStart, openStart, openEnd } = ContentBuilder.build(this.view.state.doc, fromB, toB, deco);
      let { i: toI, off: toOff } = cursor.findPos(toA, 1);
      let { i: fromI, off: fromOff } = cursor.findPos(fromA, -1);
      this.replaceRange(fromI, fromOff, toI, toOff, content2, breakAtStart, openStart, openEnd);
    }
  }
  replaceRange(fromI, fromOff, toI, toOff, content2, breakAtStart, openStart, openEnd) {
    let before = this.children[fromI], last = content2.length ? content2[content2.length - 1] : null;
    let breakAtEnd = last ? last.breakAfter : breakAtStart;
    if (fromI == toI && !breakAtStart && !breakAtEnd && content2.length < 2 && before.merge(fromOff, toOff, content2.length ? last : null, fromOff == 0, openStart, openEnd))
      return;
    let after = this.children[toI];
    if (toOff < after.length) {
      if (fromI == toI) {
        after = after.split(toOff);
        toOff = 0;
      }
      if (!breakAtEnd && last && after.merge(0, toOff, last, true, 0, openEnd)) {
        content2[content2.length - 1] = after;
      } else {
        if (toOff)
          after.merge(0, toOff, null, false, 0, openEnd);
        content2.push(after);
      }
    } else if (after.breakAfter) {
      if (last)
        last.breakAfter = 1;
      else
        breakAtStart = 1;
    }
    toI++;
    before.breakAfter = breakAtStart;
    if (fromOff > 0) {
      if (!breakAtStart && content2.length && before.merge(fromOff, before.length, content2[0], false, openStart, 0)) {
        before.breakAfter = content2.shift().breakAfter;
      } else if (fromOff < before.length || before.children.length && before.children[before.children.length - 1].length == 0) {
        before.merge(fromOff, before.length, null, false, openStart, 0);
      }
      fromI++;
    }
    while (fromI < toI && content2.length) {
      if (this.children[toI - 1].match(content2[content2.length - 1]))
        toI--, content2.pop();
      else if (this.children[fromI].match(content2[0]))
        fromI++, content2.shift();
      else
        break;
    }
    if (fromI < toI || content2.length)
      this.replaceChildren(fromI, toI, content2);
  }
  updateSelection(force = false, fromPointer = false) {
    if (!(fromPointer || this.mayControlSelection()) || browser.ios && this.view.inputState.rapidCompositionStart)
      return;
    let main = this.view.state.selection.main;
    let anchor = this.domAtPos(main.anchor);
    let head = main.empty ? anchor : this.domAtPos(main.head);
    if (browser.gecko && main.empty && betweenUneditable(anchor)) {
      let dummy = document.createTextNode("");
      this.view.observer.ignore(() => anchor.node.insertBefore(dummy, anchor.node.childNodes[anchor.offset] || null));
      anchor = head = new DOMPos(dummy, 0);
      force = true;
    }
    let domSel = this.view.observer.selectionRange;
    if (force || !domSel.focusNode || !isEquivalentPosition(anchor.node, anchor.offset, domSel.anchorNode, domSel.anchorOffset) || !isEquivalentPosition(head.node, head.offset, domSel.focusNode, domSel.focusOffset)) {
      this.view.observer.ignore(() => {
        let rawSel = getSelection(this.root);
        if (main.empty) {
          if (browser.gecko) {
            let nextTo = nextToUneditable(anchor.node, anchor.offset);
            if (nextTo && nextTo != (1 | 2)) {
              let text = nearbyTextNode(anchor.node, anchor.offset, nextTo == 1 ? 1 : -1);
              if (text)
                anchor = new DOMPos(text, nextTo == 1 ? 0 : text.nodeValue.length);
            }
          }
          rawSel.collapse(anchor.node, anchor.offset);
          if (main.bidiLevel != null && domSel.cursorBidiLevel != null)
            domSel.cursorBidiLevel = main.bidiLevel;
        } else if (rawSel.extend) {
          rawSel.collapse(anchor.node, anchor.offset);
          rawSel.extend(head.node, head.offset);
        } else {
          let range = document.createRange();
          if (main.anchor > main.head)
            [anchor, head] = [head, anchor];
          range.setEnd(head.node, head.offset);
          range.setStart(anchor.node, anchor.offset);
          rawSel.removeAllRanges();
          rawSel.addRange(range);
        }
      });
      this.view.observer.setSelectionRange(anchor, head);
    }
    this.impreciseAnchor = anchor.precise ? null : new DOMPos(domSel.anchorNode, domSel.anchorOffset);
    this.impreciseHead = head.precise ? null : new DOMPos(domSel.focusNode, domSel.focusOffset);
  }
  enforceCursorAssoc() {
    if (this.view.composing)
      return;
    let cursor = this.view.state.selection.main;
    let sel = getSelection(this.root);
    if (!cursor.empty || !cursor.assoc || !sel.modify)
      return;
    let line = LineView.find(this, cursor.head);
    if (!line)
      return;
    let lineStart = line.posAtStart;
    if (cursor.head == lineStart || cursor.head == lineStart + line.length)
      return;
    let before = this.coordsAt(cursor.head, -1), after = this.coordsAt(cursor.head, 1);
    if (!before || !after || before.bottom > after.top)
      return;
    let dom = this.domAtPos(cursor.head + cursor.assoc);
    sel.collapse(dom.node, dom.offset);
    sel.modify("move", cursor.assoc < 0 ? "forward" : "backward", "lineboundary");
  }
  mayControlSelection() {
    return this.view.state.facet(editable) ? this.root.activeElement == this.dom : hasSelection(this.dom, this.view.observer.selectionRange);
  }
  nearest(dom) {
    for (let cur2 = dom; cur2; ) {
      let domView = ContentView.get(cur2);
      if (domView && domView.rootView == this)
        return domView;
      cur2 = cur2.parentNode;
    }
    return null;
  }
  posFromDOM(node, offset) {
    let view = this.nearest(node);
    if (!view)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return view.localPosFromDOM(node, offset) + view.posAtStart;
  }
  domAtPos(pos) {
    let { i, off } = this.childCursor().findPos(pos, -1);
    for (; i < this.children.length - 1; ) {
      let child = this.children[i];
      if (off < child.length || child instanceof LineView)
        break;
      i++;
      off = 0;
    }
    return this.children[i].domAtPos(off);
  }
  coordsAt(pos, side) {
    for (let off = this.length, i = this.children.length - 1; ; i--) {
      let child = this.children[i], start = off - child.breakAfter - child.length;
      if (pos > start || pos == start && child.type != BlockType.WidgetBefore && child.type != BlockType.WidgetAfter && (!i || side == 2 || this.children[i - 1].breakAfter || this.children[i - 1].type == BlockType.WidgetBefore && side > -2))
        return child.coordsAt(pos - start, side);
      off = start;
    }
  }
  measureVisibleLineHeights() {
    let result = [], { from, to } = this.view.viewState.viewport;
    let minWidth = Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1;
    for (let pos = 0, i = 0; i < this.children.length; i++) {
      let child = this.children[i], end = pos + child.length;
      if (end > to)
        break;
      if (pos >= from) {
        result.push(child.dom.getBoundingClientRect().height);
        let width = child.dom.scrollWidth;
        if (width > minWidth) {
          this.minWidth = minWidth = width;
          this.minWidthFrom = pos;
          this.minWidthTo = end;
        }
      }
      pos = end + child.breakAfter;
    }
    return result;
  }
  measureTextSize() {
    for (let child of this.children) {
      if (child instanceof LineView) {
        let measure = child.measureTextSize();
        if (measure)
          return measure;
      }
    }
    let dummy = document.createElement("div"), lineHeight, charWidth;
    dummy.className = "cm-line";
    dummy.textContent = "abc def ghi jkl mno pqr stu";
    this.view.observer.ignore(() => {
      this.dom.appendChild(dummy);
      let rect = clientRectsFor(dummy.firstChild)[0];
      lineHeight = dummy.getBoundingClientRect().height;
      charWidth = rect ? rect.width / 27 : 7;
      dummy.remove();
    });
    return { lineHeight, charWidth };
  }
  childCursor(pos = this.length) {
    let i = this.children.length;
    if (i)
      pos -= this.children[--i].length;
    return new ChildCursor(this.children, pos, i);
  }
  computeBlockGapDeco() {
    let deco = [], vs = this.view.viewState;
    for (let pos = 0, i = 0; ; i++) {
      let next = i == vs.viewports.length ? null : vs.viewports[i];
      let end = next ? next.from - 1 : this.length;
      if (end > pos) {
        let height = vs.lineAt(end, 0).bottom - vs.lineAt(pos, 0).top;
        deco.push(Decoration.replace({ widget: new BlockGapWidget(height), block: true, inclusive: true }).range(pos, end));
      }
      if (!next)
        break;
      pos = next.to + 1;
    }
    return Decoration.set(deco);
  }
  updateDeco() {
    return this.decorations = [
      ...this.view.pluginField(PluginField.decorations),
      ...this.view.state.facet(decorations),
      this.compositionDeco,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ];
  }
  scrollRangeIntoView(range) {
    let rect = this.coordsAt(range.head, range.empty ? range.assoc : range.head > range.anchor ? -1 : 1), other;
    if (!rect)
      return;
    if (!range.empty && (other = this.coordsAt(range.anchor, range.anchor > range.head ? -1 : 1)))
      rect = {
        left: Math.min(rect.left, other.left),
        top: Math.min(rect.top, other.top),
        right: Math.max(rect.right, other.right),
        bottom: Math.max(rect.bottom, other.bottom)
      };
    let mLeft = 0, mRight = 0, mTop = 0, mBottom = 0;
    for (let margins of this.view.pluginField(PluginField.scrollMargins))
      if (margins) {
        let { left, right, top: top2, bottom } = margins;
        if (left != null)
          mLeft = Math.max(mLeft, left);
        if (right != null)
          mRight = Math.max(mRight, right);
        if (top2 != null)
          mTop = Math.max(mTop, top2);
        if (bottom != null)
          mBottom = Math.max(mBottom, bottom);
      }
    scrollRectIntoView(this.dom, {
      left: rect.left - mLeft,
      top: rect.top - mTop,
      right: rect.right + mRight,
      bottom: rect.bottom + mBottom
    }, range.head < range.anchor ? -1 : 1);
  }
};
function betweenUneditable(pos) {
  return pos.node.nodeType == 1 && pos.node.firstChild && (pos.offset == 0 || pos.node.childNodes[pos.offset - 1].contentEditable == "false") && (pos.offset == pos.node.childNodes.length || pos.node.childNodes[pos.offset].contentEditable == "false");
}
var BlockGapWidget = class extends WidgetType {
  constructor(height) {
    super();
    this.height = height;
  }
  toDOM() {
    let elt = document.createElement("div");
    this.updateDOM(elt);
    return elt;
  }
  eq(other) {
    return other.height == this.height;
  }
  updateDOM(elt) {
    elt.style.height = this.height + "px";
    return true;
  }
  get estimatedHeight() {
    return this.height;
  }
};
function computeCompositionDeco(view, changes) {
  let sel = view.observer.selectionRange;
  let textNode = sel.focusNode && nearbyTextNode(sel.focusNode, sel.focusOffset, 0);
  if (!textNode)
    return Decoration.none;
  let cView = view.docView.nearest(textNode);
  let from, to, topNode = textNode;
  if (cView instanceof InlineView) {
    while (cView.parent instanceof InlineView)
      cView = cView.parent;
    from = cView.posAtStart;
    to = from + cView.length;
    topNode = cView.dom;
  } else if (cView instanceof LineView) {
    while (topNode.parentNode != cView.dom)
      topNode = topNode.parentNode;
    let prev = topNode.previousSibling;
    while (prev && !ContentView.get(prev))
      prev = prev.previousSibling;
    from = to = prev ? ContentView.get(prev).posAtEnd : cView.posAtStart;
  } else {
    return Decoration.none;
  }
  let newFrom = changes.mapPos(from, 1), newTo = Math.max(newFrom, changes.mapPos(to, -1));
  let text = textNode.nodeValue, { state } = view;
  if (newTo - newFrom < text.length) {
    if (state.sliceDoc(newFrom, Math.min(state.doc.length, newFrom + text.length)) == text)
      newTo = newFrom + text.length;
    else if (state.sliceDoc(Math.max(0, newTo - text.length), newTo) == text)
      newFrom = newTo - text.length;
    else
      return Decoration.none;
  } else if (state.sliceDoc(newFrom, newTo) != text) {
    return Decoration.none;
  }
  return Decoration.set(Decoration.replace({ widget: new CompositionWidget(topNode, textNode) }).range(newFrom, newTo));
}
var CompositionWidget = class extends WidgetType {
  constructor(top2, text) {
    super();
    this.top = top2;
    this.text = text;
  }
  eq(other) {
    return this.top == other.top && this.text == other.text;
  }
  toDOM() {
    return this.top;
  }
  ignoreEvent() {
    return false;
  }
  get customView() {
    return CompositionView;
  }
};
function nearbyTextNode(node, offset, side) {
  for (; ; ) {
    if (node.nodeType == 3)
      return node;
    if (node.nodeType == 1 && offset > 0 && side <= 0) {
      node = node.childNodes[offset - 1];
      offset = maxOffset(node);
    } else if (node.nodeType == 1 && offset < node.childNodes.length && side >= 0) {
      node = node.childNodes[offset];
      offset = 0;
    } else {
      return null;
    }
  }
}
function nextToUneditable(node, offset) {
  if (node.nodeType != 1)
    return 0;
  return (offset && node.childNodes[offset - 1].contentEditable == "false" ? 1 : 0) | (offset < node.childNodes.length && node.childNodes[offset].contentEditable == "false" ? 2 : 0);
}
var DecorationComparator$1 = class {
  constructor() {
    this.changes = [];
  }
  compareRange(from, to) {
    addRange(from, to, this.changes);
  }
  comparePoint(from, to) {
    addRange(from, to, this.changes);
  }
};
function findChangedDeco(a, b, diff) {
  let comp = new DecorationComparator$1();
  RangeSet.compare(a, b, diff, comp);
  return comp.changes;
}
var Direction = /* @__PURE__ */ function(Direction2) {
  Direction2[Direction2["LTR"] = 0] = "LTR";
  Direction2[Direction2["RTL"] = 1] = "RTL";
  return Direction2;
}(Direction || (Direction = {}));
var LTR = Direction.LTR;
var RTL = Direction.RTL;
function dec(str) {
  let result = [];
  for (let i = 0; i < str.length; i++)
    result.push(1 << +str[i]);
  return result;
}
var LowTypes = /* @__PURE__ */ dec("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008");
var ArabicTypes = /* @__PURE__ */ dec("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333");
var Brackets = /* @__PURE__ */ Object.create(null);
var BracketStack = [];
for (let p of ["()", "[]", "{}"]) {
  let l = /* @__PURE__ */ p.charCodeAt(0), r = /* @__PURE__ */ p.charCodeAt(1);
  Brackets[l] = r;
  Brackets[r] = -l;
}
function charType(ch) {
  return ch <= 247 ? LowTypes[ch] : 1424 <= ch && ch <= 1524 ? 2 : 1536 <= ch && ch <= 1785 ? ArabicTypes[ch - 1536] : 1774 <= ch && ch <= 2220 ? 4 : 8192 <= ch && ch <= 8203 ? 256 : ch == 8204 ? 256 : 1;
}
var BidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
var BidiSpan = class {
  constructor(from, to, level) {
    this.from = from;
    this.to = to;
    this.level = level;
  }
  get dir() {
    return this.level % 2 ? RTL : LTR;
  }
  side(end, dir) {
    return this.dir == dir == end ? this.to : this.from;
  }
  static find(order, index, level, assoc) {
    let maybe = -1;
    for (let i = 0; i < order.length; i++) {
      let span = order[i];
      if (span.from <= index && span.to >= index) {
        if (span.level == level)
          return i;
        if (maybe < 0 || (assoc != 0 ? assoc < 0 ? span.from < index : span.to > index : order[maybe].level > span.level))
          maybe = i;
      }
    }
    if (maybe < 0)
      throw new RangeError("Index out of range");
    return maybe;
  }
};
var types = [];
function computeOrder(line, direction) {
  let len = line.length, outerType = direction == LTR ? 1 : 2, oppositeType = direction == LTR ? 2 : 1;
  if (!line || outerType == 1 && !BidiRE.test(line))
    return trivialOrder(len);
  for (let i = 0, prev = outerType, prevStrong = outerType; i < len; i++) {
    let type = charType(line.charCodeAt(i));
    if (type == 512)
      type = prev;
    else if (type == 8 && prevStrong == 4)
      type = 16;
    types[i] = type == 4 ? 2 : type;
    if (type & 7)
      prevStrong = type;
    prev = type;
  }
  for (let i = 0, prev = outerType, prevStrong = outerType; i < len; i++) {
    let type = types[i];
    if (type == 128) {
      if (i < len - 1 && prev == types[i + 1] && prev & 24)
        type = types[i] = prev;
      else
        types[i] = 256;
    } else if (type == 64) {
      let end = i + 1;
      while (end < len && types[end] == 64)
        end++;
      let replace = i && prev == 8 || end < len && types[end] == 8 ? prevStrong == 1 ? 1 : 8 : 256;
      for (let j = i; j < end; j++)
        types[j] = replace;
      i = end - 1;
    } else if (type == 8 && prevStrong == 1) {
      types[i] = 1;
    }
    prev = type;
    if (type & 7)
      prevStrong = type;
  }
  for (let i = 0, sI = 0, context = 0, ch, br, type; i < len; i++) {
    if (br = Brackets[ch = line.charCodeAt(i)]) {
      if (br < 0) {
        for (let sJ = sI - 3; sJ >= 0; sJ -= 3) {
          if (BracketStack[sJ + 1] == -br) {
            let flags = BracketStack[sJ + 2];
            let type2 = flags & 2 ? outerType : !(flags & 4) ? 0 : flags & 1 ? oppositeType : outerType;
            if (type2)
              types[i] = types[BracketStack[sJ]] = type2;
            sI = sJ;
            break;
          }
        }
      } else if (BracketStack.length == 189) {
        break;
      } else {
        BracketStack[sI++] = i;
        BracketStack[sI++] = ch;
        BracketStack[sI++] = context;
      }
    } else if ((type = types[i]) == 2 || type == 1) {
      let embed = type == outerType;
      context = embed ? 0 : 1;
      for (let sJ = sI - 3; sJ >= 0; sJ -= 3) {
        let cur2 = BracketStack[sJ + 2];
        if (cur2 & 2)
          break;
        if (embed) {
          BracketStack[sJ + 2] |= 2;
        } else {
          if (cur2 & 4)
            break;
          BracketStack[sJ + 2] |= 4;
        }
      }
    }
  }
  for (let i = 0; i < len; i++) {
    if (types[i] == 256) {
      let end = i + 1;
      while (end < len && types[end] == 256)
        end++;
      let beforeL = (i ? types[i - 1] : outerType) == 1;
      let afterL = (end < len ? types[end] : outerType) == 1;
      let replace = beforeL == afterL ? beforeL ? 1 : 2 : outerType;
      for (let j = i; j < end; j++)
        types[j] = replace;
      i = end - 1;
    }
  }
  let order = [];
  if (outerType == 1) {
    for (let i = 0; i < len; ) {
      let start = i, rtl = types[i++] != 1;
      while (i < len && rtl == (types[i] != 1))
        i++;
      if (rtl) {
        for (let j = i; j > start; ) {
          let end = j, l = types[--j] != 2;
          while (j > start && l == (types[j - 1] != 2))
            j--;
          order.push(new BidiSpan(j, end, l ? 2 : 1));
        }
      } else {
        order.push(new BidiSpan(start, i, 0));
      }
    }
  } else {
    for (let i = 0; i < len; ) {
      let start = i, rtl = types[i++] == 2;
      while (i < len && rtl == (types[i] == 2))
        i++;
      order.push(new BidiSpan(start, i, rtl ? 1 : 2));
    }
  }
  return order;
}
function trivialOrder(length) {
  return [new BidiSpan(0, length, 0)];
}
var movedOver = "";
function moveVisually(line, order, dir, start, forward) {
  var _a;
  let startIndex = start.head - line.from, spanI = -1;
  if (startIndex == 0) {
    if (!forward || !line.length)
      return null;
    if (order[0].level != dir) {
      startIndex = order[0].side(false, dir);
      spanI = 0;
    }
  } else if (startIndex == line.length) {
    if (forward)
      return null;
    let last = order[order.length - 1];
    if (last.level != dir) {
      startIndex = last.side(true, dir);
      spanI = order.length - 1;
    }
  }
  if (spanI < 0)
    spanI = BidiSpan.find(order, startIndex, (_a = start.bidiLevel) !== null && _a !== void 0 ? _a : -1, start.assoc);
  let span = order[spanI];
  if (startIndex == span.side(forward, dir)) {
    span = order[spanI += forward ? 1 : -1];
    startIndex = span.side(!forward, dir);
  }
  let indexForward = forward == (span.dir == dir);
  let nextIndex = findClusterBreak(line.text, startIndex, indexForward);
  movedOver = line.text.slice(Math.min(startIndex, nextIndex), Math.max(startIndex, nextIndex));
  if (nextIndex != span.side(forward, dir))
    return EditorSelection.cursor(nextIndex + line.from, indexForward ? -1 : 1, span.level);
  let nextSpan = spanI == (forward ? order.length - 1 : 0) ? null : order[spanI + (forward ? 1 : -1)];
  if (!nextSpan && span.level != dir)
    return EditorSelection.cursor(forward ? line.to : line.from, forward ? -1 : 1, dir);
  if (nextSpan && nextSpan.level < span.level)
    return EditorSelection.cursor(nextSpan.side(!forward, dir) + line.from, forward ? 1 : -1, nextSpan.level);
  return EditorSelection.cursor(nextIndex + line.from, forward ? -1 : 1, span.level);
}
function groupAt(state, pos, bias = 1) {
  let categorize = state.charCategorizer(pos);
  let line = state.doc.lineAt(pos), linePos = pos - line.from;
  if (line.length == 0)
    return EditorSelection.cursor(pos);
  if (linePos == 0)
    bias = 1;
  else if (linePos == line.length)
    bias = -1;
  let from = linePos, to = linePos;
  if (bias < 0)
    from = findClusterBreak(line.text, linePos, false);
  else
    to = findClusterBreak(line.text, linePos);
  let cat = categorize(line.text.slice(from, to));
  while (from > 0) {
    let prev = findClusterBreak(line.text, from, false);
    if (categorize(line.text.slice(prev, from)) != cat)
      break;
    from = prev;
  }
  while (to < line.length) {
    let next = findClusterBreak(line.text, to);
    if (categorize(line.text.slice(to, next)) != cat)
      break;
    to = next;
  }
  return EditorSelection.range(from + line.from, to + line.from);
}
function getdx(x, rect) {
  return rect.left > x ? rect.left - x : Math.max(0, x - rect.right);
}
function getdy(y, rect) {
  return rect.top > y ? rect.top - y : Math.max(0, y - rect.bottom);
}
function yOverlap(a, b) {
  return a.top < b.bottom - 1 && a.bottom > b.top + 1;
}
function upTop(rect, top2) {
  return top2 < rect.top ? { top: top2, left: rect.left, right: rect.right, bottom: rect.bottom } : rect;
}
function upBot(rect, bottom) {
  return bottom > rect.bottom ? { top: rect.top, left: rect.left, right: rect.right, bottom } : rect;
}
function domPosAtCoords(parent, x, y) {
  let closest, closestRect, closestX, closestY;
  let above, below, aboveRect, belowRect;
  for (let child = parent.firstChild; child; child = child.nextSibling) {
    let rects = clientRectsFor(child);
    for (let i = 0; i < rects.length; i++) {
      let rect = rects[i];
      if (closestRect && yOverlap(closestRect, rect))
        rect = upTop(upBot(rect, closestRect.bottom), closestRect.top);
      let dx = getdx(x, rect), dy = getdy(y, rect);
      if (dx == 0 && dy == 0)
        return child.nodeType == 3 ? domPosInText(child, x, y) : domPosAtCoords(child, x, y);
      if (!closest || closestY > dy || closestY == dy && closestX > dx) {
        closest = child;
        closestRect = rect;
        closestX = dx;
        closestY = dy;
      }
      if (dx == 0) {
        if (y > rect.bottom && (!aboveRect || aboveRect.bottom < rect.bottom)) {
          above = child;
          aboveRect = rect;
        } else if (y < rect.top && (!belowRect || belowRect.top > rect.top)) {
          below = child;
          belowRect = rect;
        }
      } else if (aboveRect && yOverlap(aboveRect, rect)) {
        aboveRect = upBot(aboveRect, rect.bottom);
      } else if (belowRect && yOverlap(belowRect, rect)) {
        belowRect = upTop(belowRect, rect.top);
      }
    }
  }
  if (aboveRect && aboveRect.bottom >= y) {
    closest = above;
    closestRect = aboveRect;
  } else if (belowRect && belowRect.top <= y) {
    closest = below;
    closestRect = belowRect;
  }
  if (!closest)
    return { node: parent, offset: 0 };
  let clipX = Math.max(closestRect.left, Math.min(closestRect.right, x));
  if (closest.nodeType == 3)
    return domPosInText(closest, clipX, y);
  if (!closestX && closest.contentEditable == "true")
    return domPosAtCoords(closest, clipX, y);
  let offset = Array.prototype.indexOf.call(parent.childNodes, closest) + (x >= (closestRect.left + closestRect.right) / 2 ? 1 : 0);
  return { node: parent, offset };
}
function domPosInText(node, x, y) {
  let len = node.nodeValue.length;
  let closestOffset = -1, closestDY = 1e9, generalSide = 0;
  for (let i = 0; i < len; i++) {
    let rects = textRange(node, i, i + 1).getClientRects();
    for (let j = 0; j < rects.length; j++) {
      let rect = rects[j];
      if (rect.top == rect.bottom)
        continue;
      if (!generalSide)
        generalSide = x - rect.left;
      let dy = (rect.top > y ? rect.top - y : y - rect.bottom) - 1;
      if (rect.left - 1 <= x && rect.right + 1 >= x && dy < closestDY) {
        let right = x >= (rect.left + rect.right) / 2, after = right;
        if (browser.chrome || browser.gecko) {
          let rectBefore = textRange(node, i).getBoundingClientRect();
          if (rectBefore.left == rect.right)
            after = !right;
        }
        if (dy <= 0)
          return { node, offset: i + (after ? 1 : 0) };
        closestOffset = i + (after ? 1 : 0);
        closestDY = dy;
      }
    }
  }
  return { node, offset: closestOffset > -1 ? closestOffset : generalSide > 0 ? node.nodeValue.length : 0 };
}
function posAtCoords(view, { x, y }, precise, bias = -1) {
  let content2 = view.contentDOM.getBoundingClientRect(), block;
  let halfLine = view.defaultLineHeight / 2;
  for (let bounced = false; ; ) {
    block = view.blockAtHeight(y, content2.top);
    if (block.top > y || block.bottom < y) {
      bias = block.top > y ? -1 : 1;
      y = Math.min(block.bottom - halfLine, Math.max(block.top + halfLine, y));
      if (bounced)
        return precise ? null : 0;
      else
        bounced = true;
    }
    if (block.type == BlockType.Text)
      break;
    y = bias > 0 ? block.bottom + halfLine : block.top - halfLine;
  }
  let lineStart = block.from;
  x = Math.max(content2.left + 1, Math.min(content2.right - 1, x));
  if (lineStart < view.viewport.from)
    return view.viewport.from == 0 ? 0 : posAtCoordsImprecise(view, content2, block, x, y);
  if (lineStart > view.viewport.to)
    return view.viewport.to == view.state.doc.length ? view.state.doc.length : posAtCoordsImprecise(view, content2, block, x, y);
  let root = view.root, element = root.elementFromPoint(x, y);
  let node, offset = -1;
  if (element && view.contentDOM.contains(element) && !(view.docView.nearest(element) instanceof WidgetView)) {
    if (root.caretPositionFromPoint) {
      let pos = root.caretPositionFromPoint(x, y);
      if (pos)
        ({ offsetNode: node, offset } = pos);
    } else if (root.caretRangeFromPoint) {
      let range = root.caretRangeFromPoint(x, y);
      if (range) {
        ({ startContainer: node, startOffset: offset } = range);
        if (browser.safari && isSuspiciousCaretResult(node, offset, x))
          node = void 0;
      }
    }
  }
  if (!node || !view.docView.dom.contains(node)) {
    let line = LineView.find(view.docView, lineStart);
    ({ node, offset } = domPosAtCoords(line.dom, x, y));
  }
  return view.docView.posFromDOM(node, offset);
}
function posAtCoordsImprecise(view, contentRect, block, x, y) {
  let into = Math.round((x - contentRect.left) * view.defaultCharacterWidth);
  if (view.lineWrapping && block.height > view.defaultLineHeight * 1.5) {
    let line = Math.floor((y - block.top) / view.defaultLineHeight);
    into += line * view.viewState.heightOracle.lineLength;
  }
  let content2 = view.state.sliceDoc(block.from, block.to);
  return block.from + findColumn(content2, into, view.state.tabSize);
}
function isSuspiciousCaretResult(node, offset, x) {
  let len;
  if (node.nodeType != 3 || offset != (len = node.nodeValue.length))
    return false;
  for (let next = node.nextSibling; next; next = next.nextSibling)
    if (next.nodeType != 1 || next.nodeName != "BR")
      return false;
  return textRange(node, len - 1, len).getBoundingClientRect().left > x;
}
function moveToLineBoundary(view, start, forward, includeWrap) {
  let line = view.state.doc.lineAt(start.head);
  let coords = !includeWrap || !view.lineWrapping ? null : view.coordsAtPos(start.assoc < 0 && start.head > line.from ? start.head - 1 : start.head);
  if (coords) {
    let editorRect = view.dom.getBoundingClientRect();
    let pos = view.posAtCoords({
      x: forward == (view.textDirection == Direction.LTR) ? editorRect.right - 1 : editorRect.left + 1,
      y: (coords.top + coords.bottom) / 2
    });
    if (pos != null)
      return EditorSelection.cursor(pos, forward ? -1 : 1);
  }
  let lineView = LineView.find(view.docView, start.head);
  let end = lineView ? forward ? lineView.posAtEnd : lineView.posAtStart : forward ? line.to : line.from;
  return EditorSelection.cursor(end, forward ? -1 : 1);
}
function moveByChar(view, start, forward, by) {
  let line = view.state.doc.lineAt(start.head), spans = view.bidiSpans(line);
  for (let cur2 = start, check = null; ; ) {
    let next = moveVisually(line, spans, view.textDirection, cur2, forward), char = movedOver;
    if (!next) {
      if (line.number == (forward ? view.state.doc.lines : 1))
        return cur2;
      char = "\n";
      line = view.state.doc.line(line.number + (forward ? 1 : -1));
      spans = view.bidiSpans(line);
      next = EditorSelection.cursor(forward ? line.from : line.to);
    }
    if (!check) {
      if (!by)
        return next;
      check = by(char);
    } else if (!check(char)) {
      return cur2;
    }
    cur2 = next;
  }
}
function byGroup(view, pos, start) {
  let categorize = view.state.charCategorizer(pos);
  let cat = categorize(start);
  return (next) => {
    let nextCat = categorize(next);
    if (cat == CharCategory.Space)
      cat = nextCat;
    return cat == nextCat;
  };
}
function moveVertically(view, start, forward, distance) {
  let startPos = start.head, dir = forward ? 1 : -1;
  if (startPos == (forward ? view.state.doc.length : 0))
    return EditorSelection.cursor(startPos);
  let goal = start.goalColumn, startY;
  let rect = view.contentDOM.getBoundingClientRect();
  let startCoords = view.coordsAtPos(startPos);
  if (startCoords) {
    if (goal == null)
      goal = startCoords.left - rect.left;
    startY = dir < 0 ? startCoords.top : startCoords.bottom;
  } else {
    let line = view.viewState.lineAt(startPos, view.dom.getBoundingClientRect().top);
    if (goal == null)
      goal = Math.min(rect.right - rect.left, view.defaultCharacterWidth * (startPos - line.from));
    startY = dir < 0 ? line.top : line.bottom;
  }
  let resolvedGoal = rect.left + goal;
  let dist = distance !== null && distance !== void 0 ? distance : view.defaultLineHeight >> 1;
  for (let extra = 0; ; extra += 10) {
    let curY = startY + (dist + extra) * dir;
    let pos = posAtCoords(view, { x: resolvedGoal, y: curY }, false, dir);
    if (curY < rect.top || curY > rect.bottom || (dir < 0 ? pos < startPos : pos > startPos))
      return EditorSelection.cursor(pos, void 0, void 0, goal);
  }
}
function skipAtoms(view, oldPos, pos) {
  let atoms = view.pluginField(PluginField.atomicRanges);
  for (; ; ) {
    let moved = false;
    for (let set of atoms) {
      set.between(pos.from - 1, pos.from + 1, (from, to, value) => {
        if (pos.from > from && pos.from < to) {
          pos = oldPos.from > pos.from ? EditorSelection.cursor(from, 1) : EditorSelection.cursor(to, -1);
          moved = true;
        }
      });
    }
    if (!moved)
      return pos;
  }
}
var InputState = class {
  constructor(view) {
    this.lastKeyCode = 0;
    this.lastKeyTime = 0;
    this.pendingIOSKey = null;
    this.lastSelectionOrigin = null;
    this.lastSelectionTime = 0;
    this.lastEscPress = 0;
    this.lastContextMenu = 0;
    this.scrollHandlers = [];
    this.registeredEvents = [];
    this.customHandlers = [];
    this.composing = -1;
    this.compositionFirstChange = null;
    this.compositionEndedAt = 0;
    this.rapidCompositionStart = false;
    this.mouseSelection = null;
    for (let type in handlers) {
      let handler = handlers[type];
      view.contentDOM.addEventListener(type, (event) => {
        if (type == "keydown" && this.keydown(view, event))
          return;
        if (!eventBelongsToEditor(view, event) || this.ignoreDuringComposition(event))
          return;
        if (this.mustFlushObserver(event))
          view.observer.forceFlush();
        if (this.runCustomHandlers(type, view, event))
          event.preventDefault();
        else
          handler(view, event);
      });
      this.registeredEvents.push(type);
    }
    this.notifiedFocused = view.hasFocus;
    this.ensureHandlers(view);
    if (browser.safari)
      view.contentDOM.addEventListener("input", () => null);
  }
  setSelectionOrigin(origin) {
    this.lastSelectionOrigin = origin;
    this.lastSelectionTime = Date.now();
  }
  ensureHandlers(view) {
    let handlers2 = this.customHandlers = view.pluginField(domEventHandlers);
    for (let set of handlers2) {
      for (let type in set.handlers)
        if (this.registeredEvents.indexOf(type) < 0 && type != "scroll") {
          this.registeredEvents.push(type);
          view.contentDOM.addEventListener(type, (event) => {
            if (!eventBelongsToEditor(view, event))
              return;
            if (this.runCustomHandlers(type, view, event))
              event.preventDefault();
          });
        }
    }
  }
  runCustomHandlers(type, view, event) {
    for (let set of this.customHandlers) {
      let handler = set.handlers[type], handled = false;
      if (handler) {
        try {
          handled = handler.call(set.plugin, event, view);
        } catch (e) {
          logException(view.state, e);
        }
        if (handled || event.defaultPrevented) {
          if (browser.android && type == "keydown" && event.keyCode == 13)
            view.observer.flushSoon();
          return true;
        }
      }
    }
    return false;
  }
  runScrollHandlers(view, event) {
    for (let set of this.customHandlers) {
      let handler = set.handlers.scroll;
      if (handler) {
        try {
          handler.call(set.plugin, event, view);
        } catch (e) {
          logException(view.state, e);
        }
      }
    }
  }
  keydown(view, event) {
    this.lastKeyCode = event.keyCode;
    this.lastKeyTime = Date.now();
    if (this.screenKeyEvent(view, event))
      return true;
    if (browser.ios && (event.keyCode == 13 || event.keyCode == 8) && !(event.ctrlKey || event.altKey || event.metaKey) && !event.synthetic) {
      this.pendingIOSKey = event.keyCode == 13 ? "enter" : "backspace";
      setTimeout(() => this.flushIOSKey(view), 250);
      return true;
    }
    return false;
  }
  flushIOSKey(view) {
    if (!this.pendingIOSKey)
      return false;
    let dom = view.contentDOM, key = this.pendingIOSKey;
    this.pendingIOSKey = null;
    return key == "enter" ? dispatchKey(dom, "Enter", 13) : dispatchKey(dom, "Backspace", 8);
  }
  ignoreDuringComposition(event) {
    if (!/^key/.test(event.type))
      return false;
    if (this.composing > 0)
      return true;
    if (browser.safari && Date.now() - this.compositionEndedAt < 500) {
      this.compositionEndedAt = 0;
      return true;
    }
    return false;
  }
  screenKeyEvent(view, event) {
    let protectedTab = event.keyCode == 9 && Date.now() < this.lastEscPress + 2e3;
    if (event.keyCode == 27)
      this.lastEscPress = Date.now();
    else if (modifierCodes.indexOf(event.keyCode) < 0)
      this.lastEscPress = 0;
    return protectedTab;
  }
  mustFlushObserver(event) {
    return event.type == "keydown" && event.keyCode != 229 || event.type == "compositionend" && !browser.ios;
  }
  startMouseSelection(view, event, style) {
    if (this.mouseSelection)
      this.mouseSelection.destroy();
    this.mouseSelection = new MouseSelection(this, view, event, style);
  }
  update(update) {
    if (this.mouseSelection)
      this.mouseSelection.update(update);
    if (update.transactions.length)
      this.lastKeyCode = this.lastSelectionTime = 0;
  }
  destroy() {
    if (this.mouseSelection)
      this.mouseSelection.destroy();
  }
};
var modifierCodes = [16, 17, 18, 20, 91, 92, 224, 225];
var MouseSelection = class {
  constructor(inputState, view, startEvent, style) {
    this.inputState = inputState;
    this.view = view;
    this.style = style;
    this.lastEvent = startEvent;
    let doc2 = view.contentDOM.ownerDocument;
    doc2.addEventListener("mousemove", this.move = this.move.bind(this));
    doc2.addEventListener("mouseup", this.up = this.up.bind(this));
    this.extend = startEvent.shiftKey;
    this.multiple = view.state.facet(EditorState.allowMultipleSelections) && addsSelectionRange(view, startEvent);
    this.dragMove = dragMovesSelection(view, startEvent);
    this.dragging = isInPrimarySelection(view, startEvent) ? null : false;
    if (this.dragging === false) {
      startEvent.preventDefault();
      this.select(startEvent);
    }
  }
  move(event) {
    if (event.buttons == 0)
      return this.destroy();
    if (this.dragging !== false)
      return;
    this.select(this.lastEvent = event);
  }
  up(event) {
    if (this.dragging == null)
      this.select(this.lastEvent);
    if (!this.dragging)
      event.preventDefault();
    this.destroy();
  }
  destroy() {
    let doc2 = this.view.contentDOM.ownerDocument;
    doc2.removeEventListener("mousemove", this.move);
    doc2.removeEventListener("mouseup", this.up);
    this.inputState.mouseSelection = null;
  }
  select(event) {
    let selection = this.style.get(event, this.extend, this.multiple);
    if (!selection.eq(this.view.state.selection) || selection.main.assoc != this.view.state.selection.main.assoc)
      this.view.dispatch({
        selection,
        userEvent: "select.pointer",
        scrollIntoView: true
      });
  }
  update(update) {
    if (update.docChanged && this.dragging)
      this.dragging = this.dragging.map(update.changes);
    if (this.style.update(update))
      setTimeout(() => this.select(this.lastEvent), 20);
  }
};
function addsSelectionRange(view, event) {
  let facet = view.state.facet(clickAddsSelectionRange);
  return facet.length ? facet[0](event) : browser.mac ? event.metaKey : event.ctrlKey;
}
function dragMovesSelection(view, event) {
  let facet = view.state.facet(dragMovesSelection$1);
  return facet.length ? facet[0](event) : browser.mac ? !event.altKey : !event.ctrlKey;
}
function isInPrimarySelection(view, event) {
  let { main } = view.state.selection;
  if (main.empty)
    return false;
  let sel = getSelection(view.root);
  if (sel.rangeCount == 0)
    return true;
  let rects = sel.getRangeAt(0).getClientRects();
  for (let i = 0; i < rects.length; i++) {
    let rect = rects[i];
    if (rect.left <= event.clientX && rect.right >= event.clientX && rect.top <= event.clientY && rect.bottom >= event.clientY)
      return true;
  }
  return false;
}
function eventBelongsToEditor(view, event) {
  if (!event.bubbles)
    return true;
  if (event.defaultPrevented)
    return false;
  for (let node = event.target, cView; node != view.contentDOM; node = node.parentNode)
    if (!node || node.nodeType == 11 || (cView = ContentView.get(node)) && cView.ignoreEvent(event))
      return false;
  return true;
}
var handlers = /* @__PURE__ */ Object.create(null);
var brokenClipboardAPI = browser.ie && browser.ie_version < 15 || browser.ios && browser.webkit_version < 604;
function capturePaste(view) {
  let parent = view.dom.parentNode;
  if (!parent)
    return;
  let target = parent.appendChild(document.createElement("textarea"));
  target.style.cssText = "position: fixed; left: -10000px; top: 10px";
  target.focus();
  setTimeout(() => {
    view.focus();
    target.remove();
    doPaste(view, target.value);
  }, 50);
}
function doPaste(view, input) {
  let { state } = view, changes, i = 1, text = state.toText(input);
  let byLine = text.lines == state.selection.ranges.length;
  let linewise = lastLinewiseCopy && state.selection.ranges.every((r) => r.empty) && lastLinewiseCopy == text.toString();
  if (linewise) {
    let lastLine = -1;
    changes = state.changeByRange((range) => {
      let line = state.doc.lineAt(range.from);
      if (line.from == lastLine)
        return { range };
      lastLine = line.from;
      let insert2 = state.toText((byLine ? text.line(i++).text : input) + state.lineBreak);
      return {
        changes: { from: line.from, insert: insert2 },
        range: EditorSelection.cursor(range.from + insert2.length)
      };
    });
  } else if (byLine) {
    changes = state.changeByRange((range) => {
      let line = text.line(i++);
      return {
        changes: { from: range.from, to: range.to, insert: line.text },
        range: EditorSelection.cursor(range.from + line.length)
      };
    });
  } else {
    changes = state.replaceSelection(text);
  }
  view.dispatch(changes, {
    userEvent: "input.paste",
    scrollIntoView: true
  });
}
handlers.keydown = (view, event) => {
  view.inputState.setSelectionOrigin("select");
};
var lastTouch = 0;
handlers.touchstart = (view, e) => {
  lastTouch = Date.now();
  view.inputState.setSelectionOrigin("select.pointer");
};
handlers.touchmove = (view) => {
  view.inputState.setSelectionOrigin("select.pointer");
};
handlers.mousedown = (view, event) => {
  view.observer.flush();
  if (lastTouch > Date.now() - 2e3)
    return;
  let style = null;
  for (let makeStyle of view.state.facet(mouseSelectionStyle)) {
    style = makeStyle(view, event);
    if (style)
      break;
  }
  if (!style && event.button == 0)
    style = basicMouseSelection(view, event);
  if (style) {
    if (view.root.activeElement != view.contentDOM)
      view.observer.ignore(() => focusPreventScroll(view.contentDOM));
    view.inputState.startMouseSelection(view, event, style);
  }
};
function rangeForClick(view, pos, bias, type) {
  if (type == 1) {
    return EditorSelection.cursor(pos, bias);
  } else if (type == 2) {
    return groupAt(view.state, pos, bias);
  } else {
    let visual = LineView.find(view.docView, pos), line = view.state.doc.lineAt(visual ? visual.posAtEnd : pos);
    let from = visual ? visual.posAtStart : line.from, to = visual ? visual.posAtEnd : line.to;
    if (to < view.state.doc.length && to == line.to)
      to++;
    return EditorSelection.range(from, to);
  }
}
var insideY = (y, rect) => y >= rect.top && y <= rect.bottom;
var inside = (x, y, rect) => insideY(y, rect) && x >= rect.left && x <= rect.right;
function findPositionSide(view, pos, x, y) {
  let line = LineView.find(view.docView, pos);
  if (!line)
    return 1;
  let off = pos - line.posAtStart;
  if (off == 0)
    return 1;
  if (off == line.length)
    return -1;
  let before = line.coordsAt(off, -1);
  if (before && inside(x, y, before))
    return -1;
  let after = line.coordsAt(off, 1);
  if (after && inside(x, y, after))
    return 1;
  return before && insideY(y, before) ? -1 : 1;
}
function queryPos(view, event) {
  let pos = view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
  return { pos, bias: findPositionSide(view, pos, event.clientX, event.clientY) };
}
var BadMouseDetail = browser.ie && browser.ie_version <= 11;
var lastMouseDown = null;
var lastMouseDownCount = 0;
var lastMouseDownTime = 0;
function getClickType(event) {
  if (!BadMouseDetail)
    return event.detail;
  let last = lastMouseDown, lastTime = lastMouseDownTime;
  lastMouseDown = event;
  lastMouseDownTime = Date.now();
  return lastMouseDownCount = !last || lastTime > Date.now() - 400 && Math.abs(last.clientX - event.clientX) < 2 && Math.abs(last.clientY - event.clientY) < 2 ? (lastMouseDownCount + 1) % 3 : 1;
}
function basicMouseSelection(view, event) {
  let start = queryPos(view, event), type = getClickType(event);
  let startSel = view.state.selection;
  let last = start, lastEvent = event;
  return {
    update(update) {
      if (update.changes) {
        if (start)
          start.pos = update.changes.mapPos(start.pos);
        startSel = startSel.map(update.changes);
        lastEvent = null;
      }
    },
    get(event2, extend2, multiple) {
      let cur2;
      if (lastEvent && event2.clientX == lastEvent.clientX && event2.clientY == lastEvent.clientY)
        cur2 = last;
      else {
        cur2 = last = queryPos(view, event2);
        lastEvent = event2;
      }
      if (!cur2 || !start)
        return startSel;
      let range = rangeForClick(view, cur2.pos, cur2.bias, type);
      if (start.pos != cur2.pos && !extend2) {
        let startRange = rangeForClick(view, start.pos, start.bias, type);
        let from = Math.min(startRange.from, range.from), to = Math.max(startRange.to, range.to);
        range = from < range.from ? EditorSelection.range(from, to) : EditorSelection.range(to, from);
      }
      if (extend2)
        return startSel.replaceRange(startSel.main.extend(range.from, range.to));
      else if (multiple)
        return startSel.addRange(range);
      else
        return EditorSelection.create([range]);
    }
  };
}
handlers.dragstart = (view, event) => {
  let { selection: { main } } = view.state;
  let { mouseSelection } = view.inputState;
  if (mouseSelection)
    mouseSelection.dragging = main;
  if (event.dataTransfer) {
    event.dataTransfer.setData("Text", view.state.sliceDoc(main.from, main.to));
    event.dataTransfer.effectAllowed = "copyMove";
  }
};
function dropText(view, event, text, direct) {
  let dropPos = view.posAtCoords({ x: event.clientX, y: event.clientY });
  if (dropPos == null || !text)
    return;
  event.preventDefault();
  let { mouseSelection } = view.inputState;
  let del = direct && mouseSelection && mouseSelection.dragging && mouseSelection.dragMove ? { from: mouseSelection.dragging.from, to: mouseSelection.dragging.to } : null;
  let ins = { from: dropPos, insert: text };
  let changes = view.state.changes(del ? [del, ins] : ins);
  view.focus();
  view.dispatch({
    changes,
    selection: { anchor: changes.mapPos(dropPos, -1), head: changes.mapPos(dropPos, 1) },
    userEvent: del ? "move.drop" : "input.drop"
  });
}
handlers.drop = (view, event) => {
  if (!event.dataTransfer)
    return;
  if (view.state.readOnly)
    return event.preventDefault();
  let files = event.dataTransfer.files;
  if (files && files.length) {
    event.preventDefault();
    let text = Array(files.length), read = 0;
    let finishFile = () => {
      if (++read == files.length)
        dropText(view, event, text.filter((s) => s != null).join(view.state.lineBreak), false);
    };
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onerror = finishFile;
      reader.onload = () => {
        if (!/[\x00-\x08\x0e-\x1f]{2}/.test(reader.result))
          text[i] = reader.result;
        finishFile();
      };
      reader.readAsText(files[i]);
    }
  } else {
    dropText(view, event, event.dataTransfer.getData("Text"), true);
  }
};
handlers.paste = (view, event) => {
  if (view.state.readOnly)
    return event.preventDefault();
  view.observer.flush();
  let data = brokenClipboardAPI ? null : event.clipboardData;
  let text = data && data.getData("text/plain");
  if (text) {
    doPaste(view, text);
    event.preventDefault();
  } else {
    capturePaste(view);
  }
};
function captureCopy(view, text) {
  let parent = view.dom.parentNode;
  if (!parent)
    return;
  let target = parent.appendChild(document.createElement("textarea"));
  target.style.cssText = "position: fixed; left: -10000px; top: 10px";
  target.value = text;
  target.focus();
  target.selectionEnd = text.length;
  target.selectionStart = 0;
  setTimeout(() => {
    target.remove();
    view.focus();
  }, 50);
}
function copiedRange(state) {
  let content2 = [], ranges = [], linewise = false;
  for (let range of state.selection.ranges)
    if (!range.empty) {
      content2.push(state.sliceDoc(range.from, range.to));
      ranges.push(range);
    }
  if (!content2.length) {
    let upto = -1;
    for (let { from } of state.selection.ranges) {
      let line = state.doc.lineAt(from);
      if (line.number > upto) {
        content2.push(line.text);
        ranges.push({ from: line.from, to: Math.min(state.doc.length, line.to + 1) });
      }
      upto = line.number;
    }
    linewise = true;
  }
  return { text: content2.join(state.lineBreak), ranges, linewise };
}
var lastLinewiseCopy = null;
handlers.copy = handlers.cut = (view, event) => {
  let { text, ranges, linewise } = copiedRange(view.state);
  if (!text)
    return;
  lastLinewiseCopy = linewise ? text : null;
  let data = brokenClipboardAPI ? null : event.clipboardData;
  if (data) {
    event.preventDefault();
    data.clearData();
    data.setData("text/plain", text);
  } else {
    captureCopy(view, text);
  }
  if (event.type == "cut" && !view.state.readOnly)
    view.dispatch({
      changes: ranges,
      scrollIntoView: true,
      userEvent: "delete.cut"
    });
};
handlers.focus = handlers.blur = (view) => {
  setTimeout(() => {
    if (view.hasFocus != view.inputState.notifiedFocused)
      view.update([]);
  }, 10);
};
handlers.beforeprint = (view) => {
  view.viewState.printing = true;
  view.requestMeasure();
  setTimeout(() => {
    view.viewState.printing = false;
    view.requestMeasure();
  }, 2e3);
};
function forceClearComposition(view, rapid) {
  if (view.docView.compositionDeco.size) {
    view.inputState.rapidCompositionStart = rapid;
    try {
      view.update([]);
    } finally {
      view.inputState.rapidCompositionStart = false;
    }
  }
}
handlers.compositionstart = handlers.compositionupdate = (view) => {
  if (view.inputState.compositionFirstChange == null)
    view.inputState.compositionFirstChange = true;
  if (view.inputState.composing < 0) {
    if (view.docView.compositionDeco.size) {
      view.observer.flush();
      forceClearComposition(view, true);
    }
    view.inputState.composing = 0;
  }
};
handlers.compositionend = (view) => {
  view.inputState.composing = -1;
  view.inputState.compositionEndedAt = Date.now();
  view.inputState.compositionFirstChange = null;
  setTimeout(() => {
    if (view.inputState.composing < 0)
      forceClearComposition(view, false);
  }, 50);
};
handlers.contextmenu = (view) => {
  view.inputState.lastContextMenu = Date.now();
};
var wrappingWhiteSpace = ["pre-wrap", "normal", "pre-line"];
var HeightOracle = class {
  constructor() {
    this.doc = Text.empty;
    this.lineWrapping = false;
    this.direction = Direction.LTR;
    this.heightSamples = {};
    this.lineHeight = 14;
    this.charWidth = 7;
    this.lineLength = 30;
    this.heightChanged = false;
  }
  heightForGap(from, to) {
    let lines = this.doc.lineAt(to).number - this.doc.lineAt(from).number + 1;
    if (this.lineWrapping)
      lines += Math.ceil((to - from - lines * this.lineLength * 0.5) / this.lineLength);
    return this.lineHeight * lines;
  }
  heightForLine(length) {
    if (!this.lineWrapping)
      return this.lineHeight;
    let lines = 1 + Math.max(0, Math.ceil((length - this.lineLength) / (this.lineLength - 5)));
    return lines * this.lineHeight;
  }
  setDoc(doc2) {
    this.doc = doc2;
    return this;
  }
  mustRefresh(lineHeights, whiteSpace, direction) {
    let newHeight = false;
    for (let i = 0; i < lineHeights.length; i++) {
      let h = lineHeights[i];
      if (h < 0) {
        i++;
      } else if (!this.heightSamples[Math.floor(h * 10)]) {
        newHeight = true;
        this.heightSamples[Math.floor(h * 10)] = true;
      }
    }
    return newHeight || wrappingWhiteSpace.indexOf(whiteSpace) > -1 != this.lineWrapping || this.direction != direction;
  }
  refresh(whiteSpace, direction, lineHeight, charWidth, lineLength, knownHeights) {
    let lineWrapping = wrappingWhiteSpace.indexOf(whiteSpace) > -1;
    let changed = Math.round(lineHeight) != Math.round(this.lineHeight) || this.lineWrapping != lineWrapping || this.direction != direction;
    this.lineWrapping = lineWrapping;
    this.direction = direction;
    this.lineHeight = lineHeight;
    this.charWidth = charWidth;
    this.lineLength = lineLength;
    if (changed) {
      this.heightSamples = {};
      for (let i = 0; i < knownHeights.length; i++) {
        let h = knownHeights[i];
        if (h < 0)
          i++;
        else
          this.heightSamples[Math.floor(h * 10)] = true;
      }
    }
    return changed;
  }
};
var MeasuredHeights = class {
  constructor(from, heights) {
    this.from = from;
    this.heights = heights;
    this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
};
var BlockInfo = class {
  constructor(from, length, top2, height, type) {
    this.from = from;
    this.length = length;
    this.top = top2;
    this.height = height;
    this.type = type;
  }
  get to() {
    return this.from + this.length;
  }
  get bottom() {
    return this.top + this.height;
  }
  join(other) {
    let detail = (Array.isArray(this.type) ? this.type : [this]).concat(Array.isArray(other.type) ? other.type : [other]);
    return new BlockInfo(this.from, this.length + other.length, this.top, this.height + other.height, detail);
  }
};
var QueryType = /* @__PURE__ */ function(QueryType2) {
  QueryType2[QueryType2["ByPos"] = 0] = "ByPos";
  QueryType2[QueryType2["ByHeight"] = 1] = "ByHeight";
  QueryType2[QueryType2["ByPosNoHeight"] = 2] = "ByPosNoHeight";
  return QueryType2;
}(QueryType || (QueryType = {}));
var Epsilon = 1e-4;
var HeightMap = class {
  constructor(length, height, flags = 2) {
    this.length = length;
    this.height = height;
    this.flags = flags;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(value) {
    this.flags = (value ? 2 : 0) | this.flags & ~2;
  }
  setHeight(oracle, height) {
    if (this.height != height) {
      if (Math.abs(this.height - height) > Epsilon)
        oracle.heightChanged = true;
      this.height = height;
    }
  }
  replace(_from, _to, nodes) {
    return HeightMap.of(nodes);
  }
  decomposeLeft(_to, result) {
    result.push(this);
  }
  decomposeRight(_from, result) {
    result.push(this);
  }
  applyChanges(decorations2, oldDoc, oracle, changes) {
    let me = this;
    for (let i = changes.length - 1; i >= 0; i--) {
      let { fromA, toA, fromB, toB } = changes[i];
      let start = me.lineAt(fromA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
      let end = start.to >= toA ? start : me.lineAt(toA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
      toB += end.to - toA;
      toA = end.to;
      while (i > 0 && start.from <= changes[i - 1].toA) {
        fromA = changes[i - 1].fromA;
        fromB = changes[i - 1].fromB;
        i--;
        if (fromA < start.from)
          start = me.lineAt(fromA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
      }
      fromB += start.from - fromA;
      fromA = start.from;
      let nodes = NodeBuilder.build(oracle, decorations2, fromB, toB);
      me = me.replace(fromA, toA, nodes);
    }
    return me.updateHeight(oracle, 0);
  }
  static empty() {
    return new HeightMapText(0, 0);
  }
  static of(nodes) {
    if (nodes.length == 1)
      return nodes[0];
    let i = 0, j = nodes.length, before = 0, after = 0;
    for (; ; ) {
      if (i == j) {
        if (before > after * 2) {
          let split = nodes[i - 1];
          if (split.break)
            nodes.splice(--i, 1, split.left, null, split.right);
          else
            nodes.splice(--i, 1, split.left, split.right);
          j += 1 + split.break;
          before -= split.size;
        } else if (after > before * 2) {
          let split = nodes[j];
          if (split.break)
            nodes.splice(j, 1, split.left, null, split.right);
          else
            nodes.splice(j, 1, split.left, split.right);
          j += 2 + split.break;
          after -= split.size;
        } else {
          break;
        }
      } else if (before < after) {
        let next = nodes[i++];
        if (next)
          before += next.size;
      } else {
        let next = nodes[--j];
        if (next)
          after += next.size;
      }
    }
    let brk = 0;
    if (nodes[i - 1] == null) {
      brk = 1;
      i--;
    } else if (nodes[i] == null) {
      brk = 1;
      j++;
    }
    return new HeightMapBranch(HeightMap.of(nodes.slice(0, i)), brk, HeightMap.of(nodes.slice(j)));
  }
};
HeightMap.prototype.size = 1;
var HeightMapBlock = class extends HeightMap {
  constructor(length, height, type) {
    super(length, height);
    this.type = type;
  }
  blockAt(_height, _doc, top2, offset) {
    return new BlockInfo(offset, this.length, top2, this.height, this.type);
  }
  lineAt(_value, _type, doc2, top2, offset) {
    return this.blockAt(0, doc2, top2, offset);
  }
  forEachLine(_from, _to, doc2, top2, offset, f) {
    f(this.blockAt(0, doc2, top2, offset));
  }
  updateHeight(oracle, offset = 0, _force = false, measured) {
    if (measured && measured.from <= offset && measured.more)
      this.setHeight(oracle, measured.heights[measured.index++]);
    this.outdated = false;
    return this;
  }
  toString() {
    return `block(${this.length})`;
  }
};
var HeightMapText = class extends HeightMapBlock {
  constructor(length, height) {
    super(length, height, BlockType.Text);
    this.collapsed = 0;
    this.widgetHeight = 0;
  }
  replace(_from, _to, nodes) {
    let node = nodes[0];
    if (nodes.length == 1 && (node instanceof HeightMapText || node instanceof HeightMapGap && node.flags & 4) && Math.abs(this.length - node.length) < 10) {
      if (node instanceof HeightMapGap)
        node = new HeightMapText(node.length, this.height);
      else
        node.height = this.height;
      if (!this.outdated)
        node.outdated = false;
      return node;
    } else {
      return HeightMap.of(nodes);
    }
  }
  updateHeight(oracle, offset = 0, force = false, measured) {
    if (measured && measured.from <= offset && measured.more)
      this.setHeight(oracle, measured.heights[measured.index++]);
    else if (force || this.outdated)
      this.setHeight(oracle, Math.max(this.widgetHeight, oracle.heightForLine(this.length - this.collapsed)));
    this.outdated = false;
    return this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
};
var HeightMapGap = class extends HeightMap {
  constructor(length) {
    super(length, 0);
  }
  lines(doc2, offset) {
    let firstLine = doc2.lineAt(offset).number, lastLine = doc2.lineAt(offset + this.length).number;
    return { firstLine, lastLine, lineHeight: this.height / (lastLine - firstLine + 1) };
  }
  blockAt(height, doc2, top2, offset) {
    let { firstLine, lastLine, lineHeight } = this.lines(doc2, offset);
    let line = Math.max(0, Math.min(lastLine - firstLine, Math.floor((height - top2) / lineHeight)));
    let { from, length } = doc2.line(firstLine + line);
    return new BlockInfo(from, length, top2 + lineHeight * line, lineHeight, BlockType.Text);
  }
  lineAt(value, type, doc2, top2, offset) {
    if (type == QueryType.ByHeight)
      return this.blockAt(value, doc2, top2, offset);
    if (type == QueryType.ByPosNoHeight) {
      let { from: from2, to } = doc2.lineAt(value);
      return new BlockInfo(from2, to - from2, 0, 0, BlockType.Text);
    }
    let { firstLine, lineHeight } = this.lines(doc2, offset);
    let { from, length, number: number2 } = doc2.lineAt(value);
    return new BlockInfo(from, length, top2 + lineHeight * (number2 - firstLine), lineHeight, BlockType.Text);
  }
  forEachLine(from, to, doc2, top2, offset, f) {
    let { firstLine, lineHeight } = this.lines(doc2, offset);
    for (let pos = Math.max(from, offset), end = Math.min(offset + this.length, to); pos <= end; ) {
      let line = doc2.lineAt(pos);
      if (pos == from)
        top2 += lineHeight * (line.number - firstLine);
      f(new BlockInfo(line.from, line.length, top2, lineHeight, BlockType.Text));
      top2 += lineHeight;
      pos = line.to + 1;
    }
  }
  replace(from, to, nodes) {
    let after = this.length - to;
    if (after > 0) {
      let last = nodes[nodes.length - 1];
      if (last instanceof HeightMapGap)
        nodes[nodes.length - 1] = new HeightMapGap(last.length + after);
      else
        nodes.push(null, new HeightMapGap(after - 1));
    }
    if (from > 0) {
      let first = nodes[0];
      if (first instanceof HeightMapGap)
        nodes[0] = new HeightMapGap(from + first.length);
      else
        nodes.unshift(new HeightMapGap(from - 1), null);
    }
    return HeightMap.of(nodes);
  }
  decomposeLeft(to, result) {
    result.push(new HeightMapGap(to - 1), null);
  }
  decomposeRight(from, result) {
    result.push(null, new HeightMapGap(this.length - from - 1));
  }
  updateHeight(oracle, offset = 0, force = false, measured) {
    let end = offset + this.length;
    if (measured && measured.from <= offset + this.length && measured.more) {
      let nodes = [], pos = Math.max(offset, measured.from);
      if (measured.from > offset)
        nodes.push(new HeightMapGap(measured.from - offset - 1).updateHeight(oracle, offset));
      while (pos <= end && measured.more) {
        let len = oracle.doc.lineAt(pos).length;
        if (nodes.length)
          nodes.push(null);
        let line = new HeightMapText(len, measured.heights[measured.index++]);
        line.outdated = false;
        nodes.push(line);
        pos += len + 1;
      }
      if (pos <= end)
        nodes.push(null, new HeightMapGap(end - pos).updateHeight(oracle, pos));
      oracle.heightChanged = true;
      return HeightMap.of(nodes);
    } else if (force || this.outdated) {
      this.setHeight(oracle, oracle.heightForGap(offset, offset + this.length));
      this.outdated = false;
    }
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
};
var HeightMapBranch = class extends HeightMap {
  constructor(left, brk, right) {
    super(left.length + brk + right.length, left.height + right.height, brk | (left.outdated || right.outdated ? 2 : 0));
    this.left = left;
    this.right = right;
    this.size = left.size + right.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(height, doc2, top2, offset) {
    let mid = top2 + this.left.height;
    return height < mid || this.right.height == 0 ? this.left.blockAt(height, doc2, top2, offset) : this.right.blockAt(height, doc2, mid, offset + this.left.length + this.break);
  }
  lineAt(value, type, doc2, top2, offset) {
    let rightTop = top2 + this.left.height, rightOffset = offset + this.left.length + this.break;
    let left = type == QueryType.ByHeight ? value < rightTop || this.right.height == 0 : value < rightOffset;
    let base2 = left ? this.left.lineAt(value, type, doc2, top2, offset) : this.right.lineAt(value, type, doc2, rightTop, rightOffset);
    if (this.break || (left ? base2.to < rightOffset : base2.from > rightOffset))
      return base2;
    let subQuery = type == QueryType.ByPosNoHeight ? QueryType.ByPosNoHeight : QueryType.ByPos;
    if (left)
      return base2.join(this.right.lineAt(rightOffset, subQuery, doc2, rightTop, rightOffset));
    else
      return this.left.lineAt(rightOffset, subQuery, doc2, top2, offset).join(base2);
  }
  forEachLine(from, to, doc2, top2, offset, f) {
    let rightTop = top2 + this.left.height, rightOffset = offset + this.left.length + this.break;
    if (this.break) {
      if (from < rightOffset)
        this.left.forEachLine(from, to, doc2, top2, offset, f);
      if (to >= rightOffset)
        this.right.forEachLine(from, to, doc2, rightTop, rightOffset, f);
    } else {
      let mid = this.lineAt(rightOffset, QueryType.ByPos, doc2, top2, offset);
      if (from < mid.from)
        this.left.forEachLine(from, mid.from - 1, doc2, top2, offset, f);
      if (mid.to >= from && mid.from <= to)
        f(mid);
      if (to > mid.to)
        this.right.forEachLine(mid.to + 1, to, doc2, rightTop, rightOffset, f);
    }
  }
  replace(from, to, nodes) {
    let rightStart = this.left.length + this.break;
    if (to < rightStart)
      return this.balanced(this.left.replace(from, to, nodes), this.right);
    if (from > this.left.length)
      return this.balanced(this.left, this.right.replace(from - rightStart, to - rightStart, nodes));
    let result = [];
    if (from > 0)
      this.decomposeLeft(from, result);
    let left = result.length;
    for (let node of nodes)
      result.push(node);
    if (from > 0)
      mergeGaps(result, left - 1);
    if (to < this.length) {
      let right = result.length;
      this.decomposeRight(to, result);
      mergeGaps(result, right);
    }
    return HeightMap.of(result);
  }
  decomposeLeft(to, result) {
    let left = this.left.length;
    if (to <= left)
      return this.left.decomposeLeft(to, result);
    result.push(this.left);
    if (this.break) {
      left++;
      if (to >= left)
        result.push(null);
    }
    if (to > left)
      this.right.decomposeLeft(to - left, result);
  }
  decomposeRight(from, result) {
    let left = this.left.length, right = left + this.break;
    if (from >= right)
      return this.right.decomposeRight(from - right, result);
    if (from < left)
      this.left.decomposeRight(from, result);
    if (this.break && from < right)
      result.push(null);
    result.push(this.right);
  }
  balanced(left, right) {
    if (left.size > 2 * right.size || right.size > 2 * left.size)
      return HeightMap.of(this.break ? [left, null, right] : [left, right]);
    this.left = left;
    this.right = right;
    this.height = left.height + right.height;
    this.outdated = left.outdated || right.outdated;
    this.size = left.size + right.size;
    this.length = left.length + this.break + right.length;
    return this;
  }
  updateHeight(oracle, offset = 0, force = false, measured) {
    let { left, right } = this, rightStart = offset + left.length + this.break, rebalance = null;
    if (measured && measured.from <= offset + left.length && measured.more)
      rebalance = left = left.updateHeight(oracle, offset, force, measured);
    else
      left.updateHeight(oracle, offset, force);
    if (measured && measured.from <= rightStart + right.length && measured.more)
      rebalance = right = right.updateHeight(oracle, rightStart, force, measured);
    else
      right.updateHeight(oracle, rightStart, force);
    if (rebalance)
      return this.balanced(left, right);
    this.height = this.left.height + this.right.height;
    this.outdated = false;
    return this;
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
};
function mergeGaps(nodes, around) {
  let before, after;
  if (nodes[around] == null && (before = nodes[around - 1]) instanceof HeightMapGap && (after = nodes[around + 1]) instanceof HeightMapGap)
    nodes.splice(around - 1, 3, new HeightMapGap(before.length + 1 + after.length));
}
var relevantWidgetHeight = 5;
var NodeBuilder = class {
  constructor(pos, oracle) {
    this.pos = pos;
    this.oracle = oracle;
    this.nodes = [];
    this.lineStart = -1;
    this.lineEnd = -1;
    this.covering = null;
    this.writtenTo = pos;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(_from, to) {
    if (this.lineStart > -1) {
      let end = Math.min(to, this.lineEnd), last = this.nodes[this.nodes.length - 1];
      if (last instanceof HeightMapText)
        last.length += end - this.pos;
      else if (end > this.pos || !this.isCovered)
        this.nodes.push(new HeightMapText(end - this.pos, -1));
      this.writtenTo = end;
      if (to > end) {
        this.nodes.push(null);
        this.writtenTo++;
        this.lineStart = -1;
      }
    }
    this.pos = to;
  }
  point(from, to, deco) {
    if (from < to || deco.heightRelevant) {
      let height = deco.widget ? Math.max(0, deco.widget.estimatedHeight) : 0;
      let len = to - from;
      if (deco.block) {
        this.addBlock(new HeightMapBlock(len, height, deco.type));
      } else if (len || height >= relevantWidgetHeight) {
        this.addLineDeco(height, len);
      }
    } else if (to > from) {
      this.span(from, to);
    }
    if (this.lineEnd > -1 && this.lineEnd < this.pos)
      this.lineEnd = this.oracle.doc.lineAt(this.pos).to;
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from, to } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = from;
    this.lineEnd = to;
    if (this.writtenTo < from) {
      if (this.writtenTo < from - 1 || this.nodes[this.nodes.length - 1] == null)
        this.nodes.push(this.blankContent(this.writtenTo, from - 1));
      this.nodes.push(null);
    }
    if (this.pos > from)
      this.nodes.push(new HeightMapText(this.pos - from, -1));
    this.writtenTo = this.pos;
  }
  blankContent(from, to) {
    let gap = new HeightMapGap(to - from);
    if (this.oracle.doc.lineAt(from).to == to)
      gap.flags |= 4;
    return gap;
  }
  ensureLine() {
    this.enterLine();
    let last = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (last instanceof HeightMapText)
      return last;
    let line = new HeightMapText(0, -1);
    this.nodes.push(line);
    return line;
  }
  addBlock(block) {
    this.enterLine();
    if (block.type == BlockType.WidgetAfter && !this.isCovered)
      this.ensureLine();
    this.nodes.push(block);
    this.writtenTo = this.pos = this.pos + block.length;
    if (block.type != BlockType.WidgetBefore)
      this.covering = block;
  }
  addLineDeco(height, length) {
    let line = this.ensureLine();
    line.length += length;
    line.collapsed += length;
    line.widgetHeight = Math.max(line.widgetHeight, height);
    this.writtenTo = this.pos = this.pos + length;
  }
  finish(from) {
    let last = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    if (this.lineStart > -1 && !(last instanceof HeightMapText) && !this.isCovered)
      this.nodes.push(new HeightMapText(0, -1));
    else if (this.writtenTo < this.pos || last == null)
      this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let pos = from;
    for (let node of this.nodes) {
      if (node instanceof HeightMapText)
        node.updateHeight(this.oracle, pos);
      pos += node ? node.length : 1;
    }
    return this.nodes;
  }
  static build(oracle, decorations2, from, to) {
    let builder = new NodeBuilder(from, oracle);
    RangeSet.spans(decorations2, from, to, builder, 0);
    return builder.finish(from);
  }
};
function heightRelevantDecoChanges(a, b, diff) {
  let comp = new DecorationComparator();
  RangeSet.compare(a, b, diff, comp, 0);
  return comp.changes;
}
var DecorationComparator = class {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(from, to, a, b) {
    if (from < to || a && a.heightRelevant || b && b.heightRelevant)
      addRange(from, to, this.changes, 5);
  }
};
function visiblePixelRange(dom, paddingTop) {
  let rect = dom.getBoundingClientRect();
  let left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
  let top2 = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
  for (let parent = dom.parentNode; parent; ) {
    if (parent.nodeType == 1) {
      let style = window.getComputedStyle(parent);
      if ((parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth) && style.overflow != "visible") {
        let parentRect = parent.getBoundingClientRect();
        left = Math.max(left, parentRect.left);
        right = Math.min(right, parentRect.right);
        top2 = Math.max(top2, parentRect.top);
        bottom = Math.min(bottom, parentRect.bottom);
      }
      parent = style.position == "absolute" || style.position == "fixed" ? parent.offsetParent : parent.parentNode;
    } else if (parent.nodeType == 11) {
      parent = parent.host;
    } else {
      break;
    }
  }
  return {
    left: left - rect.left,
    right: right - rect.left,
    top: top2 - (rect.top + paddingTop),
    bottom: bottom - (rect.top + paddingTop)
  };
}
var LineGap = class {
  constructor(from, to, size) {
    this.from = from;
    this.to = to;
    this.size = size;
  }
  static same(a, b) {
    if (a.length != b.length)
      return false;
    for (let i = 0; i < a.length; i++) {
      let gA = a[i], gB = b[i];
      if (gA.from != gB.from || gA.to != gB.to || gA.size != gB.size)
        return false;
    }
    return true;
  }
  draw(wrapping) {
    return Decoration.replace({ widget: new LineGapWidget(this.size, wrapping) }).range(this.from, this.to);
  }
};
var LineGapWidget = class extends WidgetType {
  constructor(size, vertical) {
    super();
    this.size = size;
    this.vertical = vertical;
  }
  eq(other) {
    return other.size == this.size && other.vertical == this.vertical;
  }
  toDOM() {
    let elt = document.createElement("div");
    if (this.vertical) {
      elt.style.height = this.size + "px";
    } else {
      elt.style.width = this.size + "px";
      elt.style.height = "2px";
      elt.style.display = "inline-block";
    }
    return elt;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
};
var ViewState = class {
  constructor(state) {
    this.state = state;
    this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 };
    this.inView = true;
    this.paddingTop = 0;
    this.paddingBottom = 0;
    this.contentWidth = 0;
    this.heightOracle = new HeightOracle();
    this.scaler = IdScaler;
    this.scrollTo = null;
    this.printing = false;
    this.visibleRanges = [];
    this.mustEnforceCursorAssoc = false;
    this.heightMap = HeightMap.empty().applyChanges(state.facet(decorations), Text.empty, this.heightOracle.setDoc(state.doc), [new ChangedRange(0, 0, 0, state.doc.length)]);
    this.viewport = this.getViewport(0, null);
    this.updateForViewport();
    this.lineGaps = this.ensureLineGaps([]);
    this.lineGapDeco = Decoration.set(this.lineGaps.map((gap) => gap.draw(false)));
    this.computeVisibleRanges();
  }
  updateForViewport() {
    let viewports = [this.viewport], { main } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let pos = i ? main.head : main.anchor;
      if (!viewports.some(({ from, to }) => pos >= from && pos <= to)) {
        let { from, to } = this.lineAt(pos, 0);
        viewports.push(new Viewport(from, to));
      }
    }
    this.viewports = viewports.sort((a, b) => a.from - b.from);
    this.scaler = this.heightMap.height <= 7e6 ? IdScaler : new BigScaler(this.heightOracle.doc, this.heightMap, this.viewports);
  }
  update(update, scrollTo2 = null) {
    let prev = this.state;
    this.state = update.state;
    let newDeco = this.state.facet(decorations);
    let contentChanges = update.changedRanges;
    let heightChanges = ChangedRange.extendWithRanges(contentChanges, heightRelevantDecoChanges(update.startState.facet(decorations), newDeco, update ? update.changes : ChangeSet.empty(this.state.doc.length)));
    let prevHeight = this.heightMap.height;
    this.heightMap = this.heightMap.applyChanges(newDeco, prev.doc, this.heightOracle.setDoc(this.state.doc), heightChanges);
    if (this.heightMap.height != prevHeight)
      update.flags |= 2;
    let viewport = heightChanges.length ? this.mapViewport(this.viewport, update.changes) : this.viewport;
    if (scrollTo2 && (scrollTo2.head < viewport.from || scrollTo2.head > viewport.to) || !this.viewportIsAppropriate(viewport))
      viewport = this.getViewport(0, scrollTo2);
    if (!viewport.eq(this.viewport)) {
      this.viewport = viewport;
      update.flags |= 4;
    }
    this.updateForViewport();
    if (this.lineGaps.length || this.viewport.to - this.viewport.from > 15e3)
      update.flags |= this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, update.changes)));
    this.computeVisibleRanges();
    if (scrollTo2)
      this.scrollTo = scrollTo2;
    if (!this.mustEnforceCursorAssoc && update.selectionSet && update.view.lineWrapping && update.state.selection.main.empty && update.state.selection.main.assoc)
      this.mustEnforceCursorAssoc = true;
  }
  measure(docView, repeated) {
    let dom = docView.dom, whiteSpace = "", direction = Direction.LTR;
    if (!repeated) {
      let style = window.getComputedStyle(dom);
      whiteSpace = style.whiteSpace, direction = style.direction == "rtl" ? Direction.RTL : Direction.LTR;
      this.paddingTop = parseInt(style.paddingTop) || 0;
      this.paddingBottom = parseInt(style.paddingBottom) || 0;
    }
    let pixelViewport = this.printing ? { top: -1e8, bottom: 1e8, left: -1e8, right: 1e8 } : visiblePixelRange(dom, this.paddingTop);
    let dTop = pixelViewport.top - this.pixelViewport.top, dBottom = pixelViewport.bottom - this.pixelViewport.bottom;
    this.pixelViewport = pixelViewport;
    this.inView = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (!this.inView)
      return 0;
    let lineHeights = docView.measureVisibleLineHeights();
    let refresh = false, bias = 0, result = 0, oracle = this.heightOracle;
    if (!repeated) {
      let contentWidth = docView.dom.clientWidth;
      if (oracle.mustRefresh(lineHeights, whiteSpace, direction) || oracle.lineWrapping && Math.abs(contentWidth - this.contentWidth) > oracle.charWidth) {
        let { lineHeight, charWidth } = docView.measureTextSize();
        refresh = oracle.refresh(whiteSpace, direction, lineHeight, charWidth, contentWidth / charWidth, lineHeights);
        if (refresh) {
          docView.minWidth = 0;
          result |= 16;
        }
      }
      if (this.contentWidth != contentWidth) {
        this.contentWidth = contentWidth;
        result |= 16;
      }
      if (dTop > 0 && dBottom > 0)
        bias = Math.max(dTop, dBottom);
      else if (dTop < 0 && dBottom < 0)
        bias = Math.min(dTop, dBottom);
    }
    oracle.heightChanged = false;
    this.heightMap = this.heightMap.updateHeight(oracle, 0, refresh, new MeasuredHeights(this.viewport.from, lineHeights));
    if (oracle.heightChanged)
      result |= 2;
    if (!this.viewportIsAppropriate(this.viewport, bias) || this.scrollTo && (this.scrollTo.head < this.viewport.from || this.scrollTo.head > this.viewport.to)) {
      let newVP = this.getViewport(bias, this.scrollTo);
      if (newVP.from != this.viewport.from || newVP.to != this.viewport.to) {
        this.viewport = newVP;
        result |= 4;
      }
    }
    this.updateForViewport();
    if (this.lineGaps.length || this.viewport.to - this.viewport.from > 15e3)
      result |= this.updateLineGaps(this.ensureLineGaps(refresh ? [] : this.lineGaps));
    this.computeVisibleRanges();
    if (this.mustEnforceCursorAssoc) {
      this.mustEnforceCursorAssoc = false;
      docView.enforceCursorAssoc();
    }
    return result;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top, 0);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom, 0);
  }
  getViewport(bias, scrollTo2) {
    let marginTop = 0.5 - Math.max(-0.5, Math.min(0.5, bias / 1e3 / 2));
    let map = this.heightMap, doc2 = this.state.doc, { visibleTop, visibleBottom } = this;
    let viewport = new Viewport(map.lineAt(visibleTop - marginTop * 1e3, QueryType.ByHeight, doc2, 0, 0).from, map.lineAt(visibleBottom + (1 - marginTop) * 1e3, QueryType.ByHeight, doc2, 0, 0).to);
    if (scrollTo2) {
      if (scrollTo2.head < viewport.from) {
        let { top: newTop } = map.lineAt(scrollTo2.head, QueryType.ByPos, doc2, 0, 0);
        viewport = new Viewport(map.lineAt(newTop - 1e3 / 2, QueryType.ByHeight, doc2, 0, 0).from, map.lineAt(newTop + (visibleBottom - visibleTop) + 1e3 / 2, QueryType.ByHeight, doc2, 0, 0).to);
      } else if (scrollTo2.head > viewport.to) {
        let { bottom: newBottom } = map.lineAt(scrollTo2.head, QueryType.ByPos, doc2, 0, 0);
        viewport = new Viewport(map.lineAt(newBottom - (visibleBottom - visibleTop) - 1e3 / 2, QueryType.ByHeight, doc2, 0, 0).from, map.lineAt(newBottom + 1e3 / 2, QueryType.ByHeight, doc2, 0, 0).to);
      }
    }
    return viewport;
  }
  mapViewport(viewport, changes) {
    let from = changes.mapPos(viewport.from, -1), to = changes.mapPos(viewport.to, 1);
    return new Viewport(this.heightMap.lineAt(from, QueryType.ByPos, this.state.doc, 0, 0).from, this.heightMap.lineAt(to, QueryType.ByPos, this.state.doc, 0, 0).to);
  }
  viewportIsAppropriate({ from, to }, bias = 0) {
    let { top: top2 } = this.heightMap.lineAt(from, QueryType.ByPos, this.state.doc, 0, 0);
    let { bottom } = this.heightMap.lineAt(to, QueryType.ByPos, this.state.doc, 0, 0);
    let { visibleTop, visibleBottom } = this;
    return (from == 0 || top2 <= visibleTop - Math.max(10, Math.min(-bias, 250))) && (to == this.state.doc.length || bottom >= visibleBottom + Math.max(10, Math.min(bias, 250))) && (top2 > visibleTop - 2 * 1e3 && bottom < visibleBottom + 2 * 1e3);
  }
  mapLineGaps(gaps, changes) {
    if (!gaps.length || changes.empty)
      return gaps;
    let mapped = [];
    for (let gap of gaps)
      if (!changes.touchesRange(gap.from, gap.to))
        mapped.push(new LineGap(changes.mapPos(gap.from), changes.mapPos(gap.to), gap.size));
    return mapped;
  }
  ensureLineGaps(current) {
    let gaps = [];
    if (this.heightOracle.direction != Direction.LTR)
      return gaps;
    this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.state.doc, 0, 0, (line) => {
      if (line.length < 1e4)
        return;
      let structure = lineStructure(line.from, line.to, this.state);
      if (structure.total < 1e4)
        return;
      let viewFrom, viewTo;
      if (this.heightOracle.lineWrapping) {
        if (line.from != this.viewport.from)
          viewFrom = line.from;
        else
          viewFrom = findPosition(structure, (this.visibleTop - line.top) / line.height);
        if (line.to != this.viewport.to)
          viewTo = line.to;
        else
          viewTo = findPosition(structure, (this.visibleBottom - line.top) / line.height);
      } else {
        let totalWidth = structure.total * this.heightOracle.charWidth;
        viewFrom = findPosition(structure, this.pixelViewport.left / totalWidth);
        viewTo = findPosition(structure, this.pixelViewport.right / totalWidth);
      }
      let sel = this.state.selection.main;
      if (sel.from <= viewFrom && sel.to >= line.from)
        viewFrom = sel.from;
      if (sel.from <= line.to && sel.to >= viewTo)
        viewTo = sel.to;
      let gapTo = viewFrom - 1e4, gapFrom = viewTo + 1e4;
      if (gapTo > line.from + 5e3)
        gaps.push(find(current, (gap) => gap.from == line.from && gap.to > gapTo - 5e3 && gap.to < gapTo + 5e3) || new LineGap(line.from, gapTo, this.gapSize(line, gapTo, true, structure)));
      if (gapFrom < line.to - 5e3)
        gaps.push(find(current, (gap) => gap.to == line.to && gap.from > gapFrom - 5e3 && gap.from < gapFrom + 5e3) || new LineGap(gapFrom, line.to, this.gapSize(line, gapFrom, false, structure)));
    });
    return gaps;
  }
  gapSize(line, pos, start, structure) {
    if (this.heightOracle.lineWrapping) {
      let height = line.height * findFraction(structure, pos);
      return start ? height : line.height - height;
    } else {
      let ratio = findFraction(structure, pos);
      return structure.total * this.heightOracle.charWidth * (start ? ratio : 1 - ratio);
    }
  }
  updateLineGaps(gaps) {
    if (!LineGap.same(gaps, this.lineGaps)) {
      this.lineGaps = gaps;
      this.lineGapDeco = Decoration.set(gaps.map((gap) => gap.draw(this.heightOracle.lineWrapping)));
      return 8;
    }
    return 0;
  }
  computeVisibleRanges() {
    let deco = this.state.facet(decorations);
    if (this.lineGaps.length)
      deco = deco.concat(this.lineGapDeco);
    let ranges = [];
    RangeSet.spans(deco, this.viewport.from, this.viewport.to, {
      span(from, to) {
        ranges.push({ from, to });
      },
      point() {
      }
    }, 20);
    this.visibleRanges = ranges;
  }
  lineAt(pos, editorTop) {
    editorTop += this.paddingTop;
    return scaleBlock(this.heightMap.lineAt(pos, QueryType.ByPos, this.state.doc, editorTop, 0), this.scaler, editorTop);
  }
  lineAtHeight(height, editorTop) {
    editorTop += this.paddingTop;
    return scaleBlock(this.heightMap.lineAt(this.scaler.fromDOM(height, editorTop), QueryType.ByHeight, this.state.doc, editorTop, 0), this.scaler, editorTop);
  }
  blockAtHeight(height, editorTop) {
    editorTop += this.paddingTop;
    return scaleBlock(this.heightMap.blockAt(this.scaler.fromDOM(height, editorTop), this.state.doc, editorTop, 0), this.scaler, editorTop);
  }
  forEachLine(from, to, f, editorTop) {
    editorTop += this.paddingTop;
    return this.heightMap.forEachLine(from, to, this.state.doc, editorTop, 0, this.scaler.scale == 1 ? f : (b) => f(scaleBlock(b, this.scaler, editorTop)));
  }
  get contentHeight() {
    return this.domHeight + this.paddingTop + this.paddingBottom;
  }
  get domHeight() {
    return this.scaler.toDOM(this.heightMap.height, this.paddingTop);
  }
};
var Viewport = class {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
  eq(b) {
    return this.from == b.from && this.to == b.to;
  }
};
function lineStructure(from, to, state) {
  let ranges = [], pos = from, total = 0;
  RangeSet.spans(state.facet(decorations), from, to, {
    span() {
    },
    point(from2, to2) {
      if (from2 > pos) {
        ranges.push({ from: pos, to: from2 });
        total += from2 - pos;
      }
      pos = to2;
    }
  }, 20);
  if (pos < to) {
    ranges.push({ from: pos, to });
    total += to - pos;
  }
  return { total, ranges };
}
function findPosition({ total, ranges }, ratio) {
  if (ratio <= 0)
    return ranges[0].from;
  if (ratio >= 1)
    return ranges[ranges.length - 1].to;
  let dist = Math.floor(total * ratio);
  for (let i = 0; ; i++) {
    let { from, to } = ranges[i], size = to - from;
    if (dist <= size)
      return from + dist;
    dist -= size;
  }
}
function findFraction(structure, pos) {
  let counted = 0;
  for (let { from, to } of structure.ranges) {
    if (pos <= to) {
      counted += pos - from;
      break;
    }
    counted += to - from;
  }
  return counted / structure.total;
}
function find(array, f) {
  for (let val of array)
    if (f(val))
      return val;
  return void 0;
}
var IdScaler = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1
};
var BigScaler = class {
  constructor(doc2, heightMap, viewports) {
    let vpHeight = 0, base2 = 0, domBase = 0;
    this.viewports = viewports.map(({ from, to }) => {
      let top2 = heightMap.lineAt(from, QueryType.ByPos, doc2, 0, 0).top;
      let bottom = heightMap.lineAt(to, QueryType.ByPos, doc2, 0, 0).bottom;
      vpHeight += bottom - top2;
      return { from, to, top: top2, bottom, domTop: 0, domBottom: 0 };
    });
    this.scale = (7e6 - vpHeight) / (heightMap.height - vpHeight);
    for (let obj of this.viewports) {
      obj.domTop = domBase + (obj.top - base2) * this.scale;
      domBase = obj.domBottom = obj.domTop + (obj.bottom - obj.top);
      base2 = obj.bottom;
    }
  }
  toDOM(n, top2) {
    n -= top2;
    for (let i = 0, base2 = 0, domBase = 0; ; i++) {
      let vp = i < this.viewports.length ? this.viewports[i] : null;
      if (!vp || n < vp.top)
        return domBase + (n - base2) * this.scale + top2;
      if (n <= vp.bottom)
        return vp.domTop + (n - vp.top) + top2;
      base2 = vp.bottom;
      domBase = vp.domBottom;
    }
  }
  fromDOM(n, top2) {
    n -= top2;
    for (let i = 0, base2 = 0, domBase = 0; ; i++) {
      let vp = i < this.viewports.length ? this.viewports[i] : null;
      if (!vp || n < vp.domTop)
        return base2 + (n - domBase) / this.scale + top2;
      if (n <= vp.domBottom)
        return vp.top + (n - vp.domTop) + top2;
      base2 = vp.bottom;
      domBase = vp.domBottom;
    }
  }
};
function scaleBlock(block, scaler, top2) {
  if (scaler.scale == 1)
    return block;
  let bTop = scaler.toDOM(block.top, top2), bBottom = scaler.toDOM(block.bottom, top2);
  return new BlockInfo(block.from, block.length, bTop, bBottom - bTop, Array.isArray(block.type) ? block.type.map((b) => scaleBlock(b, scaler, top2)) : block.type);
}
var theme = /* @__PURE__ */ Facet.define({ combine: (strs) => strs.join(" ") });
var darkTheme = /* @__PURE__ */ Facet.define({ combine: (values) => values.indexOf(true) > -1 });
var baseThemeID = /* @__PURE__ */ StyleModule.newName();
var baseLightID = /* @__PURE__ */ StyleModule.newName();
var baseDarkID = /* @__PURE__ */ StyleModule.newName();
var lightDarkIDs = { "&light": "." + baseLightID, "&dark": "." + baseDarkID };
function buildTheme(main, spec, scopes) {
  return new StyleModule(spec, {
    finish(sel) {
      return /&/.test(sel) ? sel.replace(/&\w*/, (m) => {
        if (m == "&")
          return main;
        if (!scopes || !scopes[m])
          throw new RangeError(`Unsupported selector: ${m}`);
        return scopes[m];
      }) : main + " " + sel;
    }
  });
}
var baseTheme = /* @__PURE__ */ buildTheme("." + baseThemeID, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    minHeight: "100%",
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    boxSizing: "border-box",
    padding: "4px 0",
    outline: "none"
  },
  ".cm-lineWrapping": {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere"
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 4px"
  },
  ".cm-selectionLayer": {
    zIndex: -1,
    contain: "size style"
  },
  ".cm-selectionBackground": {
    position: "absolute"
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    zIndex: 100,
    contain: "size style",
    pointerEvents: "none"
  },
  "&.cm-focused .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  "@keyframes cm-blink": { "0%": {}, "50%": { visibility: "hidden" }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { visibility: "hidden" }, "100%": {} },
  ".cm-cursor": {
    position: "absolute",
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none",
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#444"
  },
  "&.cm-focused .cm-cursor": {
    display: "block"
  },
  "&light .cm-activeLine": { backgroundColor: "#f3f9ff" },
  "&dark .cm-activeLine": { backgroundColor: "#223039" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "3px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, lightDarkIDs);
var observeOptions = {
  childList: true,
  characterData: true,
  subtree: true,
  attributes: true,
  characterDataOldValue: true
};
var useCharData = browser.ie && browser.ie_version <= 11;
var DOMObserver = class {
  constructor(view, onChange, onScrollChanged) {
    this.view = view;
    this.onChange = onChange;
    this.onScrollChanged = onScrollChanged;
    this.active = false;
    this.ignoreSelection = new DOMSelection();
    this.delayedFlush = -1;
    this.queue = [];
    this.lastFlush = 0;
    this.scrollTargets = [];
    this.intersection = null;
    this.intersecting = false;
    this._selectionRange = null;
    this.parentCheck = -1;
    this.dom = view.contentDOM;
    this.observer = new MutationObserver((mutations) => {
      for (let mut of mutations)
        this.queue.push(mut);
      this._selectionRange = null;
      if ((browser.ie && browser.ie_version <= 11 || browser.ios && view.composing) && mutations.some((m) => m.type == "childList" && m.removedNodes.length || m.type == "characterData" && m.oldValue.length > m.target.nodeValue.length))
        this.flushSoon();
      else
        this.flush();
    });
    if (useCharData)
      this.onCharData = (event) => {
        this.queue.push({
          target: event.target,
          type: "characterData",
          oldValue: event.prevValue
        });
        this.flushSoon();
      };
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.start();
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener("scroll", this.onScroll);
    if (typeof IntersectionObserver == "function") {
      this.intersection = new IntersectionObserver((entries) => {
        if (this.parentCheck < 0)
          this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3);
        if (entries[entries.length - 1].intersectionRatio > 0 != this.intersecting) {
          this.intersecting = !this.intersecting;
          if (this.intersecting != this.view.inView)
            this.onScrollChanged(document.createEvent("Event"));
        }
      }, {});
      this.intersection.observe(this.dom);
    }
    this.listenForScroll();
  }
  onScroll(e) {
    if (this.intersecting)
      this.flush();
    this.onScrollChanged(e);
  }
  onSelectionChange(event) {
    if (this.lastFlush < Date.now() - 50)
      this._selectionRange = null;
    let { view } = this, sel = this.selectionRange;
    if (view.state.facet(editable) ? view.root.activeElement != this.dom : !hasSelection(view.dom, sel))
      return;
    let context = sel.anchorNode && view.docView.nearest(sel.anchorNode);
    if (context && context.ignoreEvent(event))
      return;
    if (browser.ie && browser.ie_version <= 11 && !view.state.selection.main.empty && sel.focusNode && isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset))
      this.flushSoon();
    else
      this.flush();
  }
  get selectionRange() {
    if (!this._selectionRange) {
      let { root } = this.view, sel = getSelection(root);
      if (browser.safari && root.nodeType == 11 && deepActiveElement() == this.view.contentDOM)
        sel = safariSelectionRangeHack(this.view) || sel;
      this._selectionRange = sel;
    }
    return this._selectionRange;
  }
  setSelectionRange(anchor, head) {
    var _a;
    if (!((_a = this._selectionRange) === null || _a === void 0 ? void 0 : _a.type))
      this._selectionRange = {
        anchorNode: anchor.node,
        anchorOffset: anchor.offset,
        focusNode: head.node,
        focusOffset: head.offset
      };
  }
  listenForScroll() {
    this.parentCheck = -1;
    let i = 0, changed = null;
    for (let dom = this.dom; dom; ) {
      if (dom.nodeType == 1) {
        if (!changed && i < this.scrollTargets.length && this.scrollTargets[i] == dom)
          i++;
        else if (!changed)
          changed = this.scrollTargets.slice(0, i);
        if (changed)
          changed.push(dom);
        dom = dom.assignedSlot || dom.parentNode;
      } else if (dom.nodeType == 11) {
        dom = dom.host;
      } else {
        break;
      }
    }
    if (i < this.scrollTargets.length && !changed)
      changed = this.scrollTargets.slice(0, i);
    if (changed) {
      for (let dom of this.scrollTargets)
        dom.removeEventListener("scroll", this.onScroll);
      for (let dom of this.scrollTargets = changed)
        dom.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(f) {
    if (!this.active)
      return f();
    try {
      this.stop();
      return f();
    } finally {
      this.start();
      this.clear();
    }
  }
  start() {
    if (this.active)
      return;
    this.observer.observe(this.dom, observeOptions);
    this.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
    if (useCharData)
      this.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
    this.active = true;
  }
  stop() {
    if (!this.active)
      return;
    this.active = false;
    this.observer.disconnect();
    this.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
    if (useCharData)
      this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
  }
  clearSelection() {
    this.ignoreSelection.set(this.selectionRange);
  }
  clear() {
    this.observer.takeRecords();
    this.queue.length = 0;
    this.clearSelection();
  }
  flushSoon() {
    if (this.delayedFlush < 0)
      this.delayedFlush = window.setTimeout(() => {
        this.delayedFlush = -1;
        this.flush();
      }, 20);
  }
  forceFlush() {
    if (this.delayedFlush >= 0) {
      window.clearTimeout(this.delayedFlush);
      this.delayedFlush = -1;
      this.flush();
    }
  }
  flush() {
    if (this.delayedFlush >= 0)
      return;
    this.lastFlush = Date.now();
    let records = this.queue;
    for (let mut of this.observer.takeRecords())
      records.push(mut);
    if (records.length)
      this.queue = [];
    let selection = this.selectionRange;
    let newSel = !this.ignoreSelection.eq(selection) && hasSelection(this.dom, selection);
    if (records.length == 0 && !newSel)
      return;
    let from = -1, to = -1, typeOver = false;
    for (let record of records) {
      let range = this.readMutation(record);
      if (!range)
        continue;
      if (range.typeOver)
        typeOver = true;
      if (from == -1) {
        ({ from, to } = range);
      } else {
        from = Math.min(range.from, from);
        to = Math.max(range.to, to);
      }
    }
    let startState = this.view.state;
    if (from > -1 || newSel)
      this.onChange(from, to, typeOver);
    if (this.view.state == startState) {
      if (this.view.docView.dirty) {
        this.ignore(() => this.view.docView.sync());
        this.view.docView.dirty = 0;
      }
      if (newSel)
        this.view.docView.updateSelection();
    }
    this.clearSelection();
  }
  readMutation(rec) {
    let cView = this.view.docView.nearest(rec.target);
    if (!cView || cView.ignoreMutation(rec))
      return null;
    cView.markDirty(rec.type == "attributes");
    if (rec.type == "attributes")
      cView.dirty |= 4;
    if (rec.type == "childList") {
      let childBefore = findChild(cView, rec.previousSibling || rec.target.previousSibling, -1);
      let childAfter = findChild(cView, rec.nextSibling || rec.target.nextSibling, 1);
      return {
        from: childBefore ? cView.posAfter(childBefore) : cView.posAtStart,
        to: childAfter ? cView.posBefore(childAfter) : cView.posAtEnd,
        typeOver: false
      };
    } else if (rec.type == "characterData") {
      return { from: cView.posAtStart, to: cView.posAtEnd, typeOver: rec.target.nodeValue == rec.oldValue };
    } else {
      return null;
    }
  }
  destroy() {
    this.stop();
    if (this.intersection)
      this.intersection.disconnect();
    for (let dom of this.scrollTargets)
      dom.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("scroll", this.onScroll);
    clearTimeout(this.parentCheck);
  }
};
function findChild(cView, dom, dir) {
  while (dom) {
    let curView = ContentView.get(dom);
    if (curView && curView.parent == cView)
      return curView;
    let parent = dom.parentNode;
    dom = parent != cView.dom ? parent : dir > 0 ? dom.nextSibling : dom.previousSibling;
  }
  return null;
}
function safariSelectionRangeHack(view) {
  let found = null;
  function read(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    found = event.getTargetRanges()[0];
  }
  view.contentDOM.addEventListener("beforeinput", read, true);
  document.execCommand("indent");
  view.contentDOM.removeEventListener("beforeinput", read, true);
  if (!found)
    return null;
  let anchorNode = found.startContainer, anchorOffset = found.startOffset;
  let focusNode = found.endContainer, focusOffset = found.endOffset;
  let curAnchor = view.docView.domAtPos(view.state.selection.main.anchor);
  if (isEquivalentPosition(curAnchor.node, curAnchor.offset, focusNode, focusOffset))
    [anchorNode, anchorOffset, focusNode, focusOffset] = [focusNode, focusOffset, anchorNode, anchorOffset];
  return { anchorNode, anchorOffset, focusNode, focusOffset };
}
function applyDOMChange(view, start, end, typeOver) {
  let change, newSel;
  let sel = view.state.selection.main, bounds;
  if (start > -1 && !view.state.readOnly && (bounds = view.docView.domBoundsAround(start, end, 0))) {
    let { from, to } = bounds;
    let selPoints = view.docView.impreciseHead || view.docView.impreciseAnchor ? [] : selectionPoints(view);
    let reader = new DOMReader(selPoints, view);
    reader.readRange(bounds.startDOM, bounds.endDOM);
    newSel = selectionFromPoints(selPoints, from);
    let preferredPos = sel.from, preferredSide = null;
    if (view.inputState.lastKeyCode === 8 && view.inputState.lastKeyTime > Date.now() - 100 || browser.android && reader.text.length < to - from) {
      preferredPos = sel.to;
      preferredSide = "end";
    }
    let diff = findDiff(view.state.sliceDoc(from, to), reader.text, preferredPos - from, preferredSide);
    if (diff)
      change = {
        from: from + diff.from,
        to: from + diff.toA,
        insert: view.state.toText(reader.text.slice(diff.from, diff.toB))
      };
  } else if (view.hasFocus || !view.state.facet(editable)) {
    let domSel = view.observer.selectionRange;
    let { impreciseHead: iHead, impreciseAnchor: iAnchor } = view.docView;
    let head = iHead && iHead.node == domSel.focusNode && iHead.offset == domSel.focusOffset || !contains(view.contentDOM, domSel.focusNode) ? view.state.selection.main.head : view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
    let anchor = iAnchor && iAnchor.node == domSel.anchorNode && iAnchor.offset == domSel.anchorOffset || !contains(view.contentDOM, domSel.anchorNode) ? view.state.selection.main.anchor : view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
    if (head != sel.head || anchor != sel.anchor)
      newSel = EditorSelection.single(anchor, head);
  }
  if (!change && !newSel)
    return;
  if (!change && typeOver && !sel.empty && newSel && newSel.main.empty)
    change = { from: sel.from, to: sel.to, insert: view.state.doc.slice(sel.from, sel.to) };
  else if (change && change.from >= sel.from && change.to <= sel.to && (change.from != sel.from || change.to != sel.to) && sel.to - sel.from - (change.to - change.from) <= 4)
    change = {
      from: sel.from,
      to: sel.to,
      insert: view.state.doc.slice(sel.from, change.from).append(change.insert).append(view.state.doc.slice(change.to, sel.to))
    };
  if (change) {
    let startState = view.state;
    if (browser.android && (change.from == sel.from && change.to == sel.to && change.insert.length == 1 && change.insert.lines == 2 && dispatchKey(view.contentDOM, "Enter", 13) || change.from == sel.from - 1 && change.to == sel.to && change.insert.length == 0 && dispatchKey(view.contentDOM, "Backspace", 8) || change.from == sel.from && change.to == sel.to + 1 && change.insert.length == 0 && dispatchKey(view.contentDOM, "Delete", 46)) || browser.ios && view.inputState.flushIOSKey(view))
      return;
    let text = change.insert.toString();
    if (view.state.facet(inputHandler).some((h) => h(view, change.from, change.to, text)))
      return;
    if (view.inputState.composing >= 0)
      view.inputState.composing++;
    let tr;
    if (change.from >= sel.from && change.to <= sel.to && change.to - change.from >= (sel.to - sel.from) / 3 && (!newSel || newSel.main.empty && newSel.main.from == change.from + change.insert.length)) {
      let before = sel.from < change.from ? startState.sliceDoc(sel.from, change.from) : "";
      let after = sel.to > change.to ? startState.sliceDoc(change.to, sel.to) : "";
      tr = startState.replaceSelection(view.state.toText(before + change.insert.sliceString(0, void 0, view.state.lineBreak) + after));
    } else {
      let changes = startState.changes(change);
      tr = {
        changes,
        selection: newSel && !startState.selection.main.eq(newSel.main) && newSel.main.to <= changes.newLength ? startState.selection.replaceRange(newSel.main) : void 0
      };
    }
    let userEvent = "input.type";
    if (view.composing) {
      userEvent += ".compose";
      if (view.inputState.compositionFirstChange) {
        userEvent += ".start";
        view.inputState.compositionFirstChange = false;
      }
    }
    view.dispatch(tr, { scrollIntoView: true, userEvent });
  } else if (newSel && !newSel.main.eq(sel)) {
    let scrollIntoView2 = false, userEvent = "select";
    if (view.inputState.lastSelectionTime > Date.now() - 50) {
      if (view.inputState.lastSelectionOrigin == "select")
        scrollIntoView2 = true;
      userEvent = view.inputState.lastSelectionOrigin;
    }
    view.dispatch({ selection: newSel, scrollIntoView: scrollIntoView2, userEvent });
  }
}
function findDiff(a, b, preferredPos, preferredSide) {
  let minLen = Math.min(a.length, b.length);
  let from = 0;
  while (from < minLen && a.charCodeAt(from) == b.charCodeAt(from))
    from++;
  if (from == minLen && a.length == b.length)
    return null;
  let toA = a.length, toB = b.length;
  while (toA > 0 && toB > 0 && a.charCodeAt(toA - 1) == b.charCodeAt(toB - 1)) {
    toA--;
    toB--;
  }
  if (preferredSide == "end") {
    let adjust = Math.max(0, from - Math.min(toA, toB));
    preferredPos -= toA + adjust - from;
  }
  if (toA < from && a.length < b.length) {
    let move = preferredPos <= from && preferredPos >= toA ? from - preferredPos : 0;
    from -= move;
    toB = from + (toB - toA);
    toA = from;
  } else if (toB < from) {
    let move = preferredPos <= from && preferredPos >= toB ? from - preferredPos : 0;
    from -= move;
    toA = from + (toA - toB);
    toB = from;
  }
  return { from, toA, toB };
}
var DOMReader = class {
  constructor(points, view) {
    this.points = points;
    this.view = view;
    this.text = "";
    this.lineBreak = view.state.lineBreak;
  }
  readRange(start, end) {
    if (!start)
      return;
    let parent = start.parentNode;
    for (let cur2 = start; ; ) {
      this.findPointBefore(parent, cur2);
      this.readNode(cur2);
      let next = cur2.nextSibling;
      if (next == end)
        break;
      let view = ContentView.get(cur2), nextView = ContentView.get(next);
      if ((view ? view.breakAfter : isBlockElement(cur2)) || (nextView ? nextView.breakAfter : isBlockElement(next)) && !(cur2.nodeName == "BR" && !cur2.cmIgnore))
        this.text += this.lineBreak;
      cur2 = next;
    }
    this.findPointBefore(parent, end);
  }
  readNode(node) {
    if (node.cmIgnore)
      return;
    let view = ContentView.get(node);
    let fromView = view && view.overrideDOMText;
    let text;
    if (fromView != null)
      text = fromView.sliceString(0, void 0, this.lineBreak);
    else if (node.nodeType == 3)
      text = node.nodeValue;
    else if (node.nodeName == "BR")
      text = node.nextSibling ? this.lineBreak : "";
    else if (node.nodeType == 1)
      this.readRange(node.firstChild, null);
    if (text != null) {
      this.findPointIn(node, text.length);
      this.text += text;
      if (browser.chrome && this.view.inputState.lastKeyCode == 13 && !node.nextSibling && /\n\n$/.test(this.text))
        this.text = this.text.slice(0, -1);
    }
  }
  findPointBefore(node, next) {
    for (let point of this.points)
      if (point.node == node && node.childNodes[point.offset] == next)
        point.pos = this.text.length;
  }
  findPointIn(node, maxLen) {
    for (let point of this.points)
      if (point.node == node)
        point.pos = this.text.length + Math.min(point.offset, maxLen);
  }
};
function isBlockElement(node) {
  return node.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(node.nodeName);
}
var DOMPoint = class {
  constructor(node, offset) {
    this.node = node;
    this.offset = offset;
    this.pos = -1;
  }
};
function selectionPoints(view) {
  let result = [];
  if (view.root.activeElement != view.contentDOM)
    return result;
  let { anchorNode, anchorOffset, focusNode, focusOffset } = view.observer.selectionRange;
  if (anchorNode) {
    result.push(new DOMPoint(anchorNode, anchorOffset));
    if (focusNode != anchorNode || focusOffset != anchorOffset)
      result.push(new DOMPoint(focusNode, focusOffset));
  }
  return result;
}
function selectionFromPoints(points, base2) {
  if (points.length == 0)
    return null;
  let anchor = points[0].pos, head = points.length == 2 ? points[1].pos : anchor;
  return anchor > -1 && head > -1 ? EditorSelection.single(anchor + base2, head + base2) : null;
}
var EditorView = class {
  constructor(config2 = {}) {
    this.plugins = [];
    this.editorAttrs = {};
    this.contentAttrs = {};
    this.bidiCache = [];
    this.updateState = 2;
    this.measureScheduled = -1;
    this.measureRequests = [];
    this.contentDOM = document.createElement("div");
    this.scrollDOM = document.createElement("div");
    this.scrollDOM.tabIndex = -1;
    this.scrollDOM.className = "cm-scroller";
    this.scrollDOM.appendChild(this.contentDOM);
    this.announceDOM = document.createElement("div");
    this.announceDOM.style.cssText = "position: absolute; top: -10000px";
    this.announceDOM.setAttribute("aria-live", "polite");
    this.dom = document.createElement("div");
    this.dom.appendChild(this.announceDOM);
    this.dom.appendChild(this.scrollDOM);
    this._dispatch = config2.dispatch || ((tr) => this.update([tr]));
    this.dispatch = this.dispatch.bind(this);
    this.root = config2.root || document;
    this.viewState = new ViewState(config2.state || EditorState.create());
    this.plugins = this.state.facet(viewPlugin).map((spec) => new PluginInstance(spec).update(this));
    this.observer = new DOMObserver(this, (from, to, typeOver) => {
      applyDOMChange(this, from, to, typeOver);
    }, (event) => {
      this.inputState.runScrollHandlers(this, event);
      if (this.observer.intersecting)
        this.measure();
    });
    this.inputState = new InputState(this);
    this.docView = new DocView(this);
    this.mountStyles();
    this.updateAttrs();
    this.updateState = 0;
    ensureGlobalHandler();
    this.requestMeasure();
    if (config2.parent)
      config2.parent.appendChild(this.dom);
  }
  get state() {
    return this.viewState.state;
  }
  get viewport() {
    return this.viewState.viewport;
  }
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  get inView() {
    return this.viewState.inView;
  }
  get composing() {
    return this.inputState.composing > 0;
  }
  dispatch(...input) {
    this._dispatch(input.length == 1 && input[0] instanceof Transaction ? input[0] : this.state.update(...input));
  }
  update(transactions) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let redrawn = false, update;
    let state = this.state;
    for (let tr of transactions) {
      if (tr.startState != state)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      state = tr.state;
    }
    if (state.facet(EditorState.phrases) != this.state.facet(EditorState.phrases))
      return this.setState(state);
    update = new ViewUpdate(this, state, transactions);
    let scrollPos = null;
    try {
      this.updateState = 2;
      for (let tr of transactions) {
        if (scrollPos)
          scrollPos = scrollPos.map(tr.changes);
        if (tr.scrollIntoView) {
          let { main } = tr.state.selection;
          scrollPos = main.empty ? main : EditorSelection.cursor(main.head, main.head > main.anchor ? -1 : 1);
        }
        for (let e of tr.effects)
          if (e.is(scrollTo))
            scrollPos = e.value;
      }
      this.viewState.update(update, scrollPos);
      this.bidiCache = CachedOrder.update(this.bidiCache, update.changes);
      if (!update.empty) {
        this.updatePlugins(update);
        this.inputState.update(update);
      }
      redrawn = this.docView.update(update);
      if (this.state.facet(styleModule) != this.styleModules)
        this.mountStyles();
      this.updateAttrs();
      this.showAnnouncements(transactions);
    } finally {
      this.updateState = 0;
    }
    if (redrawn || scrollPos || this.viewState.mustEnforceCursorAssoc)
      this.requestMeasure();
    if (!update.empty)
      for (let listener of this.state.facet(updateListener))
        listener(update);
  }
  setState(newState) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    this.updateState = 2;
    try {
      for (let plugin of this.plugins)
        plugin.destroy(this);
      this.viewState = new ViewState(newState);
      this.plugins = newState.facet(viewPlugin).map((spec) => new PluginInstance(spec).update(this));
      this.docView = new DocView(this);
      this.inputState.ensureHandlers(this);
      this.mountStyles();
      this.updateAttrs();
      this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    this.requestMeasure();
  }
  updatePlugins(update) {
    let prevSpecs = update.startState.facet(viewPlugin), specs = update.state.facet(viewPlugin);
    if (prevSpecs != specs) {
      let newPlugins = [];
      for (let spec of specs) {
        let found = prevSpecs.indexOf(spec);
        if (found < 0) {
          newPlugins.push(new PluginInstance(spec));
        } else {
          let plugin = this.plugins[found];
          plugin.mustUpdate = update;
          newPlugins.push(plugin);
        }
      }
      for (let plugin of this.plugins)
        if (plugin.mustUpdate != update)
          plugin.destroy(this);
      this.plugins = newPlugins;
      this.inputState.ensureHandlers(this);
    } else {
      for (let p of this.plugins)
        p.mustUpdate = update;
    }
    for (let i = 0; i < this.plugins.length; i++)
      this.plugins[i] = this.plugins[i].update(this);
  }
  measure(flush = true) {
    if (this.measureScheduled > -1)
      cancelAnimationFrame(this.measureScheduled);
    this.measureScheduled = -1;
    if (flush)
      this.observer.flush();
    let updated = null;
    try {
      for (let i = 0; ; i++) {
        this.updateState = 1;
        let changed = this.viewState.measure(this.docView, i > 0);
        let measuring = this.measureRequests;
        if (!changed && !measuring.length && this.viewState.scrollTo == null)
          break;
        this.measureRequests = [];
        if (i > 5) {
          console.warn("Viewport failed to stabilize");
          break;
        }
        let measured = measuring.map((m) => {
          try {
            return m.read(this);
          } catch (e) {
            logException(this.state, e);
            return BadMeasure;
          }
        });
        let update = new ViewUpdate(this, this.state);
        update.flags |= changed;
        if (!updated)
          updated = update;
        else
          updated.flags |= changed;
        this.updateState = 2;
        if (!update.empty) {
          this.updatePlugins(update);
          this.inputState.update(update);
        }
        this.updateAttrs();
        if (changed)
          this.docView.update(update);
        for (let i2 = 0; i2 < measuring.length; i2++)
          if (measured[i2] != BadMeasure) {
            try {
              measuring[i2].write(measured[i2], this);
            } catch (e) {
              logException(this.state, e);
            }
          }
        if (this.viewState.scrollTo) {
          this.docView.scrollRangeIntoView(this.viewState.scrollTo);
          this.viewState.scrollTo = null;
        }
        if (!(changed & 4) && this.measureRequests.length == 0)
          break;
      }
    } finally {
      this.updateState = 0;
    }
    this.measureScheduled = -1;
    if (updated && !updated.empty)
      for (let listener of this.state.facet(updateListener))
        listener(updated);
  }
  get themeClasses() {
    return baseThemeID + " " + (this.state.facet(darkTheme) ? baseDarkID : baseLightID) + " " + this.state.facet(theme);
  }
  updateAttrs() {
    let editorAttrs = combineAttrs(this.state.facet(editorAttributes), {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    });
    updateAttrs(this.dom, this.editorAttrs, editorAttrs);
    this.editorAttrs = editorAttrs;
    let contentAttrs = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      contenteditable: !this.state.facet(editable) ? "false" : contentEditablePlainTextSupported() ? "plaintext-only" : "true",
      class: "cm-content",
      style: `${browser.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    if (this.state.readOnly)
      contentAttrs["aria-readonly"] = "true";
    combineAttrs(this.state.facet(contentAttributes), contentAttrs);
    updateAttrs(this.contentDOM, this.contentAttrs, contentAttrs);
    this.contentAttrs = contentAttrs;
  }
  showAnnouncements(trs) {
    let first = true;
    for (let tr of trs)
      for (let effect of tr.effects)
        if (effect.is(EditorView.announce)) {
          if (first)
            this.announceDOM.textContent = "";
          first = false;
          let div = this.announceDOM.appendChild(document.createElement("div"));
          div.textContent = effect.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(styleModule);
    StyleModule.mount(this.root, this.styleModules.concat(baseTheme).reverse());
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    if (this.updateState == 0 && this.measureScheduled > -1)
      this.measure(false);
  }
  requestMeasure(request) {
    if (this.measureScheduled < 0)
      this.measureScheduled = requestAnimationFrame(() => this.measure());
    if (request) {
      if (request.key != null)
        for (let i = 0; i < this.measureRequests.length; i++) {
          if (this.measureRequests[i].key === request.key) {
            this.measureRequests[i] = request;
            return;
          }
        }
      this.measureRequests.push(request);
    }
  }
  pluginField(field) {
    let result = [];
    for (let plugin of this.plugins)
      plugin.update(this).takeField(field, result);
    return result;
  }
  plugin(plugin) {
    for (let inst of this.plugins)
      if (inst.spec == plugin)
        return inst.update(this).value;
    return null;
  }
  blockAtHeight(height, docTop) {
    this.readMeasured();
    return this.viewState.blockAtHeight(height, ensureTop(docTop, this.contentDOM));
  }
  visualLineAtHeight(height, docTop) {
    this.readMeasured();
    return this.viewState.lineAtHeight(height, ensureTop(docTop, this.contentDOM));
  }
  viewportLines(f, docTop) {
    let { from, to } = this.viewport;
    this.viewState.forEachLine(from, to, f, ensureTop(docTop, this.contentDOM));
  }
  visualLineAt(pos, docTop = 0) {
    return this.viewState.lineAt(pos, docTop);
  }
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  moveByChar(start, forward, by) {
    return skipAtoms(this, start, moveByChar(this, start, forward, by));
  }
  moveByGroup(start, forward) {
    return skipAtoms(this, start, moveByChar(this, start, forward, (initial) => byGroup(this, start.head, initial)));
  }
  moveToLineBoundary(start, forward, includeWrap = true) {
    return moveToLineBoundary(this, start, forward, includeWrap);
  }
  moveVertically(start, forward, distance) {
    return skipAtoms(this, start, moveVertically(this, start, forward, distance));
  }
  scrollPosIntoView(pos) {
    this.viewState.scrollTo = EditorSelection.cursor(pos);
    this.requestMeasure();
  }
  domAtPos(pos) {
    return this.docView.domAtPos(pos);
  }
  posAtDOM(node, offset = 0) {
    return this.docView.posFromDOM(node, offset);
  }
  posAtCoords(coords, precise = true) {
    this.readMeasured();
    return posAtCoords(this, coords, precise);
  }
  coordsAtPos(pos, side = 1) {
    this.readMeasured();
    let rect = this.docView.coordsAt(pos, side);
    if (!rect || rect.left == rect.right)
      return rect;
    let line = this.state.doc.lineAt(pos), order = this.bidiSpans(line);
    let span = order[BidiSpan.find(order, pos - line.from, -1, side)];
    return flattenRect(rect, span.dir == Direction.LTR == side > 0);
  }
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  get textDirection() {
    return this.viewState.heightOracle.direction;
  }
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  bidiSpans(line) {
    if (line.length > MaxBidiLine)
      return trivialOrder(line.length);
    let dir = this.textDirection;
    for (let entry of this.bidiCache)
      if (entry.from == line.from && entry.dir == dir)
        return entry.order;
    let order = computeOrder(line.text, this.textDirection);
    this.bidiCache.push(new CachedOrder(line.from, line.to, dir, order));
    return order;
  }
  get hasFocus() {
    var _a;
    return (document.hasFocus() || browser.safari && ((_a = this.inputState) === null || _a === void 0 ? void 0 : _a.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  focus() {
    this.observer.ignore(() => {
      focusPreventScroll(this.contentDOM);
      this.docView.updateSelection();
    });
  }
  destroy() {
    for (let plugin of this.plugins)
      plugin.destroy(this);
    this.inputState.destroy();
    this.dom.remove();
    this.observer.destroy();
    if (this.measureScheduled > -1)
      cancelAnimationFrame(this.measureScheduled);
  }
  static domEventHandlers(handlers2) {
    return ViewPlugin.define(() => ({}), { eventHandlers: handlers2 });
  }
  static theme(spec, options) {
    let prefix = StyleModule.newName();
    let result = [theme.of(prefix), styleModule.of(buildTheme(`.${prefix}`, spec))];
    if (options && options.dark)
      result.push(darkTheme.of(true));
    return result;
  }
  static baseTheme(spec) {
    return Prec.fallback(styleModule.of(buildTheme("." + baseThemeID, spec, lightDarkIDs)));
  }
};
EditorView.scrollTo = scrollTo;
EditorView.styleModule = styleModule;
EditorView.inputHandler = inputHandler;
EditorView.exceptionSink = exceptionSink;
EditorView.updateListener = updateListener;
EditorView.editable = editable;
EditorView.mouseSelectionStyle = mouseSelectionStyle;
EditorView.dragMovesSelection = dragMovesSelection$1;
EditorView.clickAddsSelectionRange = clickAddsSelectionRange;
EditorView.decorations = decorations;
EditorView.contentAttributes = contentAttributes;
EditorView.editorAttributes = editorAttributes;
EditorView.lineWrapping = /* @__PURE__ */ EditorView.contentAttributes.of({ "class": "cm-lineWrapping" });
EditorView.announce = /* @__PURE__ */ StateEffect.define();
var MaxBidiLine = 4096;
function ensureTop(given, dom) {
  return given == null ? dom.getBoundingClientRect().top : given;
}
var resizeDebounce = -1;
function ensureGlobalHandler() {
  window.addEventListener("resize", () => {
    if (resizeDebounce == -1)
      resizeDebounce = setTimeout(handleResize, 50);
  });
}
function handleResize() {
  resizeDebounce = -1;
  let found = document.querySelectorAll(".cm-content");
  for (let i = 0; i < found.length; i++) {
    let docView = ContentView.get(found[i]);
    if (docView)
      docView.editorView.requestMeasure();
  }
}
var BadMeasure = {};
var CachedOrder = class {
  constructor(from, to, dir, order) {
    this.from = from;
    this.to = to;
    this.dir = dir;
    this.order = order;
  }
  static update(cache, changes) {
    if (changes.empty)
      return cache;
    let result = [], lastDir = cache.length ? cache[cache.length - 1].dir : Direction.LTR;
    for (let i = Math.max(0, cache.length - 10); i < cache.length; i++) {
      let entry = cache[i];
      if (entry.dir == lastDir && !changes.touchesRange(entry.from, entry.to))
        result.push(new CachedOrder(changes.mapPos(entry.from, 1), changes.mapPos(entry.to, -1), entry.dir, entry.order));
    }
    return result;
  }
};
var currentPlatform = typeof navigator == "undefined" ? "key" : /* @__PURE__ */ /Mac/.test(navigator.platform) ? "mac" : /* @__PURE__ */ /Win/.test(navigator.platform) ? "win" : /* @__PURE__ */ /Linux|X11/.test(navigator.platform) ? "linux" : "key";
function normalizeKeyName(name2, platform) {
  const parts = name2.split(/-(?!$)/);
  let result = parts[parts.length - 1];
  if (result == "Space")
    result = " ";
  let alt, ctrl, shift2, meta2;
  for (let i = 0; i < parts.length - 1; ++i) {
    const mod = parts[i];
    if (/^(cmd|meta|m)$/i.test(mod))
      meta2 = true;
    else if (/^a(lt)?$/i.test(mod))
      alt = true;
    else if (/^(c|ctrl|control)$/i.test(mod))
      ctrl = true;
    else if (/^s(hift)?$/i.test(mod))
      shift2 = true;
    else if (/^mod$/i.test(mod)) {
      if (platform == "mac")
        meta2 = true;
      else
        ctrl = true;
    } else
      throw new Error("Unrecognized modifier name: " + mod);
  }
  if (alt)
    result = "Alt-" + result;
  if (ctrl)
    result = "Ctrl-" + result;
  if (meta2)
    result = "Meta-" + result;
  if (shift2)
    result = "Shift-" + result;
  return result;
}
function modifiers(name2, event, shift2) {
  if (event.altKey)
    name2 = "Alt-" + name2;
  if (event.ctrlKey)
    name2 = "Ctrl-" + name2;
  if (event.metaKey)
    name2 = "Meta-" + name2;
  if (shift2 !== false && event.shiftKey)
    name2 = "Shift-" + name2;
  return name2;
}
var handleKeyEvents = /* @__PURE__ */ EditorView.domEventHandlers({
  keydown(event, view) {
    return runHandlers(getKeymap(view.state), event, view, "editor");
  }
});
var keymap = /* @__PURE__ */ Facet.define({ enables: handleKeyEvents });
var Keymaps = /* @__PURE__ */ new WeakMap();
function getKeymap(state) {
  let bindings = state.facet(keymap);
  let map = Keymaps.get(bindings);
  if (!map)
    Keymaps.set(bindings, map = buildKeymap(bindings.reduce((a, b) => a.concat(b), [])));
  return map;
}
function runScopeHandlers(view, event, scope) {
  return runHandlers(getKeymap(view.state), event, view, scope);
}
var storedPrefix = null;
var PrefixTimeout = 4e3;
function buildKeymap(bindings, platform = currentPlatform) {
  let bound = Object.create(null);
  let isPrefix = Object.create(null);
  let checkPrefix = (name2, is) => {
    let current = isPrefix[name2];
    if (current == null)
      isPrefix[name2] = is;
    else if (current != is)
      throw new Error("Key binding " + name2 + " is used both as a regular binding and as a multi-stroke prefix");
  };
  let add2 = (scope, key, command2, preventDefault) => {
    let scopeObj = bound[scope] || (bound[scope] = Object.create(null));
    let parts = key.split(/ (?!$)/).map((k) => normalizeKeyName(k, platform));
    for (let i = 1; i < parts.length; i++) {
      let prefix = parts.slice(0, i).join(" ");
      checkPrefix(prefix, true);
      if (!scopeObj[prefix])
        scopeObj[prefix] = {
          preventDefault: true,
          commands: [(view) => {
            let ourObj = storedPrefix = { view, prefix, scope };
            setTimeout(() => {
              if (storedPrefix == ourObj)
                storedPrefix = null;
            }, PrefixTimeout);
            return true;
          }]
        };
    }
    let full = parts.join(" ");
    checkPrefix(full, false);
    let binding = scopeObj[full] || (scopeObj[full] = { preventDefault: false, commands: [] });
    binding.commands.push(command2);
    if (preventDefault)
      binding.preventDefault = true;
  };
  for (let b of bindings) {
    let name2 = b[platform] || b.key;
    if (!name2)
      continue;
    for (let scope of b.scope ? b.scope.split(" ") : ["editor"]) {
      add2(scope, name2, b.run, b.preventDefault);
      if (b.shift)
        add2(scope, "Shift-" + name2, b.shift, b.preventDefault);
    }
  }
  return bound;
}
function runHandlers(map, event, view, scope) {
  let name2 = keyName(event), isChar = name2.length == 1 && name2 != " ";
  let prefix = "", fallthrough = false;
  if (storedPrefix && storedPrefix.view == view && storedPrefix.scope == scope) {
    prefix = storedPrefix.prefix + " ";
    if (fallthrough = modifierCodes.indexOf(event.keyCode) < 0)
      storedPrefix = null;
  }
  let runFor = (binding) => {
    if (binding) {
      for (let cmd2 of binding.commands)
        if (cmd2(view))
          return true;
      if (binding.preventDefault)
        fallthrough = true;
    }
    return false;
  };
  let scopeObj = map[scope], baseName;
  if (scopeObj) {
    if (runFor(scopeObj[prefix + modifiers(name2, event, !isChar)]))
      return true;
    if (isChar && (event.shiftKey || event.altKey || event.metaKey) && (baseName = base[event.keyCode]) && baseName != name2) {
      if (runFor(scopeObj[prefix + modifiers(baseName, event, true)]))
        return true;
    } else if (isChar && event.shiftKey) {
      if (runFor(scopeObj[prefix + modifiers(name2, event, true)]))
        return true;
    }
  }
  return fallthrough;
}
var CanHidePrimary = !browser.ios;
var selectionConfig = /* @__PURE__ */ Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      cursorBlinkRate: 1200,
      drawRangeCursor: true
    }, {
      cursorBlinkRate: (a, b) => Math.min(a, b),
      drawRangeCursor: (a, b) => a || b
    });
  }
});
function drawSelection(config2 = {}) {
  return [
    selectionConfig.of(config2),
    drawSelectionPlugin,
    hideNativeSelection
  ];
}
var Piece = class {
  constructor(left, top2, width, height, className) {
    this.left = left;
    this.top = top2;
    this.width = width;
    this.height = height;
    this.className = className;
  }
  draw() {
    let elt = document.createElement("div");
    elt.className = this.className;
    this.adjust(elt);
    return elt;
  }
  adjust(elt) {
    elt.style.left = this.left + "px";
    elt.style.top = this.top + "px";
    if (this.width >= 0)
      elt.style.width = this.width + "px";
    elt.style.height = this.height + "px";
  }
  eq(p) {
    return this.left == p.left && this.top == p.top && this.width == p.width && this.height == p.height && this.className == p.className;
  }
};
var drawSelectionPlugin = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.rangePieces = [];
    this.cursors = [];
    this.measureReq = { read: this.readPos.bind(this), write: this.drawSel.bind(this) };
    this.selectionLayer = view.scrollDOM.appendChild(document.createElement("div"));
    this.selectionLayer.className = "cm-selectionLayer";
    this.selectionLayer.setAttribute("aria-hidden", "true");
    this.cursorLayer = view.scrollDOM.appendChild(document.createElement("div"));
    this.cursorLayer.className = "cm-cursorLayer";
    this.cursorLayer.setAttribute("aria-hidden", "true");
    view.requestMeasure(this.measureReq);
    this.setBlinkRate();
  }
  setBlinkRate() {
    this.cursorLayer.style.animationDuration = this.view.state.facet(selectionConfig).cursorBlinkRate + "ms";
  }
  update(update) {
    let confChanged = update.startState.facet(selectionConfig) != update.state.facet(selectionConfig);
    if (confChanged || update.selectionSet || update.geometryChanged || update.viewportChanged)
      this.view.requestMeasure(this.measureReq);
    if (update.transactions.some((tr) => tr.scrollIntoView))
      this.cursorLayer.style.animationName = this.cursorLayer.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink";
    if (confChanged)
      this.setBlinkRate();
  }
  readPos() {
    let { state } = this.view, conf = state.facet(selectionConfig);
    let rangePieces = state.selection.ranges.map((r) => r.empty ? [] : measureRange(this.view, r)).reduce((a, b) => a.concat(b));
    let cursors = [];
    for (let r of state.selection.ranges) {
      let prim = r == state.selection.main;
      if (r.empty ? !prim || CanHidePrimary : conf.drawRangeCursor) {
        let piece = measureCursor(this.view, r, prim);
        if (piece)
          cursors.push(piece);
      }
    }
    return { rangePieces, cursors };
  }
  drawSel({ rangePieces, cursors }) {
    if (rangePieces.length != this.rangePieces.length || rangePieces.some((p, i) => !p.eq(this.rangePieces[i]))) {
      this.selectionLayer.textContent = "";
      for (let p of rangePieces)
        this.selectionLayer.appendChild(p.draw());
      this.rangePieces = rangePieces;
    }
    if (cursors.length != this.cursors.length || cursors.some((c, i) => !c.eq(this.cursors[i]))) {
      let oldCursors = this.cursorLayer.children;
      if (oldCursors.length !== cursors.length) {
        this.cursorLayer.textContent = "";
        for (const c of cursors)
          this.cursorLayer.appendChild(c.draw());
      } else {
        cursors.forEach((c, idx) => c.adjust(oldCursors[idx]));
      }
      this.cursors = cursors;
    }
  }
  destroy() {
    this.selectionLayer.remove();
    this.cursorLayer.remove();
  }
});
var themeSpec = {
  ".cm-line": {
    "& ::selection": { backgroundColor: "transparent !important" },
    "&::selection": { backgroundColor: "transparent !important" }
  }
};
if (CanHidePrimary)
  themeSpec[".cm-line"].caretColor = "transparent !important";
var hideNativeSelection = /* @__PURE__ */ Prec.override(/* @__PURE__ */ EditorView.theme(themeSpec));
function getBase(view) {
  let rect = view.scrollDOM.getBoundingClientRect();
  let left = view.textDirection == Direction.LTR ? rect.left : rect.right - view.scrollDOM.clientWidth;
  return { left: left - view.scrollDOM.scrollLeft, top: rect.top - view.scrollDOM.scrollTop };
}
function wrappedLine(view, pos, inside2) {
  let range = EditorSelection.cursor(pos);
  return {
    from: Math.max(inside2.from, view.moveToLineBoundary(range, false, true).from),
    to: Math.min(inside2.to, view.moveToLineBoundary(range, true, true).from),
    type: BlockType.Text
  };
}
function blockAt(view, pos) {
  let line = view.visualLineAt(pos);
  if (Array.isArray(line.type))
    for (let l of line.type) {
      if (l.to > pos || l.to == pos && (l.to == line.to || l.type == BlockType.Text))
        return l;
    }
  return line;
}
function measureRange(view, range) {
  if (range.to <= view.viewport.from || range.from >= view.viewport.to)
    return [];
  let from = Math.max(range.from, view.viewport.from), to = Math.min(range.to, view.viewport.to);
  let ltr = view.textDirection == Direction.LTR;
  let content2 = view.contentDOM, contentRect = content2.getBoundingClientRect(), base2 = getBase(view);
  let lineStyle = window.getComputedStyle(content2.firstChild);
  let leftSide = contentRect.left + parseInt(lineStyle.paddingLeft);
  let rightSide = contentRect.right - parseInt(lineStyle.paddingRight);
  let startBlock = blockAt(view, from), endBlock = blockAt(view, to);
  let visualStart = startBlock.type == BlockType.Text ? startBlock : null;
  let visualEnd = endBlock.type == BlockType.Text ? endBlock : null;
  if (view.lineWrapping) {
    if (visualStart)
      visualStart = wrappedLine(view, from, visualStart);
    if (visualEnd)
      visualEnd = wrappedLine(view, to, visualEnd);
  }
  if (visualStart && visualEnd && visualStart.from == visualEnd.from) {
    return pieces(drawForLine(range.from, range.to, visualStart));
  } else {
    let top2 = visualStart ? drawForLine(range.from, null, visualStart) : drawForWidget(startBlock, false);
    let bottom = visualEnd ? drawForLine(null, range.to, visualEnd) : drawForWidget(endBlock, true);
    let between = [];
    if ((visualStart || startBlock).to < (visualEnd || endBlock).from - 1)
      between.push(piece(leftSide, top2.bottom, rightSide, bottom.top));
    else if (top2.bottom < bottom.top && blockAt(view, (top2.bottom + bottom.top) / 2).type == BlockType.Text)
      top2.bottom = bottom.top = (top2.bottom + bottom.top) / 2;
    return pieces(top2).concat(between).concat(pieces(bottom));
  }
  function piece(left, top2, right, bottom) {
    return new Piece(left - base2.left, top2 - base2.top, right - left, bottom - top2, "cm-selectionBackground");
  }
  function pieces({ top: top2, bottom, horizontal }) {
    let pieces2 = [];
    for (let i = 0; i < horizontal.length; i += 2)
      pieces2.push(piece(horizontal[i], top2, horizontal[i + 1], bottom));
    return pieces2;
  }
  function drawForLine(from2, to2, line) {
    let top2 = 1e9, bottom = -1e9, horizontal = [];
    function addSpan(from3, fromOpen, to3, toOpen, dir) {
      let fromCoords = view.coordsAtPos(from3, from3 == line.to ? -2 : 2);
      let toCoords = view.coordsAtPos(to3, to3 == line.from ? 2 : -2);
      top2 = Math.min(fromCoords.top, toCoords.top, top2);
      bottom = Math.max(fromCoords.bottom, toCoords.bottom, bottom);
      if (dir == Direction.LTR)
        horizontal.push(ltr && fromOpen ? leftSide : fromCoords.left, ltr && toOpen ? rightSide : toCoords.right);
      else
        horizontal.push(!ltr && toOpen ? leftSide : toCoords.left, !ltr && fromOpen ? rightSide : fromCoords.right);
    }
    let start = from2 !== null && from2 !== void 0 ? from2 : line.from, end = to2 !== null && to2 !== void 0 ? to2 : line.to;
    for (let r of view.visibleRanges)
      if (r.to > start && r.from < end) {
        for (let pos = Math.max(r.from, start), endPos = Math.min(r.to, end); ; ) {
          let docLine = view.state.doc.lineAt(pos);
          for (let span of view.bidiSpans(docLine)) {
            let spanFrom = span.from + docLine.from, spanTo = span.to + docLine.from;
            if (spanFrom >= endPos)
              break;
            if (spanTo > pos)
              addSpan(Math.max(spanFrom, pos), from2 == null && spanFrom <= start, Math.min(spanTo, endPos), to2 == null && spanTo >= end, span.dir);
          }
          pos = docLine.to + 1;
          if (pos >= endPos)
            break;
        }
      }
    if (horizontal.length == 0)
      addSpan(start, from2 == null, end, to2 == null, view.textDirection);
    return { top: top2, bottom, horizontal };
  }
  function drawForWidget(block, top2) {
    let y = contentRect.top + (top2 ? block.top : block.bottom);
    return { top: y, bottom: y, horizontal: [] };
  }
}
function measureCursor(view, cursor, primary) {
  let pos = view.coordsAtPos(cursor.head, cursor.assoc || 1);
  if (!pos)
    return null;
  let base2 = getBase(view);
  return new Piece(pos.left - base2.left, pos.top - base2.top, -1, pos.bottom - pos.top, primary ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary");
}
function iterMatches(doc2, re, from, to, f) {
  re.lastIndex = 0;
  for (let cursor = doc2.iterRange(from, to), pos = from, m; !cursor.next().done; pos += cursor.value.length) {
    if (!cursor.lineBreak)
      while (m = re.exec(cursor.value))
        f(pos + m.index, pos + m.index + m[0].length, m);
  }
}
var MatchDecorator = class {
  constructor(config2) {
    let { regexp, decoration, boundary } = config2;
    if (!regexp.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    this.regexp = regexp;
    this.getDeco = typeof decoration == "function" ? decoration : () => decoration;
    this.boundary = boundary;
  }
  createDeco(view) {
    let build = new RangeSetBuilder();
    for (let { from, to } of view.visibleRanges)
      iterMatches(view.state.doc, this.regexp, from, to, (a, b, m) => build.add(a, b, this.getDeco(m, view, a)));
    return build.finish();
  }
  updateDeco(update, deco) {
    let changeFrom = 1e9, changeTo = -1;
    if (update.docChanged)
      update.changes.iterChanges((_f, _t, from, to) => {
        if (to > update.view.viewport.from && from < update.view.viewport.to) {
          changeFrom = Math.min(from, changeFrom);
          changeTo = Math.max(to, changeTo);
        }
      });
    if (update.viewportChanged || changeTo - changeFrom > 1e3)
      return this.createDeco(update.view);
    if (changeTo > -1)
      return this.updateRange(update.view, deco.map(update.changes), changeFrom, changeTo);
    return deco;
  }
  updateRange(view, deco, updateFrom, updateTo) {
    for (let r of view.visibleRanges) {
      let from = Math.max(r.from, updateFrom), to = Math.min(r.to, updateTo);
      if (to > from) {
        let fromLine = view.state.doc.lineAt(from), toLine = fromLine.to < to ? view.state.doc.lineAt(to) : fromLine;
        let start = Math.max(r.from, fromLine.from), end = Math.min(r.to, toLine.to);
        if (this.boundary) {
          for (; from > fromLine.from; from--)
            if (this.boundary.test(fromLine.text[from - 1 - fromLine.from])) {
              start = from;
              break;
            }
          for (; to < toLine.to; to++)
            if (this.boundary.test(toLine.text[to - toLine.from])) {
              end = to;
              break;
            }
        }
        let ranges = [], m;
        if (fromLine == toLine) {
          this.regexp.lastIndex = start - fromLine.from;
          while ((m = this.regexp.exec(fromLine.text)) && m.index < end - fromLine.from) {
            let pos = m.index + fromLine.from;
            ranges.push(this.getDeco(m, view, pos).range(pos, pos + m[0].length));
          }
        } else {
          iterMatches(view.state.doc, this.regexp, start, end, (from2, to2, m2) => ranges.push(this.getDeco(m2, view, from2).range(from2, to2)));
        }
        deco = deco.update({ filterFrom: start, filterTo: end, filter: (from2, to2) => from2 < start || to2 > end, add: ranges });
      }
    }
    return deco;
  }
};
var UnicodeRegexpSupport = /x/.unicode != null ? "gu" : "g";
var Specials = /* @__PURE__ */ new RegExp("[\0-\b\n-\x7F-\x9F\xAD\u061C\u200B\u200E\u200F\u2028\u2029\uFEFF\uFFF9-\uFFFC]", UnicodeRegexpSupport);
var Names = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
var _supportsTabSize = null;
function supportsTabSize() {
  var _a;
  if (_supportsTabSize == null && typeof document != "undefined" && document.body) {
    let styles = document.body.style;
    _supportsTabSize = ((_a = styles.tabSize) !== null && _a !== void 0 ? _a : styles.MozTabSize) != null;
  }
  return _supportsTabSize || false;
}
var specialCharConfig = /* @__PURE__ */ Facet.define({
  combine(configs) {
    let config2 = combineConfig(configs, {
      render: null,
      specialChars: Specials,
      addSpecialChars: null
    });
    if (config2.replaceTabs = !supportsTabSize())
      config2.specialChars = new RegExp("	|" + config2.specialChars.source, UnicodeRegexpSupport);
    if (config2.addSpecialChars)
      config2.specialChars = new RegExp(config2.specialChars.source + "|" + config2.addSpecialChars.source, UnicodeRegexpSupport);
    return config2;
  }
});
function highlightSpecialChars(config2 = {}) {
  return [specialCharConfig.of(config2), specialCharPlugin()];
}
var _plugin = null;
function specialCharPlugin() {
  return _plugin || (_plugin = ViewPlugin.fromClass(class {
    constructor(view) {
      this.view = view;
      this.decorations = Decoration.none;
      this.decorationCache = Object.create(null);
      this.decorator = this.makeDecorator(view.state.facet(specialCharConfig));
      this.decorations = this.decorator.createDeco(view);
    }
    makeDecorator(conf) {
      return new MatchDecorator({
        regexp: conf.specialChars,
        decoration: (m, view, pos) => {
          let { doc: doc2 } = view.state;
          let code = codePointAt(m[0], 0);
          if (code == 9) {
            let line = doc2.lineAt(pos);
            let size = view.state.tabSize, col = countColumn(line.text, size, pos - line.from);
            return Decoration.replace({ widget: new TabWidget((size - col % size) * this.view.defaultCharacterWidth) });
          }
          return this.decorationCache[code] || (this.decorationCache[code] = Decoration.replace({ widget: new SpecialCharWidget(conf, code) }));
        },
        boundary: conf.replaceTabs ? void 0 : /[^]/
      });
    }
    update(update) {
      let conf = update.state.facet(specialCharConfig);
      if (update.startState.facet(specialCharConfig) != conf) {
        this.decorator = this.makeDecorator(conf);
        this.decorations = this.decorator.createDeco(update.view);
      } else {
        this.decorations = this.decorator.updateDeco(update, this.decorations);
      }
    }
  }, {
    decorations: (v) => v.decorations
  }));
}
var DefaultPlaceholder = "\u2022";
function placeholder$1(code) {
  if (code >= 32)
    return DefaultPlaceholder;
  if (code == 10)
    return "\u2424";
  return String.fromCharCode(9216 + code);
}
var SpecialCharWidget = class extends WidgetType {
  constructor(options, code) {
    super();
    this.options = options;
    this.code = code;
  }
  eq(other) {
    return other.code == this.code;
  }
  toDOM(view) {
    let ph = placeholder$1(this.code);
    let desc = view.state.phrase("Control character") + " " + (Names[this.code] || "0x" + this.code.toString(16));
    let custom = this.options.render && this.options.render(this.code, desc, ph);
    if (custom)
      return custom;
    let span = document.createElement("span");
    span.textContent = ph;
    span.title = desc;
    span.setAttribute("aria-label", desc);
    span.className = "cm-specialChar";
    return span;
  }
  ignoreEvent() {
    return false;
  }
};
var TabWidget = class extends WidgetType {
  constructor(width) {
    super();
    this.width = width;
  }
  eq(other) {
    return other.width == this.width;
  }
  toDOM() {
    let span = document.createElement("span");
    span.textContent = "	";
    span.className = "cm-tab";
    span.style.width = this.width + "px";
    return span;
  }
  ignoreEvent() {
    return false;
  }
};
var Placeholder = class extends WidgetType {
  constructor(content2) {
    super();
    this.content = content2;
  }
  toDOM() {
    let wrap = document.createElement("span");
    wrap.className = "cm-placeholder";
    wrap.style.pointerEvents = "none";
    wrap.appendChild(typeof this.content == "string" ? document.createTextNode(this.content) : this.content);
    if (typeof this.content == "string")
      wrap.setAttribute("aria-label", "placeholder " + this.content);
    else
      wrap.setAttribute("aria-hidden", "true");
    return wrap;
  }
  ignoreEvent() {
    return false;
  }
};
function placeholder(content2) {
  return ViewPlugin.fromClass(class {
    constructor(view) {
      this.view = view;
      this.placeholder = Decoration.set([Decoration.widget({ widget: new Placeholder(content2), side: 1 }).range(0)]);
    }
    get decorations() {
      return this.view.state.doc.length ? Decoration.none : this.placeholder;
    }
  }, { decorations: (v) => v.decorations });
}

// node_modules/@codemirror/language/dist/index.js
var languageDataProp = /* @__PURE__ */ new NodeProp();
function defineLanguageFacet(baseData) {
  return Facet.define({
    combine: baseData ? (values) => values.concat(baseData) : void 0
  });
}
var Language = class {
  constructor(data, parser2, topNode, extraExtensions = []) {
    this.data = data;
    this.topNode = topNode;
    if (!EditorState.prototype.hasOwnProperty("tree"))
      Object.defineProperty(EditorState.prototype, "tree", { get() {
        return syntaxTree(this);
      } });
    this.parser = parser2;
    this.extension = [
      language.of(this),
      EditorState.languageData.of((state, pos, side) => state.facet(languageDataFacetAt(state, pos, side)))
    ].concat(extraExtensions);
  }
  isActiveAt(state, pos, side = -1) {
    return languageDataFacetAt(state, pos, side) == this.data;
  }
  findRegions(state) {
    let lang = state.facet(language);
    if ((lang === null || lang === void 0 ? void 0 : lang.data) == this.data)
      return [{ from: 0, to: state.doc.length }];
    if (!lang || !lang.allowsNesting)
      return [];
    let result = [];
    let explore = (tree, from) => {
      if (tree.prop(languageDataProp) == this.data) {
        result.push({ from, to: from + tree.length });
        return;
      }
      let mount = tree.prop(NodeProp.mounted);
      if (mount) {
        if (mount.tree.prop(languageDataProp) == this.data) {
          if (mount.overlay)
            for (let r of mount.overlay)
              result.push({ from: r.from + from, to: r.to + from });
          else
            result.push({ from, to: from + tree.length });
          return;
        } else if (mount.overlay) {
          let size = result.length;
          explore(mount.tree, mount.overlay[0].from + from);
          if (result.length > size)
            return;
        }
      }
      for (let i = 0; i < tree.children.length; i++) {
        let ch = tree.children[i];
        if (ch instanceof Tree)
          explore(ch, tree.positions[i] + from);
      }
    };
    explore(syntaxTree(state), 0);
    return result;
  }
  get allowsNesting() {
    return true;
  }
};
Language.setState = /* @__PURE__ */ StateEffect.define();
function languageDataFacetAt(state, pos, side) {
  let topLang = state.facet(language);
  if (!topLang)
    return null;
  let facet = topLang.data;
  if (topLang.allowsNesting) {
    for (let node = syntaxTree(state).topNode; node; node = node.enter(pos, side, true, false))
      facet = node.type.prop(languageDataProp) || facet;
  }
  return facet;
}
var LRLanguage = class extends Language {
  constructor(data, parser2) {
    super(data, parser2, parser2.topNode);
    this.parser = parser2;
  }
  static define(spec) {
    let data = defineLanguageFacet(spec.languageData);
    return new LRLanguage(data, spec.parser.configure({
      props: [languageDataProp.add((type) => type.isTop ? data : void 0)]
    }));
  }
  configure(options) {
    return new LRLanguage(this.data, this.parser.configure(options));
  }
  get allowsNesting() {
    return this.parser.wrappers.length > 0;
  }
};
function syntaxTree(state) {
  let field = state.field(Language.state, false);
  return field ? field.tree : Tree.empty;
}
var DocInput = class {
  constructor(doc2, length = doc2.length) {
    this.doc = doc2;
    this.length = length;
    this.cursorPos = 0;
    this.string = "";
    this.cursor = doc2.iter();
  }
  syncTo(pos) {
    this.string = this.cursor.next(pos - this.cursorPos).value;
    this.cursorPos = pos + this.string.length;
    return this.cursorPos - this.string.length;
  }
  chunk(pos) {
    this.syncTo(pos);
    return this.string;
  }
  get lineChunks() {
    return true;
  }
  read(from, to) {
    let stringStart = this.cursorPos - this.string.length;
    if (from < stringStart || to >= this.cursorPos)
      return this.doc.sliceString(from, to);
    else
      return this.string.slice(from - stringStart, to - stringStart);
  }
};
var currentContext = null;
var ParseContext = class {
  constructor(parser2, state, fragments = [], tree, treeLen, viewport, skipped, scheduleOn) {
    this.parser = parser2;
    this.state = state;
    this.fragments = fragments;
    this.tree = tree;
    this.treeLen = treeLen;
    this.viewport = viewport;
    this.skipped = skipped;
    this.scheduleOn = scheduleOn;
    this.parse = null;
    this.tempSkipped = [];
  }
  startParse() {
    return this.parser.startParse(new DocInput(this.state.doc), this.fragments);
  }
  work(time, upto) {
    if (upto != null && upto >= this.state.doc.length)
      upto = void 0;
    if (this.tree != Tree.empty && this.isDone(upto !== null && upto !== void 0 ? upto : this.state.doc.length)) {
      this.takeTree();
      return true;
    }
    return this.withContext(() => {
      var _a;
      if (!this.parse)
        this.parse = this.startParse();
      if (upto != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > upto) && upto < this.state.doc.length)
        this.parse.stopAt(upto);
      let endTime = Date.now() + time;
      for (; ; ) {
        let done = this.parse.advance();
        if (done) {
          this.fragments = this.withoutTempSkipped(TreeFragment.addTree(done, this.fragments, this.parse.stoppedAt != null));
          this.treeLen = (_a = this.parse.stoppedAt) !== null && _a !== void 0 ? _a : this.state.doc.length;
          this.tree = done;
          this.parse = null;
          if (this.treeLen < (upto !== null && upto !== void 0 ? upto : this.state.doc.length))
            this.parse = this.startParse();
          else
            return true;
        }
        if (Date.now() > endTime)
          return false;
      }
    });
  }
  takeTree() {
    let pos, tree;
    if (this.parse && (pos = this.parse.parsedPos) > this.treeLen) {
      if (this.parse.stoppedAt == null || this.parse.stoppedAt > pos)
        this.parse.stopAt(pos);
      this.withContext(() => {
        while (!(tree = this.parse.advance())) {
        }
      });
      this.tree = tree;
      this.fragments = this.withoutTempSkipped(TreeFragment.addTree(this.tree, this.fragments, true));
      this.parse = null;
    }
  }
  withContext(f) {
    let prev = currentContext;
    currentContext = this;
    try {
      return f();
    } finally {
      currentContext = prev;
    }
  }
  withoutTempSkipped(fragments) {
    for (let r; r = this.tempSkipped.pop(); )
      fragments = cutFragments(fragments, r.from, r.to);
    return fragments;
  }
  changes(changes, newState) {
    let { fragments, tree, treeLen, viewport, skipped } = this;
    this.takeTree();
    if (!changes.empty) {
      let ranges = [];
      changes.iterChangedRanges((fromA, toA, fromB, toB) => ranges.push({ fromA, toA, fromB, toB }));
      fragments = TreeFragment.applyChanges(fragments, ranges);
      tree = Tree.empty;
      treeLen = 0;
      viewport = { from: changes.mapPos(viewport.from, -1), to: changes.mapPos(viewport.to, 1) };
      if (this.skipped.length) {
        skipped = [];
        for (let r of this.skipped) {
          let from = changes.mapPos(r.from, 1), to = changes.mapPos(r.to, -1);
          if (from < to)
            skipped.push({ from, to });
        }
      }
    }
    return new ParseContext(this.parser, newState, fragments, tree, treeLen, viewport, skipped, this.scheduleOn);
  }
  updateViewport(viewport) {
    if (this.viewport.from == viewport.from && this.viewport.to == viewport.to)
      return false;
    this.viewport = viewport;
    let startLen = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from, to } = this.skipped[i];
      if (from < viewport.to && to > viewport.from) {
        this.fragments = cutFragments(this.fragments, from, to);
        this.skipped.splice(i--, 1);
      }
    }
    if (this.skipped.length >= startLen)
      return false;
    this.reset();
    return true;
  }
  reset() {
    if (this.parse) {
      this.takeTree();
      this.parse = null;
    }
  }
  skipUntilInView(from, to) {
    this.skipped.push({ from, to });
  }
  static getSkippingParser(until) {
    return new class extends Parser {
      createParse(input, fragments, ranges) {
        let from = ranges[0].from, to = ranges[ranges.length - 1].to;
        let parser2 = {
          parsedPos: from,
          advance() {
            let cx = currentContext;
            if (cx) {
              for (let r of ranges)
                cx.tempSkipped.push(r);
              if (until)
                cx.scheduleOn = cx.scheduleOn ? Promise.all([cx.scheduleOn, until]) : until;
            }
            this.parsedPos = to;
            return new Tree(NodeType.none, [], [], to - from);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
        return parser2;
      }
    }();
  }
  movedPast(pos) {
    return this.treeLen < pos && this.parse && this.parse.parsedPos >= pos;
  }
  isDone(upto) {
    let frags = this.fragments;
    return this.treeLen >= upto && frags.length && frags[0].from == 0 && frags[0].to >= upto;
  }
  static get() {
    return currentContext;
  }
};
function cutFragments(fragments, from, to) {
  return TreeFragment.applyChanges(fragments, [{ fromA: from, toA: to, fromB: from, toB: to }]);
}
var LanguageState = class {
  constructor(context) {
    this.context = context;
    this.tree = context.tree;
  }
  apply(tr) {
    if (!tr.docChanged)
      return this;
    let newCx = this.context.changes(tr.changes, tr.state);
    let upto = this.context.treeLen == tr.startState.doc.length ? void 0 : Math.max(tr.changes.mapPos(this.context.treeLen), newCx.viewport.to);
    if (!newCx.work(25, upto))
      newCx.takeTree();
    return new LanguageState(newCx);
  }
  static init(state) {
    let parseState = new ParseContext(state.facet(language).parser, state, [], Tree.empty, 0, { from: 0, to: state.doc.length }, [], null);
    if (!parseState.work(25))
      parseState.takeTree();
    return new LanguageState(parseState);
  }
};
Language.state = /* @__PURE__ */ StateField.define({
  create: LanguageState.init,
  update(value, tr) {
    for (let e of tr.effects)
      if (e.is(Language.setState))
        return e.value;
    if (tr.startState.facet(language) != tr.state.facet(language))
      return LanguageState.init(tr.state);
    return value.apply(tr);
  }
});
var requestIdle = typeof window != "undefined" && window.requestIdleCallback || ((callback, { timeout }) => setTimeout(callback, timeout));
var cancelIdle = typeof window != "undefined" && window.cancelIdleCallback || clearTimeout;
var parseWorker = /* @__PURE__ */ ViewPlugin.fromClass(class ParseWorker {
  constructor(view) {
    this.view = view;
    this.working = -1;
    this.chunkEnd = -1;
    this.chunkBudget = -1;
    this.work = this.work.bind(this);
    this.scheduleWork();
  }
  update(update) {
    let cx = this.view.state.field(Language.state).context;
    if (cx.updateViewport(update.view.viewport) || this.view.viewport.to > cx.treeLen)
      this.scheduleWork();
    if (update.docChanged) {
      if (this.view.hasFocus)
        this.chunkBudget += 50;
      this.scheduleWork();
    }
    this.checkAsyncSchedule(cx);
  }
  scheduleWork() {
    if (this.working > -1)
      return;
    let { state } = this.view, field = state.field(Language.state);
    if (field.tree != field.context.tree || !field.context.isDone(state.doc.length))
      this.working = requestIdle(this.work, { timeout: 500 });
  }
  work(deadline) {
    this.working = -1;
    let now = Date.now();
    if (this.chunkEnd < now && (this.chunkEnd < 0 || this.view.hasFocus)) {
      this.chunkEnd = now + 3e4;
      this.chunkBudget = 3e3;
    }
    if (this.chunkBudget <= 0)
      return;
    let { state, viewport: { to: vpTo } } = this.view, field = state.field(Language.state);
    if (field.tree == field.context.tree && field.context.treeLen >= vpTo + 1e6)
      return;
    let time = Math.min(this.chunkBudget, deadline ? Math.max(25, deadline.timeRemaining()) : 100);
    let done = field.context.work(time, vpTo + 1e6);
    this.chunkBudget -= Date.now() - now;
    if (done || this.chunkBudget <= 0 || field.context.movedPast(vpTo)) {
      field.context.takeTree();
      this.view.dispatch({ effects: Language.setState.of(new LanguageState(field.context)) });
    }
    if (!done && this.chunkBudget > 0)
      this.scheduleWork();
    this.checkAsyncSchedule(field.context);
  }
  checkAsyncSchedule(cx) {
    if (cx.scheduleOn) {
      cx.scheduleOn.then(() => this.scheduleWork());
      cx.scheduleOn = null;
    }
  }
  destroy() {
    if (this.working >= 0)
      cancelIdle(this.working);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
});
var language = /* @__PURE__ */ Facet.define({
  combine(languages) {
    return languages.length ? languages[0] : null;
  },
  enables: [Language.state, parseWorker]
});
var LanguageSupport = class {
  constructor(language3, support = []) {
    this.language = language3;
    this.support = support;
    this.extension = [language3, support];
  }
};
var indentService = /* @__PURE__ */ Facet.define();
var indentUnit = /* @__PURE__ */ Facet.define({
  combine: (values) => {
    if (!values.length)
      return "  ";
    if (!/^(?: +|\t+)$/.test(values[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(values[0]));
    return values[0];
  }
});
function getIndentUnit(state) {
  let unit = state.facet(indentUnit);
  return unit.charCodeAt(0) == 9 ? state.tabSize * unit.length : unit.length;
}
function indentString(state, cols) {
  let result = "", ts = state.tabSize;
  if (state.facet(indentUnit).charCodeAt(0) == 9)
    while (cols >= ts) {
      result += "	";
      cols -= ts;
    }
  for (let i = 0; i < cols; i++)
    result += " ";
  return result;
}
function getIndentation(context, pos) {
  if (context instanceof EditorState)
    context = new IndentContext(context);
  for (let service of context.state.facet(indentService)) {
    let result = service(context, pos);
    if (result != null)
      return result;
  }
  let tree = syntaxTree(context.state);
  return tree ? syntaxIndentation(context, tree, pos) : null;
}
var IndentContext = class {
  constructor(state, options = {}) {
    this.state = state;
    this.options = options;
    this.unit = getIndentUnit(state);
  }
  lineAt(pos, bias = 1) {
    let line = this.state.doc.lineAt(pos);
    let { simulateBreak } = this.options;
    if (simulateBreak != null && simulateBreak >= line.from && simulateBreak <= line.to) {
      if (bias < 0 ? simulateBreak < pos : simulateBreak <= pos)
        return { text: line.text.slice(simulateBreak - line.from), from: simulateBreak };
      else
        return { text: line.text.slice(0, simulateBreak - line.from), from: line.from };
    }
    return line;
  }
  textAfterPos(pos, bias = 1) {
    if (this.options.simulateDoubleBreak && pos == this.options.simulateBreak)
      return "";
    let { text, from } = this.lineAt(pos, bias);
    return text.slice(pos - from, Math.min(text.length, pos + 100 - from));
  }
  column(pos, bias = 1) {
    let { text, from } = this.lineAt(pos, bias);
    let result = this.countColumn(text, pos - from);
    let override = this.options.overrideIndentation ? this.options.overrideIndentation(from) : -1;
    if (override > -1)
      result += override - this.countColumn(text, text.search(/\S|$/));
    return result;
  }
  countColumn(line, pos = line.length) {
    return countColumn(line, this.state.tabSize, pos);
  }
  lineIndent(pos, bias = 1) {
    let { text, from } = this.lineAt(pos, bias);
    let override = this.options.overrideIndentation;
    if (override) {
      let overriden = override(from);
      if (overriden > -1)
        return overriden;
    }
    return this.countColumn(text, text.search(/\S|$/));
  }
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
};
var indentNodeProp = /* @__PURE__ */ new NodeProp();
function syntaxIndentation(cx, ast, pos) {
  return indentFrom(ast.resolveInner(pos).enterUnfinishedNodesBefore(pos), pos, cx);
}
function ignoreClosed(cx) {
  return cx.pos == cx.options.simulateBreak && cx.options.simulateDoubleBreak;
}
function indentStrategy(tree) {
  let strategy = tree.type.prop(indentNodeProp);
  if (strategy)
    return strategy;
  let first = tree.firstChild, close;
  if (first && (close = first.type.prop(NodeProp.closedBy))) {
    let last = tree.lastChild, closed = last && close.indexOf(last.name) > -1;
    return (cx) => delimitedStrategy(cx, true, 1, void 0, closed && !ignoreClosed(cx) ? last.from : void 0);
  }
  return tree.parent == null ? topIndent : null;
}
function indentFrom(node, pos, base2) {
  for (; node; node = node.parent) {
    let strategy = indentStrategy(node);
    if (strategy)
      return strategy(new TreeIndentContext(base2, pos, node));
  }
  return null;
}
function topIndent() {
  return 0;
}
var TreeIndentContext = class extends IndentContext {
  constructor(base2, pos, node) {
    super(base2.state, base2.options);
    this.base = base2;
    this.pos = pos;
    this.node = node;
  }
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  get baseIndent() {
    let line = this.state.doc.lineAt(this.node.from);
    for (; ; ) {
      let atBreak = this.node.resolve(line.from);
      while (atBreak.parent && atBreak.parent.from == atBreak.from)
        atBreak = atBreak.parent;
      if (isParent(atBreak, this.node))
        break;
      line = this.state.doc.lineAt(atBreak.from);
    }
    return this.lineIndent(line.from);
  }
  continue() {
    let parent = this.node.parent;
    return parent ? indentFrom(parent, this.pos, this.base) : 0;
  }
};
function isParent(parent, of) {
  for (let cur2 = of; cur2; cur2 = cur2.parent)
    if (parent == cur2)
      return true;
  return false;
}
function bracketedAligned(context) {
  let tree = context.node;
  let openToken = tree.childAfter(tree.from), last = tree.lastChild;
  if (!openToken)
    return null;
  let sim = context.options.simulateBreak;
  let openLine = context.state.doc.lineAt(openToken.from);
  let lineEnd = sim == null || sim <= openLine.from ? openLine.to : Math.min(openLine.to, sim);
  for (let pos = openToken.to; ; ) {
    let next = tree.childAfter(pos);
    if (!next || next == last)
      return null;
    if (!next.type.isSkipped)
      return next.from < lineEnd ? openToken : null;
    pos = next.to;
  }
}
function delimitedStrategy(context, align, units, closing2, closedAt) {
  let after = context.textAfter, space = after.match(/^\s*/)[0].length;
  let closed = closing2 && after.slice(space, space + closing2.length) == closing2 || closedAt == context.pos + space;
  let aligned = align ? bracketedAligned(context) : null;
  if (aligned)
    return closed ? context.column(aligned.from) : context.column(aligned.to);
  return context.baseIndent + (closed ? 0 : context.unit * units);
}
function continuedIndent({ except, units = 1 } = {}) {
  return (context) => {
    let matchExcept = except && except.test(context.textAfter);
    return context.baseIndent + (matchExcept ? 0 : units * context.unit);
  };
}
var DontIndentBeyond = 200;
function indentOnInput() {
  return EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged || !tr.isUserEvent("input.type"))
      return tr;
    let rules = tr.startState.languageDataAt("indentOnInput", tr.startState.selection.main.head);
    if (!rules.length)
      return tr;
    let doc2 = tr.newDoc, { head } = tr.newSelection.main, line = doc2.lineAt(head);
    if (head > line.from + DontIndentBeyond)
      return tr;
    let lineStart = doc2.sliceString(line.from, head);
    if (!rules.some((r) => r.test(lineStart)))
      return tr;
    let { state } = tr, last = -1, changes = [];
    for (let { head: head2 } of state.selection.ranges) {
      let line2 = state.doc.lineAt(head2);
      if (line2.from == last)
        continue;
      last = line2.from;
      let indent = getIndentation(state, line2.from);
      if (indent == null)
        continue;
      let cur2 = /^\s*/.exec(line2.text)[0];
      let norm = indentString(state, indent);
      if (cur2 != norm)
        changes.push({ from: line2.from, to: line2.from + cur2.length, insert: norm });
    }
    return changes.length ? [tr, { changes, sequential: true }] : tr;
  });
}
var foldService = /* @__PURE__ */ Facet.define();
var foldNodeProp = /* @__PURE__ */ new NodeProp();
function syntaxFolding(state, start, end) {
  let tree = syntaxTree(state);
  if (tree.length == 0)
    return null;
  let inner = tree.resolveInner(end);
  let found = null;
  for (let cur2 = inner; cur2; cur2 = cur2.parent) {
    if (cur2.to <= end || cur2.from > end)
      continue;
    if (found && cur2.from < start)
      break;
    let prop = cur2.type.prop(foldNodeProp);
    if (prop) {
      let value = prop(cur2, state);
      if (value && value.from <= end && value.from >= start && value.to > end)
        found = value;
    }
  }
  return found;
}
function foldable(state, lineStart, lineEnd) {
  for (let service of state.facet(foldService)) {
    let result = service(state, lineStart, lineEnd);
    if (result)
      return result;
  }
  return syntaxFolding(state, lineStart, lineEnd);
}

// node_modules/@codemirror/highlight/dist/index.js
var nextTagID = 0;
var Tag = class {
  constructor(set, base2, modified) {
    this.set = set;
    this.base = base2;
    this.modified = modified;
    this.id = nextTagID++;
  }
  static define(parent) {
    if (parent === null || parent === void 0 ? void 0 : parent.base)
      throw new Error("Can not derive from a modified tag");
    let tag = new Tag([], null, []);
    tag.set.push(tag);
    if (parent)
      for (let t2 of parent.set)
        tag.set.push(t2);
    return tag;
  }
  static defineModifier() {
    let mod = new Modifier();
    return (tag) => {
      if (tag.modified.indexOf(mod) > -1)
        return tag;
      return Modifier.get(tag.base || tag, tag.modified.concat(mod).sort((a, b) => a.id - b.id));
    };
  }
};
var nextModifierID = 0;
var Modifier = class {
  constructor() {
    this.instances = [];
    this.id = nextModifierID++;
  }
  static get(base2, mods) {
    if (!mods.length)
      return base2;
    let exists = mods[0].instances.find((t2) => t2.base == base2 && sameArray2(mods, t2.modified));
    if (exists)
      return exists;
    let set = [], tag = new Tag(set, base2, mods);
    for (let m of mods)
      m.instances.push(tag);
    let configs = permute(mods);
    for (let parent of base2.set)
      for (let config2 of configs)
        set.push(Modifier.get(parent, config2));
    return tag;
  }
};
function sameArray2(a, b) {
  return a.length == b.length && a.every((x, i) => x == b[i]);
}
function permute(array) {
  let result = [array];
  for (let i = 0; i < array.length; i++) {
    for (let a of permute(array.slice(0, i).concat(array.slice(i + 1))))
      result.push(a);
  }
  return result;
}
function styleTags(spec) {
  let byName = Object.create(null);
  for (let prop in spec) {
    let tags2 = spec[prop];
    if (!Array.isArray(tags2))
      tags2 = [tags2];
    for (let part of prop.split(" "))
      if (part) {
        let pieces = [], mode = 2, rest = part;
        for (let pos = 0; ; ) {
          if (rest == "..." && pos > 0 && pos + 3 == part.length) {
            mode = 1;
            break;
          }
          let m = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(rest);
          if (!m)
            throw new RangeError("Invalid path: " + part);
          pieces.push(m[0] == "*" ? null : m[0][0] == '"' ? JSON.parse(m[0]) : m[0]);
          pos += m[0].length;
          if (pos == part.length)
            break;
          let next = part[pos++];
          if (pos == part.length && next == "!") {
            mode = 0;
            break;
          }
          if (next != "/")
            throw new RangeError("Invalid path: " + part);
          rest = part.slice(pos);
        }
        let last = pieces.length - 1, inner = pieces[last];
        if (!inner)
          throw new RangeError("Invalid path: " + part);
        let rule = new Rule(tags2, mode, last > 0 ? pieces.slice(0, last) : null);
        byName[inner] = rule.sort(byName[inner]);
      }
  }
  return ruleNodeProp.add(byName);
}
var ruleNodeProp = /* @__PURE__ */ new NodeProp();
var highlightStyle = /* @__PURE__ */ Facet.define({
  combine(stylings) {
    return stylings.length ? HighlightStyle.combinedMatch(stylings) : null;
  }
});
var fallbackHighlightStyle = /* @__PURE__ */ Facet.define({
  combine(values) {
    return values.length ? values[0].match : null;
  }
});
function getHighlightStyle(state) {
  return state.facet(highlightStyle) || state.facet(fallbackHighlightStyle);
}
var Rule = class {
  constructor(tags2, mode, context, next) {
    this.tags = tags2;
    this.mode = mode;
    this.context = context;
    this.next = next;
  }
  sort(other) {
    if (!other || other.depth < this.depth) {
      this.next = other;
      return this;
    }
    other.next = this.sort(other.next);
    return other;
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
};
var HighlightStyle = class {
  constructor(spec, options) {
    this.map = Object.create(null);
    let modSpec;
    function def(spec2) {
      let cls = StyleModule.newName();
      (modSpec || (modSpec = Object.create(null)))["." + cls] = spec2;
      return cls;
    }
    this.all = typeof options.all == "string" ? options.all : options.all ? def(options.all) : null;
    for (let style of spec) {
      let cls = (style.class || def(Object.assign({}, style, { tag: null }))) + (this.all ? " " + this.all : "");
      let tags2 = style.tag;
      if (!Array.isArray(tags2))
        this.map[tags2.id] = cls;
      else
        for (let tag of tags2)
          this.map[tag.id] = cls;
    }
    this.module = modSpec ? new StyleModule(modSpec) : null;
    this.scope = options.scope || null;
    this.match = this.match.bind(this);
    let ext = [treeHighlighter];
    if (this.module)
      ext.push(EditorView.styleModule.of(this.module));
    this.extension = ext.concat(highlightStyle.of(this));
    this.fallback = ext.concat(fallbackHighlightStyle.of(this));
  }
  match(tag, scope) {
    if (this.scope && scope != this.scope)
      return null;
    for (let t2 of tag.set) {
      let match = this.map[t2.id];
      if (match !== void 0) {
        if (t2 != tag)
          this.map[tag.id] = match;
        return match;
      }
    }
    return this.map[tag.id] = this.all;
  }
  static combinedMatch(styles) {
    if (styles.length == 1)
      return styles[0].match;
    let cache = styles.some((s) => s.scope) ? void 0 : Object.create(null);
    return (tag, scope) => {
      let cached = cache && cache[tag.id];
      if (cached !== void 0)
        return cached;
      let result = null;
      for (let style of styles) {
        let value = style.match(tag, scope);
        if (value)
          result = result ? result + " " + value : value;
      }
      if (cache)
        cache[tag.id] = result;
      return result;
    };
  }
  static define(specs, options) {
    return new HighlightStyle(specs, options || {});
  }
  static get(state, tag, scope) {
    let style = getHighlightStyle(state);
    return style && style(tag, scope || NodeType.none);
  }
};
var TreeHighlighter = class {
  constructor(view) {
    this.markCache = Object.create(null);
    this.tree = syntaxTree(view.state);
    this.decorations = this.buildDeco(view, getHighlightStyle(view.state));
  }
  update(update) {
    let tree = syntaxTree(update.state), style = getHighlightStyle(update.state);
    let styleChange = style != update.startState.facet(highlightStyle);
    if (tree.length < update.view.viewport.to && !styleChange && tree.type == this.tree.type) {
      this.decorations = this.decorations.map(update.changes);
    } else if (tree != this.tree || update.viewportChanged || styleChange) {
      this.tree = tree;
      this.decorations = this.buildDeco(update.view, style);
    }
  }
  buildDeco(view, match) {
    if (!match || !this.tree.length)
      return Decoration.none;
    let builder = new RangeSetBuilder();
    for (let { from, to } of view.visibleRanges) {
      highlightTreeRange(this.tree, from, to, match, (from2, to2, style) => {
        builder.add(from2, to2, this.markCache[style] || (this.markCache[style] = Decoration.mark({ class: style })));
      });
    }
    return builder.finish();
  }
};
var treeHighlighter = /* @__PURE__ */ Prec.extend(/* @__PURE__ */ ViewPlugin.fromClass(TreeHighlighter, {
  decorations: (v) => v.decorations
}));
var nodeStack = [""];
var HighlightBuilder = class {
  constructor(at, style, span) {
    this.at = at;
    this.style = style;
    this.span = span;
    this.class = "";
  }
  startSpan(at, cls) {
    if (cls != this.class) {
      this.flush(at);
      if (at > this.at)
        this.at = at;
      this.class = cls;
    }
  }
  flush(to) {
    if (to > this.at && this.class)
      this.span(this.at, to, this.class);
  }
  highlightRange(cursor, from, to, inheritedClass, depth, scope) {
    let { type, from: start, to: end } = cursor;
    if (start >= to || end <= from)
      return;
    nodeStack[depth] = type.name;
    if (type.isTop)
      scope = type;
    let cls = inheritedClass;
    let rule = type.prop(ruleNodeProp), opaque = false;
    while (rule) {
      if (!rule.context || matchContext(rule.context, nodeStack, depth)) {
        for (let tag of rule.tags) {
          let st = this.style(tag, scope);
          if (st) {
            if (cls)
              cls += " ";
            cls += st;
            if (rule.mode == 1)
              inheritedClass += (inheritedClass ? " " : "") + st;
            else if (rule.mode == 0)
              opaque = true;
          }
        }
        break;
      }
      rule = rule.next;
    }
    this.startSpan(cursor.from, cls);
    if (opaque)
      return;
    let mounted = cursor.tree && cursor.tree.prop(NodeProp.mounted);
    if (mounted && mounted.overlay) {
      let inner = cursor.node.enter(mounted.overlay[0].from + start, 1);
      let hasChild2 = cursor.firstChild();
      for (let i = 0, pos = start; ; i++) {
        let next = i < mounted.overlay.length ? mounted.overlay[i] : null;
        let nextPos = next ? next.from + start : end;
        let rangeFrom = Math.max(from, pos), rangeTo = Math.min(to, nextPos);
        if (rangeFrom < rangeTo && hasChild2) {
          while (cursor.from < rangeTo) {
            this.highlightRange(cursor, rangeFrom, rangeTo, inheritedClass, depth + 1, scope);
            this.startSpan(Math.min(to, cursor.to), cls);
            if (cursor.to >= nextPos || !cursor.nextSibling())
              break;
          }
        }
        if (!next || nextPos > to)
          break;
        pos = next.to + start;
        if (pos > from) {
          this.highlightRange(inner.cursor, Math.max(from, next.from + start), Math.min(to, pos), inheritedClass, depth, mounted.tree.type);
          this.startSpan(pos, cls);
        }
      }
      if (hasChild2)
        cursor.parent();
    } else if (cursor.firstChild()) {
      do {
        if (cursor.to <= from)
          continue;
        if (cursor.from >= to)
          break;
        this.highlightRange(cursor, from, to, inheritedClass, depth + 1, scope);
        this.startSpan(Math.min(to, cursor.to), cls);
      } while (cursor.nextSibling());
      cursor.parent();
    }
  }
};
function highlightTreeRange(tree, from, to, style, span) {
  let builder = new HighlightBuilder(from, style, span);
  builder.highlightRange(tree.cursor(), from, to, "", 0, tree.type);
  builder.flush(to);
}
function matchContext(context, stack, depth) {
  if (context.length > depth - 1)
    return false;
  for (let d = depth - 1, i = context.length - 1; i >= 0; i--, d--) {
    let check = context[i];
    if (check && check != stack[d])
      return false;
  }
  return true;
}
var t = Tag.define;
var comment = /* @__PURE__ */ t();
var name = /* @__PURE__ */ t();
var typeName = /* @__PURE__ */ t(name);
var literal = /* @__PURE__ */ t();
var string = /* @__PURE__ */ t(literal);
var number = /* @__PURE__ */ t(literal);
var content = /* @__PURE__ */ t();
var heading = /* @__PURE__ */ t(content);
var keyword = /* @__PURE__ */ t();
var operator = /* @__PURE__ */ t();
var punctuation = /* @__PURE__ */ t();
var bracket = /* @__PURE__ */ t(punctuation);
var meta = /* @__PURE__ */ t();
var tags = {
  comment,
  lineComment: /* @__PURE__ */ t(comment),
  blockComment: /* @__PURE__ */ t(comment),
  docComment: /* @__PURE__ */ t(comment),
  name,
  variableName: /* @__PURE__ */ t(name),
  typeName,
  tagName: /* @__PURE__ */ t(typeName),
  propertyName: /* @__PURE__ */ t(name),
  className: /* @__PURE__ */ t(name),
  labelName: /* @__PURE__ */ t(name),
  namespace: /* @__PURE__ */ t(name),
  macroName: /* @__PURE__ */ t(name),
  literal,
  string,
  docString: /* @__PURE__ */ t(string),
  character: /* @__PURE__ */ t(string),
  number,
  integer: /* @__PURE__ */ t(number),
  float: /* @__PURE__ */ t(number),
  bool: /* @__PURE__ */ t(literal),
  regexp: /* @__PURE__ */ t(literal),
  escape: /* @__PURE__ */ t(literal),
  color: /* @__PURE__ */ t(literal),
  url: /* @__PURE__ */ t(literal),
  keyword,
  self: /* @__PURE__ */ t(keyword),
  null: /* @__PURE__ */ t(keyword),
  atom: /* @__PURE__ */ t(keyword),
  unit: /* @__PURE__ */ t(keyword),
  modifier: /* @__PURE__ */ t(keyword),
  operatorKeyword: /* @__PURE__ */ t(keyword),
  controlKeyword: /* @__PURE__ */ t(keyword),
  definitionKeyword: /* @__PURE__ */ t(keyword),
  operator,
  derefOperator: /* @__PURE__ */ t(operator),
  arithmeticOperator: /* @__PURE__ */ t(operator),
  logicOperator: /* @__PURE__ */ t(operator),
  bitwiseOperator: /* @__PURE__ */ t(operator),
  compareOperator: /* @__PURE__ */ t(operator),
  updateOperator: /* @__PURE__ */ t(operator),
  definitionOperator: /* @__PURE__ */ t(operator),
  typeOperator: /* @__PURE__ */ t(operator),
  controlOperator: /* @__PURE__ */ t(operator),
  punctuation,
  separator: /* @__PURE__ */ t(punctuation),
  bracket,
  angleBracket: /* @__PURE__ */ t(bracket),
  squareBracket: /* @__PURE__ */ t(bracket),
  paren: /* @__PURE__ */ t(bracket),
  brace: /* @__PURE__ */ t(bracket),
  content,
  heading,
  heading1: /* @__PURE__ */ t(heading),
  heading2: /* @__PURE__ */ t(heading),
  heading3: /* @__PURE__ */ t(heading),
  heading4: /* @__PURE__ */ t(heading),
  heading5: /* @__PURE__ */ t(heading),
  heading6: /* @__PURE__ */ t(heading),
  contentSeparator: /* @__PURE__ */ t(content),
  list: /* @__PURE__ */ t(content),
  quote: /* @__PURE__ */ t(content),
  emphasis: /* @__PURE__ */ t(content),
  strong: /* @__PURE__ */ t(content),
  link: /* @__PURE__ */ t(content),
  monospace: /* @__PURE__ */ t(content),
  strikethrough: /* @__PURE__ */ t(content),
  inserted: /* @__PURE__ */ t(),
  deleted: /* @__PURE__ */ t(),
  changed: /* @__PURE__ */ t(),
  invalid: /* @__PURE__ */ t(),
  meta,
  documentMeta: /* @__PURE__ */ t(meta),
  annotation: /* @__PURE__ */ t(meta),
  processingInstruction: /* @__PURE__ */ t(meta),
  definition: /* @__PURE__ */ Tag.defineModifier(),
  constant: /* @__PURE__ */ Tag.defineModifier(),
  function: /* @__PURE__ */ Tag.defineModifier(),
  standard: /* @__PURE__ */ Tag.defineModifier(),
  local: /* @__PURE__ */ Tag.defineModifier(),
  special: /* @__PURE__ */ Tag.defineModifier()
};
var defaultHighlightStyle = /* @__PURE__ */ HighlightStyle.define([
  {
    tag: tags.link,
    textDecoration: "underline"
  },
  {
    tag: tags.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: tags.emphasis,
    fontStyle: "italic"
  },
  {
    tag: tags.strong,
    fontWeight: "bold"
  },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: tags.keyword,
    color: "#708"
  },
  {
    tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
    color: "#219"
  },
  {
    tag: [tags.literal, tags.inserted],
    color: "#164"
  },
  {
    tag: [tags.string, tags.deleted],
    color: "#a11"
  },
  {
    tag: [tags.regexp, tags.escape, /* @__PURE__ */ tags.special(tags.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ tags.definition(tags.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ tags.local(tags.variableName),
    color: "#30a"
  },
  {
    tag: [tags.typeName, tags.namespace],
    color: "#085"
  },
  {
    tag: tags.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ tags.special(tags.variableName), tags.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ tags.definition(tags.propertyName),
    color: "#00c"
  },
  {
    tag: tags.comment,
    color: "#940"
  },
  {
    tag: tags.meta,
    color: "#7a757a"
  },
  {
    tag: tags.invalid,
    color: "#f00"
  }
]);
var classHighlightStyle = /* @__PURE__ */ HighlightStyle.define([
  { tag: tags.link, class: "cmt-link" },
  { tag: tags.heading, class: "cmt-heading" },
  { tag: tags.emphasis, class: "cmt-emphasis" },
  { tag: tags.strong, class: "cmt-strong" },
  { tag: tags.keyword, class: "cmt-keyword" },
  { tag: tags.atom, class: "cmt-atom" },
  { tag: tags.bool, class: "cmt-bool" },
  { tag: tags.url, class: "cmt-url" },
  { tag: tags.labelName, class: "cmt-labelName" },
  { tag: tags.inserted, class: "cmt-inserted" },
  { tag: tags.deleted, class: "cmt-deleted" },
  { tag: tags.literal, class: "cmt-literal" },
  { tag: tags.string, class: "cmt-string" },
  { tag: tags.number, class: "cmt-number" },
  { tag: [tags.regexp, tags.escape, /* @__PURE__ */ tags.special(tags.string)], class: "cmt-string2" },
  { tag: tags.variableName, class: "cmt-variableName" },
  { tag: /* @__PURE__ */ tags.local(tags.variableName), class: "cmt-variableName cmt-local" },
  { tag: /* @__PURE__ */ tags.definition(tags.variableName), class: "cmt-variableName cmt-definition" },
  { tag: /* @__PURE__ */ tags.special(tags.variableName), class: "cmt-variableName2" },
  { tag: tags.typeName, class: "cmt-typeName" },
  { tag: tags.namespace, class: "cmt-namespace" },
  { tag: tags.macroName, class: "cmt-macroName" },
  { tag: tags.propertyName, class: "cmt-propertyName" },
  { tag: tags.operator, class: "cmt-operator" },
  { tag: tags.comment, class: "cmt-comment" },
  { tag: tags.meta, class: "cmt-meta" },
  { tag: tags.invalid, class: "cmt-invalid" },
  { tag: tags.punctuation, class: "cmt-punctuation" }
]);

// node_modules/@codemirror/stream-parser/dist/index.js
function countCol(string2, end, tabSize, startIndex = 0, startValue = 0) {
  if (end == null) {
    end = string2.search(/[^\s\u00a0]/);
    if (end == -1)
      end = string2.length;
  }
  let n = startValue;
  for (let i = startIndex; i < end; i++) {
    if (string2.charCodeAt(i) == 9)
      n += tabSize - n % tabSize;
    else
      n++;
  }
  return n;
}
var StringStream = class {
  constructor(string2, tabSize, indentUnit2) {
    this.string = string2;
    this.tabSize = tabSize;
    this.indentUnit = indentUnit2;
    this.pos = 0;
    this.start = 0;
    this.lastColumnPos = 0;
    this.lastColumnValue = 0;
  }
  eol() {
    return this.pos >= this.string.length;
  }
  sol() {
    return this.pos == 0;
  }
  peek() {
    return this.string.charAt(this.pos) || void 0;
  }
  next() {
    if (this.pos < this.string.length)
      return this.string.charAt(this.pos++);
  }
  eat(match) {
    let ch = this.string.charAt(this.pos);
    let ok;
    if (typeof match == "string")
      ok = ch == match;
    else
      ok = ch && (match instanceof RegExp ? match.test(ch) : match(ch));
    if (ok) {
      ++this.pos;
      return ch;
    }
  }
  eatWhile(match) {
    let start = this.pos;
    while (this.eat(match)) {
    }
    return this.pos > start;
  }
  eatSpace() {
    let start = this.pos;
    while (/[\s\u00a0]/.test(this.string.charAt(this.pos)))
      ++this.pos;
    return this.pos > start;
  }
  skipToEnd() {
    this.pos = this.string.length;
  }
  skipTo(ch) {
    let found = this.string.indexOf(ch, this.pos);
    if (found > -1) {
      this.pos = found;
      return true;
    }
  }
  backUp(n) {
    this.pos -= n;
  }
  column() {
    if (this.lastColumnPos < this.start) {
      this.lastColumnValue = countCol(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
      this.lastColumnPos = this.start;
    }
    return this.lastColumnValue;
  }
  indentation() {
    return countCol(this.string, null, this.tabSize);
  }
  match(pattern, consume, caseInsensitive) {
    if (typeof pattern == "string") {
      let cased = (str) => caseInsensitive ? str.toLowerCase() : str;
      let substr = this.string.substr(this.pos, pattern.length);
      if (cased(substr) == cased(pattern)) {
        if (consume !== false)
          this.pos += pattern.length;
        return true;
      } else
        return null;
    } else {
      let match = this.string.slice(this.pos).match(pattern);
      if (match && match.index > 0)
        return null;
      if (match && consume !== false)
        this.pos += match[0].length;
      return match;
    }
  }
  current() {
    return this.string.slice(this.start, this.pos);
  }
};
function fullParser(spec) {
  return {
    token: spec.token,
    blankLine: spec.blankLine || (() => {
    }),
    startState: spec.startState || (() => true),
    copyState: spec.copyState || defaultCopyState,
    indent: spec.indent || (() => null),
    languageData: spec.languageData || {}
  };
}
function defaultCopyState(state) {
  if (typeof state != "object")
    return state;
  let newState = {};
  for (let prop in state) {
    let val = state[prop];
    newState[prop] = val instanceof Array ? val.slice() : val;
  }
  return newState;
}
var StreamLanguage = class extends Language {
  constructor(parser2) {
    let data = defineLanguageFacet(parser2.languageData);
    let p = fullParser(parser2), self;
    let impl = new class extends Parser {
      createParse(input, fragments, ranges) {
        return new Parse(self, input, fragments, ranges);
      }
    }();
    super(data, impl, docID(data), [indentService.of((cx, pos) => this.getIndent(cx, pos))]);
    self = this;
    this.streamParser = p;
    this.stateAfter = new NodeProp({ perNode: true });
  }
  static define(spec) {
    return new StreamLanguage(spec);
  }
  getIndent(cx, pos) {
    let tree = syntaxTree(cx.state), at = tree.resolve(pos);
    while (at && at.type != this.topNode)
      at = at.parent;
    if (!at)
      return null;
    let start = findState(this, tree, 0, at.from, pos), statePos, state;
    if (start) {
      state = start.state;
      statePos = start.pos + 1;
    } else {
      state = this.streamParser.startState(cx.unit);
      statePos = 0;
    }
    if (pos - statePos > 1e4)
      return null;
    while (statePos < pos) {
      let line = cx.state.doc.lineAt(statePos), end = Math.min(pos, line.to);
      if (line.length) {
        let stream = new StringStream(line.text, cx.state.tabSize, cx.unit);
        while (stream.pos < end - line.from)
          readToken(this.streamParser.token, stream, state);
      } else {
        this.streamParser.blankLine(state, cx.unit);
      }
      if (end == pos)
        break;
      statePos = line.to + 1;
    }
    let { text } = cx.state.doc.lineAt(pos);
    return this.streamParser.indent(state, /^\s*(.*)/.exec(text)[1], cx);
  }
  get allowsNesting() {
    return false;
  }
};
function findState(lang, tree, off, startPos, before) {
  let state = off >= startPos && off + tree.length <= before && tree.prop(lang.stateAfter);
  if (state)
    return { state: lang.streamParser.copyState(state), pos: off + tree.length };
  for (let i = tree.children.length - 1; i >= 0; i--) {
    let child = tree.children[i], pos = off + tree.positions[i];
    let found = child instanceof Tree && pos < before && findState(lang, child, pos, startPos, before);
    if (found)
      return found;
  }
  return null;
}
function cutTree(lang, tree, from, to, inside2) {
  if (inside2 && from <= 0 && to >= tree.length)
    return tree;
  if (!inside2 && tree.type == lang.topNode)
    inside2 = true;
  for (let i = tree.children.length - 1; i >= 0; i--) {
    let pos = tree.positions[i] + from, child = tree.children[i], inner;
    if (pos < to && child instanceof Tree) {
      if (!(inner = cutTree(lang, child, from - pos, to - pos, inside2)))
        break;
      return !inside2 ? inner : new Tree(tree.type, tree.children.slice(0, i).concat(inner), tree.positions.slice(0, i + 1), pos + inner.length);
    }
  }
  return null;
}
function findStartInFragments(lang, fragments, startPos, editorState) {
  for (let f of fragments) {
    let from = f.from + (f.openStart ? 25 : 0), to = f.to - (f.openEnd ? 25 : 0);
    let found = from <= startPos && to > startPos && findState(lang, f.tree, 0 - f.offset, startPos, to), tree;
    if (found && (tree = cutTree(lang, f.tree, startPos + f.offset, found.pos + f.offset, false)))
      return { state: found.state, tree };
  }
  return { state: lang.streamParser.startState(editorState ? getIndentUnit(editorState) : 4), tree: Tree.empty };
}
var Parse = class {
  constructor(lang, input, fragments, ranges) {
    this.lang = lang;
    this.input = input;
    this.fragments = fragments;
    this.ranges = ranges;
    this.stoppedAt = null;
    this.chunks = [];
    this.chunkPos = [];
    this.chunk = [];
    this.chunkReused = void 0;
    this.rangeIndex = 0;
    this.to = ranges[ranges.length - 1].to;
    let context = ParseContext.get(), from = ranges[0].from;
    let { state, tree } = findStartInFragments(lang, fragments, from, context === null || context === void 0 ? void 0 : context.state);
    this.state = state;
    this.parsedPos = this.chunkStart = from + tree.length;
    if (tree.length) {
      this.chunks.push(tree);
      this.chunkPos.push(0);
    }
    if (context && this.parsedPos < context.viewport.from - 1e5) {
      this.state = this.lang.streamParser.startState(getIndentUnit(context.state));
      context.skipUntilInView(this.parsedPos, context.viewport.from);
      this.parsedPos = context.viewport.from;
    }
  }
  advance() {
    let context = ParseContext.get();
    let parseEnd = this.stoppedAt == null ? this.to : this.stoppedAt;
    let end = Math.min(parseEnd, this.chunkStart + 2048);
    if (context)
      end = Math.min(end, context.viewport.to);
    while (this.parsedPos < end)
      this.parseLine(context);
    if (this.chunkStart < this.parsedPos)
      this.finishChunk();
    if (this.parsedPos >= parseEnd)
      return this.finish();
    if (context && this.parsedPos > context.viewport.to) {
      context.skipUntilInView(this.parsedPos, parseEnd);
      return this.finish();
    }
    return null;
  }
  stopAt(pos) {
    this.stoppedAt = pos;
  }
  lineAfter(pos) {
    let chunk = this.input.chunk(pos);
    if (!this.input.lineChunks) {
      let eol = chunk.indexOf("\n");
      if (eol > -1)
        chunk = chunk.slice(0, eol);
    } else if (chunk == "\n") {
      chunk = "";
    }
    return pos + chunk.length <= this.to ? chunk : chunk.slice(0, this.to - pos);
  }
  nextLine() {
    let from = this.parsedPos, line = this.lineAfter(from), end = from + line.length;
    for (let index = this.rangeIndex; ; ) {
      let rangeEnd2 = this.ranges[index].to;
      if (rangeEnd2 >= end)
        break;
      line = line.slice(0, rangeEnd2 - (end - line.length));
      index++;
      if (index == this.ranges.length)
        break;
      let rangeStart = this.ranges[index].from;
      let after = this.lineAfter(rangeStart);
      line += after;
      end = rangeStart + after.length;
    }
    return { line, end };
  }
  skipGapsTo(pos, offset, side) {
    for (; ; ) {
      let end = this.ranges[this.rangeIndex].to, offPos = pos + offset;
      if (side > 0 ? end > offPos : end >= offPos)
        break;
      let start = this.ranges[++this.rangeIndex].from;
      offset += start - end;
    }
    return offset;
  }
  emitToken(id, from, to, size, offset) {
    if (this.ranges.length > 1) {
      offset = this.skipGapsTo(from, offset, 1);
      from += offset;
      let len0 = this.chunk.length;
      offset = this.skipGapsTo(to, offset, -1);
      to += offset;
      size += this.chunk.length - len0;
    }
    this.chunk.push(id, from, to, size);
    return offset;
  }
  parseLine(context) {
    let { line, end } = this.nextLine(), offset = 0, { streamParser } = this.lang;
    let stream = new StringStream(line, context ? context.state.tabSize : 4, context ? getIndentUnit(context.state) : 2);
    if (stream.eol()) {
      streamParser.blankLine(this.state, stream.indentUnit);
    } else {
      while (!stream.eol()) {
        let token = readToken(streamParser.token, stream, this.state);
        if (token)
          offset = this.emitToken(tokenID(token), this.parsedPos + stream.start, this.parsedPos + stream.pos, 4, offset);
      }
    }
    this.parsedPos = end;
    if (this.parsedPos < this.to)
      this.parsedPos++;
  }
  finishChunk() {
    let tree = Tree.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet,
      topID: 0,
      maxBufferLength: 2048,
      reused: this.chunkReused
    });
    tree = new Tree(tree.type, tree.children, tree.positions, tree.length, [[this.lang.stateAfter, this.lang.streamParser.copyState(this.state)]]);
    this.chunks.push(tree);
    this.chunkPos.push(this.chunkStart - this.ranges[0].from);
    this.chunk = [];
    this.chunkReused = void 0;
    this.chunkStart = this.parsedPos;
  }
  finish() {
    return new Tree(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
  }
};
function readToken(token, stream, state) {
  stream.start = stream.pos;
  for (let i = 0; i < 10; i++) {
    let result = token(stream, state);
    if (stream.pos > stream.start)
      return result;
  }
  throw new Error("Stream parser failed to advance stream.");
}
var tokenTable = /* @__PURE__ */ Object.create(null);
var typeArray = [NodeType.none];
var nodeSet = /* @__PURE__ */ new NodeSet(typeArray);
var warned = [];
function tokenID(tag) {
  return !tag ? 0 : tokenTable[tag] || (tokenTable[tag] = createTokenType(tag));
}
for (let [legacyName, name2] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "typeName"],
  ["attribute", "propertyName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  tokenTable[legacyName] = /* @__PURE__ */ tokenID(name2);
function warnForPart(part, msg) {
  if (warned.indexOf(part) > -1)
    return;
  warned.push(part);
  console.warn(msg);
}
function createTokenType(tagStr) {
  let tag = null;
  for (let part of tagStr.split(".")) {
    let value = tags[part];
    if (!value) {
      warnForPart(part, `Unknown highlighting tag ${part}`);
    } else if (typeof value == "function") {
      if (!tag)
        warnForPart(part, `Modifier ${part} used at start of tag`);
      else
        tag = value(tag);
    } else {
      if (tag)
        warnForPart(part, `Tag ${part} used as modifier`);
      else
        tag = value;
    }
  }
  if (!tag)
    return 0;
  let name2 = tagStr.replace(/ /g, "_"), type = NodeType.define({
    id: typeArray.length,
    name: name2,
    props: [styleTags({ [name2]: tag })]
  });
  typeArray.push(type);
  return type.id;
}
function docID(data) {
  let type = NodeType.define({ id: typeArray.length, name: "Document", props: [languageDataProp.add(() => data)] });
  typeArray.push(type);
  return type;
}

// node_modules/@codemirror/legacy-modes/mode/julia.js
function wordRegexp(words, end) {
  if (typeof end === "undefined") {
    end = "\\b";
  }
  return new RegExp("^((" + words.join(")|(") + "))" + end);
}
var octChar = "\\\\[0-7]{1,3}";
var hexChar = "\\\\x[A-Fa-f0-9]{1,2}";
var sChar = `\\\\[abefnrtv0%?'"\\\\]`;
var uChar = "([^\\u0027\\u005C\\uD800-\\uDFFF]|[\\uD800-\\uDFFF][\\uDC00-\\uDFFF])";
var operators = wordRegexp([
  "[<>]:",
  "[<>=]=",
  "<<=?",
  ">>>?=?",
  "=>",
  "->",
  "\\/\\/",
  "[\\\\%*+\\-<>!=\\/^|&\\u00F7\\u22BB]=?",
  "\\?",
  "\\$",
  "~",
  ":",
  "\\u00D7",
  "\\u2208",
  "\\u2209",
  "\\u220B",
  "\\u220C",
  "\\u2218",
  "\\u221A",
  "\\u221B",
  "\\u2229",
  "\\u222A",
  "\\u2260",
  "\\u2264",
  "\\u2265",
  "\\u2286",
  "\\u2288",
  "\\u228A",
  "\\u22C5",
  "\\b(in|isa)\\b(?!.?\\()"
], "");
var delimiters = /^[;,()[\]{}]/;
var identifiers = /^[_A-Za-z\u00A1-\u2217\u2219-\uFFFF][\w\u00A1-\u2217\u2219-\uFFFF]*!*/;
var chars = wordRegexp([octChar, hexChar, sChar, uChar], "'");
var openersList = [
  "begin",
  "function",
  "type",
  "struct",
  "immutable",
  "let",
  "macro",
  "for",
  "while",
  "quote",
  "if",
  "else",
  "elseif",
  "try",
  "finally",
  "catch",
  "do"
];
var closersList = ["end", "else", "elseif", "catch", "finally"];
var keywordsList = [
  "if",
  "else",
  "elseif",
  "while",
  "for",
  "begin",
  "let",
  "end",
  "do",
  "try",
  "catch",
  "finally",
  "return",
  "break",
  "continue",
  "global",
  "local",
  "const",
  "export",
  "import",
  "importall",
  "using",
  "function",
  "where",
  "macro",
  "module",
  "baremodule",
  "struct",
  "type",
  "mutable",
  "immutable",
  "quote",
  "typealias",
  "abstract",
  "primitive",
  "bitstype"
];
var builtinsList = ["true", "false", "nothing", "NaN", "Inf"];
var openers = wordRegexp(openersList);
var closers = wordRegexp(closersList);
var keywords = wordRegexp(keywordsList);
var builtins = wordRegexp(builtinsList);
var macro = /^@[_A-Za-z][\w]*/;
var symbol = /^:[_A-Za-z\u00A1-\uFFFF][\w\u00A1-\uFFFF]*!*/;
var stringPrefixes = /^(`|([_A-Za-z\u00A1-\uFFFF]*"("")?))/;
function inArray(state) {
  return state.nestedArrays > 0;
}
function inGenerator(state) {
  return state.nestedGenerators > 0;
}
function currentScope(state, n) {
  if (typeof n === "undefined") {
    n = 0;
  }
  if (state.scopes.length <= n) {
    return null;
  }
  return state.scopes[state.scopes.length - (n + 1)];
}
function tokenBase(stream, state) {
  if (stream.match("#=", false)) {
    state.tokenize = tokenComment;
    return state.tokenize(stream, state);
  }
  var leavingExpr = state.leavingExpr;
  if (stream.sol()) {
    leavingExpr = false;
  }
  state.leavingExpr = false;
  if (leavingExpr) {
    if (stream.match(/^'+/)) {
      return "operator";
    }
  }
  if (stream.match(/\.{4,}/)) {
    return "error";
  } else if (stream.match(/\.{1,3}/)) {
    return "operator";
  }
  if (stream.eatSpace()) {
    return null;
  }
  var ch = stream.peek();
  if (ch === "#") {
    stream.skipToEnd();
    return "comment";
  }
  if (ch === "[") {
    state.scopes.push("[");
    state.nestedArrays++;
  }
  if (ch === "(") {
    state.scopes.push("(");
    state.nestedGenerators++;
  }
  if (inArray(state) && ch === "]") {
    while (state.scopes.length && currentScope(state) !== "[") {
      state.scopes.pop();
    }
    state.scopes.pop();
    state.nestedArrays--;
    state.leavingExpr = true;
  }
  if (inGenerator(state) && ch === ")") {
    while (state.scopes.length && currentScope(state) !== "(") {
      state.scopes.pop();
    }
    state.scopes.pop();
    state.nestedGenerators--;
    state.leavingExpr = true;
  }
  if (inArray(state)) {
    if (state.lastToken == "end" && stream.match(":")) {
      return "operator";
    }
    if (stream.match("end")) {
      return "number";
    }
  }
  var match;
  if (match = stream.match(openers, false)) {
    state.scopes.push(match[0]);
  }
  if (stream.match(closers, false)) {
    state.scopes.pop();
  }
  if (stream.match(/^::(?![:\$])/)) {
    state.tokenize = tokenAnnotation;
    return state.tokenize(stream, state);
  }
  if (!leavingExpr && stream.match(symbol) || stream.match(/:([<>]:|<<=?|>>>?=?|->|\/\/|\.{2,3}|[\.\\%*+\-<>!\/^|&]=?|[~\?\$])/)) {
    return "builtin";
  }
  if (stream.match(operators)) {
    return "operator";
  }
  if (stream.match(/^\.?\d/, false)) {
    var imMatcher = RegExp(/^im\b/);
    var numberLiteral = false;
    if (stream.match(/^0x\.[0-9a-f_]+p[\+\-]?[_\d]+/i)) {
      numberLiteral = true;
    }
    if (stream.match(/^0x[0-9a-f_]+/i)) {
      numberLiteral = true;
    }
    if (stream.match(/^0b[01_]+/i)) {
      numberLiteral = true;
    }
    if (stream.match(/^0o[0-7_]+/i)) {
      numberLiteral = true;
    }
    if (stream.match(/^(?:(?:\d[_\d]*)?\.(?!\.)(?:\d[_\d]*)?|\d[_\d]*\.(?!\.)(?:\d[_\d]*))?([Eef][\+\-]?[_\d]+)?/i)) {
      numberLiteral = true;
    }
    if (stream.match(/^\d[_\d]*(e[\+\-]?\d+)?/i)) {
      numberLiteral = true;
    }
    if (numberLiteral) {
      stream.match(imMatcher);
      state.leavingExpr = true;
      return "number";
    }
  }
  if (stream.match("'")) {
    state.tokenize = tokenChar;
    return state.tokenize(stream, state);
  }
  if (stream.match(stringPrefixes)) {
    state.tokenize = tokenStringFactory(stream.current());
    return state.tokenize(stream, state);
  }
  if (stream.match(macro)) {
    return "meta";
  }
  if (stream.match(delimiters)) {
    return null;
  }
  if (stream.match(keywords)) {
    return "keyword";
  }
  if (stream.match(builtins)) {
    return "builtin";
  }
  var isDefinition = state.isDefinition || state.lastToken == "function" || state.lastToken == "macro" || state.lastToken == "type" || state.lastToken == "struct" || state.lastToken == "immutable";
  if (stream.match(identifiers)) {
    if (isDefinition) {
      if (stream.peek() === ".") {
        state.isDefinition = true;
        return "variable";
      }
      state.isDefinition = false;
      return "def";
    }
    state.leavingExpr = true;
    return "variable";
  }
  stream.next();
  return "error";
}
function tokenAnnotation(stream, state) {
  stream.match(/.*?(?=[,;{}()=\s]|$)/);
  if (stream.match("{")) {
    state.nestedParameters++;
  } else if (stream.match("}") && state.nestedParameters > 0) {
    state.nestedParameters--;
  }
  if (state.nestedParameters > 0) {
    stream.match(/.*?(?={|})/) || stream.next();
  } else if (state.nestedParameters == 0) {
    state.tokenize = tokenBase;
  }
  return "builtin";
}
function tokenComment(stream, state) {
  if (stream.match("#=")) {
    state.nestedComments++;
  }
  if (!stream.match(/.*?(?=(#=|=#))/)) {
    stream.skipToEnd();
  }
  if (stream.match("=#")) {
    state.nestedComments--;
    if (state.nestedComments == 0)
      state.tokenize = tokenBase;
  }
  return "comment";
}
function tokenChar(stream, state) {
  var isChar = false, match;
  if (stream.match(chars)) {
    isChar = true;
  } else if (match = stream.match(/\\u([a-f0-9]{1,4})(?=')/i)) {
    var value = parseInt(match[1], 16);
    if (value <= 55295 || value >= 57344) {
      isChar = true;
      stream.next();
    }
  } else if (match = stream.match(/\\U([A-Fa-f0-9]{5,8})(?=')/)) {
    var value = parseInt(match[1], 16);
    if (value <= 1114111) {
      isChar = true;
      stream.next();
    }
  }
  if (isChar) {
    state.leavingExpr = true;
    state.tokenize = tokenBase;
    return "string";
  }
  if (!stream.match(/^[^']+(?=')/)) {
    stream.skipToEnd();
  }
  if (stream.match("'")) {
    state.tokenize = tokenBase;
  }
  return "error";
}
function tokenStringFactory(delimiter) {
  if (delimiter.substr(-3) === '"""') {
    delimiter = '"""';
  } else if (delimiter.substr(-1) === '"') {
    delimiter = '"';
  }
  function tokenString(stream, state) {
    if (stream.eat("\\")) {
      stream.next();
    } else if (stream.match(delimiter)) {
      state.tokenize = tokenBase;
      state.leavingExpr = true;
      return "string";
    } else {
      stream.eat(/[`"]/);
    }
    stream.eatWhile(/[^\\`"]/);
    return "string";
  }
  return tokenString;
}
var julia = {
  startState: function() {
    return {
      tokenize: tokenBase,
      scopes: [],
      lastToken: null,
      leavingExpr: false,
      isDefinition: false,
      nestedArrays: 0,
      nestedComments: 0,
      nestedGenerators: 0,
      nestedParameters: 0,
      firstParenPos: -1
    };
  },
  token: function(stream, state) {
    var style = state.tokenize(stream, state);
    var current = stream.current();
    if (current && style) {
      state.lastToken = current;
    }
    return style;
  },
  indent: function(state, textAfter, cx) {
    var delta = 0;
    if (textAfter === "]" || textAfter === ")" || /^end\b/.test(textAfter) || /^else/.test(textAfter) || /^catch\b/.test(textAfter) || /^elseif\b/.test(textAfter) || /^finally/.test(textAfter)) {
      delta = -1;
    }
    return (state.scopes.length + delta) * cx.unit;
  },
  languageData: {
    indentOnInput: /^\s*(end|else|catch|finally)\b$/,
    commentTokens: { line: "#", block: { open: "#=", close: "=#" } },
    closeBrackets: { brackets: ["(", "[", "{", '"'] },
    autocomplete: keywordsList.concat(builtinsList)
  }
};

// node_modules/@lezer/lr/dist/index.js
var Stack = class {
  constructor(p, stack, state, reducePos, pos, score2, buffer, bufferBase, curContext, lookAhead = 0, parent) {
    this.p = p;
    this.stack = stack;
    this.state = state;
    this.reducePos = reducePos;
    this.pos = pos;
    this.score = score2;
    this.buffer = buffer;
    this.bufferBase = bufferBase;
    this.curContext = curContext;
    this.lookAhead = lookAhead;
    this.parent = parent;
  }
  toString() {
    return `[${this.stack.filter((_, i) => i % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  static start(p, state, pos = 0) {
    let cx = p.parser.context;
    return new Stack(p, [], state, pos, pos, 0, [], 0, cx ? new StackContext(cx, cx.start) : null, 0, null);
  }
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  pushState(state, start) {
    this.stack.push(this.state, start, this.bufferBase + this.buffer.length);
    this.state = state;
  }
  reduce(action) {
    let depth = action >> 19, type = action & 65535;
    let { parser: parser2 } = this.p;
    let dPrec = parser2.dynamicPrecedence(type);
    if (dPrec)
      this.score += dPrec;
    if (depth == 0) {
      if (type < parser2.minRepeatTerm)
        this.storeNode(type, this.reducePos, this.reducePos, 4, true);
      this.pushState(parser2.getGoto(this.state, type, true), this.reducePos);
      this.reduceContext(type, this.reducePos);
      return;
    }
    let base2 = this.stack.length - (depth - 1) * 3 - (action & 262144 ? 6 : 0);
    let start = this.stack[base2 - 2];
    let bufferBase = this.stack[base2 - 1], count = this.bufferBase + this.buffer.length - bufferBase;
    if (type < parser2.minRepeatTerm || action & 131072) {
      let pos = parser2.stateFlag(this.state, 1) ? this.pos : this.reducePos;
      this.storeNode(type, start, pos, count + 4, true);
    }
    if (action & 262144) {
      this.state = this.stack[base2];
    } else {
      let baseStateID = this.stack[base2 - 3];
      this.state = parser2.getGoto(baseStateID, type, true);
    }
    while (this.stack.length > base2)
      this.stack.pop();
    this.reduceContext(type, start);
  }
  storeNode(term, start, end, size = 4, isReduce = false) {
    if (term == 0) {
      let cur2 = this, top2 = this.buffer.length;
      if (top2 == 0 && cur2.parent) {
        top2 = cur2.bufferBase - cur2.parent.bufferBase;
        cur2 = cur2.parent;
      }
      if (top2 > 0 && cur2.buffer[top2 - 4] == 0 && cur2.buffer[top2 - 1] > -1) {
        if (start == end)
          return;
        if (cur2.buffer[top2 - 2] >= start) {
          cur2.buffer[top2 - 2] = end;
          return;
        }
      }
    }
    if (!isReduce || this.pos == end) {
      this.buffer.push(term, start, end, size);
    } else {
      let index = this.buffer.length;
      if (index > 0 && this.buffer[index - 4] != 0)
        while (index > 0 && this.buffer[index - 2] > end) {
          this.buffer[index] = this.buffer[index - 4];
          this.buffer[index + 1] = this.buffer[index - 3];
          this.buffer[index + 2] = this.buffer[index - 2];
          this.buffer[index + 3] = this.buffer[index - 1];
          index -= 4;
          if (size > 4)
            size -= 4;
        }
      this.buffer[index] = term;
      this.buffer[index + 1] = start;
      this.buffer[index + 2] = end;
      this.buffer[index + 3] = size;
    }
  }
  shift(action, next, nextEnd) {
    let start = this.pos;
    if (action & 131072) {
      this.pushState(action & 65535, this.pos);
    } else if ((action & 262144) == 0) {
      let nextState = action, { parser: parser2 } = this.p;
      if (nextEnd > this.pos || next <= parser2.maxNode) {
        this.pos = nextEnd;
        if (!parser2.stateFlag(nextState, 1))
          this.reducePos = nextEnd;
      }
      this.pushState(nextState, start);
      this.shiftContext(next, start);
      if (next <= parser2.maxNode)
        this.buffer.push(next, start, nextEnd, 4);
    } else {
      this.pos = nextEnd;
      this.shiftContext(next, start);
      if (next <= this.p.parser.maxNode)
        this.buffer.push(next, start, nextEnd, 4);
    }
  }
  apply(action, next, nextEnd) {
    if (action & 65536)
      this.reduce(action);
    else
      this.shift(action, next, nextEnd);
  }
  useNode(value, next) {
    let index = this.p.reused.length - 1;
    if (index < 0 || this.p.reused[index] != value) {
      this.p.reused.push(value);
      index++;
    }
    let start = this.pos;
    this.reducePos = this.pos = start + value.length;
    this.pushState(next, start);
    this.buffer.push(index, start, this.reducePos, -1);
    if (this.curContext)
      this.updateContext(this.curContext.tracker.reuse(this.curContext.context, value, this, this.p.stream.reset(this.pos - value.length)));
  }
  split() {
    let parent = this;
    let off = parent.buffer.length;
    while (off > 0 && parent.buffer[off - 2] > parent.reducePos)
      off -= 4;
    let buffer = parent.buffer.slice(off), base2 = parent.bufferBase + off;
    while (parent && base2 == parent.bufferBase)
      parent = parent.parent;
    return new Stack(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, buffer, base2, this.curContext, this.lookAhead, parent);
  }
  recoverByDelete(next, nextEnd) {
    let isNode = next <= this.p.parser.maxNode;
    if (isNode)
      this.storeNode(next, this.pos, nextEnd, 4);
    this.storeNode(0, this.pos, nextEnd, isNode ? 8 : 4);
    this.pos = this.reducePos = nextEnd;
    this.score -= 190;
  }
  canShift(term) {
    for (let sim = new SimulatedStack(this); ; ) {
      let action = this.p.parser.stateSlot(sim.state, 4) || this.p.parser.hasAction(sim.state, term);
      if ((action & 65536) == 0)
        return true;
      if (action == 0)
        return false;
      sim.reduce(action);
    }
  }
  recoverByInsert(next) {
    if (this.stack.length >= 300)
      return [];
    let nextStates = this.p.parser.nextStates(this.state);
    if (nextStates.length > 4 << 1 || this.stack.length >= 120) {
      let best = [];
      for (let i = 0, s; i < nextStates.length; i += 2) {
        if ((s = nextStates[i + 1]) != this.state && this.p.parser.hasAction(s, next))
          best.push(nextStates[i], s);
      }
      if (this.stack.length < 120)
        for (let i = 0; best.length < 4 << 1 && i < nextStates.length; i += 2) {
          let s = nextStates[i + 1];
          if (!best.some((v, i2) => i2 & 1 && v == s))
            best.push(nextStates[i], s);
        }
      nextStates = best;
    }
    let result = [];
    for (let i = 0; i < nextStates.length && result.length < 4; i += 2) {
      let s = nextStates[i + 1];
      if (s == this.state)
        continue;
      let stack = this.split();
      stack.storeNode(0, stack.pos, stack.pos, 4, true);
      stack.pushState(s, this.pos);
      stack.shiftContext(nextStates[i], this.pos);
      stack.score -= 200;
      result.push(stack);
    }
    return result;
  }
  forceReduce() {
    let reduce = this.p.parser.stateSlot(this.state, 5);
    if ((reduce & 65536) == 0)
      return false;
    if (!this.p.parser.validAction(this.state, reduce)) {
      this.storeNode(0, this.reducePos, this.reducePos, 4, true);
      this.score -= 100;
    }
    this.reduce(reduce);
    return true;
  }
  forceAll() {
    while (!this.p.parser.stateFlag(this.state, 2) && this.forceReduce()) {
    }
    return this;
  }
  get deadEnd() {
    if (this.stack.length != 3)
      return false;
    let { parser: parser2 } = this.p;
    return parser2.data[parser2.stateSlot(this.state, 1)] == 65535 && !parser2.stateSlot(this.state, 4);
  }
  restart() {
    this.state = this.stack[0];
    this.stack.length = 0;
  }
  sameState(other) {
    if (this.state != other.state || this.stack.length != other.stack.length)
      return false;
    for (let i = 0; i < this.stack.length; i += 3)
      if (this.stack[i] != other.stack[i])
        return false;
    return true;
  }
  get parser() {
    return this.p.parser;
  }
  dialectEnabled(dialectID) {
    return this.p.parser.dialect.flags[dialectID];
  }
  shiftContext(term, start) {
    if (this.curContext)
      this.updateContext(this.curContext.tracker.shift(this.curContext.context, term, this, this.p.stream.reset(start)));
  }
  reduceContext(term, start) {
    if (this.curContext)
      this.updateContext(this.curContext.tracker.reduce(this.curContext.context, term, this, this.p.stream.reset(start)));
  }
  emitContext() {
    let last = this.buffer.length - 1;
    if (last < 0 || this.buffer[last] != -3)
      this.buffer.push(this.curContext.hash, this.reducePos, this.reducePos, -3);
  }
  emitLookAhead() {
    let last = this.buffer.length - 1;
    if (last < 0 || this.buffer[last] != -4)
      this.buffer.push(this.lookAhead, this.reducePos, this.reducePos, -4);
  }
  updateContext(context) {
    if (context != this.curContext.context) {
      let newCx = new StackContext(this.curContext.tracker, context);
      if (newCx.hash != this.curContext.hash)
        this.emitContext();
      this.curContext = newCx;
    }
  }
  setLookAhead(lookAhead) {
    if (lookAhead > this.lookAhead) {
      this.emitLookAhead();
      this.lookAhead = lookAhead;
    }
  }
  close() {
    if (this.curContext && this.curContext.tracker.strict)
      this.emitContext();
    if (this.lookAhead > 0)
      this.emitLookAhead();
  }
};
var StackContext = class {
  constructor(tracker, context) {
    this.tracker = tracker;
    this.context = context;
    this.hash = tracker.strict ? tracker.hash(context) : 0;
  }
};
var Recover;
(function(Recover2) {
  Recover2[Recover2["Insert"] = 200] = "Insert";
  Recover2[Recover2["Delete"] = 190] = "Delete";
  Recover2[Recover2["Reduce"] = 100] = "Reduce";
  Recover2[Recover2["MaxNext"] = 4] = "MaxNext";
  Recover2[Recover2["MaxInsertStackDepth"] = 300] = "MaxInsertStackDepth";
  Recover2[Recover2["DampenInsertStackDepth"] = 120] = "DampenInsertStackDepth";
})(Recover || (Recover = {}));
var SimulatedStack = class {
  constructor(start) {
    this.start = start;
    this.state = start.state;
    this.stack = start.stack;
    this.base = this.stack.length;
  }
  reduce(action) {
    let term = action & 65535, depth = action >> 19;
    if (depth == 0) {
      if (this.stack == this.start.stack)
        this.stack = this.stack.slice();
      this.stack.push(this.state, 0, 0);
      this.base += 3;
    } else {
      this.base -= (depth - 1) * 3;
    }
    let goto = this.start.p.parser.getGoto(this.stack[this.base - 3], term, true);
    this.state = goto;
  }
};
var StackBufferCursor = class {
  constructor(stack, pos, index) {
    this.stack = stack;
    this.pos = pos;
    this.index = index;
    this.buffer = stack.buffer;
    if (this.index == 0)
      this.maybeNext();
  }
  static create(stack, pos = stack.bufferBase + stack.buffer.length) {
    return new StackBufferCursor(stack, pos, pos - stack.bufferBase);
  }
  maybeNext() {
    let next = this.stack.parent;
    if (next != null) {
      this.index = this.stack.bufferBase - next.bufferBase;
      this.stack = next;
      this.buffer = next.buffer;
    }
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4;
    this.pos -= 4;
    if (this.index == 0)
      this.maybeNext();
  }
  fork() {
    return new StackBufferCursor(this.stack, this.pos, this.index);
  }
};
var CachedToken = class {
  constructor() {
    this.start = -1;
    this.value = -1;
    this.end = -1;
    this.extended = -1;
    this.lookAhead = 0;
    this.mask = 0;
    this.context = 0;
  }
};
var nullToken = new CachedToken();
var InputStream = class {
  constructor(input, ranges) {
    this.input = input;
    this.ranges = ranges;
    this.chunk = "";
    this.chunkOff = 0;
    this.chunk2 = "";
    this.chunk2Pos = 0;
    this.next = -1;
    this.token = nullToken;
    this.rangeIndex = 0;
    this.pos = this.chunkPos = ranges[0].from;
    this.range = ranges[0];
    this.end = ranges[ranges.length - 1].to;
    this.readNext();
  }
  resolveOffset(offset, assoc) {
    let range = this.range, index = this.rangeIndex;
    let pos = this.pos + offset;
    while (pos < range.from) {
      if (!index)
        return null;
      let next = this.ranges[--index];
      pos -= range.from - next.to;
      range = next;
    }
    while (assoc < 0 ? pos > range.to : pos >= range.to) {
      if (index == this.ranges.length - 1)
        return null;
      let next = this.ranges[++index];
      pos += next.from - range.to;
      range = next;
    }
    return pos;
  }
  peek(offset) {
    let idx = this.chunkOff + offset, pos, result;
    if (idx >= 0 && idx < this.chunk.length) {
      pos = this.pos + offset;
      result = this.chunk.charCodeAt(idx);
    } else {
      let resolved = this.resolveOffset(offset, 1);
      if (resolved == null)
        return -1;
      pos = resolved;
      if (pos >= this.chunk2Pos && pos < this.chunk2Pos + this.chunk2.length) {
        result = this.chunk2.charCodeAt(pos - this.chunk2Pos);
      } else {
        let i = this.rangeIndex, range = this.range;
        while (range.to <= pos)
          range = this.ranges[++i];
        this.chunk2 = this.input.chunk(this.chunk2Pos = pos);
        if (pos + this.chunk2.length > range.to)
          this.chunk2 = this.chunk2.slice(0, range.to - pos);
        result = this.chunk2.charCodeAt(0);
      }
    }
    if (pos > this.token.lookAhead)
      this.token.lookAhead = pos;
    return result;
  }
  acceptToken(token, endOffset = 0) {
    let end = endOffset ? this.resolveOffset(endOffset, -1) : this.pos;
    if (end == null || end < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = token;
    this.token.end = end;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk, chunkPos } = this;
      this.chunk = this.chunk2;
      this.chunkPos = this.chunk2Pos;
      this.chunk2 = chunk;
      this.chunk2Pos = chunkPos;
      this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk;
      this.chunk2Pos = this.chunkPos;
      let nextChunk = this.input.chunk(this.pos);
      let end = this.pos + nextChunk.length;
      this.chunk = end > this.range.to ? nextChunk.slice(0, this.range.to - this.pos) : nextChunk;
      this.chunkPos = this.pos;
      this.chunkOff = 0;
    }
  }
  readNext() {
    if (this.chunkOff >= this.chunk.length) {
      this.getChunk();
      if (this.chunkOff == this.chunk.length)
        return this.next = -1;
    }
    return this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  advance(n = 1) {
    this.chunkOff += n;
    while (this.pos + n >= this.range.to) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      n -= this.range.to - this.pos;
      this.range = this.ranges[++this.rangeIndex];
      this.pos = this.range.from;
    }
    this.pos += n;
    if (this.pos > this.token.lookAhead)
      this.token.lookAhead = this.pos;
    return this.readNext();
  }
  setDone() {
    this.pos = this.chunkPos = this.end;
    this.range = this.ranges[this.rangeIndex = this.ranges.length - 1];
    this.chunk = "";
    return this.next = -1;
  }
  reset(pos, token) {
    if (token) {
      this.token = token;
      token.start = token.lookAhead = pos;
      token.value = token.extended = -1;
    } else {
      this.token = nullToken;
    }
    if (this.pos != pos) {
      this.pos = pos;
      if (pos == this.end) {
        this.setDone();
        return this;
      }
      while (pos < this.range.from)
        this.range = this.ranges[--this.rangeIndex];
      while (pos >= this.range.to)
        this.range = this.ranges[++this.rangeIndex];
      if (pos >= this.chunkPos && pos < this.chunkPos + this.chunk.length) {
        this.chunkOff = pos - this.chunkPos;
      } else {
        this.chunk = "";
        this.chunkOff = 0;
      }
      this.readNext();
    }
    return this;
  }
  read(from, to) {
    if (from >= this.chunkPos && to <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(from - this.chunkPos, to - this.chunkPos);
    if (from >= this.range.from && to <= this.range.to)
      return this.input.read(from, to);
    let result = "";
    for (let r of this.ranges) {
      if (r.from >= to)
        break;
      if (r.to > from)
        result += this.input.read(Math.max(r.from, from), Math.min(r.to, to));
    }
    return result;
  }
};
var TokenGroup = class {
  constructor(data, id) {
    this.data = data;
    this.id = id;
  }
  token(input, stack) {
    readToken2(this.data, input, stack, this.id);
  }
};
TokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false;
var ExternalTokenizer = class {
  constructor(token, options = {}) {
    this.token = token;
    this.contextual = !!options.contextual;
    this.fallback = !!options.fallback;
    this.extend = !!options.extend;
  }
};
function readToken2(data, input, stack, group) {
  let state = 0, groupMask = 1 << group, { parser: parser2 } = stack.p, { dialect } = parser2;
  scan:
    for (; ; ) {
      if ((groupMask & data[state]) == 0)
        break;
      let accEnd = data[state + 1];
      for (let i = state + 3; i < accEnd; i += 2)
        if ((data[i + 1] & groupMask) > 0) {
          let term = data[i];
          if (dialect.allows(term) && (input.token.value == -1 || input.token.value == term || parser2.overrides(term, input.token.value))) {
            input.acceptToken(term);
            break;
          }
        }
      for (let next = input.next, low = 0, high = data[state + 2]; low < high; ) {
        let mid = low + high >> 1;
        let index = accEnd + mid + (mid << 1);
        let from = data[index], to = data[index + 1];
        if (next < from)
          high = mid;
        else if (next >= to)
          low = mid + 1;
        else {
          state = data[index + 2];
          input.advance();
          continue scan;
        }
      }
      break;
    }
}
function decodeArray(input, Type = Uint16Array) {
  if (typeof input != "string")
    return input;
  let array = null;
  for (let pos = 0, out = 0; pos < input.length; ) {
    let value = 0;
    for (; ; ) {
      let next = input.charCodeAt(pos++), stop = false;
      if (next == 126) {
        value = 65535;
        break;
      }
      if (next >= 92)
        next--;
      if (next >= 34)
        next--;
      let digit = next - 32;
      if (digit >= 46) {
        digit -= 46;
        stop = true;
      }
      value += digit;
      if (stop)
        break;
      value *= 46;
    }
    if (array)
      array[out++] = value;
    else
      array = new Type(value);
  }
  return array;
}
var verbose = typeof process != "undefined" && /\bparse\b/.test(process.env.LOG);
var stackIDs = null;
var Safety;
(function(Safety2) {
  Safety2[Safety2["Margin"] = 25] = "Margin";
})(Safety || (Safety = {}));
function cutAt(tree, pos, side) {
  let cursor = tree.fullCursor();
  cursor.moveTo(pos);
  for (; ; ) {
    if (!(side < 0 ? cursor.childBefore(pos) : cursor.childAfter(pos)))
      for (; ; ) {
        if ((side < 0 ? cursor.to < pos : cursor.from > pos) && !cursor.type.isError)
          return side < 0 ? Math.max(0, Math.min(cursor.to - 1, pos - 25)) : Math.min(tree.length, Math.max(cursor.from + 1, pos + 25));
        if (side < 0 ? cursor.prevSibling() : cursor.nextSibling())
          break;
        if (!cursor.parent())
          return side < 0 ? 0 : tree.length;
      }
  }
}
var FragmentCursor = class {
  constructor(fragments, nodeSet2) {
    this.fragments = fragments;
    this.nodeSet = nodeSet2;
    this.i = 0;
    this.fragment = null;
    this.safeFrom = -1;
    this.safeTo = -1;
    this.trees = [];
    this.start = [];
    this.index = [];
    this.nextFragment();
  }
  nextFragment() {
    let fr = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (fr) {
      this.safeFrom = fr.openStart ? cutAt(fr.tree, fr.from + fr.offset, 1) - fr.offset : fr.from;
      this.safeTo = fr.openEnd ? cutAt(fr.tree, fr.to + fr.offset, -1) - fr.offset : fr.to;
      while (this.trees.length) {
        this.trees.pop();
        this.start.pop();
        this.index.pop();
      }
      this.trees.push(fr.tree);
      this.start.push(-fr.offset);
      this.index.push(0);
      this.nextStart = this.safeFrom;
    } else {
      this.nextStart = 1e9;
    }
  }
  nodeAt(pos) {
    if (pos < this.nextStart)
      return null;
    while (this.fragment && this.safeTo <= pos)
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let last = this.trees.length - 1;
      if (last < 0) {
        this.nextFragment();
        return null;
      }
      let top2 = this.trees[last], index = this.index[last];
      if (index == top2.children.length) {
        this.trees.pop();
        this.start.pop();
        this.index.pop();
        continue;
      }
      let next = top2.children[index];
      let start = this.start[last] + top2.positions[index];
      if (start > pos) {
        this.nextStart = start;
        return null;
      }
      if (next instanceof Tree) {
        if (start == pos) {
          if (start < this.safeFrom)
            return null;
          let end = start + next.length;
          if (end <= this.safeTo) {
            let lookAhead = next.prop(NodeProp.lookAhead);
            if (!lookAhead || end + lookAhead < this.fragment.to)
              return next;
          }
        }
        this.index[last]++;
        if (start + next.length >= Math.max(this.safeFrom, pos)) {
          this.trees.push(next);
          this.start.push(start);
          this.index.push(0);
        }
      } else {
        this.index[last]++;
        this.nextStart = start + next.length;
      }
    }
  }
};
var TokenCache = class {
  constructor(parser2, stream) {
    this.stream = stream;
    this.tokens = [];
    this.mainToken = null;
    this.actions = [];
    this.tokens = parser2.tokenizers.map((_) => new CachedToken());
  }
  getActions(stack) {
    let actionIndex = 0;
    let main = null;
    let { parser: parser2 } = stack.p, { tokenizers } = parser2;
    let mask = parser2.stateSlot(stack.state, 3);
    let context = stack.curContext ? stack.curContext.hash : 0;
    let lookAhead = 0;
    for (let i = 0; i < tokenizers.length; i++) {
      if ((1 << i & mask) == 0)
        continue;
      let tokenizer = tokenizers[i], token = this.tokens[i];
      if (main && !tokenizer.fallback)
        continue;
      if (tokenizer.contextual || token.start != stack.pos || token.mask != mask || token.context != context) {
        this.updateCachedToken(token, tokenizer, stack);
        token.mask = mask;
        token.context = context;
      }
      if (token.lookAhead > token.end + 25)
        lookAhead = Math.max(token.lookAhead, lookAhead);
      if (token.value != 0) {
        let startIndex = actionIndex;
        if (token.extended > -1)
          actionIndex = this.addActions(stack, token.extended, token.end, actionIndex);
        actionIndex = this.addActions(stack, token.value, token.end, actionIndex);
        if (!tokenizer.extend) {
          main = token;
          if (actionIndex > startIndex)
            break;
        }
      }
    }
    while (this.actions.length > actionIndex)
      this.actions.pop();
    if (lookAhead)
      stack.setLookAhead(lookAhead);
    if (!main && stack.pos == this.stream.end) {
      main = new CachedToken();
      main.value = stack.p.parser.eofTerm;
      main.start = main.end = stack.pos;
      actionIndex = this.addActions(stack, main.value, main.end, actionIndex);
    }
    this.mainToken = main;
    return this.actions;
  }
  getMainToken(stack) {
    if (this.mainToken)
      return this.mainToken;
    let main = new CachedToken(), { pos, p } = stack;
    main.start = pos;
    main.end = Math.min(pos + 1, p.stream.end);
    main.value = pos == p.stream.end ? p.parser.eofTerm : 0;
    return main;
  }
  updateCachedToken(token, tokenizer, stack) {
    tokenizer.token(this.stream.reset(stack.pos, token), stack);
    if (token.value > -1) {
      let { parser: parser2 } = stack.p;
      for (let i = 0; i < parser2.specialized.length; i++)
        if (parser2.specialized[i] == token.value) {
          let result = parser2.specializers[i](this.stream.read(token.start, token.end), stack);
          if (result >= 0 && stack.p.parser.dialect.allows(result >> 1)) {
            if ((result & 1) == 0)
              token.value = result >> 1;
            else
              token.extended = result >> 1;
            break;
          }
        }
    } else {
      token.value = 0;
      token.end = Math.min(stack.p.stream.end, stack.pos + 1);
    }
  }
  putAction(action, token, end, index) {
    for (let i = 0; i < index; i += 3)
      if (this.actions[i] == action)
        return index;
    this.actions[index++] = action;
    this.actions[index++] = token;
    this.actions[index++] = end;
    return index;
  }
  addActions(stack, token, end, index) {
    let { state } = stack, { parser: parser2 } = stack.p, { data } = parser2;
    for (let set = 0; set < 2; set++) {
      for (let i = parser2.stateSlot(state, set ? 2 : 1); ; i += 3) {
        if (data[i] == 65535) {
          if (data[i + 1] == 1) {
            i = pair(data, i + 2);
          } else {
            if (index == 0 && data[i + 1] == 2)
              index = this.putAction(pair(data, i + 1), token, end, index);
            break;
          }
        }
        if (data[i] == token)
          index = this.putAction(pair(data, i + 1), token, end, index);
      }
    }
    return index;
  }
};
var Rec;
(function(Rec2) {
  Rec2[Rec2["Distance"] = 5] = "Distance";
  Rec2[Rec2["MaxRemainingPerStep"] = 3] = "MaxRemainingPerStep";
  Rec2[Rec2["MinBufferLengthPrune"] = 200] = "MinBufferLengthPrune";
  Rec2[Rec2["ForceReduceLimit"] = 10] = "ForceReduceLimit";
})(Rec || (Rec = {}));
var Parse2 = class {
  constructor(parser2, input, fragments, ranges) {
    this.parser = parser2;
    this.input = input;
    this.ranges = ranges;
    this.recovering = 0;
    this.nextStackID = 9812;
    this.minStackPos = 0;
    this.reused = [];
    this.stoppedAt = null;
    this.stream = new InputStream(input, ranges);
    this.tokens = new TokenCache(parser2, this.stream);
    this.topTerm = parser2.top[1];
    let { from } = ranges[0];
    this.stacks = [Stack.start(this, parser2.top[0], from)];
    this.fragments = fragments.length && this.stream.end - from > parser2.bufferLength * 4 ? new FragmentCursor(fragments, parser2.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  advance() {
    let stacks = this.stacks, pos = this.minStackPos;
    let newStacks = this.stacks = [];
    let stopped, stoppedTokens;
    for (let i = 0; i < stacks.length; i++) {
      let stack = stacks[i];
      for (; ; ) {
        this.tokens.mainToken = null;
        if (stack.pos > pos) {
          newStacks.push(stack);
        } else if (this.advanceStack(stack, newStacks, stacks)) {
          continue;
        } else {
          if (!stopped) {
            stopped = [];
            stoppedTokens = [];
          }
          stopped.push(stack);
          let tok = this.tokens.getMainToken(stack);
          stoppedTokens.push(tok.value, tok.end);
        }
        break;
      }
    }
    if (!newStacks.length) {
      let finished = stopped && findFinished(stopped);
      if (finished)
        return this.stackToTree(finished);
      if (this.parser.strict) {
        if (verbose && stopped)
          console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none"));
        throw new SyntaxError("No parse at " + pos);
      }
      if (!this.recovering)
        this.recovering = 5;
    }
    if (this.recovering && stopped) {
      let finished = this.runRecovery(stopped, stoppedTokens, newStacks);
      if (finished)
        return this.stackToTree(finished.forceAll());
    }
    if (this.recovering) {
      let maxRemaining = this.recovering == 1 ? 1 : this.recovering * 3;
      if (newStacks.length > maxRemaining) {
        newStacks.sort((a, b) => b.score - a.score);
        while (newStacks.length > maxRemaining)
          newStacks.pop();
      }
      if (newStacks.some((s) => s.reducePos > pos))
        this.recovering--;
    } else if (newStacks.length > 1) {
      outer:
        for (let i = 0; i < newStacks.length - 1; i++) {
          let stack = newStacks[i];
          for (let j = i + 1; j < newStacks.length; j++) {
            let other = newStacks[j];
            if (stack.sameState(other) || stack.buffer.length > 200 && other.buffer.length > 200) {
              if ((stack.score - other.score || stack.buffer.length - other.buffer.length) > 0) {
                newStacks.splice(j--, 1);
              } else {
                newStacks.splice(i--, 1);
                continue outer;
              }
            }
          }
        }
    }
    this.minStackPos = newStacks[0].pos;
    for (let i = 1; i < newStacks.length; i++)
      if (newStacks[i].pos < this.minStackPos)
        this.minStackPos = newStacks[i].pos;
    return null;
  }
  stopAt(pos) {
    if (this.stoppedAt != null && this.stoppedAt < pos)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = pos;
  }
  advanceStack(stack, stacks, split) {
    let start = stack.pos, { parser: parser2 } = this;
    let base2 = verbose ? this.stackID(stack) + " -> " : "";
    if (this.stoppedAt != null && start > this.stoppedAt)
      return stack.forceReduce() ? stack : null;
    if (this.fragments) {
      let strictCx = stack.curContext && stack.curContext.tracker.strict, cxHash = strictCx ? stack.curContext.hash : 0;
      for (let cached = this.fragments.nodeAt(start); cached; ) {
        let match = this.parser.nodeSet.types[cached.type.id] == cached.type ? parser2.getGoto(stack.state, cached.type.id) : -1;
        if (match > -1 && cached.length && (!strictCx || (cached.prop(NodeProp.contextHash) || 0) == cxHash)) {
          stack.useNode(cached, match);
          if (verbose)
            console.log(base2 + this.stackID(stack) + ` (via reuse of ${parser2.getName(cached.type.id)})`);
          return true;
        }
        if (!(cached instanceof Tree) || cached.children.length == 0 || cached.positions[0] > 0)
          break;
        let inner = cached.children[0];
        if (inner instanceof Tree && cached.positions[0] == 0)
          cached = inner;
        else
          break;
      }
    }
    let defaultReduce = parser2.stateSlot(stack.state, 4);
    if (defaultReduce > 0) {
      stack.reduce(defaultReduce);
      if (verbose)
        console.log(base2 + this.stackID(stack) + ` (via always-reduce ${parser2.getName(defaultReduce & 65535)})`);
      return true;
    }
    let actions = this.tokens.getActions(stack);
    for (let i = 0; i < actions.length; ) {
      let action = actions[i++], term = actions[i++], end = actions[i++];
      let last = i == actions.length || !split;
      let localStack = last ? stack : stack.split();
      localStack.apply(action, term, end);
      if (verbose)
        console.log(base2 + this.stackID(localStack) + ` (via ${(action & 65536) == 0 ? "shift" : `reduce of ${parser2.getName(action & 65535)}`} for ${parser2.getName(term)} @ ${start}${localStack == stack ? "" : ", split"})`);
      if (last)
        return true;
      else if (localStack.pos > start)
        stacks.push(localStack);
      else
        split.push(localStack);
    }
    return false;
  }
  advanceFully(stack, newStacks) {
    let pos = stack.pos;
    for (; ; ) {
      if (!this.advanceStack(stack, null, null))
        return false;
      if (stack.pos > pos) {
        pushStackDedup(stack, newStacks);
        return true;
      }
    }
  }
  runRecovery(stacks, tokens, newStacks) {
    let finished = null, restarted = false;
    for (let i = 0; i < stacks.length; i++) {
      let stack = stacks[i], token = tokens[i << 1], tokenEnd = tokens[(i << 1) + 1];
      let base2 = verbose ? this.stackID(stack) + " -> " : "";
      if (stack.deadEnd) {
        if (restarted)
          continue;
        restarted = true;
        stack.restart();
        if (verbose)
          console.log(base2 + this.stackID(stack) + " (restarted)");
        let done = this.advanceFully(stack, newStacks);
        if (done)
          continue;
      }
      let force = stack.split(), forceBase = base2;
      for (let j = 0; force.forceReduce() && j < 10; j++) {
        if (verbose)
          console.log(forceBase + this.stackID(force) + " (via force-reduce)");
        let done = this.advanceFully(force, newStacks);
        if (done)
          break;
        if (verbose)
          forceBase = this.stackID(force) + " -> ";
      }
      for (let insert2 of stack.recoverByInsert(token)) {
        if (verbose)
          console.log(base2 + this.stackID(insert2) + " (via recover-insert)");
        this.advanceFully(insert2, newStacks);
      }
      if (this.stream.end > stack.pos) {
        if (tokenEnd == stack.pos) {
          tokenEnd++;
          token = 0;
        }
        stack.recoverByDelete(token, tokenEnd);
        if (verbose)
          console.log(base2 + this.stackID(stack) + ` (via recover-delete ${this.parser.getName(token)})`);
        pushStackDedup(stack, newStacks);
      } else if (!finished || finished.score < stack.score) {
        finished = stack;
      }
    }
    return finished;
  }
  stackToTree(stack) {
    stack.close();
    return Tree.build({
      buffer: StackBufferCursor.create(stack),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: stack.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(stack) {
    let id = (stackIDs || (stackIDs = new WeakMap())).get(stack);
    if (!id)
      stackIDs.set(stack, id = String.fromCodePoint(this.nextStackID++));
    return id + stack;
  }
};
function pushStackDedup(stack, newStacks) {
  for (let i = 0; i < newStacks.length; i++) {
    let other = newStacks[i];
    if (other.pos == stack.pos && other.sameState(stack)) {
      if (newStacks[i].score < stack.score)
        newStacks[i] = stack;
      return;
    }
  }
  newStacks.push(stack);
}
var Dialect = class {
  constructor(source, flags, disabled) {
    this.source = source;
    this.flags = flags;
    this.disabled = disabled;
  }
  allows(term) {
    return !this.disabled || this.disabled[term] == 0;
  }
};
var LRParser = class extends Parser {
  constructor(spec) {
    super();
    this.wrappers = [];
    if (spec.version != 13)
      throw new RangeError(`Parser version (${spec.version}) doesn't match runtime version (${13})`);
    let nodeNames = spec.nodeNames.split(" ");
    this.minRepeatTerm = nodeNames.length;
    for (let i = 0; i < spec.repeatNodeCount; i++)
      nodeNames.push("");
    let topTerms = Object.keys(spec.topRules).map((r) => spec.topRules[r][1]);
    let nodeProps = [];
    for (let i = 0; i < nodeNames.length; i++)
      nodeProps.push([]);
    function setProp(nodeID, prop, value) {
      nodeProps[nodeID].push([prop, prop.deserialize(String(value))]);
    }
    if (spec.nodeProps)
      for (let propSpec of spec.nodeProps) {
        let prop = propSpec[0];
        for (let i = 1; i < propSpec.length; ) {
          let next = propSpec[i++];
          if (next >= 0) {
            setProp(next, prop, propSpec[i++]);
          } else {
            let value = propSpec[i + -next];
            for (let j = -next; j > 0; j--)
              setProp(propSpec[i++], prop, value);
            i++;
          }
        }
      }
    this.nodeSet = new NodeSet(nodeNames.map((name2, i) => NodeType.define({
      name: i >= this.minRepeatTerm ? void 0 : name2,
      id: i,
      props: nodeProps[i],
      top: topTerms.indexOf(i) > -1,
      error: i == 0,
      skipped: spec.skippedNodes && spec.skippedNodes.indexOf(i) > -1
    })));
    this.strict = false;
    this.bufferLength = DefaultBufferLength;
    let tokenArray = decodeArray(spec.tokenData);
    this.context = spec.context;
    this.specialized = new Uint16Array(spec.specialized ? spec.specialized.length : 0);
    this.specializers = [];
    if (spec.specialized)
      for (let i = 0; i < spec.specialized.length; i++) {
        this.specialized[i] = spec.specialized[i].term;
        this.specializers[i] = spec.specialized[i].get;
      }
    this.states = decodeArray(spec.states, Uint32Array);
    this.data = decodeArray(spec.stateData);
    this.goto = decodeArray(spec.goto);
    this.maxTerm = spec.maxTerm;
    this.tokenizers = spec.tokenizers.map((value) => typeof value == "number" ? new TokenGroup(tokenArray, value) : value);
    this.topRules = spec.topRules;
    this.dialects = spec.dialects || {};
    this.dynamicPrecedences = spec.dynamicPrecedences || null;
    this.tokenPrecTable = spec.tokenPrec;
    this.termNames = spec.termNames || null;
    this.maxNode = this.nodeSet.types.length - 1;
    this.dialect = this.parseDialect();
    this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(input, fragments, ranges) {
    let parse = new Parse2(this, input, fragments, ranges);
    for (let w of this.wrappers)
      parse = w(parse, input, fragments, ranges);
    return parse;
  }
  getGoto(state, term, loose = false) {
    let table = this.goto;
    if (term >= table[0])
      return -1;
    for (let pos = table[term + 1]; ; ) {
      let groupTag = table[pos++], last = groupTag & 1;
      let target = table[pos++];
      if (last && loose)
        return target;
      for (let end = pos + (groupTag >> 1); pos < end; pos++)
        if (table[pos] == state)
          return target;
      if (last)
        return -1;
    }
  }
  hasAction(state, terminal) {
    let data = this.data;
    for (let set = 0; set < 2; set++) {
      for (let i = this.stateSlot(state, set ? 2 : 1), next; ; i += 3) {
        if ((next = data[i]) == 65535) {
          if (data[i + 1] == 1)
            next = data[i = pair(data, i + 2)];
          else if (data[i + 1] == 2)
            return pair(data, i + 2);
          else
            break;
        }
        if (next == terminal || next == 0)
          return pair(data, i + 1);
      }
    }
    return 0;
  }
  stateSlot(state, slot) {
    return this.states[state * 6 + slot];
  }
  stateFlag(state, flag) {
    return (this.stateSlot(state, 0) & flag) > 0;
  }
  validAction(state, action) {
    if (action == this.stateSlot(state, 4))
      return true;
    for (let i = this.stateSlot(state, 1); ; i += 3) {
      if (this.data[i] == 65535) {
        if (this.data[i + 1] == 1)
          i = pair(this.data, i + 2);
        else
          return false;
      }
      if (action == pair(this.data, i + 1))
        return true;
    }
  }
  nextStates(state) {
    let result = [];
    for (let i = this.stateSlot(state, 1); ; i += 3) {
      if (this.data[i] == 65535) {
        if (this.data[i + 1] == 1)
          i = pair(this.data, i + 2);
        else
          break;
      }
      if ((this.data[i + 2] & 65536 >> 16) == 0) {
        let value = this.data[i + 1];
        if (!result.some((v, i2) => i2 & 1 && v == value))
          result.push(this.data[i], value);
      }
    }
    return result;
  }
  overrides(token, prev) {
    let iPrev = findOffset(this.data, this.tokenPrecTable, prev);
    return iPrev < 0 || findOffset(this.data, this.tokenPrecTable, token) < iPrev;
  }
  configure(config2) {
    let copy = Object.assign(Object.create(LRParser.prototype), this);
    if (config2.props)
      copy.nodeSet = this.nodeSet.extend(...config2.props);
    if (config2.top) {
      let info = this.topRules[config2.top];
      if (!info)
        throw new RangeError(`Invalid top rule name ${config2.top}`);
      copy.top = info;
    }
    if (config2.tokenizers)
      copy.tokenizers = this.tokenizers.map((t2) => {
        let found = config2.tokenizers.find((r) => r.from == t2);
        return found ? found.to : t2;
      });
    if (config2.contextTracker)
      copy.context = config2.contextTracker;
    if (config2.dialect)
      copy.dialect = this.parseDialect(config2.dialect);
    if (config2.strict != null)
      copy.strict = config2.strict;
    if (config2.wrap)
      copy.wrappers = copy.wrappers.concat(config2.wrap);
    if (config2.bufferLength != null)
      copy.bufferLength = config2.bufferLength;
    return copy;
  }
  getName(term) {
    return this.termNames ? this.termNames[term] : String(term <= this.maxNode && this.nodeSet.types[term].name || term);
  }
  get eofTerm() {
    return this.maxNode + 1;
  }
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  dynamicPrecedence(term) {
    let prec2 = this.dynamicPrecedences;
    return prec2 == null ? 0 : prec2[term] || 0;
  }
  parseDialect(dialect) {
    let values = Object.keys(this.dialects), flags = values.map(() => false);
    if (dialect)
      for (let part of dialect.split(" ")) {
        let id = values.indexOf(part);
        if (id >= 0)
          flags[id] = true;
      }
    let disabled = null;
    for (let i = 0; i < values.length; i++)
      if (!flags[i]) {
        for (let j = this.dialects[values[i]], id; (id = this.data[j++]) != 65535; )
          (disabled || (disabled = new Uint8Array(this.maxTerm + 1)))[id] = 1;
      }
    return new Dialect(dialect, flags, disabled);
  }
  static deserialize(spec) {
    return new LRParser(spec);
  }
};
function pair(data, off) {
  return data[off] | data[off + 1] << 16;
}
function findOffset(data, start, term) {
  for (let i = start, next; (next = data[i]) != 65535; i++)
    if (next == term)
      return i - start;
  return -1;
}
function findFinished(stacks) {
  let best = null;
  for (let stack of stacks) {
    let stopped = stack.p.stoppedAt;
    if ((stack.pos == stack.p.stream.end || stopped != null && stack.pos > stopped) && stack.p.parser.stateFlag(stack.state, 2) && (!best || best.score < stack.score))
      best = stack;
  }
  return best;
}

// node_modules/lezer-julia/dist/index.es.js
var terminator$1 = 208;
var Identifier$1 = 1;
var BlockComment$1 = 2;
var tripleStringContent$1 = 209;
var stringContent$1 = 210;
var commandStringContent$1 = 211;
var immediateParen = 212;
var immediateColon = 213;
var immediateBrace = 214;
var immediateBracket = 215;
var immediateDoubleQuote = 216;
var immediateBackquote = 217;
var immediateDot = 218;
var nowhitespace = 219;
var CHAR_DOT = ".".codePointAt(0);
var CHAR_BACKSLASH = "\\".codePointAt(0);
var CHAR_BACKQUOTE = "`".codePointAt(0);
var CHAR_DOLLAR = "$".codePointAt(0);
var CHAR_HASH = "#".codePointAt(0);
var CHAR_EQUAL = "=".codePointAt(0);
var CHAR_LPAREN = "(".codePointAt(0);
var CHAR_LBRACE = "{".codePointAt(0);
var CHAR_LBRACKET = "[".codePointAt(0);
var CHAR_SEMICOLON = ";".codePointAt(0);
var CHAR_COLON = ":".codePointAt(0);
var CHAR_DQUOTE = '"'.codePointAt(0);
var CHAR_NEWLINE = "\n".codePointAt(0);
var CHAR_A = "A".codePointAt(0);
var CHAR_Z = "Z".codePointAt(0);
var CHAR_a = "a".codePointAt(0);
var CHAR_z = "z".codePointAt(0);
var CHAR_0 = "0".codePointAt(0);
var CHAR_9 = "9".codePointAt(0);
var CHAR_UNDERSCORE = "_".codePointAt(0);
var CHAR_EXCLAMATION = "!".codePointAt(0);
var CAT_Lu = /^\p{Lu}/u;
var CAT_Ll = /^\p{Ll}/u;
var CAT_Lt = /^\p{Lt}/u;
var CAT_Lm = /^\p{Lm}/u;
var CAT_Lo = /^\p{Lo}/u;
var CAT_Me = /^\p{Me}/u;
var CAT_Mn = /^\p{Mn}/u;
var CAT_Mc = /^\p{Mc}/u;
var CAT_Nd = /^\p{Nd}/u;
var CAT_Nl = /^\p{Nl}/u;
var CAT_No = /^\p{No}/u;
var CAT_Pc = /^\p{Pc}/u;
var CAT_Sc = /^\p{Sc}/u;
var CAT_Sk = /^\p{Sk}/u;
var CAT_So = /^\p{So}/u;
var CAT_Emoji = /^\p{Emoji}/u;
var terminator = new ExternalTokenizer((input, stack) => {
  let c = input.peek(0);
  if (c === CHAR_NEWLINE || c === CHAR_SEMICOLON) {
    if (stack.canShift(terminator$1)) {
      input.acceptToken(terminator$1, 1);
      return;
    }
  }
});
function isIdentifierStartCharExtra(s, c) {
  return CAT_Lu.test(s) || CAT_Ll.test(s) || CAT_Lt.test(s) || CAT_Lm.test(s) || CAT_Lo.test(s) || CAT_Nl.test(s) || CAT_Sc.test(s) || CAT_Emoji.test(s) || CAT_So.test(s) && !(c >= 8592 && c <= 8703) && c != 65532 && c != 65533 && c != 9023 && c != 166 || c >= 8512 && c <= 10780 && (c >= 8512 && c <= 8516 || c == 8767 || c == 8894 || c == 8895 || c == 8868 || c == 8869 || c >= 8706 && c <= 8755 && (c == 8706 || c == 8709 || c == 8710 || c == 8711 || c == 8718 || c == 8719 || c == 8720 || c == 8721 || c == 8734 || c == 8735 || c >= 8747) || c >= 8896 && c <= 8899 || c >= 9720 && c <= 9727 || c >= 9839 && (c == 9839 || c == 10200 || c == 10201 || c >= 10176 && c <= 10177 || c >= 10672 && c <= 10676 || c >= 10752 && c <= 10758 || c >= 10761 && c <= 10774 || c == 10779 || c == 10780)) || c >= 120513 && (c == 120513 || c == 120539 || c == 120571 || c == 120597 || c == 120629 || c == 120655 || c == 120687 || c == 120713 || c == 120745 || c == 120771) || c >= 8314 && c <= 8318 || c >= 8330 && c <= 8334 || c >= 8736 && c <= 8738 || c >= 10651 && c <= 10671 || c == 8472 || c == 8494 || c >= 12443 && c <= 12444 || c >= 120782 && c <= 120801;
}
function isIdentifierStartChar(input, offset) {
  let c = input.peek(offset);
  if (c >= CHAR_A && c <= CHAR_Z || c >= CHAR_a && c <= CHAR_z || c == CHAR_UNDERSCORE) {
    return 1;
  } else if (c < 161 || c > 1114111) {
    return 0;
  } else {
    let s = combineSurrogates(input, offset);
    if (isIdentifierStartCharExtra(s, c)) {
      return s.length;
    } else {
      return 0;
    }
  }
}
function combineSurrogates(input, offset) {
  let eat = 1;
  let c = input.peek(offset);
  let s = String.fromCodePoint(c);
  while (true) {
    let nc = input.peek(offset + eat);
    if (!(55296 <= c && c <= 56319 && 56320 <= nc && nc <= 57343)) {
      break;
    }
    s = s + String.fromCodePoint(nc);
    c = nc;
    eat = eat + 1;
  }
  return s;
}
var Identifier = new ExternalTokenizer((input, stack) => {
  let start = true;
  let offset = 0;
  let eat = 1;
  while (true) {
    let c = input.peek(offset);
    if (c === -1)
      break;
    if (start) {
      start = false;
      eat = isIdentifierStartChar(input, offset);
      if (eat === 0) {
        break;
      }
    } else {
      if (c >= CHAR_A && c <= CHAR_Z || c >= CHAR_a && c <= CHAR_z || c >= CHAR_0 && c <= CHAR_9 || c == CHAR_UNDERSCORE || c == CHAR_EXCLAMATION)
        ;
      else if (c < 161 || c > 1114111) {
        break;
      } else {
        let s = combineSurrogates(input, offset);
        eat = s.length;
        if (isIdentifierStartCharExtra(s, c))
          ;
        else if (CAT_Mn.test(s) || CAT_Mc.test(s) || CAT_Nd.test(s) || CAT_Pc.test(s) || CAT_Sk.test(s) || CAT_Me.test(s) || CAT_No.test(s) || c >= 8242 && c <= 8247 || c == 8279)
          ;
        else {
          break;
        }
      }
    }
    offset = offset + eat;
    eat = 1;
  }
  if (offset !== 0) {
    input.acceptToken(Identifier$1, offset);
  }
});
var isStringInterpolation = (input, offset) => {
  let c = input.peek(offset);
  let nc = input.peek(offset + 1);
  return c === CHAR_DOLLAR && (isIdentifierStartChar(input, offset + 1) !== 0 || nc == CHAR_LPAREN);
};
var makeStringContent = ({ till, term }) => {
  return new ExternalTokenizer((input, stack) => {
    let offset = 0;
    let eatNext = false;
    while (true) {
      let c = input.peek(offset);
      if (c === -1)
        break;
      if (c === CHAR_BACKSLASH) {
        eatNext = true;
      } else if (eatNext) {
        eatNext = false;
      } else if (isStringInterpolation(input, offset) || till(input, offset)) {
        if (offset > 0) {
          input.acceptToken(term, offset);
        }
        return;
      }
      offset = offset + 1;
    }
  });
};
var isTripleQuote = (input, offset) => {
  return input.peek(offset) === CHAR_DQUOTE && input.peek(offset + 1) === CHAR_DQUOTE && input.peek(offset + 2) === CHAR_DQUOTE;
};
var isQuote = (input, offset) => {
  return input.peek(offset) === CHAR_DQUOTE;
};
var isBackquote = (input, offset) => {
  return input.peek(offset) === CHAR_BACKQUOTE;
};
var tripleStringContent = makeStringContent({
  term: tripleStringContent$1,
  till: isTripleQuote
});
var stringContent = makeStringContent({
  term: stringContent$1,
  till: isQuote
});
var commandStringContent = makeStringContent({
  term: commandStringContent$1,
  till: isBackquote
});
var isBlockCommentStart = (input, offset) => {
  return input.peek(offset) === CHAR_HASH && input.peek(offset + 1) === CHAR_EQUAL;
};
var isBlockCommentEnd = (input, offset) => {
  return input.peek(offset) === CHAR_EQUAL && input.peek(offset + 1) === CHAR_HASH;
};
var BlockComment = new ExternalTokenizer((input, stack) => {
  if (isBlockCommentStart(input, 0)) {
    let depth = 1;
    let cur2 = 2;
    while (cur2 !== -1) {
      if (isBlockCommentEnd(input, cur2)) {
        depth = depth - 1;
        if (depth === 0) {
          input.acceptToken(BlockComment$1, cur2 + 2);
          return;
        }
        cur2 = cur2 + 2;
      } else if (isBlockCommentStart(input, cur2)) {
        depth = depth + 1;
        cur2 = cur2 + 2;
      } else {
        cur2 = cur2 + 1;
      }
    }
    input.acceptToken(BlockComment$1, cur2);
  }
});
var isWhitespace = (input, offset) => {
  let c = input.peek(offset);
  return c >= 9 && c < 14 || c >= 32 && c < 33 || c >= 133 && c < 134 || c >= 160 && c < 161 || c >= 5760 && c < 5761 || c >= 8192 && c < 8203 || c >= 8232 && c < 8234 || c >= 8239 && c < 8240 || c >= 8287 && c < 8288 || c >= 12288 && c < 12289;
};
var layoutExtra = new ExternalTokenizer((input, stack) => {
  if (input.peek(0) === CHAR_LPAREN && !isWhitespace(input, -1) && stack.canShift(immediateParen)) {
    input.acceptToken(immediateParen, 0);
    return;
  }
  if (input.peek(0) === CHAR_COLON && !isWhitespace(input, -1) && stack.canShift(immediateColon)) {
    input.acceptToken(immediateColon, 0);
    return;
  }
  if (input.peek(0) === CHAR_LBRACE && !isWhitespace(input, -1) && stack.canShift(immediateBrace)) {
    input.acceptToken(immediateBrace, 0);
    return;
  }
  if (input.peek(0) === CHAR_LBRACKET && !isWhitespace(input, -1) && stack.canShift(immediateBracket)) {
    input.acceptToken(immediateBracket, 0);
    return;
  }
  if (input.peek(0) === CHAR_DQUOTE && !isWhitespace(input, -1) && stack.canShift(immediateDoubleQuote)) {
    input.acceptToken(immediateDoubleQuote, 0);
    return;
  }
  if (input.peek(0) === CHAR_BACKQUOTE && !isWhitespace(input, -1) && stack.canShift(immediateBackquote)) {
    input.acceptToken(immediateBackquote, 0);
    return;
  }
  if (input.peek(0) === CHAR_DOT && !isWhitespace(input, -1) && stack.canShift(immediateDot)) {
    input.acceptToken(immediateDot, 0);
    return;
  }
  if (!isWhitespace(input, -1) && !isWhitespace(input, 0) && input.peek(0) !== -1 && stack.canShift(nowhitespace)) {
    input.acceptToken(nowhitespace, 0);
    return;
  }
}, {
  extend: true
});
var spec_Identifier = { __proto__: null, if: 12, elseif: 16, else: 20, end: 22, try: 26, catch: 30, finally: 34, for: 38, primitive: 60, type: 62, abstract: 68, mutable: 72, struct: 74, module: 78, baremodule: 82, macro: 86, do: 130, in: 166, function: 188, begin: 194, isa: 216, while: 258, let: 262, const: 268, global: 272, local: 276, quote: 280, break: 284, continue: 288, return: 292, using: 298, import: 300, export: 310, where: 342 };
var parser = LRParser.deserialize({
  version: 13,
  states: "$DxQ]Q#zOOO(`Q%_O'#EQO+oQ#{O'#F{O0pQ%_O'#HTO3_O$UO'#DrO3jO#|O'#DsO3uO$fO'#DtO6pQ%_O'#HYO6wQ%[O'#HvOOQ!i'#Hv'#HvO;gQ%_O'#HvOOQ!i'#EQ'#EQO?SQ#zO'#EZOOQV'#H`'#H`O?{Q#zO'#EdOCXQ#zO'#ExOOQ!i'#HY'#HYOHYQ%_O'#HYOHdQ#zO'#CsOKbQ#{O'#HSOOQV'#HU'#HUOLdQ#{O'#HSOLnQ%_O'#FoONgQ#zO'#FsO!#iQ#xO'#FvOOQV'#Fw'#FwOOQV'#HT'#HTOK{Q#{O'#HSQOQ#xOOO!#nQ#zO'#CaO!&pQ#zO'#ChO!&}Q#zO'#CyO!'SQ#zO'#C}OHdQ#zO'#DPO!'XQ#zO'#DPO!'^Q#zO'#DSO!'cQ#zO'#DUO!'hQ#zO'#DWO!)TQ#zO'#E]O]Q#zO'#E`O!)[Q#zO'#CnO!#nQ#zO'#FQO!)dQ#zO'#FSO!)lQ#zO'#FVO!)lQ#zO'#FXO!)lQ#zO'#FZO!)tQ#zO'#F]OOQV'#F_'#F_OOQV'#Fa'#FaO!){Q#{O'#FcO!+qQ#zO'#FfO!+yQ#zO'#FlO!0{Q%_O,59`O!1SQ#zO'#CvO!1ZQ%_O'#HYO!1kQ#zO'#CqO!3{Q%_O,59bO!;mQ%_O,5:]O!<QQ#xO,59aO!<VQ#xO,59cO!<[Q#xO,5;`O!<aQ#xO,5;kOHdQ#zO,59_O!<fQ%^O'#HoOOO`'#GS'#GSO!<nO$UO,5:^OOQ!i,5:^,5:^OOOW'#GT'#GTO!<yO#|O,5:_OOQ!i,5:_,5:_OOOp'#GU'#GUO!=UO$fO,5:`OOQ!i,5:`,5:`O!=aQ#xO,5:aO!=iQ#xO,5:aONgQ#zO,5<bO!<[Q#xO,5<hO!=nQ#xO,5>bO!=vQ%_O'#HYO!>aQ#{O,5<_O!CTQ%_O'#HYO!EmQ#xO'#E[O!GrQ#{O,5;jOOQS'#IR'#IRO!HPQ%_O,5:uO!MSQ#xO,5:uO!MXQ#zO,5:uO#!ZQ#xO,5:uOOQT'#Ev'#EvO#!fQ#yO'#IfO#!nQ#xO,5;aO!C^Q%_O'#HYO#!sQ#xO'#CrO#!xQ#xO,59]O#!}Q%_O'#EeOOQ!i,5;O,5;OOOQ!i,5;d,5;dO#*sQ#zO,5;dO#/RQ#zO'#E}O#/]Q#xO,5;hO#/eQ#zO'#EuOOQV,5<d,5<dO#4mQ%_O,59_ONgQ#zO'#GmO#:QQ#{O,5<PONgQ#zO,5<YONgQ#zO,5<^OOQV,5<_,5<_ONgQ#zO,5<`ONgQ#zO,5<`ONgQ#zO,5<`ONgQ#zO,5<`ONgQ#zO,5<`ONgQ#zO,5<`ONgQ#zO,5<`ONgQ#zO,5<`ONgQ#zO,5<`O#:XQ#zO,5<aONgQ#zO,5<eOOQV,5<f,5<fO#=ZQ#zO,5=nO#=qQ#{O,5=nO#BjQ#{O'#GqO#CQQ#xO'#FrOOQV'#Gq'#GqO#CYQ#{O'#FqO!<[Q#xO,5<ZOOQV,5<Z,5<ZO#HyQ#{O,58{O#IZQ#{O'#CjO#IkQ#{O'#ClOOQV,59S,59SO#IuQ#zO,59SO#IzQ#zO,59SO#JSQ#zO,59SOHdQ#zO,59eOHdQ#zO,59iO#MmQ%^O,59kOHdQ#zO,59kO#MtQ#zO,59nO#M{Q#zO,59pO#NSQ%_O'#EQO!'hQ#zO'#D[O$!wQ%[O,59rO!'hQ#zO'#EWOOQ!i'#Ha'#HaO$#VQ%^O,5:wO$&fQ#zO'#EZO$&yQ#zO,5?VO$'QQ#zO,5:zO$'VQ#zO'#CqO$'^Q&pO'#CpO$'iQ#{O,59YO$'vQ#{O,5;lOHdQ#zO'#CtO$*gQ#{O'#FUO$,xQ#{O,5;nO$/lQ#{O,5;qO$2YQ#{O,5;sO$4vQ#{O,5;uOOQV,5;w,5;wO$4}Q#zO,5;wO$6jQ#{O,5;}OOQV,5;},5;}O$7pQ#zO'#FjO$7xQ%_O'#FiOOQV,5<Q,5<QO$<oQ#{O,5<WO$AcQ#xO,59aO!E{Q#{O,5;jOOQS'#HW'#HWOOQ!i,59],59]O$AhQ#zO1G.{O$D{Q#zO1G.}O$EVQ#zO'#EZOOQ!i'#Ie'#IeO$EdQ%_O1G0zO$JgQ#zO'#EVOOQ!i1G1V1G1VO%!OQ%_O1G.yOOO!Y,5>Z,5>ZO%$mQ#xO,5>ZOOO`-E:Q-E:QOOQ!i1G/x1G/xOOOW-E:R-E:ROOQ!i1G/y1G/yOOOp-E:S-E:SOOQ!i1G/z1G/zOOQ!i1G/{1G/{O%&rQ#{O1G1|OOQV1G1|1G1|O%'`Q#zO1G2SOOQ!i1G3|1G3|O%'kQ#zO,5?RO%*mQ#zO,5?QO%*tQ#yO,5?QO%*|Q#zO'#IhO%+XQ#xO1G1UO%+^Q#zO'#EzOOQ!i1G0a1G0aOOQS'#E['#E[O%,yQ#zO'#IRO%-WQ#xO1G0aO%-`Q#zO1G0aO%-gQ#xO1G0aO!MXQ#zO1G0aOOQ!i1G0{1G0{O$JgQ#zO,59^O%-rQ#zO1G.wO%-yQ#xO1G.wO%.RQ#zO1G1OO%.YQ#xO1G1OOOQ!i1G1O1G1OO%.bQ#xO1G1PO%.gQ#zO'#GgOOQU-E:e-E:eO%/pQ#zO1G1SO%/wQ#xO1G1SOOQ!i1G1S1G1SO%1jQ#{O'#IfO%3_Q#{O,5=XOOQV-E:k-E:kO%5{Q#{O1G1tO%7OQ#{O1G1xOOQV1G1x1G1xO%:RQ#{O1G1xO%>|Q#{O1G1zO%AjQ#{O1G1zO%AqQ#{O1G1zO%DXQ#{O1G1zO%F{Q#{O1G1zO%IfQ#{O1G1zO%IpQ#{O1G1zO%LaQ#{O1G1zO%LhQ#{O1G1zO%NSQ#zO1G1{O&!gQ#{O1G2PO&!wQ#{O,5=^O&#bQ#{O,5=^OOQV,5=^,5=^O&$PQ#zO1G3YOOQV-E:p-E:pOOQV-E:o-E:oOOQV'#Ij'#IjOOQV1G1u1G1uOOQU'#GO'#GOO&$gQ#zO1G.gO&$rQ%_O,5<`O&&[Q#{O,5<eO&$rQ%_O,5<`O&$rQ%_O,5<`O&$rQ%_O,5<`O&$rQ%_O,5<`O!#nQ#zO'#CcO&'kQ#zO'#CeOOQV1G.g1G.gO&$mQ#zO1G.gO&$gQ#zO1G.gO&'rQ#zO1G.gO&(PQ%_O,59UOOQU,59U,59UO&)rQ#zO,59UOOQU,59W,59WO&)|Q#zO,59WOOQV1G.n1G.nO&*TQ#zO1G.nO&*YQ#zO1G.nO&*vQ%[O1G/PO&*}Q%^O1G/TOHdQ#zO,59_OOQV1G/V1G/VO&+UQ#zO1G/VO&+ZQ%^O1G/VOOQV1G/Y1G/YO&+bQ#zO1G/YOOQV1G/[1G/[O&+gQ#zO1G/[O&+lQ%_O,59tO&/TQ%_O,59vO&2lQ#xO,59uO&2qQ#xO,59wO!<aQ#xO,5:pO!<[Q#xO1G/^O&3XQ%]O'#IPOOQT'#EX'#EXO&3cQ#yO'#IPO&3kQ#xO,5:rO!<[Q#xO'#ISOOQV1G0c1G0cO&3pQ#zO1G0cO&3uQ#zO1G0cO&6fQ%_O'#EQO&8|Q#zO'#F{O&;yQ%_O'#HaO&?SQ#zO'#EZO&?aQ%_O'#HaOOQ!i,5:u,5:uOOQV1G4q1G4qO&AvQ#zO1G4qOOQV1G0f1G0fO&A{Q#zO'#HWO@VQ#zO,59[O!)[Q#zO'#GjO&BVQ#{O1G.tOOQV1G.t1G.tO&BdQ#zO1G.tO&BiQ#zO1G.tOOQV1G1W1G1WO&BpQ#zO1G1WO&BuQ#zO1G1WO@VQ#zO,5;pO!)dQ#zO'#GkO&B|Q#{O1G1YOOQV1G1Y1G1YO&CZQ#zO1G1YO&C`Q#zO1G1YO!)lQ#zO'#GlO&E|Q#{O1G1]O&HjQ#{O1G1_O&KWQ#{O1G1aOOQV1G1c1G1cOOQ!i,5<U,5<UO&K_Q#zO,5<UO&KdQ#zO'#GnO&KlQ#{O,5<TO'!`Q#xO,5<VO'!eQ#zO'#GpO'!jQ#{O1G1rO''^Q#zO1G.{OHdQ#zO'#CvOOQ!i7+$g7+$gOOQ!i7+'b7+'bO''iQ%_O'#EQO')pQ#{O'#ErO',tQ%_O'#H_O'4jQ#zO'#DlO'7gQ%_O'#HeO':sQ#zO'#DyO':zQ%_O'#HvOOQ!i'#He'#HeO'ATQ%_O'#HeO'A_Q#zO'#DcO'DYQ#zO7+$iO'DjQ%_O'#EcO$AvQ#zO'#EjO'FPQ#xO'#EnOOQV'#H_'#H_OOQ!i7+$i7+$iO'FUQ#xO7+$iO'FZQ#xO7+$iO'FcQ#xO7+$iO!'hQ#zO'#E]OOQ!i7+&f7+&fO]Q#zO'#DnO'FkQ#zO,5:qO'FuQ#zO1G3uONgQ#zO7+'nO!<aQ#xO7+'nO'K[Q#{O1G4mO'KfQ#{O,5=OOOQT'#Ew'#EwOOQT,5=O,5=OO'KpQ#zO1G4lOOQT-E:b-E:bOOQU'#Gf'#GfO'KwQ#zO,5?SO'FuQ#zO'#E{OOQ!i7+&p7+&pO'LSQ#zO,5;fO'LeQ#zO7+%{O'LlQ#xO7+%{OOQ!i7+%{7+%{OOQS,5<z,5<zO'LeQ#zO7+%{OOQS-E:^-E:^O!MXQ#zO7+%{O'LlQ#xO7+%{O'LtQ#zO1G.xOOQS,5=T,5=TOOQ!i7+$c7+$cO'MRQ#zO7+$cOOQS-E:g-E:gO'MYQ#zO,5<xOOQ!i7+&j7+&jO'MgQ#zO7+&jOOQS-E:[-E:[OOQ!i7+&k7+&kOOQS,5=S,5=SOOQ!i7+&n7+&nO'MnQ#zO7+&nOOQS-E:f-E:fONgQ#zO7+'gP]Q#zO'#GrOOQU-E9|-E9|OOQV7+$R7+$RO'MuQ#zO7+$RO'MzQ%_O,59`O(!PQ%_O,59bO(&kQ%_O,5:]O((yQ#{O,58}OOQU,59P,59PO()ZQ#zO7+$RO()ZQ#zO7+$ROOQU1G.p1G.pO()fQ#zO1G.pOOQU1G.r1G.rOOQV7+$Y7+$YO()pQ#zO7+$YO()uQ#zO7+$kOOQV7+$o7+$oO()zQ%_O1G.yOOQV7+$q7+$qO(+yQ#zO7+$qOOQV7+$t7+$tOOQV7+$v7+$vO(,OQ#zO1G/aO(,ZQ#zO1G/cOOQ!i1G0[1G0[O(,eQ#zO7+$xO!'hQ#zO,5>lO(,lQ#zO,5>kO(,sQ#yO,5>kOOQ!i1G0^1G0^OOQU,5>n,5>nOOQV7+%}7+%}O(,{Q#zO7+%}O(.XQ#zO'#CvO(.fQ%_O'#HaO(.pQ#zO'#CqO(0}Q%_O,5:]OOQV7+*]7+*]O(2oQ#{O1G.vOOQV,5=U,5=UOOQV-E:h-E:hOOQV7+$`7+$`O(5dQ#zO7+$`O(5iQ#zO7+$`OOQV7+&r7+&rO(5pQ#zO7+&rO(5uQ#{O1G1[OOQV,5=V,5=VOOQV-E:i-E:iOOQV7+&t7+&tO(9YQ#zO7+&tO(9_Q#zO7+&tOOQV,5=W,5=WOOQV-E:j-E:jOOQ!i1G1p1G1pO(9fQ#{O,5=YOOQV-E:l-E:lO(>YQ#zO1G1qOOQV,5=[,5=[OOQV-E:n-E:nO(>gQ%_O,5:OO'(]Q#zO'#DfO(CWQ%_O'#HeO(ChQ#zO'#DaO(CoQ%_O,5:QO!6vQ%_O,5:]O(H`Q#xO,5:PO(HeQ#xO,5:RO(HjQ#xO,5:VO(HoQ#xO,5:jO'A_Q#zO,59}O(HtQ#xO'#DmO(ISQ#{O,5:iOOQS'#Hk'#HkO(IpQ%_O,5:WO(NdQ#xO,5:WO(NiQ#zO,5:WO)#nQ#xO,5:WO)&]Q%_O'#HeOOQT'#Dw'#DwO)&gQ#yO'#HrO)&oQ#xO,5:bO)&tQ%_O'#HeO)&{Q#xO'#DbO)'QQ#xO,59{O$AvQ#zO,5;YOOQ!i,5:e,5:eO)*UQ#zO,5:eO).gQ#zO'#D|O).qQ#xO,5:gO).yQ#{O,5;UO)3^Q#zO'#DvOOQV,5;Z,5;ZO)6cQ%_O,59}O);SQ#zO<<HTO);ZQ#xO<<HTO);cQ#zO'#HbO$AvQ#zO,5:|OOQV,5;U,5;UO$AvQ#zO,5;VO$AvQ#zO,5;VO$AvQ#zO,5;VO$AvQ#zO,5;VO$AvQ#zO,5;VO$AvQ#zO,5;VO$AvQ#zO,5;VO$AvQ#zO,5;VO$AvQ#zO,5;VO);qQ#zO,5;XO$AvQ#zO,5;[OOQV,5;],5;]OOQS,59d,59dO)>vQ#zO,5;_OOQ!i<<HT<<HTO)A{Q#zO'#D_O)F_Q#{O'#GbO)FlQ#xO'#EhOOQV'#Gb'#GbO)FtQ#{O'#EgO(HjQ#xO,5:}OOQV,5:},5:}O);^Q#xO<<HTO)HWQ#zO,5:YO)H]Q#zO1G0]O)HdQ#xO1G0]OOQ!i1G0]1G0]O)JPQ#zO7+)aO)JWQ#{O<<KYOOQV<<KY<<KYO)JqQ#xO<<KYP#/eQ#zO'#GdOOQU-E:d-E:dO)JyQ#zO,5;gO%+^Q#zO'#GeO)KWQ#zO1G1QOOQS,5<{,5<{OOQ!i<<Ig<<IgO)KiQ#zO<<IgOOQS-E:_-E:_P!MXQ#zO'#G`O)KpQ#xO<<IgO)KpQ#xO<<IgOOQ!i<<G}<<G}P!MXQ#zO'#GiOOQ!i<<JU<<JUP$JgQ#zO'#G^OOQ!i<<JY<<JYP#,PQ#zO'#GhO)MfQ#{O<<KROOQV<<Gm<<GmOOQU1G.i1G.iO)NfQ#zO1G.iO)NsQ#zO<<GmO)NxQ#zO<<GmOOQU7+$[7+$[OOQV<<Gt<<GtOOQV<<HV<<HVOOQV<<H]<<H]O!'hQ#zO'#DYOOQ!i7+${7+${O* TQ#zO7+$}OOQ!i7+$}7+$}O* eQ#xO7+$}O* jQ#xO7+$}O* rQ#xO7+$}OOQV<<Hd<<HdO* zQ#zO<<HdO*!PQ%]O1G4WO*!bQ%]O,5<yOOQT'#EY'#EYOOQT,5<y,5<yO*!lQ#zO1G4VOOQT-E:]-E:]PHdQ#zO'#E_POQU1G4Y1G4YOOQV<<Ii<<IiOOQV<<Gz<<GzO*!sQ#zO<<GzOOQV<<J^<<J^OOQV<<J`<<J`O*!xQ#zO<<J`O*!}Q#{O'#IiOOQV7+']7+']O*'qQ#xO,5:PO*'vQ#{O,5:iOOQS'#Hc'#HcOOQ!i,59{,59{O*(ZQ#zO1G/kO*(iQ#zO1G/mO*(sQ#zO'#DlOOQ!i'#Hj'#HjO*)QQ%_O1G/qO)>vQ#zO'#EPOOQ!i1G0U1G0UO*-tQ%_O1G/iO*2eQ#zO,5>_O*5jQ#zO,5>^O*5qQ#yO,5>^O*5yQ#xO1G0TOOQ!i1G/r1G/rOOQS'#Dm'#DmO*7cQ#zO'#HkO*7pQ#xO1G/rO*7xQ#zO1G/rO*8PQ#xO1G/rO(NiQ#zO1G/rOOQ!i1G/|1G/|O)>vQ#zO,59|O*8[Q#zO1G/gO*8cQ#xO1G/gO*:eQ#{O1G0tOOQV1G0t1G0tO*:uQ#zO1G0PO*:|Q#xO1G0POOQ!i1G0P1G0PO*;UQ#xO1G0QO*;ZQ#zO'#GXOOQU-E:V-E:VO*<dQ#zO1G0RO*<kQ#xO1G0ROOQ!i1G0R1G0RO*>^Q#{O'#HrO*>hQ#zO,5<kOOQS,5<k,5<kOOQ!iAN=oAN=oO*>xQ#zOAN=oOOQS-E9}-E9}OOQU'#G]'#G]O*?PQ#zO,5=|O)>vQ#zO'#ESO*?_Q#{O1G0hO*DfQ#{O1G0qO*FpQ#{O1G0qO*FwQ#{O1G0qO*H{Q#{O1G0qO*K]Q#{O1G0qO*MdQ#{O1G0qO*MnQ#{O1G0qO+ {Q#{O1G0qO+!SQ#{O1G0qO+#nQ#zO1G0sO+%oQ#{O1G0vO+&PQ#zO1G0yO+&ZQ#zO'#DaO+&bQ&pO'#D`O+&mQ#zO,59yO$AvQ#zO'#GcO+)RQ#{O,5;TO'7nQ#zO,5;SOOQV-E:`-E:`OOQV'#IV'#IVOOQV1G0i1G0iOOQ!i1G/t1G/tOOQ!i7+%w7+%wO+)YQ#zO7+%wOOO!Y<<L{<<L{ONgQ#zOAN@tOOQU,5=P,5=POOQU-E:c-E:cOOQ!iAN?RAN?RP!MXQ#zO'#GaO+)aQ#zOAN?RO+)hQ#xOAN?ROOQU7+$T7+$TOOQVAN=XAN=XO+)pQ#zOAN=XO+)uQ#zO<<HiO+)|Q#xO<<HiOOQS,59x,59xO)>vQ#zO,5:oOOQ!i<<Hi<<HiO+*PQ#xO<<HiOOQVAN>OAN>OP!'hQ#zO'#G_P+*UQ%^O,5:yOOQVAN=fAN=fOOQVAN?zAN?zO+-gQ#zO'#GoO+-tQ#{O,5?TO+2hQ#zO1G/kO'A_Q#zO'#DdO'A_Q#zO'#DfOOQ!i7+%V7+%VOOQ!i7+&W7+&WO+2sQ#zO7+%XOOQ!i7+%X7+%XO+3TQ#xO7+%XO+3YQ#xO7+%XO+3bQ#xO7+%XOOQ!i,5:W,5:WOOQ!i7+%]7+%]O+3jQ#zO,5:kO+5XQ#{O1G3yO+5cQ#{O,5<qOOQT'#Dx'#DxOOQT,5<q,5<qO+5mQ#zO1G3xOOQT-E:T-E:TOOQ!i7+%o7+%oO+5tQ#zO7+%^O+5{Q#xO7+%^OOQ!i7+%^7+%^OOQS,5<l,5<lO+5tQ#zO7+%^OOQS-E:O-E:OO(NiQ#zO7+%^O+5{Q#xO7+%^O+6TQ#zO1G/hO+6bQ#zO'#HcOOQS,5<u,5<uOOQ!i7+%R7+%RO+6lQ#zO7+%ROOQS-E:X-E:XO+6sQ#zO,5<rOOQ!i7+%k7+%kO+7QQ#zO7+%kOOQS-E:U-E:UOOQ!i7+%l7+%lOOQS,5<t,5<tOOQ!i7+%m7+%mO+7XQ#zO7+%mOOQS-E:W-E:WO)>vQ#zO,5:UOOQ!iG23ZG23ZP$AvQ#zO'#GPOOQU-E:Z-E:ZO+7`Q#zO,5:nO$AvQ#zO7+&_O)>vQ#zO,59zO)A{Q#zO'#G[O+7pQ#zO1G/eO+8RQ#{O,5<}OOQV-E:a-E:aO+=PQ#{O1G0nOOQV1G0n1G0nO+AhQ#{O1G0nOOQ!i<<Ic<<IcO+AxQ#{OG26`OOQVG26`G26`OOQ!iG24mG24mO+BcQ#zOG24mOOQVG22sG22sOOQ!iAN>TAN>TO+BjQ#zOAN>TO+BqQ#zO1G0ZOOQV,5=Z,5=ZOOQV-E:m-E:mOOQS,5:S,5:SO)>vQ#zO,5:TO+B{Q#zO<<HsO+CSQ#xO<<HsOOQ!i<<Hs<<HsO+CVQ#xO<<HsO+C[Q#zO1G0VO+CcQ#xO1G0VOOQ!i1G0V1G0VP)3^Q#zO'#GVOOQS,5<m,5<mOOQ!i<<Hx<<HxO+CkQ#zO<<HxOOQS-E:P-E:PP(NiQ#zO'#GQO+CrQ#xO<<HxO+CrQ#xO<<HxOOQ!i<<Hm<<HmP(NiQ#zO'#GZOOQ!i<<IV<<IVP)>vQ#zO'#GWOOQ!i<<IX<<IXP)+bQ#zO'#GYO+CzQ#zO1G/pO+EfQ#{O<<IyO+F`Q#zO1G/fOOQU,5<v,5<vOOQU-E:Y-E:YOOQ!iLD*XLD*XOOQ!iG23oG23oO+FsQ#zO1G/oOOQ!iAN>_AN>_O+F}Q#zOAN>_OOQ!i7+%q7+%qO+GUQ#zO7+%qOOQ!iAN>dAN>dP(NiQ#zO'#GRO+G]Q#zOAN>dO+GdQ#xOAN>dOOQ!iG23yG23yOOQ!i<<I]<<I]OOQ!iG24OG24OO+GlQ#zOG24OOOQ!iLD)jLD)jO+GsQ%_O,59`O+GzQ%_O,59`O+LoQ%^O'#HYO+JlQ%^O'#HYOHdQ#zO'#CtOHdQ#zO'#CtO,#TQ#{O1G1|O,#[Q#{O1G1|O,%SQ#{O1G1|O,%jQ#{O1G1xO,(}Q%_O'#HaO,)bQ%_O'#HaO!)dQ#zO'#GlO,)rQ#{O1G1]O,,TQ#{O1G1_O,.fQ#{O1G1aO,0wQ#zO'#CvO,1UQ%_O'#HaO,1lQ%_O,5:]O,4VQ%^O'#HeO,4^Q%^O'#HeO,4eQ#zO1G0tO,8sQ#zO1G0tO,:hQ#{O1G0tO,;OQ#{O1G0nO!)dQ#zO'#FVO!)dQ#zO'#FXO!)dQ#zO'#FZO,;]Q#{O'#FcO,=RQ#{O'#FcO,>[Q#zO'#FcO@VQ#zO,5<bO@VQ#zO,5<bONgQ#zO,5<bONgQ#zO,5<bONgQ#zO,5<bO,?bQ%_O'#HYO,?uQ%_O'#HYO,DjQ%_O'#HYO,F}Q%_O'#HYO,G[Q%_O'#HYO@VQ#zO'#GmO$JgQ#zO'#GmO,GcQ#{O,5<PO,ItQ#{O,5<PO@VQ#zO,5<YO!#nQ#zO,5<YO$JgQ#zO,5<YO#,PQ#zO,5<YO#/eQ#zO,5<YO#:XQ#zO,5<YO@VQ#zO,5<^ONgQ#zO,5<^O@VQ#zO,5<^O@VQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O!#nQ#zO,5<`O@VQ#zO,5<`O!#nQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O@VQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O!#nQ#zO,5<`O@VQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O!#nQ#zO,5<`O@VQ#zO,5<`O!#nQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O@VQ#zO,5<`O!#nQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O@VQ#zO,5<`O!#nQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O@VQ#zO,5<`O!#nQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O@VQ#zO,5<`O!#nQ#zO,5<`O$JgQ#zO,5<`O#,PQ#zO,5<`O#/eQ#zO,5<`O#:XQ#zO,5<`O@VQ#zO,5<eO$JgQ#zO,5<eO#,PQ#zO,5<eO#/eQ#zO,5<eO#:XQ#zO,5<eO!#nQ#zO,5<eO,KtQ#{O'#GqO,LOQ#xO'#FrO,LWQ#xO'#FrO,L`Q#xO'#FrO,LhQ#{O'#FqO,M}Q#{O,5;qO-!`Q#{O,5;sO-$qQ#{O,5;uO-'SQ#{O,5;}O-*gQ#{O,5;}O-+WQ#{O1G1|O-+qQ#{O,5=XO-/OQ#{O,5=XO-/oQ#{O1G1tO-5xQ#{O1G1tO-7XQ#{O1G1tO-7xQ#zO1G1tO-:cQ#{O1G1tO-:vQ#zO1G1tO-:}Q#{O1G1xO->UQ#{O1G1xO-@sQ#{O1G1xO-AxQ#{O1G1xO-EoQ#{O1G1zO-IzQ#{O1G1zO-LOQ#{O1G1zO.!TQ#zO1G1zO.#xQ#{O1G1zO.%dQ#zO1G1zO.%kQ#{O1G1zO.(SQ#{O1G1zO.(ZQ#{O1G1zO.(bQ#zO1G1zO.(iQ#{O1G1zO.(pQ#zO1G1zO.(wQ#{O1G1zO./WQ#{O1G1zO.1[Q#{O1G1zO.5aQ#zO1G1zO.7UQ#{O1G1zO.8sQ#zO1G1zO.=tQ#{O1G1zO.BPQ#{O1G1zO.DTQ#{O1G1zO.HYQ#zO1G1zO.I}Q#{O1G1zO.KiQ#zO1G1zO/!^Q#{O1G1zO/&iQ#{O1G1zO/(mQ#{O1G1zO/,rQ#zO1G1zO/.gQ#{O1G1zO/0RQ#zO1G1zO/0]Q#{O1G1zO/0gQ#{O1G1zO/0qQ#{O1G1zO/0{Q#zO1G1zO/1VQ#{O1G1zO/1aQ#zO1G1zO/6[Q#{O1G1zO/:gQ#{O1G1zO/<kQ#{O1G1zO/@pQ#zO1G1zO/BeQ#{O1G1zO/DPQ#zO1G1zO/DWQ#{O1G1zO/D_Q#{O1G1zO/DfQ#{O1G1zO/DmQ#zO1G1zO/DtQ#{O1G1zO/D{Q#zO1G1zO/ESQ#{O1G2PO/K]Q#{O1G2PO/MaQ#{O1G2PO/M}Q#zO1G2PO0 rQ#{O1G2PO0#aQ#zO1G2PO0#tQ%_O'#EQO0$UQ#{O'#F{O$JgQ#zO,59[ONgQ#zO,5;pO$JgQ#zO,5;pO0$fQ%_O'#HvO0&UQ%^O'#HvO'7nQ#zO'#EjO)+bQ#zO'#EjO@VQ#zO7+'gO!#nQ#zO7+'gO$JgQ#zO7+'gO#,PQ#zO7+'gO#/eQ#zO7+'gO#:XQ#zO7+'gO0'eQ#zO1G.vO0)]Q#{O1G1[O0*fQ#{O1G1[O'7nQ#zO,5;YO$AvQ#zO,5;YO'7nQ#zO,5;YO$AvQ#zO,5;YO$AvQ#zO,5;YO'7nQ#zO,5:|O)+bQ#zO,5:|O'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;VO)+bQ#zO,5;VO'7nQ#zO,5;[O)+bQ#zO,5;[O0+VQ#{O<<KRO01`Q#{O<<KRO03dQ#{O<<KRO04pQ#zO<<KRO05vQ#{O<<KRO07kQ#zO<<KRO07uQ#{O1G0tO0;_Q#{O1G0hO0<qQ#zO1G0hO0=tQ#{O1G0qO0A|Q#zO1G0qO0BTQ#{O1G0qO0DoQ#zO1G0qO0DvQ#{O1G0qO0KVQ#zO1G0qO1 zQ#{O1G0qO1&SQ#zO1G0qO1*hQ#{O1G0qO1.pQ#zO1G0qO1.zQ#{O1G0qO1/UQ#zO1G0qO13pQ#{O1G0qO17xQ#zO1G0qO18PQ#{O1G0qO18WQ#zO1G0qO18_Q#{O1G0vO1<aQ#zO1G0vO'7nQ#zO'#GcO1?UQ#{O,5;TO$AvQ#zO,5;SO$AvQ#zO,5;SO'7nQ#zO,5;SO'7nQ#zO7+&_O)+bQ#zO7+&_O1B}Q#{O,5<}O1FRQ#{O1G0nO1HrQ#{O1G0nO1JyQ#{O1G0nO1KTQ#{O1G0nO1NgQ#{O<<IyO2 vQ#zO<<IyO2!vQ#{O1G1|O2#QQ#{O1G1xO2$ZQ#{O1G0tO2$eQ#{O1G0nO2%UQ%_O'#HvO2%oQ%_O'#HvO2'XQ%_O'#HvO2(wQ%^O'#HvO2*WQ%_O'#HvO2+gQ%^O'#HvO2,sQ%_O'#HvO2.YQ%_O'#FoO@VQ#zO'#FsO!#nQ#zO'#FsO$JgQ#zO'#FsO#,PQ#zO'#FsO#/eQ#zO'#FsO#:XQ#zO'#FsO2/rQ#xO'#FvO2/wQ#xO'#FvO2/|Q#xO'#FvO20RQ#xO'#FvO20WQ#xO'#FvO20]Q#{O'#FcO21oQ#zO'#FcO22oQ#zO'#FcO23oQ&pO'#CpO23zQ#{O'#FUO24RQ#{O'#FUO26UQ#zO1G1{O26]Q#zO1G1{O26dQ#zO1G1{O26kQ#zO1G1{O26rQ#zO1G1{O26yQ#zO1G1{O27QQ#zO'#GlO27YQ#{O1G1]O29YQ#{O1G1_O2;YQ#{O1G1aO2=YQ%_O'#HeO2?vQ%^O'#HeO2B[Q%^O'#HeO2DoQ%_O'#HeO2D|Q%_O'#HeO2EaQ%^O'#HvO2J}Q%^O'#HvO2K[Q%_O'#HvO2KoQ%_O'#HvO2MOQ%^O'#HvO)>vQ#zO'#EjO2N[Q#zO'#EjO*2eQ#zO'#EjO)3^Q#zO'#EjO);qQ#zO'#EjO3#aQ#xO'#EnO3#fQ#xO'#EnO3#kQ#xO'#EnO3#pQ#xO'#EnO3#uQ#xO'#EnO%'kQ#zO'#E{O)>vQ#zO,5:|O2N[Q#zO,5:|O*2eQ#zO,5:|O)3^Q#zO,5:|O);qQ#zO,5:|O)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;VO2N[Q#zO,5;VO*2eQ#zO,5;VO)3^Q#zO,5;VO);qQ#zO,5;VO)>vQ#zO,5;[O2N[Q#zO,5;[O*2eQ#zO,5;[O)3^Q#zO,5;[O);qQ#zO,5;[O3#zQ#{O'#GbO3$UQ#xO'#EhO3$^Q#xO'#EhO3$fQ#xO'#EhO3$nQ#{O'#EgO2N[Q#zO'#ESO*2eQ#zO'#ESO3%zQ#zO1G0hO3'xQ#zO1G0hO3(VQ#{O1G0hO3)zQ#{O1G0hO3*_Q#zO1G0hO3,]Q#zO1G0qO3-}Q#zO1G0qO3.UQ#{O1G0qO30PQ#{O1G0qO31kQ#zO1G0qO31rQ#zO1G0qO33dQ#zO1G0qO35[Q#{O1G0qO35cQ#{O1G0qO35jQ#zO1G0qO37[Q#zO1G0qO37oQ#zO1G0qO37vQ#{O1G0qO39_Q#{O1G0qO3:yQ#zO1G0qO3=TQ#zO1G0qO3>uQ#zO1G0qO3@mQ#{O1G0qO3BbQ#{O1G0qO3C|Q#zO1G0qO3EwQ#zO1G0qO3GiQ#zO1G0qO3IaQ#{O1G0qO3KUQ#{O1G0qO3LpQ#zO1G0qO3LzQ#zO1G0qO3MUQ#zO1G0qO3M`Q#{O1G0qO3MjQ#{O1G0qO3MtQ#zO1G0qO4 uQ#zO1G0qO4#gQ#zO1G0qO4%_Q#{O1G0qO4'SQ#{O1G0qO4(nQ#zO1G0qO4(uQ#zO1G0qO4(|Q#zO1G0qO4)TQ#{O1G0qO4)[Q#{O1G0qO4)cQ#zO1G0qO4)jQ#zO1G0sO4)qQ#zO1G0sO4)xQ#zO1G0vO4+sQ#zO1G0vO4,TQ#{O1G0vO4-rQ#{O1G0vO4.`Q#zO1G0vO4.sQ#zO,5:nO4/QQ#zO,5:nO)>vQ#zO7+&_O2N[Q#zO7+&_O*2eQ#zO7+&_O)3^Q#zO7+&_O);qQ#zO7+&_O40SQ#zO<<IyO41}Q#zO<<IyO42}Q#{O<<IyO44QQ#{O<<IyO45uQ#zO<<IyO%'kQ#zO,5<YO'FuQ#zO,5<YO%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<`O'FuQ#zO,5<`O%'kQ#zO,5<eO'FuQ#zO,5<eO46PQ#{O1G1tO46dQ#zO1G1tO46qQ#{O1G1zO47_Q#zO1G1zO47uQ#{O1G1zO48cQ#zO1G1zO48yQ#{O1G1zO49gQ#zO1G1zO4;nQ#{O1G1zO4=`Q#zO1G1zO4?TQ#{O1G1zO4@uQ#zO1G1zO4APQ#{O1G1zO4AZQ#zO1G1zO4CUQ#{O1G1zO4DvQ#zO1G1zO4D}Q#{O1G1zO4EUQ#zO1G1zO4E]Q#{O1G2PO4EmQ#zO1G2PO%'kQ#zO7+'gO'FuQ#zO7+'gO4FWQ#{O<<KRO4GlQ#zO<<KRO27QQ#zO'#FVO27QQ#zO'#FXO27QQ#zO'#FZO#:XQ#zO,5<aO#:XQ#zO,5<aO#:XQ#zO,5<aO#:XQ#zO,5<aO#:XQ#zO,5<aO#:XQ#zO,5<aO4HxQ#{O,5;qO4JxQ#{O,5;sO4LxQ#{O,5;uO4NxQ#zO'#IhO5 TQ%_O'#EcO5!dQ#zO,5?SO5!oQ#zO'#HbO5!zQ#zO'#HbO);qQ#zO,5;XO);qQ#zO,5;XO5#VQ#zO,5;gO5#dQ#zO,5=|O5#oQ#zO,5=|O5#zQ#zO1G0sO5$RQ#zO1G0sO5$YQ#zO1G0sO5$aQ#zO1G0sO5$hQ#zO1G0sO5$oQ%_O'#HvO5&RQ%^O'#HvO%'kQ#zO'#FsO'FuQ#zO'#FsO5'_Q#zO1G1{O5'fQ#zO1G1{O);qQ#zO,5;XO);qQ#zO,5;XO);qQ#zO,5;XO);qQ#zO,5;XO);qQ#zO,5;XO#:XQ#zO,5<aO#:XQ#zO,5<a",
  stateData: "5'o~O%uOSROSQOS~OPVOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lYO&mZO&nZO&oZO&pbO&qbO&x^O&zgO~O&OWO&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO!u!tX#`!tX%h!tX%l!tX%n!tX%o!tX%r!tX&[!tX&w!tX&{!tX&|!tX&}!tX'O!tX'P!tX'Q!tX'R!tX'S!tX'T!tX'W!tXc!tX&`!tX&a!tXU!tX]!tXn!tXr!tXt!tXu!tXw!tXy!tX{!tX#Q!tX#T!tX#u!tX#w!tX#z!tX#|!tX$O!tX$Q!tX$S!tX$U!tX$W!tX$Z!tX$[!tX$a!tX&]!tX&x!tX&z!tX'U!tX&i!tX~OP!WOp`O!d`O%y!XO%}PO&P!VO&Q_O&pbO&qbO%g!tXW!tXY!tXZ!tX_!tXa!tX~P$_Op`O!d`O&OWO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO&pbO&qbO!u$oX#`$oX%h$oX&[$oX&w$oX&{$oX&|$oX&}$oX'O$oX'P$oX'Q$oX'R$oX'S$oX'T$oX'W$oXc$oX&`$oX&a$oX~OP!ZO%y!XO%}PO&P!VO%g$oXU$oX]$oXn$oXr$oXt$oXu$oXw$oXy$oX{$oX#Q$oX#T$oX#u$oX#w$oX#z$oX#|$oX$O$oX$Q$oX$S$oX$U$oX$W$oX$Z$oX$[$oX$a$oX&]$oX&x$oX&z$oXW$oXY$oXZ$oX_$oXa$oX'U$oX&i$oX~P)cO%n!_O%o!]O%r![Oc%wXP%wXU%wX]%wXn%wXp%wXr%wXt%wXu%wXw%wXy%wX{%wX!d%wX#Q%wX#T%wX#u%wX#w%wX#z%wX#|%wX$O%wX$Q%wX$S%wX$U%wX$W%wX$Z%wX$[%wX$a%wX%y%wX&Q%wX&b%wX&d%wX&e%wX&x%wX&z%wX~O%l!^O&p!`O&q!`O!u%wX#`%wX%g%wX%h%wX%}%wX&O%wX&P%wX&Y%wX&Z%wX&[%wX&k%wX&l%wX&m%wX&n%wX&o%wX&w%wX&{%wX&|%wX&}%wX'O%wX'P%wX'Q%wX'R%wX'S%wX'T%wX'W%wX&`%wX&a%wX&]%wXW%wXY%wXZ%wX_%wXa%wX'U%wX&i%wX~P.ZO%j!bO%}!aO&b!dO~O%i!eO%}!aO&d!gO~O%k!hO%}!aO&e!jO~O%p!kO%q!lO'V!mO!u%|X#`%|X%g%|X%h%|X%l%|X%n%|X%o%|X%r%|X%}%|X&O%|X&P%|X&Y%|X&Z%|X&[%|X&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|XZ%|X_%|Xa%|XW%|XY%|X~O%l!nO~P4QO%s!oO~OUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO$Q!OO$S!PO$U!QO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&mZO&nZO&oZO&pbO&qbO&x^O!u&jX#`&jX%g&jX%h&jX%l&jX%n&jX%o&jX%r&jX&[&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX&`&jX&a&jXZ&jX_&jXa&jXW&jXY&jX&]&jX'U&jX&i&jX~OP!pO#z{O#||O$O}O$W!RO&lYO&zgO~P6|OP!rOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lYO&mZO&nZO&oZO&pbO&qbO&x^O&zgO~O&[!wO&`!xO&a!vO~P<QO%}ZO&YZO&ZZO&kXO&lXO&mZO&nZO&oZO~OP#RO&O#QO~P?aOP2vOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z2kO#|2lO$O2mO$Q!OO$S!PO$U!QO$W2nO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l8VO&mZO&nZO&oZO&pbO&qbO&x^O&z8_O~O&]#SO~P@VO!u%|X#`%|X%g%|X%h%|X%l%|X%n%|X%o%|X%r%|X%}%|X&O%|X&P%|X&Y%|X&Z%|X&[%|X&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|Xc%|X&`%|X&a%|XU%|X]%|Xn%|Xp%|Xr%|Xt%|Xu%|Xw%|Xy%|X{%|X!d%|X#Q%|X#T%|X#u%|X#w%|X#z%|X#|%|X$O%|X$Q%|X$S%|X$U%|X$W%|X$Z%|X$[%|X$a%|X&Q%|X&]%|X&b%|X&d%|X&e%|X&x%|X&z%|XW%|XY%|XZ%|X_%|Xa%|X'U%|X&i%|X~OP#XO%y#WO~PC`OP!WOp`O!d`O%y!XO%}PO&OWO&P!VO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO&pbO&qbO~O!u#eO#`#eO%}#cO&OWO&P#jO&Y#^O&Z#^O&[#ZO&kXO&lXO&m#bO&n#`O&o#eO&w#]O&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'R#gO'S#hO'T#iO'W#kO~O%h#lO%g%vXZ%vX_%vXa%vXW%vXY%vX~PItO%h#lO%g%vXZ%vX_%vXa%vXW%vXY%vX~O&Y#^O&Z#^O~PK{O%l#rO!u$cX#`$cX%g$cX%h$cX&[$cX&w$cX&{$cX&|$cX&}$cX'O$cX'P$cX'Q$cX'R$cX'S$cX'T$cX'W$cX&`$cX&a$cX&]$cXZ$cX_$cXa$cXW$cXY$cX&i$cX'U$cX~P@VOP!pOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lYO&mZO&nZO&oZO&pbO&qbO&x^O&zgO~O'V!mO~OP2wOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z2kO#|2lO$O2mO$Q!OO$S!PO$U!QO$W2oO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l8WO&mZO&nZO&oZO&pbO&qbO&x^O&z8`O~OZ#wO_#uOa#vO~P]Oo#{O~Oo#|O~Ou$OO~OP$PO~OP$QO~OP$VO%y$UO%}$RO&OWO&P$SO&YZO&ZZO&kXO&lXO&mZO&nZO&oZO~OP$VO%}$RO&OWO&P$SO&YZO&ZZO&kXO&lXO&mZO&nZO&oZO~O%y$XO~P!(`OP$]O%y$[O~OP$aO%}$`O~OP8nO%}2UO~OZ$fO~P]O!u$VX#`$VX%g$VX%h$VX&[$VX&w$VX&{$VX&|$VX&}$VX'O$VX'P$VX'Q$VX'R$VX'S$VX'T$VX'W$VX&`$VX&a$VXZ$VX_$VXa$VXW$VXY$VX&]$VX'U$VX&i$VX~PNgOP$kO&O$jO~OP$mO~O%n!_O%o!]O%r$nO!uha#`ha%gha%hha%}ha&Oha&Pha&Yha&Zha&[ha&kha&lha&mha&nha&oha&pha&qha&wha&{ha&|ha&}ha'Oha'Pha'Qha'Rha'Sha'Tha'Whacha&`ha&ahaPhaUha]hanhapharhathauhawhayha{ha!dha#Qha#Tha#uha#wha#zha#|ha$Oha$Qha$Sha$Uha$Wha$Zha$[ha$aha%yha&Qha&]ha&bha&dha&eha&xha&zhaWhaYhaZha_haaha'Uha&iha~O%lha~P!,OOP!ZO~PHgO%p!kO%q!lOP%|X%y%|X~PC`O&a$qO~P<QO%n!_O%o!]O!uja#`ja%hja%lja%}ja&Oja&Pja&Yja&Zja&[ja&kja&lja&mja&nja&oja&pja&qja&wja&{ja&|ja&}ja'Oja'Pja'Qja'Rja'Sja'Tja'WjaWjaYjaZja~O%r$nO%gjacja&`ja&ajaPjaUja]janjapjarjatjaujawjayja{ja!dja#Qja#Tja#uja#wja#zja#|ja$Oja$Qja$Sja$Uja$Wja$Zja$[ja$aja%yja&Qja&]ja&bja&dja&eja&xja&zja_jaaja'Uja&ija~P!1rO%p!kO%q!lO!u!ea#`!ea%h!ea%l!ea%n!ea%o!ea%r!ea%}!ea&O!ea&P!ea&Y!ea&Z!ea&[!ea&k!ea&l!ea&m!ea&n!ea&o!ea&p!ea&q!ea&w!ea&{!ea&|!ea&}!ea'O!ea'P!ea'Q!ea'R!ea'S!ea'T!ea'W!eac!ea&`!ea&a!eaP!eaU!ea]!ean!eap!ear!eat!eau!eaw!eay!ea{!ea!d!ea#Q!ea#T!ea#u!ea#w!ea#z!ea#|!ea$O!ea$Q!ea$S!ea$U!ea$W!ea$Z!ea$[!ea$a!ea%y!ea&Q!ea&]!ea&b!ea&d!ea&e!ea&x!ea&z!eaZ!ea'U!ea&i!ea~O%g!eaW!eaY!ea_!eaa!ea~P!6vO&O$rO~O&Q$sO~O%y$tO~O&h$wO~OP$zO%l${O~O%j!bO%}!aO&b$}O~O%i!eO%}!aO&d%PO~O%k!hO%}!aO&e%RO~O&bSO&dTO~O&eUO~O&k%WO&l%WO~Oc%|X&`%|X&a%|X&]%|X'U%|X&i%|XU%|X~P4QO'W#kO!u$ga#`$ga%g$ga%h$ga%}$ga&O$ga&P$ga&Y$ga&Z$ga&[$ga&k$ga&l$ga&m$ga&n$ga&o$ga&w$ga&{$ga&|$ga&}$ga'O$ga'P$ga'Q$ga'R$ga'S$ga'T$gac$ga&`$ga&a$gaP$gaU$ga]$gan$gap$gar$gat$gau$gaw$gay$ga{$ga!d$ga#Q$ga#T$ga#u$ga#w$ga#z$ga#|$ga$O$ga$Q$ga$S$ga$U$ga$W$ga$Z$ga$[$ga$a$ga%y$ga&Q$ga&]$ga&b$ga&d$ga&e$ga&p$ga&q$ga&x$ga&z$gaW$gaY$gaZ$ga_$gaa$ga'U$ga&i$ga~O%p!kO%q!lO'V!mOc%|X!u%|X#`%|X%h%|X%l%|X%n%|X%o%|X%r%|X%}%|X&O%|X&P%|X&Y%|X&Z%{X&Z%|X&[%|X&`%|X&a%|X&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X~O&[#OX&[%zX&`#OX&a#OX~Oc%^O!u#eO#`#eO%h%YO%}#cO&OWO&P#jO&Y%XO&Z%XO&kXO&lXO&m#bO&n#`O&o#eO&w#]O&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'R#gO'S#hO'T#iO'W#kO&[%zX&a'YX~O&[&uX&`&uX&a&uX~P!E{O!uea#`ea%gea%hea%lea%nea%oea%rea%}ea&Oea&Pea&Yea&Zea&[ea&kea&lea&mea&nea&oea&pea&qea&wea&{ea&|ea&}ea'Oea'Pea'Qea'Rea'Sea'Tea'V!}a'Weacea&`ea&aeaPeaUea]eaneapeareateaueaweayea{ea!dea#Qea#Tea#uea#wea#zea#|ea$Oea$Qea$Sea$Uea$Wea$Zea$[ea$aea%yea&Qea&]ea&bea&dea&eea&xea&zeaWeaYeaZea_eaaea'Uea&iea~O&a%_O~OP2SOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8jO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l8XO&mZO&nZO&oZO&pbO&qbO&x^O&z8aO~O&[%cO&`%eO&a%_O~O%h%YO&a'YX~O&a%fO~O&Z%gO~O&[%hO~O%s!oOP#XXU#XX]#XXc#XXn#XXp#XXr#XXt#XXu#XXw#XXy#XX{#XX!d#XX!u#XX#Q#XX#T#XX#`#XX#u#XX#w#XX#z#XX#|#XX$O#XX$Q#XX$S#XX$U#XX$W#XX$Z#XX$[#XX$a#XX%g#XX%h#XX%l#XX%y#XX%}#XX&O#XX&P#XX&Q#XX&Y#XX&Z#XX&[#XX&b#XX&d#XX&e#XX&k#XX&l#XX&m#XX&n#XX&o#XX&p#XX&q#XX&w#XX&x#XX&z#XX&{#XX&|#XX&}#XX'O#XX'P#XX'Q#XX'R#XX'S#XX'T#XX'W#XX&`#XX&a#XX&]#XXW#XXY#XXZ#XX_#XXa#XX'U#XX&i#XX~O&OWO&kXO&lXO&{#_O&|#_O'W#kOP%ZXU%ZX]%ZXn%ZXp%ZXr%ZXt%ZXu%ZXw%ZXy%ZX{%ZX!d%ZX#Q%ZX#T%ZX#u%ZX#w%ZX#z%ZX#|%ZX$O%ZX$Q%ZX$S%ZX$U%ZX$W%ZX$Z%ZX$[%ZX$a%ZX%y%ZX&Q%ZX&Y%ZX&Z%ZX&`%ZX&b%ZX&d%ZX&e%ZX&p%ZX&q%ZX&x%ZX&z%ZX~Oc%^O!u3xO#`3xO%}3lO&P4bO&[%jO&]%lO&m3fO&n3YO&o3xO&w3PO&}3`O'O3rO'P3xO'Q4OO'R4UO'S4[O'T=WO~P#'wOP2wOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z2kO#|2lO$O2mO$Q!OO$S!PO$U!QO$W2nO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l8YO&mZO&nZO&oZO&pbO&qbO&x^O&z8bO~O&]#qX&`#qX~P#,PO&]%rO&`%pO~OP2yOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l8ZO&mZO&nZO&oZO&pbO&qbO&x^O&z8cO~O%n!_O%o!]O%r$nO!uga#`ga%hga%lga%}ga&Oga&Pga&Yga&Zga&[ga&kga&lga&mga&nga&oga&pga&qga&wga&{ga&|ga&}ga'Oga'Pga'Qga'Rga'Sga'Tga'WgaZga~O%ggacga&`ga&agaPgaUga]gangapgargatgaugawgayga{ga!dga#Qga#Tga#uga#wga#zga#|ga$Oga$Qga$Sga$Uga$Wga$Zga$[ga$aga%yga&Qga&]ga&bga&dga&ega&xga&zgaWgaYga_gaaga'Uga&iga~P#2gO%g$Xa%h$Xa&Y$Xa&Z$XaZ$Xa_$Xaa$Xa!u$Xa#`$Xa%}$Xa&O$Xa&P$Xa&k$Xa&l$Xa&m$Xa&n$Xa&o$Xa&w$Xa&{$Xa&|$Xa&}$Xa'O$Xa'P$Xa'Q$Xa'R$Xa'S$Xa'T$Xa'W$Xac$Xa&`$Xa&a$XaW$XaY$Xa&]$Xa'U$Xa&i$XaU$Xa~O&[#ZO~P#7kOP2zOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8lO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l8[O&mZO&nZO&oZO&pbO&qbO&x^O&z8dO~O%g%vaZ%va_%vaa%vaW%vaY%va~P]O%h&YO%g%vaZ%va_%vaa%vaW%vaY%va~O!u3xO#`3xO%}3lO&OWO&P4bO&[#ZO&kXO&lXO&m3fO&n3YO&o3xO&w3PO&{#_O&|#_O&}3`O'O3rO'P3xO'Q4OO'R4UO'S4[O'T=WO'W#kOP%eXU%eX]%eXc%eXn%eXp%eXr%eXt%eXu%eXw%eXy%eX{%eX!d%eX#Q%eX#T%eX#u%eX#w%eX#z%eX#|%eX$O%eX$Q%eX$S%eX$U%eX$W%eX$Z%eX$[%eX$a%eX%h%eX%y%eX&Q%eX&b%eX&d%eX&e%eX&p%eX&q%eX&x%eX&z%eX&`%eX&a%eX&]%eXZ%eXW%eXY%eX'U%eX~O&Y3VO&Z3VO%g%eX_%eXa%eX&i%eX~P#>YO&Y3VO&Z3VO~O!u$eX#`$eX%g$eX%h$eX&[$eX&w$eX&{$eX&|$eX&}$eX'O$eX'P$eX'Q$eX'R$eX'S$eX'T$eX'W$eX&`$eX&a$eX&]$eXZ$eX_$eXa$eXW$eXY$eX&i$eX'U$eX~P@VOPVOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O!u3yO#QvO#TwO#`3yO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y[O%}&aO&OWO&P&bO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lYO&m&dO&n&eO&o&fO&pbO&qbO&w3QO&x^O&zgO&{#_O&|#_O&}3aO'O3sO'P3yO'Q4PO'R4VO'S4]O'T=XO'W#kO~OW&gOY&hOZ&iO%h&lO~P#EOOP&mO%h&oOZ^Xa^X~P`O%h&qOZ`X~P]OZ&rO~OZ&rOa#vO~OZ&rO_#uOa#vO~OPVOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%l!^O%n!_O%o!]O%r$nO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lYO&mZO&nZO&oZO&p&wO&q&wO&x^O&zgO~OZ&xO~P#J_OZ&{O~P]OZ&}O~P]O%l!tX%n!tX%o!tX%r!tXU!tXZ!tX]!tXc!tXn!tXp!tXr!tXt!tXu!tXw!tXy!tX{!tX!d!tX#Q!tX#T!tX#u!tX#w!tX#z!tX#|!tX$O!tX$Q!tX$S!tX$U!tX$W!tX$Z!tX$[!tX$a!tX&Q!tX&b!tX&d!tX&e!tX&p!tX&q!tX&x!tX&z!tX%h!tX&a!tX~P!'hO%l'UO%n'TO%o'SO%r'RO~OZ'[O%l'ZO%n'TO%o'SO%r'RO~P]OUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8jO$Z!SO$[!SO$a!TO&OWO&Q_O&YZO&ZZO&[!wO&`!xO&a'dO&bSO&dTO&eUO&kXO&mZO&nZO&oZO&pbO&qbO&x^O&z8aO~OP'aO%y'bO%}'_O&P'`O&l8]O~P$#jOZ'eO~P]OZ'gO~O&a$qO~P!MXO!u'iO&Z'iO&r'iO~OZ'lO%h'nO&['jO~P]OZ'oO%h'qO~P#EOOU#xXZ#xXc#xX%h#xX%}#xX&O#xX&P#xX&Y#xX&[#xX&k#xX&l#xX&m#xX&n#xX&o#xX!u#xX#`#xX&]#xX&`#xX&w#xX&{#xX&|#xX&}#xX'O#xX'P#xX'Q#xX'R#xX'S#xX'T#xX'W#xX%g#xXW#xXY#xX&a#xX_#xXa#xX'U#xX&i#xX~O&Z'rOP#xX]#xXn#xXp#xXr#xXt#xXu#xXw#xXy#xX{#xX!d#xX#Q#xX#T#xX#u#xX#w#xX#z#xX#|#xX$O#xX$Q#xX$S#xX$U#xX$W#xX$Z#xX$[#xX$a#xX%y#xX&Q#xX&b#xX&d#xX&e#xX&p#xX&q#xX&x#xX&z#xX~P$(QOZ'uO%h'wO&['sO~P]O!u#ya#`#ya%g#ya%h#ya%}#ya&O#ya&P#ya&Y#ya&Z#ya&k#ya&l#ya&m#ya&n#ya&o#ya&w#ya&{#ya&|#ya&}#ya'O#ya'P#ya'Q#ya'R#ya'S#ya'T#ya'W#yac#ya&`#ya&a#yaZ#ya_#yaa#yaW#yaY#ya&]#ya'U#ya&i#yaU#ya~O&['xO~P$-VO!u#{a#`#{a%g#{a%h#{a%}#{a&O#{a&P#{a&Y#{a&Z#{a&k#{a&l#{a&m#{a&n#{a&o#{a&w#{a&{#{a&|#{a&}#{a'O#{a'P#{a'Q#{a'R#{a'S#{a'T#{a'W#{ac#{a&`#{a&a#{aZ#{a_#{aa#{aW#{aY#{a&]#{a'U#{a&i#{aU#{a~O&['xO~P$/sO!u#}a#`#}a%g#}a%h#}a%}#}a&O#}a&P#}a&Y#}a&Z#}a&k#}a&l#}a&m#}a&n#}a&o#}a&w#}a&{#}a&|#}a&}#}a'O#}a'P#}a'Q#}a'R#}a'S#}a'T#}a'W#}ac#}a&`#}a&a#}aZ#}a_#}aa#}aW#}aY#}a&]#}a'U#}a&i#}aU#}a~O&['xO~P$2aOZ'|O~O!u#eO#`#eO%}#cO&OWO&P#jO&[#ZO&kXO&lXO&m#bO&n#`O&o#eO&w#]O&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'R#gO'S#hO'T#iO'W#kO~O%g$Va%h$Va&Y$Va&Z$Vac$Va&`$Va&a$VaZ$Va_$Vaa$VaW$VaY$Va&]$Va'U$Va&i$VaU$Va~P$5SOP'}O&O$jO~O%m(RO&O(OO&[(PO!u$]X#`$]X%g$]X%h$]X%}$]X&P$]X&Y$]X&Z$]X&k$]X&l$]X&m$]X&n$]X&o$]X&w$]X&{$]X&|$]X&}$]X'O$]X'P$]X'Q$]X'R$]X'S$]X'T$]X'W$]Xc$]X&`$]X&a$]XP$]XU$]X]$]Xn$]Xp$]Xr$]Xt$]Xu$]Xw$]Xy$]X{$]X!d$]X#Q$]X#T$]X#u$]X#w$]X#z$]X#|$]X$O$]X$Q$]X$S$]X$U$]X$W$]X$Z$]X$[$]X$a$]X%y$]X&Q$]X&]$]X&b$]X&d$]X&e$]X&p$]X&q$]X&x$]X&z$]XW$]XY$]XZ$]X_$]Xa$]X'U$]X&i$]X~O&[(SO!u$`a#`$`a%g$`a%h$`a%}$`a&O$`a&P$`a&Y$`a&Z$`a&k$`a&l$`a&m$`a&n$`a&o$`a&w$`a&{$`a&|$`a&}$`a'O$`a'P$`a'Q$`a'R$`a'S$`a'T$`a'W$`ac$`a&`$`a&a$`aP$`aU$`a]$`an$`ap$`ar$`at$`au$`aw$`ay$`a{$`a!d$`a#Q$`a#T$`a#u$`a#w$`a#z$`a#|$`a$O$`a$Q$`a$S$`a$U$`a$W$`a$Z$`a$[$`a$a$`a%y$`a&Q$`a&]$`a&b$`a&d$`a&e$`a&p$`a&q$`a&x$`a&z$`aW$`aY$`aZ$`a_$`aa$`a'U$`a&i$`a~O&O(UO~OP(WO%}2VO&P(VO&x^O~OP(^OUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l(`O&mZO&nZO&oZO&p(cO&q(cO&x^O&z(fO~O&[(jO&](iO~P$AvO&[!wO&`!xO&a'dO~P!MXO!c(oO!u#hi#`#hi%g#hi%h#hi%l#hi%n#hi%o#hi%r#hi%}#hi&O#hi&P#hi&Y#hi&Z#hi&[#hi&k#hi&l#hi&m#hi&n#hi&o#hi&p#hi&q#hi&w#hi&{#hi&|#hi&}#hi'O#hi'P#hi'Q#hi'R#hi'S#hi'T#hi'W#hic#hi&`#hi&a#hiP#hiU#hi]#hin#hip#hir#hit#hiu#hiw#hiy#hi{#hi!d#hi#Q#hi#T#hi#u#hi#w#hi#z#hi#|#hi$O#hi$Q#hi$S#hi$U#hi$W#hi$Z#hi$[#hi$a#hi%y#hi&Q#hi&]#hi&b#hi&d#hi&e#hi&x#hi&z#hiW#hiY#hiZ#hi_#hia#hi'U#hi&i#hi~OP2xOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8jO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l8XO&mZO&nZO&oZO&pbO&qbO&x^O&z8aO~O%n!_O%o!]O%r$nOcgiPgiUgi]gingipgirgitgiugiwgiygi{gi!dgi#Qgi#Tgi#ugi#wgi#zgi#|gi$Ogi$Qgi$Sgi$Ugi$Wgi$Zgi$[gi$agi%ygi&Qgi&bgi&dgi&egi&xgi&zgi~O!ugi#`gi%ggi%hgi%lgi%}gi&Ogi&Pgi&Ygi&Zgi&[gi&kgi&lgi&mgi&ngi&ogi&pgi&qgi&wgi&{gi&|gi&}gi'Ogi'Pgi'Qgi'Rgi'Sgi'Tgi'Wgi&`gi&agi&]giWgiYgiZgi_giagi'Ugi&igi~P$MiO%y(qO~O!u#eO#`#eO%}#cO&OWO&P#jO&kXO&lXO&m#bO&n#`O&o#eO&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'W#kO%h$ji&[$ji&w$ji'R$ji'S$ji'T$jic$ji&`$ji&a$ji&]$ji'U$ji&i$jiU$ji~O%g$ji&Y$ji&Z$jiZ$ji_$jia$jiW$jiY$ji~P%$rO$q(sO&Y(rO&Z(rO~OP2zOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8jO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l=pO&mZO&nZO&oZO&pbO&qbO&x^O&z=rO~O&a'Ya~P#/eO%h(xO&a'Ya~OU(|Oc%^O&a'[X~O&a(}O~OP8mO%y$[O~O!u3zO#`3zO%}3mO&OWO&P4cO&kXO&lXO&m3gO&n3ZO&o3zO&w3RO&{#_O&|#_O&}3bO'O3tO'P3zO'Q4QO'R4WO'S4^O'T=YO'W#kO~O&[&uX&a&uX&`&uX~P%+fO&[)PO&a)RO~O&a)RO~P!MXO&[)TO&`)VO&a)RO~O&a)ZO~P!MXO&[)[O&a)ZO~O&])_O~P$JgO&[)`O&])_O~O&])bO~O!u3{O#`3{O%}3nO&P4dO&m3hO&n3[O&o3{O&w3SO&}3cO'O3uO'P3{O'Q4RO'R4XO'S4_O'T=ZOc%ZX&]%ZX~P#'wO&])dO~P#,PO&])dO&`)eO~O!u3|O#`3|O%}3oO&OWO&P4eO&Y%XO&Z%XO&kXO&lXO&m3iO&n3]O&o3|O&w3TO&{#_O&|#_O&}3dO'O3vO'P3|O'Q4SO'R4YO'S4`O'T=[O'W#kO~O%h%YO&a'YX~P%0PO&OWO&kXO&lXO&{#_O&|#_O'W#kO%g%aa%h%aa&Y%aa&Z%aa&[%aaZ%aa_%aaa%aac%aa&`%aa&a%aaW%aaY%aa&]%aa'U%aa&i%aaU%aa~O!u#eO#`#eO%}#cO&P#jO&m#bO&n#`O&o#eO&w#]O&}#aO'O#dO'P#eO'Q#fO'R#gO'S#hO'T#iO~P%1tO&OWO&kXO&lXO&{#_O&|#_O'W#kO%g$bi%h$bi&Y$bi&Z$bi&[$bic$bi&`$bi&a$biZ$bi_$bia$biW$biY$bi&]$bi'U$bi&i$biU$bi~O!u#eO#`#eO%}#cO&P#jO&m#bO&n#`O&o#eO&w#]O&}#aO'O#dO'P#eO'Q#fO'R#gO'S#hO'T#iO~P%4bO%g$fi%h$fiZ$fi_$fia$fiW$fiY$fi&a$fi'U$fiU$fic$fi&]$fi~PItO%g$fi%h$fiZ$fi_$fia$fiW$fiY$fi!u$fi#`$fi%}$fi&O$fi&P$fi&a$fi&k$fi&l$fi&m$fi&n$fi&o$fi&w$fi&{$fi&|$fi&}$fi'O$fi'P$fi'Q$fi'R$fi'S$fi'T$fi'W$fi'U$fiU$fic$fi&]$fi~O&Y#^O&Z#^O~P%7xO&{#_O&|#_O'W#kO!u$hi#`$hi%g$hi%h$hi%}$hi&O$hi&P$hi&Y$hi&Z$hi&[$hi&k$hi&l$hi&m$hi&o$hi&w$hi&}$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hic$hi&`$hi&a$hiP$hiU$hi]$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&]$hi&b$hi&d$hi&e$hi&p$hi&q$hi&x$hi&z$hiW$hiY$hiZ$hi_$hia$hi'U$hi&i$hi~O&n$hi~P%:]O&n#`O&{#_O&|#_O'W#kO!u$hi#`$hi%g$hi%h$hi%}$hi&O$hi&P$hi&Y$hi&Z$hi&[$hi&k$hi&l$hi&m$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hic$hi&`$hi&a$hiZ$hi_$hia$hiW$hiY$hi&]$hi'U$hi&i$hiU$hi~O&}$hi~P%?TO&}#aO~P%?TO&{#_O&|#_O'W#kO!u$hi#`$hi%g$hi%h$hi%}$hi&O$hi&P$hi&Y$hi&Z$hi&[$hi&k$hi&l$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hic$hi&`$hi&a$hiZ$hi_$hia$hiW$hiY$hi&]$hi'U$hi&i$hiU$hi~O&m#bO&n#`O&}#aO~P%AxO!u#eO#`#eO%}#cO&OWO&P#jO&kXO&lXO&m#bO&n#`O&o#eO&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'W#kO%g$hi%h$hi&Y$hi&Z$hi&[$hi&w$hi'R$hi'T$hic$hi&`$hi&a$hiZ$hi_$hia$hiW$hiY$hi&]$hi'U$hi&i$hiU$hi~O'S$hi~P%DfO%}#cO&OWO&P#jO&kXO&lXO&m#bO&n#`O&{#_O&|#_O&}#aO'W#kO!u$hi#`$hi%g$hi%h$hi&Y$hi&Z$hi&[$hi&o$hi&w$hi'O$hi'R$hi'S$hi'T$hic$hi&`$hi&a$hiZ$hi_$hia$hiW$hiY$hi&]$hi'U$hi&i$hiU$hi~O'P#eO'Q#fO~P%GSO'P$hi'Q$hi~P%GSO!u#eO#`#eO%}#cO&OWO&P#jO&kXO&lXO&m#bO&n#`O&o#eO&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'S#hO'W#kO%g$hi%h$hi&Y$hi&Z$hi&[$hi&w$hi'T$hic$hi&`$hi&a$hiZ$hi_$hia$hiW$hiY$hi&]$hi'U$hi&i$hiU$hi~O'R#gO~P%IzO'S#hO~P%DfO!u3}O#`3}O%}3pO&OWO&P4fO&kXO&lXO&m3jO&n3^O&o3}O&w3UO&{#_O&|#_O&}3eO'O3wO'P3}O'Q4TO'R4ZO'S4aO'T=]O'W#kO~O'U)gO~P%LoO&OWO&kXO&lXO&{#_O&|#_O'W#kO!u$mi#`$mi%g$mi%h$mi&P$mi&Y$mi&Z$mi&[$mi&o$mi&w$mi'O$mi'P$mi'Q$mi'R$mi'S$mi'T$mic$mi&`$mi&a$miZ$mi_$mia$miW$miY$mi&]$mi'U$mi&i$miU$mi~O%}#cO&m#bO&n#`O&}#aO~P%NZO%g%fa%h%faZ%fa_%faa%faW%faY%fa~PItO&Y#^O&Z#^O%g%fa%h%faZ%fa_%faa%faW%faY%fa~O%g%viZ%vi_%via%viW%viY%vi~P]OW&gOY&hOZ)jO~OW!tXY!tXZ!tX!u!tX#`!tX%h!tX%l!tX%n!tX%o!tX%r!tX&[!tX&w!tX&{!tX&|!tX&}!tX'O!tX'P!tX'Q!tX'R!tX'S!tX'T!tX'W!tX~P!#nOP)nOW$oXY$oXZ$oX!u$oX#`$oX%h$oX&[$oX&w$oX&{$oX&|$oX&}$oX'O$oX'P$oX'Q$oX'R$oX'S$oX'T$oX'W$oX~P!#qOZXX~P]OW&gOY&hOZ)jO~P]O%h)tO%l!nO%p!kO%q!lO'V!mOZ^aa^a!u%|X#`%|X%l%|X%n%|X%o%|X%r%|X&[%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X~P]OZ^aa^a~P]OZ`a~P]OZ)vO~OZ)vOa#vO~O%l!^O%n!_O%o!]O%r$nO&p!`O&q!`O~Op)xO~P&*bOZ)yO~P&*bOZ){O~OZ){O~P#J_OZ)}O~OZ*OO~O%n'TO%o'SO%r'RO%l|aP|aU|aZ|a]|ac|an|ap|ar|at|au|aw|ay|a{|a!d|a#Q|a#T|a#u|a#w|a#z|a#||a$O|a$Q|a$S|a$U|a$W|a$Z|a$[|a$a|a%y|a%}|a&O|a&P|a&Q|a&Y|a&Z|a&b|a&d|a&e|a&k|a&l|a&m|a&n|a&o|a&p|a&q|a&x|a&z|a%h|a&a|a~O%n'TO%o'SO%r'RO%l!OaP!OaU!OaZ!Oa]!Oac!Oan!Oap!Oar!Oat!Oau!Oaw!Oay!Oa{!Oa!d!Oa#Q!Oa#T!Oa#u!Oa#w!Oa#z!Oa#|!Oa$O!Oa$Q!Oa$S!Oa$U!Oa$W!Oa$Z!Oa$[!Oa$a!Oa%y!Oa%}!Oa&O!Oa&P!Oa&Q!Oa&Y!Oa&Z!Oa&b!Oa&d!Oa&e!Oa&k!Oa&l!Oa&m!Oa&n!Oa&o!Oa&p!Oa&q!Oa&x!Oa&z!Oa%h!Oa&a!Oa~O&O*PO~O&Q*QO~O%n'TO%o'SO%r'RO&Y*TO&Z*TO~O%h*UO&a&sX~P&2vO%h*UO&a&sX~O&a*WO~OZ*YO~OZ*YO~P]Op`O!d`O%y*^O&OWO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO&pbO&qbO!u!tX#`!tX%h!tX%l!tX%n!tX%o!tX%r!tX&[!tX&`!tX&a!tX&w!tX&{!tX&|!tX&}!tX'O!tX'P!tX'Q!tX'R!tX'S!tX'T!tX'W!tX~OP*]O%}'_O&P*[O~P&3|Op`O!d`O%y*^O&OWO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO&pbO&qbO!u$oX#`$oX&[$oX&`$oX&a$oX&w$oX&{$oX&|$oX&}$oX'O$oX'P$oX'Q$oX'R$oX'S$oX'T$oX'W$oX~OP*_O%}'_O&P*[O~P&6sO%p!kO%q!lO!u%|X#`%|X%h&TX%l%|X%n%|X%n&TX%o%|X%o&TX%r%|X%r&TX%}%|X&O%|X&P%|X&Y&TX&Z%{X&Z&TX&[%|X&`%|X&a%|X&a&TX&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X~O'V2sO~P&9ZOP2[OUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y'bO%}6XO&OWO&P6YO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lYO&mZO&nZO&oZO&pbO&qbO&x^O&zgO~O&[!wO&`!xO&a!vO~P&<QO!u%|X#`%|X%h&TX%l%|X%n%|X%n&TX%o%|X%o&TX%r%|X%r&TX%}%|X&O%|X&P%|X&Y&TX&Z&TX&[%|X&`%|X&a%|X&a&TX&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X~OZ*`O~O&[%zX&a%zX~P%+fOZ*dO%h*fO&['jO~P]OZ*dO~OZ*dO~P]OZ*gO~OZ*gO~P]OZ*lO%h*nO&['sO~P]OZ*lO~OZ*lO~P]O!u#yi#`#yi%g#yi%h#yi%}#yi&O#yi&P#yi&Y#yi&Z#yi&k#yi&l#yi&m#yi&n#yi&o#yi&w#yi&{#yi&|#yi&}#yi'O#yi'P#yi'Q#yi'R#yi'S#yi'T#yi'W#yic#yi&`#yi&a#yiZ#yi_#yia#yiW#yiY#yi&]#yi'U#yi&i#yiU#yi~O&['xO~P&CgO!u#{i#`#{i%g#{i%h#{i%}#{i&O#{i&P#{i&Y#{i&Z#{i&k#{i&l#{i&m#{i&n#{i&o#{i&w#{i&{#{i&|#{i&}#{i'O#{i'P#{i'Q#{i'R#{i'S#{i'T#{i'W#{ic#{i&`#{i&a#{iZ#{i_#{ia#{iW#{iY#{i&]#{i'U#{i&i#{iU#{i~O&['xO~P&FTO!u#}i#`#}i%g#}i%h#}i%}#}i&O#}i&P#}i&Y#}i&Z#}i&k#}i&l#}i&m#}i&n#}i&o#}i&w#}i&{#}i&|#}i&}#}i'O#}i'P#}i'Q#}i'R#}i'S#}i'T#}i'W#}ic#}i&`#}i&a#}iZ#}i_#}ia#}iW#}iY#}i&]#}i'U#}i&i#}iU#}i~O&['xO~P&HqOP*qO~OP*rO&O$jO~O&[(PO!u$]a#`$]a%g$]a%h$]a%}$]a&O$]a&P$]a&Y$]a&Z$]a&k$]a&l$]a&m$]a&n$]a&o$]a&w$]a&{$]a&|$]a&}$]a'O$]a'P$]a'Q$]a'R$]a'S$]a'T$]a'W$]ac$]a&`$]a&a$]aP$]aU$]a]$]an$]ap$]ar$]at$]au$]aw$]ay$]a{$]a!d$]a#Q$]a#T$]a#u$]a#w$]a#z$]a#|$]a$O$]a$Q$]a$S$]a$U$]a$W$]a$Z$]a$[$]a$a$]a%y$]a&Q$]a&]$]a&b$]a&d$]a&e$]a&p$]a&q$]a&x$]a&z$]aW$]aY$]aZ$]a_$]aa$]a'U$]a&i$]a~O&P*tO~OP*uO~O&[(SO!u$`i#`$`i%g$`i%h$`i%}$`i&O$`i&P$`i&Y$`i&Z$`i&k$`i&l$`i&m$`i&n$`i&o$`i&w$`i&{$`i&|$`i&}$`i'O$`i'P$`i'Q$`i'R$`i'S$`i'T$`i'W$`ic$`i&`$`i&a$`iP$`iU$`i]$`in$`ip$`ir$`it$`iu$`iw$`iy$`i{$`i!d$`i#Q$`i#T$`i#u$`i#w$`i#z$`i#|$`i$O$`i$Q$`i$S$`i$U$`i$W$`i$Z$`i$[$`i$a$`i%y$`i&Q$`i&]$`i&b$`i&d$`i&e$`i&p$`i&q$`i&x$`i&z$`iW$`iY$`iZ$`i_$`ia$`i'U$`i&i$`i~OP(WO%}2VO&P(VO~OP*yOZ(aOp(aO!d(aO%y*zO%}(YO&P*xO&Q(_O&p(cO&q(cO~P$_OP*|OZ(aOp(aO!d(aO%y*zO%}(YO&OWO&P*xO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO&p(cO&q(cO~Oc#fX!u#fX#`#fX&[#fX&]#fX&w#fX&{#fX&|#fX&}#fX'O#fX'P#fX'Q#fX'R#fX'S#fX'T#fX'W#fX%h#fX&`#fX&a#fXU#fX]#fXn#fXr#fXt#fXu#fXw#fXy#fX{#fX#Q#fX#T#fX#u#fX#w#fX#z#fX#|#fX$O#fX$Q#fX$S#fX$U#fX$W#fX$Z#fX$[#fX$a#fX&x#fX&z#fX'U#fX&i#fX~P'(]O%l+PO%n+QO%o+OO%r*}O&p+RO&q+ROc&RX!u&RX#`&RX%}&RX&O&RX&P&RX&Y&RX&Z&RX&[&RX&]&RX&k&RX&l&RX&m&RX&n&RX&o&RX&w&RX&{&RX&|&RX&}&RX'O&RX'P&RX'Q&RX'R&RX'S&RX'T&RX'W&RX%h&RX&`&RX&a&RXP&RXU&RXZ&RX]&RXn&RXp&RXr&RXt&RXu&RXw&RXy&RX{&RX!d&RX#Q&RX#T&RX#u&RX#w&RX#z&RX#|&RX$O&RX$Q&RX$S&RX$U&RX$W&RX$Z&RX$[&RX$a&RX%y&RX&Q&RX&b&RX&d&RX&e&RX&x&RX&z&RX'U&RX&i&RX~OP+ZOUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l(`O&mZO&nZO&oZO&p(cO&q(cO&x^O&z(fO~O&[+WO&`+XO&a+VO~P'1eO%p!kO%q!lOc&XX!u&XX#`&XX%l&XX%n&XX%o&XX%r&XX%}&XX&O&XX&P&XX&Y&XX&Z&XX&[&XX&]&XX&k&XX&l&XX&m&XX&n&XX&o&XX&p&XX&q&XX&w&XX&{&XX&|&XX&}&XX'O&XX'P&XX'Q&XX'R&XX'S&XX'T&XX'W&XX%h&XX&`&XX&a&XX'U&XX&i&XXU&XX~O'V+bO~P'4wOP8zOUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z2kO#|2lO$O2mO$Q!OO$S!PO$U!QO$W2nO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l6^O&mZO&nZO&oZO&p(cO&q(cO&x^O&z6`O~O&]+cO~P'7nO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&[&jX&]&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX%h&jX&`&jX&a&jX'U&jX&i&jX~P$AvOc&XX!u&XX#`&XX%l&XX%n&XX%o&XX%r&XX%}&XX&O&XX&P&XX&Y&XX&Z&XX&[&XX&]&XX&k&XX&l&XX&m&XX&n&XX&o&XX&p&XX&q&XX&w&XX&{&XX&|&XX&}&XX'O&XX'P&XX'Q&XX'R&XX'S&XX'T&XX'W&XX%h&XX&`&XX&a&XXU&XXZ&XX]&XXn&XXp&XXr&XXt&XXu&XXw&XXy&XX{&XX!d&XX#Q&XX#T&XX#u&XX#w&XX#z&XX#|&XX$O&XX$Q&XX$S&XX$U&XX$W&XX$Z&XX$[&XX$a&XX&Q&XX&b&XX&d&XX&e&XX&x&XX&z&XX'U&XX&i&XX~OP+iO%y+hO~P'<jOP*yOZ(aOp(aO!d(aO%y*zO%}(YO&OWO&P*xO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO&p(cO&q(cO~Oc,PO!u+uO#`+uO%}+sO&OWO&P+zO&kXO&lXO&m+rO&n+pO&o+uO&w+nO&{+oO&|+oO&}+qO'O+tO'P+uO'Q+vO'R+wO'S+xO'T+yO'W+{O~O&Y+}O&Z+}O&[+kO&],OO~P'BrO%l,UO!u#VX#`#VX&[#VX&]#VX&w#VX&{#VX&|#VX&}#VX'O#VX'P#VX'Q#VX'R#VX'S#VX'T#VX'W#VX%h#VX&`#VX&a#VX&i#VX'U#VX~P'7nO'V+bO~O&],OO~O&[,WO&],OO~O&[+kO&],OO~O&[,YO&i,[O~P%+fOP2zOUmO]nOcxOnoOpaOrpOtrOuqOwsOytO{uO!d`O#QvO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8kO$Z!SO$[!SO$a!TO%y[O%}PO&OWO&PQO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&l=qO&mZO&nZO&oZO&pbO&qbO&x^O&z=sO~O!u<aO#`<aO%}<]O&OWO&P<iO&kXO&lXO&m<ZO&n<VO&o<aO&w<TO&{#_O&|#_O&}<XO'O<_O'P<aO'Q<cO'R<eO'S<gO'T={O'W#kO~O%h'Zi&a'Zi~P'IwO%h%Wa&a%Wa~P%0PO&a'Yi~P#/eOU(|Oc%^O&a'[a~O&[,dOU#nac#na&a#na&]#na~O&a,gO~P!MXO&[,hO&a,gO~O&[fi&`fi&afi~P%+fO&a,mO~P!MXO&[%Qa&]%Qa&i%Qa~P%+fO&],oO~P$JgO&],qO~P#,POZ,tO~OWhaYhaZha!uha#`ha%hha%lha%}ha&Oha&Pha&Yha&Zha&[ha&kha&lha&mha&nha&oha&pha&qha&wha&{ha&|ha&}ha'Oha'Pha'Qha'Rha'Sha'Tha'Wha~P.ZOWjaYjaZja!uja#`ja%hja%lja%}ja&Oja&Pja&Yja&Zja&[ja&kja&lja&mja&nja&oja&pja&qja&wja&{ja&|ja&}ja'Oja'Pja'Qja'Rja'Sja'Tja'Wja~P.ZO%p!kO%q!lO'V2rOP%|XU%|X]%|Xc%|Xn%|Xp%|Xr%|Xt%|Xu%|Xw%|Xy%|X{%|X!d%|X#Q%|X#T%|X#u%|X#w%|X#z%|X#|%|X$O%|X$Q%|X$S%|X$U%|X$W%|X$Z%|X$[%|X$a%|X%y%|X&Q%|X&b%|X&d%|X&e%|X&x%|X&z%|X~OW!eaY!eaZ!ea!u!ea#`!ea%h!ea%l!ea%n!ea%o!ea%r!ea%}!ea&O!ea&P!ea&Y!ea&Z!ea&[!ea&k!ea&l!ea&m!ea&n!ea&o!ea&p!ea&q!ea&w!ea&{!ea&|!ea&}!ea'O!ea'P!ea'Q!ea'R!ea'S!ea'T!ea'W!ea~P($UO%h,vOWVaYVaZVa~P#EOOW&gOY&hOZ,tO~OZ^ia^i~P]OZ,zO~OZ,{O~OZga!uga#`ga%hga%lga%}ga&Oga&Pga&Yga&Zga&[ga&kga&lga&mga&nga&oga&pga&qga&wga&{ga&|ga&}ga'Oga'Pga'Qga'Rga'Sga'Tga'Wga~P$MiOZ,|O~OP-OO%},}O&P$SO~O&[-RO&]-QO~P$AvOZ-UO~P]O&a&sa~P!'hO%h-[O&a&sa~OZ-`O~Op`O!d`O%y*^O&OWO&Q_O&YZO&ZZO&bSO&dTO&eUO&kXO&lXO&mZO&nZO&oZO&pbO&qbO~OP*_O%}'_O&P*[O~P(-QO%p!kO%q!lO~P&?aO&a$qO~P&<QO%p!kO%q!lO!u!ea#`!ea%l!ea%n!ea%o!ea%r!ea%}!ea&O!ea&P!ea&[!ea&`!ea&a!ea&k!ea&l!ea&m!ea&n!ea&o!ea&p!ea&q!ea&w!ea&{!ea&|!ea&}!ea'O!ea'P!ea'Q!ea'R!ea'S!ea'T!ea'W!ea~O%h&TX&Y&TX&Z&TX~P(.wO!u3xO#`3xO%}3lO&OWO&P4bO&kXO&lXO&m3fO&n3YO&o3xO&w3PO&{#_O&|#_O&}3`O'O3rO'P3xO'Q4OO'R4UO'S4[O'T=WO'W#kO~OPdiUdiZdi]dicdindipdirditdiudiwdiydi{di!ddi#Qdi#Tdi#udi#wdi#zdi#|di$Odi$Qdi$Sdi$Udi$Wdi$Zdi$[di$adi%hdi%ydi&Qdi&Ydi&Zdi&[di&bdi&ddi&edi&pdi&qdi&xdi&zdi~P(1[OZ-aO~OZ-aO~P]OZ-cO~OP#xiU#xiZ#xi]#xic#xin#xip#xir#xit#xiu#xiw#xiy#xi{#xi!d#xi#Q#xi#T#xi#u#xi#w#xi#z#xi#|#xi$O#xi$Q#xi$S#xi$U#xi$W#xi$Z#xi$[#xi$a#xi%h#xi%y#xi&Q#xi&Y#xi&Z#xi&[#xi&b#xi&d#xi&e#xi&p#xi&q#xi&x#xi&z#xi&]#xi&`#xi%g#xiW#xiY#xi&a#xi_#xia#xi'U#xi&i#xi~P(1[OZ-dO~OZ-dO~P]O&O(OO!u%ba#`%ba%g%ba%h%ba%}%ba&P%ba&Y%ba&Z%ba&[%ba&k%ba&l%ba&m%ba&n%ba&o%ba&w%ba&{%ba&|%ba&}%ba'O%ba'P%ba'Q%ba'R%ba'S%ba'T%ba'W%bac%ba&`%ba&a%baP%baU%ba]%ban%bap%bar%bat%bau%baw%bay%ba{%ba!d%ba#Q%ba#T%ba#u%ba#w%ba#z%ba#|%ba$O%ba$Q%ba$S%ba$U%ba$W%ba$Z%ba$[%ba$a%ba%y%ba&Q%ba&]%ba&b%ba&d%ba&e%ba&p%ba&q%ba&x%ba&z%baW%baY%baZ%ba_%baa%ba'U%ba&i%ba~OP-fO&OWO&x^O~P?aO%n+QO%o+OO%r-hOc!Wa!u!Wa#`!Wa%l!Wa%}!Wa&O!Wa&P!Wa&Y!Wa&Z!Wa&[!Wa&]!Wa&k!Wa&l!Wa&m!Wa&n!Wa&o!Wa&p!Wa&q!Wa&w!Wa&{!Wa&|!Wa&}!Wa'O!Wa'P!Wa'Q!Wa'R!Wa'S!Wa'T!Wa'W!Wa%h!Wa&`!Wa&a!WaP!WaU!WaZ!Wa]!Wan!Wap!War!Wat!Wau!Waw!Way!Wa{!Wa!d!Wa#Q!Wa#T!Wa#u!Wa#w!Wa#z!Wa#|!Wa$O!Wa$Q!Wa$S!Wa$U!Wa$W!Wa$Z!Wa$[!Wa$a!Wa%y!Wa&Q!Wa&b!Wa&d!Wa&e!Wa&x!Wa&z!Wa'U!Wa&i!Wa~O%p!kO%q!lOP&XX%y&XX~P'<jO&a-kO~P'1eO%n+QO%o+OO%r-hOc!Ya!u!Ya#`!Ya%l!Ya%}!Ya&O!Ya&P!Ya&Y!Ya&Z!Ya&[!Ya&]!Ya&k!Ya&l!Ya&m!Ya&n!Ya&o!Ya&p!Ya&q!Ya&w!Ya&{!Ya&|!Ya&}!Ya'O!Ya'P!Ya'Q!Ya'R!Ya'S!Ya'T!Ya'W!Ya%h!Ya&`!Ya&a!YaP!YaU!YaZ!Ya]!Yan!Yap!Yar!Yat!Yau!Yaw!Yay!Ya{!Ya!d!Ya#Q!Ya#T!Ya#u!Ya#w!Ya#z!Ya#|!Ya$O!Ya$Q!Ya$S!Ya$U!Ya$W!Ya$Z!Ya$[!Ya$a!Ya%y!Ya&Q!Ya&b!Ya&d!Ya&e!Ya&x!Ya&z!Ya'U!Ya&i!Ya~O&O-lO~O&Q-mO~O%y-nO~O&h-qO~O&[!aX&[&VX&`!aX&a!aX~O%h-uO&Y-tO&Z-tO&[&VX&[&_X&`&_X&a&_X&a&fX~P'BrOc!Ta!u!Ta#`!Ta%l!Ta%n!Ta%o!Ta%r!Ta%}!Ta&O!Ta&P!Ta&Y!Ta&Z!Ta&[!Ta&]!Ta&k!Ta&l!Ta&m!Ta&n!Ta&o!Ta&p!Ta&q!Ta&w!Ta&{!Ta&|!Ta&}!Ta'O!Ta'P!Ta'Q!Ta'R!Ta'S!Ta'T!Ta'V!`a'W!Ta%h!Ta&`!Ta&a!TaP!TaU!TaZ!Ta]!Tan!Tap!Tar!Tat!Tau!Taw!Tay!Ta{!Ta!d!Ta#Q!Ta#T!Ta#u!Ta#w!Ta#z!Ta#|!Ta$O!Ta$Q!Ta$S!Ta$U!Ta$W!Ta$Z!Ta$[!Ta$a!Ta%y!Ta&Q!Ta&b!Ta&d!Ta&e!Ta&x!Ta&z!Ta'U!Ta&i!Ta~O&a-xO~OP2eOUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8jO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l9PO&mZO&nZO&oZO&p(cO&q(cO&x^O&z9UO~O&[-|O&`.OO&a-xO~O%p!kO%q!lOc&XX!u&XX#`&XX%h&XX%l&XX%n&XX%o&XX%r&XX%}&XX&O&XX&P&XX&Y&XX&Z&XX&[&XX&`&XX&a&XX&k&XX&l&XX&m&XX&n&XX&o&XX&p&XX&q&XX&w&XX&{&XX&|&XX&}&XX'O&XX'P&XX'Q&XX'R&XX'S&XX'T&XX'W&XX~O'V+bO&Z&WX~P)#yO%h-uO&a&fX~O&a.PO~O&Z&WX~P)$PO&Z.QO~O&[.RO~O&OWO&kXO&lXO&{+oO&|+oO'W+{OP${XU${XZ${X]${Xn${Xp${Xr${Xt${Xu${Xw${Xy${X{${X!d${X#Q${X#T${X#u${X#w${X#z${X#|${X$O${X$Q${X$S${X$U${X$W${X$Z${X$[${X$a${X%y${X&Q${X&Y${X&Z${X&`${X&b${X&d${X&e${X&p${X&q${X&x${X&z${X~Oc,PO!u6|O#`6|O%}6xO&P7UO&[.VO&].XO&m6vO&n6rO&o6|O&w6pO&}6tO'O6zO'P6|O'Q7OO'R7QO'S7SO'T=fO~P)'VOP8{OUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z2kO#|2lO$O2mO$Q!OO$S!PO$U!QO$W2pO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l6_O&mZO&nZO&oZO&p(cO&q(cO&x^O&z6aO~O&]!pX&`!pX~P)+bO&]._O&`.]O~O'W+{Oc#^a!u#^a#`#^a%}#^a&O#^a&P#^a&Y#^a&Z#^a&[#^a&]#^a&k#^a&l#^a&m#^a&n#^a&o#^a&w#^a&{#^a&|#^a&}#^a'O#^a'P#^a'Q#^a'R#^a'S#^a'T#^a%h#^a&`#^a&a#^aP#^aU#^aZ#^a]#^an#^ap#^ar#^at#^au#^aw#^ay#^a{#^a!d#^a#Q#^a#T#^a#u#^a#w#^a#z#^a#|#^a$O#^a$Q#^a$S#^a$U#^a$W#^a$Z#^a$[#^a$a#^a%y#^a&Q#^a&b#^a&d#^a&e#^a&p#^a&q#^a&x#^a&z#^a'U#^a&i#^a~OP8}OUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z{O#||O$O}O$Q!OO$S!PO$U!QO$W!RO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l9SO&mZO&nZO&oZO&p(cO&q(cO&x^O&z9XO~O%n+QO%o+OO%r-hOc!Va!u!Va#`!Va%l!Va%}!Va&O!Va&P!Va&Y!Va&Z!Va&[!Va&]!Va&k!Va&l!Va&m!Va&n!Va&o!Va&p!Va&q!Va&w!Va&{!Va&|!Va&}!Va'O!Va'P!Va'Q!Va'R!Va'S!Va'T!Va'W!Va%h!Va&`!Va&a!VaP!VaU!VaZ!Va]!Van!Vap!Var!Vat!Vau!Vaw!Vay!Va{!Va!d!Va#Q!Va#T!Va#u!Va#w!Va#z!Va#|!Va$O!Va$Q!Va$S!Va$U!Va$W!Va$Z!Va$[!Va$a!Va%y!Va&Q!Va&b!Va&d!Va&e!Va&x!Va&z!Va'U!Va&i!Va~O&].cO~P$AvO&[.dO&].cO~OU.hOc,PO&[&UX&]&UX~OP9OOUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8lO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l9TO&mZO&nZO&oZO&p(cO&q(cO&x^O&z9YO~OP8|OUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8jO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l9PO&mZO&nZO&oZO&p(cO&q(cO&x^O&z9UO~OP.wO%y.vO~O!u6|O#`6|O%}6xO&OWO&P7UO&[.yO&kXO&lXO&m6vO&n6rO&o6|O&w6pO&{+oO&|+oO&}6tO'O6zO'P6|O'Q7OO'R7QO'S7SO'T=fO'W+{OP%UXU%UXZ%UX]%UXc%UXn%UXp%UXr%UXt%UXu%UXw%UXy%UX{%UX!d%UX#Q%UX#T%UX#u%UX#w%UX#z%UX#|%UX$O%UX$Q%UX$S%UX$U%UX$W%UX$Z%UX$[%UX$a%UX%y%UX&Q%UX&]%UX&b%UX&d%UX&e%UX&p%UX&q%UX&x%UX&z%UX%h%UX&`%UX&a%UX'U%UX~O&Y.{O&Z.{O&i%UX~P)BTO&Y.{O&Z.{O~O!u#ZX#`#ZX&[#ZX&]#ZX&w#ZX&{#ZX&|#ZX&}#ZX'O#ZX'P#ZX'Q#ZX'R#ZX'S#ZX'T#ZX'W#ZX%h#ZX&`#ZX&a#ZX&i#ZX'U#ZX~P'7nOZ/PO~O&i/QO~P$JgO&[/RO&i/QO~O!u<bO#`<bO%}<^O&OWO&P<jO&kXO&lXO&m<[O&n<WO&o<bO&w<UO&{#_O&|#_O&}<YO'O<`O'P<bO'Q<dO'R<fO'S<hO'T=|O'W#kO~O&a/SO~P)HlO%g$py%h$pyZ$py_$pya$pyW$pyY$py~PItO&Y/TO&Z/TO~OU#oac#oa&a#oa~P)HlO&[,dOU#nic#ni&a#ni&]#ni~O&a/WO~P!MXO&[/YO&a/WO~O&OWO&kXO&lXO&{#_O&|#_O'W#kO%g$iy%h$iy&Y$iy&Z$iy&[$iy&w$iyc$iy&`$iy&a$iyZ$iy_$iya$iyW$iyY$iy&]$iy'U$iy&i$iyU$iy~O!u#eO#`#eO%}#cO&P#jO&m#bO&n#`O&o#eO&}#aO'O#dO'P#eO'Q#fO'R#gO'S#hO'T#iO~P)KxOWViYViZVi~P]OZ/]O~OW&gOY&hOZ/]O~O&Y/bO&Z/bO&[/_O&]/cO~P'BrO&]/cO~O&[/dO&]/cO~O&[/_O&]/cO~OZ/eO~O%n'TO%o'SO%r'RO%h&ti&a&ti~O%h%Ra&a%Ra~P&2vO&a&si~P!'hOZ/hO~OZ/iO~O&[/jO!u']X#`']X%g']X%h']X%}']X&O']X&P']X&Y']X&Z']X&k']X&l']X&m']X&n']X&o']X&w']X&{']X&|']X&}']X'O']X'P']X'Q']X'R']X'S']X'T']X'W']Xc']X&`']X&a']XP']XU']X]']Xn']Xp']Xr']Xt']Xu']Xw']Xy']X{']X!d']X#Q']X#T']X#u']X#w']X#z']X#|']X$O']X$Q']X$S']X$U']X$W']X$Z']X$[']X$a']X%y']X&Q']X&]']X&b']X&d']X&e']X&p']X&q']X&x']X&z']XW']XY']XZ']X_']Xa']X'U']X&i']X~O&O/lO~O%h-uO&Y-tO&Z-tO&[&VX&a&fX~P'BrOP/oO%}/mO&P/nO&x^O~O&[/sO&]/rO~P$AvO&[+WO&`+XO&a/vO~P(NiO!c(oOc!_i!u!_i#`!_i%l!_i%n!_i%o!_i%r!_i%}!_i&O!_i&P!_i&Y!_i&Z!_i&[!_i&]!_i&k!_i&l!_i&m!_i&n!_i&o!_i&p!_i&q!_i&w!_i&{!_i&|!_i&}!_i'O!_i'P!_i'Q!_i'R!_i'S!_i'T!_i'W!_i%h!_i&`!_i&a!_iP!_iU!_iZ!_i]!_in!_ip!_ir!_it!_iu!_iw!_iy!_i{!_i!d!_i#Q!_i#T!_i#u!_i#w!_i#z!_i#|!_i$O!_i$Q!_i$S!_i$U!_i$W!_i$Z!_i$[!_i$a!_i%y!_i&Q!_i&b!_i&d!_i&e!_i&x!_i&z!_i'U!_i&i!_i~O%n+QO%o+OO%r-hOc!Vi!u!Vi#`!Vi%l!Vi%}!Vi&O!Vi&P!Vi&Y!Vi&Z!Vi&[!Vi&]!Vi&k!Vi&l!Vi&m!Vi&n!Vi&o!Vi&p!Vi&q!Vi&w!Vi&{!Vi&|!Vi&}!Vi'O!Vi'P!Vi'Q!Vi'R!Vi'S!Vi'T!Vi'W!Vi%h!Vi&`!Vi&a!ViP!ViU!ViZ!Vi]!Vin!Vip!Vir!Vit!Viu!Viw!Viy!Vi{!Vi!d!Vi#Q!Vi#T!Vi#u!Vi#w!Vi#z!Vi#|!Vi$O!Vi$Q!Vi$S!Vi$U!Vi$W!Vi$Z!Vi$[!Vi$a!Vi%y!Vi&Q!Vi&b!Vi&d!Vi&e!Vi&x!Vi&z!Vi'U!Vi&i!Vi~OP9OOUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8jO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l9RO&mZO&nZO&oZO&p(cO&q(cO&x^O&z9WO~O&a&fa~P)3^O%h/}O&a&fa~O&a0PO~O!u:PO#`:PO%}9uO&OWO&P:eO&kXO&lXO&m9pO&n9fO&o:PO&w9aO&{+oO&|+oO&}9kO'O9zO'P:PO'Q:UO'R:ZO'S:`O'T=vO'W+{O~O&[&_X&a&_X&`&_X~P*6OO&[0QO&a0SO~O&a0SO~P(NiO&[0UO&`0WO&a0SO~O&a0]O~P(NiO&[0^O&a0]O~O!u+uO#`+uO%}+sO&OWO&P+zO&kXO&lXO&m+rO&n+pO&o+uO&{+oO&|+oO&}+qO'O+tO'P+uO'Q+vO'W+{Oc#bi&[#bi&]#bi&w#bi'R#bi'S#bi'T#bi&`#bi&a#bi&i#biU#bi~O&Y#bi&Z#bi%h#bi'U#bi~P*8kO&]0aO~P)>vO&[0bO&]0aO~O&]0dO~O!u6}O#`6}O%}6yO&P7VO&m6wO&n6sO&o6}O&w6qO&}6uO'O6{O'P6}O'Q7PO'R7RO'S7TO'T=gOc${X&]${X~P)'VO&]0fO~P)+bO&]0fO&`0gO~O!u:SO#`:SO%}9xO&OWO&P:hO&Y-tO&Z-tO&kXO&lXO&m9sO&n9iO&o:SO&w9dO&{+oO&|+oO&}9nO'O9}O'P:SO'Q:XO'R:^O'S:cO'T=yO'W+{O~O%h-uO&a&fX~P*<sO&Y0iO&Z0iO&[$sa&]$sa~P'BuO&]0jO~P$AvOU.hOc,PO&[&Ua&]&Ua~Oc#Ui&Y#Ui&Z#Ui&[#Ui&]#Ui%h#Ui&`#Ui&a#Ui'U#Ui&i#UiU#Ui~P'BuO&{+oO&|+oO'W+{Oc#_i!u#_i#`#_i%}#_i&O#_i&P#_i&Y#_i&Z#_i&[#_i&]#_i&k#_i&l#_i&m#_i&o#_i&w#_i&}#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i%h#_i&`#_i&a#_iP#_iU#_iZ#_i]#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i#Q#_i#T#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&b#_i&d#_i&e#_i&p#_i&q#_i&x#_i&z#_i'U#_i&i#_i~O&n#_i~P*@UO&n+pO&{+oO&|+oO'W+{Oc#_i!u#_i#`#_i%}#_i&O#_i&P#_i&Y#_i&Z#_i&[#_i&]#_i&k#_i&l#_i&m#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i%h#_i&`#_i&a#_i'U#_i&i#_iU#_i~O&}#_i~P*DmO&}+qO~P*DmO&{+oO&|+oO'W+{Oc#_i!u#_i#`#_i%}#_i&O#_i&P#_i&Y#_i&Z#_i&[#_i&]#_i&k#_i&l#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i%h#_i&`#_i&a#_i'U#_i&i#_iU#_i~O&m+rO&n+pO&}+qO~P*GOO!u+uO#`+uO%}+sO&OWO&P+zO&kXO&lXO&m+rO&n+pO&o+uO&{+oO&|+oO&}+qO'O+tO'P+uO'Q+vO'W+{Oc#_i&Y#_i&Z#_i&[#_i&]#_i&w#_i'R#_i'T#_i%h#_i&`#_i&a#_i'U#_i&i#_iU#_i~O'S#_i~P*IYO%}+sO&OWO&P+zO&kXO&lXO&m+rO&n+pO&{+oO&|+oO&}+qO'W+{Oc#_i!u#_i#`#_i&Y#_i&Z#_i&[#_i&]#_i&o#_i&w#_i'O#_i'R#_i'S#_i'T#_i%h#_i&`#_i&a#_i'U#_i&i#_iU#_i~O'P+uO'Q+vO~P*KdO'P#_i'Q#_i~P*KdO!u+uO#`+uO%}+sO&OWO&P+zO&kXO&lXO&m+rO&n+pO&o+uO&{+oO&|+oO&}+qO'O+tO'P+uO'Q+vO'S+xO'W+{Oc#_i&Y#_i&Z#_i&[#_i&]#_i&w#_i'T#_i%h#_i&`#_i&a#_i'U#_i&i#_iU#_i~O'R+wO~P*MxO'S+xO~P*IYO!u:TO#`:TO%}9yO&OWO&P:iO&kXO&lXO&m9tO&n9jO&o:TO&w9eO&{+oO&|+oO&}9oO'O:OO'P:TO'Q:YO'R:_O'S:dO'T=zO'W+{O~O'U0nO~P+!ZO&OWO&kXO&lXO&{+oO&|+oO'W+{Oc#di!u#di#`#di&P#di&Y#di&Z#di&[#di&]#di&o#di&w#di'O#di'P#di'Q#di'R#di'S#di'T#di%h#di&`#di&a#di'U#di&i#diU#di~O%}+sO&m+rO&n+pO&}+qO~P+#uO&[#gi&]#gi~P*6OO&a-kO~P(NiO!u0oO&Z0oO&r0oO~O&[0pOU!Rac!Ra&]!Ra&a!Ra~O&Y#]a&Z#]ac#]a!u#]a#`#]a%}#]a&O#]a&P#]a&]#]a&k#]a&l#]a&m#]a&n#]a&o#]a&w#]a&{#]a&|#]a&}#]a'O#]a'P#]a'Q#]a'R#]a'S#]a'T#]a'W#]a%h#]a&`#]a&a#]a'U#]a&i#]aU#]a~O&[.yO~P+'OO&i0wO~P$JgO&a0zO~P!MXO&[0{O&a0zO~OZ0|O~O&]0}O~P$AvO&[1OO&]0}O~O%l!^O%n!_O%o!]O%r$nOP#RaU#RaZ#Ra]#Rac#Ran#Rap#Rar#Rat#Rau#Raw#Ray#Ra{#Ra!d#Ra#Q#Ra#T#Ra#u#Ra#w#Ra#z#Ra#|#Ra$O#Ra$Q#Ra$S#Ra$U#Ra$W#Ra$Z#Ra$[#Ra$a#Ra%y#Ra%}#Ra&O#Ra&P#Ra&Q#Ra&Y#Ra&Z#Ra&b#Ra&d#Ra&e#Ra&k#Ra&l#Ra&m#Ra&n#Ra&o#Ra&p#Ra&q#Ra&x#Ra&z#Ra~OP1QO&OWO&x^O~P?aO&[/jO!u']a#`']a%g']a%h']a%}']a&O']a&P']a&Y']a&Z']a&k']a&l']a&m']a&n']a&o']a&w']a&{']a&|']a&}']a'O']a'P']a'Q']a'R']a'S']a'T']a'W']ac']a&`']a&a']aP']aU']a]']an']ap']ar']at']au']aw']ay']a{']a!d']a#Q']a#T']a#u']a#w']a#z']a#|']a$O']a$Q']a$S']a$U']a$W']a$Z']a$[']a$a']a%y']a&Q']a&]']a&b']a&d']a&e']a&p']a&q']a&x']a&z']aW']aY']aZ']a_']aa']a'U']a&i']a~OP/oO%}/mO&P/nO~O&Y1TO&Z1TO&[1UO&]1WO~P'BrO&]1WO~O&[1XO&]1WO~O&[1UO&]1WO~O&[1YO&i1[O~P*6OO!u:RO#`:RO%}9wO&OWO&P:gO&kXO&lXO&m9rO&n9hO&o:RO&w9cO&{+oO&|+oO&}9mO'O9|O'P:RO'Q:WO'R:]O'S:bO'T=xO'W+{O~O%h&gi&a&gi~P+3tO%h$ya&a$ya~P*<sO&a&fi~P)3^O&a1_O~P(NiO&[1`O&a1_O~O&[!Ui&`!Ui&a!Ui~P*6OO&[&VX&a&VX~P*6OO&a1eO~P(NiO&[$za&]$za&i$za~P*6OO&]1gO~P)>vO&]1iO~P)+bOU!vac!va&[!va&]!va~P*6OO&[0pOU!Ric!Ri&]!Ri&a!Ri~O&Y%Va&Z%Va&[%Vac%Va&]%Va%h%Va&`%Va&a%Va'U%Va&i%VaU%Va~P'BuO!u6|O#`6|O%}6xO&OWO&P7UO&kXO&lXO&m6vO&n6rO&o6|O&w6pO&{+oO&|+oO&}6tO'O6zO'P6|O'Q7OO'R7QO'S7SO'T=fO'W+{OP#[iU#[iZ#[i]#[ic#[in#[ip#[ir#[it#[iu#[iw#[iy#[i{#[i!d#[i#Q#[i#T#[i#u#[i#w#[i#z#[i#|#[i$O#[i$Q#[i$S#[i$U#[i$W#[i$Z#[i$[#[i$a#[i%y#[i&Q#[i&]#[i&b#[i&d#[i&e#[i&p#[i&q#[i&x#[i&z#[i%h#[i&`#[i&a#[i'U#[i~O&Y.{O&Z.{O&[#[i&i#[i~P+8xOP#[iU#[iZ#[i]#[ic#[in#[ip#[ir#[it#[iu#[iw#[iy#[i{#[i!d#[i!u#[i#Q#[i#T#[i#`#[i#u#[i#w#[i#z#[i#|#[i$O#[i$Q#[i$S#[i$U#[i$W#[i$Z#[i$[#[i$a#[i%y#[i%}#[i&O#[i&P#[i&Q#[i&]#[i&b#[i&d#[i&e#[i&k#[i&l#[i&m#[i&n#[i&o#[i&p#[i&q#[i&w#[i&x#[i&z#[i&{#[i&|#[i&}#[i'O#[i'P#[i'Q#[i'R#[i'S#[i'T#[i'W#[i%h#[i&`#[i&a#[i'U#[i~O&Y.{O&Z.{O&[#[i&i#[i~P+=aO%g$p!Z%h$p!ZZ$p!Z_$p!Za$p!ZW$p!ZY$p!Z~PItO&a1pO~P!MXO&]1qO~P$AvO&[!wi&]!wi~P*6OO&]1sO~P$AvO&[1tO&]1sO~O&i1uO~P)>vO&[1vO&i1uO~O&a1wO~P(NiO&[1yO&a1wO~O&[!^i&]!^i~P*6OO!u+uO#`+uO%}+sO&OWO&P+zO&kXO&lXO&m+rO&n+pO&o+uO&{+oO&|+oO&}+qO'O+tO'P+uO'Q+vO'R+wO'S+xO'T+yO'W+{O~Oc#ay&Y#ay&Z#ay&[#ay&]#ay&w#ay%h#ay&`#ay&a#ay'U#ay&i#ayU#ay~P+DUOU!Sic!Si&[!Si&]!Si&a!Si~P*6OO&[!]i&]!]i~P*6OO&]1{O~P$AvO&i1|O~P)>vO&a1}O~P(NiO&[2OO&a1}O~O&a2PO~P(NiO%l!^O~P!,OO!uha#`ha%gha%hha%}ha&Oha&Pha&Yha&Zha&[ha&kha&lha&mha&nha&oha&wha&{ha&|ha&}ha'Oha'Pha'Qha'Rha'Sha'Tha'Whacha&`ha&ahaZha_haaha'UhaWhaYha&]ha&ihaUha~P&*bO%p!kO%q!lO!u%|X#`%|X%l%|X%n%|X%o%|X%r%|X%}%|X&O%|X&P%|X&Z%{X&[%|X&a%|X&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X&`%|X~O'V2sO~P+JfO!u3xO#`3xO%}3lO&OWO&P4bO&kXO&lXO&m3fO&n3YO&o3xO&{#_O&|#_O&}3`O'O3rO'P3xO'Q4OO'W#kOP$jiU$jiW$jiY$jiZ$ji]$jic$jin$jip$jir$jit$jiu$jiw$jiy$ji{$ji!d$ji#Q$ji#T$ji#u$ji#w$ji#z$ji#|$ji$O$ji$Q$ji$S$ji$U$ji$W$ji$Z$ji$[$ji$a$ji%h$ji%y$ji&Q$ji&Y$ji&Z$ji&b$ji&d$ji&e$ji&p$ji&q$ji&w$ji&x$ji&z$ji'R$ji'S$ji'T$ji&]$ji&`$ji~O&[#ZO~P+LvO&Y3WO&Z3WO~P%$rO!u#eO#`#eO%}#cO&OWO&P#jO&[#ZO&kXO&lXO&m#bO&n#`O&o#eO&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'W#kO&w$ji'R$ji'S$ji'T$ji%h$ji&a$ji~O&Y#^O&Z#^O'U$jiU$jic$ji&]$ji~P,#fO&Y3VO&Z3VOP$fiU$fi]$fic$fin$fip$fir$fit$fiu$fiw$fiy$fi{$fi!d$fi#Q$fi#T$fi#u$fi#w$fi#z$fi#|$fi$O$fi$Q$fi$S$fi$U$fi$W$fi$Z$fi$[$fi$a$fi%g$fi%h$fi%y$fi&Q$fi&[$fi&b$fi&d$fi&e$fi&p$fi&q$fi&x$fi&z$fi&`$fi&a$fi&]$fiZ$fi_$fia$fiW$fiY$fi&i$fi'U$fi~P(1[O'V!mOc%|X%h%|X&Y%|X&Z%|X~P&9ZOc%|X%h%|X&Y%|X&Z%|X~P&?aO&[2^OP#yi]#yin#yip#yir#yit#yiu#yiw#yiy#yi{#yi!d#yi#Q#yi#T#yi#u#yi#w#yi#z#yi#|#yi$O#yi$Q#yi$S#yi$U#yi$W#yi$Z#yi$[#yi$a#yi%y#yi&Q#yi&b#yi&d#yi&e#yi&p#yi&q#yi&x#yi&z#yi~P&CgO&[2^OP#{i]#{in#{ip#{ir#{it#{iu#{iw#{iy#{i{#{i!d#{i#Q#{i#T#{i#u#{i#w#{i#z#{i#|#{i$O#{i$Q#{i$S#{i$U#{i$W#{i$Z#{i$[#{i$a#{i%y#{i&Q#{i&b#{i&d#{i&e#{i&p#{i&q#{i&x#{i&z#{i~P&FTO&[2^OP#}i]#}in#}ip#}ir#}it#}iu#}iw#}iy#}i{#}i!d#}i#Q#}i#T#}i#u#}i#w#}i#z#}i#|#}i$O#}i$Q#}i$S#}i$U#}i$W#}i$Z#}i$[#}i$a#}i%y#}i&Q#}i&b#}i&d#}i&e#}i&p#}i&q#}i&x#}i&z#}i~P&HqOP2dO%}6XO&P2bO~P(-QO%p!kO%q!lOc%|X%h%|X&Y%|X&Z%|X~P&?aOc!ea%h!ea&Y!ea&Z!ea~P(.wO%p!kO%q!lO'V6lO!u&XX#`&XX%l&XX%n&XX%o&XX%r&XX%}&XX&O&XX&P&XX&[&XX&a&XX&k&XX&l&XX&m&XX&n&XX&o&XX&p&XX&q&XX&w&XX&{&XX&|&XX&}&XX'O&XX'P&XX'Q&XX'R&XX'S&XX'T&XX'W&XX&`&XX~O&Z&WX~P,1|O&Z&WX~P,2VO&Y7uO&Z7uO~P*8kO!u6|O#`6|O%}6xO&OWO&P7UO&kXO&lXO&m6vO&n6rO&o6|O&{+oO&|+oO&}6tO'O6zO'P6|O'Q7OO'W+{OP#biU#biZ#bi]#bic#bin#bip#bir#bit#biu#biw#biy#bi{#bi!d#bi#Q#bi#T#bi#u#bi#w#bi#z#bi#|#bi$O#bi$Q#bi$S#bi$U#bi$W#bi$Z#bi$[#bi$a#bi%y#bi&Q#bi&Y#bi&Z#bi&]#bi&`#bi&b#bi&d#bi&e#bi&p#bi&q#bi&w#bi&x#bi&z#bi'R#bi'S#bi'T#bi~O&[.yO~P,4oO!u+uO#`+uO%}+sO&OWO&P+zO&[.yO&kXO&lXO&m+rO&n+pO&o+uO&{+oO&|+oO&}+qO'O+tO'P+uO'Q+vO'W+{O&w#bi'R#bi'S#bi'T#bi%h#bi&a#bi~O&Y7vO&Z7vO'U#biU#bic#bi&]#bi~P,8zO&Y7wO&Z7wO&[7sO~P+8xO!u$VX#`$VX&[$VX&]$VX&`$VX&w$VX&{$VX&|$VX&}$VX'O$VX'P$VX'Q$VX'R$VX'S$VX'T$VX'W$VX%g$VX%h$VX&a$VXW$VXY$VXZ$VX_$VXa$VX'U$VX&i$VX~P@VOW$VXY$VXZ$VX!u$VX#`$VX%h$VX&w$VX&{$VX&|$VX&}$VX'O$VX'P$VX'Q$VX'R$VX'S$VX'T$VX'W$VX~P@VOZ$VX!u$VX#`$VX&]$VX&`$VX&w$VX&{$VX&|$VX&}$VX'O$VX'P$VX'Q$VX'R$VX'S$VX'T$VX'W$VX~P@VO%p!kO%q!lO'V2qOP%|X%y%|X~PC`OW%|XY%|XZ%|X!u%|X#`%|X%h%|X%l%|X%n%|X%o%|X%r%|X%}%|X&O%|X&P%|X&Y%|X&Z%|X&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X&]%|X&`%|X&[%|X~P($UO%p!kO%q!lO!u%|X#`%|X%l%|X%n%|X%o%|X%r%|X%}%|X&O%|X&P%|X&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X&a%|X&]%|X'U%|X%h%|XU%|Xc%|X~O'V2sO&[%|X&i%|X&`%|X~P,BZO%p!kO%q!lO!u%|X#`%|X%h%|X%l%|X%n%|X%o%|X%r%|X%}%|X&O%|X&P%|X&a%|X&k%|X&l%|X&m%|X&n%|X&o%|X&p%|X&q%|X&w%|X&{%|X&|%|X&}%|X'O%|X'P%|X'Q%|X'R%|X'S%|X'T%|X'W%|X~O'V2tO&Y%|X&Z%|X~P,DzO'V2uO~P,BZO&[2{OP$Xa]$Xan$Xap$Xar$Xat$Xau$Xaw$Xay$Xa{$Xa!d$Xa#Q$Xa#T$Xa#u$Xa#w$Xa#z$Xa#|$Xa$O$Xa$Q$Xa$S$Xa$U$Xa$W$Xa$Z$Xa$[$Xa$a$Xa%y$Xa&Q$Xa&b$Xa&d$Xa&e$Xa&p$Xa&q$Xa&x$Xa&z$Xa~P#7kO&[2|O!u$Xa#`$Xa%}$Xa&O$Xa&P$Xa&a$Xa&k$Xa&l$Xa&m$Xa&n$Xa&o$Xa&w$Xa&{$Xa&|$Xa&}$Xa'O$Xa'P$Xa'Q$Xa'R$Xa'S$Xa'T$Xa'W$Xa'U$Xa&`$Xa&i$Xa%h$Xa&]$XaU$Xac$Xa~O&Y3XO&Z3XO~P#>YO&Y3WO&Z3WO~O&Y3XO&Z3XO~O&Y#^O&Z#^O~OW$eXY$eXZ$eX!u$eX#`$eX%h$eX&w$eX&{$eX&|$eX&}$eX'O$eX'P$eX'Q$eX'R$eX'S$eX'T$eX'W$eX&]$eX&`$eX&a$eX'U$eX~P@VO&[2^OP#ya]#yan#yap#yar#yat#yau#yaw#yay#ya{#ya!d#ya#Q#ya#T#ya#u#ya#w#ya#z#ya#|#ya$O#ya$Q#ya$S#ya$U#ya$W#ya$Z#ya$[#ya$a#ya%y#ya&Q#ya&b#ya&d#ya&e#ya&p#ya&q#ya&x#ya&z#ya~P$-VO&[2^OP#{a]#{an#{ap#{ar#{at#{au#{aw#{ay#{a{#{a!d#{a#Q#{a#T#{a#u#{a#w#{a#z#{a#|#{a$O#{a$Q#{a$S#{a$U#{a$W#{a$Z#{a$[#{a$a#{a%y#{a&Q#{a&b#{a&d#{a&e#{a&p#{a&q#{a&x#{a&z#{a~P$/sO&[2^OP#}a]#}an#}ap#}ar#}at#}au#}aw#}ay#}a{#}a!d#}a#Q#}a#T#}a#u#}a#w#}a#z#}a#|#}a$O#}a$Q#}a$S#}a$U#}a$W#}a$Z#}a$[#}a$a#}a%y#}a&Q#}a&b#}a&d#}a&e#}a&p#}a&q#}a&x#}a&z#}a~P$2aO&[2{OP$VaU$Va]$Vac$Van$Vap$Var$Vat$Vau$Vaw$Vay$Va{$Va!d$Va#Q$Va#T$Va#u$Va#w$Va#z$Va#|$Va$O$Va$Q$Va$S$Va$U$Va$W$Va$Z$Va$[$Va$a$Va%y$Va&Q$Va&Y$Va&Z$Va&]$Va&`$Va&b$Va&d$Va&e$Va&p$Va&q$Va&x$Va&z$Va%g$Va%h$VaW$VaY$VaZ$Va&a$Va_$Vaa$Va'U$Va&i$Va~P(1[O&[2|O&a$Va'U$Va&`$Va&i$Va%h$Va&]$VaU$Vac$Va~P%+fO&[$ji%g$ji&a$ji_$jia$ji'U$ji&i$ji~P+LvO!u3xO#`3xO%}3lO&P4bO&m3fO&n3YO&o3xO&w3PO&}3`O'O3rO'P3xO'Q4OO'R4UO'S4[O'T=WOP%aa]%aan%aap%aar%aat%aau%aaw%aay%aa{%aa!d%aa#Q%aa#T%aa#u%aa#w%aa#z%aa#|%aa$O%aa$Q%aa$S%aa$U%aa$W%aa$Z%aa$[%aa$a%aa%y%aa&Q%aa&b%aa&d%aa&e%aa&p%aa&q%aa&x%aa&z%aa~P%1tO&[%aa&a%aa'U%aa&`%aa&i%aa%h%aa&]%aaU%aac%aa~P%+fO!u3xO#`3xO%}3lO&P4bO&m3fO&n3YO&o3xO&w3PO&}3`O'O3rO'P3xO'Q4OO'R4UO'S4[O'T=WOP$bi]$bin$bip$bir$bit$biu$biw$biy$bi{$bi!d$bi#Q$bi#T$bi#u$bi#w$bi#z$bi#|$bi$O$bi$Q$bi$S$bi$U$bi$W$bi$Z$bi$[$bi$a$bi%y$bi&Q$bi&b$bi&d$bi&e$bi&p$bi&q$bi&x$bi&z$bi~P%4bO&OWO&kXO&lXO&{#_O&|#_O'W#kOP$biU$bi]$bic$bin$bip$bir$bit$biu$biw$biy$bi{$bi!d$bi#Q$bi#T$bi#u$bi#w$bi#z$bi#|$bi$O$bi$Q$bi$S$bi$U$bi$W$bi$Z$bi$[$bi$a$bi%y$bi&Q$bi&Y$bi&Z$bi&b$bi&d$bi&e$bi&p$bi&q$bi&x$bi&z$bi~O!u3yO#`3yO%}3qO&P4gO&m3kO&n3_O&o3yO&w3QO&}3aO'O3sO'P3yO'Q4PO'R4VO'S4]O'T=XOW$biY$biZ$bi%h$bi~P-2|O&[$bi&a$bi&`$bi&i$bi&]$bi'U$bi%h$biU$bic$bi~P%+fO!u3{O#`3{O%}3nO&P4dO&m3hO&n3[O&o3{O&w3SO&}3cO'O3uO'P3{O'Q4RO'R4XO'S4_O'T=ZO&]$bi&`$bi~P-2|O!u3|O#`3|O%}3oO&OWO&P4eO&kXO&lXO&m3iO&n3]O&o3|O&{#_O&|#_O&}3dO'O3vO'P3|O'Q4SO'R4YO'S4`O'T=[O'W#kO~O&w3TO%h$bi&Y$bi&Z$bi&a$bi~P-9RO'U$bi~P%LoO&Y3XO&Z3XO&[2{OP$fiU$fiW$fiY$fiZ$fi]$fic$fin$fip$fir$fit$fiu$fiw$fiy$fi{$fi!d$fi#Q$fi#T$fi#u$fi#w$fi#z$fi#|$fi$O$fi$Q$fi$S$fi$U$fi$W$fi$Z$fi$[$fi$a$fi%h$fi%y$fi&Q$fi&b$fi&d$fi&e$fi&p$fi&q$fi&x$fi&z$fi&]$fi&`$fi&a$fi'U$fi~P(1[O&Y3VO&Z3VOP$fi]$fin$fip$fir$fit$fiu$fiw$fiy$fi{$fi!d$fi#Q$fi#T$fi#u$fi#w$fi#z$fi#|$fi$O$fi$Q$fi$S$fi$U$fi$W$fi$Z$fi$[$fi$a$fi%y$fi&Q$fi&[$fi&b$fi&d$fi&e$fi&p$fi&q$fi&x$fi&z$fi&`$fi&i$fi~P%7xO&Y3WO&Z3WO&[$fi&`$fi&i$fi~P%7xOU$fiW$fiY$fiZ$fic$fi%h$fi&]$fi&`$fi&a$fi'U$fi~O&Y3XO&Z3XOP$fi]$fin$fip$fir$fit$fiu$fiw$fiy$fi{$fi!d$fi!u$fi#Q$fi#T$fi#`$fi#u$fi#w$fi#z$fi#|$fi$O$fi$Q$fi$S$fi$U$fi$W$fi$Z$fi$[$fi$a$fi%y$fi%}$fi&O$fi&P$fi&Q$fi&b$fi&d$fi&e$fi&k$fi&l$fi&m$fi&n$fi&o$fi&p$fi&q$fi&w$fi&x$fi&z$fi&{$fi&|$fi&}$fi'O$fi'P$fi'Q$fi'R$fi'S$fi'T$fi'W$fi~P-AWO&n3YO~P%:]O&n3_O&{#_O&|#_O'W#kOP$hiU$hiW$hiY$hiZ$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi!u$hi#Q$hi#T$hi#`$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%h$hi%y$hi%}$hi&O$hi&P$hi&Q$hi&Y$hi&Z$hi&b$hi&d$hi&e$hi&k$hi&l$hi&m$hi&o$hi&p$hi&q$hi&w$hi&x$hi&z$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi~O&}$hi~P-EvO&n3ZO&{#_O&|#_O'W#kO!u$hi#`$hi%}$hi&O$hi&P$hi&[$hi&a$hi&k$hi&l$hi&m$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi&`$hi&i$hi&]$hi'U$hi%h$hiU$hic$hi~O&}$hi~P-JRO&n3[O&{#_O&|#_O'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi!u$hi#Q$hi#T$hi#`$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi%}$hi&O$hi&P$hi&Q$hi&Y$hi&Z$hi&]$hi&`$hi&b$hi&d$hi&e$hi&k$hi&l$hi&m$hi&o$hi&p$hi&q$hi&w$hi&x$hi&z$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi~O&}$hi~P-LVO&n3]O&{#_O&|#_O'W#kO!u$hi#`$hi%h$hi%}$hi&O$hi&P$hi&Y$hi&Z$hi&a$hi&k$hi&l$hi&m$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi~O&}$hi~P.![O&n3^O&{#_O&|#_O'W#kO!u$hi#`$hi%}$hi&O$hi&P$hi&k$hi&l$hi&m$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi'U$hi~O&}$hi~P.$PO&n3YO&}3`OP$hi]$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&b$hi&d$hi&e$hi&m$hi&p$hi&q$hi&x$hi&z$hi~P%AxO&}3aO~P-EvO&}3bO~P-JRO&}3cO~P-LVO&}3dO~P.![O&}3eO~P.$PO&m3fO&n3YO&}3`OP$hi]$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&b$hi&d$hi&e$hi&p$hi&q$hi&x$hi&z$hi~P%AxO&m3kO&n3_O&{#_O&|#_O&}3aO'W#kOP$hiU$hiW$hiY$hiZ$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi!u$hi#Q$hi#T$hi#`$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%h$hi%y$hi&Q$hi&Y$hi&Z$hi&b$hi&d$hi&e$hi&o$hi&p$hi&q$hi&w$hi&x$hi&z$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi~O%}$hi&O$hi&P$hi&k$hi&l$hi~P.+`O&m3gO&n3ZO&{#_O&|#_O&}3bO'W#kO!u$hi#`$hi&[$hi&a$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi&`$hi&i$hi&]$hi'U$hi%h$hiU$hic$hi~O%}$hi&O$hi&P$hi&k$hi&l$hi~P./kO&m3hO&n3[O&{#_O&|#_O&}3cO'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi!u$hi#Q$hi#T$hi#`$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&Y$hi&Z$hi&]$hi&`$hi&b$hi&d$hi&e$hi&o$hi&p$hi&q$hi&w$hi&x$hi&z$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi~O%}$hi&O$hi&P$hi&k$hi&l$hi~P.1oO&m3iO&n3]O&{#_O&|#_O&}3dO'W#kO!u$hi#`$hi%h$hi&Y$hi&Z$hi&a$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi~O%}$hi&O$hi&P$hi&k$hi&l$hi~P.5tO&{#_O&|#_O'W#kO!u$hi#`$hi%}$hi&O$hi&P$hi&k$hi&l$hi&o$hi&w$hi'O$hi'P$hi'Q$hi'R$hi'S$hi'T$hi~O&m3jO&n3^O&}3eO'U$hi~P.7iO!u3xO#`3xO%}3lO&OWO&P4bO&kXO&lXO&m3fO&n3YO&o3xO&{#_O&|#_O&}3`O'O3rO'P3xO'Q4OO'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&Y$hi&Z$hi&[$hi&]$hi&`$hi&b$hi&d$hi&e$hi&p$hi&q$hi&w$hi&x$hi&z$hi'R$hi'T$hi%g$hi%h$hi&a$hiW$hiY$hiZ$hi_$hia$hi'U$hi&i$hi~O'S$hi~P.9TO!u3yO#`3yO%}3qO&OWO&P4gO&kXO&lXO&m3kO&n3_O&o3yO&{#_O&|#_O&}3aO'O3sO'P3yO'Q4PO'W#kOP$hiU$hiW$hiY$hiZ$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%h$hi%y$hi&Q$hi&Y$hi&Z$hi&b$hi&d$hi&e$hi&p$hi&q$hi&w$hi&x$hi&z$hi'R$hi'T$hi~O'S$hi~P.={O!u3zO#`3zO%}3mO&OWO&P4cO&kXO&lXO&m3gO&n3ZO&o3zO&{#_O&|#_O&}3bO'O3tO'P3zO'Q4QO'W#kO&[$hi&a$hi&w$hi'R$hi'T$hi&`$hi&i$hi&]$hi'U$hi%h$hiU$hic$hi~O'S$hi~P.BWO!u3{O#`3{O%}3nO&OWO&P4dO&kXO&lXO&m3hO&n3[O&o3{O&{#_O&|#_O&}3cO'O3uO'P3{O'Q4RO'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&Y$hi&Z$hi&]$hi&`$hi&b$hi&d$hi&e$hi&p$hi&q$hi&w$hi&x$hi&z$hi'R$hi'T$hi~O'S$hi~P.D[O!u3|O#`3|O%}3oO&OWO&P4eO&kXO&lXO&m3iO&n3]O&o3|O&{#_O&|#_O&}3dO'O3vO'P3|O'Q4SO'W#kO%h$hi&Y$hi&Z$hi&a$hi&w$hi'R$hi'T$hi~O'S$hi~P.HaO!u3}O#`3}O%}3pO&OWO&P4fO&kXO&lXO&m3jO&n3^O&o3}O&{#_O&|#_O&}3eO'O3wO'P3}O'Q4TO'W#kO&w$hi'R$hi'T$hi'U$hi~O'S$hi~P.JUO%}3lO&OWO&P4bO&kXO&lXO&m3fO&n3YO&{#_O&|#_O&}3`O'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi!u$hi#Q$hi#T$hi#`$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&Y$hi&Z$hi&[$hi&]$hi&`$hi&b$hi&d$hi&e$hi&o$hi&p$hi&q$hi&w$hi&x$hi&z$hi'O$hi'R$hi'S$hi'T$hi%g$hi%h$hi&a$hiW$hiY$hiZ$hi_$hia$hi'U$hi&i$hi~O'P3xO'Q4OO~P.KpO%}3qO&OWO&P4gO&kXO&lXO&m3kO&n3_O&{#_O&|#_O&}3aO'W#kOP$hiU$hiW$hiY$hiZ$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi!u$hi#Q$hi#T$hi#`$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%h$hi%y$hi&Q$hi&Y$hi&Z$hi&b$hi&d$hi&e$hi&o$hi&p$hi&q$hi&w$hi&x$hi&z$hi'O$hi'R$hi'S$hi'T$hi~O'P3yO'Q4PO~P/!hO%}3mO&OWO&P4cO&kXO&lXO&m3gO&n3ZO&{#_O&|#_O&}3bO'W#kO!u$hi#`$hi&[$hi&a$hi&o$hi&w$hi'O$hi'R$hi'S$hi'T$hi&`$hi&i$hi&]$hi'U$hi%h$hiU$hic$hi~O'P3zO'Q4QO~P/&sO%}3nO&OWO&P4dO&kXO&lXO&m3hO&n3[O&{#_O&|#_O&}3cO'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi!u$hi#Q$hi#T$hi#`$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&Y$hi&Z$hi&]$hi&`$hi&b$hi&d$hi&e$hi&o$hi&p$hi&q$hi&w$hi&x$hi&z$hi'O$hi'R$hi'S$hi'T$hi~O'P3{O'Q4RO~P/(wO%}3oO&OWO&P4eO&kXO&lXO&m3iO&n3]O&{#_O&|#_O&}3dO'W#kO!u$hi#`$hi%h$hi&Y$hi&Z$hi&a$hi&o$hi&w$hi'O$hi'R$hi'S$hi'T$hi~O'P3|O'Q4SO~P/,|O%}3pO&OWO&P4fO&kXO&lXO&m3jO&n3^O&{#_O&|#_O&}3eO'W#kO!u$hi#`$hi&o$hi&w$hi'O$hi'R$hi'S$hi'T$hi'U$hi~O'P3}O'Q4TO~P/.qO'P$hi'Q$hi~P.KpO'P$hi'Q$hi~P/!hO'P$hi'Q$hi~P/&sO'P$hi'Q$hi~P/(wO'P$hi'Q$hi~P/,|O'P$hi'Q$hi~P/.qO!u3xO#`3xO%}3lO&OWO&P4bO&kXO&lXO&m3fO&n3YO&o3xO&{#_O&|#_O&}3`O'O3rO'P3xO'Q4OO'S4[O'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&Y$hi&Z$hi&[$hi&]$hi&`$hi&b$hi&d$hi&e$hi&p$hi&q$hi&w$hi&x$hi&z$hi'T$hi%g$hi%h$hi&a$hiW$hiY$hiZ$hi_$hia$hi'U$hi&i$hi~O'R4UO~P/1kO!u3yO#`3yO%}3qO&OWO&P4gO&kXO&lXO&m3kO&n3_O&o3yO&{#_O&|#_O&}3aO'O3sO'P3yO'Q4PO'S4]O'W#kOP$hiU$hiW$hiY$hiZ$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%h$hi%y$hi&Q$hi&Y$hi&Z$hi&b$hi&d$hi&e$hi&p$hi&q$hi&w$hi&x$hi&z$hi'T$hi~O'R4VO~P/6cO!u3zO#`3zO%}3mO&OWO&P4cO&kXO&lXO&m3gO&n3ZO&o3zO&{#_O&|#_O&}3bO'O3tO'P3zO'Q4QO'S4^O'W#kO&[$hi&a$hi&w$hi'T$hi&`$hi&i$hi&]$hi'U$hi%h$hiU$hic$hi~O'R4WO~P/:nO!u3{O#`3{O%}3nO&OWO&P4dO&kXO&lXO&m3hO&n3[O&o3{O&{#_O&|#_O&}3cO'O3uO'P3{O'Q4RO'S4_O'W#kOP$hiU$hi]$hic$hin$hip$hir$hit$hiu$hiw$hiy$hi{$hi!d$hi#Q$hi#T$hi#u$hi#w$hi#z$hi#|$hi$O$hi$Q$hi$S$hi$U$hi$W$hi$Z$hi$[$hi$a$hi%y$hi&Q$hi&Y$hi&Z$hi&]$hi&`$hi&b$hi&d$hi&e$hi&p$hi&q$hi&w$hi&x$hi&z$hi'T$hi~O'R4XO~P/<rO!u3|O#`3|O%}3oO&OWO&P4eO&kXO&lXO&m3iO&n3]O&o3|O&{#_O&|#_O&}3dO'O3vO'P3|O'Q4SO'S4`O'W#kO%h$hi&Y$hi&Z$hi&a$hi&w$hi'T$hi~O'R4YO~P/@wO!u3}O#`3}O%}3pO&OWO&P4fO&kXO&lXO&m3jO&n3^O&o3}O&{#_O&|#_O&}3eO'O3wO'P3}O'Q4TO'S4aO'W#kO&w$hi'T$hi'U$hi~O'R4ZO~P/BlO'S4[O~P.9TO'S4]O~P.={O'S4^O~P.BWO'S4_O~P.D[O'S4`O~P.HaO'S4aO~P.JUO%}3lO&m3fO&n3YO&}3`OP$mi]$min$mip$mir$mit$miu$miw$miy$mi{$mi!d$mi#Q$mi#T$mi#u$mi#w$mi#z$mi#|$mi$O$mi$Q$mi$S$mi$U$mi$W$mi$Z$mi$[$mi$a$mi%y$mi&Q$mi&b$mi&d$mi&e$mi&p$mi&q$mi&x$mi&z$mi~P%NZO&OWO&kXO&lXO&{#_O&|#_O'W#kOP$miU$mi]$mic$min$mip$mir$mit$miu$miw$miy$mi{$mi!d$mi!u$mi#Q$mi#T$mi#`$mi#u$mi#w$mi#z$mi#|$mi$O$mi$Q$mi$S$mi$U$mi$W$mi$Z$mi$[$mi$a$mi%y$mi&P$mi&Q$mi&Y$mi&Z$mi&b$mi&d$mi&e$mi&o$mi&p$mi&q$mi&w$mi&x$mi&z$mi'O$mi'P$mi'Q$mi'R$mi'S$mi'T$mi~O%}3qO&m3kO&n3_O&}3aOW$miY$miZ$mi%h$mi~P/GnO&OWO&kXO&lXO&{#_O&|#_O'W#kO!u$mi#`$mi&P$mi&a$mi&o$mi&w$mi'O$mi'P$mi'Q$mi'R$mi'S$mi'T$mi&]$mi%h$miU$mic$mi~O%}3mO&m3gO&n3ZO&}3bO&[$mi&`$mi&i$mi'U$mi~P/KyO%}3nO&m3hO&n3[O&}3cO&]$mi&`$mi~P/GnO&OWO&kXO&lXO&{#_O&|#_O'W#kO!u$mi#`$mi%h$mi&P$mi&a$mi&o$mi&w$mi'O$mi'P$mi'Q$mi'R$mi'S$mi'T$mi~O%}3oO&m3iO&n3]O&}3dO&Y$mi&Z$mi~P/NeO&OWO&kXO&lXO&{#_O&|#_O'W#kO!u$mi#`$mi&P$mi&o$mi&w$mi'O$mi'P$mi'Q$mi'R$mi'S$mi'T$mi~O%}3pO&m3jO&n3^O&}3eO'U$mi~P0!YOP2cO%}6XO&P2bOc!tX~P&3|OP2dO%y*^O%}6XO&P2bO~P)cO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&[&jX&]&jX&`&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX%h&jX&a&jX'U&jX&i&jX~P'7nO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&]&jX&`&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX~P)+bOUdicdi&[di&adi&]di~P%+fO!u#eO#`#eO%}#cO&OWO&P#jO&kXO&lXO&m#bO&n#`O&o#eO&w#]O&{#_O&|#_O&}#aO'O#dO'P#eO'Q#fO'R#gO'S#hO'T#iO'W#kO~O%g#xi%h#xi&Y#xi&Z#xi&[#xic#xi&`#xi&a#xiZ#xi_#xia#xiW#xiY#xi&]#xi'U#xi&i#xiU#xi~P0'xO&[#xi&a#xi'U#xi&`#xi&i#xi%h#xi&]#xiU#xic#xi~P%+fO!u3xO#`3xO%}3lO&P4bO&m3fO&n3YO&o3xO&}3`O'O3rO'P3xO'Q4OO'R4UO'S4[O'T=WOP$iy]$iyn$iyp$iyr$iyt$iyu$iyw$iyy$iy{$iy!d$iy#Q$iy#T$iy#u$iy#w$iy#z$iy#|$iy$O$iy$Q$iy$S$iy$U$iy$W$iy$Z$iy$[$iy$a$iy%y$iy&Q$iy&b$iy&d$iy&e$iy&p$iy&q$iy&x$iy&z$iy~P)KxO&OWO&kXO&lXO&{#_O&|#_O'W#kOP$iyU$iy]$iyc$iyn$iyp$iyr$iyt$iyu$iyw$iyy$iy{$iy!d$iy#Q$iy#T$iy#u$iy#w$iy#z$iy#|$iy$O$iy$Q$iy$S$iy$U$iy$W$iy$Z$iy$[$iy$a$iy%y$iy&Q$iy&Y$iy&Z$iy&b$iy&d$iy&e$iy&p$iy&q$iy&w$iy&x$iy&z$iy~O!u3yO#`3yO%}3qO&P4gO&m3kO&n3_O&o3yO&}3aO'O3sO'P3yO'Q4PO'R4VO'S4]O'T=XOW$iyY$iyZ$iy%h$iy~P0.aO&OWO&kXO&lXO&{#_O&|#_O'W#kO&a$iy&w$iy&]$iy%h$iyU$iyc$iy~O!u3zO#`3zO%}3mO&P4cO&m3gO&n3ZO&o3zO&}3bO'O3tO'P3zO'Q4QO'R4WO'S4^O'T=YO&[$iy&`$iy&i$iy'U$iy~P02lO!u3{O#`3{O%}3nO&P4dO&m3hO&n3[O&o3{O&}3cO'O3uO'P3{O'Q4RO'R4XO'S4_O'T=ZO&]$iy&`$iy~P0.aO%h$iy&Y$iy&Z$iy&a$iy&w$iy~P-9RO!u3}O#`3}O%}3pO&OWO&P4fO&kXO&lXO&m3jO&n3^O&o3}O&{#_O&|#_O&}3eO'O3wO'P3}O'Q4TO'R4ZO'S4aO'T=]O'W#kO~O&w$iy'U$iy~P06ZO&[#bi%h#bi&a#bi'U#bi&i#bi~P,4oO&OWO&kXO&lXO&{+oO&|+oO'W+{OP#UiU#UiZ#Ui]#Uic#Uin#Uip#Uir#Uit#Uiu#Uiw#Uiy#Ui{#Ui!d#Ui#Q#Ui#T#Ui#u#Ui#w#Ui#z#Ui#|#Ui$O#Ui$Q#Ui$S#Ui$U#Ui$W#Ui$Z#Ui$[#Ui$a#Ui%y#Ui&Q#Ui&Y#Ui&Z#Ui&]#Ui&`#Ui&b#Ui&d#Ui&e#Ui&p#Ui&q#Ui&x#Ui&z#Ui~O!u6|O#`6|O%}6xO&P7UO&m6vO&n6rO&o6|O&w6pO&}6tO'O6zO'P6|O'Q7OO'R7QO'S7SO'T=fO&[#Ui%h#Ui&a#Ui'U#Ui&i#Ui~P08YO!u6}O#`6}O%}6yO&P7VO&m6wO&n6sO&o6}O&w6qO&}6uO'O6{O'P6}O'Q7PO'R7RO'S7TO'T=gO~P08YO&n6rO~P*@UO&n6sO&{+oO&|+oO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i!u#_i#Q#_i#T#_i#`#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i%}#_i&O#_i&P#_i&Q#_i&Y#_i&Z#_i&]#_i&`#_i&b#_i&d#_i&e#_i&k#_i&l#_i&m#_i&o#_i&p#_i&q#_i&w#_i&x#_i&z#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i~O&}#_i~P0={O&n6rO&}6tOP#_iZ#_i]#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i#Q#_i#T#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&b#_i&d#_i&e#_i&m#_i&p#_i&q#_i&x#_i&z#_i~P*GOO&}6uO~P0={O&m6vO&n6rO&}6tOP#_iZ#_i]#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i#Q#_i#T#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&b#_i&d#_i&e#_i&p#_i&q#_i&x#_i&z#_i~P*GOO&m6wO&n6sO&{+oO&|+oO&}6uO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i!u#_i#Q#_i#T#_i#`#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&Y#_i&Z#_i&]#_i&`#_i&b#_i&d#_i&e#_i&o#_i&p#_i&q#_i&w#_i&x#_i&z#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i~O%}#_i&O#_i&P#_i&k#_i&l#_i~P0GbO!u6|O#`6|O%}6xO&OWO&P7UO&kXO&lXO&m6vO&n6rO&o6|O&{+oO&|+oO&}6tO'O6zO'P6|O'Q7OO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i#Q#_i#T#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&Y#_i&Z#_i&[#_i&]#_i&`#_i&b#_i&d#_i&e#_i&p#_i&q#_i&w#_i&x#_i&z#_i'R#_i'T#_i%h#_i&a#_i'U#_i&i#_i~O'S#_i~P0KjO!u6}O#`6}O%}6yO&OWO&P7VO&kXO&lXO&m6wO&n6sO&o6}O&{+oO&|+oO&}6uO'O6{O'P6}O'Q7PO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i#Q#_i#T#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&Y#_i&Z#_i&]#_i&`#_i&b#_i&d#_i&e#_i&p#_i&q#_i&w#_i&x#_i&z#_i'R#_i'T#_i~O'S#_i~P1!RO%}6xO&OWO&P7UO&kXO&lXO&m6vO&n6rO&{+oO&|+oO&}6tO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i!u#_i#Q#_i#T#_i#`#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&Y#_i&Z#_i&[#_i&]#_i&`#_i&b#_i&d#_i&e#_i&o#_i&p#_i&q#_i&w#_i&x#_i&z#_i'O#_i'R#_i'S#_i'T#_i%h#_i&a#_i'U#_i&i#_i~O'P6|O'Q7OO~P1&ZO%}6yO&OWO&P7VO&kXO&lXO&m6wO&n6sO&{+oO&|+oO&}6uO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i!u#_i#Q#_i#T#_i#`#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&Y#_i&Z#_i&]#_i&`#_i&b#_i&d#_i&e#_i&o#_i&p#_i&q#_i&w#_i&x#_i&z#_i'O#_i'R#_i'S#_i'T#_i~O'P6}O'Q7PO~P1*rO'P#_i'Q#_i~P1&ZO'P#_i'Q#_i~P1*rO!u6|O#`6|O%}6xO&OWO&P7UO&kXO&lXO&m6vO&n6rO&o6|O&{+oO&|+oO&}6tO'O6zO'P6|O'Q7OO'S7SO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i#Q#_i#T#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&Y#_i&Z#_i&[#_i&]#_i&`#_i&b#_i&d#_i&e#_i&p#_i&q#_i&w#_i&x#_i&z#_i'T#_i%h#_i&a#_i'U#_i&i#_i~O'R7QO~P1/`O!u6}O#`6}O%}6yO&OWO&P7VO&kXO&lXO&m6wO&n6sO&o6}O&{+oO&|+oO&}6uO'O6{O'P6}O'Q7PO'S7TO'W+{OP#_iU#_iZ#_i]#_ic#_in#_ip#_ir#_it#_iu#_iw#_iy#_i{#_i!d#_i#Q#_i#T#_i#u#_i#w#_i#z#_i#|#_i$O#_i$Q#_i$S#_i$U#_i$W#_i$Z#_i$[#_i$a#_i%y#_i&Q#_i&Y#_i&Z#_i&]#_i&`#_i&b#_i&d#_i&e#_i&p#_i&q#_i&w#_i&x#_i&z#_i'T#_i~O'R7RO~P13wO'S7SO~P0KjO'S7TO~P1!RO%}6xO&m6vO&n6rO&}6tOP#diZ#di]#din#dip#dir#dit#diu#diw#diy#di{#di!d#di#Q#di#T#di#u#di#w#di#z#di#|#di$O#di$Q#di$S#di$U#di$W#di$Z#di$[#di$a#di%y#di&Q#di&b#di&d#di&e#di&p#di&q#di&x#di&z#di~P+#uO&OWO&kXO&lXO&{+oO&|+oO'W+{OU#dic#di!u#di#`#di&P#di&]#di&`#di&o#di&w#di'O#di'P#di'Q#di'R#di'S#di'T#di~O%}6yO&m6wO&n6sO&}6uOP#diZ#di]#din#dip#dir#dit#diu#diw#diy#di{#di!d#di#Q#di#T#di#u#di#w#di#z#di#|#di$O#di$Q#di$S#di$U#di$W#di$Z#di$[#di$a#di%y#di&Q#di&Y#di&Z#di&b#di&d#di&e#di&p#di&q#di&x#di&z#di~P1:|O&[7sOP#]aZ#]a]#]an#]ap#]ar#]at#]au#]aw#]ay#]a{#]a!d#]a#Q#]a#T#]a#u#]a#w#]a#z#]a#|#]a$O#]a$Q#]a$S#]a$U#]a$W#]a$Z#]a$[#]a$a#]a%y#]a&Q#]a&b#]a&d#]a&e#]a&p#]a&q#]a&x#]a&z#]a~P+'OO!u6|O#`6|O%}6xO&OWO&P7UO&kXO&lXO&m6vO&n6rO&o6|O&w6pO&{+oO&|+oO&}6tO'O6zO'P6|O'Q7OO'R7QO'S7SO'T=fO'W+{O~OP%VaU%VaZ%Va]%Vac%Van%Vap%Var%Vat%Vau%Vaw%Vay%Va{%Va!d%Va#Q%Va#T%Va#u%Va#w%Va#z%Va#|%Va$O%Va$Q%Va$S%Va$U%Va$W%Va$Z%Va$[%Va$a%Va%y%Va&Q%Va&Y%Va&Z%Va&[%Va&]%Va&b%Va&d%Va&e%Va&p%Va&q%Va&x%Va&z%Va%h%Va&`%Va&a%Va'U%Va&i%Va~P1AjO&Y7uO&Z7uOc#[i&[#[i&]#[i%h#[i&`#[i&a#[i&i#[iU#[i'U#[i~P'BuOc#[i!u#[i#`#[i%}#[i&O#[i&P#[i&]#[i&k#[i&l#[i&m#[i&n#[i&o#[i&w#[i&{#[i&|#[i&}#[i'O#[i'P#[i'Q#[i'R#[i'S#[i'T#[i'W#[i%h#[i&`#[i&a#[iU#[i'U#[i~O&Y7uO&Z7uO&[#[i&i#[i~P1FxO!u#[i#`#[i%h#[i%}#[i&O#[i&P#[i&a#[i&k#[i&l#[i&m#[i&n#[i&o#[i&w#[i&{#[i&|#[i&}#[i'O#[i'P#[i'Q#[i'R#[i'S#[i'T#[i'W#[i'U#[iU#[ic#[i&]#[i~O&Y7vO&Z7vO~P1ISO&Y7wO&Z7wO~P+=aO&OWO&kXO&lXO&{+oO&|+oO'W+{OP#ayU#ayZ#ay]#ayc#ayn#ayp#ayr#ayt#ayu#ayw#ayy#ay{#ay!d#ay#Q#ay#T#ay#u#ay#w#ay#z#ay#|#ay$O#ay$Q#ay$S#ay$U#ay$W#ay$Z#ay$[#ay$a#ay%y#ay&Q#ay&Y#ay&Z#ay&]#ay&`#ay&b#ay&d#ay&e#ay&p#ay&q#ay&w#ay&x#ay&z#ay~O!u6|O#`6|O%}6xO&P7UO&m6vO&n6rO&o6|O&}6tO'O6zO'P6|O'Q7OO'R7QO'S7SO'T=fO&[#ay%h#ay&a#ay'U#ay&i#ay~P1K_O!u6}O#`6}O%}6yO&P7VO&m6wO&n6sO&o6}O&}6uO'O6{O'P6}O'Q7PO'R7RO'S7TO'T=gO~P1K_O&Y$ji&Z$ji~P,#fO&Y3WO&Z3WO%g$fi%h$fi&[$fic$fi&`$fi&a$fiZ$fi_$fia$fiW$fiY$fi&i$fi&]$fi'U$fiU$fi~P0'xO&Y#bi&Z#bi~P,8zO&Y7vO&Z7vO&[.yO%h#[i&a#[i'U#[iU#[ic#[i&]#[i~P'BuOP2vO#z2kO#|2lO$O2mO$W2nO&l8VO&z8_O~P6|OW&jXY&jXZ&jX!u&jX#`&jX%h&jX%l&jX%n&jX%o&jX%r&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX&[&jX~P!#nO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&[&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX&`&jX&i&jX&]&jX'U&jX%h&jX~P$JgO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&]&jX&`&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX~P#,PO!u&jX#`&jX%h&jX%l&jX%n&jX%o&jX%r&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX~P#/eO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'U&jX'W&jX~P#:XO!u&jX#`&jX%h&jX%l&jX%n&jX%o&jX%r&jX&[&jX&`&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX~P$JgO%l#rOW$cXY$cXZ$cX!u$cX#`$cX%h$cX&w$cX&{$cX&|$cX&}$cX'O$cX'P$cX'Q$cX'R$cX'S$cX'T$cX'W$cX&]$cX&`$cX&a$cX'U$cX~P@VO'V2qO~O'V2rO~O'V2sO~O'V2tO~O'V2uO~O!u$VX#`$VX&[$VX&a$VX&w$VX&{$VX&|$VX&}$VX'O$VX'P$VX'Q$VX'R$VX'S$VX'T$VX'W$VX&`$VX&i$VX%h$VX&]$VX'U$VX~P$JgO!u$VX#`$VX&a$VX&w$VX&{$VX&|$VX&}$VX'O$VX'P$VX'Q$VX'R$VX'S$VX'T$VX'W$VX~P$JgO!u$VX#`$VX&w$VX&{$VX&|$VX&}$VX'O$VX'P$VX'Q$VX'R$VX'S$VX'T$VX'U$VX'W$VX~P$JgO!u6ZO&Z6ZO&r6ZO~O&Z6[O~P$(QO&Z6]O!u#xX#`#xX%}#xX&O#xX&P#xX&[#xX&a#xX&k#xX&l#xX&m#xX&n#xX&o#xX&w#xX&{#xX&|#xX&}#xX'O#xX'P#xX'Q#xX'R#xX'S#xX'T#xX'W#xX'U#xX&`#xX&i#xX%h#xX&]#xXU#xXc#xX~O'U6bO~P%LoO'U6cO~P%LoO'U6dO~P%LoO'U6eO~P%LoO'U6fO~P%LoO'U6gO~P%LoOP8oO%}2UO~O&[8vO!u#yi#`#yi%}#yi&O#yi&P#yi&a#yi&k#yi&l#yi&m#yi&n#yi&o#yi&w#yi&{#yi&|#yi&}#yi'O#yi'P#yi'Q#yi'R#yi'S#yi'T#yi'W#yi'U#yi&`#yi&i#yi%h#yi&]#yiU#yic#yi~O&[8vO!u#{i#`#{i%}#{i&O#{i&P#{i&a#{i&k#{i&l#{i&m#{i&n#{i&o#{i&w#{i&{#{i&|#{i&}#{i'O#{i'P#{i'Q#{i'R#{i'S#{i'T#{i'W#{i'U#{i&`#{i&i#{i%h#{i&]#{iU#{ic#{i~O&[8vO!u#}i#`#}i%}#}i&O#}i&P#}i&a#}i&k#}i&l#}i&m#}i&n#}i&o#}i&w#}i&{#}i&|#}i&}#}i'O#}i'P#}i'Q#}i'R#}i'S#}i'T#}i'W#}i'U#}i&`#}i&i#}i%h#}i&]#}iU#}ic#}i~O%p!kO%q!lO'V6kOP&XX%y&XX~P'<jO%p!kO%q!lOU&XXc&XX!u&XX#`&XX%l&XX%n&XX%o&XX%r&XX%}&XX&O&XX&P&XX&]&XX&`&XX&k&XX&l&XX&m&XX&n&XX&o&XX&p&XX&q&XX&w&XX&{&XX&|&XX&}&XX'O&XX'P&XX'Q&XX'R&XX'S&XX'T&XX'W&XX~O'V6mOP&XXZ&XX]&XXn&XXp&XXr&XXt&XXu&XXw&XXy&XX{&XX!d&XX#Q&XX#T&XX#u&XX#w&XX#z&XX#|&XX$O&XX$Q&XX$S&XX$U&XX$W&XX$Z&XX$[&XX$a&XX%y&XX&Q&XX&Y&XX&Z&XX&b&XX&d&XX&e&XX&x&XX&z&XX~P2=mO&]&XX&i&XXU&XXc&XX~P,1|O%p!kO%q!lO!u&XX#`&XX%h&XX%l&XX%n&XX%o&XX%r&XX%}&XX&O&XX&P&XX&a&XX&k&XX&l&XX&m&XX&n&XX&o&XX&p&XX&q&XX&w&XX&{&XX&|&XX&}&XX'O&XX'P&XX'Q&XX'R&XX'S&XX'T&XX'W&XX~O'V6nO&Y&XX&Z&XX~P2BlO'V6oO'U&XXU&XXc&XX&]&XX~P2BlO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&[&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX&]&jX&`&jX&i&jX~P)>vOP9OOUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&mZO&nZO&oZO&p(cO&q(cO&x^O!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX~O$W8kO&l9QO&z9VO~P2FyO$W8jO&l9RO&z9WO%h&jX&]&jX~P2FyO!u&jX#`&jX%h&jX%l&jX%n&jX%o&jX%r&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX~P)3^O!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'U&jX'W&jX~P);qOP9OOUmOZ(aO]nOcxOnoOp(bOrpOtrOuqOwsOytO{uO!d(aO#Q(mO#TwO#uyO#wzO#z=TO#|=UO$O=VO$Q!OO$S!PO$U!QO$W8kO$Z!SO$[!SO$a!TO%y(]O%}(YO&OWO&P(ZO&Q(_O&YZO&ZZO&bSO&dTO&eUO&kXO&l9QO&mZO&nZO&oZO&p(cO&q(cO&x^O&z9VO~O'V6kO~O'V6lO~O'V6mO~O'V6nO~O'V6oO~O&Y7wO&Z7wO~P)BTO&Y7uO&Z7uO~O&Y7vO&Z7vO~O&Y7wO&Z7wO~O!u#ZX#`#ZX&]#ZX&`#ZX&w#ZX&{#ZX&|#ZX&}#ZX'O#ZX'P#ZX'Q#ZX'R#ZX'S#ZX'T#ZX'W#ZX%h#ZX&a#ZX'U#ZX~P'7nO&[#Ui&a#Ui&]#Ui&`#Ui&i#UiU#Uic#Ui~P*6OO!u:QO#`:QO%}9vO&OWO&P:fO&kXO&lXO&m9qO&n9gO&o:QO&w9bO&{+oO&|+oO&}9lO'O9{O'P:QO'Q:VO'R:[O'S:aO'T=wO'W+{O~OU#Uic#Ui&a#Ui~P3&eO%h#Ui&a#UiU#Uic#Ui&]#Ui~P+3tO!u:SO#`:SO%}9xO&OWO&P:hO&kXO&lXO&m9sO&n9iO&o:SO&{+oO&|+oO&}9nO'O9}O'P:SO'Q:XO'R:^O'S:cO'T=yO'W+{O~O&w9dO%h#Ui&Y#Ui&Z#Ui&a#Ui~P3(jO'U#Ui~P+!ZO&n9fO&{+oO&|+oO'W+{O!u#_i#`#_i%}#_i&O#_i&P#_i&[#_i&a#_i&k#_i&l#_i&m#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i&]#_i&`#_i&i#_iU#_ic#_i~O&}#_i~P3*fO&{+oO&|+oO'W+{OU#_ic#_i!u#_i#`#_i%}#_i&O#_i&P#_i&a#_i&k#_i&l#_i&m#_i&o#_i&w#_i&}#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i~O&n9gO~P3,dO&n9hO%h#_i&]#_i~P3,dO&n9iO&{+oO&|+oO'W+{O!u#_i#`#_i%h#_i%}#_i&O#_i&P#_i&Y#_i&Z#_i&a#_i&k#_i&l#_i&m#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i~O&}#_i~P3.cO&n9jO&{+oO&|+oO'W+{O!u#_i#`#_i%}#_i&O#_i&P#_i&k#_i&l#_i&m#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i'U#_i~O&}#_i~P30WO&}9kO~P3*fO&n9gO&{+oO&|+oO&}9lO'W+{OU#_ic#_i!u#_i#`#_i%}#_i&O#_i&P#_i&a#_i&k#_i&l#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i~O&m#_i~P31yO&n9hO&{+oO&|+oO&}9mO'W+{O!u#_i#`#_i%h#_i%}#_i&O#_i&P#_i&a#_i&k#_i&l#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_iU#_ic#_i&]#_i~O&m#_i~P33kO&}9nO~P3.cO&}9oO~P30WO&m9pO&n9fO&{+oO&|+oO&}9kO'W+{O!u#_i#`#_i&[#_i&a#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i&]#_i&`#_i&i#_iU#_ic#_i~O%}#_i&O#_i&P#_i&k#_i&l#_i~P35qO&m9qO~P31yO&m9rO~P33kO&m9sO&n9iO&{+oO&|+oO&}9nO'W+{O!u#_i#`#_i%h#_i&Y#_i&Z#_i&a#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i~O%}#_i&O#_i&P#_i&k#_i&l#_i~P37}O&m9tO&n9jO&{+oO&|+oO&}9oO'W+{O!u#_i#`#_i&o#_i&w#_i'O#_i'P#_i'Q#_i'R#_i'S#_i'T#_i'U#_i~O%}#_i&O#_i&P#_i&k#_i&l#_i~P39rO!u:PO#`:PO%}9uO&OWO&P:eO&kXO&lXO&m9pO&n9fO&o:PO&{+oO&|+oO&}9kO'O9zO'P:PO'Q:UO'W+{O&[#_i&a#_i&w#_i'R#_i'T#_i&]#_i&`#_i&i#_iU#_ic#_i~O'S#_i~P3;^O!u:QO#`:QO%}9vO&OWO&P:fO&kXO&lXO&m9qO&n9gO&o:QO&{+oO&|+oO&}9lO'O9{O'P:QO'Q:VO'W+{OU#_ic#_i&a#_i&w#_i'R#_i'T#_i~O'S#_i~P3=[O!u:RO#`:RO%}9wO&OWO&P:gO&kXO&lXO&m9rO&n9hO&o:RO&{+oO&|+oO&}9mO'O9|O'P:RO'Q:WO'W+{O%h#_i&a#_i&w#_i'R#_i'T#_iU#_ic#_i&]#_i~O'S#_i~P3>|O!u:SO#`:SO%}9xO&OWO&P:hO&kXO&lXO&m9sO&n9iO&o:SO&{+oO&|+oO&}9nO'O9}O'P:SO'Q:XO'W+{O%h#_i&Y#_i&Z#_i&a#_i&w#_i'R#_i'T#_i~O'S#_i~P3@tO!u:TO#`:TO%}9yO&OWO&P:iO&kXO&lXO&m9tO&n9jO&o:TO&{+oO&|+oO&}9oO'O:OO'P:TO'Q:YO'W+{O&w#_i'R#_i'T#_i'U#_i~O'S#_i~P3BiO%}9uO&OWO&P:eO&kXO&lXO&m9pO&n9fO&{+oO&|+oO&}9kO'W+{O!u#_i#`#_i&[#_i&a#_i&o#_i&w#_i'O#_i'R#_i'S#_i'T#_i&]#_i&`#_i&i#_iU#_ic#_i~O'P:PO'Q:UO~P3DTO%}9vO&OWO&P:fO&kXO&lXO&m9qO&n9gO&{+oO&|+oO&}9lO'W+{OU#_ic#_i!u#_i#`#_i&a#_i&o#_i&w#_i'O#_i'R#_i'S#_i'T#_i~O'P:QO'Q:VO~P3FRO%}9wO&OWO&P:gO&kXO&lXO&m9rO&n9hO&{+oO&|+oO&}9mO'W+{O!u#_i#`#_i%h#_i&a#_i&o#_i&w#_i'O#_i'R#_i'S#_i'T#_iU#_ic#_i&]#_i~O'P:RO'Q:WO~P3GsO%}9xO&OWO&P:hO&kXO&lXO&m9sO&n9iO&{+oO&|+oO&}9nO'W+{O!u#_i#`#_i%h#_i&Y#_i&Z#_i&a#_i&o#_i&w#_i'O#_i'R#_i'S#_i'T#_i~O'P:SO'Q:XO~P3IkO%}9yO&OWO&P:iO&kXO&lXO&m9tO&n9jO&{+oO&|+oO&}9oO'W+{O!u#_i#`#_i&o#_i&w#_i'O#_i'R#_i'S#_i'T#_i'U#_i~O'P:TO'Q:YO~P3K`O'P#_i'Q#_i~P3DTO'P#_i'Q#_i~P3FRO'P#_i'Q#_i~P3GsO'P#_i'Q#_i~P3IkO'P#_i'Q#_i~P3K`O!u:PO#`:PO%}9uO&OWO&P:eO&kXO&lXO&m9pO&n9fO&o:PO&{+oO&|+oO&}9kO'O9zO'P:PO'Q:UO'S:`O'W+{O&[#_i&a#_i&w#_i'T#_i&]#_i&`#_i&i#_iU#_ic#_i~O'R:ZO~P3NOO!u:QO#`:QO%}9vO&OWO&P:fO&kXO&lXO&m9qO&n9gO&o:QO&{+oO&|+oO&}9lO'O9{O'P:QO'Q:VO'S:aO'W+{OU#_ic#_i&a#_i&w#_i'T#_i~O'R:[O~P4 |O!u:RO#`:RO%}9wO&OWO&P:gO&kXO&lXO&m9rO&n9hO&o:RO&{+oO&|+oO&}9mO'O9|O'P:RO'Q:WO'S:bO'W+{O%h#_i&a#_i&w#_i'T#_iU#_ic#_i&]#_i~O'R:]O~P4#nO!u:SO#`:SO%}9xO&OWO&P:hO&kXO&lXO&m9sO&n9iO&o:SO&{+oO&|+oO&}9nO'O9}O'P:SO'Q:XO'S:cO'W+{O%h#_i&Y#_i&Z#_i&a#_i&w#_i'T#_i~O'R:^O~P4%fO!u:TO#`:TO%}9yO&OWO&P:iO&kXO&lXO&m9tO&n9jO&o:TO&{+oO&|+oO&}9oO'O:OO'P:TO'Q:YO'S:dO'W+{O&w#_i'T#_i'U#_i~O'R:_O~P4'ZO'S:`O~P3;^O'S:aO~P3=[O'S:bO~P3>|O'S:cO~P3@tO'S:dO~P3BiO'U7xO~P+!ZO'U7yO~P+!ZO%}9uO&m9pO&n9fO&}9kO&[#di&a#di&i#di~P1:|O&OWO&kXO&lXO&{+oO&|+oO'W+{OU#dic#di!u#di#`#di&P#di&a#di&o#di&w#di'O#di'P#di'Q#di'R#di'S#di'T#di~O%}9vO&m9qO&n9gO&}9lO~P4*cO%}9wO&m9rO&n9hO&}9mO%h#di&]#di~P4*cO&OWO&kXO&lXO&{+oO&|+oO'W+{O!u#di#`#di&P#di&o#di&w#di'O#di'P#di'Q#di'R#di'S#di'T#di~O%}9xO&m9sO&n9iO&}9nO%h#di&Y#di&Z#di&a#di~P4,kO%}9yO&m9tO&n9jO&}9oO'U#di~P4,kOU!vac!va&a!va~P3&eOU!vac!va&]!va~P+3tO&OWO&kXO&lXO&{+oO&|+oO'W+{O&a#ay&w#ay&]#ayU#ayc#ay~O!u:PO#`:PO%}9uO&P:eO&m9pO&n9fO&o:PO&}9kO'O9zO'P:PO'Q:UO'R:ZO'S:`O'T=vO&[#ay&`#ay&i#ay~P4/_O&OWO&kXO&lXO&{+oO&|+oO'W+{OU#ayc#ay&a#ay&w#ay~O!u:QO#`:QO%}9vO&P:fO&m9qO&n9gO&o:QO&}9lO'O9{O'P:QO'Q:VO'R:[O'S:aO'T=wO~P41]O!u:RO#`:RO%}9wO&P:gO&m9rO&n9hO&o:RO&}9mO'O9|O'P:RO'Q:WO'R:]O'S:bO'T=xO%h#ay~P4/_O%h#ay&Y#ay&Z#ay&a#ay&w#ay~P3(jO!u:TO#`:TO%}9yO&OWO&P:iO&kXO&lXO&m9tO&n9jO&o:TO&{+oO&|+oO&}9oO'O:OO'P:TO'Q:YO'R:_O'S:dO'T=zO'W+{O~O&w#ay'U#ay~P44eO%h$bi&a$biU$bic$bi&]$bi~P'IwO&a$biU$bic$bi~P)HlO&n<VO%h$hi&a$hi&m$hi&}$hiU$hic$hi&]$hi~P.7iO&n<WO&a$hi&m$hi&}$hiU$hic$hi~P.7iO&n<VO&}<XO%h$hi&a$hi&m$hiU$hic$hi&]$hi~P.7iO&n<WO&}<YO&a$hi&m$hiU$hic$hi~P.7iO&m<ZO&n<VO&}<XO%h$hi&a$hiU$hic$hi&]$hi~P.7iO&m<[O&n<WO&}<YO&a$hiU$hic$hi~P.7iO!u<aO#`<aO%}<]O&OWO&P<iO&kXO&lXO&m<ZO&n<VO&o<aO&{#_O&|#_O&}<XO'O<_O'P<aO'Q<cO'W#kO%h$hi&a$hi&w$hi'R$hi'T$hiU$hic$hi&]$hi~O'S$hi~P49}O!u<bO#`<bO%}<^O&OWO&P<jO&kXO&lXO&m<[O&n<WO&o<bO&{#_O&|#_O&}<YO'O<`O'P<bO'Q<dO'W#kO&a$hi&w$hi'R$hi'T$hiU$hic$hi~O'S$hi~P4;uO%}<]O&OWO&P<iO&kXO&lXO&m<ZO&n<VO&{#_O&|#_O&}<XO'W#kO!u$hi#`$hi%h$hi&a$hi&o$hi&w$hi'O$hi'R$hi'S$hi'T$hiU$hic$hi&]$hi~O'P<aO'Q<cO~P4=gO%}<^O&OWO&P<jO&kXO&lXO&m<[O&n<WO&{#_O&|#_O&}<YO'W#kO!u$hi#`$hi&a$hi&o$hi&w$hi'O$hi'R$hi'S$hi'T$hiU$hic$hi~O'P<bO'Q<dO~P4?_O'P$hi'Q$hi~P4=gO'P$hi'Q$hi~P4?_O!u<aO#`<aO%}<]O&OWO&P<iO&kXO&lXO&m<ZO&n<VO&o<aO&{#_O&|#_O&}<XO'O<_O'P<aO'Q<cO'S<gO'W#kO%h$hi&a$hi&w$hi'T$hiU$hic$hi&]$hi~O'R<eO~P4AeO!u<bO#`<bO%}<^O&OWO&P<jO&kXO&lXO&m<[O&n<WO&o<bO&{#_O&|#_O&}<YO'O<`O'P<bO'Q<dO'S<hO'W#kO&a$hi&w$hi'T$hiU$hic$hi~O'R<fO~P4C]O'S<gO~P49}O'S<hO~P4;uO%}<]O&m<ZO&n<VO&}<XO~P/KyO%}<^O&m<[O&n<WO&}<YO&a$miU$mic$mi~P0!YO!u<aO#`<aO%}<]O&P<iO&m<ZO&n<VO&o<aO&}<XO'O<_O'P<aO'Q<cO'R<eO'S<gO'T={O~P02lO&OWO&kXO&lXO&{#_O&|#_O'W#kO~O!u<bO#`<bO%}<^O&P<jO&m<[O&n<WO&o<bO&}<YO'O<`O'P<bO'Q<dO'R<fO'S<hO'T=|O&a$iy&w$iyU$iyc$iy~P4GWO&[8vO!u#ya#`#ya%}#ya&O#ya&P#ya&a#ya&k#ya&l#ya&m#ya&n#ya&o#ya&w#ya&{#ya&|#ya&}#ya'O#ya'P#ya'Q#ya'R#ya'S#ya'T#ya'W#ya'U#ya&`#ya&i#ya%h#ya&]#yaU#yac#ya~O&[8vO!u#{a#`#{a%}#{a&O#{a&P#{a&a#{a&k#{a&l#{a&m#{a&n#{a&o#{a&w#{a&{#{a&|#{a&}#{a'O#{a'P#{a'Q#{a'R#{a'S#{a'T#{a'W#{a'U#{a&`#{a&i#{a%h#{a&]#{aU#{ac#{a~O&[8vO!u#}a#`#}a%}#}a&O#}a&P#}a&a#}a&k#}a&l#}a&m#}a&n#}a&o#}a&w#}a&{#}a&|#}a&}#}a'O#}a'P#}a'Q#}a'R#}a'S#}a'T#}a'W#}a'U#}a&`#}a&i#}a%h#}a&]#}aU#}ac#}a~OU9`Oc%^O&]'[X~O%l,UO!u#VX#`#VX&]#VX&`#VX&w#VX&{#VX&|#VX&}#VX'O#VX'P#VX'Q#VX'R#VX'S#VX'T#VX'W#VX%h#VX&a#VX'U#VX~P'7nOU9`Oc%^O&]'[a~OU:oOc,PO&a&UX~OU:pOc,PO&]&UX~OU#oac#oa&]#oa~P'IwOU:oOc,PO&a&Ua~OU:pOc,PO&]&Ua~O'U;yO~P+!ZO'U;zO~P+!ZO'U;{O~P+!ZO'U;|O~P+!ZO'U;}O~P+!ZO!u&jX#`&jX%h&jX%l&jX%n&jX%o&jX%r&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX&]&jX~P%'kO!u&jX#`&jX%l&jX%n&jX%o&jX%r&jX&a&jX&w&jX&{&jX&|&jX&}&jX'O&jX'P&jX'Q&jX'R&jX'S&jX'T&jX'W&jX~P'FuO'U=PO~P%LoO'U=QO~P%LoO&o~",
  goto: "&;s'`PPPPP'aP1QP1ZPP'aP1jP1pP'aP1z2W8a8|?RElKmEl!#r!#uPPP!#uP!#uPP!#uP!#uP!#uP!-f!.P!-f!.P!.g!.j!/O!/U!3h!4Q!8d!<v!8d!<v!AU!AX!A[!<v!Ae!E|!F]PP!Fc#!r#!r#-U!Fc#7h#;y#<O!<v!<v!<v#<T!<v!<v#<]#<`P#GZ#Gc!.P#Gf!.P#Go#Gu#Gz#NS!#uPP#NeP$&P$&P$*W$4Z$4^$8g$8k$9P$&P$&PP$&P$&P$&P$&P$&P$&P$9oEl$9r$?v$?}ElEl$@S$@aEl$@gElEl'aP'aP$@o'aP'aP'aP'aP'aP'aP'aP$Ag'aPP$C]$C`$C]'aP$Ci$Ci$IT$Nq$Nu$Ci$Ci$Ci$Ci$Ci$Ci$Ci$Ci$Ci%![P%#V%#f%#w%#}%$]%$c%$i%$o%$x%%S%%]%%c%%i%%o%%}%&X%&`%&f%&t%'O%'_%'h%'n%'x%(R%(X%(_%(e%(k%)c%)|%*S%*Y%*`%*jPPPPPPPPPPPPPPP%*r%,v#NeP%9S%9`%9wPPPP%@f#Ne%Jg%KZ%Kk%Ku%LZPPPP&!q&!tPPP&#_PP&#k&#pPP&#zPPPPPPPP&4`&4f&4q&5^PP&5aPPPPPPPPPPPPP&5d&5g&5n&5z&6R&6U&6X4]dOY[_fgmnwy!O!R!X!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$s$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(](_(`(e(f(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*Q*S*^*f*n*z+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T,Y,a,h,j,n,p,r,v-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/R/T/X/Y/_/b/}0Q0U0W0^0b0g0i0k0n0o0{1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6Z6[6]6^6_6`6a6b6c6d6e6f6g6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9P9Q9R9S9T9U9V9W9X9Y9`9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=b=f=g=p=q=r=s=v=w=x=y=z={=|_&_#t&`&k&l)q)r,xQ&j#tU)k&`&k&lS,w)q)rR/^,xQ#ynR&t#zQ#xnS&s#y#zR)w&tQ$^xQ)O%^Q*b'jR/U,d,|`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|S$]x'jT8m%^,dS!s['b[$p!X$[%h)[*^,nk%`!x$X$t%c%e)P)T)V,h,j/X/Y0{,Q`OPQY_bfgmnqwy!O!R!V!`!m#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$Y$^$_$`$b$w%X%Y%g%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'i'k'n'q'r't'w(V(o(q(r(x(|)`)e)g)h)o)t*S*[*f*n,Y,a,p,r,v-^/R/T2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|W!}[!X'b*^s2T!x$X$[$t%c%e%h)P)T)V)[,h,j,n/X/Y0{,|`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|[$az's2^2k2l2mS(W$r(UW8n{|}'xX8o8v=T=U=V,}`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|,|`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|T(W$r(UR(k$s4]]OY[_fgmnwy!O!R!X!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$s$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(](_(`(e(f(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*Q*S*^*f*n*z+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T,Y,a,h,j,n,p,r,v-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/R/T/X/Y/_/b/}0Q0U0W0^0b0g0i0k0n0o0{1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6Z6[6]6^6_6`6a6b6c6d6e6f6g6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9P9Q9R9S9T9U9V9W9X9Y9`9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=b=f=g=p=q=r=s=v=w=x=y=z={=|x$Vuv$R$S$U$X'_'`'b(m*T*U*[*^,}-[/f2b6X6YR-O*Py$Vuv$R$S$U$X'_'`'b(m*T*U*[*^,}-[/f2b6X6YR-S*QU+m(d-P/q[.f+m.g=d=e=i=jS=d+T-iR=e+dQ.x,PR1n0p)h(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=zT.w,P0pQ+S(]Y-j*z.R.v0^1fi-y+X-n-|.O0Q0U0W1`1b1x1y2O(r(a$s(Y(Z(_(`(c(e(f*Q*x+R+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-q-t-u.Q.V.].d.h.y.{/_/b/m/n/}0b0g0i0k0n0o1O1T1U1Y1]1h1j1t1v6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=zS+_(]*zq2f+X-n-|.O.R.v0Q0U0W0^1`1b1f1x1y2O)h(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=zT/o-l/l)i(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=zR/t-mR/u-m_.b+k.d/_0k1O1U1t!d(g$s(](`(f*Q*z+b+k+n+p+q+r+s+t+u+v+w+x+z-m.d.y/_0k0n1O1U1t6l6n6o7u7vQ-o+PQ.},U!Q9Z(_(e,T.{6^6`6k6m6p6r6t6v6x6z6|7O7Q7S7U7s7w7x:n=b!x9[+X+}-n-q-|.O.Q.R.V.h.v/b0Q0U0W0^0b0i0o1T1Y1`1b1f1h1v1x1y2O9P9U9a9f9k9p9u9z:P:U:Z:`:e;yt9]+e.]0g1j6_6a6q6s6u6w6y6{6}7P7R7T7V7yt9^+h-u/}1]9S9X9d9i9n9s9x9}:S:X:^:c:h;|#_9_+y-t9Q9R9T9V9W9Y9b9c9e9g9h9j9l9m9o9q9r9t9v9w9y9{9|:O:Q:R:T:V:W:Y:[:]:_:a:b:d:f:g:i:o:p;z;{;}=f=g=v=w=x=y=zk+U(]+X-n-|.O0Q0U0W1`1b1x1y2OQ(n$vR/w-p,|`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|)i(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=z,|`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|Q%S!k)i(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=z,|`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|Q%S!l)i(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=z)h(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=zR+i(bV+](]*z+hV/|-u/}1]Q+f(_V0e.]0g1jR-r+Q,j`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|Q#R^f$Vuv$R$S$U(m*T*U,}-[/fW'c$X'_'`*[)h(a$s(Y(Z(](_(`(c(e(f*Q*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/m/n/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=zQ-f*tQ1Q/jZ2]'b*^2b6X6Y].f+m.g=d=e=i=jR-T*QQ$x!_Q*R'TR,`(sX'X$U$X'b*^V-Z*U-[/f#xhOY[gnw!O!R!X!m#Z#]#^#`#a#b#c#d#e#f#g#h#j#l#t#u#v#}$P$Q$W$Y$^$_$b&Y&h&l&m&o&q&z'^'b'k'n'q't'w(o(r)g)h)o)t*S*^*f*n,v/T2s2t2u3W6[Q$YvQ$u!^Q%V!nQ&]#rQ*S'UQ*X'Z![8e_f#q'i'r2n2o2p2q2r2{3P3V3X3Y3`3f3l3r3x4O4U4[4b4l6b8V8^8_!t8fmy#U%p&a&b&c&d&e&f&g)e,r3Q3S3[3_3a3c3h3k3n3q3s3u3y3{4P4R4V4X4]4_4d4g6c6e8W8Y8`8b!|8g!x$X$[$t$w%c%e%g%h%j)P)T)V)[)`,Y,h,j,n,p/R/X/Y0{2|3R3Z3b3g3m3t3z4Q4W4^4c6Z6]6d8X8]8a8j8k8lt8h#W%Y(x,a3T3]3d3i3o3v3|4S4Y4`4e6f8Z8c#c8i#i%X(q(|3U3^3e3j3p3w3}4T4Z4a4f6g8[8d9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|o!u[!x$X$t%c%e'b)P)T)V,h,j/X/Y0{,QjOY[_fgmnwy!O!R!X!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*^*f*n,Y,a,h,j,n,p,r,v/R/T/X/Y0{2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|)Z(h$s(](_(`(e(f*Q*z+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=z'SfOY[_fgnw!O!R!X!m!x#Z#]#^#`#a#b#c#d#e#f#g#h#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$t$w%c%e%g%h%j&Y&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(o(r)P)T)V)[)`)g)h)o)t*S*^*f*n,Y,h,j,n,p,v/R/T/X/Y0{2n2o2p2q2r2s2t2u2{2|3P3R3V3W3X3Y3Z3`3b3f3g3l3m3r3t3x3z4O4Q4U4W4[4^4b4c4l6Z6[6]6b6d8V8X8]8^8_8a8j8k8lQ(X$r%`(e$s(](_(`(e(f*Q*z+X+b+k+n+p+q+r+s+t+u+v+w+x+z+},T-m-n-q-|.O.Q.R.V.d.h.v.y.{/_/b0Q0U0W0^0b0i0k0n0o1O1T1U1Y1`1b1f1h1t1v1x1y2O6^6`6k6l6m6n6o6p6r6t6v6x6z6|7O7Q7S7U7s7u7v7w7x9P9U9a9f9k9p9u9z:P:U:Z:`:e:n;y=bQ-f*tQ/p-lQ1Q/j%|8^my#U#W#i%X%Y%p&a&b&c&d&e&f&g(q(x(|)e,a,r3Q3S3T3U3[3]3^3_3a3c3d3e3h3i3j3k3n3o3p3q3s3u3v3w3y3{3|3}4P4R4S4T4V4X4Y4Z4]4_4`4a4d4e4f4g6c6e6f6g8W8Y8Z8[8`8b8c8d9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|$y=b+e+h+y-t-u.]/}0g1]1j6_6a6q6s6u6w6y6{6}7P7R7T7V7y9Q9R9S9T9V9W9X9Y9b9c9d9e9g9h9i9j9l9m9n9o9q9r9s9t9v9w9x9y9{9|9}:O:Q:R:S:T:V:W:X:Y:[:]:^:_:a:b:c:d:f:g:h:i:o:p;z;{;|;}=f=g=v=w=x=y=zR#R^%`(e$s(](_(`(e(f*Q*z+X+b+k+n+p+q+r+s+t+u+v+w+x+z+},T-m-n-q-|.O.Q.R.V.d.h.v.y.{/_/b0Q0U0W0^0b0i0k0n0o1O1T1U1Y1`1b1f1h1t1v1x1y2O6^6`6k6l6m6n6o6p6r6t6v6x6z6|7O7Q7S7U7s7u7v7w7x9P9U9a9f9k9p9u9z:P:U:Z:`:e:n;y=b$y=b+e+h+y-t-u.]/}0g1]1j6_6a6q6s6u6w6y6{6}7P7R7T7V7y9Q9R9S9T9V9W9X9Y9b9c9d9e9g9h9i9j9l9m9n9o9q9r9s9t9v9w9x9y9{9|9}:O:Q:R:S:T:V:W:X:Y:[:]:^:_:a:b:c:d:f:g:h:i:o:p;z;{;|;}=f=g=v=w=x=y=zT,V(e=bW,S(e,T:n=b[.U+b6k6l6m6n6oX0u.{7u7v7wU,R(e,T6kQ0v.{Q7|7uQ7}7vQ8O7wS:k+b6lS:l6n6oV:m6m:n=bR(l$s,|`OPQY[_bfgmnqwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#{#|#}$O$P$Q$W$X$Y$[$^$_$`$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*[*^*f*n,Y,a,h,j,n,p,r,v-^/R/T/X/Y0{2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|R#XaZ!{[!X#W'b*^V(w%Y(x,aS%[!t$oW(z%[({=a=cR=a#TX(z%[({=a=cQ#V_V)c%p)e,rQ$bzQ$c{Q$d|Q$e}Q*j'sU*o'x2^8vQ4m2kQ4n2lQ4o2mQ=^=TQ=_=UR=`=V!feOnw!O#t#u#v#}$P$Q$W$Y$^$_$b&h&l&m&o&q&z'^'k'n'q't'w(o)o)t*S*f*n,vU#of#q2q^$i!R2n2o2p8j8k8lQ%y#^U&W#l&Y)hS4i!m2sU4j2r4l8^W4k(r/T2t2uQ4|3VQ4}3WR5O3XR$l!SQ$k!SQ'}$jR*r(P,RjOY[_fgmnwy!O!R!X!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*^*f*n,Y,a,h,j,n,p,r,v/R/T/X/Y0{2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|'SfOY[_fgnw!O!R!X!m!x#Z#]#^#`#a#b#c#d#e#f#g#h#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$t$w%c%e%g%h%j&Y&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(o(r)P)T)V)[)`)g)h)o)t*S*^*f*n,Y,h,j,n,p,v/R/T/X/Y0{2n2o2p2q2r2s2t2u2{2|3P3R3V3W3X3Y3Z3`3b3f3g3l3m3r3t3x3z4O4Q4U4W4[4^4b4c4l6Z6[6]6b6d8V8X8]8^8_8a8j8k8l%}8^my#U#W#i%X%Y%p&a&b&c&d&e&f&g(q(x(|)e,a,r3Q3S3T3U3[3]3^3_3a3c3d3e3h3i3j3k3n3o3p3q3s3u3v3w3y3{3|3}4P4R4S4T4V4X4Y4Z4]4_4`4a4d4e4f4g6c6e6f6g8W8Y8Z8[8`8b8c8d9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|T#sf8^!fkOnw!O#t#u#v#}$P$Q$W$Y$^$_$b&h&l&m&o&q&z'^'k'n'q't'w(o)o)t*S*f*n,vW#pf#q4l8^[%U!m2q2r2s2t2uW%x#^3V3W3XU&X#l&Y)hQ,_(rR0y/T!fkOnw!O#t#u#v#}$P$Q$W$Y$^$_$b&h&l&m&o&q&z'^'k'n'q't'w(o)o)t*S*f*n,vV&X#l&Y)hQ&`#tU)i&`)q,xS)q&k&lR,x)rS+l(d(lU.e+l/`1VS/`-P-TT1V/q/uQ-}+YR0V-}Q0R-{U1a0R1d1zQ1d0XR1z1cQ!cSR$|!cQ!fTR%O!fQ!iUR%Q!iW-v+T+]-i.`R0O-vQ.W+dS0c.W1ZR1Z/xW+e(_.]0g1jR.[+eQ.^+fR0h.^Q.S+aR0_.SQ0q.xR1o0qQ.g+mU0l.g=i=jQ=i=dR=j=eQ%k#TS)a%k,ZR,Z(pS*V'V'XR-]*VQ%d!yR)U%dQ)Q%bU,i)Q,l/ZQ,l)WR/Z,kQ,T(eS.|,T:nR:n=b[.z,Q2h2i8T8U:jS0s.z7tR7t2jW%Z!t!{$o%sR(y%ZQ,e)OR/V,eQ({%[S,b({=cR=c=aW#U_%p)e,rR%o#UQ%q#VR)f%qQ%i#PR)]%iQ'k$^R*c'kQ't$bR*k'tQ'y$cQ'z$dQ'{$eb*p'y'z'{2_2`2a8w8x8yQ2_4mQ2`4nQ2a4oQ8w=^Q8x=_R8y=`f#[c#n$h%w&V,^0x2W2Y4h8RU%u#[2}3OS2}4p4{R3O4qQ(Q$kR*s(QQ/k-fR1R/kQ(T$mR*v(TQ#qfS&[#q4lR4l8^U#mcekR&Z#mQlOQ#znQ$ZwQ$g!OQ&k#tQ&n#uQ&p#vQ&y#}Q&|$PQ'O$QQ']$WQ'f$YQ'm$^Q'p$_Q'v$bQ)p&hQ)r&lS)s&m&oQ)u&qQ)|&zQ*Z'^S*e'k'nQ*h'qS*m't'wQ,X(oQ,u)oQ,y)tQ-V*SQ-b*fQ-e*nR/[,v!fcOnw!O#t#u#v#}$P$Q$W$Y$^$_$b&h&l&m&o&q&z'^'k'n'q't'w(o)o)t*S*f*n,vv!qYg8V8W8X8Y8Z8[8]8_8`8a8b8c8d=p=q=r=sS!t['bQ#T_S#nf#qQ#tmQ$_yQ$h!RS$o!X*^Q%T!mj%a!x$X$t%c%e)P)T)V,h,j/X/Y0{W%n#U%p)e,rQ%s#WQ%t#ZQ%v#]Q%w#^d%z#`&e3Y3Z3[3]3^3_<V<WQ%{#aQ%|#bQ%}#cQ&O#dQ&P#eQ&Q#fQ&R#gQ&S#hQ&T#iQ&U#jU&V#l&Y)hW'h$[%h)[,nQ(p$wQ(t%XU(u%Y(x,aQ)X%gY)^%j)`,Y,p/RQ)o&gQ*a'iQ*i'rQ,](qQ,^(rQ,c(|Q,s)gQ0x/TQ2W2rQ2X2sQ2Y2uQ2Z3VS4h4l8^U4p2n2o2pU4q8j8k8lQ4r2qQ4s2{Q4t2|Q4u3PQ4v3QQ4w3RQ4x3SQ4y3TQ4z3UQ4{3XQ5P3`Q5Q3aQ5R3bQ5S3cQ5T3dQ5U3eQ5V3fS5W&d3kQ5X3gQ5Y3hQ5Z3iQ5[3jQ5]3lU5^&a&c3qQ5_3mQ5`3nQ5a3oQ5b3pQ5c3rQ5d3sQ5e3tQ5f3uQ5g3vQ5h3wQ5i3xS5j&f3yQ5k3zQ5l3{Q5m3|Q5n3}Q5o4OQ5p4PQ5q4QQ5r4RQ5s4SQ5t4TQ5u4UQ5v4VQ5w4WQ5x4XQ5y4YQ5z4ZQ5{4[Q5|4]Q5}4^Q6O4_Q6P4`Q6Q4aQ6R4bS6S&b4gQ6T4cQ6U4dQ6V4eQ6W4fQ6h6ZQ6i6[Q6j6]Q7W6bQ7X6cQ7Y6dQ7Z6eQ7[6fQ7]6gQ8R2tQ8S3WQ8p=WQ8q=XQ8r=YQ8s=ZQ8t=[Q8u=]Q<k<TQ<l<UQ<m<XQ<n<YQ<o<ZQ<p<[Q<q<]Q<r<^Q<s<_Q<t<`Q<u<aQ<v<bQ<w<cQ<x<dQ<y<eQ<z<fQ<{<gQ<|<hQ<}<iQ=O<jQ=R=PQ=S=QQ=h9`Q=t={R=u=|Y#P[!X$['b*^V)Y%h)[,n{#O[!X!x$X$[$t%c%e%h'b)P)T)V)[*^,h,j,n/X/Y0{+|ROY[_fgmnwy!O!R!X!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$t$w%X%Y%c%e%g%h%j%p&Y&c&d&e&f&g&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*^*f*n,Y,a,h,j,n,p,r,v/R/T/X/Y0{2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|W!UP'_2V6X^!YQ!V'`(V*[2b6YQ#YbQ#}qQ$y!`Q&u#{Q&v#|Q&z$OQ)l&aQ)m&bQ)z&wQ/g-^Q2Q$`R2R2UQ(d$sQ+T(]Q+d(_p+g(`(f6^6_6`6a9P9Q9R9S9T9U9V9W9X9YS,Q(e,TQ-P*QQ-i*zh-z+X-n-|.O0Q0U0W1`1b1x1y2OQ.T+bW.Z+e.]0g1jQ.`+h^.a+k.d/_0k1O1U1tQ.i+n`.j+p6r6s9f9g9h9i9jQ.k+qQ.l+rQ.m+sQ.n+tQ.o+uQ.p+vQ.q+wQ.r+xQ.s+yQ.t+zQ.u+}Q/q-mQ/x-qQ/y-tU/z-u/}1]Q0Y.QW0Z.R.v0^1fY0`.V0b1Y1h1vQ0m.hQ0r.yQ0t.{Q1P/bQ1k0iQ1l0nQ1m0oQ1r1TQ2g6lQ2h6mQ2i6oQ2j7wQ7^6kQ7_6pQ7`6qQ7a6tQ7b6uQ7c6vQ7d6wQ7e6xQ7f6yQ7g6zQ7h6{Q7i6|Q7j6}Q7k7OQ7l7PQ7m7QQ7n7RQ7o7SQ7p7TQ7q7UQ7r7VQ7z7sQ7{7uQ8P7xQ8Q7yQ8T6nQ8U7vS:j:n=bQ:q9aQ:r9bQ:s9cQ:t9dQ:u9eQ:v9kQ:w9lQ:x9mQ:y9nQ:z9oQ:{9pQ:|9qQ:}9rQ;O9sQ;P9tQ;Q9uQ;R9vQ;S9wQ;T9xQ;U9yQ;V9zQ;W9{Q;X9|Q;Y9}Q;Z:OQ;[:PQ;]:QQ;^:RQ;_:SQ;`:TQ;a:UQ;b:VQ;c:WQ;d:XQ;e:YQ;f:ZQ;g:[Q;h:]Q;i:^Q;j:_Q;k:`Q;l:aQ;m:bQ;n:cQ;o:dQ;p=fQ;q=gQ;r:eQ;s:fQ;t:gQ;u:hQ;v:iQ;w:oQ;x:pQ<O;yQ<P;zQ<Q;{Q<R;|Q<S;}Q=k=vQ=l=wQ=m=xQ=n=yR=o=zQ$TuS$Wv(mW'P$R'_,}6XY'Q$S'`*[2b6YW'V$U$X'b*^Q-W*TV-X*U-[/fQ+|(dS-w+T-iQ.Y+dQ/a-PR1S/qU+a(]*z.vV0[.R0^1fu+`(]*z+X-n-|.O.R.v0Q0U0W0^1`1b1f1x1y2O)Y([$s(](_(`(e(f*Q*z+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/_/b/}0Q0U0W0^0b0g0i0k0n0o1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O6^6_6`6a6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y9P9Q9R9S9T9U9V9W9X9Y9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}=b=f=g=v=w=x=y=zS*w(Y/mU*{(Z*x/nQ+j(cR-s+RR-p+PS+Y(]-nQ-{+XU0T-|0U1bQ0X.OY1^0Q1`1x1y2OR1c0WS!bS!cS!eT!fT!hU!iV+^(]*z+hU+[(]*z+hV/{-u/}1]5|ZOPQY[^_bfgmnquvwy!O!R!V!X!`!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#u#v#{#|#}$O$P$Q$R$S$U$W$X$Y$[$^$`$b$s$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&w&z'^'_'`'b'i'k'n'q'r't'w(V(Y(Z(](_(`(c(e(f(m(o(q(r(x(|)P)T)V)[)`)e)g)h)t*Q*S*T*U*[*^*f*n*t*x*z+R+X+b+e+h+k+n+p+q+r+s+t+u+v+w+x+y+z+},T,Y,a,h,j,n,p,r,v,}-[-^-m-n-q-t-u-|.O.Q.R.V.].d.h.v.y.{/R/T/X/Y/_/b/f/j/m/n/}0Q0U0W0^0b0g0i0k0n0o0{1O1T1U1Y1]1`1b1f1h1j1t1v1x1y2O2U2V2b2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6X6Y6Z6[6]6^6_6`6a6b6c6d6e6f6g6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z6{6|6}7O7P7Q7R7S7T7U7V7s7u7v7w7x7y8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9P9Q9R9S9T9U9V9W9X9Y9`9a9b9c9d9e9f9g9h9i9j9k9l9m9n9o9p9q9r9s9t9u9v9w9x9y9z9{9|9}:O:P:Q:R:S:T:U:V:W:X:Y:Z:[:]:^:_:`:a:b:c:d:e:f:g:h:i:n:o:p;y;z;{;|;}<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=b=f=g=p=q=r=s=v=w=x=y=z={=|!O#cc!t$h$o%T%t%v%w&O&P&Q&R&S&U&V,^,s0x2X2Y6i8R8SU&c#t$_)oz+s(d+T-P-i.T.a.i.n.o.p.q.r.t/q0r1l2g2i7{8T8Uv3l#T#n*a*i2W2Z4h4p4r4s4u4{5c5i5o5u5{6R7Wr3m%a'h(p)X)^4q4t4w5e5k5q5w5}6T6h6j7Yb3n%n4x5f5l5r5x6O6U7Zd3o%s(u4y5g5m5s5y6P6V7[r3p&T4z5h5n5t5z6Q6W7]8p8q8r8s8t8u=t=u`3q4v5d5j5p5v5|6S7Xp6x+d,Q0t2h2j7^7_7g7i7k7m7o7q7z8P:jb6y.Z7`7h7j7l7n7p7r8Qv9u-z.u/x0Y0Z0`0m1P1k1m1r:q;V;[;a;f;k;r<Ob9v:r;W;];b;g;l;s;w<Pd9w/y:s;X;^;c;h;m;t;x<Qd9x.`/z:t;Y;_;d;i;n;u<Rp9y.s:u;Z;`;e;j;o;p;q;v<S=k=l=m=n=od<](t<k<s<u<w<y<{<}=R=he<^,],c<l<t<v<x<z<|=O=SX'Y$U$X'b*^W'W$U$X'b*^V-Y*U-[/fW!y[$X$t'bQ%b!xU)S%c)T,jQ)W%eY,f)P,h/X/Y0{R,k)VR'^$WR/O,UR$v!^Z!|[!X#W'b*^Y!z[!X#W'b*^V(v%Y(x,aS%]!t$oR%m#TR-g*tR&^#r,RiOY[_fgmnwy!O!R!X!m!x#U#W#Z#]#^#`#a#b#c#d#e#f#g#h#i#j#l#q#t#u#v#}$P$Q$W$X$Y$[$^$_$b$t$w%X%Y%c%e%g%h%j%p&Y&a&b&c&d&e&f&g&h&l&m&o&q&z'^'b'i'k'n'q'r't'w(o(q(r(x(|)P)T)V)[)`)e)g)h)o)t*S*^*f*n,Y,a,h,j,n,p,r,v/R/T/X/Y0{2n2o2p2q2r2s2t2u2{2|3P3Q3R3S3T3U3V3W3X3Y3Z3[3]3^3_3`3a3b3c3d3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z3{3|3}4O4P4Q4R4S4T4U4V4W4X4Y4Z4[4]4^4_4`4a4b4c4d4e4f4g4l6Z6[6]6b6c6d6e6f6g8V8W8X8Y8Z8[8]8^8_8`8a8b8c8d8j8k8l9`<T<U<V<W<X<Y<Z<[<]<^<_<`<a<b<c<d<e<f<g<h<i<j=P=Q=W=X=Y=Z=[=]=p=q=r=s={=|",
  nodeNames: "\u26A0 Identifier BlockComment Comment SourceFile IfStatement if ElseifClause elseif ElseClause else end TryStatement try CatchClause catch FinallyClause finally ForStatement for ForBinding TupleExpression NamedField TypedExpression InterpolationExpression FieldExpression QuoteExpression SubscriptExpression GeneratorExpression PrimitiveDefinition primitive type Number AbstractDefinition abstract StructDefinition mutable struct ModuleDefinition module BareModuleDefinition baremodule MacroDefinition macro InterpolationExpression FieldExpression QuoteExpression SubscriptExpression GeneratorExpression ForClause ForBinding TupleExpression NamedField TypedExpression InterpolationExpression FieldExpression QuoteExpression SubscriptExpression GeneratorExpression AssignmentExpression AssignmentExpression CallExpression ArgumentList NamedArgument DoClause do Character Symbol String TripleString CommandString PrefixedString ParenthesizedExpression AssignmentExpression AssignmentExpression ArrayExpression ArrayComprehensionExpression MatrixExpression MatrixRow GeneratorExpression ParameterizedIdentifier TypeArgumentList Operator in IfClause AssignmentExpression ParameterizedIdentifier TypeArgumentList ParenthesizedExpression AssignmentExpression AssignmentExpression ArgumentList NamedArgument FunctionDefinition function ReturnType CompoundExpression begin PairExpression MacroExpression MacroIdentifier Operator MacroFieldExpression MacroArgumentList AssignmentExpression BareTupleExpression UnaryExpression BinaryExpression isa TernaryExpression FunctionExpression CoefficientExpression RangeExpression SpreadExpression Operator AssignmentExpression CallExpression ParenthesizedExpression AssignmentExpression AssignmentExpression ArrayExpression ArrayComprehensionExpression ForClause IfClause MatrixExpression MatrixRow GeneratorExpression ParameterizedIdentifier WhileStatement while LetStatement let VariableDeclaration ConstStatement const GlobalStatement global LocalStatement local QuoteStatement quote BreakStatement break ContinueStatement continue ReturnStatement return BareTupleExpression ImportStatement using import Import ScopedIdentifier SelectedImport ExportStatement export PairExpression MacroExpression MacroFieldExpression MacroArgumentList AssignmentExpression UnaryExpression BinaryExpression TernaryExpression FunctionExpression FunctionExpression CoefficientExpression RangeExpression SpreadExpression Operator FunctionAssignmentExpression where",
  maxTerm: 291,
  nodeProps: [
    [NodeProp.closedBy, -2, 5, 7, "end else elseif", -16, 9, 16, 18, 29, 33, 35, 38, 40, 42, 64, 93, 96, 128, 130, 139, 165, "end", 12, "end catch finally", 14, "end finally", -9, 21, 51, 62, 72, 79, 88, 91, 117, 126, ")", -9, 27, 47, 57, 75, 76, 77, 120, 121, 124, "]", -2, 81, 87, "}"],
    [NodeProp.group, -34, 6, 8, 10, 11, 13, 15, 17, 19, 30, 31, 34, 36, 37, 39, 41, 43, 65, 83, 94, 97, 108, 129, 131, 134, 136, 138, 140, 142, 144, 146, 149, 150, 155, 171, "keyword", -4, 82, 101, 114, 169, "operator"]
  ],
  skippedNodes: [0, 2, 3],
  repeatNodeCount: 35,
  tokenData: "# _~R.[XYHwYZHwpqHwqrJursK[stKotuKzuvLXvwLawxLqxyMkyzMpz{LX{|Mu|}M}}!ONS!O!PNt!P!Q!Dh!Q!R!Gb!R![!H[![!]!J`!]!^!Jp!^!_!Ju!_!`!Kj!`!a!K|!b!c!Ll!}#O!Lq#O#P!Fi#P#Q!Lv#Q#R!Fn#S#T!L{#o#p!MQ#p#q!MV#q#r!Nk#r#s!Np$r$s!L[$w$x!Mu%o%p!Fi&a&bLX%!]%!^!Fi%#t%#uNj%#u%#v!G]%#v%#wNj%#w%#x!G]%#x%#yNj%$O%$PNj%$P%$QNj%$Q%$RNj%$R%$SNj%$S%$TNj%$U%$VNj%$W%$XNj%$X%$YNj%$Y%$ZNj%$[%$]Nj%$_%$`Nj%$`%$aNj%$a%$bNj%$b%$cNj%$d%$eNj%$r%$sNj%$s%$tNj%$v%$wNj%$w%$xNj%$z%${Nj%$|%$}Nj%$}%%ONj%%P%%QNj%%R%%SNj%%S%%TNj%%T%%UNj%%U%%VNj%%V%%WNj%%W%%XNj%%Y%%ZNj%%[%%]Nj%%b%%cNj%%c%%dNj%%d%%eNj%%e%%fNj%%h%%iNj%%j%%kNj%%|%%}Nj%%}%&O!G]%&O%&PNj%&P%&QNj%&Q%&RNj%&R%&SNj%&S%&TNj%&T%&UNj%&U%&VNj%&V%&WNj%&W%&XNj%&X%&YNj%&b%&c!Nw%&c%&dKV%&d%&eKV%&e%&fKV%&f%&gKV%&g%&hKV%&m%&n!Mu%&n%&o!Mu%&q%&r!Fi%&r%&s!Fi%&s%&t!Fi%&t%&u!L[%&u%&v!L[%&v%&w!L[%&w%&xKV%'O%'P!Fi%'P%'QKV%'Q%'RKV%'R%'S!Fi%'S%'T!Mu%'T%'U!Fi%'U%'V!Mu%'c%'dKV%'d%'e!Mu%'f%'gKV%'g%'hKV%'i%'jKV%'j%'kKV%'l%'m!Fi%'m%'nKV%'n%'o# O%'o%'pKV%'p%'qKV%'q%'rKV%'r%'sKV%'s%'tKV%'t%'uKV%'u%'vKV%'v%'wKV%'w%'xKV%'x%'yKV%'y%'zKV%'z%'{KV%'{%'|!Mu%'|%'}KV%'}%(OKV%(O%(PKV%(P%(QKV%(Q%(RLS%(R%(SLS%(S%(TKV%(T%(UKV%(U%(VKV%(V%(WKV%(W%(XKV%(X%(YKV%(Y%(ZKV%(Z%([KV%([%(]KV%(]%(^KV%(^%(_KV%(_%(`KV%(`%(aKV%(a%(bKV%(b%(cKV%(c%(dKV%(d%(eKV%(e%(fKV%(f%(gKV%(g%(hKV%(h%(iKV%(i%(jKV%(j%(kKV%(k%(lKV%(l%(mKV%(m%(nKV%(n%(oKV%(o%(pKV%(p%(qKV%(q%(rKV%(r%(sKV%(s%(tKV%(t%(uKV%(u%(vKV%(v%(wKV%(w%(xKV%(x%(yKV%(y%(zKV%(z%({KV%({%(|KV%(|%(}KV%(}%)OKV%)O%)PKV%)P%)QKV%)Q%)RKV%)R%)SKV%)S%)TKV%)T%)UKV%)U%)VKV%)V%)WKV%)W%)XKV%)X%)YKV%)Y%)ZKV%)Z%)[KV%)]%)^!Fi%)^%)_!Mu%)_%)`KV%)`%)aKV%)a%)bKV%)b%)cKV%)c%)d!Fi%)d%)e!Mu%)e%)f!Mu%)f%)g!Mu%)g%)h!Fi%)h%)i!Fi%)i%)j!Fi%)j%)k!Fi%)k%)l!Fi%)l%)mKV%)n%)o!Mu%)o%)p!Mu%)p%)q!Fi%)q%)r!Fi%)r%)sKV%)s%)tKV%)y%)zKV%)|%)}KV%*O%*PKV%*Q%*RKV%*R%*SKV%*S%*TKV%*T%*UKV%*U%*VKV%*V%*WKV%*W%*XKV%*X%*YKV%*]%*^# V%*^%*_!Fi%*_%*`!Mu%*f%*g!Fi%*g%*h!Fi%*h%*i!Fi%*i%*j!Fi%*k%*l!Fi%*l%*m!Fi%*m%*n!Fi%*n%*o!Fi%*o%*pKV%*p%*q!Mu%*q%*r!Fi%*r%*sKV%*s%*tKV%*t%*u!Fi%*u%*v!Mu%*w%*xKV%*x%*yKV%*y%*zKV%*z%*{KV%*{%*|KV%*|%*}KV%*}%+OKV%+O%+PKV%+P%+QKV%+Q%+RKV%+R%+SKV%+S%+TKV%+T%+UKV%+U%+VKV%+V%+WKV%+W%+XKV%+X%+YKV%+Y%+ZKV%+Z%+[KV%+[%+]KV%+]%+^KV%+^%+_KV%+_%+`KV%+`%+aKV%+a%+bKV%+f%+gKV%+g%+hKV%+h%+iKV%+i%+jKV%+j%+kKV%+k%+lKV%+l%+mKV%+m%+nKV%+n%+oKV%+o%+pKV%+p%+qKV%+q%+rKV%+r%+sKV%+s%+tKV%:y%:z!Fi%F[%F]KV%Fb%FcKV%Fc%FdKV%Fk%Fl!Fi%Fl%FmKV%Fo%Fp!Fi%Fp%Fq!Fi%Fq%Fr!Fi%G[%G]!G]%G]%G^!G]%Ga%GbNj%Gb%GcNj%Gc%GdNj%Ge%GfNj%Gf%GgNj%Gg%GhNj%Gh%GiNj%Gi%GjNj%Gj%GkNj%Gk%GlNj%MW%MXNj%MX%MYNj%MY%MZNj%MZ%M[Nj%M[%M]Nj%M]%M^Nj%M^%M_Nj%M_%M`Nj%M`%Ma!G]%Ma%Mb!G]%Mb%Mc!G]%Mc%Md!G]%Md%MeNj%Me%MfNj%Mf%MgNj%Mg%MhNj%Mh%MiNj%Mi%MjNj%Mj%Mk!G]%Mk%Ml!G]%Ml%MmNj%Mm%MnNj%Mn%MoNj%Mo%MpNj%Mp%MqNj%Mu%MvNj%Mv%MwNj%Mw%MxNj%Mx%MyNj%Nn%NoNj%No%NpNj%Np%NqNj%Nq%NrNj%Nr%NsNj%Ns%Nt!G]%Nt%NuNj%Nu%NvNj%Nv%Nw!G]%Nw%Nx!G]%Nx%NyNj%Ny%Nz!G]%Nz%N{Nj%N{%N|!G]%N|%N}Nj%N}& ONj& O& P!G]& P& Q!G]& Q& RNj& R& SNj& S& T!G]& T& U!G]& U& VNj& V& WNj& W& X!G]& X& Y!G]& Y& ZNj& Z& [Nj& [& ]!G]& ]& ^!G]& ^& _Nj& _& `!G]& `& aNj& a& b!G]& b& cNj& c& dNj& d& eNj& e& fNj& f& gNj& g& hNj& h& iNj& i& jNj& j& k!G]& k& l!G]& l& mNj&#V&#WKV&#W&#X!Fi&#[&#]!Fi&#^&#_!Fi&#_&#`!Fi&#`&#aKV&#a&#bKV&$R&$SKV&$T&$UKV&$U&$VKV&$V&$WKV&$f&$gNj&$h&$i!Fi&$i&$j!Fi&$l&$m!Mu&$m&$n!Mu&$y&$z!Fi&$z&${!Mu&%a&%b!Fi&%f&%g!Mu&%g&%h!Mu&%h&%i!Mu&%i&%j!Mu&%j&%k!Mu&%k&%l!Mu&%l&%m!Mu&%m&%n!Mu&%n&%o!Mu&%o&%p!Mu&%p&%q!Mu&%q&%r!Mu&%r&%s!Mu&%t&%u!Fi&%u&%v!Fi&%v&%w!Fi&%w&%x!Fi&%x&%y!Fi&%y&%z!Fi&%z&%{!Fi&%{&%|!Fi&%|&%}!Fi&%}&&O!Mu&&O&&P!Mu&&P&&Q!Fi&&Q&&R!Fi&&R&&S!Fi&&U&&V!Fi&&V&&W!Mu&&W&&X!Mu&&X&&Y!Fi&&Y&&Z!Fi&&Z&&[!Mu&&`&&a!Mu&&a&&b!Fi&&b&&c!Mu&&c&&d!Fi&&d&&e!Fi&&e&&f!Mu&&f&&g!Mu&&g&&h!Fi&&h&&i!Mu&&i&&j!Fi&&j&&k!Mu&&k&&l!Fi&&l&&m!Mu&&m&&n!Mu&&n&&o!Fi&&p&&q!Fi&&q&&r!Mu&&r&&s!Fi&&s&&t!Mu&&t&&u!Fi&&u&&v!Fi&&v&&w!Fi&&w&&x!Mu&&x&&y!Mu&&y&&z!Mu&&|&&}KV&&}&'OKV&'Q&'RKV&'R&'SKV&'S&'TKV&'T&'UKV&'U&'VKV&'V&'WKV&'W&'XKV&'X&'YKV&'Y&'ZKV&'Z&'[KV&'[&']LS&']&'^KV&'^&'_KV&'_&'`KV&'`&'aKV&'a&'bKV&'b&'cKV&'c&'dKV&'d&'eKV&'e&'fKV&'f&'gKV&'g&'hKV&'h&'iKV&'i&'jKV&'j&'kKV&'k&'lKV&'l&'mKV&'m&'nKV&'n&'oKV&'o&'pKV&'p&'qKV&'q&'rKV&'r&'sKV&'s&'tKV&'t&'uKV&'u&'vKV&'v&'wKV&'w&'xKV&'x&'yKV&'y&'zKV&'z&'{KV&'{&'|KV&'|&'}KV&'}&(OKV&(O&(PKV&(P&(QKV&(Q&(RKV&(R&(SKV&(S&(TKV&(T&(UKV&(U&(VKV&(V&(WKV&(W&(XKV&(X&(YKV&(Y&(ZKV&(Z&([KV&([&(]KV&(]&(^KV&(^&(_KV&(_&(`KV&(`&(aKV&(a&(bKV&(b&(cKV&(c&(dKV&(d&(eKV&(e&(fKV&(f&(gKV&(g&(hKV&(h&(iKV&(i&(jKV&(j&(kKV&(k&(lKV&(l&(mKV&(m&(nKV&(n&(oKV&(o&(pKV&(p&(qKV&(q&(rKV&(r&(sKV&(s&(tKV&(t&(uKV&(u&(vKV&(v&(wKV&(w&(xKV&(x&(yKV&(y&(zKV&(z&({KV&({&(|KV&(|&(}KV&(}&)OKV&)O&)PKV&)P&)QKV&)Q&)RKV&)R&)SKV&)S&)TKV&)T&)UKV&)U&)VKV&)V&)WKV&)W&)XKV&)X&)YKV&)Y&)ZKV&)Z&)[KV&)[&)]KV&)]&)^KV&)^&)_KV&)_&)`KV&)`&)aKV&)a&)bKV&)b&)cKV&)c&)dKV&)d&)eKV&)e&)fKV&)g&)h!Fi&*T&*UKV&*U&*VKV&*V&*WKV&*W&*XKV&+`&+aNj&+a&+bNj&+b&+cNj&+c&+dNj&+d&+eNj&+e&+fNj&+f&+gNj&+g&+hNj&+h&+iNj&+i&+jNj&+j&+kNj&+k&+lNj&+l&+mNj&+m&+nNj&+n&+oNj&+o&+pNj&+p&+qNj&+q&+rNj&+r&+sNj&+s&+tNj&+t&+uNj&+w&+xNj&+x&+yNj&+y&+zNj&+z&+{Nj&+{&+|Nj&+|&+}Nj?MX?MYNj?MY?MZ!G]?MZ?M[Nj?M[?M]!G]~H|T%u~XYI]YZI]pqI]![!]Io!a!bJZ~I`TXYI]YZI]pqI]![!]Io!a!bJZ~IrRXYI{YZI{pqI{~JQR'U~XYI{YZI{pqI{~J^RXYJgYZJgpqJg~JlR'T~XYJgYZJgpqJg~JzP&z~!_!`J}PKSP&oP!_!`KVPK[O&oP~KaP&b~rsKd~KgPrsKj~KoO&d~~KtQR~OYKoZ~Ko~LPP%}~!_!`LS~LXO&Y~~L^P&m~!_!`LS~LfQ&m~vwLl!_!`LS~LqO'S~~LvS&{~OwMSx#OMS#O#PM_#P~MS~MVPwxMY~M_O!d~~MbROwMSwxMYx~MS~MpO%y~~MuO&a~~MzP&l~!_!`LS~NSO&[~~NXR&l~}!ONb!_!`LS!`!aNo~NgP'O~!`!aNj~NoO'O~~NtO'V~~Ny,o&O~qr!CzuvLXvwLXwx!DQz{LX{|!DV}!O!DV!O!P!D]!P!Q!Dh!Q![!Ds!^!_!Ep!_!`!E{!`!a!FT#O#P!Fi#Q#R!Fn#p#q!Fv%o%p!Fi&a&bLX%!]%!^!Fi%#t%#uNj%#u%#v!G]%#v%#wNj%#w%#x!G]%#x%#yNj%$O%$PNj%$P%$QNj%$Q%$RNj%$R%$SNj%$S%$TNj%$U%$VNj%$W%$XNj%$X%$YNj%$Y%$ZNj%$[%$]Nj%$_%$`Nj%$`%$aNj%$a%$bNj%$b%$cNj%$d%$eNj%$r%$sNj%$s%$tNj%$v%$wNj%$w%$xNj%$z%${Nj%$|%$}Nj%$}%%ONj%%P%%QNj%%R%%SNj%%S%%TNj%%T%%UNj%%U%%VNj%%V%%WNj%%W%%XNj%%Y%%ZNj%%[%%]Nj%%b%%cNj%%c%%dNj%%d%%eNj%%e%%fNj%%h%%iNj%%j%%kNj%%|%%}Nj%%}%&O!G]%&O%&PNj%&P%&QNj%&Q%&RNj%&R%&SNj%&S%&TNj%&T%&UNj%&U%&VNj%&V%&WNj%&W%&XNj%&X%&YNj%&b%&cKV%&c%&dKV%&d%&eKV%&e%&fKV%&f%&gKV%&g%&hKV%&q%&r!Fi%&r%&s!Fi%&s%&t!Fi%&w%&xKV%'O%'P!Fi%'P%'QKV%'Q%'RKV%'R%'S!Fi%'T%'U!Fi%'c%'dKV%'f%'gKV%'g%'hKV%'i%'jKV%'j%'kKV%'l%'m!Fi%'m%'nKV%'n%'oKV%'o%'pKV%'p%'qKV%'q%'rKV%'r%'sKV%'s%'tKV%'t%'uKV%'u%'vKV%'v%'wKV%'w%'xKV%'x%'yKV%'y%'zKV%'z%'{KV%'|%'}KV%'}%(OKV%(O%(PKV%(P%(QKV%(Q%(RLS%(R%(SLS%(S%(TKV%(T%(UKV%(U%(VKV%(V%(WKV%(W%(XKV%(X%(YKV%(Y%(ZKV%(Z%([KV%([%(]KV%(]%(^KV%(^%(_KV%(_%(`KV%(`%(aKV%(a%(bKV%(b%(cKV%(c%(dKV%(d%(eKV%(e%(fKV%(f%(gKV%(g%(hKV%(h%(iKV%(i%(jKV%(j%(kKV%(k%(lKV%(l%(mKV%(m%(nKV%(n%(oKV%(o%(pKV%(p%(qKV%(q%(rKV%(r%(sKV%(s%(tKV%(t%(uKV%(u%(vKV%(v%(wKV%(w%(xKV%(x%(yKV%(y%(zKV%(z%({KV%({%(|KV%(|%(}KV%(}%)OKV%)O%)PKV%)P%)QKV%)Q%)RKV%)R%)SKV%)S%)TKV%)T%)UKV%)U%)VKV%)V%)WKV%)W%)XKV%)X%)YKV%)Y%)ZKV%)Z%)[KV%)]%)^!Fi%)_%)`KV%)`%)aKV%)a%)bKV%)b%)cKV%)c%)d!Fi%)g%)h!Fi%)h%)i!Fi%)i%)j!Fi%)j%)k!Fi%)k%)l!Fi%)l%)mKV%)p%)q!Fi%)q%)r!Fi%)r%)sKV%)s%)tKV%)y%)zKV%)|%)}KV%*O%*PKV%*Q%*RKV%*R%*SKV%*S%*TKV%*T%*UKV%*U%*VKV%*V%*WKV%*W%*XKV%*X%*YKV%*]%*^!DV%*^%*_!Fi%*f%*g!Fi%*g%*h!Fi%*h%*i!Fi%*i%*j!Fi%*k%*l!Fi%*l%*m!Fi%*m%*n!Fi%*n%*o!Fi%*o%*pKV%*q%*r!Fi%*r%*sKV%*s%*tKV%*t%*u!Fi%*w%*xKV%*x%*yKV%*y%*zKV%*z%*{KV%*{%*|KV%*|%*}KV%*}%+OKV%+O%+PKV%+P%+QKV%+Q%+RKV%+R%+SKV%+S%+TKV%+T%+UKV%+U%+VKV%+V%+WKV%+W%+XKV%+X%+YKV%+Y%+ZKV%+Z%+[KV%+[%+]KV%+]%+^KV%+^%+_KV%+_%+`KV%+`%+aKV%+a%+bKV%+f%+gKV%+g%+hKV%+h%+iKV%+i%+jKV%+j%+kKV%+k%+lKV%+l%+mKV%+m%+nKV%+n%+oKV%+o%+pKV%+p%+qKV%+q%+rKV%+r%+sKV%+s%+tKV%:y%:z!Fi%F[%F]KV%Fb%FcKV%Fc%FdKV%Fk%Fl!Fi%Fl%FmKV%Fo%Fp!Fi%Fp%Fq!Fi%Fq%Fr!Fi%G[%G]!G]%G]%G^!G]%Ga%GbNj%Gb%GcNj%Gc%GdNj%Ge%GfNj%Gf%GgNj%Gg%GhNj%Gh%GiNj%Gi%GjNj%Gj%GkNj%Gk%GlNj%MW%MXNj%MX%MYNj%MY%MZNj%MZ%M[Nj%M[%M]Nj%M]%M^Nj%M^%M_Nj%M_%M`Nj%M`%Ma!G]%Ma%Mb!G]%Mb%Mc!G]%Mc%Md!G]%Md%MeNj%Me%MfNj%Mf%MgNj%Mg%MhNj%Mh%MiNj%Mi%MjNj%Mj%Mk!G]%Mk%Ml!G]%Ml%MmNj%Mm%MnNj%Mn%MoNj%Mo%MpNj%Mp%MqNj%Mu%MvNj%Mv%MwNj%Mw%MxNj%Mx%MyNj%Nn%NoNj%No%NpNj%Np%NqNj%Nq%NrNj%Nr%NsNj%Ns%Nt!G]%Nt%NuNj%Nu%NvNj%Nv%Nw!G]%Nw%Nx!G]%Nx%NyNj%Ny%Nz!G]%Nz%N{Nj%N{%N|!G]%N|%N}Nj%N}& ONj& O& P!G]& P& Q!G]& Q& RNj& R& SNj& S& T!G]& T& U!G]& U& VNj& V& WNj& W& X!G]& X& Y!G]& Y& ZNj& Z& [Nj& [& ]!G]& ]& ^!G]& ^& _Nj& _& `!G]& `& aNj& a& b!G]& b& cNj& c& dNj& d& eNj& e& fNj& f& gNj& g& hNj& h& iNj& i& jNj& j& k!G]& k& l!G]& l& mNj&#V&#WKV&#W&#X!Fi&#[&#]!Fi&#^&#_!Fi&#_&#`!Fi&#`&#aKV&#a&#bKV&$R&$SKV&$T&$UKV&$U&$VKV&$V&$WKV&$f&$gNj&$h&$i!Fi&$i&$j!Fi&$y&$z!Fi&%a&%b!Fi&%t&%u!Fi&%u&%v!Fi&%v&%w!Fi&%w&%x!Fi&%x&%y!Fi&%y&%z!Fi&%z&%{!Fi&%{&%|!Fi&%|&%}!Fi&&P&&Q!Fi&&Q&&R!Fi&&R&&S!Fi&&U&&V!Fi&&X&&Y!Fi&&Y&&Z!Fi&&a&&b!Fi&&c&&d!Fi&&d&&e!Fi&&g&&h!Fi&&i&&j!Fi&&k&&l!Fi&&n&&o!Fi&&p&&q!Fi&&r&&s!Fi&&t&&u!Fi&&u&&v!Fi&&v&&w!Fi&&|&&}KV&&}&'OKV&'Q&'RKV&'R&'SKV&'S&'TKV&'T&'UKV&'U&'VKV&'V&'WKV&'W&'XKV&'X&'YKV&'Y&'ZKV&'Z&'[KV&'[&']LS&']&'^KV&'^&'_KV&'_&'`KV&'`&'aKV&'a&'bKV&'b&'cKV&'c&'dKV&'d&'eKV&'e&'fKV&'f&'gKV&'g&'hKV&'h&'iKV&'i&'jKV&'j&'kKV&'k&'lKV&'l&'mKV&'m&'nKV&'n&'oKV&'o&'pKV&'p&'qKV&'q&'rKV&'r&'sKV&'s&'tKV&'t&'uKV&'u&'vKV&'v&'wKV&'w&'xKV&'x&'yKV&'y&'zKV&'z&'{KV&'{&'|KV&'|&'}KV&'}&(OKV&(O&(PKV&(P&(QKV&(Q&(RKV&(R&(SKV&(S&(TKV&(T&(UKV&(U&(VKV&(V&(WKV&(W&(XKV&(X&(YKV&(Y&(ZKV&(Z&([KV&([&(]KV&(]&(^KV&(^&(_KV&(_&(`KV&(`&(aKV&(a&(bKV&(b&(cKV&(c&(dKV&(d&(eKV&(e&(fKV&(f&(gKV&(g&(hKV&(h&(iKV&(i&(jKV&(j&(kKV&(k&(lKV&(l&(mKV&(m&(nKV&(n&(oKV&(o&(pKV&(p&(qKV&(q&(rKV&(r&(sKV&(s&(tKV&(t&(uKV&(u&(vKV&(v&(wKV&(w&(xKV&(x&(yKV&(y&(zKV&(z&({KV&({&(|KV&(|&(}KV&(}&)OKV&)O&)PKV&)P&)QKV&)Q&)RKV&)R&)SKV&)S&)TKV&)T&)UKV&)U&)VKV&)V&)WKV&)W&)XKV&)X&)YKV&)Y&)ZKV&)Z&)[KV&)[&)]KV&)]&)^KV&)^&)_KV&)_&)`KV&)`&)aKV&)a&)bKV&)b&)cKV&)c&)dKV&)d&)eKV&)e&)fKV&)g&)h!Fi&*T&*UKV&*U&*VKV&*V&*WKV&*W&*XKV&+`&+aNj&+a&+bNj&+b&+cNj&+c&+dNj&+d&+eNj&+e&+fNj&+f&+gNj&+g&+hNj&+h&+iNj&+i&+jNj&+j&+kNj&+k&+lNj&+l&+mNj&+m&+nNj&+n&+oNj&+o&+pNj&+p&+qNj&+q&+rNj&+r&+sNj&+s&+tNj&+t&+uNj&+w&+xNj&+x&+yNj&+y&+zNj&+z&+{Nj&+{&+|Nj&+|&+}Nj?MX?MYNj?MY?MZ!G]?MZ?M[Nj?M[?M]!G]P!C}P!_!`J}~!DVO&|~~!DYP!_!`LS~!D`P!O!P!Dc~!DhO'W~~!DmQ&m~!P!Q!DV!_!`LS~!DxSp~!Q![!Ds!g!h!EU#R#S!Ds#X#Y!EU~!EXR{|!Eb}!O!Eb!Q![!Eh~!EeP!Q![!Eh~!EmPp~!Q![!Eh~!EuQ&oP!^!_!DV!_!`KV~!FQP&Y~!_!`J}~!FYQ&oP!_!`KV!`!a!F`~!FcQ!_!`LS!`!a!DV~!FnO&m~~!FsP&n~!_!`LS~!FyQ!_!`!GP#p#q!GV~!GSP#p#qLS~!GYP!_!`!GP~!GbO&n~~!GgVp~!O!P!G|!Q![!H[!g!h!EU!z!{!Hp#R#S!H[#X#Y!EU#l#m!Hp~!HRRp~!Q![!Ds!g!h!EU#X#Y!EU~!HaTp~!O!P!G|!Q![!H[!g!h!EU#R#S!H[#X#Y!EU~!HsR!Q![!H|!c!i!H|#T#Z!H|~!IRWp~!Q![!H|!c!g!H|!g!h!Ik!h!i!H|#R#S!H|#T#X!H|#X#Y!Ik#Y#Z!H|~!IpYp~{|!Eb}!O!Eb!Q![!H|!c!g!H|!g!h!Ik!h!i!H|#R#S!H|#T#X!H|#X#Y!Ik#Y#Z!H|~!JeQ&P~![!]!Jk!_!`LS~!JpO&p~~!JuO&`~~!JzS&oP![!]!KW!^!_!K]!_!`KV#p#q!Ke~!K]O&q~~!KbP&}~!_!`LS~!KjO'P~~!KqQ&Z~&Y~!_!`J}!`!a!Kw~!K|O&w~~!LRR&oP![!]!L[!_!`KV!`!a!La~!LaO&z~~!LfQ&}~!_!`LS!`!a!K]~!LqO&x~~!LvO&Q~~!L{O&]~~!MQO&e~~!MVO&h~~!MYT{|!Mi!^!_!Mz!_!`!GP!`!a!NW#p#q!N`~!MlP{|!Mo~!MrP#p#q!Mu~!MzO&k~P!M}P![!]!NQP!NTP#p#qKV~!N]P'Q~![!]!NQ~!NeQ'R~!_!`!GP#p#q!Mu~!NpO&i~~!NwO&Y~&z~R# OO&rQ&oP~# VO&k~&oP~# [P&k~!_!`LS",
  tokenizers: [terminator, Identifier, BlockComment, tripleStringContent, stringContent, commandStringContent, layoutExtra, 0, 1],
  topRules: { "SourceFile": [0, 4] },
  dynamicPrecedences: { "24": 2, "26": 2, "44": 2, "46": 2, "54": 2, "56": 2, "111": 1, "153": 1, "166": 1, "170": 2, "244": 1, "268": 1, "271": 1, "285": 1, "290": 1 },
  specialized: [{ term: 1, get: (value) => spec_Identifier[value] || -1 }],
  tokenPrec: 42625,
  termNames: { "0": "\u26A0", "1": "Identifier", "2": "BlockComment", "3": "Comment", "4": "@top", "5": "IfStatement", "6": 'Identifier/"if"', "7": "ElseifClause", "8": 'Identifier/"elseif"', "9": "ElseClause", "10": 'Identifier/"else"', "11": 'Identifier/"end"', "12": "TryStatement", "13": 'Identifier/"try"', "14": "CatchClause", "15": 'Identifier/"catch"', "16": "FinallyClause", "17": 'Identifier/"finally"', "18": "ForStatement", "19": 'Identifier/"for"', "20": "ForBinding<e,pe>", "21": "TupleExpression<e,pe>", "22": "NamedField<e,pe>", "23": "TypedExpression<pe>", "24": "InterpolationExpression<pe>", "25": "FieldExpression<pe>", "26": "QuoteExpression<pe>", "27": "SubscriptExpression<pe>", "28": "GeneratorExpression", "29": "PrimitiveDefinition", "30": 'Identifier/"primitive"', "31": 'Identifier/"type"', "32": "Number", "33": "AbstractDefinition", "34": 'Identifier/"abstract"', "35": "StructDefinition", "36": 'Identifier/"mutable"', "37": 'Identifier/"struct"', "38": "ModuleDefinition", "39": 'Identifier/"module"', "40": "BareModuleDefinition", "41": 'Identifier/"baremodule"', "42": "MacroDefinition", "43": 'Identifier/"macro"', "44": "InterpolationExpression<definitionHead>", "45": "FieldExpression<definitionHead>", "46": "QuoteExpression<definitionHead>", "47": "SubscriptExpression<definitionHead>", "48": "GeneratorExpression-1", "49": "ForClause<s_e,s_pe>", "50": "ForBinding<s_e,s_pe>", "51": "TupleExpression<s_e,s_pe>", "52": "NamedField<s_e,s_pe>", "53": "TypedExpression<s_pe>", "54": "InterpolationExpression<s_pe>", "55": "FieldExpression<s_pe>", "56": "QuoteExpression<s_pe>", "57": "SubscriptExpression<s_pe>", "58": "GeneratorExpression-2", "59": "AssignmentExpression", "60": "AssignmentExpression-1", "61": "CallExpression<s_e,s_pe>", "62": "ArgumentList<s_e,s_pe>", "63": "NamedArgument", "64": "DoClause", "65": 'Identifier/"do"', "66": "Character", "67": "Symbol", "68": "String", "69": "TripleString", "70": "CommandString", "71": "PrefixedString", "72": "ParenthesizedExpression<s_e>", "73": "AssignmentExpression-2", "74": "AssignmentExpression-3", "75": "ArrayExpression<s_e>", "76": "ArrayComprehensionExpression<s_e,s_pe>", "77": "MatrixExpression<s_e>", "78": "MatrixRow<s_e>", "79": "GeneratorExpression<s_e,s_pe>", "80": "ParameterizedIdentifier<s_e,s_pe>", "81": "TypeArgumentList<s_e>", "82": "Operator", "83": 'Identifier/"in"', "84": "IfClause<s_e,s_pe>", "85": "AssignmentExpression-4", "86": "ParameterizedIdentifier<e,definitionHead>", "87": "TypeArgumentList<e>", "88": "ParenthesizedExpression<definitionHead>", "89": "AssignmentExpression-5", "90": "AssignmentExpression-6", "91": "ArgumentList<e,pe>", "92": "NamedArgument-1", "93": "FunctionDefinition", "94": 'Identifier/"function"', "95": "ReturnType", "96": "CompoundExpression", "97": 'Identifier/"begin"', "98": "PairExpression<s_e>", "99": "MacroExpression<s_e,s_pe>", "100": "MacroIdentifier", "101": "Operator-1", "102": "MacroFieldExpression<s_pe>", "103": "MacroArgumentList<s_e>", "104": "AssignmentExpression<s_e>", "105": "BareTupleExpression<s_e>", "106": "UnaryExpression<s_e>", "107": "BinaryExpression<s_e>", "108": 'Identifier/"isa"', "109": "TernaryExpression<s_e>", "110": "FunctionExpression<s_e,s_pe>", "111": "CoefficientExpression<s_e>", "112": "RangeExpression<s_e>", "113": "SpreadExpression<s_e>", "114": "Operator-2", "115": "AssignmentExpression-7", "116": "CallExpression<e,pe>", "117": "ParenthesizedExpression<e>", "118": "AssignmentExpression-8", "119": "AssignmentExpression-9", "120": "ArrayExpression<e>", "121": "ArrayComprehensionExpression<e,pe>", "122": "ForClause<e,pe>", "123": "IfClause<e,pe>", "124": "MatrixExpression<e>", "125": "MatrixRow<e>", "126": "GeneratorExpression<e,pe>", "127": "ParameterizedIdentifier<e,pe>", "128": "WhileStatement", "129": 'Identifier/"while"', "130": "LetStatement", "131": 'Identifier/"let"', "132": "VariableDeclaration", "133": "ConstStatement", "134": 'Identifier/"const"', "135": "GlobalStatement", "136": 'Identifier/"global"', "137": "LocalStatement", "138": 'Identifier/"local"', "139": "QuoteStatement", "140": 'Identifier/"quote"', "141": "BreakStatement", "142": 'Identifier/"break"', "143": "ContinueStatement", "144": 'Identifier/"continue"', "145": "ReturnStatement", "146": 'Identifier/"return"', "147": "BareTupleExpression<e>", "148": "ImportStatement", "149": 'Identifier/"using"', "150": 'Identifier/"import"', "151": "Import", "152": "ScopedIdentifier", "153": "SelectedImport", "154": "ExportStatement", "155": 'Identifier/"export"', "156": "PairExpression<e>", "157": "MacroExpression<e,pe>", "158": "MacroFieldExpression<pe>", "159": "MacroArgumentList<e>", "160": "AssignmentExpression<e>", "161": "UnaryExpression<e>", "162": "BinaryExpression<e>", "163": "TernaryExpression<e>", "164": "FunctionExpression<e,pe>", "165": "FunctionExpression", "166": "CoefficientExpression<e>", "167": "RangeExpression<e>", "168": "SpreadExpression<e>", "169": "Operator-3", "170": "FunctionAssignmentExpression", "171": 'Identifier/"where"', "172": "ElseifClause+", "173": '("," (s_e | AssignmentExpression { s_e (assignOperator | "=") s_e }))+', "174": '("," arg<s_e,s_pe>)+', "175": '("," arg<s_e,s_pe>)+-1', "176": "(stringContent | stringInterpolation)+", "177": "(tripleStringContent | stringInterpolation)+", "178": "(commandStringContent | stringInterpolation)+", "179": "(terminator (s_e | AssignmentExpression { simpleAssignmentExpression<s_e> }))+", "180": '("," s_e)+', "181": "(s_e)+", "182": '(";" MatrixRow<s_e>)+', "183": '("," tupleelem<s_e,s_pe>)+', "184": '("," ForBinding<s_e,s_pe>)+', "185": "(ForClause<s_e,s_pe> | IfClause<s_e,s_pe>)+", "186": '("," e)+', "187": "(terminator (definitionHead | AssignmentExpression { simpleAssignmentExpression<definitionHead> }))+", "188": '("," arg<e,pe>)+', "189": '("," arg<e,pe>)+-1', "190": "((s_e | AssignmentExpression<s_e>))+", "191": '("," s_e)+-1', "192": "(terminator (e | AssignmentExpression { simpleAssignmentExpression<e> }))+", "193": '("," ForBinding<e,pe>)+', "194": "(ForClause<e,pe> | IfClause<e,pe>)+", "195": "(e)+", "196": '(";" MatrixRow<e>)+', "197": '("," tupleelem<e,pe>)+', "198": '("," ForBinding<e,pe>)+-1', "199": '("," VariableDeclaration)+', "200": '("," VariableDeclaration)+-1', "201": '("," e)+-1', "202": '("," (Identifier | ScopedIdentifier))+', "203": '("," (Identifier | MacroIdentifier | Operator))+', "204": '("," Identifier)+', "205": "((e | AssignmentExpression<e>))+", "206": "(terminator (e | BareTupleExpression<e> | AssignmentExpression<e> | FunctionAssignmentExpression))+", "207": "\u2404", "208": "terminator", "209": "tripleStringContent", "210": "stringContent", "211": "commandStringContent", "212": "immediateParen", "213": "immediateColon", "214": "immediateBrace", "215": "immediateBracket", "216": "immediateDoubleQuote", "217": "immediateBackquote", "218": "immediateDot", "219": "nowhitespace", "220": "%mainskip", "221": "whitespace", "222": "expressionList<e,pe>", "223": "e", "224": "statement", "225": '"("', "226": "tupleelem<e,pe>", "227": "name", "228": "pe", "229": '"$"', "230": '"."', "231": '":"', "232": '"["', "233": "s_e", "234": "definition", "235": "definitionHead", "236": "comprehensionClause<s_e,s_pe>", "237": "tupleelem<s_e,s_pe>", "238": "name-1", "239": "s_pe", "240": "assignOperator", "241": '"="', "242": '","', "243": '"]"', "244": "args", "245": "arg<s_e,s_pe>", "246": '";"', "247": '")"', "248": '"\\""', "249": "stringInterpolation", "250": '"\\"\\"\\""', "251": '"`"', "252": "simpleExpressionList<s_e>", "253": "simpleAssignmentExpression<s_e>", "254": '"{"', "255": '"}"', "256": "plusOperator", "257": "plusOperatorExtra", "258": "plusminus", "259": "timesOperator", "260": "powerOperator", "261": "comparisonOperator", "262": '"::"', "263": '"<:"', "264": '"\u2208"', "265": "simpleExpressionList<definitionHead>", "266": "simpleAssignmentExpression<definitionHead>", "267": "arg<e,pe>", "268": "params", "269": '"=>"', "270": '"@"', "271": "args-1", "272": "unaryOperatorExtra", "273": `"'"`, "274": `".'"`, "275": "bitshiftOperator", "276": "arrowOperator", "277": '"<|"', "278": '"|>"', "279": '"||"', "280": '"&&"', "281": "ternary1", "282": "ternary2", "283": '"->"', "284": '"..."', "285": "args-2", "286": "simpleExpressionList<e>", "287": "simpleAssignmentExpression<e>", "288": "comprehensionClause<e,pe>", "289": "list", "290": "args-3", "291": "verboseFunctionExpression" }
});

// node_modules/@codemirror/tooltip/dist/index.js
var ios = typeof navigator != "undefined" && !/* @__PURE__ */ /Edge\/(\d+)/.exec(navigator.userAgent) && /* @__PURE__ */ /Apple Computer/.test(navigator.vendor) && (/* @__PURE__ */ /Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
var Outside = "-10000px";
var TooltipViewManager = class {
  constructor(view, facet, createTooltipView) {
    this.facet = facet;
    this.createTooltipView = createTooltipView;
    this.input = view.state.facet(facet);
    this.tooltips = this.input.filter((t2) => t2);
    this.tooltipViews = this.tooltips.map(createTooltipView);
  }
  update(update) {
    let input = update.state.facet(this.facet);
    let tooltips = input.filter((x) => x);
    if (input === this.input) {
      for (let t2 of this.tooltipViews)
        if (t2.update)
          t2.update(update);
      return { shouldMeasure: false };
    }
    let tooltipViews = [];
    for (let i = 0; i < tooltips.length; i++) {
      let tip = tooltips[i], known = -1;
      if (!tip)
        continue;
      for (let i2 = 0; i2 < this.tooltips.length; i2++) {
        let other = this.tooltips[i2];
        if (other && other.create == tip.create)
          known = i2;
      }
      if (known < 0) {
        tooltipViews[i] = this.createTooltipView(tip);
      } else {
        let tooltipView = tooltipViews[i] = this.tooltipViews[known];
        if (tooltipView.update)
          tooltipView.update(update);
      }
    }
    for (let t2 of this.tooltipViews)
      if (tooltipViews.indexOf(t2) < 0)
        t2.dom.remove();
    this.input = input;
    this.tooltips = tooltips;
    this.tooltipViews = tooltipViews;
    return { shouldMeasure: true };
  }
};
var tooltipPositioning = /* @__PURE__ */ Facet.define({
  combine: (values) => ios ? "absolute" : values.length ? values[0] : "fixed"
});
var tooltipPlugin = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.inView = true;
    this.position = view.state.facet(tooltipPositioning);
    this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this };
    this.manager = new TooltipViewManager(view, showTooltip, (t2) => this.createTooltip(t2));
  }
  update(update) {
    let { shouldMeasure } = this.manager.update(update);
    let newPosition = update.state.facet(tooltipPositioning);
    if (newPosition != this.position) {
      this.position = newPosition;
      for (let t2 of this.manager.tooltipViews)
        t2.dom.style.position = newPosition;
      shouldMeasure = true;
    }
    if (shouldMeasure)
      this.maybeMeasure();
  }
  createTooltip(tooltip) {
    let tooltipView = tooltip.create(this.view);
    tooltipView.dom.classList.add("cm-tooltip");
    tooltipView.dom.style.position = this.position;
    tooltipView.dom.style.top = Outside;
    this.view.dom.appendChild(tooltipView.dom);
    if (tooltipView.mount)
      tooltipView.mount(this.view);
    return tooltipView;
  }
  destroy() {
    for (let { dom } of this.manager.tooltipViews)
      dom.remove();
  }
  readMeasure() {
    return {
      editor: this.view.dom.getBoundingClientRect(),
      pos: this.manager.tooltips.map((t2) => this.view.coordsAtPos(t2.pos)),
      size: this.manager.tooltipViews.map(({ dom }) => dom.getBoundingClientRect()),
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  }
  writeMeasure(measured) {
    let { editor } = measured;
    let others = [];
    for (let i = 0; i < this.manager.tooltips.length; i++) {
      let tooltip = this.manager.tooltips[i], tView = this.manager.tooltipViews[i], { dom } = tView;
      let pos = measured.pos[i], size = measured.size[i];
      if (!pos || pos.bottom <= editor.top || pos.top >= editor.bottom || pos.right <= editor.left || pos.left >= editor.right) {
        dom.style.top = Outside;
        continue;
      }
      let width = size.right - size.left, height = size.bottom - size.top;
      let left = this.view.textDirection == Direction.LTR ? Math.min(pos.left, measured.innerWidth - width) : Math.max(0, pos.left - width);
      let above = !!tooltip.above;
      if (!tooltip.strictSide && (above ? pos.top - (size.bottom - size.top) < 0 : pos.bottom + (size.bottom - size.top) > measured.innerHeight))
        above = !above;
      let top2 = above ? pos.top - height : pos.bottom, right = left + width;
      for (let r of others)
        if (r.left < right && r.right > left && r.top < top2 + height && r.bottom > top2)
          top2 = above ? r.top - height : r.bottom;
      if (this.position == "absolute") {
        dom.style.top = top2 - editor.top + "px";
        dom.style.left = left - editor.left + "px";
      } else {
        dom.style.top = top2 + "px";
        dom.style.left = left + "px";
      }
      others.push({ left, top: top2, right, bottom: top2 + height });
      dom.classList.toggle("cm-tooltip-above", above);
      dom.classList.toggle("cm-tooltip-below", !above);
      if (tView.positioned)
        tView.positioned();
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length) {
      if (this.view.inView)
        this.view.requestMeasure(this.measureReq);
      if (this.inView != this.view.inView) {
        this.inView = this.view.inView;
        if (!this.inView)
          for (let tv of this.manager.tooltipViews)
            tv.dom.style.top = Outside;
      }
    }
  }
}, {
  eventHandlers: {
    scroll() {
      this.maybeMeasure();
    }
  }
});
var baseTheme2 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-tooltip": {
    zIndex: 100
  },
  "&light .cm-tooltip": {
    border: "1px solid #ddd",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  }
});
var showTooltip = /* @__PURE__ */ Facet.define({
  enables: [tooltipPlugin, baseTheme2]
});

// node_modules/@codemirror/autocomplete/dist/index.js
var CompletionContext = class {
  constructor(state, pos, explicit) {
    this.state = state;
    this.pos = pos;
    this.explicit = explicit;
    this.abortListeners = [];
  }
  tokenBefore(types2) {
    let token = syntaxTree(this.state).resolveInner(this.pos, -1);
    while (token && types2.indexOf(token.name) < 0)
      token = token.parent;
    return token ? {
      from: token.from,
      to: this.pos,
      text: this.state.sliceDoc(token.from, this.pos),
      type: token.type
    } : null;
  }
  matchBefore(expr) {
    let line = this.state.doc.lineAt(this.pos);
    let start = Math.max(line.from, this.pos - 250);
    let str = line.text.slice(start - line.from, this.pos - line.from);
    let found = str.search(ensureAnchor(expr, false));
    return found < 0 ? null : { from: start + found, to: this.pos, text: str.slice(found) };
  }
  get aborted() {
    return this.abortListeners == null;
  }
  addEventListener(type, listener) {
    if (type == "abort" && this.abortListeners)
      this.abortListeners.push(listener);
  }
};
function toSet(chars2) {
  let flat = Object.keys(chars2).join("");
  let words = /\w/.test(flat);
  if (words)
    flat = flat.replace(/\w/g, "");
  return `[${words ? "\\w" : ""}${flat.replace(/[^\w\s]/g, "\\$&")}]`;
}
function prefixMatch(options) {
  let first = Object.create(null), rest = Object.create(null);
  for (let { label } of options) {
    first[label[0]] = true;
    for (let i = 1; i < label.length; i++)
      rest[label[i]] = true;
  }
  let source = toSet(first) + toSet(rest) + "*$";
  return [new RegExp("^" + source), new RegExp(source)];
}
function completeFromList(list) {
  let options = list.map((o) => typeof o == "string" ? { label: o } : o);
  let [span, match] = options.every((o) => /^\w+$/.test(o.label)) ? [/\w*$/, /\w+$/] : prefixMatch(options);
  return (context) => {
    let token = context.matchBefore(match);
    return token || context.explicit ? { from: token ? token.from : context.pos, options, span } : null;
  };
}
var Option = class {
  constructor(completion, source, match) {
    this.completion = completion;
    this.source = source;
    this.match = match;
  }
};
function cur(state) {
  return state.selection.main.head;
}
function ensureAnchor(expr, start) {
  var _a;
  let { source } = expr;
  let addStart = start && source[0] != "^", addEnd = source[source.length - 1] != "$";
  if (!addStart && !addEnd)
    return expr;
  return new RegExp(`${addStart ? "^" : ""}(?:${source})${addEnd ? "$" : ""}`, (_a = expr.flags) !== null && _a !== void 0 ? _a : expr.ignoreCase ? "i" : "");
}
function applyCompletion(view, option) {
  let apply = option.completion.apply || option.completion.label;
  let result = option.source;
  if (typeof apply == "string") {
    view.dispatch({
      changes: { from: result.from, to: result.to, insert: apply },
      selection: { anchor: result.from + apply.length },
      userEvent: "input.complete"
    });
  } else {
    apply(view, option.completion, result.from, result.to);
  }
}
var SourceCache = /* @__PURE__ */ new WeakMap();
function asSource(source) {
  if (!Array.isArray(source))
    return source;
  let known = SourceCache.get(source);
  if (!known)
    SourceCache.set(source, known = completeFromList(source));
  return known;
}
var FuzzyMatcher = class {
  constructor(pattern) {
    this.pattern = pattern;
    this.chars = [];
    this.folded = [];
    this.any = [];
    this.precise = [];
    this.byWord = [];
    for (let p = 0; p < pattern.length; ) {
      let char = codePointAt(pattern, p), size = codePointSize(char);
      this.chars.push(char);
      let part = pattern.slice(p, p + size), upper = part.toUpperCase();
      this.folded.push(codePointAt(upper == part ? part.toLowerCase() : upper, 0));
      p += size;
    }
    this.astral = pattern.length != this.chars.length;
  }
  match(word) {
    if (this.pattern.length == 0)
      return [0];
    if (word.length < this.pattern.length)
      return null;
    let { chars: chars2, folded, any, precise, byWord } = this;
    if (chars2.length == 1) {
      let first = codePointAt(word, 0);
      return first == chars2[0] ? [0, 0, codePointSize(first)] : first == folded[0] ? [-200, 0, codePointSize(first)] : null;
    }
    let direct = word.indexOf(this.pattern);
    if (direct == 0)
      return [0, 0, this.pattern.length];
    let len = chars2.length, anyTo = 0;
    if (direct < 0) {
      for (let i = 0, e = Math.min(word.length, 200); i < e && anyTo < len; ) {
        let next = codePointAt(word, i);
        if (next == chars2[anyTo] || next == folded[anyTo])
          any[anyTo++] = i;
        i += codePointSize(next);
      }
      if (anyTo < len)
        return null;
    }
    let preciseTo = 0;
    let byWordTo = 0, byWordFolded = false;
    let adjacentTo = 0, adjacentStart = -1, adjacentEnd = -1;
    let hasLower = /[a-z]/.test(word);
    for (let i = 0, e = Math.min(word.length, 200), prevType = 0; i < e && byWordTo < len; ) {
      let next = codePointAt(word, i);
      if (direct < 0) {
        if (preciseTo < len && next == chars2[preciseTo])
          precise[preciseTo++] = i;
        if (adjacentTo < len) {
          if (next == chars2[adjacentTo] || next == folded[adjacentTo]) {
            if (adjacentTo == 0)
              adjacentStart = i;
            adjacentEnd = i;
            adjacentTo++;
          } else {
            adjacentTo = 0;
          }
        }
      }
      let ch, type = next < 255 ? next >= 48 && next <= 57 || next >= 97 && next <= 122 ? 2 : next >= 65 && next <= 90 ? 1 : 0 : (ch = fromCodePoint(next)) != ch.toLowerCase() ? 1 : ch != ch.toUpperCase() ? 2 : 0;
      if ((type == 1 && hasLower || prevType == 0 && type != 0) && (chars2[byWordTo] == next || folded[byWordTo] == next && (byWordFolded = true)))
        byWord[byWordTo++] = i;
      prevType = type;
      i += codePointSize(next);
    }
    if (byWordTo == len && byWord[0] == 0)
      return this.result(-100 + (byWordFolded ? -200 : 0), byWord, word);
    if (adjacentTo == len && adjacentStart == 0)
      return [-200, 0, adjacentEnd];
    if (direct > -1)
      return [-700, direct, direct + this.pattern.length];
    if (adjacentTo == len)
      return [-200 + -700, adjacentStart, adjacentEnd];
    if (byWordTo == len)
      return this.result(-100 + (byWordFolded ? -200 : 0) + -700, byWord, word);
    return chars2.length == 2 ? null : this.result((any[0] ? -700 : 0) + -200 + -1100, any, word);
  }
  result(score2, positions, word) {
    let result = [score2], i = 1;
    for (let pos of positions) {
      let to = pos + (this.astral ? codePointSize(codePointAt(word, pos)) : 1);
      if (i > 1 && result[i - 1] == pos)
        result[i - 1] = to;
      else {
        result[i++] = pos;
        result[i++] = to;
      }
    }
    return result;
  }
};
var completionConfig = /* @__PURE__ */ Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      activateOnTyping: true,
      override: null,
      maxRenderedOptions: 100,
      defaultKeymap: true,
      optionClass: () => "",
      icons: true,
      addToOptions: []
    }, {
      defaultKeymap: (a, b) => a && b,
      icons: (a, b) => a && b,
      optionClass: (a, b) => (c) => joinClass(a(c), b(c)),
      addToOptions: (a, b) => a.concat(b)
    });
  }
});
function joinClass(a, b) {
  return a ? b ? a + " " + b : a : b;
}
var MaxInfoWidth = 300;
var baseTheme3 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      maxHeight: "10em",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li": {
        cursor: "pointer",
        padding: "1px 1em 1px 3px",
        lineHeight: 1.2
      },
      "& > li[aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      }
    }
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"\xB7\xB7\xB7"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: MaxInfoWidth + "px"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'\u0192'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'\u25CB'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'\u25CC'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'\u{1D465}'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'\u{1D436}'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'\u{1D461}'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'\u222A'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'\u25A1'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'\u{1F511}\uFE0E'" }
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'\u25A2'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
});
function optionContent(config2) {
  let content2 = config2.addToOptions.slice();
  if (config2.icons)
    content2.push({
      render(completion) {
        let icon = document.createElement("div");
        icon.classList.add("cm-completionIcon");
        if (completion.type)
          icon.classList.add(...completion.type.split(/\s+/g).map((cls) => "cm-completionIcon-" + cls));
        icon.setAttribute("aria-hidden", "true");
        return icon;
      },
      position: 20
    });
  content2.push({
    render(completion, _s, match) {
      let labelElt = document.createElement("span");
      labelElt.className = "cm-completionLabel";
      let { label } = completion, off = 0;
      for (let j = 1; j < match.length; ) {
        let from = match[j++], to = match[j++];
        if (from > off)
          labelElt.appendChild(document.createTextNode(label.slice(off, from)));
        let span = labelElt.appendChild(document.createElement("span"));
        span.appendChild(document.createTextNode(label.slice(from, to)));
        span.className = "cm-completionMatchedText";
        off = to;
      }
      if (off < label.length)
        labelElt.appendChild(document.createTextNode(label.slice(off)));
      return labelElt;
    },
    position: 50
  }, {
    render(completion) {
      if (!completion.detail)
        return null;
      let detailElt = document.createElement("span");
      detailElt.className = "cm-completionDetail";
      detailElt.textContent = completion.detail;
      return detailElt;
    },
    position: 80
  });
  return content2.sort((a, b) => a.position - b.position).map((a) => a.render);
}
function createInfoDialog(option, view) {
  let dom = document.createElement("div");
  dom.className = "cm-tooltip cm-completionInfo";
  let { info } = option.completion;
  if (typeof info == "string") {
    dom.textContent = info;
  } else {
    let content2 = info(option.completion);
    if (content2.then)
      content2.then((node) => dom.appendChild(node), (e) => logException(view.state, e, "completion info"));
    else
      dom.appendChild(content2);
  }
  return dom;
}
function rangeAroundSelected(total, selected, max) {
  if (total <= max)
    return { from: 0, to: total };
  if (selected <= total >> 1) {
    let off2 = Math.floor(selected / max);
    return { from: off2 * max, to: (off2 + 1) * max };
  }
  let off = Math.floor((total - selected) / max);
  return { from: total - (off + 1) * max, to: total - off * max };
}
var CompletionTooltip = class {
  constructor(view, stateField) {
    this.view = view;
    this.stateField = stateField;
    this.info = null;
    this.placeInfo = {
      read: () => this.measureInfo(),
      write: (pos) => this.positionInfo(pos),
      key: this
    };
    let cState = view.state.field(stateField);
    let { options, selected } = cState.open;
    let config2 = view.state.facet(completionConfig);
    this.optionContent = optionContent(config2);
    this.optionClass = config2.optionClass;
    this.range = rangeAroundSelected(options.length, selected, config2.maxRenderedOptions);
    this.dom = document.createElement("div");
    this.dom.className = "cm-tooltip-autocomplete";
    this.dom.addEventListener("mousedown", (e) => {
      for (let dom = e.target, match; dom && dom != this.dom; dom = dom.parentNode) {
        if (dom.nodeName == "LI" && (match = /-(\d+)$/.exec(dom.id)) && +match[1] < options.length) {
          applyCompletion(view, options[+match[1]]);
          e.preventDefault();
          return;
        }
      }
    });
    this.list = this.dom.appendChild(this.createListBox(options, cState.id, this.range));
    this.list.addEventListener("scroll", () => {
      if (this.info)
        this.view.requestMeasure(this.placeInfo);
    });
  }
  mount() {
    this.updateSel();
  }
  update(update) {
    if (update.state.field(this.stateField) != update.startState.field(this.stateField))
      this.updateSel();
  }
  positioned() {
    if (this.info)
      this.view.requestMeasure(this.placeInfo);
  }
  updateSel() {
    let cState = this.view.state.field(this.stateField), open = cState.open;
    if (open.selected < this.range.from || open.selected >= this.range.to) {
      this.range = rangeAroundSelected(open.options.length, open.selected, this.view.state.facet(completionConfig).maxRenderedOptions);
      this.list.remove();
      this.list = this.dom.appendChild(this.createListBox(open.options, cState.id, this.range));
      this.list.addEventListener("scroll", () => {
        if (this.info)
          this.view.requestMeasure(this.placeInfo);
      });
    }
    if (this.updateSelectedOption(open.selected)) {
      if (this.info) {
        this.info.remove();
        this.info = null;
      }
      let option = open.options[open.selected];
      if (option.completion.info) {
        this.info = this.dom.appendChild(createInfoDialog(option, this.view));
        this.view.requestMeasure(this.placeInfo);
      }
    }
  }
  updateSelectedOption(selected) {
    let set = null;
    for (let opt = this.list.firstChild, i = this.range.from; opt; opt = opt.nextSibling, i++) {
      if (i == selected) {
        if (!opt.hasAttribute("aria-selected")) {
          opt.setAttribute("aria-selected", "true");
          set = opt;
        }
      } else {
        if (opt.hasAttribute("aria-selected"))
          opt.removeAttribute("aria-selected");
      }
    }
    if (set)
      scrollIntoView(this.list, set);
    return set;
  }
  measureInfo() {
    let sel = this.dom.querySelector("[aria-selected]");
    if (!sel)
      return null;
    let rect = this.dom.getBoundingClientRect();
    let top2 = sel.getBoundingClientRect().top - rect.top;
    if (top2 < 0 || top2 > this.list.clientHeight - 10)
      return null;
    let left = this.view.textDirection == Direction.RTL;
    let spaceLeft = rect.left, spaceRight = innerWidth - rect.right;
    if (left && spaceLeft < Math.min(MaxInfoWidth, spaceRight))
      left = false;
    else if (!left && spaceRight < Math.min(MaxInfoWidth, spaceLeft))
      left = true;
    return { top: top2, left };
  }
  positionInfo(pos) {
    if (this.info && pos) {
      this.info.style.top = pos.top + "px";
      this.info.classList.toggle("cm-completionInfo-left", pos.left);
      this.info.classList.toggle("cm-completionInfo-right", !pos.left);
    }
  }
  createListBox(options, id, range) {
    const ul = document.createElement("ul");
    ul.id = id;
    ul.setAttribute("role", "listbox");
    for (let i = range.from; i < range.to; i++) {
      let { completion, match } = options[i];
      const li = ul.appendChild(document.createElement("li"));
      li.id = id + "-" + i;
      li.setAttribute("role", "option");
      let cls = this.optionClass(completion);
      if (cls)
        li.className = cls;
      for (let source of this.optionContent) {
        let node = source(completion, this.view.state, match);
        if (node)
          li.appendChild(node);
      }
    }
    if (range.from)
      ul.classList.add("cm-completionListIncompleteTop");
    if (range.to < options.length)
      ul.classList.add("cm-completionListIncompleteBottom");
    return ul;
  }
};
function completionTooltip(stateField) {
  return (view) => new CompletionTooltip(view, stateField);
}
function scrollIntoView(container, element) {
  let parent = container.getBoundingClientRect();
  let self = element.getBoundingClientRect();
  if (self.top < parent.top)
    container.scrollTop -= parent.top - self.top;
  else if (self.bottom > parent.bottom)
    container.scrollTop += self.bottom - parent.bottom;
}
var MaxOptions = 300;
function score(option) {
  return (option.boost || 0) * 100 + (option.apply ? 10 : 0) + (option.info ? 5 : 0) + (option.type ? 1 : 0);
}
function sortOptions(active, state) {
  let options = [], i = 0;
  for (let a of active)
    if (a.hasResult()) {
      if (a.result.filter === false) {
        for (let option of a.result.options)
          options.push(new Option(option, a, [1e9 - i++]));
      } else {
        let matcher = new FuzzyMatcher(state.sliceDoc(a.from, a.to)), match;
        for (let option of a.result.options)
          if (match = matcher.match(option.label)) {
            if (option.boost != null)
              match[0] += option.boost;
            options.push(new Option(option, a, match));
          }
      }
    }
  options.sort(cmpOption);
  let result = [], prev = null;
  for (let opt of options.sort(cmpOption)) {
    if (result.length == MaxOptions)
      break;
    if (!prev || prev.label != opt.completion.label || prev.detail != opt.completion.detail)
      result.push(opt);
    else if (score(opt.completion) > score(prev))
      result[result.length - 1] = opt;
    prev = opt.completion;
  }
  return result;
}
var CompletionDialog = class {
  constructor(options, attrs, tooltip, timestamp, selected) {
    this.options = options;
    this.attrs = attrs;
    this.tooltip = tooltip;
    this.timestamp = timestamp;
    this.selected = selected;
  }
  setSelected(selected, id) {
    return selected == this.selected || selected >= this.options.length ? this : new CompletionDialog(this.options, makeAttrs(id, selected), this.tooltip, this.timestamp, selected);
  }
  static build(active, state, id, prev) {
    let options = sortOptions(active, state);
    if (!options.length)
      return null;
    let selected = 0;
    if (prev && prev.selected) {
      let selectedValue = prev.options[prev.selected].completion;
      for (let i = 0; i < options.length && !selected; i++) {
        if (options[i].completion == selectedValue)
          selected = i;
      }
    }
    return new CompletionDialog(options, makeAttrs(id, selected), {
      pos: active.reduce((a, b) => b.hasResult() ? Math.min(a, b.from) : a, 1e8),
      create: completionTooltip(completionState)
    }, prev ? prev.timestamp : Date.now(), selected);
  }
  map(changes) {
    return new CompletionDialog(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: changes.mapPos(this.tooltip.pos) }), this.timestamp, this.selected);
  }
};
var CompletionState = class {
  constructor(active, id, open) {
    this.active = active;
    this.id = id;
    this.open = open;
  }
  static start() {
    return new CompletionState(none3, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(tr) {
    let { state } = tr, conf = state.facet(completionConfig);
    let sources = conf.override || state.languageDataAt("autocomplete", cur(state)).map(asSource);
    let active = sources.map((source) => {
      let value = this.active.find((s) => s.source == source) || new ActiveSource(source, this.active.some((a) => a.state != 0) ? 1 : 0);
      return value.update(tr, conf);
    });
    if (active.length == this.active.length && active.every((a, i) => a == this.active[i]))
      active = this.active;
    let open = tr.selection || active.some((a) => a.hasResult() && tr.changes.touchesRange(a.from, a.to)) || !sameResults(active, this.active) ? CompletionDialog.build(active, state, this.id, this.open) : this.open && tr.docChanged ? this.open.map(tr.changes) : this.open;
    if (!open && active.every((a) => a.state != 1) && active.some((a) => a.hasResult()))
      active = active.map((a) => a.hasResult() ? new ActiveSource(a.source, 0) : a);
    for (let effect of tr.effects)
      if (effect.is(setSelectedEffect))
        open = open && open.setSelected(effect.value, this.id);
    return active == this.active && open == this.open ? this : new CompletionState(active, this.id, open);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : baseAttrs;
  }
};
function sameResults(a, b) {
  if (a == b)
    return true;
  for (let iA = 0, iB = 0; ; ) {
    while (iA < a.length && !a[iA].hasResult)
      iA++;
    while (iB < b.length && !b[iB].hasResult)
      iB++;
    let endA = iA == a.length, endB = iB == b.length;
    if (endA || endB)
      return endA == endB;
    if (a[iA++].result != b[iB++].result)
      return false;
  }
}
var baseAttrs = {
  "aria-autocomplete": "list",
  "aria-expanded": "false"
};
function makeAttrs(id, selected) {
  return {
    "aria-autocomplete": "list",
    "aria-expanded": "true",
    "aria-activedescendant": id + "-" + selected,
    "aria-controls": id
  };
}
var none3 = [];
function cmpOption(a, b) {
  let dScore = b.match[0] - a.match[0];
  if (dScore)
    return dScore;
  return a.completion.label.localeCompare(b.completion.label);
}
function getUserEvent(tr) {
  return tr.isUserEvent("input.type") ? "input" : tr.isUserEvent("delete.backward") ? "delete" : null;
}
var ActiveSource = class {
  constructor(source, state, explicitPos = -1) {
    this.source = source;
    this.state = state;
    this.explicitPos = explicitPos;
  }
  hasResult() {
    return false;
  }
  update(tr, conf) {
    let event = getUserEvent(tr), value = this;
    if (event)
      value = value.handleUserEvent(tr, event, conf);
    else if (tr.docChanged)
      value = value.handleChange(tr);
    else if (tr.selection && value.state != 0)
      value = new ActiveSource(value.source, 0);
    for (let effect of tr.effects) {
      if (effect.is(startCompletionEffect))
        value = new ActiveSource(value.source, 1, effect.value ? cur(tr.state) : -1);
      else if (effect.is(closeCompletionEffect))
        value = new ActiveSource(value.source, 0);
      else if (effect.is(setActiveEffect)) {
        for (let active of effect.value)
          if (active.source == value.source)
            value = active;
      }
    }
    return value;
  }
  handleUserEvent(tr, type, conf) {
    return type == "delete" || !conf.activateOnTyping ? this.map(tr.changes) : new ActiveSource(this.source, 1);
  }
  handleChange(tr) {
    return tr.changes.touchesRange(cur(tr.startState)) ? new ActiveSource(this.source, 0) : this.map(tr.changes);
  }
  map(changes) {
    return changes.empty || this.explicitPos < 0 ? this : new ActiveSource(this.source, this.state, changes.mapPos(this.explicitPos));
  }
};
var ActiveResult = class extends ActiveSource {
  constructor(source, explicitPos, result, from, to, span) {
    super(source, 2, explicitPos);
    this.result = result;
    this.from = from;
    this.to = to;
    this.span = span;
  }
  hasResult() {
    return true;
  }
  handleUserEvent(tr, type, conf) {
    let from = tr.changes.mapPos(this.from), to = tr.changes.mapPos(this.to, 1);
    let pos = cur(tr.state);
    if ((this.explicitPos > -1 ? pos < from : pos <= from) || pos > to)
      return new ActiveSource(this.source, type == "input" && conf.activateOnTyping ? 1 : 0);
    let explicitPos = this.explicitPos < 0 ? -1 : tr.changes.mapPos(this.explicitPos);
    if (this.span && (from == to || this.span.test(tr.state.sliceDoc(from, to))))
      return new ActiveResult(this.source, explicitPos, this.result, from, to, this.span);
    return new ActiveSource(this.source, 1, explicitPos);
  }
  handleChange(tr) {
    return tr.changes.touchesRange(this.from, this.to) ? new ActiveSource(this.source, 0) : this.map(tr.changes);
  }
  map(mapping) {
    return mapping.empty ? this : new ActiveResult(this.source, this.explicitPos < 0 ? -1 : mapping.mapPos(this.explicitPos), this.result, mapping.mapPos(this.from), mapping.mapPos(this.to, 1), this.span);
  }
};
var startCompletionEffect = /* @__PURE__ */ StateEffect.define();
var closeCompletionEffect = /* @__PURE__ */ StateEffect.define();
var setActiveEffect = /* @__PURE__ */ StateEffect.define({
  map(sources, mapping) {
    return sources.map((s) => s.map(mapping));
  }
});
var setSelectedEffect = /* @__PURE__ */ StateEffect.define();
var completionState = /* @__PURE__ */ StateField.define({
  create() {
    return CompletionState.start();
  },
  update(value, tr) {
    return value.update(tr);
  },
  provide: (f) => [
    showTooltip.from(f, (val) => val.tooltip),
    EditorView.contentAttributes.from(f, (state) => state.attrs)
  ]
});
var CompletionInteractMargin = 75;
function moveCompletionSelection(forward, by = "option") {
  return (view) => {
    let cState = view.state.field(completionState, false);
    if (!cState || !cState.open || Date.now() - cState.open.timestamp < CompletionInteractMargin)
      return false;
    let step = 1, tooltip;
    if (by == "page" && (tooltip = view.dom.querySelector(".cm-tooltip-autocomplete")))
      step = Math.max(2, Math.floor(tooltip.offsetHeight / tooltip.firstChild.offsetHeight));
    let selected = cState.open.selected + step * (forward ? 1 : -1), { length } = cState.open.options;
    if (selected < 0)
      selected = by == "page" ? 0 : length - 1;
    else if (selected >= length)
      selected = by == "page" ? length - 1 : 0;
    view.dispatch({ effects: setSelectedEffect.of(selected) });
    return true;
  };
}
var acceptCompletion = (view) => {
  let cState = view.state.field(completionState, false);
  if (!cState || !cState.open || Date.now() - cState.open.timestamp < CompletionInteractMargin)
    return false;
  applyCompletion(view, cState.open.options[cState.open.selected]);
  return true;
};
var startCompletion = (view) => {
  let cState = view.state.field(completionState, false);
  if (!cState)
    return false;
  view.dispatch({ effects: startCompletionEffect.of(true) });
  return true;
};
var closeCompletion = (view) => {
  let cState = view.state.field(completionState, false);
  if (!cState || !cState.active.some((a) => a.state != 0))
    return false;
  view.dispatch({ effects: closeCompletionEffect.of(null) });
  return true;
};
var RunningQuery = class {
  constructor(active, context) {
    this.active = active;
    this.context = context;
    this.time = Date.now();
    this.updates = [];
    this.done = void 0;
  }
};
var DebounceTime = 50;
var MaxUpdateCount = 50;
var MinAbortTime = 1e3;
var completionPlugin = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.debounceUpdate = -1;
    this.running = [];
    this.debounceAccept = -1;
    this.composing = 0;
    for (let active of view.state.field(completionState).active)
      if (active.state == 1)
        this.startQuery(active);
  }
  update(update) {
    let cState = update.state.field(completionState);
    if (!update.selectionSet && !update.docChanged && update.startState.field(completionState) == cState)
      return;
    let doesReset = update.transactions.some((tr) => {
      return (tr.selection || tr.docChanged) && !getUserEvent(tr);
    });
    for (let i = 0; i < this.running.length; i++) {
      let query = this.running[i];
      if (doesReset || query.updates.length + update.transactions.length > MaxUpdateCount && query.time - Date.now() > MinAbortTime) {
        for (let handler of query.context.abortListeners) {
          try {
            handler();
          } catch (e) {
            logException(this.view.state, e);
          }
        }
        query.context.abortListeners = null;
        this.running.splice(i--, 1);
      } else {
        query.updates.push(...update.transactions);
      }
    }
    if (this.debounceUpdate > -1)
      clearTimeout(this.debounceUpdate);
    this.debounceUpdate = cState.active.some((a) => a.state == 1 && !this.running.some((q) => q.active.source == a.source)) ? setTimeout(() => this.startUpdate(), DebounceTime) : -1;
    if (this.composing != 0)
      for (let tr of update.transactions) {
        if (getUserEvent(tr) == "input")
          this.composing = 2;
        else if (this.composing == 2 && tr.selection)
          this.composing = 3;
      }
  }
  startUpdate() {
    this.debounceUpdate = -1;
    let { state } = this.view, cState = state.field(completionState);
    for (let active of cState.active) {
      if (active.state == 1 && !this.running.some((r) => r.active.source == active.source))
        this.startQuery(active);
    }
  }
  startQuery(active) {
    let { state } = this.view, pos = cur(state);
    let context = new CompletionContext(state, pos, active.explicitPos == pos);
    let pending = new RunningQuery(active, context);
    this.running.push(pending);
    Promise.resolve(active.source(context)).then((result) => {
      if (!pending.context.aborted) {
        pending.done = result || null;
        this.scheduleAccept();
      }
    }, (err) => {
      this.view.dispatch({ effects: closeCompletionEffect.of(null) });
      logException(this.view.state, err);
    });
  }
  scheduleAccept() {
    if (this.running.every((q) => q.done !== void 0))
      this.accept();
    else if (this.debounceAccept < 0)
      this.debounceAccept = setTimeout(() => this.accept(), DebounceTime);
  }
  accept() {
    var _a;
    if (this.debounceAccept > -1)
      clearTimeout(this.debounceAccept);
    this.debounceAccept = -1;
    let updated = [];
    let conf = this.view.state.facet(completionConfig);
    for (let i = 0; i < this.running.length; i++) {
      let query = this.running[i];
      if (query.done === void 0)
        continue;
      this.running.splice(i--, 1);
      if (query.done) {
        let active = new ActiveResult(query.active.source, query.active.explicitPos, query.done, query.done.from, (_a = query.done.to) !== null && _a !== void 0 ? _a : cur(query.updates.length ? query.updates[0].startState : this.view.state), query.done.span && query.done.filter !== false ? ensureAnchor(query.done.span, true) : null);
        for (let tr of query.updates)
          active = active.update(tr, conf);
        if (active.hasResult()) {
          updated.push(active);
          continue;
        }
      }
      let current = this.view.state.field(completionState).active.find((a) => a.source == query.active.source);
      if (current && current.state == 1) {
        if (query.done == null) {
          let active = new ActiveSource(query.active.source, 0);
          for (let tr of query.updates)
            active = active.update(tr, conf);
          if (active.state != 1)
            updated.push(active);
        } else {
          this.startQuery(current);
        }
      }
    }
    if (updated.length)
      this.view.dispatch({ effects: setActiveEffect.of(updated) });
  }
}, {
  eventHandlers: {
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      if (this.composing == 3) {
        setTimeout(() => this.view.dispatch({ effects: startCompletionEffect.of(false) }), 20);
      }
      this.composing = 0;
    }
  }
});
function autocompletion(config2 = {}) {
  return [
    completionState,
    completionConfig.of(config2),
    completionPlugin,
    completionKeymapExt,
    baseTheme3
  ];
}
var completionKeymap = [
  { key: "Ctrl-Space", run: startCompletion },
  { key: "Escape", run: closeCompletion },
  { key: "ArrowDown", run: /* @__PURE__ */ moveCompletionSelection(true) },
  { key: "ArrowUp", run: /* @__PURE__ */ moveCompletionSelection(false) },
  { key: "PageDown", run: /* @__PURE__ */ moveCompletionSelection(true, "page") },
  { key: "PageUp", run: /* @__PURE__ */ moveCompletionSelection(false, "page") },
  { key: "Enter", run: acceptCompletion }
];
var completionKeymapExt = /* @__PURE__ */ Prec.override(/* @__PURE__ */ keymap.computeN([completionConfig], (state) => state.facet(completionConfig).defaultKeymap ? [completionKeymap] : []));

// node_modules/lang-julia/dist/index.js
function delimitedStrategy2(context, units, closing2) {
  let after = context.textAfter;
  let space = after.match(/^\s*/)[0].length;
  let closed = false;
  switch (closing2.length) {
    case 1:
      closed = after.slice(space, space + closing2[0].length) === closing2[0];
      break;
    case 2:
      closed = after.slice(space, space + closing2[0].length) === closing2[0] || after.slice(space, space + closing2[1].length) === closing2[1];
      break;
    case 3:
      closed = after.slice(space, space + closing2[0].length) === closing2[0] || after.slice(space, space + closing2[1].length) === closing2[1] || after.slice(space, space + closing2[2].length) === closing2[2];
      break;
    default:
      closed = closing2.some((closing3) => after.slice(space, space + closing3.length) === closing3);
      break;
  }
  return context.baseIndent + (closed ? 0 : context.unit * units);
}
function delimitedIndent({ closing: closing2, units = 1 }) {
  return (context) => delimitedStrategy2(context, units, closing2);
}
function noIndent(context) {
  return context.baseIndent;
}
function getSyntaxConfig() {
  let syntaxConfig2 = {
    indents: {
      VariableDeclaration: continuedIndent(),
      AssignmentExpression: continuedIndent()
    },
    keywords: []
  };
  for (let node of parser.nodeSet.types) {
    let groups = node.prop(NodeProp.group);
    let group = groups != null ? groups[0] : null;
    if (group === "keyword") {
      syntaxConfig2.keywords.push(node);
    }
    let nodeIndent;
    let closedBy = node.prop(NodeProp.closedBy);
    if (closedBy) {
      nodeIndent = delimitedIndent({ closing: closedBy });
    } else {
      nodeIndent = noIndent;
    }
    syntaxConfig2.indents[node.name] = nodeIndent;
  }
  return syntaxConfig2;
}
var syntaxConfig = /* @__PURE__ */ getSyntaxConfig();
var styleTags2 = /* @__PURE__ */ styleTags({
  Identifier: tags.variableName,
  String: tags.string,
  TripleString: tags.string,
  Comment: tags.lineComment,
  BlockComment: tags.comment,
  [/* @__PURE__ */ syntaxConfig.keywords.map((t2) => t2.name).join(" ")]: tags.keyword,
  "( )": tags.paren,
  "[ ]": tags.paren,
  "{ }": tags.paren,
  MacroIdentifier: tags.macroName
});
var language2 = /* @__PURE__ */ LRLanguage.define({
  parser: /* @__PURE__ */ parser.configure({
    props: [
      styleTags2,
      /* @__PURE__ */ indentNodeProp.add(/* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.assign({}, syntaxConfig.indents), { ModuleDefinition: noIndent, BareModuleDefinition: noIndent, VariableDeclaration: /* @__PURE__ */ continuedIndent(), AssignmentExpression: /* @__PURE__ */ continuedIndent() }))
    ]
  }),
  languageData: {
    commentTokens: { line: "#" },
    indentOnInput: /^\s*(\]|\}|\)|end|else|elseif|catch|finally)/,
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] }
  }
});
var keywordCompletion = /* @__PURE__ */ language2.data.of({
  autocomplete: /* @__PURE__ */ completeFromList(/* @__PURE__ */ syntaxConfig.keywords.map((keyword2) => ({
    label: keyword2.name,
    type: "keyword"
  })))
});
var defaultConfig = {
  enableKeywordCompletion: false
};
function julia2(config2 = defaultConfig) {
  config2 = Object.assign(Object.assign({}, defaultConfig), config2);
  let extensions = [];
  if (config2.enableKeywordCompletion) {
    extensions.push(keywordCompletion);
  }
  return new LanguageSupport(language2, extensions);
}

// node_modules/@codemirror/gutter/dist/index.js
var GutterMarker = class extends RangeValue {
  compare(other) {
    return this == other || this.constructor == other.constructor && this.eq(other);
  }
  eq(other) {
    return false;
  }
};
GutterMarker.prototype.elementClass = "";
GutterMarker.prototype.toDOM = void 0;
GutterMarker.prototype.mapMode = MapMode.TrackBefore;
GutterMarker.prototype.startSide = GutterMarker.prototype.endSide = -1;
GutterMarker.prototype.point = true;
var gutterLineClass = /* @__PURE__ */ Facet.define();
var defaults = {
  class: "",
  renderEmptyElements: false,
  elementStyle: "",
  markers: () => RangeSet.empty,
  lineMarker: () => null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {}
};
var activeGutters = /* @__PURE__ */ Facet.define();
function gutter(config2) {
  return [gutters(), activeGutters.of(Object.assign(Object.assign({}, defaults), config2))];
}
var baseTheme4 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-gutters": {
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    left: 0,
    zIndex: 200
  },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#999",
    borderRight: "1px solid #ddd"
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    height: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  }
});
var unfixGutters = /* @__PURE__ */ Facet.define({
  combine: (values) => values.some((x) => x)
});
function gutters(config2) {
  let result = [
    gutterView,
    baseTheme4
  ];
  if (config2 && config2.fixed === false)
    result.push(unfixGutters.of(true));
  return result;
}
var gutterView = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.dom = document.createElement("div");
    this.dom.className = "cm-gutters";
    this.dom.setAttribute("aria-hidden", "true");
    this.gutters = view.state.facet(activeGutters).map((conf) => new SingleGutterView(view, conf));
    for (let gutter2 of this.gutters)
      this.dom.appendChild(gutter2.dom);
    this.fixed = !view.state.facet(unfixGutters);
    if (this.fixed) {
      this.dom.style.position = "sticky";
    }
    view.scrollDOM.insertBefore(this.dom, view.contentDOM);
    this.syncGutters();
  }
  update(update) {
    if (this.updateGutters(update))
      this.syncGutters();
  }
  syncGutters() {
    let lineClasses = RangeSet.iter(this.view.state.facet(gutterLineClass), this.view.viewport.from);
    let classSet = [];
    let contexts = this.gutters.map((gutter2) => new UpdateContext(gutter2, this.view.viewport));
    this.view.viewportLines((line) => {
      let text;
      if (Array.isArray(line.type)) {
        for (let b of line.type)
          if (b.type == BlockType.Text) {
            text = b;
            break;
          }
      } else {
        text = line.type == BlockType.Text ? line : void 0;
      }
      if (!text)
        return;
      if (classSet.length)
        classSet = [];
      advanceCursor(lineClasses, classSet, line.from);
      for (let cx of contexts)
        cx.line(this.view, text, classSet);
    }, 0);
    for (let cx of contexts)
      cx.finish();
    this.dom.style.minHeight = this.view.contentHeight + "px";
    if (this.view.state.facet(unfixGutters) != !this.fixed) {
      this.fixed = !this.fixed;
      this.dom.style.position = this.fixed ? "sticky" : "";
    }
  }
  updateGutters(update) {
    let prev = update.startState.facet(activeGutters), cur2 = update.state.facet(activeGutters);
    let change = update.docChanged || update.heightChanged || update.viewportChanged || !RangeSet.eq(update.startState.facet(gutterLineClass), update.state.facet(gutterLineClass), update.view.viewport.from, update.view.viewport.to);
    if (prev == cur2) {
      for (let gutter2 of this.gutters)
        if (gutter2.update(update))
          change = true;
    } else {
      change = true;
      let gutters2 = [];
      for (let conf of cur2) {
        let known = prev.indexOf(conf);
        if (known < 0) {
          gutters2.push(new SingleGutterView(this.view, conf));
        } else {
          this.gutters[known].update(update);
          gutters2.push(this.gutters[known]);
        }
      }
      for (let g of this.gutters)
        g.dom.remove();
      for (let g of gutters2)
        this.dom.appendChild(g.dom);
      this.gutters = gutters2;
    }
    return change;
  }
  destroy() {
    this.dom.remove();
  }
}, {
  provide: /* @__PURE__ */ PluginField.scrollMargins.from((value) => {
    if (value.gutters.length == 0 || !value.fixed)
      return null;
    return value.view.textDirection == Direction.LTR ? { left: value.dom.offsetWidth } : { right: value.dom.offsetWidth };
  })
});
function asArray2(val) {
  return Array.isArray(val) ? val : [val];
}
function advanceCursor(cursor, collect, pos) {
  while (cursor.value && cursor.from <= pos) {
    if (cursor.from == pos)
      collect.push(cursor.value);
    cursor.next();
  }
}
var UpdateContext = class {
  constructor(gutter2, viewport) {
    this.gutter = gutter2;
    this.localMarkers = [];
    this.i = 0;
    this.height = 0;
    this.cursor = RangeSet.iter(gutter2.markers, viewport.from);
  }
  line(view, line, extraMarkers) {
    if (this.localMarkers.length)
      this.localMarkers = [];
    advanceCursor(this.cursor, this.localMarkers, line.from);
    let localMarkers = extraMarkers.length ? this.localMarkers.concat(extraMarkers) : this.localMarkers;
    let forLine = this.gutter.config.lineMarker(view, line, localMarkers);
    if (forLine)
      localMarkers.unshift(forLine);
    let gutter2 = this.gutter;
    if (localMarkers.length == 0 && !gutter2.config.renderEmptyElements)
      return;
    let above = line.top - this.height;
    if (this.i == gutter2.elements.length) {
      let newElt = new GutterElement(view, line.height, above, localMarkers);
      gutter2.elements.push(newElt);
      gutter2.dom.appendChild(newElt.dom);
    } else {
      let elt = gutter2.elements[this.i];
      if (sameMarkers(localMarkers, elt.markers))
        localMarkers = elt.markers;
      elt.update(view, line.height, above, localMarkers);
    }
    this.height = line.bottom;
    this.i++;
  }
  finish() {
    let gutter2 = this.gutter;
    while (gutter2.elements.length > this.i)
      gutter2.dom.removeChild(gutter2.elements.pop().dom);
  }
};
var SingleGutterView = class {
  constructor(view, config2) {
    this.view = view;
    this.config = config2;
    this.elements = [];
    this.spacer = null;
    this.dom = document.createElement("div");
    this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let prop in config2.domEventHandlers) {
      this.dom.addEventListener(prop, (event) => {
        let line = view.visualLineAtHeight(event.clientY, view.contentDOM.getBoundingClientRect().top);
        if (config2.domEventHandlers[prop](view, line, event))
          event.preventDefault();
      });
    }
    this.markers = asArray2(config2.markers(view));
    if (config2.initialSpacer) {
      this.spacer = new GutterElement(view, 0, 0, [config2.initialSpacer(view)]);
      this.dom.appendChild(this.spacer.dom);
      this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none";
    }
  }
  update(update) {
    let prevMarkers = this.markers;
    this.markers = asArray2(this.config.markers(update.view));
    if (this.spacer && this.config.updateSpacer) {
      let updated = this.config.updateSpacer(this.spacer.markers[0], update);
      if (updated != this.spacer.markers[0])
        this.spacer.update(update.view, 0, 0, [updated]);
    }
    let vp = update.view.viewport;
    return !RangeSet.eq(this.markers, prevMarkers, vp.from, vp.to);
  }
};
var GutterElement = class {
  constructor(view, height, above, markers) {
    this.height = -1;
    this.above = 0;
    this.dom = document.createElement("div");
    this.update(view, height, above, markers);
  }
  update(view, height, above, markers) {
    if (this.height != height)
      this.dom.style.height = (this.height = height) + "px";
    if (this.above != above)
      this.dom.style.marginTop = (this.above = above) ? above + "px" : "";
    if (this.markers != markers) {
      this.markers = markers;
      for (let ch; ch = this.dom.lastChild; )
        ch.remove();
      let cls = "cm-gutterElement";
      for (let m of markers) {
        if (m.toDOM)
          this.dom.appendChild(m.toDOM(view));
        let c = m.elementClass;
        if (c)
          cls += " " + c;
      }
      this.dom.className = cls;
    }
  }
};
function sameMarkers(a, b) {
  if (a.length != b.length)
    return false;
  for (let i = 0; i < a.length; i++)
    if (!a[i].compare(b[i]))
      return false;
  return true;
}
var lineNumberMarkers = /* @__PURE__ */ Facet.define();
var lineNumberConfig = /* @__PURE__ */ Facet.define({
  combine(values) {
    return combineConfig(values, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(a, b) {
        let result = Object.assign({}, a);
        for (let event in b) {
          let exists = result[event], add2 = b[event];
          result[event] = exists ? (view, line, event2) => exists(view, line, event2) || add2(view, line, event2) : add2;
        }
        return result;
      }
    });
  }
});
var NumberMarker = class extends GutterMarker {
  constructor(number2) {
    super();
    this.number = number2;
  }
  eq(other) {
    return this.number == other.number;
  }
  toDOM(_view) {
    return document.createTextNode(this.number);
  }
};
function formatNumber(view, number2) {
  return view.state.facet(lineNumberConfig).formatNumber(number2, view.state);
}
var lineNumberGutter = /* @__PURE__ */ activeGutters.compute([lineNumberConfig], (state) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: false,
  markers(view) {
    return view.state.facet(lineNumberMarkers);
  },
  lineMarker(view, line, others) {
    if (others.some((m) => m.toDOM))
      return null;
    return new NumberMarker(formatNumber(view, view.state.doc.lineAt(line.from).number));
  },
  initialSpacer(view) {
    return new NumberMarker(formatNumber(view, maxLineNumber(view.state.doc.lines)));
  },
  updateSpacer(spacer, update) {
    let max = formatNumber(update.view, maxLineNumber(update.view.state.doc.lines));
    return max == spacer.number ? spacer : new NumberMarker(max);
  },
  domEventHandlers: state.facet(lineNumberConfig).domEventHandlers
}));
function lineNumbers(config2 = {}) {
  return [
    lineNumberConfig.of(config2),
    gutters(),
    lineNumberGutter
  ];
}
function maxLineNumber(lines) {
  let last = 9;
  while (last < lines)
    last = last * 10 + 9;
  return last;
}

// node_modules/@codemirror/history/dist/index.js
var fromHistory = /* @__PURE__ */ Annotation.define();
var isolateHistory = /* @__PURE__ */ Annotation.define();
var invertedEffects = /* @__PURE__ */ Facet.define();
var historyConfig = /* @__PURE__ */ Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      minDepth: 100,
      newGroupDelay: 500
    }, { minDepth: Math.max, newGroupDelay: Math.min });
  }
});
var historyField_ = /* @__PURE__ */ StateField.define({
  create() {
    return HistoryState.empty;
  },
  update(state, tr) {
    let config2 = tr.state.facet(historyConfig);
    let fromHist = tr.annotation(fromHistory);
    if (fromHist) {
      let item = HistEvent.fromTransaction(tr), from = fromHist.side;
      let other = from == 0 ? state.undone : state.done;
      if (item)
        other = updateBranch(other, other.length, config2.minDepth, item);
      else
        other = addSelection(other, tr.startState.selection);
      return new HistoryState(from == 0 ? fromHist.rest : other, from == 0 ? other : fromHist.rest);
    }
    let isolate = tr.annotation(isolateHistory);
    if (isolate == "full" || isolate == "before")
      state = state.isolate();
    if (tr.annotation(Transaction.addToHistory) === false)
      return !tr.changes.empty ? state.addMapping(tr.changes.desc) : state;
    let event = HistEvent.fromTransaction(tr);
    let time = tr.annotation(Transaction.time), userEvent = tr.annotation(Transaction.userEvent);
    if (event)
      state = state.addChanges(event, time, userEvent, config2.newGroupDelay, config2.minDepth);
    else if (tr.selection)
      state = state.addSelection(tr.startState.selection, time, userEvent, config2.newGroupDelay);
    if (isolate == "full" || isolate == "after")
      state = state.isolate();
    return state;
  },
  toJSON(value) {
    return { done: value.done.map((e) => e.toJSON()), undone: value.undone.map((e) => e.toJSON()) };
  },
  fromJSON(json) {
    return new HistoryState(json.done.map(HistEvent.fromJSON), json.undone.map(HistEvent.fromJSON));
  }
});
function history(config2 = {}) {
  return [
    historyField_,
    historyConfig.of(config2),
    EditorView.domEventHandlers({
      beforeinput(e, view) {
        if (e.inputType == "historyUndo")
          return undo(view);
        if (e.inputType == "historyRedo")
          return redo(view);
        return false;
      }
    })
  ];
}
function cmd(side, selection) {
  return function({ state, dispatch }) {
    let historyState = state.field(historyField_, false);
    if (!historyState)
      return false;
    let tr = historyState.pop(side, state, selection);
    if (!tr)
      return false;
    dispatch(tr);
    return true;
  };
}
var undo = /* @__PURE__ */ cmd(0, false);
var redo = /* @__PURE__ */ cmd(1, false);
var undoSelection = /* @__PURE__ */ cmd(0, true);
var redoSelection = /* @__PURE__ */ cmd(1, true);
var HistEvent = class {
  constructor(changes, effects, mapped, startSelection, selectionsAfter) {
    this.changes = changes;
    this.effects = effects;
    this.mapped = mapped;
    this.startSelection = startSelection;
    this.selectionsAfter = selectionsAfter;
  }
  setSelAfter(after) {
    return new HistEvent(this.changes, this.effects, this.mapped, this.startSelection, after);
  }
  toJSON() {
    var _a, _b, _c;
    return {
      changes: (_a = this.changes) === null || _a === void 0 ? void 0 : _a.toJSON(),
      mapped: (_b = this.mapped) === null || _b === void 0 ? void 0 : _b.toJSON(),
      startSelection: (_c = this.startSelection) === null || _c === void 0 ? void 0 : _c.toJSON(),
      selectionsAfter: this.selectionsAfter.map((s) => s.toJSON())
    };
  }
  static fromJSON(json) {
    return new HistEvent(json.changes && ChangeSet.fromJSON(json.changes), [], json.mapped && ChangeDesc.fromJSON(json.mapped), json.startSelection && EditorSelection.fromJSON(json.startSelection), json.selectionsAfter.map(EditorSelection.fromJSON));
  }
  static fromTransaction(tr) {
    let effects = none4;
    for (let invert of tr.startState.facet(invertedEffects)) {
      let result = invert(tr);
      if (result.length)
        effects = effects.concat(result);
    }
    if (!effects.length && tr.changes.empty)
      return null;
    return new HistEvent(tr.changes.invert(tr.startState.doc), effects, void 0, tr.startState.selection, none4);
  }
  static selection(selections) {
    return new HistEvent(void 0, none4, void 0, void 0, selections);
  }
};
function updateBranch(branch, to, maxLen, newEvent) {
  let start = to + 1 > maxLen + 20 ? to - maxLen - 1 : 0;
  let newBranch = branch.slice(start, to);
  newBranch.push(newEvent);
  return newBranch;
}
function isAdjacent(a, b) {
  let ranges = [], isAdjacent2 = false;
  a.iterChangedRanges((f, t2) => ranges.push(f, t2));
  b.iterChangedRanges((_f, _t, f, t2) => {
    for (let i = 0; i < ranges.length; ) {
      let from = ranges[i++], to = ranges[i++];
      if (t2 >= from && f <= to)
        isAdjacent2 = true;
    }
  });
  return isAdjacent2;
}
function eqSelectionShape(a, b) {
  return a.ranges.length == b.ranges.length && a.ranges.filter((r, i) => r.empty != b.ranges[i].empty).length === 0;
}
function conc(a, b) {
  return !a.length ? b : !b.length ? a : a.concat(b);
}
var none4 = [];
var MaxSelectionsPerEvent = 200;
function addSelection(branch, selection) {
  if (!branch.length) {
    return [HistEvent.selection([selection])];
  } else {
    let lastEvent = branch[branch.length - 1];
    let sels = lastEvent.selectionsAfter.slice(Math.max(0, lastEvent.selectionsAfter.length - MaxSelectionsPerEvent));
    if (sels.length && sels[sels.length - 1].eq(selection))
      return branch;
    sels.push(selection);
    return updateBranch(branch, branch.length - 1, 1e9, lastEvent.setSelAfter(sels));
  }
}
function popSelection(branch) {
  let last = branch[branch.length - 1];
  let newBranch = branch.slice();
  newBranch[branch.length - 1] = last.setSelAfter(last.selectionsAfter.slice(0, last.selectionsAfter.length - 1));
  return newBranch;
}
function addMappingToBranch(branch, mapping) {
  if (!branch.length)
    return branch;
  let length = branch.length, selections = none4;
  while (length) {
    let event = mapEvent(branch[length - 1], mapping, selections);
    if (event.changes && !event.changes.empty || event.effects.length) {
      let result = branch.slice(0, length);
      result[length - 1] = event;
      return result;
    } else {
      mapping = event.mapped;
      length--;
      selections = event.selectionsAfter;
    }
  }
  return selections.length ? [HistEvent.selection(selections)] : none4;
}
function mapEvent(event, mapping, extraSelections) {
  let selections = conc(event.selectionsAfter.length ? event.selectionsAfter.map((s) => s.map(mapping)) : none4, extraSelections);
  if (!event.changes)
    return HistEvent.selection(selections);
  let mappedChanges = event.changes.map(mapping), before = mapping.mapDesc(event.changes, true);
  let fullMapping = event.mapped ? event.mapped.composeDesc(before) : before;
  return new HistEvent(mappedChanges, StateEffect.mapEffects(event.effects, mapping), fullMapping, event.startSelection.map(before), selections);
}
var HistoryState = class {
  constructor(done, undone, prevTime = 0, prevUserEvent = void 0) {
    this.done = done;
    this.undone = undone;
    this.prevTime = prevTime;
    this.prevUserEvent = prevUserEvent;
  }
  isolate() {
    return this.prevTime ? new HistoryState(this.done, this.undone) : this;
  }
  addChanges(event, time, userEvent, newGroupDelay, maxLen) {
    let done = this.done, lastEvent = done[done.length - 1];
    if (lastEvent && lastEvent.changes && !lastEvent.changes.empty && event.changes && (!lastEvent.selectionsAfter.length && time - this.prevTime < newGroupDelay && isAdjacent(lastEvent.changes, event.changes) || userEvent == "input.type.compose")) {
      done = updateBranch(done, done.length - 1, maxLen, new HistEvent(event.changes.compose(lastEvent.changes), conc(event.effects, lastEvent.effects), lastEvent.mapped, lastEvent.startSelection, none4));
    } else {
      done = updateBranch(done, done.length, maxLen, event);
    }
    return new HistoryState(done, none4, time, userEvent);
  }
  addSelection(selection, time, userEvent, newGroupDelay) {
    let last = this.done.length ? this.done[this.done.length - 1].selectionsAfter : none4;
    if (last.length > 0 && time - this.prevTime < newGroupDelay && userEvent == this.prevUserEvent && userEvent && /^select($|\.)/.test(userEvent) && eqSelectionShape(last[last.length - 1], selection))
      return this;
    return new HistoryState(addSelection(this.done, selection), this.undone, time, userEvent);
  }
  addMapping(mapping) {
    return new HistoryState(addMappingToBranch(this.done, mapping), addMappingToBranch(this.undone, mapping), this.prevTime, this.prevUserEvent);
  }
  pop(side, state, selection) {
    let branch = side == 0 ? this.done : this.undone;
    if (branch.length == 0)
      return null;
    let event = branch[branch.length - 1];
    if (selection && event.selectionsAfter.length) {
      return state.update({
        selection: event.selectionsAfter[event.selectionsAfter.length - 1],
        annotations: fromHistory.of({ side, rest: popSelection(branch) }),
        userEvent: side == 0 ? "select.undo" : "select.redo"
      });
    } else if (!event.changes) {
      return null;
    } else {
      let rest = branch.length == 1 ? none4 : branch.slice(0, branch.length - 1);
      if (event.mapped)
        rest = addMappingToBranch(rest, event.mapped);
      return state.update({
        changes: event.changes,
        selection: event.startSelection,
        effects: event.effects,
        annotations: fromHistory.of({ side, rest }),
        filter: false,
        userEvent: side == 0 ? "undo" : "redo"
      });
    }
  }
};
HistoryState.empty = /* @__PURE__ */ new HistoryState(none4, none4);
var historyKeymap = [
  { key: "Mod-z", run: undo, preventDefault: true },
  { key: "Mod-y", mac: "Mod-Shift-z", run: redo, preventDefault: true },
  { key: "Mod-u", run: undoSelection, preventDefault: true },
  { key: "Alt-u", mac: "Mod-Shift-u", run: redoSelection, preventDefault: true }
];

// node_modules/@codemirror/matchbrackets/dist/index.js
var baseTheme5 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-matchingBracket": { color: "#0b0" },
  ".cm-nonmatchingBracket": { color: "#a22" }
});
var DefaultScanDist = 1e4;
var DefaultBrackets = "()[]{}";
var bracketMatchingConfig = /* @__PURE__ */ Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      afterCursor: true,
      brackets: DefaultBrackets,
      maxScanDistance: DefaultScanDist
    });
  }
});
var matchingMark = /* @__PURE__ */ Decoration.mark({ class: "cm-matchingBracket" });
var nonmatchingMark = /* @__PURE__ */ Decoration.mark({ class: "cm-nonmatchingBracket" });
var bracketMatchingState = /* @__PURE__ */ StateField.define({
  create() {
    return Decoration.none;
  },
  update(deco, tr) {
    if (!tr.docChanged && !tr.selection)
      return deco;
    let decorations2 = [];
    let config2 = tr.state.facet(bracketMatchingConfig);
    for (let range of tr.state.selection.ranges) {
      if (!range.empty)
        continue;
      let match = matchBrackets(tr.state, range.head, -1, config2) || range.head > 0 && matchBrackets(tr.state, range.head - 1, 1, config2) || config2.afterCursor && (matchBrackets(tr.state, range.head, 1, config2) || range.head < tr.state.doc.length && matchBrackets(tr.state, range.head + 1, -1, config2));
      if (!match)
        continue;
      let mark = match.matched ? matchingMark : nonmatchingMark;
      decorations2.push(mark.range(match.start.from, match.start.to));
      if (match.end)
        decorations2.push(mark.range(match.end.from, match.end.to));
    }
    return Decoration.set(decorations2, true);
  },
  provide: (f) => EditorView.decorations.from(f)
});
var bracketMatchingUnique = [
  bracketMatchingState,
  baseTheme5
];
function bracketMatching(config2 = {}) {
  return [bracketMatchingConfig.of(config2), bracketMatchingUnique];
}
function matchingNodes(node, dir, brackets) {
  let byProp = node.prop(dir < 0 ? NodeProp.openedBy : NodeProp.closedBy);
  if (byProp)
    return byProp;
  if (node.name.length == 1) {
    let index = brackets.indexOf(node.name);
    if (index > -1 && index % 2 == (dir < 0 ? 1 : 0))
      return [brackets[index + dir]];
  }
  return null;
}
function matchBrackets(state, pos, dir, config2 = {}) {
  let maxScanDistance = config2.maxScanDistance || DefaultScanDist, brackets = config2.brackets || DefaultBrackets;
  let tree = syntaxTree(state), sub = tree.resolve(pos, dir), matches;
  if (matches = matchingNodes(sub.type, dir, brackets))
    return matchMarkedBrackets(state, pos, dir, sub, matches, brackets);
  else
    return matchPlainBrackets(state, pos, dir, tree, sub.type, maxScanDistance, brackets);
}
function matchMarkedBrackets(_state, _pos, dir, token, matching, brackets) {
  let parent = token.parent, firstToken = { from: token.from, to: token.to };
  let depth = 0, cursor = parent === null || parent === void 0 ? void 0 : parent.cursor;
  if (cursor && (dir < 0 ? cursor.childBefore(token.from) : cursor.childAfter(token.to)))
    do {
      if (dir < 0 ? cursor.to <= token.from : cursor.from >= token.to) {
        if (depth == 0 && matching.indexOf(cursor.type.name) > -1) {
          return { start: firstToken, end: { from: cursor.from, to: cursor.to }, matched: true };
        } else if (matchingNodes(cursor.type, dir, brackets)) {
          depth++;
        } else if (matchingNodes(cursor.type, -dir, brackets)) {
          depth--;
          if (depth == 0)
            return { start: firstToken, end: { from: cursor.from, to: cursor.to }, matched: false };
        }
      }
    } while (dir < 0 ? cursor.prevSibling() : cursor.nextSibling());
  return { start: firstToken, matched: false };
}
function matchPlainBrackets(state, pos, dir, tree, tokenType, maxScanDistance, brackets) {
  let startCh = dir < 0 ? state.sliceDoc(pos - 1, pos) : state.sliceDoc(pos, pos + 1);
  let bracket2 = brackets.indexOf(startCh);
  if (bracket2 < 0 || bracket2 % 2 == 0 != dir > 0)
    return null;
  let startToken = { from: dir < 0 ? pos - 1 : pos, to: dir > 0 ? pos + 1 : pos };
  let iter = state.doc.iterRange(pos, dir > 0 ? state.doc.length : 0), depth = 0;
  for (let distance = 0; !iter.next().done && distance <= maxScanDistance; ) {
    let text = iter.value;
    if (dir < 0)
      distance += text.length;
    let basePos = pos + distance * dir;
    for (let pos2 = dir > 0 ? 0 : text.length - 1, end = dir > 0 ? text.length : -1; pos2 != end; pos2 += dir) {
      let found = brackets.indexOf(text[pos2]);
      if (found < 0 || tree.resolve(basePos + pos2, 1).type != tokenType)
        continue;
      if (found % 2 == 0 == dir > 0) {
        depth++;
      } else if (depth == 1) {
        return { start: startToken, end: { from: basePos + pos2, to: basePos + pos2 + 1 }, matched: found >> 1 == bracket2 >> 1 };
      } else {
        depth--;
      }
    }
    if (dir > 0)
      distance += text.length;
  }
  return iter.done ? { start: startToken, matched: false } : null;
}

// node_modules/@codemirror/commands/dist/index.js
function updateSel(sel, by) {
  return EditorSelection.create(sel.ranges.map(by), sel.mainIndex);
}
function setSel(state, selection) {
  return state.update({ selection, scrollIntoView: true, userEvent: "select" });
}
function moveSel({ state, dispatch }, how) {
  let selection = updateSel(state.selection, how);
  if (selection.eq(state.selection))
    return false;
  dispatch(setSel(state, selection));
  return true;
}
function rangeEnd(range, forward) {
  return EditorSelection.cursor(forward ? range.to : range.from);
}
function cursorByChar(view, forward) {
  return moveSel(view, (range) => range.empty ? view.moveByChar(range, forward) : rangeEnd(range, forward));
}
var cursorCharLeft = (view) => cursorByChar(view, view.textDirection != Direction.LTR);
var cursorCharRight = (view) => cursorByChar(view, view.textDirection == Direction.LTR);
function cursorByGroup(view, forward) {
  return moveSel(view, (range) => range.empty ? view.moveByGroup(range, forward) : rangeEnd(range, forward));
}
var cursorGroupLeft = (view) => cursorByGroup(view, view.textDirection != Direction.LTR);
var cursorGroupRight = (view) => cursorByGroup(view, view.textDirection == Direction.LTR);
function interestingNode(state, node, bracketProp) {
  if (node.type.prop(bracketProp))
    return true;
  let len = node.to - node.from;
  return len && (len > 2 || /[^\s,.;:]/.test(state.sliceDoc(node.from, node.to))) || node.firstChild;
}
function moveBySyntax(state, start, forward) {
  let pos = syntaxTree(state).resolveInner(start.head);
  let bracketProp = forward ? NodeProp.closedBy : NodeProp.openedBy;
  for (let at = start.head; ; ) {
    let next = forward ? pos.childAfter(at) : pos.childBefore(at);
    if (!next)
      break;
    if (interestingNode(state, next, bracketProp))
      pos = next;
    else
      at = forward ? next.to : next.from;
  }
  let bracket2 = pos.type.prop(bracketProp), match, newPos;
  if (bracket2 && (match = forward ? matchBrackets(state, pos.from, 1) : matchBrackets(state, pos.to, -1)) && match.matched)
    newPos = forward ? match.end.to : match.end.from;
  else
    newPos = forward ? pos.to : pos.from;
  return EditorSelection.cursor(newPos, forward ? -1 : 1);
}
var cursorSyntaxLeft = (view) => moveSel(view, (range) => moveBySyntax(view.state, range, view.textDirection != Direction.LTR));
var cursorSyntaxRight = (view) => moveSel(view, (range) => moveBySyntax(view.state, range, view.textDirection == Direction.LTR));
function cursorByLine(view, forward) {
  return moveSel(view, (range) => {
    if (!range.empty)
      return rangeEnd(range, forward);
    let moved = view.moveVertically(range, forward);
    return moved.head != range.head ? moved : view.moveToLineBoundary(range, forward);
  });
}
var cursorLineUp = (view) => cursorByLine(view, false);
var cursorLineDown = (view) => cursorByLine(view, true);
function cursorByPage(view, forward) {
  return moveSel(view, (range) => range.empty ? view.moveVertically(range, forward, view.dom.clientHeight) : rangeEnd(range, forward));
}
var cursorPageUp = (view) => cursorByPage(view, false);
var cursorPageDown = (view) => cursorByPage(view, true);
function moveByLineBoundary(view, start, forward) {
  let line = view.visualLineAt(start.head), moved = view.moveToLineBoundary(start, forward);
  if (moved.head == start.head && moved.head != (forward ? line.to : line.from))
    moved = view.moveToLineBoundary(start, forward, false);
  if (!forward && moved.head == line.from && line.length) {
    let space = /^\s*/.exec(view.state.sliceDoc(line.from, Math.min(line.from + 100, line.to)))[0].length;
    if (space && start.head != line.from + space)
      moved = EditorSelection.cursor(line.from + space);
  }
  return moved;
}
var cursorLineBoundaryForward = (view) => moveSel(view, (range) => moveByLineBoundary(view, range, true));
var cursorLineBoundaryBackward = (view) => moveSel(view, (range) => moveByLineBoundary(view, range, false));
var cursorLineStart = (view) => moveSel(view, (range) => EditorSelection.cursor(view.visualLineAt(range.head).from, 1));
var cursorLineEnd = (view) => moveSel(view, (range) => EditorSelection.cursor(view.visualLineAt(range.head).to, -1));
function toMatchingBracket(state, dispatch, extend2) {
  let found = false, selection = updateSel(state.selection, (range) => {
    let matching = matchBrackets(state, range.head, -1) || matchBrackets(state, range.head, 1) || range.head > 0 && matchBrackets(state, range.head - 1, 1) || range.head < state.doc.length && matchBrackets(state, range.head + 1, -1);
    if (!matching || !matching.end)
      return range;
    found = true;
    let head = matching.start.from == range.head ? matching.end.to : matching.end.from;
    return extend2 ? EditorSelection.range(range.anchor, head) : EditorSelection.cursor(head);
  });
  if (!found)
    return false;
  dispatch(setSel(state, selection));
  return true;
}
var cursorMatchingBracket = ({ state, dispatch }) => toMatchingBracket(state, dispatch, false);
function extendSel(view, how) {
  let selection = updateSel(view.state.selection, (range) => {
    let head = how(range);
    return EditorSelection.range(range.anchor, head.head, head.goalColumn);
  });
  if (selection.eq(view.state.selection))
    return false;
  view.dispatch(setSel(view.state, selection));
  return true;
}
function selectByChar(view, forward) {
  return extendSel(view, (range) => view.moveByChar(range, forward));
}
var selectCharLeft = (view) => selectByChar(view, view.textDirection != Direction.LTR);
var selectCharRight = (view) => selectByChar(view, view.textDirection == Direction.LTR);
function selectByGroup(view, forward) {
  return extendSel(view, (range) => view.moveByGroup(range, forward));
}
var selectGroupLeft = (view) => selectByGroup(view, view.textDirection != Direction.LTR);
var selectGroupRight = (view) => selectByGroup(view, view.textDirection == Direction.LTR);
var selectSyntaxLeft = (view) => extendSel(view, (range) => moveBySyntax(view.state, range, view.textDirection != Direction.LTR));
var selectSyntaxRight = (view) => extendSel(view, (range) => moveBySyntax(view.state, range, view.textDirection == Direction.LTR));
function selectByLine(view, forward) {
  return extendSel(view, (range) => view.moveVertically(range, forward));
}
var selectLineUp = (view) => selectByLine(view, false);
var selectLineDown = (view) => selectByLine(view, true);
function selectByPage(view, forward) {
  return extendSel(view, (range) => view.moveVertically(range, forward, view.dom.clientHeight));
}
var selectPageUp = (view) => selectByPage(view, false);
var selectPageDown = (view) => selectByPage(view, true);
var selectLineBoundaryForward = (view) => extendSel(view, (range) => moveByLineBoundary(view, range, true));
var selectLineBoundaryBackward = (view) => extendSel(view, (range) => moveByLineBoundary(view, range, false));
var selectLineStart = (view) => extendSel(view, (range) => EditorSelection.cursor(view.visualLineAt(range.head).from));
var selectLineEnd = (view) => extendSel(view, (range) => EditorSelection.cursor(view.visualLineAt(range.head).to));
var cursorDocStart = ({ state, dispatch }) => {
  dispatch(setSel(state, { anchor: 0 }));
  return true;
};
var cursorDocEnd = ({ state, dispatch }) => {
  dispatch(setSel(state, { anchor: state.doc.length }));
  return true;
};
var selectDocStart = ({ state, dispatch }) => {
  dispatch(setSel(state, { anchor: state.selection.main.anchor, head: 0 }));
  return true;
};
var selectDocEnd = ({ state, dispatch }) => {
  dispatch(setSel(state, { anchor: state.selection.main.anchor, head: state.doc.length }));
  return true;
};
var selectAll = ({ state, dispatch }) => {
  dispatch(state.update({ selection: { anchor: 0, head: state.doc.length }, userEvent: "select" }));
  return true;
};
var selectLine = ({ state, dispatch }) => {
  let ranges = selectedLineBlocks(state).map(({ from, to }) => EditorSelection.range(from, Math.min(to + 1, state.doc.length)));
  dispatch(state.update({ selection: EditorSelection.create(ranges), userEvent: "select" }));
  return true;
};
var selectParentSyntax = ({ state, dispatch }) => {
  let selection = updateSel(state.selection, (range) => {
    var _a;
    let context = syntaxTree(state).resolveInner(range.head, 1);
    while (!(context.from < range.from && context.to >= range.to || context.to > range.to && context.from <= range.from || !((_a = context.parent) === null || _a === void 0 ? void 0 : _a.parent)))
      context = context.parent;
    return EditorSelection.range(context.to, context.from);
  });
  dispatch(setSel(state, selection));
  return true;
};
var simplifySelection = ({ state, dispatch }) => {
  let cur2 = state.selection, selection = null;
  if (cur2.ranges.length > 1)
    selection = EditorSelection.create([cur2.main]);
  else if (!cur2.main.empty)
    selection = EditorSelection.create([EditorSelection.cursor(cur2.main.head)]);
  if (!selection)
    return false;
  dispatch(setSel(state, selection));
  return true;
};
function deleteBy({ state, dispatch }, by) {
  if (state.readOnly)
    return false;
  let event = "delete.selection";
  let changes = state.changeByRange((range) => {
    let { from, to } = range;
    if (from == to) {
      let towards = by(from);
      if (towards < from)
        event = "delete.backward";
      else if (towards > from)
        event = "delete.forward";
      from = Math.min(from, towards);
      to = Math.max(to, towards);
    }
    return from == to ? { range } : { changes: { from, to }, range: EditorSelection.cursor(from) };
  });
  if (changes.changes.empty)
    return false;
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: event }));
  return true;
}
function skipAtomic(target, pos, forward) {
  if (target instanceof EditorView)
    for (let ranges of target.pluginField(PluginField.atomicRanges))
      ranges.between(pos, pos, (from, to) => {
        if (from < pos && to > pos)
          pos = forward ? to : from;
      });
  return pos;
}
var deleteByChar = (target, forward) => deleteBy(target, (pos) => {
  let { state } = target, line = state.doc.lineAt(pos), before, targetPos;
  if (!forward && pos > line.from && pos < line.from + 200 && !/[^ \t]/.test(before = line.text.slice(0, pos - line.from))) {
    if (before[before.length - 1] == "	")
      return pos - 1;
    let col = countColumn(before, state.tabSize), drop = col % getIndentUnit(state) || getIndentUnit(state);
    for (let i = 0; i < drop && before[before.length - 1 - i] == " "; i++)
      pos--;
    targetPos = pos;
  } else {
    targetPos = findClusterBreak(line.text, pos - line.from, forward) + line.from;
    if (targetPos == pos && line.number != (forward ? state.doc.lines : 1))
      targetPos += forward ? 1 : -1;
  }
  return skipAtomic(target, targetPos, forward);
});
var deleteCharBackward = (view) => deleteByChar(view, false);
var deleteCharForward = (view) => deleteByChar(view, true);
var deleteByGroup = (target, forward) => deleteBy(target, (start) => {
  let pos = start, { state } = target, line = state.doc.lineAt(pos);
  let categorize = state.charCategorizer(pos);
  for (let cat = null; ; ) {
    if (pos == (forward ? line.to : line.from)) {
      if (pos == start && line.number != (forward ? state.doc.lines : 1))
        pos += forward ? 1 : -1;
      break;
    }
    let next = findClusterBreak(line.text, pos - line.from, forward) + line.from;
    let nextChar2 = line.text.slice(Math.min(pos, next) - line.from, Math.max(pos, next) - line.from);
    let nextCat = categorize(nextChar2);
    if (cat != null && nextCat != cat)
      break;
    if (nextChar2 != " " || pos != start)
      cat = nextCat;
    pos = next;
  }
  return skipAtomic(target, pos, forward);
});
var deleteGroupBackward = (target) => deleteByGroup(target, false);
var deleteGroupForward = (target) => deleteByGroup(target, true);
var deleteToLineEnd = (view) => deleteBy(view, (pos) => {
  let lineEnd = view.visualLineAt(pos).to;
  return skipAtomic(view, pos < lineEnd ? lineEnd : Math.min(view.state.doc.length, pos + 1), true);
});
var deleteToLineStart = (view) => deleteBy(view, (pos) => {
  let lineStart = view.visualLineAt(pos).from;
  return skipAtomic(view, pos > lineStart ? lineStart : Math.max(0, pos - 1), false);
});
var splitLine = ({ state, dispatch }) => {
  if (state.readOnly)
    return false;
  let changes = state.changeByRange((range) => {
    return {
      changes: { from: range.from, to: range.to, insert: Text.of(["", ""]) },
      range: EditorSelection.cursor(range.from)
    };
  });
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "input" }));
  return true;
};
var transposeChars = ({ state, dispatch }) => {
  if (state.readOnly)
    return false;
  let changes = state.changeByRange((range) => {
    if (!range.empty || range.from == 0 || range.from == state.doc.length)
      return { range };
    let pos = range.from, line = state.doc.lineAt(pos);
    let from = pos == line.from ? pos - 1 : findClusterBreak(line.text, pos - line.from, false) + line.from;
    let to = pos == line.to ? pos + 1 : findClusterBreak(line.text, pos - line.from, true) + line.from;
    return {
      changes: { from, to, insert: state.doc.slice(pos, to).append(state.doc.slice(from, pos)) },
      range: EditorSelection.cursor(to)
    };
  });
  if (changes.changes.empty)
    return false;
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "move.character" }));
  return true;
};
function selectedLineBlocks(state) {
  let blocks = [], upto = -1;
  for (let range of state.selection.ranges) {
    let startLine = state.doc.lineAt(range.from), endLine = state.doc.lineAt(range.to);
    if (!range.empty && range.to == endLine.from)
      endLine = state.doc.lineAt(range.to - 1);
    if (upto >= startLine.number) {
      let prev = blocks[blocks.length - 1];
      prev.to = endLine.to;
      prev.ranges.push(range);
    } else {
      blocks.push({ from: startLine.from, to: endLine.to, ranges: [range] });
    }
    upto = endLine.number + 1;
  }
  return blocks;
}
function moveLine(state, dispatch, forward) {
  if (state.readOnly)
    return false;
  let changes = [], ranges = [];
  for (let block of selectedLineBlocks(state)) {
    if (forward ? block.to == state.doc.length : block.from == 0)
      continue;
    let nextLine = state.doc.lineAt(forward ? block.to + 1 : block.from - 1);
    let size = nextLine.length + 1;
    if (forward) {
      changes.push({ from: block.to, to: nextLine.to }, { from: block.from, insert: nextLine.text + state.lineBreak });
      for (let r of block.ranges)
        ranges.push(EditorSelection.range(Math.min(state.doc.length, r.anchor + size), Math.min(state.doc.length, r.head + size)));
    } else {
      changes.push({ from: nextLine.from, to: block.from }, { from: block.to, insert: state.lineBreak + nextLine.text });
      for (let r of block.ranges)
        ranges.push(EditorSelection.range(r.anchor - size, r.head - size));
    }
  }
  if (!changes.length)
    return false;
  dispatch(state.update({
    changes,
    scrollIntoView: true,
    selection: EditorSelection.create(ranges, state.selection.mainIndex),
    userEvent: "move.line"
  }));
  return true;
}
var moveLineUp = ({ state, dispatch }) => moveLine(state, dispatch, false);
var moveLineDown = ({ state, dispatch }) => moveLine(state, dispatch, true);
function copyLine(state, dispatch, forward) {
  if (state.readOnly)
    return false;
  let changes = [];
  for (let block of selectedLineBlocks(state)) {
    if (forward)
      changes.push({ from: block.from, insert: state.doc.slice(block.from, block.to) + state.lineBreak });
    else
      changes.push({ from: block.to, insert: state.lineBreak + state.doc.slice(block.from, block.to) });
  }
  dispatch(state.update({ changes, scrollIntoView: true, userEvent: "input.copyline" }));
  return true;
}
var copyLineUp = ({ state, dispatch }) => copyLine(state, dispatch, false);
var copyLineDown = ({ state, dispatch }) => copyLine(state, dispatch, true);
var deleteLine = (view) => {
  if (view.state.readOnly)
    return false;
  let { state } = view, changes = state.changes(selectedLineBlocks(state).map(({ from, to }) => {
    if (from > 0)
      from--;
    else if (to < state.doc.length)
      to++;
    return { from, to };
  }));
  let selection = updateSel(state.selection, (range) => view.moveVertically(range, true)).map(changes);
  view.dispatch({ changes, selection, scrollIntoView: true, userEvent: "delete.line" });
  return true;
};
function isBetweenBrackets(state, pos) {
  if (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1)))
    return { from: pos, to: pos };
  let context = syntaxTree(state).resolveInner(pos);
  let before = context.childBefore(pos), after = context.childAfter(pos), closedBy;
  if (before && after && before.to <= pos && after.from >= pos && (closedBy = before.type.prop(NodeProp.closedBy)) && closedBy.indexOf(after.name) > -1 && state.doc.lineAt(before.to).from == state.doc.lineAt(after.from).from)
    return { from: before.to, to: after.from };
  return null;
}
var insertNewlineAndIndent = ({ state, dispatch }) => {
  if (state.readOnly)
    return false;
  let changes = state.changeByRange(({ from, to }) => {
    let explode = from == to && isBetweenBrackets(state, from);
    let cx = new IndentContext(state, { simulateBreak: from, simulateDoubleBreak: !!explode });
    let indent = getIndentation(cx, from);
    if (indent == null)
      indent = /^\s*/.exec(state.doc.lineAt(from).text)[0].length;
    let line = state.doc.lineAt(from);
    while (to < line.to && /\s/.test(line.text[to - line.from]))
      to++;
    if (explode)
      ({ from, to } = explode);
    else if (from > line.from && from < line.from + 100 && !/\S/.test(line.text.slice(0, from)))
      from = line.from;
    let insert2 = ["", indentString(state, indent)];
    if (explode)
      insert2.push(indentString(state, cx.lineIndent(line.from, -1)));
    return {
      changes: { from, to, insert: Text.of(insert2) },
      range: EditorSelection.cursor(from + 1 + insert2[1].length)
    };
  });
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "input" }));
  return true;
};
function changeBySelectedLine(state, f) {
  let atLine = -1;
  return state.changeByRange((range) => {
    let changes = [];
    for (let pos = range.from; pos <= range.to; ) {
      let line = state.doc.lineAt(pos);
      if (line.number > atLine && (range.empty || range.to > line.from)) {
        f(line, changes, range);
        atLine = line.number;
      }
      pos = line.to + 1;
    }
    let changeSet = state.changes(changes);
    return {
      changes,
      range: EditorSelection.range(changeSet.mapPos(range.anchor, 1), changeSet.mapPos(range.head, 1))
    };
  });
}
var indentSelection = ({ state, dispatch }) => {
  if (state.readOnly)
    return false;
  let updated = Object.create(null);
  let context = new IndentContext(state, { overrideIndentation: (start) => {
    let found = updated[start];
    return found == null ? -1 : found;
  } });
  let changes = changeBySelectedLine(state, (line, changes2, range) => {
    let indent = getIndentation(context, line.from);
    if (indent == null)
      return;
    if (!/\S/.test(line.text))
      indent = 0;
    let cur2 = /^\s*/.exec(line.text)[0];
    let norm = indentString(state, indent);
    if (cur2 != norm || range.from < line.from + cur2.length) {
      updated[line.from] = indent;
      changes2.push({ from: line.from, to: line.from + cur2.length, insert: norm });
    }
  });
  if (!changes.changes.empty)
    dispatch(state.update(changes, { userEvent: "indent" }));
  return true;
};
var indentMore = ({ state, dispatch }) => {
  if (state.readOnly)
    return false;
  dispatch(state.update(changeBySelectedLine(state, (line, changes) => {
    changes.push({ from: line.from, insert: state.facet(indentUnit) });
  }), { userEvent: "input.indent" }));
  return true;
};
var indentLess = ({ state, dispatch }) => {
  if (state.readOnly)
    return false;
  dispatch(state.update(changeBySelectedLine(state, (line, changes) => {
    let space = /^\s*/.exec(line.text)[0];
    if (!space)
      return;
    let col = countColumn(space, state.tabSize), keep = 0;
    let insert2 = indentString(state, Math.max(0, col - getIndentUnit(state)));
    while (keep < space.length && keep < insert2.length && space.charCodeAt(keep) == insert2.charCodeAt(keep))
      keep++;
    changes.push({ from: line.from + keep, to: line.from + space.length, insert: insert2.slice(keep) });
  }), { userEvent: "delete.dedent" }));
  return true;
};
var emacsStyleKeymap = [
  { key: "Ctrl-b", run: cursorCharLeft, shift: selectCharLeft, preventDefault: true },
  { key: "Ctrl-f", run: cursorCharRight, shift: selectCharRight },
  { key: "Ctrl-p", run: cursorLineUp, shift: selectLineUp },
  { key: "Ctrl-n", run: cursorLineDown, shift: selectLineDown },
  { key: "Ctrl-a", run: cursorLineStart, shift: selectLineStart },
  { key: "Ctrl-e", run: cursorLineEnd, shift: selectLineEnd },
  { key: "Ctrl-d", run: deleteCharForward },
  { key: "Ctrl-h", run: deleteCharBackward },
  { key: "Ctrl-k", run: deleteToLineEnd },
  { key: "Ctrl-Alt-h", run: deleteGroupBackward },
  { key: "Ctrl-o", run: splitLine },
  { key: "Ctrl-t", run: transposeChars },
  { key: "Alt-<", run: cursorDocStart },
  { key: "Alt->", run: cursorDocEnd },
  { key: "Ctrl-v", run: cursorPageDown },
  { key: "Alt-v", run: cursorPageUp }
];
var standardKeymap = /* @__PURE__ */ [
  { key: "ArrowLeft", run: cursorCharLeft, shift: selectCharLeft, preventDefault: true },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: cursorGroupLeft, shift: selectGroupLeft },
  { mac: "Cmd-ArrowLeft", run: cursorLineBoundaryBackward, shift: selectLineBoundaryBackward },
  { key: "ArrowRight", run: cursorCharRight, shift: selectCharRight, preventDefault: true },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: cursorGroupRight, shift: selectGroupRight },
  { mac: "Cmd-ArrowRight", run: cursorLineBoundaryForward, shift: selectLineBoundaryForward },
  { key: "ArrowUp", run: cursorLineUp, shift: selectLineUp, preventDefault: true },
  { mac: "Cmd-ArrowUp", run: cursorDocStart, shift: selectDocStart },
  { mac: "Ctrl-ArrowUp", run: cursorPageUp, shift: selectPageUp },
  { key: "ArrowDown", run: cursorLineDown, shift: selectLineDown, preventDefault: true },
  { mac: "Cmd-ArrowDown", run: cursorDocEnd, shift: selectDocEnd },
  { mac: "Ctrl-ArrowDown", run: cursorPageDown, shift: selectPageDown },
  { key: "PageUp", run: cursorPageUp, shift: selectPageUp },
  { key: "PageDown", run: cursorPageDown, shift: selectPageDown },
  { key: "Home", run: cursorLineBoundaryBackward, shift: selectLineBoundaryBackward },
  { key: "Mod-Home", run: cursorDocStart, shift: selectDocStart },
  { key: "End", run: cursorLineBoundaryForward, shift: selectLineBoundaryForward },
  { key: "Mod-End", run: cursorDocEnd, shift: selectDocEnd },
  { key: "Enter", run: insertNewlineAndIndent },
  { key: "Mod-a", run: selectAll },
  { key: "Backspace", run: deleteCharBackward, shift: deleteCharBackward },
  { key: "Delete", run: deleteCharForward, shift: deleteCharForward },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: deleteGroupBackward },
  { key: "Mod-Delete", mac: "Alt-Delete", run: deleteGroupForward },
  { mac: "Mod-Backspace", run: deleteToLineStart },
  { mac: "Mod-Delete", run: deleteToLineEnd }
].concat(/* @__PURE__ */ emacsStyleKeymap.map((b) => ({ mac: b.key, run: b.run, shift: b.shift })));
var defaultKeymap = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: cursorSyntaxLeft, shift: selectSyntaxLeft },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: cursorSyntaxRight, shift: selectSyntaxRight },
  { key: "Alt-ArrowUp", run: moveLineUp },
  { key: "Shift-Alt-ArrowUp", run: copyLineUp },
  { key: "Alt-ArrowDown", run: moveLineDown },
  { key: "Shift-Alt-ArrowDown", run: copyLineDown },
  { key: "Escape", run: simplifySelection },
  { key: "Alt-l", mac: "Ctrl-l", run: selectLine },
  { key: "Mod-i", run: selectParentSyntax, preventDefault: true },
  { key: "Mod-[", run: indentLess },
  { key: "Mod-]", run: indentMore },
  { key: "Mod-Alt-\\", run: indentSelection },
  { key: "Shift-Mod-k", run: deleteLine },
  { key: "Shift-Mod-\\", run: cursorMatchingBracket }
].concat(standardKeymap);

// node_modules/@codemirror/rectangular-selection/dist/index.js
var MaxOff = 2e3;
function rectangleFor(state, a, b) {
  let startLine = Math.min(a.line, b.line), endLine = Math.max(a.line, b.line);
  let ranges = [];
  if (a.off > MaxOff || b.off > MaxOff || a.col < 0 || b.col < 0) {
    let startOff = Math.min(a.off, b.off), endOff = Math.max(a.off, b.off);
    for (let i = startLine; i <= endLine; i++) {
      let line = state.doc.line(i);
      if (line.length <= endOff)
        ranges.push(EditorSelection.range(line.from + startOff, line.to + endOff));
    }
  } else {
    let startCol = Math.min(a.col, b.col), endCol = Math.max(a.col, b.col);
    for (let i = startLine; i <= endLine; i++) {
      let line = state.doc.line(i);
      let start = findColumn(line.text, startCol, state.tabSize), end = findColumn(line.text, endCol, state.tabSize);
      if (start < end)
        ranges.push(EditorSelection.range(line.from + start, line.from + end));
    }
  }
  return ranges;
}
function absoluteColumn(view, x) {
  let ref = view.coordsAtPos(view.viewport.from);
  return ref ? Math.round(Math.abs((ref.left - x) / view.defaultCharacterWidth)) : -1;
}
function getPos(view, event) {
  let offset = view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
  let line = view.state.doc.lineAt(offset), off = offset - line.from;
  let col = off > MaxOff ? -1 : off == line.length ? absoluteColumn(view, event.clientX) : countColumn(line.text, view.state.tabSize, offset - line.from);
  return { line: line.number, col, off };
}
function rectangleSelectionStyle(view, event) {
  let start = getPos(view, event), startSel = view.state.selection;
  if (!start)
    return null;
  return {
    update(update) {
      if (update.docChanged) {
        let newStart = update.changes.mapPos(update.startState.doc.line(start.line).from);
        let newLine = update.state.doc.lineAt(newStart);
        start = { line: newLine.number, col: start.col, off: Math.min(start.off, newLine.length) };
        startSel = startSel.map(update.changes);
      }
    },
    get(event2, _extend, multiple) {
      let cur2 = getPos(view, event2);
      if (!cur2)
        return startSel;
      let ranges = rectangleFor(view.state, start, cur2);
      if (!ranges.length)
        return startSel;
      if (multiple)
        return EditorSelection.create(ranges.concat(startSel.ranges));
      else
        return EditorSelection.create(ranges);
    }
  };
}
function rectangularSelection(options) {
  let filter = (options === null || options === void 0 ? void 0 : options.eventFilter) || ((e) => e.altKey && e.button == 0);
  return EditorView.mouseSelectionStyle.of((view, event) => filter(event) ? rectangleSelectionStyle(view, event) : null);
}

// node_modules/@codemirror/fold/dist/index.js
function mapRange(range, mapping) {
  let from = mapping.mapPos(range.from, 1), to = mapping.mapPos(range.to, -1);
  return from >= to ? void 0 : { from, to };
}
var foldEffect = /* @__PURE__ */ StateEffect.define({ map: mapRange });
var unfoldEffect = /* @__PURE__ */ StateEffect.define({ map: mapRange });
function selectedLines(view) {
  let lines = [];
  for (let { head } of view.state.selection.ranges) {
    if (lines.some((l) => l.from <= head && l.to >= head))
      continue;
    lines.push(view.visualLineAt(head));
  }
  return lines;
}
var foldState = /* @__PURE__ */ StateField.define({
  create() {
    return Decoration.none;
  },
  update(folded, tr) {
    folded = folded.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(foldEffect) && !foldExists(folded, e.value.from, e.value.to))
        folded = folded.update({ add: [foldWidget.range(e.value.from, e.value.to)] });
      else if (e.is(unfoldEffect))
        folded = folded.update({
          filter: (from, to) => e.value.from != from || e.value.to != to,
          filterFrom: e.value.from,
          filterTo: e.value.to
        });
    }
    if (tr.selection) {
      let onSelection = false, { head } = tr.selection.main;
      folded.between(head, head, (a, b) => {
        if (a < head && b > head)
          onSelection = true;
      });
      if (onSelection)
        folded = folded.update({
          filterFrom: head,
          filterTo: head,
          filter: (a, b) => b <= head || a >= head
        });
    }
    return folded;
  },
  provide: (f) => EditorView.decorations.from(f)
});
function foldInside(state, from, to) {
  var _a;
  let found = null;
  (_a = state.field(foldState, false)) === null || _a === void 0 ? void 0 : _a.between(from, to, (from2, to2) => {
    if (!found || found.from > from2)
      found = { from: from2, to: to2 };
  });
  return found;
}
function foldExists(folded, from, to) {
  let found = false;
  folded.between(from, from, (a, b) => {
    if (a == from && b == to)
      found = true;
  });
  return found;
}
function maybeEnable(state, other) {
  return state.field(foldState, false) ? other : other.concat(StateEffect.appendConfig.of(codeFolding()));
}
var foldCode = (view) => {
  for (let line of selectedLines(view)) {
    let range = foldable(view.state, line.from, line.to);
    if (range) {
      view.dispatch({ effects: maybeEnable(view.state, [foldEffect.of(range), announceFold(view, range)]) });
      return true;
    }
  }
  return false;
};
var unfoldCode = (view) => {
  if (!view.state.field(foldState, false))
    return false;
  let effects = [];
  for (let line of selectedLines(view)) {
    let folded = foldInside(view.state, line.from, line.to);
    if (folded)
      effects.push(unfoldEffect.of(folded), announceFold(view, folded, false));
  }
  if (effects.length)
    view.dispatch({ effects });
  return effects.length > 0;
};
function announceFold(view, range, fold = true) {
  let lineFrom = view.state.doc.lineAt(range.from).number, lineTo = view.state.doc.lineAt(range.to).number;
  return EditorView.announce.of(`${view.state.phrase(fold ? "Folded lines" : "Unfolded lines")} ${lineFrom} ${view.state.phrase("to")} ${lineTo}.`);
}
var foldAll = (view) => {
  let { state } = view, effects = [];
  for (let pos = 0; pos < state.doc.length; ) {
    let line = view.visualLineAt(pos), range = foldable(state, line.from, line.to);
    if (range)
      effects.push(foldEffect.of(range));
    pos = (range ? view.visualLineAt(range.to) : line).to + 1;
  }
  if (effects.length)
    view.dispatch({ effects: maybeEnable(view.state, effects) });
  return !!effects.length;
};
var unfoldAll = (view) => {
  let field = view.state.field(foldState, false);
  if (!field || !field.size)
    return false;
  let effects = [];
  field.between(0, view.state.doc.length, (from, to) => {
    effects.push(unfoldEffect.of({ from, to }));
  });
  view.dispatch({ effects });
  return true;
};
var foldKeymap = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: foldCode },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: unfoldCode },
  { key: "Ctrl-Alt-[", run: foldAll },
  { key: "Ctrl-Alt-]", run: unfoldAll }
];
var defaultConfig2 = {
  placeholderDOM: null,
  placeholderText: "\u2026"
};
var foldConfig = /* @__PURE__ */ Facet.define({
  combine(values) {
    return combineConfig(values, defaultConfig2);
  }
});
function codeFolding(config2) {
  let result = [foldState, baseTheme6];
  if (config2)
    result.push(foldConfig.of(config2));
  return result;
}
var foldWidget = /* @__PURE__ */ Decoration.replace({ widget: /* @__PURE__ */ new class extends WidgetType {
  ignoreEvents() {
    return false;
  }
  toDOM(view) {
    let { state } = view, conf = state.facet(foldConfig);
    if (conf.placeholderDOM)
      return conf.placeholderDOM();
    let element = document.createElement("span");
    element.textContent = conf.placeholderText;
    element.setAttribute("aria-label", state.phrase("folded code"));
    element.title = state.phrase("unfold");
    element.className = "cm-foldPlaceholder";
    element.onclick = (event) => {
      let line = view.visualLineAt(view.posAtDOM(event.target));
      let folded = foldInside(view.state, line.from, line.to);
      if (folded)
        view.dispatch({ effects: unfoldEffect.of(folded) });
      event.preventDefault();
    };
    return element;
  }
}() });
var foldGutterDefaults = {
  openText: "\u2304",
  closedText: "\u203A",
  markerDOM: null
};
var FoldMarker = class extends GutterMarker {
  constructor(config2, open) {
    super();
    this.config = config2;
    this.open = open;
  }
  eq(other) {
    return this.config == other.config && this.open == other.open;
  }
  toDOM(view) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let span = document.createElement("span");
    span.textContent = this.open ? this.config.openText : this.config.closedText;
    span.title = view.state.phrase(this.open ? "Fold line" : "Unfold line");
    return span;
  }
};
function foldGutter(config2 = {}) {
  let fullConfig = Object.assign(Object.assign({}, foldGutterDefaults), config2);
  let canFold = new FoldMarker(fullConfig, true), canUnfold = new FoldMarker(fullConfig, false);
  let markers = ViewPlugin.fromClass(class {
    constructor(view) {
      this.from = view.viewport.from;
      this.markers = this.buildMarkers(view);
    }
    update(update) {
      if (update.docChanged || update.viewportChanged || update.startState.facet(language) != update.state.facet(language) || update.startState.field(foldState, false) != update.state.field(foldState, false))
        this.markers = this.buildMarkers(update.view);
    }
    buildMarkers(view) {
      let builder = new RangeSetBuilder();
      view.viewportLines((line) => {
        let mark = foldInside(view.state, line.from, line.to) ? canUnfold : foldable(view.state, line.from, line.to) ? canFold : null;
        if (mark)
          builder.add(line.from, line.from, mark);
      });
      return builder.finish();
    }
  });
  return [
    markers,
    gutter({
      class: "cm-foldGutter",
      markers(view) {
        var _a;
        return ((_a = view.plugin(markers)) === null || _a === void 0 ? void 0 : _a.markers) || RangeSet.empty;
      },
      initialSpacer() {
        return new FoldMarker(fullConfig, false);
      },
      domEventHandlers: {
        click: (view, line) => {
          let folded = foldInside(view.state, line.from, line.to);
          if (folded) {
            view.dispatch({ effects: unfoldEffect.of(folded) });
            return true;
          }
          let range = foldable(view.state, line.from, line.to);
          if (range) {
            view.dispatch({ effects: foldEffect.of(range) });
            return true;
          }
          return false;
        }
      }
    }),
    codeFolding()
  ];
}
var baseTheme6 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter .cm-gutterElement": {
    padding: "0 1px",
    cursor: "pointer"
  }
});

// node_modules/@codemirror/closebrackets/dist/index.js
var defaults2 = {
  brackets: ["(", "[", "{", "'", '"'],
  before: `)]}'":;>`
};
var closeBracketEffect = /* @__PURE__ */ StateEffect.define({
  map(value, mapping) {
    let mapped = mapping.mapPos(value, -1, MapMode.TrackAfter);
    return mapped == null ? void 0 : mapped;
  }
});
var skipBracketEffect = /* @__PURE__ */ StateEffect.define({
  map(value, mapping) {
    return mapping.mapPos(value);
  }
});
var closedBracket = /* @__PURE__ */ new class extends RangeValue {
}();
closedBracket.startSide = 1;
closedBracket.endSide = -1;
var bracketState = /* @__PURE__ */ StateField.define({
  create() {
    return RangeSet.empty;
  },
  update(value, tr) {
    if (tr.selection) {
      let lineStart = tr.state.doc.lineAt(tr.selection.main.head).from;
      let prevLineStart = tr.startState.doc.lineAt(tr.startState.selection.main.head).from;
      if (lineStart != tr.changes.mapPos(prevLineStart, -1))
        value = RangeSet.empty;
    }
    value = value.map(tr.changes);
    for (let effect of tr.effects) {
      if (effect.is(closeBracketEffect))
        value = value.update({ add: [closedBracket.range(effect.value, effect.value + 1)] });
      else if (effect.is(skipBracketEffect))
        value = value.update({ filter: (from) => from != effect.value });
    }
    return value;
  }
});
function closeBrackets() {
  return [EditorView.inputHandler.of(handleInput), bracketState];
}
var definedClosing = "()[]{}<>";
function closing(ch) {
  for (let i = 0; i < definedClosing.length; i += 2)
    if (definedClosing.charCodeAt(i) == ch)
      return definedClosing.charAt(i + 1);
  return fromCodePoint(ch < 128 ? ch : ch + 1);
}
function config(state, pos) {
  return state.languageDataAt("closeBrackets", pos)[0] || defaults2;
}
function handleInput(view, from, to, insert2) {
  if (view.composing)
    return false;
  let sel = view.state.selection.main;
  if (insert2.length > 2 || insert2.length == 2 && codePointSize(codePointAt(insert2, 0)) == 1 || from != sel.from || to != sel.to)
    return false;
  let tr = insertBracket(view.state, insert2);
  if (!tr)
    return false;
  view.dispatch(tr);
  return true;
}
var deleteBracketPair = ({ state, dispatch }) => {
  let conf = config(state, state.selection.main.head);
  let tokens = conf.brackets || defaults2.brackets;
  let dont = null, changes = state.changeByRange((range) => {
    if (range.empty) {
      let before = prevChar(state.doc, range.head);
      for (let token of tokens) {
        if (token == before && nextChar(state.doc, range.head) == closing(codePointAt(token, 0)))
          return {
            changes: { from: range.head - token.length, to: range.head + token.length },
            range: EditorSelection.cursor(range.head - token.length),
            userEvent: "delete.backward"
          };
      }
    }
    return { range: dont = range };
  });
  if (!dont)
    dispatch(state.update(changes, { scrollIntoView: true }));
  return !dont;
};
var closeBracketsKeymap = [
  { key: "Backspace", run: deleteBracketPair }
];
function insertBracket(state, bracket2) {
  let conf = config(state, state.selection.main.head);
  let tokens = conf.brackets || defaults2.brackets;
  for (let tok of tokens) {
    let closed = closing(codePointAt(tok, 0));
    if (bracket2 == tok)
      return closed == tok ? handleSame(state, tok, tokens.indexOf(tok + tok + tok) > -1) : handleOpen(state, tok, closed, conf.before || defaults2.before);
    if (bracket2 == closed && closedBracketAt(state, state.selection.main.from))
      return handleClose(state, tok, closed);
  }
  return null;
}
function closedBracketAt(state, pos) {
  let found = false;
  state.field(bracketState).between(0, state.doc.length, (from) => {
    if (from == pos)
      found = true;
  });
  return found;
}
function nextChar(doc2, pos) {
  let next = doc2.sliceString(pos, pos + 2);
  return next.slice(0, codePointSize(codePointAt(next, 0)));
}
function prevChar(doc2, pos) {
  let prev = doc2.sliceString(pos - 2, pos);
  return codePointSize(codePointAt(prev, 0)) == prev.length ? prev : prev.slice(1);
}
function handleOpen(state, open, close, closeBefore) {
  let dont = null, changes = state.changeByRange((range) => {
    if (!range.empty)
      return {
        changes: [{ insert: open, from: range.from }, { insert: close, from: range.to }],
        effects: closeBracketEffect.of(range.to + open.length),
        range: EditorSelection.range(range.anchor + open.length, range.head + open.length)
      };
    let next = nextChar(state.doc, range.head);
    if (!next || /\s/.test(next) || closeBefore.indexOf(next) > -1)
      return {
        changes: { insert: open + close, from: range.head },
        effects: closeBracketEffect.of(range.head + open.length),
        range: EditorSelection.cursor(range.head + open.length)
      };
    return { range: dont = range };
  });
  return dont ? null : state.update(changes, {
    scrollIntoView: true,
    userEvent: "input.type"
  });
}
function handleClose(state, _open, close) {
  let dont = null, moved = state.selection.ranges.map((range) => {
    if (range.empty && nextChar(state.doc, range.head) == close)
      return EditorSelection.cursor(range.head + close.length);
    return dont = range;
  });
  return dont ? null : state.update({
    selection: EditorSelection.create(moved, state.selection.mainIndex),
    scrollIntoView: true,
    effects: state.selection.ranges.map(({ from }) => skipBracketEffect.of(from))
  });
}
function handleSame(state, token, allowTriple) {
  let dont = null, changes = state.changeByRange((range) => {
    if (!range.empty)
      return {
        changes: [{ insert: token, from: range.from }, { insert: token, from: range.to }],
        effects: closeBracketEffect.of(range.to + token.length),
        range: EditorSelection.range(range.anchor + token.length, range.head + token.length)
      };
    let pos = range.head, next = nextChar(state.doc, pos);
    if (next == token) {
      if (nodeStart(state, pos)) {
        return {
          changes: { insert: token + token, from: pos },
          effects: closeBracketEffect.of(pos + token.length),
          range: EditorSelection.cursor(pos + token.length)
        };
      } else if (closedBracketAt(state, pos)) {
        let isTriple = allowTriple && state.sliceDoc(pos, pos + token.length * 3) == token + token + token;
        return {
          range: EditorSelection.cursor(pos + token.length * (isTriple ? 3 : 1)),
          effects: skipBracketEffect.of(pos)
        };
      }
    } else if (allowTriple && state.sliceDoc(pos - 2 * token.length, pos) == token + token && nodeStart(state, pos - 2 * token.length)) {
      return {
        changes: { insert: token + token + token + token, from: pos },
        effects: closeBracketEffect.of(pos + token.length),
        range: EditorSelection.cursor(pos + token.length)
      };
    } else if (state.charCategorizer(pos)(next) != CharCategory.Word) {
      let prev = state.sliceDoc(pos - 1, pos);
      if (prev != token && state.charCategorizer(pos)(prev) != CharCategory.Word)
        return {
          changes: { insert: token + token, from: pos },
          effects: closeBracketEffect.of(pos + token.length),
          range: EditorSelection.cursor(pos + token.length)
        };
    }
    return { range: dont = range };
  });
  return dont ? null : state.update(changes, {
    scrollIntoView: true,
    userEvent: "input.type"
  });
}
function nodeStart(state, pos) {
  let tree = syntaxTree(state).resolveInner(pos + 1);
  return tree.parent && tree.from == pos;
}

// node_modules/@codemirror/panel/dist/index.js
var panelConfig = /* @__PURE__ */ Facet.define({
  combine(configs) {
    let topContainer, bottomContainer;
    for (let c of configs) {
      topContainer = topContainer || c.topContainer;
      bottomContainer = bottomContainer || c.bottomContainer;
    }
    return { topContainer, bottomContainer };
  }
});
function getPanel(view, panel) {
  let plugin = view.plugin(panelPlugin);
  let index = plugin ? plugin.specs.indexOf(panel) : -1;
  return index > -1 ? plugin.panels[index] : null;
}
var panelPlugin = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(view) {
    this.input = view.state.facet(showPanel);
    this.specs = this.input.filter((s) => s);
    this.panels = this.specs.map((spec) => spec(view));
    let conf = view.state.facet(panelConfig);
    this.top = new PanelGroup(view, true, conf.topContainer);
    this.bottom = new PanelGroup(view, false, conf.bottomContainer);
    this.top.sync(this.panels.filter((p) => p.top));
    this.bottom.sync(this.panels.filter((p) => !p.top));
    for (let p of this.panels) {
      p.dom.classList.add("cm-panel");
      if (p.mount)
        p.mount();
    }
  }
  update(update) {
    let conf = update.state.facet(panelConfig);
    if (this.top.container != conf.topContainer) {
      this.top.sync([]);
      this.top = new PanelGroup(update.view, true, conf.topContainer);
    }
    if (this.bottom.container != conf.bottomContainer) {
      this.bottom.sync([]);
      this.bottom = new PanelGroup(update.view, false, conf.bottomContainer);
    }
    this.top.syncClasses();
    this.bottom.syncClasses();
    let input = update.state.facet(showPanel);
    if (input != this.input) {
      let specs = input.filter((x) => x);
      let panels = [], top2 = [], bottom = [], mount = [];
      for (let spec of specs) {
        let known = this.specs.indexOf(spec), panel;
        if (known < 0) {
          panel = spec(update.view);
          mount.push(panel);
        } else {
          panel = this.panels[known];
          if (panel.update)
            panel.update(update);
        }
        panels.push(panel);
        (panel.top ? top2 : bottom).push(panel);
      }
      this.specs = specs;
      this.panels = panels;
      this.top.sync(top2);
      this.bottom.sync(bottom);
      for (let p of mount) {
        p.dom.classList.add("cm-panel");
        if (p.mount)
          p.mount();
      }
    } else {
      for (let p of this.panels)
        if (p.update)
          p.update(update);
    }
  }
  destroy() {
    this.top.sync([]);
    this.bottom.sync([]);
  }
}, {
  provide: /* @__PURE__ */ PluginField.scrollMargins.from((value) => ({ top: value.top.scrollMargin(), bottom: value.bottom.scrollMargin() }))
});
var PanelGroup = class {
  constructor(view, top2, container) {
    this.view = view;
    this.top = top2;
    this.container = container;
    this.dom = void 0;
    this.classes = "";
    this.panels = [];
    this.syncClasses();
  }
  sync(panels) {
    this.panels = panels;
    this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      if (this.dom) {
        this.dom.remove();
        this.dom = void 0;
      }
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div");
      this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom";
      this.dom.style[this.top ? "top" : "bottom"] = "0";
      let parent = this.container || this.view.dom;
      parent.insertBefore(this.dom, this.top ? parent.firstChild : null);
    }
    let curDOM = this.dom.firstChild;
    for (let panel of this.panels) {
      if (panel.dom.parentNode == this.dom) {
        while (curDOM != panel.dom)
          curDOM = rm2(curDOM);
        curDOM = curDOM.nextSibling;
      } else {
        this.dom.insertBefore(panel.dom, curDOM);
      }
    }
    while (curDOM)
      curDOM = rm2(curDOM);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!this.container || this.classes == this.view.themeClasses)
      return;
    for (let cls of this.classes.split(" "))
      if (cls)
        this.container.classList.remove(cls);
    for (let cls of (this.classes = this.view.themeClasses).split(" "))
      if (cls)
        this.container.classList.add(cls);
  }
};
function rm2(node) {
  let next = node.nextSibling;
  node.remove();
  return next;
}
var baseTheme7 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  }
});
var showPanel = /* @__PURE__ */ Facet.define({
  enables: [panelPlugin, baseTheme7]
});

// node_modules/crelt/index.es.js
function crelt() {
  var elt = arguments[0];
  if (typeof elt == "string")
    elt = document.createElement(elt);
  var i = 1, next = arguments[1];
  if (next && typeof next == "object" && next.nodeType == null && !Array.isArray(next)) {
    for (var name2 in next)
      if (Object.prototype.hasOwnProperty.call(next, name2)) {
        var value = next[name2];
        if (typeof value == "string")
          elt.setAttribute(name2, value);
        else if (value != null)
          elt[name2] = value;
      }
    i++;
  }
  for (; i < arguments.length; i++)
    add(elt, arguments[i]);
  return elt;
}
function add(elt, child) {
  if (typeof child == "string") {
    elt.appendChild(document.createTextNode(child));
  } else if (child == null) {
  } else if (child.nodeType != null) {
    elt.appendChild(child);
  } else if (Array.isArray(child)) {
    for (var i = 0; i < child.length; i++)
      add(elt, child[i]);
  } else {
    throw new RangeError("Unsupported child node: " + child);
  }
}

// node_modules/@codemirror/search/dist/index.js
var basicNormalize = typeof String.prototype.normalize == "function" ? (x) => x.normalize("NFKD") : (x) => x;
var SearchCursor = class {
  constructor(text, query, from = 0, to = text.length, normalize) {
    this.value = { from: 0, to: 0 };
    this.done = false;
    this.matches = [];
    this.buffer = "";
    this.bufferPos = 0;
    this.iter = text.iterRange(from, to);
    this.bufferStart = from;
    this.normalize = normalize ? (x) => normalize(basicNormalize(x)) : basicNormalize;
    this.query = this.normalize(query);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      this.bufferStart += this.buffer.length;
      this.iter.next();
      if (this.iter.done)
        return -1;
      this.bufferPos = 0;
      this.buffer = this.iter.value;
    }
    return codePointAt(this.buffer, this.bufferPos);
  }
  next() {
    while (this.matches.length)
      this.matches.pop();
    return this.nextOverlapping();
  }
  nextOverlapping() {
    for (; ; ) {
      let next = this.peek();
      if (next < 0) {
        this.done = true;
        return this;
      }
      let str = fromCodePoint(next), start = this.bufferStart + this.bufferPos;
      this.bufferPos += codePointSize(next);
      let norm = this.normalize(str);
      for (let i = 0, pos = start; ; i++) {
        let code = norm.charCodeAt(i);
        let match = this.match(code, pos);
        if (match) {
          this.value = match;
          return this;
        }
        if (i == norm.length - 1)
          break;
        if (pos == start && i < str.length && str.charCodeAt(i) == code)
          pos++;
      }
    }
  }
  match(code, pos) {
    let match = null;
    for (let i = 0; i < this.matches.length; i += 2) {
      let index = this.matches[i], keep = false;
      if (this.query.charCodeAt(index) == code) {
        if (index == this.query.length - 1) {
          match = { from: this.matches[i + 1], to: pos + 1 };
        } else {
          this.matches[i]++;
          keep = true;
        }
      }
      if (!keep) {
        this.matches.splice(i, 2);
        i -= 2;
      }
    }
    if (this.query.charCodeAt(0) == code) {
      if (this.query.length == 1)
        match = { from: pos, to: pos + 1 };
      else
        this.matches.push(1, pos);
    }
    return match;
  }
};
var empty = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") };
var baseFlags = "gm" + (/x/.unicode == null ? "" : "u");
var RegExpCursor = class {
  constructor(text, query, options, from = 0, to = text.length) {
    this.to = to;
    this.curLine = "";
    this.done = false;
    this.value = empty;
    if (/\\[sWDnr]|\n|\r|\[\^/.test(query))
      return new MultilineRegExpCursor(text, query, options, from, to);
    this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
    this.iter = text.iter();
    let startLine = text.lineAt(from);
    this.curLineStart = startLine.from;
    this.matchPos = from;
    this.getLine(this.curLineStart);
  }
  getLine(skip) {
    this.iter.next(skip);
    if (this.iter.lineBreak) {
      this.curLine = "";
    } else {
      this.curLine = this.iter.value;
      if (this.curLineStart + this.curLine.length > this.to)
        this.curLine = this.curLine.slice(0, this.to - this.curLineStart);
      this.iter.next();
    }
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1;
    if (this.curLineStart > this.to)
      this.curLine = "";
    else
      this.getLine(0);
  }
  next() {
    for (let off = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = off;
      let match = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (match) {
        let from = this.curLineStart + match.index, to = from + match[0].length;
        this.matchPos = to + (from == to ? 1 : 0);
        if (from == this.curLine.length)
          this.nextLine();
        if (from < to || from > this.value.to) {
          this.value = { from, to, match };
          return this;
        }
        off = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to) {
        this.nextLine();
        off = 0;
      } else {
        this.done = true;
        return this;
      }
    }
  }
};
var flattened = /* @__PURE__ */ new WeakMap();
var FlattenedDoc = class {
  constructor(from, text) {
    this.from = from;
    this.text = text;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(doc2, from, to) {
    let cached = flattened.get(doc2);
    if (!cached || cached.from >= to || cached.to <= from) {
      let flat = new FlattenedDoc(from, doc2.sliceString(from, to));
      flattened.set(doc2, flat);
      return flat;
    }
    if (cached.from == from && cached.to == to)
      return cached;
    let { text, from: cachedFrom } = cached;
    if (cachedFrom > from) {
      text = doc2.sliceString(from, cachedFrom) + text;
      cachedFrom = from;
    }
    if (cached.to < to)
      text += doc2.sliceString(cached.to, to);
    flattened.set(doc2, new FlattenedDoc(cachedFrom, text));
    return new FlattenedDoc(from, text.slice(from - cachedFrom, to - cachedFrom));
  }
};
var MultilineRegExpCursor = class {
  constructor(text, query, options, from, to) {
    this.text = text;
    this.to = to;
    this.done = false;
    this.value = empty;
    this.matchPos = from;
    this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
    this.flat = FlattenedDoc.get(text, from, this.chunkEnd(from + 5e3));
  }
  chunkEnd(pos) {
    return pos >= this.to ? this.to : this.text.lineAt(pos).to;
  }
  next() {
    for (; ; ) {
      let off = this.re.lastIndex = this.matchPos - this.flat.from;
      let match = this.re.exec(this.flat.text);
      if (match && !match[0] && match.index == off) {
        this.re.lastIndex = off + 1;
        match = this.re.exec(this.flat.text);
      }
      if (match && this.flat.to < this.to && match.index + match[0].length > this.flat.text.length - 10)
        match = null;
      if (match) {
        let from = this.flat.from + match.index, to = from + match[0].length;
        this.value = { from, to, match };
        this.matchPos = to + (from == to ? 1 : 0);
        return this;
      } else {
        if (this.flat.to == this.to) {
          this.done = true;
          return this;
        }
        this.flat = FlattenedDoc.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
      }
    }
  }
};
function validRegExp(source) {
  try {
    new RegExp(source, baseFlags);
    return true;
  } catch (_a) {
    return false;
  }
}
function createLineDialog(view) {
  let input = crelt("input", { class: "cm-textfield", name: "line" });
  let dom = crelt("form", {
    class: "cm-gotoLine",
    onkeydown: (event) => {
      if (event.keyCode == 27) {
        event.preventDefault();
        view.dispatch({ effects: dialogEffect.of(false) });
        view.focus();
      } else if (event.keyCode == 13) {
        event.preventDefault();
        go();
      }
    },
    onsubmit: (event) => {
      event.preventDefault();
      go();
    }
  }, crelt("label", view.state.phrase("Go to line"), ": ", input), " ", crelt("button", { class: "cm-button", type: "submit" }, view.state.phrase("go")));
  function go() {
    let match = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(input.value);
    if (!match)
      return;
    let { state } = view, startLine = state.doc.lineAt(state.selection.main.head);
    let [, sign, ln, cl, percent] = match;
    let col = cl ? +cl.slice(1) : 0;
    let line = ln ? +ln : startLine.number;
    if (ln && percent) {
      let pc = line / 100;
      if (sign)
        pc = pc * (sign == "-" ? -1 : 1) + startLine.number / state.doc.lines;
      line = Math.round(state.doc.lines * pc);
    } else if (ln && sign) {
      line = line * (sign == "-" ? -1 : 1) + startLine.number;
    }
    let docLine = state.doc.line(Math.max(1, Math.min(state.doc.lines, line)));
    view.dispatch({
      effects: dialogEffect.of(false),
      selection: EditorSelection.cursor(docLine.from + Math.max(0, Math.min(col, docLine.length))),
      scrollIntoView: true
    });
    view.focus();
  }
  return { dom, pos: -10 };
}
var dialogEffect = /* @__PURE__ */ StateEffect.define();
var dialogField = /* @__PURE__ */ StateField.define({
  create() {
    return true;
  },
  update(value, tr) {
    for (let e of tr.effects)
      if (e.is(dialogEffect))
        value = e.value;
    return value;
  },
  provide: (f) => showPanel.from(f, (val) => val ? createLineDialog : null)
});
var gotoLine = (view) => {
  let panel = getPanel(view, createLineDialog);
  if (!panel) {
    let effects = [dialogEffect.of(true)];
    if (view.state.field(dialogField, false) == null)
      effects.push(StateEffect.appendConfig.of([dialogField, baseTheme$1]));
    view.dispatch({ effects });
    panel = getPanel(view, createLineDialog);
  }
  if (panel)
    panel.dom.querySelector("input").focus();
  return true;
};
var baseTheme$1 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    "& label": { fontSize: "80%" }
  }
});
var defaultHighlightOptions = {
  highlightWordAroundCursor: false,
  minSelectionLength: 1,
  maxMatches: 100
};
var highlightConfig = /* @__PURE__ */ Facet.define({
  combine(options) {
    return combineConfig(options, defaultHighlightOptions, {
      highlightWordAroundCursor: (a, b) => a || b,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
function highlightSelectionMatches(options) {
  let ext = [defaultTheme, matchHighlighter];
  if (options)
    ext.push(highlightConfig.of(options));
  return ext;
}
var matchDeco = /* @__PURE__ */ Decoration.mark({ class: "cm-selectionMatch" });
var mainMatchDeco = /* @__PURE__ */ Decoration.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
var matchHighlighter = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(view) {
    this.decorations = this.getDeco(view);
  }
  update(update) {
    if (update.selectionSet || update.docChanged || update.viewportChanged)
      this.decorations = this.getDeco(update.view);
  }
  getDeco(view) {
    let conf = view.state.facet(highlightConfig);
    let { state } = view, sel = state.selection;
    if (sel.ranges.length > 1)
      return Decoration.none;
    let range = sel.main, query, check = null;
    if (range.empty) {
      if (!conf.highlightWordAroundCursor)
        return Decoration.none;
      let word = state.wordAt(range.head);
      if (!word)
        return Decoration.none;
      check = state.charCategorizer(range.head);
      query = state.sliceDoc(word.from, word.to);
    } else {
      let len = range.to - range.from;
      if (len < conf.minSelectionLength || len > 200)
        return Decoration.none;
      query = state.sliceDoc(range.from, range.to).trim();
      if (!query)
        return Decoration.none;
    }
    let deco = [];
    for (let part of view.visibleRanges) {
      let cursor = new SearchCursor(state.doc, query, part.from, part.to);
      while (!cursor.next().done) {
        let { from, to } = cursor.value;
        if (!check || (from == 0 || check(state.sliceDoc(from - 1, from)) != CharCategory.Word) && (to == state.doc.length || check(state.sliceDoc(to, to + 1)) != CharCategory.Word)) {
          if (check && from <= range.from && to >= range.to)
            deco.push(mainMatchDeco.range(from, to));
          else if (from >= range.to || to <= range.from)
            deco.push(matchDeco.range(from, to));
          if (deco.length > conf.maxMatches)
            return Decoration.none;
        }
      }
    }
    return Decoration.set(deco);
  }
}, {
  decorations: (v) => v.decorations
});
var defaultTheme = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
  ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
});
var selectWord = ({ state, dispatch }) => {
  let { selection } = state;
  let newSel = EditorSelection.create(selection.ranges.map((range) => state.wordAt(range.head) || EditorSelection.cursor(range.head)), selection.mainIndex);
  if (newSel.eq(selection))
    return false;
  dispatch(state.update({ selection: newSel }));
  return true;
};
function findNextOccurrence(state, query) {
  let { main, ranges } = state.selection;
  let word = state.wordAt(main.head), fullWord = word && word.from == main.from && word.to == main.to;
  for (let cycled = false, cursor = new SearchCursor(state.doc, query, ranges[ranges.length - 1].to); ; ) {
    cursor.next();
    if (cursor.done) {
      if (cycled)
        return null;
      cursor = new SearchCursor(state.doc, query, 0, Math.max(0, ranges[ranges.length - 1].from - 1));
      cycled = true;
    } else {
      if (cycled && ranges.some((r) => r.from == cursor.value.from))
        continue;
      if (fullWord) {
        let word2 = state.wordAt(cursor.value.from);
        if (!word2 || word2.from != cursor.value.from || word2.to != cursor.value.to)
          continue;
      }
      return cursor.value;
    }
  }
}
var selectNextOccurrence = ({ state, dispatch }) => {
  let { ranges } = state.selection;
  if (ranges.some((sel) => sel.from === sel.to))
    return selectWord({ state, dispatch });
  let searchedText = state.sliceDoc(ranges[0].from, ranges[0].to);
  if (state.selection.ranges.some((r) => state.sliceDoc(r.from, r.to) != searchedText))
    return false;
  let range = findNextOccurrence(state, searchedText);
  if (!range)
    return false;
  dispatch(state.update({
    selection: state.selection.addRange(EditorSelection.range(range.from, range.to), false),
    scrollIntoView: true
  }));
  return true;
};
var searchConfigFacet = /* @__PURE__ */ Facet.define({
  combine(configs) {
    let matchCase = configs.some((c) => c.matchCase);
    return {
      top: configs.some((c) => c.top),
      matchCase: matchCase === void 0 ? true : matchCase
    };
  }
});
var Query = class {
  constructor(search, replace, caseInsensitive) {
    this.search = search;
    this.replace = replace;
    this.caseInsensitive = caseInsensitive;
  }
  eq(other) {
    return this.search == other.search && this.replace == other.replace && this.caseInsensitive == other.caseInsensitive && this.constructor == other.constructor;
  }
};
var StringQuery = class extends Query {
  constructor(search, replace, caseInsensitive) {
    super(search, replace, caseInsensitive);
    this.unquoted = search.replace(/\\([nrt\\])/g, (_, ch) => ch == "n" ? "\n" : ch == "r" ? "\r" : ch == "t" ? "	" : "\\");
  }
  cursor(doc2, from = 0, to = doc2.length) {
    return new SearchCursor(doc2, this.unquoted, from, to, this.caseInsensitive ? (x) => x.toLowerCase() : void 0);
  }
  nextMatch(doc2, curFrom, curTo) {
    let cursor = this.cursor(doc2, curTo).nextOverlapping();
    if (cursor.done)
      cursor = this.cursor(doc2, 0, curFrom).nextOverlapping();
    return cursor.done ? null : cursor.value;
  }
  prevMatchInRange(doc2, from, to) {
    for (let pos = to; ; ) {
      let start = Math.max(from, pos - 1e4 - this.unquoted.length);
      let cursor = this.cursor(doc2, start, pos), range = null;
      while (!cursor.nextOverlapping().done)
        range = cursor.value;
      if (range)
        return range;
      if (start == from)
        return null;
      pos -= 1e4;
    }
  }
  prevMatch(doc2, curFrom, curTo) {
    return this.prevMatchInRange(doc2, 0, curFrom) || this.prevMatchInRange(doc2, curTo, doc2.length);
  }
  getReplacement(_result) {
    return this.replace;
  }
  matchAll(doc2, limit) {
    let cursor = this.cursor(doc2), ranges = [];
    while (!cursor.next().done) {
      if (ranges.length >= limit)
        return null;
      ranges.push(cursor.value);
    }
    return ranges;
  }
  highlight(doc2, from, to, add2) {
    let cursor = this.cursor(doc2, Math.max(0, from - this.unquoted.length), Math.min(to + this.unquoted.length, doc2.length));
    while (!cursor.next().done)
      add2(cursor.value.from, cursor.value.to);
  }
  get valid() {
    return !!this.search;
  }
};
var RegExpQuery = class extends Query {
  constructor(search, replace, caseInsensitive) {
    super(search, replace, caseInsensitive);
    this.valid = !!search && validRegExp(search);
  }
  cursor(doc2, from = 0, to = doc2.length) {
    return new RegExpCursor(doc2, this.search, this.caseInsensitive ? { ignoreCase: true } : void 0, from, to);
  }
  nextMatch(doc2, curFrom, curTo) {
    let cursor = this.cursor(doc2, curTo).next();
    if (cursor.done)
      cursor = this.cursor(doc2, 0, curFrom).next();
    return cursor.done ? null : cursor.value;
  }
  prevMatchInRange(doc2, from, to) {
    for (let size = 1; ; size++) {
      let start = Math.max(from, to - size * 1e4);
      let cursor = this.cursor(doc2, start, to), range = null;
      while (!cursor.next().done)
        range = cursor.value;
      if (range && (start == from || range.from > start + 10))
        return range;
      if (start == from)
        return null;
    }
  }
  prevMatch(doc2, curFrom, curTo) {
    return this.prevMatchInRange(doc2, 0, curFrom) || this.prevMatchInRange(doc2, curTo, doc2.length);
  }
  getReplacement(result) {
    return this.replace.replace(/\$([$&\d+])/g, (m, i) => i == "$" ? "$" : i == "&" ? result.match[0] : i != "0" && +i < result.match.length ? result.match[i] : m);
  }
  matchAll(doc2, limit) {
    let cursor = this.cursor(doc2), ranges = [];
    while (!cursor.next().done) {
      if (ranges.length >= limit)
        return null;
      ranges.push(cursor.value);
    }
    return ranges;
  }
  highlight(doc2, from, to, add2) {
    let cursor = this.cursor(doc2, Math.max(0, from - 250), Math.min(to + 250, doc2.length));
    while (!cursor.next().done)
      add2(cursor.value.from, cursor.value.to);
  }
};
var setQuery = /* @__PURE__ */ StateEffect.define();
var togglePanel = /* @__PURE__ */ StateEffect.define();
var searchState = /* @__PURE__ */ StateField.define({
  create(state) {
    return new SearchState(defaultQuery(state), createSearchPanel);
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(setQuery))
        value = new SearchState(effect.value, value.panel);
      else if (effect.is(togglePanel))
        value = new SearchState(value.query, effect.value ? createSearchPanel : null);
    }
    return value;
  },
  provide: (f) => showPanel.from(f, (val) => val.panel)
});
var SearchState = class {
  constructor(query, panel) {
    this.query = query;
    this.panel = panel;
  }
};
var matchMark = /* @__PURE__ */ Decoration.mark({ class: "cm-searchMatch" });
var selectedMatchMark = /* @__PURE__ */ Decoration.mark({ class: "cm-searchMatch cm-searchMatch-selected" });
var searchHighlighter = /* @__PURE__ */ ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.decorations = this.highlight(view.state.field(searchState));
  }
  update(update) {
    let state = update.state.field(searchState);
    if (state != update.startState.field(searchState) || update.docChanged || update.selectionSet)
      this.decorations = this.highlight(state);
  }
  highlight({ query, panel }) {
    if (!panel || !query.valid)
      return Decoration.none;
    let { view } = this;
    let builder = new RangeSetBuilder();
    for (let i = 0, ranges = view.visibleRanges, l = ranges.length; i < l; i++) {
      let { from, to } = ranges[i];
      while (i < l - 1 && to > ranges[i + 1].from - 2 * 250)
        to = ranges[++i].to;
      query.highlight(view.state.doc, from, to, (from2, to2) => {
        let selected = view.state.selection.ranges.some((r) => r.from == from2 && r.to == to2);
        builder.add(from2, to2, selected ? selectedMatchMark : matchMark);
      });
    }
    return builder.finish();
  }
}, {
  decorations: (v) => v.decorations
});
function searchCommand(f) {
  return (view) => {
    let state = view.state.field(searchState, false);
    return state && state.query.valid ? f(view, state) : openSearchPanel(view);
  };
}
var findNext = /* @__PURE__ */ searchCommand((view, { query }) => {
  let { from, to } = view.state.selection.main;
  let next = query.nextMatch(view.state.doc, from, to);
  if (!next || next.from == from && next.to == to)
    return false;
  view.dispatch({
    selection: { anchor: next.from, head: next.to },
    scrollIntoView: true,
    effects: announceMatch(view, next)
  });
  return true;
});
var findPrevious = /* @__PURE__ */ searchCommand((view, { query }) => {
  let { state } = view, { from, to } = state.selection.main;
  let range = query.prevMatch(state.doc, from, to);
  if (!range)
    return false;
  view.dispatch({
    selection: { anchor: range.from, head: range.to },
    scrollIntoView: true,
    effects: announceMatch(view, range)
  });
  return true;
});
var selectMatches = /* @__PURE__ */ searchCommand((view, { query }) => {
  let ranges = query.matchAll(view.state.doc, 1e3);
  if (!ranges || !ranges.length)
    return false;
  view.dispatch({
    selection: EditorSelection.create(ranges.map((r) => EditorSelection.range(r.from, r.to)))
  });
  return true;
});
var selectSelectionMatches = ({ state, dispatch }) => {
  let sel = state.selection;
  if (sel.ranges.length > 1 || sel.main.empty)
    return false;
  let { from, to } = sel.main;
  let ranges = [], main = 0;
  for (let cur2 = new SearchCursor(state.doc, state.sliceDoc(from, to)); !cur2.next().done; ) {
    if (ranges.length > 1e3)
      return false;
    if (cur2.value.from == from)
      main = ranges.length;
    ranges.push(EditorSelection.range(cur2.value.from, cur2.value.to));
  }
  dispatch(state.update({ selection: EditorSelection.create(ranges, main) }));
  return true;
};
var replaceNext = /* @__PURE__ */ searchCommand((view, { query }) => {
  let { state } = view, { from, to } = state.selection.main;
  if (state.readOnly)
    return false;
  let next = query.nextMatch(state.doc, from, from);
  if (!next)
    return false;
  let changes = [], selection, replacement;
  if (next.from == from && next.to == to) {
    replacement = state.toText(query.getReplacement(next));
    changes.push({ from: next.from, to: next.to, insert: replacement });
    next = query.nextMatch(state.doc, next.from, next.to);
  }
  if (next) {
    let off = changes.length == 0 || changes[0].from >= next.to ? 0 : next.to - next.from - replacement.length;
    selection = { anchor: next.from - off, head: next.to - off };
  }
  view.dispatch({
    changes,
    selection,
    scrollIntoView: !!selection,
    effects: next ? announceMatch(view, next) : void 0
  });
  return true;
});
var replaceAll = /* @__PURE__ */ searchCommand((view, { query }) => {
  if (view.state.readOnly)
    return false;
  let changes = query.matchAll(view.state.doc, 1e9).map((match) => {
    let { from, to } = match;
    return { from, to, insert: query.getReplacement(match) };
  });
  if (!changes.length)
    return false;
  view.dispatch({ changes });
  return true;
});
function createSearchPanel(view) {
  let { query } = view.state.field(searchState);
  return {
    dom: buildPanel({
      view,
      query,
      updateQuery(q) {
        if (!query.eq(q)) {
          query = q;
          view.dispatch({ effects: setQuery.of(query) });
        }
      }
    }),
    mount() {
      this.dom.querySelector("[name=search]").select();
    },
    pos: 80,
    top: view.state.facet(searchConfigFacet).top
  };
}
function defaultQuery(state, fallback) {
  var _a;
  let sel = state.selection.main;
  let selText = sel.empty || sel.to > sel.from + 100 ? "" : state.sliceDoc(sel.from, sel.to);
  let caseInsensitive = (_a = fallback === null || fallback === void 0 ? void 0 : fallback.caseInsensitive) !== null && _a !== void 0 ? _a : !state.facet(searchConfigFacet).matchCase;
  return fallback && !selText ? fallback : new StringQuery(selText.replace(/\n/g, "\\n"), "", caseInsensitive);
}
var openSearchPanel = (view) => {
  let state = view.state.field(searchState, false);
  if (state && state.panel) {
    let panel = getPanel(view, createSearchPanel);
    if (!panel)
      return false;
    let searchInput = panel.dom.querySelector("[name=search]");
    searchInput.focus();
    searchInput.select();
  } else {
    view.dispatch({ effects: [
      togglePanel.of(true),
      state ? setQuery.of(defaultQuery(view.state, state.query)) : StateEffect.appendConfig.of(searchExtensions)
    ] });
  }
  return true;
};
var closeSearchPanel = (view) => {
  let state = view.state.field(searchState, false);
  if (!state || !state.panel)
    return false;
  let panel = getPanel(view, createSearchPanel);
  if (panel && panel.dom.contains(view.root.activeElement))
    view.focus();
  view.dispatch({ effects: togglePanel.of(false) });
  return true;
};
var searchKeymap = [
  { key: "Mod-f", run: openSearchPanel, scope: "editor search-panel" },
  { key: "F3", run: findNext, shift: findPrevious, scope: "editor search-panel" },
  { key: "Mod-g", run: findNext, shift: findPrevious, scope: "editor search-panel" },
  { key: "Escape", run: closeSearchPanel, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: selectSelectionMatches },
  { key: "Alt-g", run: gotoLine },
  { key: "Mod-d", run: selectNextOccurrence, preventDefault: true }
];
function buildPanel(conf) {
  function phrase(phrase2) {
    return conf.view.state.phrase(phrase2);
  }
  let searchField = crelt("input", {
    value: conf.query.search,
    placeholder: phrase("Find"),
    "aria-label": phrase("Find"),
    class: "cm-textfield",
    name: "search",
    onchange: update,
    onkeyup: update
  });
  let replaceField = crelt("input", {
    value: conf.query.replace,
    placeholder: phrase("Replace"),
    "aria-label": phrase("Replace"),
    class: "cm-textfield",
    name: "replace",
    onchange: update,
    onkeyup: update
  });
  let caseField = crelt("input", {
    type: "checkbox",
    name: "case",
    checked: !conf.query.caseInsensitive,
    onchange: update
  });
  let reField = crelt("input", {
    type: "checkbox",
    name: "re",
    checked: conf.query instanceof RegExpQuery,
    onchange: update
  });
  function update() {
    conf.updateQuery(new (reField.checked ? RegExpQuery : StringQuery)(searchField.value, replaceField.value, !caseField.checked));
  }
  function keydown(e) {
    if (runScopeHandlers(conf.view, e, "search-panel")) {
      e.preventDefault();
    } else if (e.keyCode == 13 && e.target == searchField) {
      e.preventDefault();
      (e.shiftKey ? findPrevious : findNext)(conf.view);
    } else if (e.keyCode == 13 && e.target == replaceField) {
      e.preventDefault();
      replaceNext(conf.view);
    }
  }
  function button(name2, onclick, content2) {
    return crelt("button", { class: "cm-button", name: name2, onclick, type: "button" }, content2);
  }
  let panel = crelt("div", { onkeydown: keydown, class: "cm-search" }, [
    searchField,
    button("next", () => findNext(conf.view), [phrase("next")]),
    button("prev", () => findPrevious(conf.view), [phrase("previous")]),
    button("select", () => selectMatches(conf.view), [phrase("all")]),
    crelt("label", null, [caseField, phrase("match case")]),
    crelt("label", null, [reField, phrase("regexp")]),
    crelt("br"),
    replaceField,
    button("replace", () => replaceNext(conf.view), [phrase("replace")]),
    button("replaceAll", () => replaceAll(conf.view), [phrase("replace all")]),
    crelt("button", { name: "close", onclick: () => closeSearchPanel(conf.view), "aria-label": phrase("close"), type: "button" }, ["\xD7"])
  ]);
  return panel;
}
var AnnounceMargin = 30;
var Break = /[\s\.,:;?!]/;
function announceMatch(view, { from, to }) {
  let lineStart = view.state.doc.lineAt(from).from, lineEnd = view.state.doc.lineAt(to).to;
  let start = Math.max(lineStart, from - AnnounceMargin), end = Math.min(lineEnd, to + AnnounceMargin);
  let text = view.state.sliceDoc(start, end);
  if (start != lineStart) {
    for (let i = 0; i < AnnounceMargin; i++)
      if (!Break.test(text[i + 1]) && Break.test(text[i])) {
        text = text.slice(i);
        break;
      }
  }
  if (end != lineEnd) {
    for (let i = text.length - 1; i > text.length - AnnounceMargin; i--)
      if (!Break.test(text[i - 1]) && Break.test(text[i])) {
        text = text.slice(0, i);
        break;
      }
  }
  return EditorView.announce.of(`${view.state.phrase("current match")}. ${text} ${view.state.phrase("on line")} ${view.state.doc.lineAt(from).number}`);
}
var baseTheme8 = /* @__PURE__ */ EditorView.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
});
var searchExtensions = [
  searchState,
  /* @__PURE__ */ Prec.fallback(searchHighlighter),
  baseTheme8
];

// node_modules/@codemirror/comment/dist/index.js
var toggleComment = (target) => {
  let config2 = getConfig(target.state);
  return config2.line ? toggleLineComment(target) : config2.block ? toggleBlockComment(target) : false;
};
function command(f, option) {
  return ({ state, dispatch }) => {
    let tr = f(option, state.selection.ranges, state);
    if (!tr)
      return false;
    dispatch(state.update(tr));
    return true;
  };
}
var toggleLineComment = /* @__PURE__ */ command(changeLineComment, 0);
var toggleBlockComment = /* @__PURE__ */ command(changeBlockComment, 0);
var commentKeymap = [
  { key: "Mod-/", run: toggleComment },
  { key: "Alt-A", run: toggleBlockComment }
];
function getConfig(state, pos = state.selection.main.head) {
  let data = state.languageDataAt("commentTokens", pos);
  return data.length ? data[0] : {};
}
var SearchMargin = 50;
function findBlockComment(state, { open, close }, from, to) {
  let textBefore = state.sliceDoc(from - SearchMargin, from);
  let textAfter = state.sliceDoc(to, to + SearchMargin);
  let spaceBefore = /\s*$/.exec(textBefore)[0].length, spaceAfter = /^\s*/.exec(textAfter)[0].length;
  let beforeOff = textBefore.length - spaceBefore;
  if (textBefore.slice(beforeOff - open.length, beforeOff) == open && textAfter.slice(spaceAfter, spaceAfter + close.length) == close) {
    return {
      open: { pos: from - spaceBefore, margin: spaceBefore && 1 },
      close: { pos: to + spaceAfter, margin: spaceAfter && 1 }
    };
  }
  let startText, endText;
  if (to - from <= 2 * SearchMargin) {
    startText = endText = state.sliceDoc(from, to);
  } else {
    startText = state.sliceDoc(from, from + SearchMargin);
    endText = state.sliceDoc(to - SearchMargin, to);
  }
  let startSpace = /^\s*/.exec(startText)[0].length, endSpace = /\s*$/.exec(endText)[0].length;
  let endOff = endText.length - endSpace - close.length;
  if (startText.slice(startSpace, startSpace + open.length) == open && endText.slice(endOff, endOff + close.length) == close) {
    return {
      open: {
        pos: from + startSpace + open.length,
        margin: /\s/.test(startText.charAt(startSpace + open.length)) ? 1 : 0
      },
      close: {
        pos: to - endSpace - close.length,
        margin: /\s/.test(endText.charAt(endOff - 1)) ? 1 : 0
      }
    };
  }
  return null;
}
function changeBlockComment(option, ranges, state) {
  let tokens = ranges.map((r) => getConfig(state, r.from).block);
  if (!tokens.every((c) => c))
    return null;
  let comments = ranges.map((r, i) => findBlockComment(state, tokens[i], r.from, r.to));
  if (option != 2 && !comments.every((c) => c)) {
    let index = 0;
    return state.changeByRange((range) => {
      let { open, close } = tokens[index++];
      if (comments[index])
        return { range };
      let shift2 = open.length + 1;
      return {
        changes: [{ from: range.from, insert: open + " " }, { from: range.to, insert: " " + close }],
        range: EditorSelection.range(range.anchor + shift2, range.head + shift2)
      };
    });
  } else if (option != 1 && comments.some((c) => c)) {
    let changes = [];
    for (let i = 0, comment2; i < comments.length; i++)
      if (comment2 = comments[i]) {
        let token = tokens[i], { open, close } = comment2;
        changes.push({ from: open.pos - token.open.length, to: open.pos + open.margin }, { from: close.pos - close.margin, to: close.pos + token.close.length });
      }
    return { changes };
  }
  return null;
}
function changeLineComment(option, ranges, state) {
  let lines = [];
  let prevLine = -1;
  for (let { from, to } of ranges) {
    let startI = lines.length, minIndent = 1e9;
    for (let pos = from; pos <= to; ) {
      let line = state.doc.lineAt(pos);
      if (line.from > prevLine && (from == to || to > line.from)) {
        prevLine = line.from;
        let token = getConfig(state, pos).line;
        if (!token)
          continue;
        let indent = /^\s*/.exec(line.text)[0].length;
        let empty2 = indent == line.length;
        let comment2 = line.text.slice(indent, indent + token.length) == token ? indent : -1;
        if (indent < line.text.length && indent < minIndent)
          minIndent = indent;
        lines.push({ line, comment: comment2, token, indent, empty: empty2, single: false });
      }
      pos = line.to + 1;
    }
    if (minIndent < 1e9) {
      for (let i = startI; i < lines.length; i++)
        if (lines[i].indent < lines[i].line.text.length)
          lines[i].indent = minIndent;
    }
    if (lines.length == startI + 1)
      lines[startI].single = true;
  }
  if (option != 2 && lines.some((l) => l.comment < 0 && (!l.empty || l.single))) {
    let changes = [];
    for (let { line, token, indent, empty: empty2, single } of lines)
      if (single || !empty2)
        changes.push({ from: line.from + indent, insert: token + " " });
    let changeSet = state.changes(changes);
    return { changes: changeSet, selection: state.selection.map(changeSet, 1) };
  } else if (option != 1 && lines.some((l) => l.comment >= 0)) {
    let changes = [];
    for (let { line, comment: comment2, token } of lines)
      if (comment2 >= 0) {
        let from = line.from + comment2, to = from + token.length;
        if (line.text[to - line.from] == " ")
          to++;
        changes.push({ from, to });
      }
    return { changes };
  }
  return null;
}
export {
  Compartment,
  Decoration,
  EditorSelection,
  EditorState,
  EditorView,
  HighlightStyle,
  SelectionRange,
  StreamLanguage,
  TreeCursor,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  autocompletion,
  bracketMatching,
  closeBrackets,
  closeBracketsKeymap,
  commentKeymap,
  completionKeymap,
  defaultHighlightStyle,
  defaultKeymap,
  drawSelection,
  foldGutter,
  foldKeymap,
  highlightSelectionMatches,
  highlightSpecialChars,
  history,
  historyKeymap,
  indentLess,
  indentMore,
  indentOnInput,
  julia2 as julia_andrey,
  julia as julia_legacy,
  keymap,
  lineNumbers,
  placeholder,
  rectangularSelection,
  searchKeymap,
  syntaxTree,
  tags
};
