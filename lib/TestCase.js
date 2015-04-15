var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var doNothing    = function(next) { next(); };

module.exports = TestCase;
util.inherits(TestCase, EventEmitter);
function TestCase(properties) {
  this.name   = properties.name;
  this._tests = properties.tests;
}

TestCase.prototype.run = function(onlyRunSelectedTests) {
  var self = this;

  var before = this._tests.before || doNothing;
  var after  = this._tests.after || doNothing;

  this._waterfall(Object.keys(this._tests), function(test, callback) {
    if (test === 'before' || test === 'after') return callback();

    if (onlyRunSelectedTests && !self._isSelected(test)) {
      self.emit('skip', test);
      return callback();
    }

    var fn      = self._tests[test];
    var context = {};
    var err     = null;

    try {
      before.call(context, function() {
        fn.call(context, function() {
          after.call(context, function() {
            self.emit('pass', test);
            callback();
          });
        });
      });
    } catch (err) {
      self.emit('fail', test, err);
      callback();
    }
  }, function() {
    self.emit('finish');
  });
};

TestCase.prototype.hasSelectedTests = function() {
  for (var test in this._tests) {
    if (this._isSelected(test)) return true;
  }

  return false;
};

TestCase.prototype._isSelected = function(test) {
  return test.substr(0, 1) === '!';
};

TestCase.prototype._waterfall = function(keys, callback, end) {
  var self = this;

  var element = keys.shift();

  callback(element, function() {
    if (keys.length > 0)
      self._waterfall(keys, callback, end);
    else if (typeof end !== 'undefined')
      end();
  });
}
