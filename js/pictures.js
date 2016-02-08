'use strict';

(function() {
  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');
  var activeFilter = 'filter-popular';
  var pictures = [];
  var filteredPictures = [];
  var currentPage = 0;
  var PAGE_SIZE = 12;

  //обработчик скролла
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    var scrollTimeout = setTimeout(function() {
      var picturesCoordinates = container.getBoundingClientRect();
      var viewportSize = window.innerHeight;
      if (picturesCoordinates.bottom <= viewportSize) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          renderPictures(++currentPage);
        }
      }
    }, 100);
  });

  // функция для работы с картинками
  function addPicture(picture) {
    var element = template.content.children[0].cloneNode(true);
    element.querySelector('.picture-likes').textContent = picture.likes;
    element.querySelector('.picture-comments').textContent = picture.comments;

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

    return element;
  }

  //отрисовка картинок
  function renderPictures(pageNumber, replace) {
    if (replace) {
      container.innerHTML = '';
    }
    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = filteredPictures.slice(from, to);
    pagePictures.forEach(function(picture) {
      var element = addPicture(picture);
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }

  //функция получения массива по ajax
  function getPictures() {
    container.classList.add('pictures-loading');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/pictures.json', true);
    xhr.timeout = 10000;
    xhr.onload = function(evt) {
      pictures = JSON.parse(evt.srcElement.response);
      renderPictures(0);
      setActiveFilter(activeFilter, true);
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

    renderPictures(0, true);

    //провекра вывода фото, если есть свободное место
    if (container.getBoundingClientRect().bottom <= window.innerHeight) {
      renderPictures(currentPage++);
    }

    activeFilter = id;
  }

  //делегирование клика по фильтрам
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  getPictures();

})();
