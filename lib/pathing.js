'use strict';

/**
 * Module dependencies.
 */

var Lexer = require('./lexer');

module.exports = pathing;
pathing.Lexer = Lexer;

/**
 * Generator path tokens.
 *
 * @param {String} path
 * @param {Object} options - optional
 * @return {Array} tokens
 * @api public
 */

function pathing(path, options) {
  options = options || {};
  var lexer = new Lexer(path);
  if (options.open && options.close) {
    lexer.open = options.open;
    lexer.close = options.close;
  }
  return lexer.tokens();
}
