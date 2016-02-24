/* global inherit: true, PhotoBase: true */

'use strict';

define([
  'inherit',
  'PhotoBase'
], function(inherit, PhotoBase) {
  /**
   * Конструктор превью фотографии
   * @constructor
   */
  function PhotoPreview() {}

  inherit(PhotoPreview, PhotoBase);
});
