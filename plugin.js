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
        
        if(object.movie && object.movie.id) {
          var movie_id = object.movie.id;
          var source = Defined.sources[Math.floor(Math.random() * Defined.sources.length)];
          
          network.native(source + 'api/v1/movie/' + movie_id, function(data) {
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
      
      // Исправленная интеграция кнопки
      Lampa.Listener.follow('full', function(event) {
        if (event.type === 'complite' && event.object && event.object.movie) {
          const movie = event.object.movie;
          
          // Создаем кнопку с использованием jQuery
          const button = $(`
            <div class="view--custom_online selector" 
                 style="background-color: #4CAF50; color: white; margin: 5px; padding: 8px 12px; border-radius: 4px;">
              4K Без рекламы
            </div>
          `);
          
          // Вставляем кнопку после кнопки торрента
          button.on('hover:enter', function() {
            Lampa.Activity.push({
              url: '',
              title: '4K Фильмы',
              component: 'custom_online',
              movie: movie
            });
          });
          
          // Находим контейнер кнопок и добавляем нашу
          const buttonsContainer = event.object.activity.render().find('.full-start__buttons');
          buttonsContainer.append(button);
        }
      });
    }
    
    startPlugin();
})();