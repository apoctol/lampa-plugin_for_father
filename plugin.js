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
        
        var source = Defined.sources[Math.floor(Math.random() * Defined.sources.length)];
        
        network.native(source + 'api/v1/movies', function(data) {
          var filteredMovies = data.filter(movie => movie.quality.includes('4K'));
          this.display(filteredMovies);
        }.bind(this), function() {
          this.doesNotAnswer();
        }.bind(this));
      };
      
      this.display = function(movies) {
        scroll.clear();
        movies.forEach(function(movie) {
          var item = Lampa.Template.get('online', movie);
          item.on('hover:enter', function() {
            Lampa.Player.play({ url: movie.stream_4k });
          });
          scroll.append(item);
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
      
      Lampa.Menu.add({
        title: '4K Фильмы (NoAdsMovies)',
        icon: 'play',
        action: function() {
          Lampa.Activity.push({
            url: '',
            title: '4K Фильмы',
            component: 'custom_online'
          });
        }
      });
    }
    
    startPlugin();
  })();
  