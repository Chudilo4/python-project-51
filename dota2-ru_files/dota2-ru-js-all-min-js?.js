"use strict";

$(function () {
  window.vueApp = vueConfig.el !== undefined ? new Vue(vueConfig) : null;
});
var coreUtils = {},
    currentType = null,
    currentObject = null;

function setEventOnRemoveAction() {
  $('[data-remove], a[href$="#remove"]').off('click.removeAction').on('click.removeAction', function (event) {
    if (!confirm('Вы уверены?')) {
      event.stopImmediatePropagation();
      return false;
    }
  });
}

function setEventOnSpoilers() {
  $(document).on('click', '.spoiler .title', function () {
    var current_object = $(this);
    var $parent = current_object.parent('.spoiler');
    var $content = $parent.children('.content');

    if (undefined != $parent.attr('data-encode')) {
      $content.html(decodeURIComponent(escape(window.atob($content.html()))));
      $parent.removeAttr('data-encode');
      setEventOnTooltipe();
      setEventOnSpoilers();
    }

    if ($parent.attr('data-hidden-media') != undefined) {
      // lib_tooltipe->optimizeSpoilersMedia() decode
      var elements = ['img', 'iframe'];

      for (var i = 0; i <= elements.length; i++) {
        $content.find(elements[i] + ':not([data-src=""])').each(function () {
          $(this).attr('src', $(this).data('src'));
          $(this).removeAttr('data-src');
        });
      }

      $parent.removeAttr('data-hidden-media');
    }

    $(this).next().stop().fadeToggle(200, function () {
      //if($(this).prev().hasClass('spoiler-title-down')) $(this).prev().removeClass('spoiler-title-down').addClass('spoiler-title-up');
      //else $(this).prev().removeClass('spoiler-title-up').addClass('spoiler-title-down');
      var current_icon = current_object.find('i');
      if (current_icon.hasClass('fa-caret-down')) current_icon.removeClass('fa-caret-down').addClass('fa-caret-up');else current_icon.removeClass('fa-caret-up').addClass('fa-caret-down');
    });
  });
}

function test(text) {
  $('#mouse').text(text);
}

function setEventOnTooltipe() {
  $('span.tooltipe').off('mouseenter').on('mouseenter', function (e) {
    var posX = e.pageX;
    var posY = e.pageY;
    var tooltipeId = $(this).attr('data-tooltipe-id');
    var tooltipe = $('#tooltipe-id-' + tooltipeId);

    if (tooltipe.length === 0 && window.hasOwnProperty('tooltipCollection') && window.tooltipCollection.hasOwnProperty(tooltipeId)) {
      // Проверяем был ли такой тултип подгружен через аякс, добавляем в верстку
      if ($('.js-tooltip-content-wrap').length > 0) {
        $('.js-tooltip-content-wrap').append(window.tooltipCollection[tooltipeId]);
        tooltipe = $('#tooltipe-id-' + tooltipeId);
      }
    }

    tooltipe.fadeIn(200);
    tooltipe.css({
      'left': $(this).position().left + 50,
      'top': $(this).position().top + 50
    });
  }).off('mouseleave').on('mouseleave', function () {
    var tooltipeId = $(this).attr('data-tooltipe-id');
    var tooltipe = $('#tooltipe-id-' + tooltipeId);
    tooltipe.stop().hide(0);
  }); //    $('.tooltipe').off('mouseenter').on('mouseenter', function()
  //    {
  //        //Сохраняем ссылку на текущий объект
  //        var current_object = $(this);
  //
  //        //Ищем содержимое, которое должны показать
  //        var current_content = current_object.find('.tooltipe-content');
  //        if(current_content.attr('class') == undefined) current_content = current_object.next('.tooltipe-content');
  //        if(current_content.attr('class') == undefined) return false;
  //
  //        //Пробегаемся по каждому скрытому блоку
  //        current_content.each(function()
  //        {
  //            //Текущий контейнер
  //            var current_content_object = $(this);
  //
  //            //Парсим позицию, чтобы вывести блок так где это требуется
  //            position = null;
  //            var position_top = current_content_object.attr('data-position-top');
  //            var position_left = current_content_object.attr('data-position-left');
  //            if(position_top != undefined && position_left != undefined) position = {'top':position_top,'left':position_left};
  //
  //            //Если позиция пуста, заполняем сами
  //            if(position == null) position = {'top':0,'left':current_object.width() + 30};
  //
  //            //Проверяем на возможность показа
  //            var current_display = current_content_object.attr('data-display');
  //
  //            //Если ничего не нашли, то просто показываем блок
  //            if(current_display != 'none')
  //            {
  //                //Показываем блок
  //                current_content_object.animate(position, 0, function(){ $(this).fadeIn(100); });
  //
  //                //Позиционируем
  //                tooltipe_reposition(current_content_object);
  //            }
  //        });
  //
  //        return false;
  //    }).off('mouseleave').on('mouseleave', function()
  //    {
  //        //Сохраняем ссылку на текущий объект
  //        var current_object = $(this);
  //
  //        //Ищем содержимое, которое должны показать
  //        var current_content = current_object.find('.tooltipe-content');
  //        if(current_content.attr('class') == undefined) current_content = current_object.next('.tooltipe-content');
  //        if(current_content.attr('class') == undefined) return false;
  //
  //        //Скрываем содержимое
  //        current_content.stop().fadeOut(0);
  //    });
  //    /** Позиционирование блока (тултипа) */
  //    function tooltipe_reposition(object)
  //    {
  //        //Текущая позиция окна
  //        var window_position_top  = $(window).scrollTop() + $(window).height();
  //        var window_position_left = $(window).width();
  //
  //        //Текущая позиция блока
  //        var object_position_top  = object.offset().top + object.height();
  //        var object_position_left = object.offset().left + object.width();
  //
  //        //Считаем разницу
  //        var margin_top  = window_position_top - object_position_top;
  //        var margin_left = window_position_left - object_position_left;
  //
  //        //Проверяем нахождение за пределами
  //        if(margin_top  < 50)  object.css({'top':margin_top - 50});
  //        if(margin_left < 50)  object.css({'left':-450});
  //    }
}
/** Rating system */


function setEventOnRatingSystem() {
  $('[data-rating-system]').find('a').off('click').on('click', function () {
    var current_object = $(this);
    var current_parent = current_object.parents('.news-news__main-footer-like').first();
    var current_type = current_object.attr('data-type');
    var current_id = current_parent.attr('data-current-id');
    var current_category = current_parent.attr('data-current-category');
    var data = {
      record_id: current_id,
      category: current_category
    };
    data[TOKEN] = formKey;
    var url = current_type === 'like' ? 'rating/like' : 'rating/dislike'; //Посылаем запрос

    $.ajax({
      url: base_url + url,
      type: 'POST',
      data: data,
      success: function success(response) {
        if (response.status === 1) {
          if (current_object.hasClass('btn-global--active')) {
            current_object.removeClass('btn-global--active');
          } else {
            current_parent.find('a').removeClass('btn-global--active');
            current_object.addClass('btn-global--active');
          }

          current_parent.find('a[data-type="like"] span').text(response.likes);
          current_parent.find('a[data-type="dislike"] span').text(response.dislikes);
        } else if (response.status === -1) {
          currentType = current_type;
          currentObject = current_object;
          return Utils.login();
        } // Оповещаем пользователя


        if (response.message !== undefined) {
          createNotice(response.message);
        }
      }
    });
    return false;
  });
}

$(document).ready(function () {
  if ($('#' + TOKEN).data('value') != undefined) formKey = $('#' + TOKEN).data('value');else formKey = '';
  /* Базовые данные */

  var page_current_section = $('#page-current-section').data('value');
  var page_current_address = $('#page-current-address').data('value');
  /* Подключаем Fancybox */
  //	$('.fancybox').fancybox();

  /* Проверка перед удалением */

  setEventOnRemoveAction();
  var button_move_up_flag = false;
  var button_move_up_position = 0;
  var scroll_y = null;
  /** Кнопка "Вверх" */

  $('#button-move-up').on('click', function () {
    if (scroll_y === null) {
      scroll_y = window.scrollY;
      $('html,body').animate({
        scrollTop: 0
      }, 0);
      $(this).find('.fa').addClass('fa-rotate-180');
    } else {
      $('html,body').animate({
        scrollTop: scroll_y
      }, 0);
      scroll_y = null;
      $(this).find('.fa').removeClass('fa-rotate-180');
    }
  });
  /** Скрываем кнопку "Вверх" и показываем */

  $(document).scroll(function () {
    if ($(this).scrollTop() > 0 || button_move_up_flag) {
      $('#button-move-up:hidden').fadeIn(0);
      $('#button-scroll-unread').addClass('isMovedUp');

      if ($(this).scrollTop() > button_move_up_position) {
        button_move_up_flag = false;
        button_move_up_position = 0;
      }
    } else {
      if (scroll_y === null) $('#button-move-up:visible').fadeOut(0);
      $('#button-scroll-unread').removeClass('isMovedUp');
    }
  });
  /** Споилеры */

  setEventOnSpoilers();
  $(document).on('click', '[data-esport-subscribe]', function () {
    var _this = this;

    var type = $(this).attr('data-esport-subscribe'),
        id = $(this).attr('data-esport-id'),
        status = $(this).attr('data-esport-status');

    if (!['subscribe', 'unsubscribe'].includes(status)) {
      createNotice('Произошла ошибка');
    }

    Core.Ajax.post("".concat(base_url, "api/esport/").concat(status, "/"), {
      type: type,
      id: id
    }, function (response) {
      switch (response.status) {
        case 'success':
          if (status !== 'subscribe') {
            createNotice('Вы успешно отписались');
            $(_this).html("<i class=\"fas fa-bell\"></i> \u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F");
            $(_this).attr('data-esport-status', 'subscribe');
          } else {
            createNotice('Вы успешно подписаны');
            $(_this).html("<i class=\"fas fa-bell-slash\"></i> \u041E\u0442\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F");
            $(_this).attr('data-esport-status', 'unsubscribe');
          }

          break;

        case 'invalidType':
        case 'invalidKey':
          createNotice('Ошибка: данный тип не поддерживается или матч не существует');
          break;

        case 'alreadySubscribed':
          createNotice('Вы уже подписаны на данный матч');
          $(_this).html("<i class=\"fas fa-bell-slash\"></i> \u041E\u0442\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F");
          $(_this).attr('data-esport-status', 'unsubscribe');
          break;

        case 'notSubscribed':
          createNotice('Вы не подписаны на данный матч');
          $(_this).html("<i class=\"fas fa-bell\"></i> \u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F");
          $(_this).attr('data-esport-status', 'subscribe');
          break;

        default:
          createNotice("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430: ".concat(response.status));
      }
    });
  }); //  Споилеры
  //-----------------------------------------------------------------------------------------------------------------

  $('a[class=forum_spoiler_a]').click(function () {
    $(this).next().slideToggle('fast');
  });
  /* Удаляем все всплывающие сообщения */

  $(".ajax-notice").click(function () {
    $(this).fadeOut(200, function () {
      $(this).remove();
    });
  });
  var heightHistory = $('#guideHistory').height();
  $('#guideHistory').each(function () {
    $(this).css({
      'height': '144px',
      'overflow': 'auto'
    });
  }); //  Скиллы
  //-------------------------------------------------------------------------------------------------------------------

  $('.settingsForHero_skills_single input').change(function () {
    var skillNameRadioInput = $(this).attr('name');
    $('input[name=' + skillNameRadioInput + ']').each(function () {
      $(this).parent('div').attr('class', 'settingsForHero_skills_single_radio');
    });
    $(this).parent('div').attr('class', 'settingsForHero_skills_single_radioON');
  });
  $('#chooseHeroImgs img').each(function () {
    $(this).click(function () {
      var idImgHero = $(this).attr('id');
      var heroImgName = $(this).attr('data-name');
      var heroImgImg = $(this).attr('data-img');
      $('#themeGuide').html('<img src="' + base_url + 'img/heroes/' + heroImgImg + '/l_icon.jpg" class="guide_themeImg" /><span>' + heroImgName + '</span>');
      $('#chooseHero .text_spoiler').hide(0);
      $('.themeGuideHeroId').val(idImgHero); //Достаем порядок

      $.ajax({
        url: base_url + 'heroes/skillsPosition/' + idImgHero,
        type: 'GET',
        success: function success(data) {
          var positions = [];

          if (data.hasOwnProperty('position')) {
            positions = data.position.map(function (i) {
              return Number(i);
            });
          }

          positions.forEach(function (value, index) {
            var src;
            index += 1;
            src = base_url + 'img/heroes/' + heroImgImg + '/ability' + value + '.jpg';
            $('#skill_' + index).attr('src', src);
          });
          $('.new-abilities-block').html(data['abilities']);
          $('.new-ability-value').click(function () {
            var $obj = $(this);
            $('.new-ability-value[data-level="' + $obj.data('level') + '"]').addClass('muted');
            $obj.removeClass('muted');
            $('input[name="new_abilities\[' + $obj.data('level') + '\]"]').val($obj.data('number'));
          });
          $('.new-abilities-block').trigger('change');
        }
      });
      $('#chooseHeroImgs img').each(function () {
        $(this).parent().attr('style', '');
      });
      $(this).parent().css({
        'opacity': '1',
        'border': '1px solid #ff7e00'
      });
      $('input[name=hero_id]').val(idImgHero);
      $('#settingsForHero, #themeGuide').show();
      $('#guide_edit_heroSkillBild').css({
        'display': 'block'
      });
      $('#guide_edit_heroAll').slideUp('fast');
      $('#chooseHero').html("<div class='single-all-guides'><img src='" + base_url + "img/heroes/" + heroImgImg + "/icon.jpg' class='chooseHeroImage img-s-hero' /> <i class='fa fa-close' id='guide_deleteHeroButton'></i> <sup>- выбранный герой, вы можете убрать его щелкнув на крестик</sup></div>");
      $('#guide_deleteHeroButton').click(function () {
        $('#chooseHero').html('');
        $('#guide_edit_heroSkillBild').css({
          'display': 'none'
        });
        $('input[name=hero_id]').val('0');
      });
    });
  });
  $('.new-ability-value').click(function () {
    var $obj = $(this);
    $('.new-ability-value[data-level="' + $obj.data('level') + '"]').addClass('muted');
    $obj.removeClass('muted');
    $('input[name="new_abilities\[' + $obj.data('level') + '\]"]').val($obj.data('number'));
  });
  $('#guide_deleteHeroButton').click(function () {
    $('#chooseHero').html('');
    $('#guide_edit_heroSkillBild').css({
      'display': 'none'
    });
    $('input[name=hero_id]').val('0');
  }); //Проверяем поля перед добавлением

  $('#crateOrSaveGuideButton').click(function () {
    //		var testGuideTitle = $('input[name=title]').val();
    //
    //		var textError = '';
    //
    //		if(testGuideTitle == '') {
    //			textError += '- Вы не заполнили название гайда';
    //		}
    //
    //		var testGuideBlocksBool = false;
    //		$('#guide_moreBlocks div[class=single-all-guides]').each(function(){
    //			var tmpInputText = $(this).children('input').val();
    //			var tmpTextareaText = $(this).children('textarea').val();
    //
    //			//alert(tmpInputText+'  '+tmpTextareaText);
    //
    //			if(tmpInputText != '' && tmpTextareaText != '') testGuideBlocksBool = true;
    //		});
    //
    //		if(!testGuideBlocksBool) {
    //			if(textError == '') textError += '- Вы не заполнили ни одного текстового блока';
    //			else textError += '<br />- Вы не заполнили ни одного текстового блока'
    //		}
    //
    //		if(textError != '') {
    //			$('body').append('<div class="messageTopError"><span>'+textError+'</span></div>');
    //			$('.messageTopError').delay(4000).fadeOut(2000);
    //
    //			return false;
    //		}
    $("#editor").sceditor('instance').updateOriginal();
    $("#editor").sceditor('instance').val($("#editor").sceditor('instance').val());
    $('textarea[name="editor_text_bbcode"]').val($("#editor").sceditor('instance').val());
    $('textarea[name="editor_text_html"]').val($("#editor").sceditor('instance').getWysiwygEditorValue(false));
    $('#formAddOrSaveGuide').submit();
  });
  var userBlock = 0; //Считаем кол-во блоков

  userBlock = $('#guide_moreBlocks div[class=single-all-guides]').length;
  userBlock++;
  $('#guide_moreBlocks div[class=single-all-guides]').each(function () {
    //ББкоды
    publicBBcodes('#' + $(this).attr('id') + ' div[class=bbcods] > a', 'id', '#' + $(this).attr('id') + ' textarea', 'bb', '[', ']', 'yes');
    publicBBcodes('#' + $(this).attr('id') + ' div[class=bbcods] > div[class=guide_bbcodes_heroes] img', 'title', '#' + $(this).attr('id') + ' textarea', 'bb', '[hero=', ']');
    publicBBcodes('#' + $(this).attr('id') + ' div[class=bbcods] > div[class=guide_bbcodes_items] img[title]', 'title', '#' + $(this).attr('id') + ' textarea', 'bb', '[item=', ']');
    publicBBcodes('#' + $(this).attr('id') + ' div[class=bbcods] > div[class=guide_bbcodes_colors] div', 'title', '#' + $(this).attr('id') + ' textarea', 'colors', '[color=', ']', 'yes');
    publicBBcodes('#' + $(this).attr('id') + ' div[class=bbcods] > div[class=guide_bbcodes_skills]  div[class=guide_bbcodes_heroes_hide] img', 'title', '#' + $(this).attr('id') + ' textarea', 'bb', '[skill=', ']');
    publicBBcodes('#' + $(this).attr('id') + ' div[class=bbcods] > div[class=guide_bbcodes_neutrals] img', 'title', '#' + $(this).attr('id') + ' textarea', 'bb', '[neutrals=', ']');
    $('#' + $(this).attr('id') + ' div[class=bbcods] > div[class=guide_bbcodes_colors] div').click(function () {
      $(this).parent().parent().slideUp(100);
    }); //Споилеры ббкодов

    $('#' + $(this).attr('id') + ' div[class=bbcods] > span').click(function () {
      //$(this).parent().children('div').slideUp(0);

      /*
      $(this).next().slideToggle('fast', function(){
      	$(this).mouseleave(function(){
      		$(this).slideUp(100);
      	});
      });
      */
      $('div[class=bbcods] > div[class!=' + $(this).next().attr('class') + ']').hide(0);
      $(this).next().slideToggle('fast');
    }); //Скрытие блоков

    $('#' + $(this).attr('id') + ' textarea').click(function () {
      $(this).parent().children('div[class=bbcods]').children('div').slideUp('fast');
    }); //Спелы для героя

    $('#' + $(this).attr('id') + ' div[class=guide_bbcodes_skills] div[class*=guide_bbcodes_heroes_single] > a').click(function () {
      $('.guide_bbcodes_heroes_hide').hide(0);
      $(this).next().fadeIn(200);
    });
  });
  $('#guide_moreBlocks .button_delete_block').each(function () {
    $(this).click(function () {
      var tpmUserBlock = $(this).parent();

      if (confirm("Удалить блок?")) {
        tpmUserBlock.remove();
      }
    });
  }); //Кнопка перемещения блока вниз

  $('#guide_moreBlocks .button_down_block').each(function () {
    $(this).click(function () {
      $(this).parent().insertAfter($(this).parent().next('div')); //var tmpBlockID =  $(this).parent().attr('id');
      //$(this).parent().insertAfter('#'+tmpBlockID+' + div');
    });
  }); //Кнопка перемещения блока вверх

  $('#guide_moreBlocks .button_up_block').each(function () {
    $(this).click(function () {
      $(this).parent().insertBefore($(this).parent().prev('div')); //var tmpBlockID =  $(this).parent().attr('id');
      //$(this).parent().insertBefore('#'+tmpBlockID);
    });
  }); //Функция добавления блока

  function guide_creatNewBlock(tmpTextFastBlock) {
    if ($('#guide_moreBlocks div[class=single-all-guides]').length < 10) {
      var tmpUserBlockID = userBlock;
      $('#userBlock1').clone().attr('id', 'userBlock' + tmpUserBlockID).appendTo('#guide_moreBlocks');

      if (tmpTextFastBlock == undefined) {
        $('#userBlock' + tmpUserBlockID + ' input').val('');
      } else {
        $('#userBlock' + tmpUserBlockID + ' input').val(tmpTextFastBlock);
      }

      $('#userBlock' + tmpUserBlockID + ' textarea').text('').attr('id', 'guide_textarea' + tmpUserBlockID); //$('#userBlock'+tmpUserBlockID+' div[class=bbcods]').attr('id', 'guide_creatBBcods'+tmpUserBlockID);

      if ($('#userBlock' + tmpUserBlockID + ' a[class=button_delete_block]').attr('class') == undefined) {
        $('#userBlock' + tmpUserBlockID + ' textarea:first').after("<a href='javascript://' class='button_delete_block'>Удалить блок</a>");
      } //Кнопка "Удаление блока"


      $('#userBlock' + tmpUserBlockID + ' a[class=button_delete_block]').click(function () {
        var tpmUserBlock = $(this).parent();

        if (confirm("Удалить блок?")) {
          tpmUserBlock.remove();
        }
      }); //Кнопка "Вверх"

      $('#userBlock' + tmpUserBlockID + ' a[class=button_up_block]').click(function () {
        $(this).parent().insertBefore($(this).parent().prev('div'));
      }); //Кнопка "Вниз"

      $('#userBlock' + tmpUserBlockID + ' a[class=button_down_block]').click(function () {
        $(this).parent().insertAfter($(this).parent().next('div'));
      }); //Кнопка "Добавления нового блока"

      $('#userBlock' + tmpUserBlockID + ' a[class=button_add_block]').click(function () {
        guide_creatNewBlock();
      });
      publicBBcodes('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > a', 'id', '#userBlock' + tmpUserBlockID + ' textarea', 'bb', '[', ']', 'yes');
      publicBBcodes('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > div[class=guide_bbcodes_heroes] img', 'title', '#userBlock' + tmpUserBlockID + ' textarea', 'bb', '[hero=', ']');
      publicBBcodes('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > div[class=guide_bbcodes_items] img[title]', 'title', '#userBlock' + tmpUserBlockID + ' textarea', 'bb', '[item=', ']');
      publicBBcodes('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > div[class=guide_bbcodes_colors] div', 'title', '#userBlock' + tmpUserBlockID + ' textarea', 'colors', '[color=', ']', 'yes');
      publicBBcodes('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > div[class=guide_bbcodes_skills]  div[class=guide_bbcodes_heroes_hide] img', 'title', '#userBlock' + tmpUserBlockID + ' textarea', 'bb', '[skill=', ']');
      publicBBcodes('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > div[class=guide_bbcodes_neutrals] img', 'title', '#userBlock' + tmpUserBlockID + ' textarea', 'bb', '[neutrals=', ']'); //Скрываем блок Цвета после выбора

      $('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > div[class=guide_bbcodes_colors] div').click(function () {
        $(this).parent().parent().slideUp(100);
      });
      $('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > span').click(function () {
        //$(this).parent().children('div').slideUp(0);
        //$(this).next().slideToggle('fast');

        /*
        $(this).next().slideToggle('fast', function(){
        	$(this).mouseleave(function(){
        		$(this).slideUp(100);
        	});
        });
        */
        $('#userBlock' + tmpUserBlockID + ' div[class=bbcods] > div[class!=' + $(this).next().attr('class') + ']').hide(0);
        $(this).next().slideToggle('fast');
      }); //Скрытие блоков

      $('#userBlock' + tmpUserBlockID + ' textarea').click(function () {
        $(this).parent().children('div[class=bbcods]').children('div').slideUp('fast');
      }); //Спелы для героя

      $('#userBlock' + tmpUserBlockID + ' div[class=guide_bbcodes_skills] div[class*=guide_bbcodes_heroes_single] > a').click(function () {
        $('.guide_bbcodes_heroes_hide').hide(0);
        $(this).next().fadeIn(200);
      });
      userBlock++;
    } else {
      $('body').append('<div class="messageTopError">Вы не можете создать больше 10 блоков</div>');
      $(".messageTopError").delay(4000).fadeOut(2000);
    }
  }

  $('.guideInfoBlockInSide a').click(function () {
    guide_creatNewBlock($(this).text());
  }); //Кнопка создания текстового блока

  $('.button_add_block').click(function () {
    guide_creatNewBlock();
  }); //Споилер предпросмотра в гайдах

  $('#guide_buttonPreview').click(function () {
    var $obj = $(this);
    var html = tinyMCE.activeEditor.getContent();
    $obj.text('Предпросмотр (Загрузка...)');
    $.ajax({
      url: base_url + 'guides/getPreview/',
      type: 'post',
      data: {
        'html': html
      },
      success: function success(data) {
        if (data.html != undefined) {
          $('.guide-preview').html(data.html);
          $obj.text('Предпросмотр');
          setEventOnTooltipe();
          setEventOnSpoilers();
        }
      }
    });
  });
  $('#guide_buttonHeroSelect').click(function () {
    $('div[id=guide_edit_heroAll]').slideToggle('fast');
  });
  $('.guideInfoBlockInSide_delete').click(function () {
    $(this).parent().fadeOut(1000);
  }); //"Вставка ника" в теме форуму textareaForReplyInTopic

  publicBBcodes('.forum_message_single_main_title > a[data-name]', 'data-name', '#textareaForReplyInTopic', '@'); //Остальные ббкоды

  publicBBcodes('.forum_bbcodes > a', 'id', '#textareaForReplyInTopic', 'bb', '[', ']', 'yes');
  publicBBcodes('.forum_bbcodes > div[class=guide_bbcodes_heroes] img', 'title', '#textareaForReplyInTopic', 'bb', '[hero=', ']');
  publicBBcodes('.forum_bbcodes > div[class=guide_bbcodes_items] img[title]', 'title', '#textareaForReplyInTopic', 'bb', '[item=', ']');
  publicBBcodes('.forum_bbcodes > div[class=guide_bbcodes_colors] div', 'title', '#textareaForReplyInTopic', 'colors', '[color=', ']', 'yes');
  publicBBcodes('.forum_bbcodes > div[class=guide_bbcodes_skills]  div[class=guide_bbcodes_heroes_hide] img', 'title', '#textareaForReplyInTopic', 'bb', '[skill=', ']');
  publicBBcodes('.forum_bbcodes > div[class=guide_bbcodes_neutrals] img', 'title', '#textareaForReplyInTopic', 'bb', '[neutrals=', ']');
  $('.forum_bbcodes > span').click(function () {
    $('.forum_bbcodes > div[class!=' + $(this).next().attr('class') + ']').hide(0);
    $(this).next().slideToggle('fast');
  }); //Скрываем блок Цвета после выбора

  $('.forum_bbcodes > div[class=guide_bbcodes_colors] div').click(function () {
    $(this).parent().parent().slideUp(100);
  }); //Скрытие блоков

  $('#textareaForReplyInTopic').click(function () {
    $('.forum_bbcodes').children('div').slideUp('fast');
  }); //Спелы для героя

  $('.forum_bbcodes div[class*=guide_bbcodes_heroes_single] > a').click(function () {
    $('.guide_bbcodes_heroes_hide').hide(0);
    $(this).next().fadeIn(200);
  }); //Цитирование

  $('a[data-quote]').click(function () {
    var authorQuote = $(this).attr('data-name');
    var postId = $(this).attr('data-quote-id');
    $.ajax({
      url: base_url + 'forum/main/getPost/' + postId,
      type: 'GET',
      success: function success(data) {
        var text = $('#textareaForReplyInTopic').val();
        if (text != '') $('#textareaForReplyInTopic').val(text + '\n' + '[quote=' + authorQuote + ']' + data + '[/quote]');else $('#textareaForReplyInTopic').val('[quote=' + authorQuote + ']' + data + '[/quote]');
        $('#textareaForReplyInTopic').focus();
      }
    });
  }); //Поле поиска

  $('input[name=serachForum]').focus(function () {
    if ($(this).val() == 'Искать...') $(this).val('');
  }).blur(function () {
    if ($(this).val() == '') $(this).val('Искать...');
  });
  /** Спойлеры в прайсах */

  $('.prices-spoiler').click(function () {
    $(this).next().slideToggle(200);
  });
  /** Общие слайдеры */

  $('.page-slider-main').mouseover(function () {
    $(this).find('.page-slider').show(0);
  }).mouseout(function () {
    $(this).find('.page-slider').hide(0);
  }); // Рейтинг

  setEventOnRatingSystem();
  setEventOnTooltipe();
  /* Кнопка поиска */

  var menu_search_visible = false;
  $('#menu-search i').click(function () {
    var $object = $(this);
    var $parent = $object.parents('#menu-search');
    var $input = $parent.find('input[type="text"]');
    $input.toggleClass('mod-active');

    if (menu_search_visible) {
      $input.animate({
        'width': 0,
        'opacity': 0
      });
      menu_search_visible = false;
    } else {
      $input.animate({
        'width': 160,
        'opacity': 1
      }, 300, function () {
        $input[0].focus();
      });
      menu_search_visible = true;
    }
  });
  /* forum-customization */

  $('.forum-customization').bind('click', function () {
    $.ajax({
      url: base_url + 'main/forumCustomization',
      method: 'GET',
      success: function success(resp) {
        popup_show(resp);
        forumCustomizationForm();
      }
    });
  });
  /* news-customization */

  $('.news-customization').bind('click', function () {
    $.ajax({
      url: base_url + 'main/newsCustomization',
      method: 'GET',
      success: function success(resp) {
        popup_show(resp);
        newsCustomizationForm();
      }
    });
  });

  function forumCustomizationForm() {
    $('.forum-customization-form').find('button.send').off('click').on('click', function () {
      var $obj = $(this);
      var $form = $obj.parents('.forum-customization-form');
      var $nodes = $form.find('input[name="node\[\]"]:not(:checked)');
      var nodes = new Array();
      $nodes.each(function () {
        nodes.push($(this).val());
      });
      var nodesFormed = nodes.join(',');
      $.ajax({
        url: base_url + 'main/forumCustomizationSave',
        type: 'POST',
        data: {
          'nodes': nodesFormed
        },
        success: function success(response) {
          if (response == '') {
            popup_hide();
            return false;
          } // response = JSON.parse( response );


          if (response.status == 1) {
            popup_hide();
          }

          if (response.message != undefined) createNotice(response.message, 'error');
        }
      });
      return false;
    });
    $('input[name="checkall"]').off('click').on('click', function () {
      var $parent = $(this).parents('.category');
      if ($(this).attr('checked')) $parent.nextUntil('div[class="category"]').find('input').attr('checked', true);else $parent.nextUntil('div[class="category"]').find('input').attr('checked', false);
    });
  }

  function newsCustomizationForm() {
    $('.forum-customization-form').find('button.send').off('click').on('click', function () {
      var $obj = $(this);
      var $form = $obj.parents('.forum-customization-form');
      var $categories = $form.find('input[name="category\[\]"]:not(:checked)');
      var categories = new Array();
      $categories.each(function () {
        categories.push($(this).val());
      });
      var categoriesFormed = categories.join(',');
      var ads = $form.find('input[name="ads"]').is(':checked') ? 1 : 0;
      $.ajax({
        url: base_url + 'main/newsCustomizationSave',
        type: 'POST',
        data: {
          'categories': categoriesFormed,
          'ads': ads
        },
        success: function success(response) {
          if (response.status == 1) {
            popup_hide();
          }

          if (response.message != undefined) createNotice(response.message, 'error');
        }
      });
      return false;
    });
  }
  /*
  $('.page-content-news a').addClass('skip-link');
  $('a:not(.skip-link)').each(function()
  {
  var _href = $(this).attr("href");
  if(_href)
  {
  if
  (
  _href.indexOf(base_url) == -1 && // Если ссылка не содержит название домена, то есть это не внутренняя страница
  _href.indexOf('/') > 0 && // Если ссылка не содержит слеша, то есть это ссылка с #, либо если ссылка не содержит слеша на первой позиции, то есть это не внутренняя страница сайта
  _href != 'javascript://' &&
  _href.indexOf('steam://') != 0
  )
  {
  $(this).attr("href", base_url + 'away.php?to=' + encodeURIComponent(_href));
  }
  else if(_href.indexOf('//') == 0)
  {
  $(this).attr("href", base_url + 'away.php?to=http:' + encodeURIComponent(_href));
  }
  }
  });
  $(document.body).on('click', 'a', function()
  {
  var _href = this.href;
  if
  (
  _href &&
  _href.indexOf(base_url + 'away.php?to=') == 0
  )
  {
  $(this).attr('target', '_blank');
  }
  });
  */

  /* Показываем результат матча */


  $('.show-result').off('click').on('click', function () {
    var $obj = $(this);
    var $parent = $obj.parents('.status'); // Чтобы не завязываться на класс ".status" на котором также висят стили

    if ($parent.length === 0) {
      $parent = $obj.parents('.js-status');
    }

    var score = $obj.attr('data-score');
    $obj.hide();
    $parent.find('.score').text(score);
    return false;
  });
  $('.tournament-grid-arrow').off('click').on('click', function () {
    var $parent = $(this).parents('.tournament-grid-wrapper');
    var maxScroll = $parent.find('.tournament-grid-scroll').data('max-scroll');
    var scroll = parseInt($parent.find('.tournament-grid-scroll').css('left'));

    if (scroll - 200 < maxScroll) {
      scroll = maxScroll;
    } else {
      scroll = scroll - 200;
    }

    if (scroll == maxScroll) {
      $parent.find('.tournament-grid-arrow').fadeOut(200);
    } else {
      $parent.find('.tournament-grid-arrow:hidden').fadeIn(200);
    }

    if (scroll < 0) {
      $parent.find('.tournament-grid-arrow-back:hidden').fadeIn(200);
    }

    $parent.find('.tournament-grid-scroll').animate({
      'left': scroll + 'px'
    });
  });
  $('.tournament-grid-arrow-back').off('click').on('click', function () {
    var $parent = $(this).parents('.tournament-grid-wrapper');
    var maxScroll = $parent.find('.tournament-grid-scroll').data('max-scroll');
    var scroll = parseInt($parent.find('.tournament-grid-scroll').css('left'));

    if (scroll + 200 > 0) {
      scroll = 0;
    } else {
      scroll = scroll + 200;
    }

    if (scroll == 0) {
      $parent.find('.tournament-grid-arrow-back').fadeOut(200);
    } else {
      $parent.find('.tournament-grid-arrow-back:hidden').fadeIn(200);
    }

    if (scroll > maxScroll) {
      $parent.find('.tournament-grid-arrow:hidden').fadeIn(200);
    }

    $parent.find('.tournament-grid-scroll').animate({
      'left': scroll + 'px'
    });
  });
  $('.tournament-streams-tubs').find('.tournament-streams-tubs-single').off('click').on('click', function () {
    $('.tournament-streams-tubs').find('.active').removeClass('active');
    $(this).addClass('active');
    $('.tournament-streams-list').find('.single').fadeOut(0);
    var block = $('.tournament-streams-list').find('[data-id="' + $(this).data('id') + '"]');

    if (block.find('.stream').attr('data-encoded') == 1) {
      var $content = block.find('.stream');
      $content.html(decodeURIComponent(escape(window.atob($content.html()))));
      block.find('.stream').attr('data-encoded', 0);
    }

    $('.tournament-streams-list').find('[data-id="' + $(this).data('id') + '"]').fadeIn(0);
  });
  $('.pagination-select-number-page').on('keyup', function (e) {
    var url = location.protocol + '//' + location.host + location.pathname;
    var urlParams = getUrlParams();
    var perPage = $(this).parents('.pagination').attr('data-per-page');
    var selectedPage = parseInt($(this).val());
    if (isNaN(selectedPage)) return;
    urlParams['page'] = selectedPage;
    var params = $.map(urlParams, function (value, index) {
      return [index + '=' + value];
    }); //Enter

    if (e.keyCode == 13) {
      window.location.href = url + '?' + params.join('&');
    }
  });
  $('.guides-tactics').find('select').on('change', function () {
    $(this).parents('form').submit();
  });

  coreUtils.setEventOnTitleTooltipes = function () {
    $('[data-title-tooltipe]').off('mouseover').on('mouseover', function () {
      var $obj = $(this);
      $('.title-tooltipe').text($(this).attr('data-title-tooltipe')).show();
      $('.title-tooltipe').css({
        left: $obj.offset().left,
        top: $(this).offset().top + $(this).height() + 5
      });

      if ($obj.attr('data-title-tooltipe-left') != undefined) {
        $('.title-tooltipe').css('left', $obj.offset().left + parseInt($obj.attr('data-title-tooltipe-left')));
      }

      if ($obj.attr('data-title-tooltipe-top') != undefined) {
        $('.title-tooltipe').css('top', $obj.offset().top + parseInt($obj.attr('data-title-tooltipe-top')));
      }
    }).off('mouseleave').on('mouseleave', function () {
      $('.title-tooltipe').hide();
    });
  };

  coreUtils.setEventOnTitleTooltipes();
  var searchGuidesTacticsTimer = null;
  $('.guides-tactic-search').on('keyup', function () {
    var $obj = $(this);
    clearTimeout(searchGuidesTacticsTimer);

    if ($obj.val() != '') {
      searchGuidesTacticsTimer = setTimeout(function () {
        $.ajax({
          url: base_url + 'guides/ajaxTactics?name=' + $obj.val() + '&sort-by=' + $('.guides-tactics').find('[name="sort-by"]').val() + '&range=' + $('.guides-tactics').find('[name="range"]').val(),
          type: 'get',
          success: function success(response) {
            $('.guides-tactic-list').hide();
            $('.guides-tactic-search-list').html(response.view).show();
          }
        });
      }, 300);
    } else {
      $('.guides-tactic-list').show();
      $('.guides-tactic-search-list').hide();
    }
  });
  var typeOfContent = '';

  if ($('.p-content').hasClass('esport-content-match')) {
    typeOfContent = 'match';
  }

  if ($('.p-content').hasClass('esport-content-map')) {
    typeOfContent = 'map';
  }

  $('.esport-time-zone').click(function () {
    $.ajax({
      url: base_url + 'api/matches/popupTimeZone/',
      type: 'post',
      success: function success(response) {
        if (response.message != undefined) {
          createNotice(response.message);
          return;
        }

        popup_show(response.popup);
        $('.global-content__unique--modal-window').find('.send').click(function () {
          var value = $('.global-content__unique--modal-window').find('select').val();
          var title = $('.global-content__unique--modal-window').find('select').find(':selected').text();
          $.ajax({
            url: base_url + 'api/matches/popupTimeZone/',
            type: 'post',
            data: {
              timeZone: value
            },
            success: function success() {
              $('.esport-time-zone').attr('title', title).find('span').text(title);

              if (typeOfContent == 'match' || typeOfContent == 'map') {
                coreEsportMatch.getMatchListByFilters();
              } else {
                window.location.reload();
              }

              popup_hide();
            }
          });
        });
      }
    });
  });
  $(document).on('submit', '.login-popup-form', function () {
    var form = $(this);
    var login = form[0].login.value;
    var password = form[0].password.value;
    var remember = form[0].remember.checked ? 1 : 0;
    var button = form.find('button');
    var button_text = button.text();

    if (login.length == 0) {
      form.login.focus();
      createNotice('Введите логин или почтовый ящик');
      return false;
    }

    if (password.length == 0) {
      createNotice('Введите пароль');
      return false;
    }

    $.ajax({
      type: 'POST',
      url: '/forum/api/user/auth',
      data: JSON.stringify({
        login: login,
        password: password,
        remember: remember,
        silent: false,
        referer: window.location.href
      }),
      contentType: 'application/json',
      dataType: 'json',
      async: true,
      beforeSend: function beforeSend() {
        button.prop('disabled', true).html((button.data('loadingIcon') ? '<i class="fa ' + button.data('loadingIcon') + ' fa-spin"></i>' : '') + (button.data('loadingText') ? ' ' + button.data('loadingText') : ''));
      },
      success: function success(result) {
        button.prop('disabled', false).html(button_text);

        switch (result.status) {
          case "success":
            location.href = result.redirect;
            break;

          case "throttle":
            createNotice("Вы исчерпали лимит попыток входа в аккаунт<br>Попробуйте завтра");
            return;

          case "wrongCredentials":
            createNotice("Не корректный логин или пароль<br>После 5 попыток IP адрес будет временно заблокирован");
            return;
        }
      }
    });
  });
  $('.site-login').click(function (e) {
    e.preventDefault();
    Utils.login();
  });
  $(document).on('click', '.site-logout', function (e) {
    e.preventDefault();
    Utils.logout();
  }); //Logout NO btn

  $(document).on('click', '#logout-no-btn', function () {
    popup_hide();
  }); //Logout YES btn

  $(document).on('click', '#logout-yes-btn', function () {
    popup_hide();
    $.ajax({
      url: '/forum/api/user/logout/',
      type: 'POST',
      success: function success() {
        location.href = '/';
      }
    });
  });
  $(document).on('click', '#site-register', function (e) {
    e.preventDefault();
    $('#loginModal').modal('hide');
    $('#registerModal').remove(); // Очищаем старое модальное окно, чтобы обновить reCaptcha

    $.ajax({
      url: base_url + 'members/showModalRegister/',
      type: 'get',
      success: function success(response) {
        if (response.message !== undefined) {
          createNotice(response.message);
          return;
        }

        $('body').append(response);
        $('#registerModal').modal('show');
      }
    });
  });
  $(document).on('keydown', function (e) {
    if (e.keyCode == 27) Core.Popup.destroy();
  });
  $('form[data-mode="ajax"]').on('submit', function (e) {
    e.preventDefault();
    var action = $(this).prop('action'),
        data = $(this).serializeArray(),
        button = $(this).find('[type="submit"]'),
        button_html = button.html();
    button.html('<i class="fa fa-circle-o-notch fa-spin"></i> Обработка').attr('disabled', '');
    Core.Ajax.post(action, data, function (response) {
      if (response.message != '') createNotice(response.message);
      if (response.data.redirect !== undefined) location.href = response.data.redirect;
    });
    button.html(button_html).removeAttr('disabled');
  });
});

function subscribe_tag(tag) {
  $.ajax({
    url: '/tag/subscribe_popup/',
    type: 'POST',
    data: {
      tag: tag
    },
    success: function success(response) {
      if (response.status == 0 && response.message != undefined) {
        createNotice(response.message, 'error');
        return;
      }

      popup_show(response);
    }
  });
}

function loginPopup() {
  /*
  let buttons = {
  	tag: 'div',
  	props: {
  		'class': 'row',
  		childs: [
  			{
  				tag: 'div',
  				props: {
  					classList: ['large-4', 'columns', 'large-offset-4'],
  					childs: [
  						{
  							tag: 'button',
  							props: {
  								style: {padding: 0},
  								id: 'loginBtn',
  								dataset: {loadingText: 'Авторизация...'},
  								type: 'submit',
  								classList: ['button-theme', 'btn-block'],
  								text: 'Войти'
  							}
  						},
  						{
  							tag: 'div',
  							props: {
  								classList: ['text-center', 'margin-top-5'],
  								childs: [
  									{
  										tag: 'a',
  										props: {
  											href: '/members/login/vk/',
  											title: 'Войти через VK',
  											childs: [
  												{
  													tag: 'div',
  													props: {
  														classList: ['vkbtn', 'button-auth'],
  														childs: [
  															{
  																tag: 'i',
  																props: {
  																	'class': 'icon',
  																	childs: [{tag: 'i', props: {classList: ['fa', 'fa-vk', 'fa-2x', 'margin-5']}}]
  																}
  															},
  															{
  																tag: 'div',
  																props: {
  																	'class': 'slide',
  																	childs: [{tag: 'p', props: {style: {paddingLeft: '5px'}, text: 'Вконтакте'}}]
  																}
  															}
  														]
  													}
  												}
  											]
  										}
  									},
  									{
  										tag: 'a',
  										props: {
  											href: '/members/login/steam/',
  											title: 'Войти через Steam',
  											childs: [
  												{
  													tag: 'div',
  													props: {
  														classList: ['steambtn', 'button-auth'],
  														childs: [
  															{
  																tag: 'i',
  																props: {
  																	'class': 'icon',
  																	childs: [{tag: 'i', props: {classList: ['fa', 'fa-steam', 'fa-2x', 'margin-5']}}]
  																}
  															},
  															{
  																tag: 'div',
  																props: {
  																	'class': 'slide',
  																	childs: [{tag: 'p', props: {style: {paddingLeft: '5px'}, text: 'Steam'}}]
  																}
  															}
  														]
  													}
  												}
  											]
  										}
  									}
  									]
  							}
  						}
  					]
  				}
  			}
  		]
  	}
  };
  let form = Core.generateElement({
  	tag: 'form',
  	props: {
  		classList: ['login-site-form', 'form-center'],
  		method: 'post',
  		action: 'javascript:login()',
  		noValidate: true,
  		childs: [
  			{
  				tag: 'input',
  				props: {
  					type: 'text',
  					'class': 'form-ctrl',
  					id: 'login_credential',
  					placeholder: 'Электронная почта или ник пользователя',
  					required: true,
  					autofocus: true
  				}
  			},
  			{
  				tag: 'input',
  				props: {
  					type: 'password',
  					autocomplete: 'off',
  					minlength: 6,
  					'class': 'form-ctrl',
  					id: 'login_password',
  					placeholder: 'Пароль',
  					required: true
  				}
  			},
  			{
  				tag: 'label',
  				props: {
  					style: {cursor: 'pointer'},
  					childs: [
  						{
  							tag: 'input',
  							props: {
  								type: 'checkbox',
  								attrs: {checked: 'true'},
  								id: 'login_remember_me'
  							}
  						},
  						{
  							tag: 'span', props: {text: 'Запомнить меня', style: {paddingLeft: '5px', userSelect: 'none'}}
  						}
  					]
  				}
  			},
  			buttons
  		]
  	}
  });
  */
  Core.Popup.create('Авторизация', "<form class=\"login-site-form\" method=\"post\" action=\"\">\n\t\t\t<input type=\"text\" id=\"login_credential\" name=\"login\" class=\"login-popup-form-input\" placeholder=\"\u041F\u043E\u0447\u0442\u043E\u0432\u044B\u0439 \u044F\u0449\u0438\u043A \u0438\u043B\u0438 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\">\n\t\t\t<input type=\"password\" id=\"login_password\" name=\"password\" class=\"login-popup-form-input\" autocomplete=\"off\" minlength=\"6\" placeholder=\"\u041F\u0430\u0440\u043E\u043B\u044C\">\n\t\t\t<label style=\"margin-left: 5px\">\n\t\t\t\t<input name=\"remember\" id=\"login_remember_me\" type=\"checkbox\" checked>\n\t\t\t\t\u0417\u0430\u043F\u043E\u043C\u043D\u0438\u0442\u044C \u043C\u0435\u043D\u044F\n\t\t\t</label>\n\t\t\t<div class=\"login-site-bottom\">\n\t\t\t\t<button id=\"loginBtn\" data-loading-icon=\"fa-circle-o-notch\" data-loading-text=\"\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F...\" type=\"submit\" class=\"login-popup-form-input\">\n\t\t\t\t\t\u0412\u0445\u043E\u0434\n\t\t\t\t</button>\n\t\t\t\t<div class=\"text-center\">\n\t\t\t\t\t<a href=\"/forum/password-recovery/\">\u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C?</a>\n\t\t\t\t\t/\n\t\t\t\t\t<a href=\"#\" id=\"site-register\">\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F?</a>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"login-popup-form-social\">\n\t\t\t\t\t<a href=\"/members/login/steam/\" title=\"\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Steam\"><i class=\"fa fa-steam fa-2x\"></i></a>\n\t\t\t\t\t<a href=\"/members/login/vk/\" title=\"\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 VK\"><i class=\"fa fa-vk fa-2x\"></i></a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>");
  setTimeout(function () {
    $('.login-site-form input#login_credential').focus();
  }, 100);
}

function countClicks(event, position, brand, country) {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {}
  };

  req.open('POST', '/click/', true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send('position=' + position + '&brand=' + brand + '&country=' + country);
}
/**
 * Пробегает по массиву и генерирует шаблон
 * Аналог <? foreach ... ?>
 *
 * @param templateObj
 * @param callback
 * @returns {string}
 */


function runThrough(templateObj, callback) {
  return Object.keys(templateObj).map(function (i) {
    return callback(templateObj[i], i);
  }).join('');
}
/**
 * Открывает и закрывает меню в телефонном режиме, ставя это событие на кнопку "три полоски" и на затемненый экран
 */


$('#swapMobileMenu').on('click', function () {
  toggleMobile();
});
$('#page-not-active').on('click', function () {
  toggleMobile();
});

function toggleMobile() {
  document.querySelectorAll('#swapMobileMenu i').forEach(function (el) {
    el.style.display === 'none' ? el.style.display = 'block' : el.style.display = 'none';
  });
  $('ul#mobile-navigation').toggleClass('navigation__list--mobile--active');
  var pageNotActive = document.querySelector('#page-not-active');

  if (pageNotActive.classList.contains('page-not-active')) {
    pageNotActive.style.height = 0;
    pageNotActive.classList.remove('page-not-active');
  } else {
    var headerHeight = document.querySelector('header').clientHeight;
    var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    pageNotActive.style.height = documentHeight - headerHeight + 'px';
    pageNotActive.style.top = headerHeight + 'px';
    pageNotActive.classList.add('page-not-active');
  }
}
