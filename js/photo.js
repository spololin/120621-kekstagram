'use strict';

(function() {
  var template = document.querySelector('#picture-template');

  function Photo(data) {
    this._data = data;
  }

  Photo.prototype.render = function() {

    if ('content' in template) {
      this.element = template.content.childNodes[1].cloneNode(true);
    } else {
      this.element = template.childNodes[1].cloneNode(true);
    }

    this.element.querySelector('.picture-likes').textContent = this._data.likes;
    this.element.querySelector('.picture-comments').textContent = this._data.comments;

    var imgTag = this.element.querySelector('img');
    var image = new Image(182, 182);
    var imageLoadTimeout;

    image.addEventListener('load', function() {
      clearTimeout(imageLoadTimeout);
      this.element.replaceChild(image, imgTag);
    }.bind(this));

    image.addEventListener('error', function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this));

    image.src = this._data.url;

    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      this.element.classList.add('picture-load-failure');
    }.bind(this), IMAGE_TIMEOUT);
  };

  window.Photo = Photo;
})();
