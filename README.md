# pathing [![Build Status](https://travis-ci.org/fundon/pathing.svg)](https://travis-ci.org/fundon/pathing)

A fast path lexer. [R3](https://github.com/c9s/r3) inspired.


## Pattern Syntax

```
/posts/{id}           use [^/]+ regular expression by default.
/posts/{id:\\d+}      use `\d+` regular expression instead of default.
/posts/{id:\\d{4,8}}  use `\d{4,8}` regular expression instead of default.
```


## Benchmark, x3+

```
$ make bench
```


## Usage

```js
var pathing = require('pathing');
var tokens = pathing('/{controller}/{action}/{id:\\d+}');
/*
tokens:
  [
    { name: 'SLASH', value: '/', pos: 0 },
    { name: 'PLACEHOLDER', value: 'controller', pos: 1, regexp: '[^/]+' },
    { name: 'SLASH', value: '/', pos: 13 },
    { name: 'PLACEHOLDER', value: 'action', pos: 14, regexp: '[^/]+' }
    { name: 'SLASH', value: '/', pos: 22 },
    { name: 'PLACEHOLDER', value: 'id', pos: 23, regexp: '\\d+' } ]
  ]
*/

var tokens = pathing('{year}-{month}-{day}');
/*
tokens:
  [
    { name: 'PLACEHOLDER', value: 'year', pos: 0, regexp: '[^/]+' },
    { name: 'IDENTIFIER', value: '-', pos: 6 },
    { name: 'PLACEHOLDER', value: 'month', pos: 7, regexp: '[^/]+' },
    { name: 'IDENTIFIER', value: '-', pos: 14 },
    { name: 'PLACEHOLDER', value: 'day', pos: 15, regexp: '[^/]+' }
  ]
*/
```

### Custom delimiters

```js
var tokens = pathing('/posts/<id>', { open: '<', close: '>' });
/*
tokens:
  [
    { name: 'SLASH', value: '/', pos: 0 },
    { name: 'IDENTIFIER', value: 'posts', pos: 1 },
    { name: 'SLASH', value: '/', pos: 6 },
    { name: 'PLACEHOLDER', value: 'id', pos: 7, regexp: '[^/]+' }
  ]
*/
```


## API

### pathing(path, [options])

* `path` String - A path.
* `options` Object - Custom delimiters etc, Optional.
  * `open` String - Open tag, Defaults to `{`.
  * `close` String - Close tag, Defaults to `}`.


### Lexer(path)

* open - Open tag.
* close - Close tag.
* token() - Return next token.
* tokens() - Return all tokens.


## License

MIT
