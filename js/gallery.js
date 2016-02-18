'use strict';

(function() {
  function Gallery() {
    this.element = document.querySelector('.gallery-overlay');
    this.closeButton = document.querySelector('.gallery-overlay-close');
    this.photo = document.querySelector('.gallery-overlay-image');
    this.likes = document.querySelector('.gallery-overlay-controls-like');
    this.comments = document.querySelector('.gallery-overlay-controls-comments');
    this.pictures = [];
    this.currentImage = 0;
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
  }

  Gallery.prototype.render = function() {
    this.show();
    this.setCurrentPicture(0);
  };

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.closeButton.addEventListener('click', this._onCloseClick);
    this.photo.addEventListener('click', this._onPhotoClick);
    window.addEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this.closeButton.removeEventListener('click', this._onCloseClick);
    this.photo.addEventListener('click', this._onPhotoClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onPhotoClick = function() {
    if (this.pictures[this.currentImage + 1]) {
      ++this.currentImage;
    } else {
      this.currentImage = 0;
    }
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }
  };

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  Gallery.prototype.setCurrentPicture = function(index) {
    var picture;
    if (typeof key === 'number') {
      picture = this.pictures[index];
    } else {
      for (var i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].url === index) {
          picture = this.pictures[i];
          break;
        }
      }
    }
    this.photo.src = picture.url;
    this.likes.querySelector('.likes-count').textContent = picture.likes;
    this.comments.querySelector('.comments-count').textContent = picture.comments;
  };

  Gallery.prototype.setData = function(data) {
    this._data = data;
  };

  Gallery.prototype.getData = function() {
    return this._data;
  };

  window.Gallery = Gallery;
})();
