'use strict';

/**
 * Module dependencies.
 */

var Lexer = require('./lexer');

module.exports = pathing;
pathing.Lexer = Lexer;

function pathing(url, options) {
  options = options || {};
  var lexer = new Lexer(url);
  if (options.open && options.close) {
    lexer.open = options.open;
    lexer.close = options.close;
  }
  return lexer.tokens();
}
