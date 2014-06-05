# pathing [![Build Status](https://travis-ci.org/fundon/pathing.svg)](https://travis-ci.org/fundon/pathing)

URL path parser.


## Usage

```js
var pathing = require('pathing');
var tokens = pathing('/{controller}/{action}/{id:\\d+}');
/*
tokens:
  [
    { name: 'DIVIDE', value: '/', pos: 0 },
    { name: 'PLACEHOLDER', value: 'controller', pos: 1, regexp: '[^/]+' },
    { name: 'DIVIDE', value: '/', pos: 13 },
    { name: 'PLACEHOLDER', value: 'action', pos: 14, regexp: '[^/]+' }
    { name: 'DIVIDE', value: '/', pos: 22 },
    { name: 'PLACEHOLDER', value: 'id', pos: 23, regexp: '\\d+' } ]
  ]
*/

var tokens = pathing('{year}-{month}-{day}');
/*
tokens:
  [
    { name: 'PLACEHOLDER', value: 'year', pos: 0, regexp: '[^/]+' },
    { name: 'DASH', value: '-', pos: 6 },
    { name: 'PLACEHOLDER', value: 'month', pos: 7, regexp: '[^/]+' },
    { name: 'DASH', value: '-', pos: 14 },
    { name: 'PLACEHOLDER', value: 'day', pos: 15, regexp: '[^/]+' }
  ]
*/
```


## Pattern Syntax

```
/posts/{id}       use [^/]+ regular expression by default.
/posts/{id:\\d+}  use `\d+` regular expression instead of default.
```


### API
