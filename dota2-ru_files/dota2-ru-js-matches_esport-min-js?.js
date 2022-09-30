"use strict";

var coreEsportMatch = {};
$(document).ready(function () {
  var searchTimer = null;
  var searchLastRequest = '';
  var typeOfContent = '';
  var gameCategory = $('.p-content').data('game-category') || 'dota2';
  if ($('.p-content').hasClass('esport-content-match')) typeOfContent = 'match';
  if ($('.p-content').hasClass('esport-content-map')) typeOfContent = 'map';
  if ($('.p-content').hasClass('esport-content-transfer')) typeOfContent = 'transfer';
  if ($('.p-content').hasClass('esport-content-build')) typeOfContent = 'build';

  coreEsportMatch.searchHide = function () {
    clearTimeout(searchTimer);
    $('.esport-search-results').stop().animate({
      top: '45px',
      opacity: 0
    }, 200, function () {
      $('.esport-search-results').hide();
    });
    $('.esport-match-wrapper, .esport-map-wrapper').stop().animate({
      opacity: 1
    }, 200);
    searchLastRequest = '';
  };

  coreEsportMatch.searchShow = function () {
    $('.esport-search-results').show().stop().animate({
      top: '38px',
      opacity: 1
    }, 200);
    $('.esport-match-wrapper, .esport-map-wrapper').stop().animate({
      opacity: .2
    }, 200);
  };

  coreEsportMatch.getMatchListByFilters = function () {
    var list = $('.active-filters-list');
    var team = list.find('[data-type="team"]').attr('data-value');
    var player = list.find('[data-type="player"]').attr('data-value');
    var hero = list.find('[data-type="hero"]').attr('data-value');
    var $tournament = list.find('[data-type="tournament"]');
    var tournament = $tournament.attr('data-value');
    var date = list.find('[data-type="date"]').attr('data-value');
    var region = $('.js-transfers-region-change').val();
    var position = list.find('[data-type="position"]').attr('data-value');
    var result = list.find('.js-builds-add-filter.active').attr('data-value');
    var data = {};
    if (team !== undefined) data.team = team;
    if (player !== undefined) data.player = player;
    if (hero !== undefined) data.hero = hero;
    if (position !== undefined) data.position = position;
    if (result !== undefined) data.result = result;
    if (tournament !== undefined) data.tournament = tournament;
    if (date !== undefined) data.date = date;
    if (region !== undefined && region.length > 0) data.region = region; // Убираем выделение у всех ближайших турниров

    $('.js-closest-tournaments-icon').removeClass('mod-active'); // Список турниров переносится на новую строку, если выбран какой либо фильтр

    if (team !== undefined || date !== undefined) {
      $('.js-closest-tournaments').addClass('mod-block');
    } else if (tournament !== undefined) {
      // Если выбирается турнир - подсвечиваем его в списке ближайших турниров
      // и скрываем его в стандартном списке
      var $closestTournament = $('.js-closest-tournaments-icon[data-id="' + tournament + '"]');

      if ($closestTournament.length === 0) {
        $('.js-closest-tournaments').addClass('mod-block');
      } else {
        $closestTournament.addClass('mod-active');
        $tournament.addClass('mod-hidden');
      }
    } else {
      $('.js-closest-tournaments').removeClass('mod-block');
    }

    var urlParams = $.param(data);
    if (urlParams !== '') urlParams = '?' + urlParams;

    switch (typeOfContent) {
      case 'match':
        {
          var requestUrl = 'api/matches/getListByFilters';
          var pushStateUrl = window.location.pathname;

          if (gameCategory === 'csgo') {
            requestUrl = 'esg/csgo/esport/matches/get_list_by_filters';
          }

          $.ajax({
            url: base_url + requestUrl,
            type: 'post',
            data: $.param(data),
            success: function success(response) {
              $('.esport-match').html(response.matches);
              coreEsportMatch.setEventOnShowingFullFutureMatches();
              coreEsportMatch.setEventOnShowingResult();
              coreUtils.setEventOnTitleTooltipes();
              history.pushState('', '', pushStateUrl + urlParams);
              coreEsportMatch.afterFilter();
            }
          });
          break;
        }

      case 'map':
        {
          $.ajax({
            url: base_url + 'esport/map/getListByFilters' + urlParams,
            type: 'get',
            success: function success(response) {
              $('.esport-map').html(response.matches);
              coreEsportMatch.setEventOnShowingResult();
              coreUtils.setEventOnTitleTooltipes();
              history.pushState('', '', '/esport/maps/' + urlParams);
              coreEsportMatch.afterFilter();
            }
          });
          break;
        }

      case 'transfer':
        {
          Core.Ajax.get('/esport/transfer/get_filtered_list' + urlParams, function (res) {
            $('.js-esport-transfer-list-wrap').html(res.data.html);
            coreEsportMatch.setEventOnShowingResult();
            history.pushState('', '', '/esport/transfers/' + urlParams);
            coreEsportMatch.afterFilter();
          });
          break;
        }

      case 'team':
        {
          $.ajax({
            url: base_url + 'esport/tournament/getListByFilters' + urlParams,
            type: 'get',
            success: function success(response) {
              $('.esport-tournament-filter-wrap').html(response.matches);
              coreEsportMatch.setEventOnShowingResult();
              coreUtils.setEventOnTitleTooltipes();
              history.pushState('', '', '/esport/maps/' + urlParams);
              coreEsportMatch.afterFilter();
            }
          });
          break;
        }

      case 'build':
        {
          Core.Ajax.post(base_url + 'api/builds/getListByFilters' + urlParams, {}, function (response) {
            if (response.status === 'success') {
              $('.js-esport-build-list').html(response.view);
              history.pushState('', '', '/esport/builds/' + urlParams);
              coreEsportMatch.afterFilter();
              appendShowTalentTree();
            }
          });
          break;
        }
    }
  };

  coreEsportMatch.afterFilter = function () {
    $('.esport-match-index-search').find('input').val(''); // Если записи не найдены - отображаем соответствующее сообщение

    var $wrap = $('.js-esport-list-wrap');

    if ($wrap.length > 0 && $wrap.html().trim().length === 0) {
      $wrap.html('<p style="margin: 0; padding: 10px 20px; background-color:#222328;">' + $wrap.data('empty-message') + '</p>');
    }
  };

  coreEsportMatch.loadBlockShow = function () {
    $('.esport-search-results-content').empty();
    $('.esport-search-results').find('.esport-no-results-load-block').stop().fadeIn(0);
  };

  coreEsportMatch.loadBlockHide = function () {
    $('.esport-search-results').find('.esport-no-results-load-block').stop().fadeOut(200);
  };

  coreEsportMatch.setEventOnShowingResult = function () {
    $('.match-shop-result').off('click'); // Отображение счета у конкретного матча

    $(document).on('click', '.match-shop-result', function () {
      $(this).text($(this).data('value'));
      $(this).removeClass('match-shop-result');
      return false;
    }); // Отображение счета у всех матчей

    $(document).on('click', '.js-esport-show-all-match-results', function () {
      $('.match-shop-result').each(function () {
        $(this).text($(this).data('value'));
        $(this).removeClass('match-shop-result');
      });
      $(this).hide();
    });

    switch (typeOfContent) {
      //case 'match':{
      //    $('.match-shop-result').off('click').on('click', function(){
      //        var $obj = $(this);
      //        $obj.text($obj.data('value'));
      //        return false;
      //    });
      //
      //    break;
      //}
      case 'map':
        {
          $('.esport-match-show-vod').off('click').on('click', function () {
            var videoId = $(this).data('id'),
                gameNumber = $(this).data('game-number');
            popup_show('<div class="popup-overlay">' + '<div class="popup">' + '<div class="close"><i class="fa fa-times"></i></div>' + '<div class="offer-popup-form">' + '<h2>Игра ' + gameNumber + '</h2>' + '<div style="width:860px; height: 484px;">' + '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen="" scrolling="no"></iframe>' + '</div>' + '</div>' + '</div>' + '</div>');
          });
          $('.esport-match-show-result').off('click').on('click', function () {
            var $obj = $(this);
            $.ajax({
              url: base_url + 'esport/match/ajaxGetMapResult/' + $obj.data('id'),
              type: 'get',
              success: function success(response) {
                popup_show(response);
              }
            });
          });
          break;
        }
    }
  };

  var toggleTitleSaverMainPage = '';

  coreEsportMatch.setEventOnShowingFullFutureMatches = function () {
    $('.esport-match-future-matches-show').off('click').on('click', function () {
      if (toggleTitleSaverMainPage == '') {
        toggleTitleSaverMainPage = $(this).text();
        $(this).text($(this).data('toggle-title'));
        var team = $('.active-filters-list').find('[data-type="team"]').attr('data-value');
        var tournament = $('.active-filters-list').find('[data-type="tournament"]').attr('data-value');
        var date = $('.active-filters-list').find('[data-type="date"]').attr('data-value');
        var data = {};

        if (team != undefined) {
          data.team = team;
        }

        if (tournament != undefined) {
          data.tournament = tournament;
        }

        if (date != undefined) {
          data.date = date;
        }

        var urlParams = $.param(data);

        if (urlParams != '') {
          urlParams = '?' + urlParams;
        }

        var requestUrl = '/esport/match/getFullFutureList/';

        if (gameCategory === 'csgo') {
          requestUrl = '/esg/csgo/esport/matches/get_full_future_list/';
        }

        $.ajax({
          url: requestUrl + urlParams,
          type: 'get',
          success: function success(response) {
            $('.esport-match-future-list').html(response.matches);
            $('.esport-match-future-matches-show').parents('.buttons-more').find('.js-esport-index-page-show-more').hide();
            $('.esport-match-future-matches-show').parents('.buttons-more').find('.esport-match-future-matches-show').hide();
            $('.esport-match-future-matches-show').parents('.buttons-more').find('.js-esport-displayed-all-futured-matches').css('display', 'flex');
            coreEsportMatch.setEventOnShowingResult();
          }
        });
      } else {
        var min = this.dataset.minCount ? this.dataset.minCount : 10;
        $(this).text(toggleTitleSaverMainPage);
        toggleTitleSaverMainPage = '';
        $('.esport-match-future-list').find('.cybersport-matches__matches-match').slice(min).fadeOut(200);
      }

      return false;
    });
  };

  coreEsportMatch.afterFilter();
  coreEsportMatch.setEventOnShowingResult();
  coreEsportMatch.setEventOnShowingFullFutureMatches();
  /**
   * Исключение элемента из фильтра
   */

  function setEventOnMatchFilters() {
    $('.active-filters-list').find('.active-filters-single').off('click').on('click', function () {
      $(this).remove();
      var type = $(this).attr('data-type');

      if (type == 'tournament') {
        $('.js-closest-tournaments-icon').removeClass('mod-active');
      }

      if (type == 'date') {
        $('#datepicker').val('');
      }

      coreEsportMatch.getMatchListByFilters();
    });
  }

  setEventOnMatchFilters();
  /**
   * Выбор команды из списка поиска
   */

  function setEventOnFilterTeam() {
    $('.js-esport-search-results-teams').find('.single').off('click').on('click', function () {
      if ($('.active-filters-list').find('[data-type="team"]').attr('class') != 'active-filters-single') {
        var clone = $('.filters-clone').find('[data-type="team"]').clone();
        clone.find('span').text($(this).find('span').text());
        clone.attr('data-value', $(this).attr('data-id'));
        $('.active-filters-list').append(clone);
      } else {
        $('.active-filters-list').find('[data-type="team"]').find('span').text($(this).find('span').text());
        $('.active-filters-list').find('[data-type="team"]').attr('data-value', $(this).attr('data-id'));
      }

      coreEsportMatch.getMatchListByFilters();
      setEventOnMatchFilters();
    });
  }
  /**
   * Выбор турниров команды
   */


  function setEventOnFilterTournament() {
    $('.js-esport-search-results-tournaments').find('.single').off('click').on('click', function () {
      if ($('.active-filters-list').find('[data-type="team"]').attr('class') != 'active-filters-single') {
        var clone = $('.filters-clone').find('[data-type="team"]').clone();
        clone.find('span').text($(this).find('span').text());
        clone.attr('data-value', $(this).attr('data-id'));
        $('.active-filters-list').append(clone);
      } else {
        $('.active-filters-list').find('[data-type="team"]').find('span').text($(this).find('span').text());
        $('.active-filters-list').find('[data-type="team"]').attr('data-value', $(this).attr('data-id'));
      }

      coreEsportMatch.getMatchListByFilters();
      setEventOnMatchFilters();
    });
  }
  /**
   * Выбор игрока из списка поиска
   * // todo убрать копипаст
   */


  function setEventOnFilterPlayer() {
    $('.js-esport-search-results-players').find('.single').off('click').on('click', function () {
      if ($('.active-filters-list').find('[data-type="player"]').attr('class') != 'active-filters-single') {
        var clone = $('.filters-clone').find('[data-type="player"]').clone();
        clone.find('span').text($(this).find('span').text());
        clone.attr('data-value', $(this).attr('data-id'));
        $('.active-filters-list').append(clone);
      } else {
        $('.active-filters-list').find('[data-type="player"]').find('span').text($(this).find('span').text());
        $('.active-filters-list').find('[data-type="player"]').attr('data-value', $(this).attr('data-id'));
      }

      coreEsportMatch.getMatchListByFilters();
      setEventOnMatchFilters();
    });
  }
  /**
   * Выбор героя из списка поиска
   */


  function setEventOnFilterHero() {
    $('.js-esport-search-results-heroes').find('.single').off('click').on('click', function () {
      if ($('.active-filters-list').find('[data-type="hero"]').attr('class') != 'active-filters-single') {
        var clone = $('.filters-clone').find('[data-type="hero"]').clone();
        clone.find('span').text($(this).find('span').text());
        clone.attr('data-value', $(this).attr('data-id'));
        $('.active-filters-list').append(clone);
      } else {
        $('.active-filters-list').find('[data-type="hero"]').find('span').text($(this).find('span').text());
        $('.active-filters-list').find('[data-type="hero"]').attr('data-value', $(this).attr('data-id'));
      }

      coreEsportMatch.getMatchListByFilters();
      setEventOnMatchFilters();
    });
  }
  /**
   * Выбор позиции из списка поиска
   */


  function setEventOnFilterPosition() {
    $('.js-esport-search-results-positions').find('.single').off('click').on('click', function () {
      if ($('.active-filters-list').find('[data-type="position"]').attr('class') != 'active-filters-single') {
        var clone = $('.filters-clone').find('[data-type="position"]').clone();
        clone.find('span').text($(this).find('span').text());
        clone.attr('data-value', $(this).attr('data-id'));
        $('.active-filters-list').append(clone);
      } else {
        $('.active-filters-list').find('[data-type="position"]').find('span').text($(this).find('span').text());
        $('.active-filters-list').find('[data-type="position"]').attr('data-value', $(this).attr('data-id'));
      }

      coreEsportMatch.getMatchListByFilters();
    });
  }
  /**
   * Выбор позиции из списка поиска
   */


  function setEventOnFilterResult() {
    $('.js-builds-add-filter').off('click').on('click', function () {
      if (document.querySelector('.js-builds-add-filter.active') != this) {
        $('.active-filters-list').find('.js-builds-add-filter.active').removeClass('active');
        $(this).addClass('active');
      } else {
        $('.active-filters-list').find('.js-builds-add-filter.active').removeClass('active');
      }

      coreEsportMatch.getMatchListByFilters();
    });
  }

  setEventOnFilterResult();
  /**
   * Выбор турнира из списка поиска
   */

  function setEventOnFilterTournament() {
    $('.js-esport-search-results-tournaments').find('.single').off('click').on('click', function () {
      filterByTournament($(this).find('span').text(), $(this).attr('data-id'));
    });
  }
  /**
   * Выбор турнира из списка ближайших турниров
   */


  $('.js-closest-tournaments-icon').on('click', function () {
    if (!$(this).hasClass('mod-active')) {
      // Отображаем выбранный турнир, подгружаем данные
      filterByTournament($(this).attr('alt'), $(this).data('id'));
    } else {
      // Отменяем выделение турнира, подгружаем данные
      $('.active-filters-list').find('[data-type="tournament"]').remove();
      coreEsportMatch.getMatchListByFilters();
    }
  });
  /**
   * Добавляет "фильтр" по турниру и обновляет записи матчей/карт
   * @param text
   * @param id
   */

  function filterByTournament(text, id) {
    var $activeFiltersTournament = $('.active-filters-list').find('[data-type="tournament"]');

    if ($activeFiltersTournament.length === 0) {
      var $clone = $('.filters-clone').find('[data-type="tournament"]').clone();
      $clone.find('span').text(text);
      $clone.attr('data-value', id);
      $('.active-filters-list').append($clone);
    } else {
      $activeFiltersTournament.find('span').text(text);
      $activeFiltersTournament.attr('data-value', id).removeClass('mod-hidden');
    }

    coreEsportMatch.getMatchListByFilters();
    setEventOnMatchFilters();
  }

  $('.esport-match-index-search').find('input').keyup(function () {
    clearTimeout(searchTimer);
    var $obj = $(this);
    var value = $obj.val();
    coreEsportMatch.searchShow();

    if (value == '') {
      coreEsportMatch.searchHide();
      return;
    }

    if (value == searchLastRequest) {
      coreEsportMatch.loadBlockHide();
      return;
    }

    coreEsportMatch.loadBlockShow();
    searchTimer = setTimeout(function () {
      searchLastRequest = value;
      var requestUrl = '/api/matches/search/';

      if (gameCategory === 'csgo') {
        requestUrl = '/esg/csgo/esport/matches/search_by_teams_and_tournaments/';
      }

      Core.Ajax.post(requestUrl, {
        search: value,
        search_stats_id: $obj.data('search-stats-id'),
        search_type: $obj.data('search-type')
      }, function (response) {
        coreEsportMatch.loadBlockHide();

        switch (response.status) {
          case "success":
            $('.esport-search-results-content').html(response.html);
            setEventOnFilterTeam();
            setEventOnFilterTournament();
            setEventOnFilterPlayer();
            setEventOnFilterHero();
            setEventOnFilterPosition();
            break;

          case "invalidRequest":
            Utils.notify('Ошибка выполнения запроса', 'warning', 500);
            break;
        }
      });
    }, 500);
  }).blur(function () {
    coreEsportMatch.searchHide();
  }).focus(function () {
    if ($(this).val() != '') {
      coreEsportMatch.searchShow();
    }
  });

  coreEsportMatch.setDatePicker = function () {
    $('#datepicker').off('change', toggleCalendar).on('change', toggleCalendar);
  };

  function toggleCalendar() {
    if ($(this).val() == '') {
      $('.active-filters-list').find('[data-type="date"]').remove();
      return false;
    }

    if ($('.active-filters-list').find('[data-type="date"]').attr('class') != 'active-filters-single') {
      var clone = $('.filters-clone').find('[data-type="date"]').clone();
      clone.find('span').text($(this).val());
      clone.attr('data-value', $(this).val());
      $('.active-filters-list').append(clone);
    } else {
      $('.active-filters-list').find('[data-type="date"]').find('span').text($(this).val());
      $('.active-filters-list').find('[data-type="date"]').attr('data-value', $(this).val());
    }

    coreEsportMatch.getMatchListByFilters();
    setEventOnMatchFilters();
    $('#datepicker').off('change', this);
  }

  coreEsportMatch.setDatePicker(); // При смене региона на странице трансферов обновляем список игроков

  $('.js-transfers-region-change').change(function () {
    coreEsportMatch.getMatchListByFilters();
  });
  $(document).on('click', '.esport-tabs-single', function () {
    var $obj = $(this),
        $wrapper = $obj.parents('.esport-tabs-wrapper'),
        id = $obj.data('tab');
    $wrapper.find('.esport-tabs').find('.btn-global--active').removeClass('btn-global--active');
    $obj.addClass('btn-global--active');
    $wrapper.find('.esport-tabs-content').hide();
    $wrapper.find('.esport-tabs-content[data-tab="' + id + '"]').show();
  });
  $('.esport-match-show-vods-list').click(function () {
    var videos = $(this).data('id');
    var gameNumber = $(this).data('game-number');
    var vodsBlock = '';
    var currentVod = '';

    for (var i in videos) {
      var video = videos[i];

      if (i == 0) {
        currentVod = '<div style="width:860px; height: 484px;">' + '<iframe class="currentVod" width="100%" height="100%" src="https://www.youtube.com/embed/' + video.link + '" frameborder="0" allowfullscreen="" scrolling="no"></iframe>' + '</div>';
      }

      vodsBlock += '<div class="esport-tabs-single esport-match-vods-list-item' + (i == 0 ? ' active' : '') + '"' + 'data-id="' + video.link + '"' + 'data-game-number="' + gameNumber + '"' + 'title="Смотреть запись">' + '<span>' + video.name + '</span>' + '</div>';
    }

    popup_show('<div class="popup-overlay">' + '<div class="popup">' + '<div class="close"><i class="fa fa-times"></i></div>' + '<div class="offer-popup-form">' + '<h2>Игра ' + gameNumber + '</h2>' + '<div class="esport-tabs clearfix">' + vodsBlock + '</div>' + currentVod + '</div>' + '</div>' + '</div>' + '</div>');
  });
  $(document).on('click', '.esport-match-vods-list-item', function () {
    var videoId = $(this).data('id');
    $('.esport-match-vods-list-item').removeClass('active');
    $(this).addClass('active');
    $('.currentVod').attr('src', 'https://www.youtube.com/embed/' + videoId + '');
  });
  $(document).on('click', '.esport-match-show-vod', function () {
    var videoId = $(this).data('id'),
        gameNumber = $(this).data('game-number');
    popup_hide();
    popup_show("<div id=\"viewGameReplay\" aria-hidden=\"true\" tabindex=\"-1\" role=\"dialog\" class=\"global-content__modal-window global-content__unique--modal-window\" style=\"display: flex;\">\n            <div class=\"global-content__modal\">\n                <button class=\"global-content__modal-window--btn-close\" data-dismiss=\"modal\">\n                    <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n                </button>\n                <div class=\"modal-content primary-content\">\n                    <h3 class=\"authorization__title\">\n                        \u0418\u0433\u0440\u0430 ".concat(gameNumber, "\n                    </h3>\n                    <div class=\"global-content__modal-body\" style=\"height: 373px;\">\n                        <iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/").concat(videoId, "\" frameborder=\"0\" allowfullscreen=\"\" scrolling=\"no\"></iframe>\n                    </div>\n                </div>\n            </div>\n        </div>"));
  });
  $('.esport-match-show-winner').click(function () {
    var winnerId = $(this).data('winner-id');

    if (winnerId == undefined) {
      return false;
    }

    $(this).parents('.esport-match-view-vods-single').find('.esport-match-view-vods-single-pick[data-team-id!="' + winnerId + '"]').animate({
      opacity: .2
    }, 200);
  }); //$('.esport-match-view-vods-single').on('mouseleave',function(){
  //    $(this)
  //        .find('.esport-match-view-vods-single-winner')
  //        .animate({'opacity':0}, 150);
  //});

  $('.match-view-stream-tabs-single__stream-input').click(function () {
    var tab = $(this).data('tab');
    $('.match-view-stream-tabs-single__stream-input').removeClass('checked');
    $(this).addClass('checked');
    $('.esport-match-view-stream').hide();
    $('.esport-match-view-stream[data-stream-tab="' + tab + '"]').show();
  });
  $(document).on('click', '.esport-match-view-info-basic-poll-link', function () {
    var $obj = $(this),
        teamId = $obj.data('team-id'),
        matchId = $obj.data('match-id');
    $.ajax({
      url: '/esport/forecast/ajaxVote/' + matchId + '/' + teamId,
      type: 'get',
      success: function success(response) {
        if (response.message != undefined) {
          createNotice(response.message);
        }

        if (response.auth != undefined && response.auth === false) {
          Utils.login();
        }

        if (response.status == 1) {
          $obj.parent().append('<div class="esport-match-your-vote">Ваш голос</div>');
          $('.esport-match-view-info-basic-poll-link').remove();
          $('.esport-match-view-info-basic-poll-left').find('b').text(response.percentTeamLeft + '%');
          $('.esport-match-view-info-basic-poll-right').find('b').text(response.percentTeamRight + '%');
          $('.esport-match-view-info-basic-poll-left').find('span').text(response.votesTeamLeft);
          $('.esport-match-view-info-basic-poll-right').find('span').text(response.votesTeamRight);
          $('.esport-match-view-info-basic-poll-left').removeClass('esport-match-view-info-basic-poll-green');
          $('.esport-match-view-info-basic-poll-right').removeClass('esport-match-view-info-basic-poll-green');

          if (response.percentTeamLeft > response.percentTeamRight) {
            $('.esport-match-view-info-basic-poll-left').addClass('esport-match-view-info-basic-poll-green');
            $('.esport-match-view-info-basic-poll-line-active').css({
              'width': response.percentTeamLeft + '%',
              'left': 0
            });
          } else {
            $('.esport-match-view-info-basic-poll-right').addClass('esport-match-view-info-basic-poll-green');
            $('.esport-match-view-info-basic-poll-line-active').css({
              'width': response.percentTeamRight + '%',
              'right': 0
            });
          }
        }
      }
    });
    return false;
  });
  setInterval(function () {
    $('.esport-match-duration-dynamic').each(function () {
      var $obj = $(this),
          now = new Date(),
          start = new Date(),
          diff;
      start.setTime($obj.data('value') * 1000);
      diff = now - start;
      var hours = Math.floor(diff / (1000 * 60 * 60)) % 24,
          minutes = Math.floor(diff / (1000 * 60)) % 60,
          seconds = Math.floor(diff / 1000) % 60;

      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      if (minutes < 10 && hours > 0) {
        minutes = '0' + minutes;
      }

      if (hours > 0) {
        $obj.text('+' + hours + ':' + minutes + ':' + seconds);
      } else {
        $obj.text('+' + minutes + ':' + seconds);
      }
    });
  }, 1000);
  $('.esport-match-current-pick-tabs').find('.esport-match-current-pick-tabs-single').click(function () {
    var $obj = $(this);
    $('.esport-match-current-pick-tabs-single').removeClass('esport-match-current-pick-tabs-single-active');
    $obj.addClass('esport-match-current-pick-tabs-single-active');
    $('.esport-match-view-map-single').hide();
    $('.esport-match-view-map-single[data-tab-id="' + $obj.data('tab-id') + '"]').show();
  });
  $('.esport-tournament-view-grid-single-column-game-single-row').on('mouseover', function () {
    $('.esport-tournament-view-grid-single-column-game-single-row[data-team-id="' + $(this).data('team-id') + '"]').addClass('esport-grind-team-hover');
  }).on('mouseleave', function () {
    $('.esport-tournament-view-grid-single-column-game-single-row[data-team-id="' + $(this).data('team-id') + '"]').removeClass('esport-grind-team-hover');
  }); // Меняем курсор, если необходим скролл турнирной сетки

  if ($('.esport-tournament-view-grid-single').width() < $('.esport-tournament-view-grid-single-layout').width()) {
    $('.esport-tournament-view-grid-single').addClass('mod-moveable');
  } // Скролл турнирной сетки


  var click = false,
      clickX,
      scrollLeft;
  $('.esport-tournament-view-grid-single').on({
    'mousemove touchmove': function mousemoveTouchmove(e) {
      if (click) {
        if (e.type === 'touchmove') {
          $('.esport-tournament-view-grid-single').scrollLeft(scrollLeft + (clickX - e.originalEvent.touches[0].pageX));
        } else $('.esport-tournament-view-grid-single').scrollLeft(scrollLeft + (clickX - e.pageX));
      }
    },
    'mousedown touchstart': function mousedownTouchstart(e) {
      click = true;
      scrollLeft = $('.esport-tournament-view-grid-single').scrollLeft();

      if (e.type === 'touchstart') {
        clickX = e.originalEvent.touches[0].pageX;
      } else clickX = e.pageX;
    },
    'mouseup touchend': function mouseupTouchend() {
      click = false;
    }
  });
  var streamClass = '.js-esport-match-view-stream'; // Отображение iframe стрима

  coreEsportMatch.loadStream = function ($stream) {
    $stream.css({
      'height': 'auto'
    });
    var $player = $stream.find('.esport-match-view-stream-player');
    $player.html(decodeURIComponent(escape(window.atob($player.html())))).show();
    $player.height($player.width() / 1.78);
    var $chat = $stream.find('.esport-match-view-stream-chat');
    $chat.html(decodeURIComponent(escape(window.atob($chat.html())))).show();
    $stream.find('.esport-match-view-stream-image').remove();
  }; // Подгружаем стрим по кнопке play


  $('.esport-match-view-stream-image i').click(function () {
    coreEsportMatch.loadStream($(this).parents(streamClass));
  }); // У обертки стрима задаем высоту в соответствии соотношения 16/9

  if ($(window).width() < 1251) {
    $(streamClass).height($(streamClass).width() / 1.78);
  } // Если стрим всего один - подгружаем его сразу же


  if ($(streamClass).length === 1) {
    coreEsportMatch.loadStream($(streamClass));
  }

  $('.user-edit-block[data-category="player"]').click(function () {
    var $obj = $(this);
    $.ajax({
      url: base_url + 'esport/player/getFormForEdit/' + $obj.data('id'),
      type: 'get',
      success: function success(response) {
        if (response.message != undefined) {
          createNotice(response.message);
          return false;
        }

        popup_show(response);
        setEventOnSelector();
        $('.esport-player-edit').find('.send').click(function () {
          var $playerNick = $('.esport-player-edit').find('input[name="player_nick"]'),
              $playerCountry = $('.esport-player-edit').find('select[name="player_country_id"]'),
              $playerName = $('.esport-player-edit').find('input[name="player_name"]'),
              $playerTeam = $('.esport-player-edit').find('input[name="player_team_id"]'),
              $playerBirthday = $('.esport-player-edit').find('input[name="player_birthday"]');
          $playerDescription = $('.esport-player-edit').find('textarea[name="player_description"]');
          $.ajax({
            url: base_url + 'esport/player/getFormForEdit/' + $obj.data('id'),
            type: 'post',
            data: {
              'nick': $playerNick.val(),
              'country': $playerCountry.val(),
              'name': $playerName.val(),
              'team': $playerTeam.val(),
              'birthday': $playerBirthday.val(),
              'description': $playerDescription.val()
            },
            success: function success(response) {
              popup_hide();
              createNotice(response.message);
            }
          });
        });
      }
    });
  });
  $('.user-edit-block[data-category="team"]').click(function () {
    var $obj = $(this);
    $.ajax({
      url: base_url + 'esport/team/getFormForEdit/' + $obj.data('id'),
      type: 'get',
      success: function success(response) {
        if (response.message != undefined) {
          createNotice(response.message);
          return false;
        }

        popup_show(response);
        $('.esport-team-edit').find('.send').click(function () {
          var $teamTitle = $('.esport-team-edit').find('input[name="team_title"]'),
              $teamCountry = $('.esport-team-edit').find('select[name="team_country_id"]'),
              $teamLocation = $('.esport-team-edit').find('input[name="team_location"]'),
              $teamDesc = $('.esport-team-edit').find('textarea[name="team_desc"]'),
              $teamEarn = $('.esport-team-edit').find('input[name="team_earn"]');
          $.ajax({
            url: base_url + 'esport/team/getFormForEdit/' + $obj.data('id'),
            type: 'post',
            data: {
              'title': $teamTitle.val(),
              'country': $teamCountry.val(),
              'location': $teamLocation.val(),
              'desc': $teamDesc.val(),
              'earn': $teamEarn.val()
            },
            success: function success(response) {
              popup_hide();
              createNotice(response.message);
            }
          });
        });
      }
    });
  });
  var selectorTimer = null;

  function setEventOnSelector() {
    $('.selector-input').off('keyup').on('keyup', function () {
      clearTimeout(selectorTimer);
      var $obj = $(this);
      var $parent = $obj.parents('.selector');
      var $list = $parent.find('.selector-list');

      if (empty($obj.val())) {
        $parent.find('.selector-input-hidden').val('');
        $parent.find('.selector-list').html('');
        $list.hide();
        return;
      }

      $list.fadeIn(200);
      var url = '',
          added = '';

      if ($parent.hasClass('selector-team')) {
        url = 'yana/esport/team/getListByValue';
      } else if ($parent.hasClass('selector-tournament')) {
        url = 'yana/esport/tournament/getListByValue';
      } else if ($parent.hasClass('selector-hero')) {
        url = 'yana/heroes/getListByValue';
      } else if ($parent.hasClass('selector-player')) {
        url = 'yana/esport/player/getListByValue';
      } else if ($parent.hasClass('selector-commentator')) {
        url = 'yana/esport/commentator/getListByValue';
        added = $('select#studio_id').val();
      }

      if (url == '') {
        return;
      }

      selectorTimer = setTimeout(function () {
        $.ajax({
          url: base_url + url + '?value=' + $obj.val() + (added.length > 0 ? '&stud2io=' + added : ''),
          type: 'get',
          success: function success(data) {
            $parent.find('.selector-list').html(data.view);
            setEventOnSelectorList();
          }
        });
      }, 1000);
    }).off('blur').on('blur', function () {
      var $obj = $(this);
      var $parent = $obj.parents('.selector');
      var $list = $parent.find('.selector-list');
      setTimeout(function () {
        $list.fadeOut(200, function () {
          $list.html('');
        });
      }, 400);
    });

    function setEventOnSelectorList() {
      $('.selector-list').find('.single').off('click').on('click', function () {
        var $obj = $(this);
        var $parent = $obj.parents('.selector');
        $parent.find('.selector-input-hidden').val($obj.data('id'));

        if ($parent.hasClass('selector-test')) {
          $parent.find('.selector-input').val($obj.find('span').text());
        } else {
          $parent.find('.selector-input').val($obj.find('.single-title').text());
        }

        $('.selector-list').html('').hide();
      });
    }
  }

  var toggleTitleSaver = '';
  $('.esport-tournament-view-teams-wrapper-show-all').click(function () {
    if (toggleTitleSaver == '') {
      toggleTitleSaver = $(this).text();
      $(this).text($(this).data('toggle-title'));
      $('.esport-tournament-view-teams-wrapper-list-single').fadeIn(200);
    } else {
      $(this).text(toggleTitleSaver);
      toggleTitleSaver = '';
      var i = 0;
      $('.esport-tournament-view-teams-wrapper-list-single').slice(6).fadeOut(200);
    }

    return false;
  });
  var newsToggleTitleSaver = '';
  var $newsList = $('.js-esport-view-news-list');
  var defaultNewsCount = $newsList.length > 0 ? $newsList.data('news-count') : 3;
  $newsList.children().slice(defaultNewsCount).hide();
  $('.js-esport-view-news-wrapper-show-all').click(function () {
    if (newsToggleTitleSaver == '') {
      newsToggleTitleSaver = $(this).text();
      $(this).text($(this).data('toggle-title'));
      $newsList.addClass('mod-appended').children().fadeIn(200);
    } else {
      $(this).text(newsToggleTitleSaver);
      newsToggleTitleSaver = '';
      var i = 0;
      $newsList.children().slice(defaultNewsCount).fadeOut(200);
    }

    return false;
  });
  var videosToggleTitleSaver = '';
  $('.video-list').children().slice(3).hide();
  $('.esport-tournament-view-video-wrapper-show-all').click(function () {
    if (videosToggleTitleSaver == '') {
      videosToggleTitleSaver = $(this).text();
      $(this).text($(this).data('toggle-title'));
      $('.video-list').children().fadeIn(200);
    } else {
      $(this).text(videosToggleTitleSaver);
      videosToggleTitleSaver = '';
      var i = 0;
      $('.video-list').children().slice(3).fadeOut(200);
    }

    return false;
  }); //var toggleTitleSaver = '';
  //
  //$('[data-toggle-title]').click(function(){
  //
  //    if(toggleTitleSaver == ''){
  //        toggleTitleSaver = $(this).text();
  //        $(this).text($(this).data('toggle-title'));
  //    }else{
  //        $(this).text(toggleTitleSaver);
  //        toggleTitleSaver = '';
  //    }
  //
  //});

  $('.cybersport-matches-match__mobile--swap').children('[data-type]').on('click', function () {
    $('.cybersport-matches-match__mobile--swap > [data-type]').removeClass('btn-global--active');
    $(this).addClass('btn-global--active');
    var active = $(this).attr('data-type'),
        gameBlock = $('.cybersport-matches-match__record-game-block');
    gameBlock.find('[data-type="overview"], [data-type="farm"], [data-type="items"]').removeClass('show-columns');
    gameBlock.find("[data-type=\"".concat(active, "\"]")).addClass('show-columns');
  }); // По дефолту оставляем overview

  $('.cybersport-matches-match__record-game-block').find('[data-type="overview"]').addClass('show-columns');
});

function betsPopup(match_id) {
  Core.Ajax.get("/esport/match/bets/".concat(match_id, "/"), function (resp) {
    Core.Popup.create('Ставки', resp.data.popup);
  });
}
