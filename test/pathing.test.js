'use strict';

var pathing = require('../')

describe('pathing', function () {

  it('should be return tokens', function () {
    var toks = pathing('/github.com/{username}/{project}');
    toks.length.should.eql(8);
  });

  it('should be return tokens and custom delimiters', function () {
    var toks = pathing('/github.com/<username>/<project>', { open: '<', close: '>' });
    toks.length.should.eql(8);
  });

});
