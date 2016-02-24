'use strict';

(function() {

  /**
   * Конструктор галереи
   * @constructor
   */
  function Gallery() {
    /**
     * Галерея на странице
     * @type {HTMLElement}
     */
    this.element = document.querySelector('.gallery-overlay');

      /**
       * Крест для закрытия галереи
       * @type {HTMLElement}
       * @private
       */
    this._closeButton = document.querySelector('.gallery-overlay-close');

      /**
       * Контейнер для фотографии
       * @type {HTMLElement}
       * @private
       */
    this._photo = document.querySelector('.gallery-overlay-image');

      /**
       * Контейнер для лайков
       * @type {HTMLElement}
       * @private
       */
    this._likes = document.querySelector('.gallery-overlay-controls-like');

      /**
       * Количество лайков
       * @type {HTMLElement}
       * @private
       */
    this._likesCount = document.querySelector('.likes-count');

      /**
       * Контейнер для комментариев
       * @type {HTMLElement}
       * @private
       */
    this._comments = document.querySelector('.gallery-overlay-controls-comments');

      /**
       * список фотографий из json
       * @type {Array}
       */
    this.pictures = [];

      /**
       * Текущая фотография
       * @type {number}
       * @private
       */
    this._currentPicture = 0;

      /**
       * Подписка на событие клика по фотографии
       * @type {function(this:Gallery)}
       * @private
       */
    this._on_photoClick = this._on_photoClick.bind(this);

      /**
       * Подписка на событие нажатия клавиши на клавиатуре
       * @type {function(this:Gallery)}
       * @private
       */
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);

      /**
       * Подписка на событие нажатия на крестик для загрытия галереи
       * @type {function(this:Gallery)}
       * @private
       */
    this._onCloseClick = this._onCloseClick.bind(this);

      /**
       * Подписка на событие лайка фотографии
       * @type {function(this:Gallery)}
       * @private
       */
    this._onSetLike = this._onSetLike.bind(this);
  }

  /**
   * Вызывающий метод для отображения галереи
   * @method
   */
  Gallery.prototype.render = function() {
    this.show();
    this.setCurrentPicture(this._currentPicture);
  };

  /**
   * Основной метод для отображения галереи
   * @method
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._photo.addEventListener('click', this._on_photoClick);
    this._likes.addEventListener('click', this._onSetLike);
    window.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Основной метод закрытия галереи
   * @method
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._photo.removeEventListener('click', this._on_photoClick);
    this._likes.removeEventListener('click', this._onSetLike);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Метод события нажатия крестика для закрытия фотогалерии
   * @method
   * @listens click
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Метод события нажатия на фотогалерею
   * @method
   * @listens click
   * @private
   */
  Gallery.prototype._on_photoClick = function() {
    this.setNextPictureIndex();
    this.setCurrentPicture(this._currentPicture);
  };

  /**
   * Метод события нажатия на клавишу клавиатуры
   * @method
   * @listens click
   * @param {Event} evt - событие нажатия клавиши
   * @private
   */
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
      this.setCurrentPicture(this._currentPicture);
    }
  };

  /**
   * Mетод массив фотографий из json сохраняет в объекте
   * @method
   * @param {Photo[]} pictures - массив фотографий
   */
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  /**
   * Метод устанавливает фотографию, которую отображает галерея
   * @method
   * @param {number} index - индекс фотографии в массиве
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    this._photo.src = this.pictures[index].url;
    this._likes.querySelector('.likes-count').textContent = this.pictures[index].likes;
    this._comments.querySelector('.comments-count').textContent = this.pictures[index].comments;

    if (this.pictures[index].setLike === true) {
      this._likesCount.classList.add('likes-count-liked');
    } else {
      this._likesCount.classList.remove('likes-count-liked');
    }
  };

  /**
   * Метод устанавливает объект-фотографию из JSON
   * @method
   * @param {object} data
   */
  Gallery.prototype.setData = function(data) {
    this._data = data;
    this._currentPicture = this.getNumberPicture(data.url);
  };

  /**
   * Метод возвращает номер фотограции в массиве
   * @method
   * @param {string} url - имя фотографии
   * @returns {number}
   */
  Gallery.prototype.getNumberPicture = function(url) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (url === this.pictures[i].url) {
        this._currentPicture = i;
        return i;
      }
    }
  };

  /**
   * Устанавливает отображаемой следующюю фотографию
   * @method
   */
  Gallery.prototype.setNextPictureIndex = function() {
    if (this.pictures[this._currentPicture + 1]) {
      this._currentPicture++;
    }
  };

  /**
   * Устанавливает отображаемой предыдущую фотографию
   * @method
   */
  Gallery.prototype.setPrevPictureIndex = function() {
    if (this.pictures[this._currentPicture - 1]) {
      this._currentPicture--;
    }
  };

  /**
   * Метод лайканья на фотографии
   * @method
   * @private
   */
  Gallery.prototype._onSetLike = function() {
    var currentObject = this.pictures[this._currentPicture];
    if (currentObject.setLike !== true) {
      currentObject.likes = currentObject.likes + 1;
      this._likesCount.classList.add('likes-count-liked');
      this._likesCount.innerHTML = currentObject.likes;
      currentObject.setLike = true;
    } else {
      currentObject.likes = currentObject.likes - 1;
      this._likesCount.classList.remove('likes-count-liked');
      this._likesCount.innerHTML = currentObject.likes;
      currentObject.setLike = false;
    }
  };

  window.Gallery = Gallery;
})();
