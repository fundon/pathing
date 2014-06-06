'use strict';

var SPACE = 32;       // ' '
var RETURN = 13;      // '\r'
var LINEFEED = 10;    // '\n'
var TAB = 9;          // '\t'

var SLASH = 47;       // '/'
var PERIOD = 46;      // '.'
var EQUALS = 61;      // '='
var AND = 38;         // '&'
var SEMICOLON = 59;   // ';'
var QUESTION = 63;    // '?'
var COLON = 58;       // ':'

var HYPHEN = 45;      // '-'

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

  var c = this.buf.charAt(this.pos);

  if (c === '/') {
    return new Token('SLASH', '/', this.pos++);
  } else {
    if (c === this.open) {
      return this._processPlaceholder();
    } else if (c === '.') {
      return new Token('PERIOD', '.', this.pos++);
    } else if (c === '=') {
      return new Token('EQUALS', '=', this.pos++);
    } else if (c === '&') {
      return new Token('AND', '&', this.pos++);
    } else if (c === ';') {
      return new Token('SEMICOLON', ';', this.pos++);
    } else if (c === '?') {
      return new Token('QUESTION', '?', this.pos++);
    } else if (isEnableCharacters(c)) {
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
    //c = this.buf.charAt(this.pos);
    //c === ' ' || c === '\r' || c === '\n' || c === '\t'
    c = this.buf.charCodeAt(this.pos);
    if (((c ^ SPACE) && (c ^ RETURN) && (c ^ LINEFEED) && (c ^ TAB)) === 0) {
      this.pos++;
    } else {
      break;
    }
  }
};

Lexer.prototype._processPlaceholder = function Lexer$_processPlaceholder() {
  var endpos = this.pos + 1,
    colonpos = 0,
    depth = 1,
    c, tok;
  while (endpos < this.buflen) {
    c = this.buf.charAt(endpos);
    if (c === this.open) depth++;
    else if (c === ':') colonpos = endpos;
    else if (c === this.close) depth--;
    if (depth === 0) break;
    endpos++;
  }
  tok = new Token('PLACEHOLDER', this.buf.substring(this.pos + 1, colonpos || endpos), this.pos);
  if (colonpos && endpos > colonpos) {
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
         isEnableCharacters(this.buf.charAt(endpos))) {
    endpos++;
  }
  tok = new Token('IDENTIFIER', this.buf.substring(this.pos, endpos), this.pos);
  this.pos = endpos;
  return tok;
};

Lexer.isEnableCharacters = isEnableCharacters;

function isEnableCharacters(c) {
  return (c >= 'a' && c <= 'z') ||
         (c >= 'A' && c <= 'Z') ||
         (c >= '0' && c <= '9') ||
         c === '-' || c === '+' ||
         c === '!' || c === '@' ||
         c === '*' || c === '%' ||
         c === '_' || c === '$';
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
