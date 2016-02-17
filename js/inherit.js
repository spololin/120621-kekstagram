'use strict';

(function() {

  /**
   *
   * @param {function} child constructor function
   * @param {function} parent constructor function
     */
  function inherit(child, parent) {

    var TempConstructor = function() {};
    TempConstructor.prototype = parent.prototype;
    child.prototype = new TempConstructor();

  }

  window.inheret = inherit;
})();
