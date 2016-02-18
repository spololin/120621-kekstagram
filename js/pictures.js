/* global Photo: true, Gallery: true */

'use strict';

(function() {
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var activeFilter = 'filter-popular';
  var pictures = [];
  var filteredPictures = [];
  var renderedPictures = [];
  var currentPage = 0;
  var PAGE_SIZE = 12;
  var gallery = new Gallery();

  //обработчик скролла
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (loadedNextPage()) {
        renderPictures(++currentPage);
      }
    }, 100);
  });

  // проверка необходимости загрузки новой страницы
  function loadedNextPage() {
    return ((container.getBoundingClientRect().bottom - 182 <= window.innerHeight) && (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)));
  }

  //отрисовка картинок
  function renderPictures(pageNumber, replace) {
    if (replace) {
      currentPage = 0;
      //var renderedPictures = document.querySelectorAll('.picture');
      //Array.prototype.forEach.call(renderedPictures, function(picture) {
      //  picture.removeEventListener('click', _onClick);
      //  container.removeChild(picture);
      //});
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
      //elementPicture.element.addEventListener('click', _onClick);

      elementPicture.onClick = function() {
        gallery.setData(elementPicture.getData());
        gallery.render();
      };
      return elementPicture;
    }));

    //pagePictures.forEach(function(picture) {
    //  var elementPicture = new Photo(picture);
    //  elementPicture.render();
    //  fragment.appendChild(elementPicture.element);
    //  elementPicture.element.addEventListener('click', _onClick);
    //});

    container.appendChild(fragment);

    while (loadedNextPage()) {
      renderPictures(++currentPage);
    }
  }

  //function _onClick(evt) {
  //  evt.preventDefault();
  //  gallery.show();
  //}

  //функция получения массива по ajax
  function getPictures() {
    container.classList.add('pictures-loading');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/pictures.json', true);
    xhr.timeout = 10000;

    xhr.onload = function(evt) {
      pictures = JSON.parse(evt.srcElement.response);
      setActiveFilter(activeFilter, true);
      container.classList.remove('pictures-loading');
      filters.classList.remove('hidden');
      //gallery.setCurrentPicture(matchedHash[1]);
      //gallery.show();
    };

    xhr.onerror = function() {
      container.classList.remove('pictures-loading');
      container.classList.add('pictures-failure');
      filters.classList.add('hidden');
    };

    xhr.send();
  }

  //функция установки активного фильтра и отрисовки картинок по фильтру
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

  //обработчик клика по фильтрам
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  getPictures();

})();
