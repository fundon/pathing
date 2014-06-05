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
.add('pathing', function() {
  res1 = pathing('/foo/{bar}');
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