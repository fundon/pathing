# pathing

URL path parser.


## Usage

```js
var pathing = require('pathing');
var tokens = pathing('/{controller}/{action}/{id:\\d+}');
// tokens:
//  [
//    { name: 'DIVIDE', value: '/', pos: 0 },
//    { name: 'PLACEHOLDER', value: 'controller', pos: 1, regexp: '[^/]+' },
//    { name: 'DIVIDE', value: '/', pos: 13 },
//    { name: 'PLACEHOLDER', value: 'action', pos: 14, regexp: '[^/]+' }
//    { name: 'DIVIDE', value: '/', pos: 22 },
//    { name: 'PLACEHOLDER', value: 'id', pos: 23, regexp: '\\d+' } ]
//  ]
```


## Pattern Syntax

```
/posts/{id}       use [^/]+ regular expression by default.
/posts/{id:\\d+}  use `\d+` regular expression instead of default.
```


### API
