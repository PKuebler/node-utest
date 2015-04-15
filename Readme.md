# utest

The minimal unit testing library.

# Fork: Allow Async Tests

## Why yet another test library?

I wanted something simple, that just does unit tests (no async) and where each
test is a standalone UNIX program. Now it exists.

## How do I run async tests?

Currently there is only one sane way: Do not use a framework. Instead use one
file per test.

If that becomes an issue, you should write more unit tests. (It is not a unit
test if it does I/O).

## Install

```
npm install utest
```

## Usage

Running a test with utest is very simple:

```js
var test   = require('utest');
var assert = require('assert');

test('Number#toFixed', {
  'returns a string': function(next) {
    assert.equal(typeof (5).toFixed(), 'string');
    next();
  },

  'takes number of decimal places': function(next) {
    assert.equal((5).toFixed(1), '5.0');
    next();
  },

  'does not round': function(next) {
    assert.equal((5.55).toFixed(1), '5.5');
    next();
  },
});
```

It is also possible to define a before/after method:

```js
var test   = require('utest');
var assert = require('assert');

test('Date', {
  before: function(next) {
    this.date = new Date;
    next();
  },

  after: function(next) {
    this.date = null;
    next();
  },

  'lets you manipulate the year': function(next) {
    this.date.setYear(2012);
    assert.equal(this.date.getFullYear(), 2012);
    next();
  },

  'can be coerced into a number': function(next) {
    assert.equal(typeof +this.date, 'number');
    next();
  },
});
```

Last but not least, you can run individual tests by prefixing them with an
exclamation mark. This is useful when putting debug statements into the subject
under test:

```js
var test   = require('utest');
var assert = require('assert');

test('MyTest', {
  '!will be executed': function(next) {
    // ...
  },

  'will not be exectuted': function(next) {
    // ...
  },
});
```

## Future Features

I want to keep this library as minimal as possible, but I do consider the
addition of the following features:

* Nested test cases
* TAP output (if TAP=1 in the environment, switch to TapReporter class)
* Leak detection (automatically add a final test that fails if there are global
  leaks).

## License

This module is licensed under the MIT license.
