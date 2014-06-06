var Benchmark = require('benchmark').Benchmark;
var pathing = require('../');
var pathToRegexp = require('path-to-regexp');

var suite = new Benchmark.Suite;

var res0, res1;

// add tests
suite.add('path-to-regexp', function() {
  res0 = [];
  pathToRegexp('/foo/:bar', res0);
})
.add('path-to-regexp#mutil-parameters', function() {
  res0 = [];
  pathToRegexp(':year(\\d+)-:month(\\d+)-:day(\\d+)', res0);
})
.add('path-to-regexp#longest', function() {
  res0 = [];
  pathToRegexp('/:controller/:action/posts/:id/:year-:month-:day/:title/:author.:format', res0);
})
.add('path-to-regexp#longest...', function() {
  res0 = [];
  pathToRegexp('/:controller/:action/posts/:id/:year-:month-:day/:title/:author.:format/:controller/:action/posts/:id/:year-:month-:day/:title/:author.:format', res0);
})
.add('path-to-regexp#special-characters', function() {
  res0 = [];
  pathToRegexp('.=&;?#', res0);
})
.add('pathing', function() {
  res1 = pathing('/foo/{bar}');
})
.add('pathing#mutil-parameters', function() {
  res1 = pathing('{year:\\d+}-{month:\\d+}-{day:\\d+}');
})
.add('pathing#longest', function() {
  res1 = pathing('/{controller}/{action}/posts/{id}/{year:\\d+}-{month:\\d+}-{day:\\d+}/{title}/{author}.{format}');
})
.add('pathing#longest...', function() {
  res1 = pathing('/{controller}/{action}/posts/{id}/{year:\\d+}-{month:\\d+}-{day:\\d+}/{title}/{author}.{format}/{controller}/{action}/posts/{id}/{year:\\d+}-{month:\\d+}-{day:\\d+}/{title}/{author}.{format}');
})
.add('pathing#special-characters', function() {
  res1 = pathing('.=&;?#');
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name') + '.');
  console.dir(res0);
  console.dir(res1);
})
.run();