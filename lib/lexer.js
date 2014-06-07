'use strict';

/**
 * Expose Lexer
 */

module.exports = Lexer;

/**
 * URL path lexer
 *
 * @param {String} input
 * @return {Lexer}
 * @api public
 */

function Lexer(input) {
  if (!(this instanceof Lexer)) return new Lexer(input);
  this.pos = 0;
  this.buf = input;
  this.buflen = input.length;
  this.open = '{';
  this.close = '}';
}

/**
 * Next token.
 *
 * @return {Object}
 * @api public
 */

Lexer.prototype.token = function Lexer$token() {
  this._skipNonTokens();

  if (this.pos >= this.buflen) {
    return null;
  }

  var c = this.buf.charCodeAt(this.pos);

  if (c === 0x2F /*'/'*/) {
    return new Token('SLASH', '/', this.pos++);
  } else {
    if (c === 0x23 /*'#'*/) {
      return new Token('HASH', '#', this.pos++);
    } else if (c === 0x3F /*'?'*/) {
      return new Token('QUESTION', '?', this.pos++);
    } else if (c === this.open.charCodeAt()) {
      return this._processPlaceholder(c, this.close.charCodeAt());
    } else if (isLegalChars(c)) {
      return this._processIdentifier();
    }
  }
};

/**
 * Return all tokens.
 *
 * @return {Array}
 * @api public
 */

Lexer.prototype.tokens = function Lexer$tokens() {
  var res = null, tok;
  while ((tok = this.token())) {
    if (!res) res = [];
    res.push(tok);
  }
  return res;
};

Lexer.prototype._skipNonTokens = function Lexer$_skipNonTokens() {
  var c;
  while (this.pos < this.buflen) {
    c = this.buf.charCodeAt(this.pos);
    if (((c ^ 0x20 /*' '*/) &&
          (c ^ 0x0D /*'\r'*/) &&
          (c ^ 0x0A /*'\n'*/) &&
          (c ^ 0x09 /*'\t'*/)) === 0) {
      this.pos++;
    } else {
      break;
    }
  }
};

Lexer.prototype._processPlaceholder = function Lexer$_processPlaceholder(s, e) {
  var endpos = this.pos + 1,
    colonpos = 0,
    depth = 1,
    c, tok;
  while (endpos < this.buflen) {
    c = this.buf.charCodeAt(endpos);
    if (c === s) depth++;
    else if (depth === 1 && c === 0x3A /*':'*/) colonpos = endpos;
    else if (c === e) depth--;
    if (depth === 0) break;
    endpos++;
  }
  // broken delimiters
  if (depth) {
    return null;
  }
  tok = new Token(
    'PLACEHOLDER',
    this.buf.substring(this.pos + 1, colonpos || endpos),
    this.pos
  );
  if (colonpos && endpos - colonpos > 1) {
    tok.regexp = this.buf.substring(colonpos + 1, endpos);
  } else {
    tok.regexp = '[^/]+';
  }
  this.pos = endpos + 1;
  return tok;
};

Lexer.prototype._processIdentifier = function Lexer$_processIdentifier() {
  var endpos = this.pos + 1, tok;
  while (endpos < this.buflen &&
         isLegalChars(this.buf.charCodeAt(endpos))) {
    endpos++;
  }
  tok = new Token(
    'IDENTIFIER',
    this.buf.substring(this.pos, endpos),
    this.pos
  );
  this.pos = endpos;
  return tok;
};

Lexer.isLegalChars= isLegalChars;

function isLegalChars(c) {
  return (c >= 0x30 && c <= 0x39) ||  // 0~9
         (c >= 0x41 && c <= 0x5A) ||  // a~z
         (c >= 0x61 && c <= 0x7A) ||  // A~Z
         c === 0x21 || c === 0x24 ||  // !$
         c === 0x26 || c === 0x27 ||  // &'
         c === 0x28 || c === 0x29 ||  // ()
         c === 0x2A || c === 0x2B ||  // *+
         c === 0x2C || c === 0x3B ||  // ,;
         c === 0x3D || c === 0x3A ||  // =:
         c === 0x40 || c === 0x2D ||  // @-
         c === 0x2E || c === 0x7E ||  // .~
         c === 0x5F || c === 0x25;    // _%
}

/**
 * Token
 *
 * @param {String} name
 * @param {String} value
 * @param {Number} pos
 * @param {String} regexp
 * @return {Token}
 * @api private
 */

function Token(name, value, pos, regexp) {
  this.name = name;
  this.value = value;
  this.pos = pos;
  if (regexp !== void 0) this.regexp = regexp;
}
