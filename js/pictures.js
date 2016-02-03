'use strict';

(function() {
  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');

  // функция для работы с картинками
  function addPicture(picture) {
    var element = template.content.children[0].cloneNode(true);
    element.querySelector('.picture-likes').textContent = picture.likes;
    element.querySelector('.picture-comments').textContent = picture.comments;
    container.appendChild(element);

    // добавляем картинки
    var imgTag = element.querySelector('img');
    var image = new Image(182, 182);
    var imageLoadTimeout;

    // обработка событий загрузки картинок
    image.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(image, imgTag);
    };

    image.onerror = function() {
      element.classList.add('picture-load-failure');
    };
    image.src = picture.url;

    // обработка ожидания сервера с исходниками
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);
  }

  //отрисовка картинок
  function renderPictures(pictures) {
    pictures.forEach(function(picture) {
      addPicture(picture);
    });
  }

  //функция получения массива по ajax
  function getPictures() {
    container.classList.add('pictures-loading');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json', true);
    xhr.timeout = 10000;
    xhr.onload = function(evt) {
      var loadedPictures = JSON.parse(evt.srcElement.response);
      renderPictures(loadedPictures);
      container.classList.remove('pictures-loading');
      filters.classList.remove('hidden');
    };
    xhr.onerror = function() {
      container.classList.remove('pictures-loading');
      container.classList.add('pictures-failure');
      filters.classList.add('hidden');
    };
    xhr.send();
  }

  getPictures();

})();
