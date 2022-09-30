"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/*var base_url    = "http://d2.loc/";
var VK_API_ID   = 4141984;
var VK_GROUP_ID = 75027802;
var formKey = $('.e1846beb0ef64af2e45019ff7d64cd40');*/
var base_url = "/";
var VK_API_ID = 4228296;
var VK_GROUP_ID = 20793074;
var formKey = $('.e1846beb0ef64af2e45019ff7d64cd40');
/*
*   search          - каким элементам будем назначать событие
*   attr            - атрибут, которые мы вытаскиваем у объекта
*   searchTextarea  - тестовая область куда будет подставляться ббкод
*   left,right      - как обрамлять ббкод
*   end             - ставить ли закрываюший тег
*   type            - bb, hero, item, smile
*/

function publicBBcodes(search, attr, searchTextarea, type, left, right, end) {
  $(search).off('click').click(function (e) {
    e.preventDefault();
    var bbcod = $(this).attr(attr);
    var textareaID = $(searchTextarea).attr('id');
    var dataEnd = $(this).attr('data-end');

    if (type == 'bb') {
      if (end == 'yes' && dataEnd != 'no') addBB(textareaID, '[' + bbcod + ']', '[/' + bbcod + ']');else addBB(textareaID, left + bbcod + right, '');
    }

    if (type == 'colors') addBB(textareaID, '[color=' + bbcod + ']', '[/color]');

    if (type == '@') {
      var linkName = $(this).attr('data-name');
      addBB(textareaID, '[b]' + linkName + '[/b] ', '');
    } //if(type == 'smile') addBB(searchTextarea, ':'+bbcod+':', '');
    //if(type == 'item')  addBB(searchTextarea, '[item='+bbcod+']', '');
    //if(type == 'hero')  addBB(searchTextarea, '[hero='+bbcod+']', '');
    //if(type == 'skill') addBB(searchTextarea, '[skill='+bbcod+']', '');

  });
} //  ББкоды
//-----------------------------------------------------------------------------------------------------------------


function addBB(textarea, ltag, rtag) {
  rtag = rtag.replace(/=([^\]]+)?/, '');
  var textarea = document.getElementById(textarea);
  textarea.focus();

  if (rtag != 'undefined') {
    if (document.selection && document.selection.createRange) {
      sel = document.selection.createRange();
      if (sel.parentElement() == textarea) sel.text = ltag + sel.text + rtag;
    } else if (_typeof(textarea) != undefined) {
      var start = textarea.selectionStart,
          end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + ltag + textarea.value.substring(start, end) + rtag + textarea.value.substring(end, textarea.value.length | 0);
    } else textarea.value += ltag + rtag;
  } else {
    if (document.selection && document.selection.createRange) {
      sel = document.selection.createRange();
      if (sel.parentElement() == textarea) sel.text = sel.text + ltag;
    } else if (_typeof(textarea) != undefined) {
      var start = textarea.selectionStart,
          end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + textarea.value.substring(start, end) + ltag + textarea.value.substring(end, textarea.value.length | 0);
    } else textarea.value += ltag;
  }
} //Создаем иконку загрузки


function controlLoadIcon(type) {} //Создаем оповещения юзера об успешном ajax запросе


var noticeTimeout;

function createNotice(text, type, time) {
  var current_text = '<div class="bg"></div><div class="text">' + text + '</div>';
  time = time === undefined ? 5 : time; //Удаляем страные сообщения

  $('.ajax-notice').remove(); //Если не задан тип - значит запрос выполнен успешно

  var notice = $('<div class="ajax-notice ajax-notice-' + (type === undefined ? 'success' : 'error') + '">' + current_text + '</div>').on('click', function () {
    $(this).fadeOut(200, function () {
      $(this).remove();
    });
  }).hide().appendTo('body').fadeIn(200);
  noticeTimeout = setTimeout(function () {
    $('.ajax-notice').fadeOut(200, function () {
      $(this).remove();
    });
  }, time * 1000);
  if (time === false) clearTimeout(noticeTimeout);
  return notice;
} //Проверка на существование объекта


function check_exist(object, value) {
  //Достаем объект
  var $object = $(object);
  if ($object.attr(value) != undefined) return $object;else return false;
}
/* Проверяет переменную на существование */


function isset(variable) {
  return variable != undefined;
}
/* Проверяет переменную на пустоту */


function empty(variable) {
  return variable == '';
}
/**
 * Что это за ужас? Я пока оставлю таким образом
 * В будущем обязательно эту чушь переписать
 *
 * @param html_popup
 */


function popup_show(html_popup) {
  $('body').css('overflow', 'hidden').css('padding-right', '14px').append(html_popup);
  /* Поп-апы */

  $('.global-content__unique--modal-window').find('.global-content__modal-window--btn-close').off('click').on('click', function () {
    popup_hide();
  });
  $('.global-content__unique--modal-window').off('click').on('click', function (e) {
    if ($(this).find('.js-prevent-close-on-lose-focus').length > 0) {
      return;
    }

    if (e.target == this) {
      popup_hide();
    }
  });
  $(window).off('keyup').on('keyup', function (e) {
    switch (e.keyCode) {
      /* Закрытие попапов по ESC */
      case 27:
        $('.global-content__unique--modal-window').trigger('click');
        break;
    }
  });
}
/**
 * Аналогично, от всего этого рудимента избавиться!
 */


function popup_hide() {
  $('body').css('overflow', 'auto').css('padding-right', '0px');
  $('.global-content__unique--modal-window:not(.js-overlay-hide), .popup-overlay').remove();
  $('.global-content__unique--modal-window.js-overlay-hide').hide();
} // By Addsky
// Вкладки новостей на главной


$(document).ready(function () {
  $('#news-categories').on('click', 'li', function () {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        document.getElementById('news-categories-blocks').innerHTML = req.responseText;
      }
    };

    req.open('POST', '/news/cat_for_main/', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send('category=' + $(this).html());
    $('#news-categories').find('.btn-global--active').removeClass('btn-global--active');
    $(this).addClass('btn-global--active');
  });
}); // Считаем статистику, на какие ссылки нажимают люди

function linkStats(from, page, category) {
  alert(1);
  var req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      alert(req.responseText);
    }
  };

  req.open('POST', '/link_stats/', true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send('from=' + from + '&page=' + page + '&category=' + category);
}

function getUrlParams() {
  var urlParams;

  var match,
      pl = /\+/g,
      // Regex for replacing addition symbol with a space
  search = /([^&=]+)=?([^&]*)/g,
      decode = function decode(s) {
    return decodeURIComponent(s.replace(pl, " "));
  },
      query = window.location.search.substring(1);

  urlParams = {};

  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }

  return urlParams;
}

function getSelectionText() {
  var text = "";

  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }

  return text;
} // Возвращает функцию, которая не будет срабатывать, пока продолжает вызываться.
// Она сработает только один раз через N миллисекунд после последнего вызова.
// Если ей передан аргумент `immediate`, то она будет вызвана один раз сразу после
// первого запуска.


function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
} // Изменяет title и description страницы активностей профиля пользователя


function changeTitleDescription() {
  user_title = $('#globalUsername').val();
  var urlPage = document.location.href;
  var selectedTabBtnPage = urlPage.split('/')[7];
  var selectedLinkPage = urlPage.split('/')[8];

  if (selectedLinkPage != '') {
    selectedLinkPage = selectedLinkPage.split('-')[1];
  }

  switch (selectedTabBtnPage) {
    case 'posts':
      selectedTabBtnPage = 'Посты';
      break;

    case 'topics':
      selectedTabBtnPage = 'Темы';
      break;

    case 'site-comments':
      selectedTabBtnPage = 'Комментарии';
      break;

    case 'site-guides':
      selectedTabBtnPage = 'Гайды';
      break;

    case 'site-memes':
      selectedTabBtnPage = 'Мемы';
      break;

    case 'site-news':
      selectedTabBtnPage = 'Новости';
      break;

    default:
      selectedTabBtnPage = 'Страница';
  }

  if (selectedTabBtnPage != 'Страница') {
    if (selectedTabBtnPage != '') {
      if (selectedLinkPage != '') {
        document.title = selectedTabBtnPage + ' пользователя ' + user_title + ' | Страница ' + selectedLinkPage;
        document.querySelector('meta[name="description"]').setAttribute("content", selectedTabBtnPage + ' пользователя ' + user_title + ' | Страница ' + selectedLinkPage);
      } else {
        document.title = selectedTabBtnPage + ' пользователя ' + user_title;
        document.querySelector('meta[name="description"]').setAttribute("content", selectedTabBtnPage + ' пользователя ' + user_title);
      }
    }
  } else {
    document.title = user_title + '| Профиль пользователя';
    document.querySelector('meta[name="description"]').setAttribute("content", user_title + '| Профиль пользователя');
  }
}
