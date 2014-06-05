
var pathing = require('../')
var Lexer = pathing.Lexer;

describe('Lexer', function () {

  it('should be a lexer', function () {
    var lex = Lexer('');
    var lex2 = new Lexer('');
    lex.constructor.should.eql(Lexer);
    lex2.constructor.should.eql(Lexer);
  });

  it('should pase simple path, "/test"', function () {
    var lex = new Lexer('/test');
    var toks = lex.tokens();
    toks.length.should.eql(2);
  });

  it('should pase single named parameter, "/{test}"', function () {
    var lex = new Lexer('/{test}');
    var toks = lex.tokens();
    toks[1].name.should.eql('PLACEHOLDER');
  });

  it('should pase muitl named parameters, "/{controller}/{action}"', function () {
    var lex = new Lexer('/{controller}/{action}');
    var toks = lex.tokens();
    toks[1].name.should.eql('PLACEHOLDER');
    toks[1].value.should.eql('controller');
    toks[3].name.should.eql('PLACEHOLDER');
    toks[3].value.should.eql('action');
  });

  it('should pase custom named parameter, "/{test:\\d+}"', function () {
    var lex = new Lexer('/{test:\\d+}');
    var toks = lex.tokens();
    toks[1].name.should.eql('PLACEHOLDER');
    toks[1].regexp.should.eql('\\d+');
  });

});
