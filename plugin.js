(function() {
    'use strict';

    var Defined = {
        api: 'lampac',
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
            'https://rhsprem.org/',
            'https://kodik.cc/',
            'https://remux.club/',
            'https://animelib.me/',
            'https://kinoukr.com/'
        ]
    };

    // Перехватываем родной метод получения трейлеров
    const originalGetTrailers = Lampa.Movie.prototype.getTrailers;
    Lampa.Movie.prototype.getTrailers = function() {
        const originalPromise = originalGetTrailers.apply(this, arguments);
        
        // Запрашиваем ваши источники
        const customPromise = new Promise((resolve) => {
            if (!this.id) return resolve([]);
            
            const source = Defined.sources[Math.floor(Math.random() * Defined.sources.length)];
            const url = `${source}api/v1/movie/${this.id}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const customStreams = data.streams
                        .filter(stream => stream.quality.includes('4K'))
                        .map(stream => ({
                            title: `4K ${stream.quality} (Showy)`,
                            url: stream.url,
                            type: 'custom'
                        }));
                    resolve(customStreams);
                })
                .catch(() => resolve([]));
        });

        // Объединяем результаты
        return Promise.all([originalPromise, customPromise])
            .then(([original, custom]) => [...original, ...custom]);
    };

    // Добавляем обработчик кликов для новых источников
    Lampa.Listener.follow('video', function(e) {
        if (e.type === 'select' && e.item.type === 'custom') {
            e.preventDefault();
            Lampa.Player.play({ url: e.item.url });
        }
    });

    // Модифицируем отображение элементов
    const originalRenderTrailers = Lampa.Movie.prototype.renderTrailers;
    Lampa.Movie.prototype.renderTrailers = function() {
        originalRenderTrailers.apply(this, arguments);
        
        // Добавляем стили для кастомных элементов
        $('.trailers__list').append(`
            <style>
                .trailer-item.custom { 
                    background-color: #4CAF50; 
                    color: white; 
                    margin: 5px; 
                    padding: 8px 12px; 
                    border-radius: 4px;
                }
            </style>
        `);
    };

})();