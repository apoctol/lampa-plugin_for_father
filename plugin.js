(function() {
    'use strict';
  
    var Defined = {
      api: 'custom',
      sources: [
        'https://rezka.ag/',
        'https://seasonvar.ru/',
        'https://lostfilmhd.ru/',
        'https://kinotochka.me/',
        'https://kinopub.me/',
        'https://kinoprofi.org/',
        'https://kinokrad.co/',
        'https://kinobase.org/',
        'https://filmix.ac/',
        'https://filmixtv.ru/',
        'https://redheadsound.ru/',
        'https://animevost.org/',
        'https://animego.org/',
        'https://animedia.tv/',
        'https://animebesst.org/',
        'https://anilibria.tv/',
        'https://rezka.ag/',
        'https://rhsprem.org/',
        'https://kodik.cc/',
        'https://remux.club/',
        'https://animelib.me/',
        'https://kinoukr.com/'
      ],
      apn: ''
    };
  
    function component(object) {
      var network = new Lampa.Reguest();
      var scroll = new Lampa.Scroll({
        mask: true,
        over: true
      });
      var files = new Lampa.Explorer(object);
      var filter = new Lampa.Filter(object);
      
      this.initialize = function() {
        this.loading(true);
        
        // Если в параметрах передан объект фильма – получаем для него доступные источники
        if(object.movie && object.movie.id) {
          var movie_id = object.movie.id;
          // Выбираем случайный источник для демонстрации.
          var source = Defined.sources[Math.floor(Math.random() * Defined.sources.length)];
          // Формируем запрос к API выбранного источника для конкретного фильма.
          // Здесь URL может отличаться в зависимости от реализации API
          network.native(source + 'api/v1/movie/' + movie_id, function(data) {
            // Предполагается, что в data.streams содержится массив потоков, фильтруем по 4K
            if(data.streams && data.streams.length) {
              var availableStreams = data.streams.filter(function(stream) {
                return stream.quality && stream.quality.includes('4K');
              });
              this.display(availableStreams);
            } else {
              this.doesNotAnswer();
            }
          }.bind(this), function() {
            this.doesNotAnswer();
          }.bind(this));
        }
        else {
          // Если фильма нет – загружаем общий список 4K фильмов
          var source = Defined.sources[Math.floor(Math.random() * Defined.sources.length)];
          network.native(source + 'api/v1/movies', function(data) {
            var filteredMovies = data.filter(function(movie) {
              return movie.quality && movie.quality.includes('4K');
            });
            this.display(filteredMovies);
          }.bind(this), function() {
            this.doesNotAnswer();
          }.bind(this));
        }
      };
      
      this.display = function(items) {
        scroll.clear();
        items.forEach(function(item) {
          // Если это поток (stream_4k) – используем шаблон онлайн, иначе шаблон фильма
          var templateName = item.stream_4k ? 'online' : 'movie';
          var element = Lampa.Template.get(templateName, item);
          element.on('hover:enter', function() {
            if(item.stream_4k) {
              Lampa.Player.play({ url: item.stream_4k });
            }
          });
          scroll.append(element);
        });
        Lampa.Controller.enable('content');
      };
      
      this.loading = function(status) {
        if (status) this.activity.loader(true);
        else {
          this.activity.loader(false);
          this.activity.toggle();
        }
      };
      
      this.doesNotAnswer = function() {
        scroll.clear();
        scroll.append(Lampa.Template.get('empty', {}));
        this.loading(false);
      };
      
      this.start = function() {
        this.initialize();
        Lampa.Controller.toggle('content');
      };
    }
    
    function startPlugin() {
      Lampa.Component.add('custom_online', component);
      Lampa.Manifest.plugins = {
        type: 'video',
        version: '1.0.0',
        name: 'NoAdsMovies',
        description: 'Плагин для просмотра 4K фильмов без рекламы',
        component: 'custom_online'
      };
      
      // Добавляем кнопку в карточку фильма, используя аналог реализации кнопок доступного контента
      Lampa.Listener.follow('full', function(event) {
        if (event.type === 'complite' && event.object && event.object.movie) {
          if (!event.object.buttons) event.object.buttons = [];
          event.object.buttons.push({
            title: '4K 😃',           // Иконка (можно заменить на любую)
            hover_title: 'Смотреть 4K', // Текст, отображающийся при наведении
            onClick: function() {
              Lampa.Activity.push({
                url: '',
                title: '4K Фильмы',
                component: 'custom_online',
                movie: event.object.movie  // Передаём объект фильма для загрузки источников
              });
            }
          });
        }
      });
    }
    
    startPlugin();
  })();
  