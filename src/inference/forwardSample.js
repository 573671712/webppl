// Coroutine to sample from the target (ignoring factor statements) or
// guide program.

'use strict';

var _ = require('underscore');
var util = require('../util');
var CountAggregator = require('../aggregation/CountAggregator');
var ad = require('../ad');
var guide = require('../guide');

module.exports = function(env) {

  function ForwardSample(s, k, a, wpplFn, options) {
    this.opts = util.mergeDefaults(options, {
      samples: 1,
      guide: false, // true = sample guide, false = sample target
      verbose: false,
      params: {}
    });

    this.params = this.opts.params;
    this.wpplFn = wpplFn;
    this.s = s;
    this.k = k;
    this.a = a;

    this.coroutine = env.coroutine;
    env.coroutine = this;
  }

  ForwardSample.prototype = {

    run: function() {

      var hist = new CountAggregator();

      return util.cpsLoop(
          this.opts.samples,

          // Loop body.
          function(i, next) {
            return this.wpplFn(_.clone(this.s), function(s, val) {
              hist.add(val);
              return next();
            }, this.a);
          }.bind(this),

          // Continuation.
          function() {
            env.coroutine = this.coroutine;
            return this.k(this.s, hist.toDist());
          }.bind(this));

    },

    sample: function(s, k, a, dist, options) {
      var distribution = this.opts.guide ?
          (options && options.guide) || guide.independent(dist, a, env) :
          dist;
      return k(s, distribution.sample());
    },

    factor: function(s, k, a, score) {
      return k(s);
    },

    incrementalize: env.defaultCoroutine.incrementalize,
    constructor: ForwardSample

  };

  return {
    ForwardSample: function() {
      var coroutine = Object.create(ForwardSample.prototype);
      ForwardSample.apply(coroutine, arguments);
      return coroutine.run();
    }
  };

};
