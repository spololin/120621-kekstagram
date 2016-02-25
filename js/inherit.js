'use strict';

define(function() {

  /**
   * Наследует один объект от другого
   * @param {function} child - Конструктор потомка
   * @param {function} parent - Конструктор предка
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

  return inherit;
});
