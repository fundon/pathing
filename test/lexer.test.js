'use strict';

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

  it('should pase muitl named parameters, "/{controller}/{action}/{id:\\d+}"', function () {
    var lex = new Lexer('/{controller}/{action}/{id:\\d+}');
    var toks = lex.tokens();
    toks[1].name.should.eql('PLACEHOLDER');
    toks[1].value.should.eql('controller');
    toks[3].name.should.eql('PLACEHOLDER');
    toks[3].value.should.eql('action');
    toks[5].name.should.eql('PLACEHOLDER');
    toks[5].value.should.eql('id');
  });

  it('should pase custom named parameter, "/{test:\\d+}"', function () {
    var lex = new Lexer('/{test:\\d+}');
    var toks = lex.tokens();
    toks[1].name.should.eql('PLACEHOLDER');
    toks[1].regexp.should.eql('\\d+');
  });

  it('should pase custom regexp parameter and without named, "/{:\\d+}"', function () {
    var lex = new Lexer('/{:\\d+}');
    var toks = lex.tokens();
    toks[1].name.should.eql('PLACEHOLDER');
    toks[1].value.should.eql('');
    toks[1].regexp.should.eql('\\d+');
  });

  it('should split by dash, "{year}-{month}-{day}"', function () {
    var lex = new Lexer('{year}-{month}-{day}');
    var toks = lex.tokens();
    toks[0].name.should.eql('PLACEHOLDER');
    toks[0].value.should.eql('year');
    toks[2].name.should.eql('PLACEHOLDER');
    toks[2].value.should.eql('month');
    toks[4].name.should.eql('PLACEHOLDER');
    toks[4].value.should.eql('day');
  });


  it('should parse custom delimiters, "/posts/<id>"', function () {
    var lex = new Lexer('/posts/<id>');
    lex.open = '<';
    lex.close = '>';
    var toks = lex.tokens();
    toks[3].name.should.eql('PLACEHOLDER');
    toks[3].value.should.eql('id');
  });

  it('should parse special characters, ".=&;?#"', function () {
    var lex = new Lexer('.=&;?#');
    var toks = lex.tokens();
    toks.length.should.eql(3);
    toks[0].name.should.eql('IDENTIFIER');
    toks[0].value.should.eql('.=&;');
    toks[1].name.should.eql('QUESTION');
    toks[1].value.should.eql('?');
    toks[2].name.should.eql('HASH');
    toks[2].value.should.eql('#');
  });

  it('should parse nested delimiters, "/posts/{id:\\d{4,8}}"', function () {
    var lex = new Lexer('/posts/{id:\\d{4,8}}');
    var toks = lex.tokens();
    toks.length.should.eql(4);
    toks[3].name.should.eql('PLACEHOLDER');
    toks[3].regexp.should.eql('\\d{4,8}');
  });

  it('should be empty value, "/posts/{:\\d+}"', function () {
    var lex = new Lexer('/posts/{:\\d+}');
    var toks = lex.tokens();
    toks[3].value.should.eql('');
  });

  it('should be used `[^/]+` regular expression, "/posts/{id:}"', function () {
    var lex = new Lexer('/posts/{id:}');
    var toks = lex.tokens();
    toks[3].regexp.should.eql('[^/]+');
  });

  it('should be empty value, "/posts/{:}"', function () {
    var lex = new Lexer('/posts/{:}');
    var toks = lex.tokens();
    toks[3].value.should.eql('');
    toks[3].regexp.should.eql('[^/]+');
  });

  it('should be empty value and used `[^/]+` regular expression, "/posts/{}"', function () {
    var lex = new Lexer('/posts/{:}');
    var toks = lex.tokens();
    toks[3].value.should.eql('');
    toks[3].regexp.should.eql('[^/]+');
  });

  it('should return null with broken delimiters, "/posts/{"', function () {
    var lex = new Lexer('/posts/{');
    var toks = lex.tokens();
    toks.length.should.eql(3);
  });

  it('should return null with broken delimiters, "/posts/}"', function () {
    var lex = new Lexer('/posts/}');
    var toks = lex.tokens();
    toks.length.should.eql(3);
  });

  it('should return null with broken delimiters, "/posts/{/}/"', function () {
    var lex = new Lexer('/posts/}');
    var toks = lex.tokens();
    toks.length.should.eql(3);
  });

});
