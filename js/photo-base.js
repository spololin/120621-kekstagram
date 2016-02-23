'use strict';

(function() {
  function PhotoBase() {}
  PhotoBase.prototype._data = null;
  PhotoBase.prototype.render = function() {};
  PhotoBase.prototype.remove = function() {};
  PhotoBase.prototype.onPhotoClick = function() {};

  PhotoBase.prototype.setData = function(data) {
    this._data = data;
  };

  PhotoBase.prototype.getData = function() {
    return this._data;
  };

  PhotoBase.prototype.onClick = null;

  window.PhotoBase = PhotoBase;
})();
