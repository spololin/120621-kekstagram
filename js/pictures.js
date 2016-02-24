///* global Gallery: true, Photo: true */

/* global requirejs: true */

'use strict';

requirejs.config({
  baseURI: 'js'
});

define([
  'gallery',
  'photo'
], function(Gallery, Photo) {
  /**
   * Контейнер для всех загруженных фотографий
   * @type {Element}
   */
  var container = document.querySelector('.pictures');

  /**
   * Форма с фильтрами
   * @type {Element}
   */
  var filters = document.querySelector('.filters');

  /**
   * Активный фильтр
   * @type {string}
   */
  var activeFilter = 'filter-popular';

  /**
   * Массив объектов загруженных фотографий
   * @type {Photo[]}
   */
  var pictures = [];

  /**
   * Массив отфильтрованных фотографий
   * @type {Photo[]}
   */
  var filteredPictures = [];

  /**
   * Массив отрисованных фотографий
   * @type {Photo[]}
   */
  var renderedPictures = [];

  /**
   * Текущая страница с фотографиями
   * @type {number}
   */
  var currentPage = 0;

  /**
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;

  /**
   * @type (Gallery)
   */
  var gallery = new Gallery();

  /**
   * Таймаут для строла
   */
  var scrollTimeout;

  /**
   * Событие скролла
   */
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (loadedNextPage()) {
        renderPictures(++currentPage, false);
      }
    }, 100);
  });

  /**
   * Проверка необходимости загрузки новой страницы
   * @returns {boolean}
   */
  function loadedNextPage() {
    var PICTURE_HEIGHT = 182;// Высота одного фото
    return ((container.getBoundingClientRect().bottom - PICTURE_HEIGHT <= window.innerHeight) && (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)));
  }

  /**
   * Отрисовка картинок
   * @param {number} pageNumber - номер страницы отображения
   * @param {boolean} replace - если истина, то удаляет все существующие DOM-элементы с фотографиями
   */
  function renderPictures(pageNumber, replace) {
    if (replace) {
      currentPage = 0;
      var el;
      while ((el = renderedPictures.shift())) {
        container.removeChild(el.element);
        el.onClick = null;
        el.remove();
      }
    }

    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = filteredPictures.slice(from, to);

    renderedPictures = renderedPictures.concat(pagePictures.map(function(picture) {
      var elementPicture = new Photo(picture);
      elementPicture.setData(picture);
      elementPicture.render();
      fragment.appendChild(elementPicture.element);

      elementPicture.onClick = function() {
        gallery.setData(elementPicture.getData());
        gallery.render();
      };

      return elementPicture;
    }));

    container.appendChild(fragment);

    while (loadedNextPage()) {
      renderPictures(++currentPage, false);
    }
  }

  /**
   * Функция получения массива по ajax
   */
  function getPictures() {
    container.classList.add('pictures-loading');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/pictures.json', true);
    xhr.timeout = 10000;

    xhr.addEventListener('load', function(evt) {
      pictures = JSON.parse(evt.srcElement.response);
      setActiveFilter(activeFilter, true);
      container.classList.remove('pictures-loading');
      filters.classList.remove('hidden');
    });

    xhr.addEventListener('error', function() {
      container.classList.remove('pictures-loading');
      container.classList.add('pictures-failure');
      filters.classList.add('hidden');
    });

    xhr.send();
  }

  /**
   * Функция установки активного фильтра и отрисовки картинок по фильтру
   * @param id - устанавливаемый фильтр
   */
  function setActiveFilter(id, force) {

    if (activeFilter === id && !force) {
      return;
    }

    filteredPictures = pictures.slice(0);

    switch (id) {
      case 'filter-popular':
        break;
      case 'filter-new':
        /*
        @var LAST_TWO_WEEK = 14 * 24 * 60 *60 * 1000 - 2 недели
        @var ONE_DAY = 1 * 24 * 60 * 60 * 1000 - 1 день
         */
        var TWO_WEEK = 1209600000;
        var ONE_DAY = 86400000;
        var lastTwoWeek = new Date() - TWO_WEEK - ONE_DAY;
        filteredPictures = filteredPictures.filter(
          function(value) {
            var datePictureParse = Date.parse(value.date);
            return (datePictureParse >= lastTwoWeek && datePictureParse <= new Date());
          }
        ).sort(function(a, b) {
          return b.date - a.date;
        });
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    gallery.setPictures(filteredPictures);
    renderPictures(0, true);
    activeFilter = id;
  }

  /**
   * Обработчик клика по фильтрам
   */
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  getPictures();

});
