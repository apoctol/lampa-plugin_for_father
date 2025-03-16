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
      var scroll = new Lampa.Scroll({ mask: true, over: true });
      var files = new Lampa.Explorer(object);
      var filter = new Lampa.Filter(object);
      
      this.initialize = function() {
        this.loading(true);
        
        if(object.movie && object.movie.id) {
          var source = Defined.sources[Math.floor(Math.random() * Defined.sources.length)];
          network.native(source + 'api/v1/movie/' + object.movie.id, function(data) {
            if(data.streams && data.streams.length) {
              var streams = data.streams.filter(s => s.quality.includes('4K'));
              this.display(streams);
            } else this.doesNotAnswer();
          }.bind(this), this.doesNotAnswer.bind(this));
        } else {
          source = Defined.sources[Math.floor(Math.random() * Defined.sources.length)];
          network.native(source + 'api/v1/movies', function(data) {
            var movies = data.filter(m => m.quality.includes('4K'));
            this.display(movies);
          }.bind(this), this.doesNotAnswer.bind(this));
        }
      };
      
      this.display = function(items) {
        scroll.clear();
        items.forEach(item => {
          var element = Lampa.Template.get(item.stream ? 'online' : 'movie', item);
          element.on('hover:enter', () => Lampa.Player.play({ url: item.stream }));
          scroll.append(element);
        });
        Lampa.Controller.enable('content');
      };
      
      this.loading = function(status) {
        this.activity.loader(status);
        if(!status) this.activity.toggle();
      };
      
      this.doesNotAnswer = function() {
        scroll.clear().append(Lampa.Template.get('empty', {}));
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
      
      // Добавление кнопки в карточку фильма
      Lampa.Listener.follow('full', function(event) {
        if(event.type === 'complite' && event.object.movie) {
          const button = $(`
            <div class="view--custom_online selector" 
                 style="background: #4CAF50; color: white; margin: 5px; padding: 8px 12px; border-radius: 4px;">
              4K Без рекламы
            </div>
          `);
          
          button.on('hover:enter', () => {
            Lampa.Activity.push({
              title: '4K Фильмы',
              component: 'custom_online',
              movie: event.object.movie
            });
          });
          
          // Вставляем кнопку после кнопки торрента
          const container = event.object.activity.render().find('.full-start__buttons');
          container.append(button);
        }
      });
    }
    
    startPlugin();
})();