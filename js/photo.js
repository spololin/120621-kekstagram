/* global inherit: true, PhotoBase: true*/
'use strict';

(function() {
  /**
   * Конструктор фотографии в общем списке
   * @param {object} data - данные одной фотографии
   * @constructor
   */
  function Photo(data) {
    this._data = data;
    this.onPhotoClick = this.onPhotoClick.bind(this);
  }

  inherit(Photo, PhotoBase);

  /**
   * Отображение DOM-элемента по шаблону для фотографии в списке
   * @method
   * @override
   */
  Photo.prototype.render = function() {
    var template = document.querySelector('#picture-template');

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

    this.element.addEventListener('click', this.onPhotoClick);
  };

  /**
   * Обработчик клика по фотографии в общем списке фотографий
   * @method
   * @listens click
   * @param evt
   * @override
   */
  Photo.prototype.onPhotoClick = function(evt) {
    evt.preventDefault();
    if (
      this.element.classList.contains('picture') &&
      !this.element.classList.contains('picture-load-failure')
    ) {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };

  /**
   * Метод удаления обработчиков событий с DOM-элемента фотографии и удаления элемента из DOM-дерева
   * @method
   * @override
   */
  Photo.prototype.remove = function() {
    this.element.removeEventListener('click', this._onPhotoClick);
  };


  window.Photo = Photo;
})();
