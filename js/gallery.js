'use strict';

(function() {

  function Gallery() {
    this.element = document.querySelector('.gallery-overlay');
    this.closeButton = document.querySelector('.gallery-overlay-close');
    this.photo = document.querySelector('.gallery-overlay-image');
    this.likes = document.querySelector('.gallery-overlay-controls-like');
    this.likesCount = document.querySelector('.likes-count');
    this.comments = document.querySelector('.gallery-overlay-controls-comments');
    this.pictures = [];
    this.currentPicture = 0;
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onSetLike = this._onSetLike.bind(this);
  }

  Gallery.prototype.render = function() {
    this.show();
    this.setCurrentPicture(this.currentPicture);
  };

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.closeButton.addEventListener('click', this._onCloseClick);
    this.photo.addEventListener('click', this._onPhotoClick);
    this.likes.addEventListener('click', this._onSetLike);
    window.addEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this.closeButton.removeEventListener('click', this._onCloseClick);
    this.photo.removeEventListener('click', this._onPhotoClick);
    this.likes.removeEventListener('click', this._onSetLike);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setNextPictureIndex();
    this.setCurrentPicture(this.currentPicture);
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    } else {
      if (evt.keyCode === 39) {
        this.setNextPictureIndex();
      }

      if (evt.keyCode === 37) {
        this.setPrevPictureIndex();
      }
      this.setCurrentPicture(this.currentPicture);
    }
  };

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  Gallery.prototype.setCurrentPicture = function(index) {
    this.photo.src = this.pictures[index].url;
    this.likes.querySelector('.likes-count').textContent = this.pictures[index].likes;
    this.comments.querySelector('.comments-count').textContent = this.pictures[index].comments;

    if (this.pictures[index].liked === true) {
      this.likesCount.classList.add('likes-count-liked');
    } else {
      this.likesCount.classList.remove('likes-count-liked');
    }
  };

  Gallery.prototype.setData = function(data) {
    this._data = data;
    this.currentPicture = this.getNumberPicture(data.url);
  };

  Gallery.prototype.getNumberPicture = function(url) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (url === this.pictures[i].url) {
        this.currentPicture = i;
        return i;
      }
    }
  };

  Gallery.prototype.setNextPictureIndex = function() {
    if (this.pictures[this.currentPicture + 1]) {
      this.currentPicture++;
    }
  };

  Gallery.prototype.setPrevPictureIndex = function() {
    if (this.pictures[this.currentPicture - 1]) {
      this.currentPicture--;
    }
  };

  Gallery.prototype._onSetLike = function() {
    var currentObject = this.pictures[this.currentPicture];
    if (currentObject.setLike !== true) {
      currentObject.likes = currentObject.likes + 1;
      this.likesCount.classList.add('likes-count-liked');
      this.likesCount.innerHTML = currentObject.likes;
      currentObject.setLike = true;
    } else {
      currentObject.likes = currentObject.likes - 1;
      this.likesCount.classList.remove('likes-count-liked');
      this.likesCount.innerHTML = currentObject.likes;
      currentObject.setLike = false;
    }
  };

  window.Gallery = Gallery;
})();
