"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Переписал часть сломанного функционала под чистый js
// Остальное работает, следовательно трогать не надо
var category = '',
    type = '',
    section = '',
    reply_author_id = '',
    comments_offset = 0,
    rating_message_id = null,
    rating_message_type = null,
    rating_current = null,
    shareBlockTimer,
    waiter = false;
/**
 * Форма
 *
 * @param textarea
 * @param submit
 * @param message
 * @returns {jQuery|HTMLElement}
 */

function get_form(textarea, submit) {
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return $("\n    <div class=\"forum-theme__form news-comment-form comments-form-add\" data-smiles data-target=\"#".concat(textarea, "\">\n        <textarea id=\"").concat(textarea, "\" class=\"comments-textarea\" name=\"text\" \n                placeholder=\"\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439\" data-caret=\"0\" data-autoresize required>").concat(message, "</textarea>\n  \n        <div class=\"forum-theme__form-block bbcodes\">\n            <a id=\"b\" class=\"bbcode_b-insert\" title=\"[b]\u0416\u0438\u0440\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442[/b]\" href=\"#\">\n                <img src=\"/img/forum-theme/B.svg\" alt=\"\">\n            </a>\n            <a id=\"img\" class=\"bbcode_img-insert\" title=\"[img]\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443[/img]\" href=\"#\">\n                <img src=\"/img/forum-theme/kartina.svg\" alt=\"\">\n            </a>\n            <a class=\"smiles-panel__smiles-btn\">\n                <i class=\"fas fa-smile\"></i>\n            </a>\n            <button class=\"no-margin\" type=\"button\" ").concat(submit, ">\n                \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C\n            </button>\n        </div>\n        \n        <input type=\"hidden\" name=\"parent_id\" value=\"\">\n        <input type=\"hidden\" name=\"level\" value=\"0\">\n    </div>"));
}

function addAutoResize() {
  document.querySelectorAll('[data-autoresize]').forEach(function (element) {
    element.style.boxSizing = 'border-box';
    var offset = element.offsetHeight - element.clientHeight;
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + offset + 'px';
  });
}

function comment_add(e) {
  e.preventDefault();

  if (waiter !== false) {
    return false;
  } else {
    waiter = true;
  }

  category = $('#comment-category').attr('data-title');
  type = $('#comment-type').attr('data-title');
  section = $('#comment-section').attr('data-title');
  var current_category = $('#comment-block-add input[name="category"]').val(),
      current_text = $(this).parents('.forum-theme__form').first().find('[name="text"]').val(),
      current_level = $('[name="level"]').val(),
      current_left_id = $('[name="left_id"]').val(),
      current_parent_id = $('[name="parent_id"]').val(),
      data = {
    section: section,
    category: current_category,
    text: current_text,
    level: current_level,
    left_id: current_left_id,
    parent_id: current_parent_id,
    reply_author_id: reply_author_id
  };
  data[TOKEN] = formKey;

  if (current_category === '' || current_text === '') {
    return createNotice('Вы заполнили не все поля', 'error');
  }

  $.ajax({
    url: '/replies/add',
    type: 'POST',
    data: data,
    success: function success(data) {
      switch (data.action) {
        case 'base64image':
          return createNotice('Изображения в формате base64 запрещены для вставки');

        case 'login':
          if (data.id == false) {
            return Utils.login();
          }

      }

      $.ajax({
        url: '/replies/getSingle/' + data.id,
        type: 'GET',
        success: function success(comment) {
          if (type === 'normal' && data.moderation === 1) {
            var parent = $(".global-content__comment-message[data-id=\"".concat(current_parent_id || 0, "\"]"));

            if (parent.length !== 0) {
              if (parent.next('article').length === 0) {
                parent.after($("\n                                    <article class=\"global-content__comment\">\n                                        <a href=\"#\" class=\"global-content__comment-hide branch-space\"></a>\n                                    </article>").append(comment));
              } else {
                parent.next('article').append(comment);
              }
            } else {
              if ($('#comment-block > .global-content__comment').length === 0) {
                $('#comment-block p.global-content__comments-empty').replaceWith("<article class=\"global-content__comment\" data-position-scrolled>\n                                    <a href=\"#\"></a>\n                                </article>");
              }

              $('#comment-block > .global-content__comment').append(comment);
            }

            $('#comment-not-enough').remove();
            document.getElementById("comment-block" + data.id).scrollIntoView();
            scrollBy({
              top: -$('#header').height(),
              behavior: "auto"
            });
          } else {
            createNotice('Комментарий успешно добавлен, но будет отображен после проверки модератора');
          }

          waiter = false;
          call_events();
          addAutoResize();
        }
      });
    }
  }); // Очищаем поле

  $(this).parents('.forum-theme__form').first().find('[name="text"]').val(''); // Убираем лишние поля ввода

  $('.comments-form-add').fadeOut(200, function () {
    $(this).remove();
  });
}

function comment_reply(e) {
  e.preventDefault();
  var place_for_form = $(this).parents('section').first(),
      form_length = place_for_form.next('.comments-form-add').length;
  $('.comments-form-add').remove();

  if (form_length !== 0) {
    return;
  } //Добавляем форму


  get_form('second-comment-textarea', 'comment-submit-add').fadeOut(0).fadeIn(200).insertAfter(place_for_form);
  $('#second-comment-textarea').focus(); // Получаем информацию

  var current_id = place_for_form.attr('data-id'),
      current_level = place_for_form.attr('data-level');

  if (current_level === '' || current_level === undefined) {
    current_level = 0;
  }

  if (current_id === '' || current_id === undefined) {
    current_id = '';
  } // Добавляем поля в форму


  var form = place_for_form.next();
  form.find('input[name="level"]').val(+current_level + 1);
  form.find('input[name="parent_id"]').val(+current_id);
  call_events();
}

function comment_menu() {
  var item = $(this).parents('.c-item').first().find('.popup-menu').first();

  if (item.is(':visible')) {
    return item.hide();
  }

  item.show();
}

function comment_approve(e) {
  e.preventDefault();
  var current_object = $(this),
      current_id = current_object.attr('data-reply-approve');
  var current_section_block = $(this).parents('.global-content__comment-message').first(),
      moder_block = current_section_block.find('#moder-block').first();
  if (current_id === '') return;
  controlLoadIcon('create');
  $.ajax({
    url: base_url + 'replies/reply_approve',
    type: 'POST',
    data: {
      reply_id: current_id,
      key: formKey
    },
    success: function success() {
      //console.log(current_section_block.attr('class'));
      current_section_block.removeClass('global-content__comment-message trash');
      current_section_block.addClass('global-content__comment-message');
      moder_block.hide();
      createNotice('Комментарий одобрен');
    }
  });
}

function comment_remove(e) {
  e.preventDefault();
  var current_id = $(this).attr('data-reply-remove'),
      current_parent = $("#comment-block".concat(current_id));
  Core.Ajax.get('/replies/removeForm', function (resp) {
    var popup = Core.Popup.create('Удаление комментария', resp.data.html, [{
      tag: 'a',
      props: {
        href: 'javascript:void(0)',
        class: 'popup-button-sim btn-global',
        text: 'Удалить',
        attrs: {
          onclick: "$('.global-content__modal-body form').submit()"
        }
      }
    }, {
      tag: 'a',
      props: {
        href: 'javascript:void(0)',
        class: 'popup-button-sim btn-global',
        text: 'Отменить',
        attrs: {
          onclick: 'Core.Popup.destroy()'
        }
      }
    }]);
    popup.find('input[name="reason"]').focus();
    popup.find('form').off('submit').on('submit', function () {
      Core.Ajax.post('/replies/remove', {
        id: current_id,
        reason: popup.find('input[name="reason"]').val()
      }, function (resp) {
        createNotice(resp.message);

        if (resp.status === 'success') {
          Core.Popup.destroy(popup);
          current_parent.next('article').remove();
          current_parent.remove();
        }
      });
    });
  });
}

function comment_report(e) {
  e.preventDefault();
  var current_object = $(this),
      current_id = current_object.attr('data-reply-report');
  if (current_id == '') return;
  controlLoadIcon('create');
  $.ajax({
    url: base_url + 'replies/report',
    type: 'POST',
    data: {
      reply_id: current_id,
      key: formKey
    },
    success: function success() {
      controlLoadIcon('destroy');
      current_object.fadeOut(200, function () {
        current_object.remove();
      });
      createNotice('Жалоба отправлена');
    }
  });
}

function comment_ban() {
  var $object = $(this),
      $parent = $object.parent(),
      $parents = $object.parents('.tooltipe'),
      current_id = $object.attr('data-reply-ban'),
      current_ban_time = $parent.find('input[type="text"]').val(),
      current_comments_remove = $parent.find('input[type="checkbox"]').is(':checked');
  if (current_id == '') return;
  controlLoadIcon('create');
  $.ajax({
    url: base_url + 'replies/ban',
    type: 'POST',
    data: {
      'reply_id': current_id,
      'ban_time': current_ban_time,
      'comments_remove': current_comments_remove
    },
    success: function success(data) {
      controlLoadIcon('destroy');
      $parents.fadeOut(200, function () {
        $object.remove();
      });
      createNotice('Пользователь заблокирован');
    }
  });
}

function comment_rating() {
  if (waiter !== false) return false;else waiter = true;
  var current_object = $(this),
      data = {
    reply_id: current_object.attr('data-reply-rating-id'),
    type: Number(current_object.attr('data-reply-rating') === "plus"),
    category: $("#comment-category").data('title')
  };
  data[TOKEN] = formKey;
  controlLoadIcon('create');
  $.ajax({
    url: base_url + 'replies/rating',
    type: 'POST',
    data: data,
    success: function success(response) {
      ajax_rating(response, current_object);
    }
  });
}
/**
 * Получаем список юзеров
 * debounce для того, чтобы юзеру не высвечивалось поле при случайном наведении
 * (высвечивается только через пол секунды)
 */


function comment_get_rated_users() {
  $('.modal-prepare-mouse-over').remove();
  var global = $('.global-main');
  var current = $(this),
      data = {
    reply_id: current.attr('data-reply-show-user-id')
  }; // Если рейтинг 0 - не отображаем меню

  if (current.html() == 0) {
    return true;
  } // Если уже есть - незачем отправлять второй запрос


  if ($("#modal-who-rate-post-".concat(data.reply_id)).length > 0) {
    return true;
  }

  data[TOKEN] = formKey;
  var back = $('#project-dota2').offset(),
      item = current.parents('.global-content__comment-like').first(),
      $item = $(Utils.createElement('div', {
    id: "modal-who-rate-post-".concat(data.reply_id),
    classList: 'modal-prepare-mouse-over',
    style: {
      left: item.offset().left + item.width() - back.left - 160 + 'px',
      top: item.offset().top - back.top - 5 + 'px'
    },
    childs: [['div', {
      classList: 'modal-who-rate-post',
      style: {
        textAlign: 'center'
      },
      childs: [['i', {
        className: 'fas fa-spinner fa-spin',
        style: {
          fontSize: '22px'
        }
      }]]
    }]]
  }));
  global.prepend($item);
  $('.modal-prepare-mouse-over').on('mouseleave', function () {
    $item.animate({
      opacity: 0
    }, 100, 'swing', function () {
      this.remove();
    });
  });
  $item.animate({
    opacity: 1
  }, 100);
  $.ajax({
    url: base_url + 'replies/show_users_who_rate_post',
    type: 'POST',
    data: data,
    success: function success(response) {
      switch (response.status) {
        case 'success':
          if (response.users.length === 0) {
            return false;
          }

          var childs = [];
          response.users.map(function (item) {
            childs.push(['div', {
              classList: 'modal-who-rate-post-user',
              childs: [['img', {
                classList: 'modal-who-rate-post-user-avatar',
                src: item['avatar_link']
              }], ['a', {
                classList: 'modal-who-rate-post-username',
                style: {
                  color: item.rate ? '#1cbb45' : '#f84e4e'
                },
                href: item['user_link'],
                innerText: item['username']
              }]]
            }]);
          });
          $('.modal-prepare-mouse-over').find('.modal-who-rate-post').first().html($(Utils.createElement('div', {
            childs: childs
          })));
          break;

        default:
          createNotice('Произошла ошибка при получении списка пользователей, оценивших пост');
      }
    }
  });
}

function ajax_rating(data, current_object) {
  waiter = false;

  switch (data.status) {
    case 'success':
      var comment_control = current_object.parents('.global-content__comment-like').first(),
          countBlock = comment_control.find('[data-reply-show-user-id]'),
          plus = comment_control.find('[data-reply-rating="plus"]'),
          minus = comment_control.find('[data-reply-rating="minus"]');

      if (data.display === true) {
        if (!!data.type) {
          plus.addClass('comment-plus');
          minus.removeClass('comment-minus');
        } else {
          minus.addClass('comment-minus');
          plus.removeClass('comment-plus');
        }
      } else {
        plus.removeClass('comment-plus');
        minus.removeClass('comment-minus');
      }

      countBlock.html(data.count);

      if (data.count > 0) {
        comment_control.addClass('global-content__color-green');
        comment_control.removeClass('global-content__color-red');
      } else if (data.count < 0) {
        comment_control.addClass('global-content__color-red');
        comment_control.removeClass('global-content__color-green');
      } else {
        comment_control.removeClass('global-content__color-green');
        comment_control.removeClass('global-content__color-red');
      }

      break;

    case 'unauthorized':
      rating_message_id = current_object.attr('data-reply-rating-id');
      rating_message_type = Number(current_object.attr('data-reply-rating') === "plus");
      rating_current = current_object;
      Utils.login();
      return createNotice('Авторизуйтесь, чтобы оценить комментарий');

    case 'banned':
      return createNotice('Ваш аккаунт находится в режиме readOnly. Вы не можете оценивать посты, пока не истечёт срок блокировки');

    case 'userNotActivated':
      return createNotice('Вы не активировали свой аккаунт. Активируйте его, чтобы получить возможность оценивать комментарии');

    case 'invalidEntry':
      return createNotice('Один из переданных параметров не указан или указан некорректно');

    case 'invalidPost':
      return createNotice('Комментарий не найден. Возможно, он был удалён');
  }
}

function moder_comment_edit(e) {
  e.preventDefault();
  var current_object = $(this),
      current_id = current_object.attr('data-reply-moder-edit'),
      current_text_block = current_object.parents('.global-content__comment-message').first().find('.global-content__comment-user--message').first();
  var current_section_block = current_object.parents('.global-content__comment-message').first(),
      moder_block = current_section_block.find('#moder-block').first();
  $.ajax({
    url: base_url + 'replies/get_single_for_edit/' + current_id,
    type: 'GET',
    dataType: 'JSON',
    success: function success(data) {
      current_text_block.html(get_form('edit-comment-textarea', 'comment-submit-edit', data.message)).fadeIn(200);
      $('#edit-comment-textarea').focus();
      call_events();
      current_text_block.find('[comment-submit-edit]').click(function () {
        var current_text = current_text_block.find('textarea').val();
        var data = {
          reply_id: current_id ^ 0,
          text: current_text
        };
        data[TOKEN] = formKey;

        if (current_text === '') {
          return;
        }

        $.ajax({
          url: base_url + 'replies/reply_edit',
          type: 'POST',
          data: data,
          success: function success(response) {
            current_section_block.removeClass('global-content__comment-message trash');
            current_section_block.addClass('global-content__comment-message');
            moder_block.hide();

            switch (response.status) {
              case 'moderSuccess':
                createNotice('Комментарий успешно отредактирован модератором');
                current_text_block.html(response.text);
                break;

              case 'empty':
                createNotice('Вы отправили пустой текст', 'error');
                break;

              case 'invalidEntry':
                createNotice('Пост не найден. Возможно он был удалён', 'error');
                break;

              default:
                createNotice('Неизвестная ошибка', 'error');
            }
          }
        });
      });
    }
  });
}

function comment_edit(e) {
  e.preventDefault();
  var current_object = $(this),
      current_id = current_object.attr('data-reply-edit'),
      current_text_block = current_object.parents('.global-content__comment-message').first().find('.global-content__comment-user--message').first();
  $.ajax({
    url: base_url + 'replies/get_single_for_edit/' + current_id,
    type: 'GET',
    dataType: 'JSON',
    success: function success(data) {
      current_text_block.html(get_form('edit-comment-textarea', 'comment-submit-edit', data.message)).fadeIn(200);
      $('#edit-comment-textarea').focus();
      addAutoResize();
      call_events();
      current_text_block.find('[comment-submit-edit]').click(function () {
        var current_text = current_text_block.find('textarea').val();
        var data = {
          reply_id: current_id ^ 0,
          text: current_text
        };
        data[TOKEN] = formKey;

        if (current_text === '') {
          return;
        }

        $.ajax({
          url: base_url + 'replies/edit',
          type: 'POST',
          data: data,
          success: function success(response) {
            switch (response.status) {
              case 'success':
                current_text_block.html(response.text);
                break;

              case 'onModeration':
                createNotice('Комментарий успешно отредактирован, но будет отображен после проверки модератора');
                current_text_block.html(get_form('edit-comment-textarea', 'comment-submit-edit', data.message)).fadeOut(200);
                current_object.parents('.global-content__comment-message').remove();
                break;

              case 'banned':
                createNotice('Вы не можете редактировать свои посты, пока не спадёт блокировка', 'error');
                break;

              case 'unauthorized':
                createNotice('Вы не авторизованы', 'error');
                Utils.login();
                break;

              case 'replyDate':
                createNotice('Нельзя редактировать пост спустя сутки', 'error');
                break;

              case 'empty':
                createNotice('Вы отправили пустой текст', 'error');
                break;

              case 'invalidEntry':
                createNotice('Пост не найден. Возможно он был удалён', 'error');
                break;

              case 'accessDenied':
                createNotice('Доступ запрещён', 'error');
                break;

              default:
                createNotice('Неизвестная ошибка', 'error');
            }
          }
        });
      });
    }
  });
}

function comment_ban_form() {
  var $obj = $(this),
      member_id = $obj.data('id'),
      comment_id = $obj.data('comment-id');
  $.ajax({
    url: base_url + 'replies/control_ban_form/' + member_id + '/' + comment_id,
    type: 'GET',
    success: function success(response) {
      popup_show(response);
    }
  });
  return false;
}

function comment_pagination(e) {
  e.preventDefault();
  var $object = $(this),
      $parents = $object.parents('.pagination'),
      page = $object.attr('data-page'),
      per_page = $parents.attr('data-per-page'),
      offset = page * per_page;
  $.ajax({
    url: base_url + 'replies/getList/?category=' + category + '&offset=' + offset,
    type: 'GET',
    success: function success(data) {
      $('#comments-list').html(data);
      window.location = '#comments-wrapper';
      var current_url = $('[data-page-current-section]').attr('data-page-current-section');
      history.pushState('', '', '/' + current_url + '/?page=' + page + '#comments-wrapper');
    }
  });
}

function comment_ignore(e) {
  e.preventDefault();
  var id = $(this).attr('data-id');

  if (id === '') {
    return false;
  }

  $.ajax({
    url: base_url + 'replies/ignoreUser/' + id,
    type: 'POST',
    data: {
      key: formKey
    },
    success: function success(response) {
      if (response.message !== undefined) {
        createNotice(response.message, 'error');
      }
    }
  });
  return false;
}

function share_block_timer_fade() {
  $(this).remove();
  clearInterval(shareBlockTimer);
}

function comment_share_to_mouseleave() {
  shareBlockTimer = setInterval(share_block_timer_fade, 1000);
}

function comment_share_to_mouseover() {
  clearInterval(shareBlockTimer);
  $(this).find('input').select();
}

function comment_share() {
  $('.popup-menu').hide();
  $('.share-comment').remove();
  $(this).parents('.c-item').first().append('<div class="share-comment"><input value="https://dota2.ru/replies/to/' + $(this).data('id') + '/"></div>');
  $('.share-comment').off('mouseleave').on('mouseleave', comment_share_to_mouseleave).off('mouseover').on('mouseover', comment_share_to_mouseover);
  return false;
}

function comment_share_new(e) {
  e.preventDefault();
  var copied = Utils.createElement('input', {
    value: "https://dota2.ru/replies/to/".concat($(this).data('id'), "/")
  });
  document.body.append(copied);
  copied.select();
  document.execCommand('copy');
  copied.remove();
  createNotice('Ссылка скопирована в буфер обмена');
}

function comment_close_other_form() {
  $('.comments-form-add').fadeOut(200, function () {
    $(this).remove();
  });
}

function comment_load(e) {
  e.preventDefault();
  var button = $(this),
      ito = button.find('i.fa').first(),
      item = $(this).parents('.c-item').first(),
      id = item.data('id');
  ito.removeClass().addClass('fa fa-spinner fa-spin');
  $.ajax({
    url: base_url + 'replies/load_comments',
    type: 'POST',
    data: {
      category: category,
      from: id
    },
    success: function success(response) {
      item.append(response.list);
      setTimeout(function () {
        item.find('.slide').removeClass('slide');
      });
      button.remove();
      call_events();
    }
  });
}

function comment_offset() {
  var button = $(this),
      ito = button.find('i.fa').first(),
      offset = $('#comment-offset').data('id'),
      order = $('a.btn-global--active[data-order]').data('order');
  ito.removeClass().addClass('fa fa-spinner fa-spin');
  $.ajax({
    url: base_url + 'replies/load_offset',
    type: 'POST',
    data: {
      category: category,
      offset: offset,
      order: order
    },
    success: function success(response) {
      $('#comment-block > .global-content__comment').append(response.list);
      ito.removeClass().addClass('fa fa-arrow-down');
      button.remove();
      call_events();
    }
  });
}

function comment_branch_toggle_class(branch) {
  if (branch.hasClass('hidden-branch')) {
    branch.removeClass('hidden-branch');
    branch.next('.hidden-branch-p').remove();
  } else {
    branch.addClass('hidden-branch');
    branch.after(Utils.createElement('p', {
      className: 'hidden-branch-p',
      innerHTML: "<i class=\"fas fa-chevron-down\"></i> \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u044C"
    }));
  }

  call_events();
}

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function comment_branch_toggle(e) {
  e.preventDefault();
  var branch = e.target.className !== 'hidden-branch-p' ? $(this).parent() : $(this).prev();

  if (branch.children('section').length > 0) {
    if (!checkVisible(branch.children('.global-content__comment-message')[0])) {
      $.when($('html, body').animate({
        scrollTop: branch.offset().top - 10
      }, 400, 'swing')).done(function () {
        comment_branch_toggle_class(branch);
      });
    } else {
      comment_branch_toggle_class(branch);
    }
  }
}

function openRules(e) {
  e.preventDefault();
  $('#site-rule').toggle();
}

function commentsInit() {
  category = $('#comment-category').attr('data-title');
  type = $('#comment-type').attr('data-title');
  section = $('#comment-section').attr('data-title');
  reply_author_id = $('#comment-reply-author-id').data('id');
  comments_offset = $('#comment-offset').data('id');
  call_events();
}
/**
 * Перемещает блок комментариев вверх/вниз в зависимости от позиции скролла пользователя
 * Если количество комментариев меньше размера экрана - блок комментариев остаётся неподвижным
 */


function comment_position_scrolled() {
  var scrolled = $('[data-position-scrolled]'),
      offset = scrolled.offset(); // Если комментариев достаточно для того, чтобы блок с комментариями был больше высоты браузера

  if (scrolled.height() + 100 > window.innerHeight) {
    var commentBlock = $('#comment-block-add'),
        connectLazy = $('.comment-block-connect-lazy'),
        height = commentBlock.outerHeight();

    if (window.pageYOffset > offset.top) {
      if (!commentBlock.hasClass('reversed')) {
        commentBlock.addClass('reversed'); // Фикс для mozilla-подобных браузеров, т.к. контект в мозилле не привязывается к экрану

        connectLazy.css({
          marginTop: height + 36
        });
      }
    } else {
      if (commentBlock.hasClass('reversed')) {
        commentBlock.removeClass('reversed');
        connectLazy.css({
          marginTop: ''
        });
      }
    }
  }
}
/**
 * Раскрывает блок ответа при первом клике
 */


function comment_textarea_maximize() {
  $('[data-main-form]').removeClass('minimized');
  $(this).off('click');
}

function reply_order() {
  $('.reply-order-buttons a').removeClass('btn-global--active');
  $(this).addClass('btn-global--active');
  $.ajax({
    url: '/replies/getList/',
    type: 'post',
    data: {
      category: $('#comment-category').data('title'),
      order: $(this).attr('data-order')
    },
    success: function success(response) {
      $('#comment-block')[0].outerHTML = response.list;
      call_events();
    }
  });
  return false;
}
/**
 * Вставка bb code
 * Дописать возможность обрамления выделяемого текста (см. iOS)
 *
 * @param e
 */


function insert_bbcode_b(e) {
  e.preventDefault();
  Smiles.insertSmile($("<p data-shortcut=\"[b][/b]\"></p>"), $(this).parents('.forum-theme__form').first().find('.comments-textarea'));
}

function insert_bbcode_img(e) {
  e.preventDefault();
  Smiles.insertSmile($("<p data-shortcut=\"[img][/img]\"></p>"), $(this).parents('.forum-theme__form').first().find('.comments-textarea'));
}

function checkHeight() {
  this.style.height = '1px';
  var height = this.scrollHeight + 6 > 60 ? this.scrollHeight + 6 : 60;
  this.style.height = height + 'px';
}

function show_users_who_rate() {
  $('#showUsersWhoRatePost .global-content__modal-body').html('');
  var post_id = $(this).attr('data-rates');
  Core.Ajax.post('/api/comments/getRates/', {
    post_id: post_id
  }, function (response) {
    switch (response.status) {
      case 'success':
        if (response.rates.length > 0) {
          var box = $("<div class=\"user-content-box\"></div>");

          var _iterator = _createForOfIteratorHelper(response.rates),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var rate = _step.value;
              box.append("\n                            <div class=\"modal-who-rate-post-user\" title=\"".concat(rate.user.username, "\">\n                                <img class=\"modal-who-rate-post-user-avatar\" src=\"").concat(rate.user.avatar.small, "\">\n                                <a class=\"modal-who-rate-post-username modal-who-rate-post-").concat(rate.like ? 'liked' : 'disliked', "\" href=\"").concat(rate.user.profile, "\">\n                                    ").concat(rate.user.username, "\n                                </a>\n                            </div>"));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          $('#showUsersWhoRatePost .global-content__modal-body').html(box.html());
        }

        break;

      default:
        createNotice('Неизвестная ошибка');
    }
  });
  $('#showUsersWhoRatePost').modal('show');
}

$(document).ready(function () {
  var countOffset = $('.global-content__comment').children('section[data-level="0"]').length;

  if (countOffset !== 0 && countOffset % 100 === 0) {
    $('.comment-loader-button').show();
  } else {
    $('.comment-loader-button').hide();
  }

  $('#comment-offset').attr('data-id', countOffset);
  commentsInit();
});

function call_events() {
  //Если это главная форма - то скрываем все побочные
  $('[data-main-form]').off('click').on('click', comment_close_other_form); //Вешаем события для ссылок на страницы с комментариями

  $('#comments-list .pagination a').off('click').on('click', comment_pagination); //Добавление комментариев

  $('button[comment-submit-add]').off('click').on('click', comment_add); // Добавляем форму ответа для ответа на комментарий

  $('a[data-reply-answer]').off('click').on('click', comment_reply); // Добавляем форму всплывающего меню сообщения

  $('a[data-menu]').off('click').on('click', comment_menu);
  setEventOnRemoveAction(); //Одобрение комментария

  $('[data-reply-approve]').off('click').on('click', comment_approve); //Удаление комментариев

  $('[data-reply-remove]').off('click.commentRemove').on('click.commentRemove', comment_remove); //Подача жалобы

  $('[data-reply-report]').off('click').on('click', comment_report); //Бан пользователя

  $('[data-reply-ban]').off('click').on('click', comment_ban); //Подключаем рейтинг

  $('[data-reply-rating]').off('click').on('click', comment_rating); // Подключаем показ оценивших пост юзеров
  //$('[data-reply-show-user-id]').off('mouseover').on('mouseover', debounce(comment_get_rated_users, 100));

  tippy('[data-reply-show-user-id]', {
    content: "<i class=\"fas fa-spinner fa-spin\"></i>",
    allowHTML: true,
    interactive: true,
    placement: 'bottom-end',
    zIndex: 1,
    onCreate: function onCreate(instance) {
      instance.cache = false;
    },
    onShow: function onShow(instance) {
      var post_id = $(instance.reference).attr('data-reply-show-user-id');

      if (instance.cache === false) {
        // Можно задать сразу, чтобы не отправлял лишних запросов
        instance.cache = true;
        Core.Ajax.post('/api/comments/getLastRates/', {
          post_id: post_id
        }, function (response) {
          switch (response.status) {
            case 'success':
              if (response.rates.length > 0) {
                var box = $("<div class=\"user-content-box\"></div>");

                var _iterator2 = _createForOfIteratorHelper(response.rates),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var rate = _step2.value;
                    box.append("\n                                        <div class=\"modal-who-rate-post-user\" title=\"".concat(rate.user.username, "\">\n                                            <img class=\"modal-who-rate-post-user-avatar\" src=\"").concat(rate.user.avatar.small, "\">\n                                            <a class=\"modal-who-rate-post-username modal-who-rate-post-").concat(rate.like ? 'liked' : 'disliked', "\" href=\"").concat(rate.user.profile, "\">\n                                                ").concat(rate.user.username, "\n                                            </a>\n                                        </div>"));
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                if (response.rates.length >= 6) {
                  box.append("\n                                        <div class=\"modal-who-rate-post-wrap\" data-rates=\"".concat(post_id, "\">\n                                            \u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451..\n                                        </div>"));
                }

                instance.setContent(box.html());
              } else {
                instance.disable();
              }

              break;

            default:
              createNotice('Неизвестная ошибка');
          }
        });
      }
    }
  });
  $('body').on('click', '[data-rates]', show_users_who_rate); //Редактирование сообщений

  $('[data-reply-edit]').off('click').on('click', comment_edit); //Редактирование сообщений модератором

  $('[data-reply-moder-edit]').off('click').on('click', moder_comment_edit); //Форма бана

  $('a[href$="#comment-ban"]').off('click').on('click', comment_ban_form); //Игнор

  $('a[href$="#ignore-user"]').off('click').on('click', comment_ignore); // Добавление ссылки в буфер обмена

  $('a.comments-to').off('click').on('click', comment_share_new); // Привязываем на кнопки подгрузки постов

  $('.loaded_button').off('click').on('click', comment_load); // Скрытие/открытие веток

  $('.branch-space, .hidden-branch-p').off('click').on('click', comment_branch_toggle); // Подгрузка следующих "100" сообщений

  $('.comment-loader-button').off('click').on('click', comment_offset); // Привязка к кнопкам порядка сообщений

  $('.reply-order-buttons a').off('click').on('click', reply_order);
  $('.bbcode_b-insert').off('click').on('click', insert_bbcode_b);
  $('.bbcode_img-insert').off('click').on('click', insert_bbcode_img);
  $('[href="#site-rule"]').off('click').on('click', openRules);
  $('.comments-textarea').off('input').on('input', checkHeight); // Привязываем textarea к comment_add с "this" от самой textarea
  // Если проще - при нажатии ctrl + enter (13 клавиша) - отправляем сообщение

  $('#comment-textarea, .comments-textarea').keydown(function (e) {
    if (e.ctrlKey && e.keyCode === 13) {
      comment_add.bind(this)();
    }
  }); // tribute с чата на главной

  chatTribute.attach($('.comments-textarea:not([data-tribute]), #comment-textarea:not([data-tribute])')); // Пересчитываем время

  app.checkTime('.category-message-time');
}

$(window).on('scroll', comment_position_scrolled);
