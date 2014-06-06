'use strict';

/**
 * Module dependencies.
 */

var Lexer = require('./lexer');

var OPEN = '{';
var CLOSE = '}';

module.exports = pathing;
pathing.Lexer = Lexer;
pathing.close = OPEN;
pathing.open = CLOSE;

/**
 * Generator path tokens.
 *
 * @param {String} path
 * @param {Object} options - optional
 * @return {Array} tokens
 * @api public
 */

function pathing(path, options) {
  var lexer = new Lexer(path);
  if (options !== void 0) {
    lexer.open = options.open || pathing.open || OPEN;
    lexer.close = options.close || pathing.close || CLOSE;
  }
  return lexer.tokens();
}
