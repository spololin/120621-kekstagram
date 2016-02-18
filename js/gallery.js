'use strict';

(function() {
  var numberPicture = 0;

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
    this.setCurrentPicture(numberPicture);
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
      this.setCurrentPicture(++this.currentImage);
    }
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    } else {
      if (evt.keyCode === 39) {
        if (this.currentImage === this.pictures.length - 1) {
          this.currentImage = 0;
        } else {
          ++this.currentImage;
        }
      }

      if (evt.keyCode === 37) {
        if (this.currentImage === 0) {
          this.currentImage = this.pictures.length - 1;
        } else {
          --this.currentImage;
        }
      }
      this.setCurrentPicture(this.currentImage);
    }
  };

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  Gallery.prototype.setCurrentPicture = function(index) {
    var picture;
    if (typeof index === 'number') {
      picture = this.pictures[index];
    }

    this.photo.src = this.pictures[index].url;
    this.likes.querySelector('.likes-count').textContent = picture.likes;
    this.comments.querySelector('.comments-count').textContent = picture.comments;
  };

  Gallery.prototype.setData = function(data) {
    this._data = data;
    numberPicture = this.getNumberPicture(data.url);
  };

  Gallery.prototype.getData = function() {
    return this._data;
  };

  Gallery.prototype.getNumberPicture = function(url) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (url === this.pictures[i].url) {
        this.currentImage = i;
        return i;
      }
    }
  };

  window.Gallery = Gallery;
})();
