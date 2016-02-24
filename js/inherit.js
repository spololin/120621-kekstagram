'use strict';

(function() {

  /**
   * Наследует один объект от другого
   * @param {function} child constructor function
   * @param {function} parent constructor function
   */
  function inherit(child, parent) {

    /**
     * Временный конструктор
     * @constructor
     */
    var TempConstructor = function() {};
    TempConstructor.prototype = parent.prototype;
    child.prototype = new TempConstructor();

  }

  window.inherit = inherit;
})();
