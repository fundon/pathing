'use strict';

/**
 * Expose Lexer
 */

module.exports = Lexer;

/**
 * URL path lexer
 *
 * @param {String} input
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

Lexer.prototype.token = function () {
  this._skipNonTokens();

  if (this.pos >= this.buflen) {
    return null;
  }

  var c = this.buf.charAt(this.pos);

  if (c === '/') {
    return { name: 'DIVIDE', value: '/', pos: this.pos++ };
  } else {
    if (c === this.open) {
      return this._processPlaceholder();
    } else if (c === '-') {
      return { name: 'DASH', value: '-', pos: this.pos++ };
    } else if (c === '.') {
      return { name: 'PERIOD', value: '.', pos: this.pos++ };
    } else if (Lexer.isAlphanum(c)) {
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

Lexer.prototype.tokens = function () {
  var res = [], tok;
  while ((tok = this.token())) {
    res.push(tok);
  }
  return res;
};

Lexer.isAlpha = function (c) {
  return (c >= 'a' && c <= 'z') ||
         (c >= 'A' && c <= 'Z') ||
         c === '_' || c === '$';
};

Lexer.isAlphanum = function(c) {
  return (c >= 'a' && c <= 'z') ||
         (c >= 'A' && c <= 'Z') ||
         (c >= '0' && c <= '9') ||
         c === '_' || c === '$';
};

Lexer.prototype._skipNonTokens = function() {
  var c;
  while (this.pos < this.buflen) {
    c = this.buf.charAt(this.pos);
    if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
      this.pos++;
    } else {
      break;
    }
  }
};

Lexer.prototype._processPlaceholder = function () {
  var endpos = this.pos + 1;
  var colonpos = 1;
  var depth = 1;
  var c;
  while (endpos < this.buflen) {
    c = this.buf.charAt(endpos);
    if (c === this.open) depth++;
    if (c === this.close) depth--;
    if (depth === 0) break;
    endpos++;
    if (c === ':') colonpos = endpos;
  }
  var tok = {
    name: 'PLACEHOLDER',
    value: this.buf.substring(this.pos + 1, (colonpos - 1) || endpos),
    pos: this.pos
  };
  if (colonpos - 1 && endpos > colonpos) {
    tok.regexp = this.buf.substring(colonpos, endpos);
  } else {
    tok.regexp = '[^/]+';
  }
  this.pos = endpos + 1;
  return tok;
};

Lexer.prototype._processIdentifier = function () {
  var endpos = this.pos + 1;
  while (endpos < this.buflen &&
         Lexer.isAlphanum(this.buf.charAt(endpos))) {
    endpos++;
  }
  var tok = {
    name: 'IDENTIFIER',
    value: this.buf.substring(this.pos, endpos),
    pos: this.pos
  };
  this.pos = endpos;
  return tok;
};

