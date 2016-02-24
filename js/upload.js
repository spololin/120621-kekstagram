///* global docCookies: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

define([
  'resizer'
], function(Resizer) {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */

  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    var valueLeft = +resizeForm['resize-x'].value;
    var valueTop = +resizeForm['resize-y'].value;
    var valueSize = +resizeForm['resize-size'].value;

    if ((valueTop !== '') && (valueLeft !== '') && (valueSize !== '')) {
      var checkWidth = function() {
        if (valueLeft >= 0 ) {
          if ((valueLeft + valueSize) <= currentResizer._image.naturalWidth) {
            return true;
          }
        }
      };
      var checkHeight = function() {
        if (valueTop >= 0) {
          if ((valueTop + valueSize) <= currentResizer._image.naturalHeight) {
            return true;
          }
        }
      };
      if (checkHeight() && checkWidth()) {
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];
  var uploadResizeControls = resizeForm.querySelector('.upload-resize-controls');
  var errorResize = uploadResizeControls.querySelector('.input-error');
  var buttonSubmit = resizeForm.elements['resize-fwd'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
          setTimeout(updateConstraint, 1);
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Обработчик изменения формы с данными и установка новых значений для кадра
   */
  resizeForm.addEventListener('change', function() {
    validateForm(resizeFormIsValid());
    currentResizer.setConstraint(+resizeForm.elements['resize-x'].value, +resizeForm.elements['resize-y'].value, +resizeForm.elements['resize-size'].value);
  });

  /**
   * Установка ограничений на отправку данных и отображение предупреждения
   * @param {boolean} valid
   */
  function validateForm(valid) {
    if (valid) {
      buttonSubmit.style.display = 'block';
      if (errorResize) {
        uploadResizeControls.removeChild(errorResize);
        errorResize = '';
      }
    } else {
      buttonSubmit.style.display = 'none';
      if (!errorResize) {
        errorResize = document.createElement('div');
        errorResize.className = 'input-error';
        errorResize.style.position = 'absolute';
        errorResize.style.bottom = '-50%';
        errorResize.style.left = '50%';
        errorResize.style.marginLeft = '-25%';
        errorResize.style.color = 'red';
        errorResize.innerHTML = 'Проверьте введенные данные';
        uploadResizeControls.appendChild(errorResize);
      }
    }
  }

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    docCookies.setItem('filter', getRadioButton(), getDiffDate());

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  /**
   * Проверяем какая радиокнопка выделена и получаем ее значение
   * @returns {string}
   */
  function getRadioButton() {
    var radioCollection = filterForm.getElementsByTagName('input');
    for (var i = 0; i < radioCollection.length; i++) {
      if (radioCollection[i].type === 'radio' && radioCollection[i].checked) {
        return radioCollection[i].value;
      }
    }
  }

  /**
   * Установка радиокнопки при загрузке страницы
   */
  function setRadioButton() {
    var elements = filterForm['upload-filter'];
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].value === docCookies.getItem('filter')) {
        elements[i].checked = true;
        filterImage.className = 'filter-image-preview ' + 'filter-' + docCookies.getItem('filter');
      }
    }
  }

  /**
   * Получаем кол-во дней с последнего дня рождения
   * @returns {string}
   */
  function getDiffDate() {
    var today = new Date();
    var currentYear = today.getFullYear();
    var lastBirthday = new Date(currentYear, 0, 2);
    var daysPassed = Math.floor((today - lastBirthday) / 86400000);
    var dateToExpire = today.valueOf() + daysPassed * 24 * 60 * 60 * 1000;
    return new Date(dateToExpire).toUTCString();
  }

  /**
   * Получение значений смещений и размера кадра в поля формы
   */
  function updateConstraint() {
    var constraint = currentResizer.getConstraint();
    resizeForm['resize-x'].value = Math.floor(constraint.x);
    resizeForm['resize-y'].value = Math.floor(constraint.y);
    resizeForm['resize-size'].value = Math.floor(constraint.side);
    validateForm(resizeFormIsValid());
  }

  /**
   * Установка значений смещения на форму
   */
  window.addEventListener('resizerchange', updateConstraint);

  setRadioButton();
  cleanupResizer();
  updateBackground();
});
