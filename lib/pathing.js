'use strict';

/**
 * Module dependencies.
 */

var Lexer = require('./lexer');

module.exports = pathing;
pathing.Lexer = Lexer;

function pathing(url) {
  return (new Lexer(url)).tokens();
}
