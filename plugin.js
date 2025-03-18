(function(){
    // Функция инициализации плагина
    function init() {
      // Проверяем, загрузилась ли карточка фильма (предположим, что у карточки есть класс .movie-card)
      const movieCard = document.querySelector('.movie-card');
      if (movieCard) {
        // Ищем контейнер для кнопок в карточке (например, .movie-card-buttons)
        const btnContainer = movieCard.querySelector('.movie-card-buttons');
        
        // Если контейнер найден, создаём кнопку
        if (btnContainer) {
          const btn = document.createElement('button');
          btn.textContent = "Список контента";
          btn.style.padding = '10px';
          btn.style.margin = '5px';
          
          // Обработчик клика по кнопке
          btn.addEventListener('click', function(){
            // Фиксированный список контента с заглушками-ссылками
            const contentList = [
              { title: "Видео 1", url: "#" },
              { title: "Видео 2", url: "#" },
              { title: "Видео 3", url: "#" }
            ];
            
            // Создаём модальное окно для показа списка
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            
            // Создаём контейнер для списка
            const listContainer = document.createElement('div');
            listContainer.style.background = '#fff';
            listContainer.style.padding = '20px';
            listContainer.style.borderRadius = '5px';
            
            const list = document.createElement('ul');
            contentList.forEach(item => {
              const li = document.createElement('li');
              li.style.margin = '5px 0';
              // Заглушка-ссылка
              li.innerHTML = `<a href="${item.url}" style="text-decoration:none; color: #333;">${item.title}</a>`;
              list.appendChild(li);
            });
            listContainer.appendChild(list);
            
            // Добавляем кнопку закрытия модального окна
            const closeBtn = document.createElement('button');
            closeBtn.textContent = "Закрыть";
            closeBtn.style.marginTop = '10px';
            closeBtn.addEventListener('click', () => {
              document.body.removeChild(modal);
            });
            listContainer.appendChild(closeBtn);
            
            modal.appendChild(listContainer);
            document.body.appendChild(modal);
          });
          
          // Добавляем кнопку в контейнер карточки
          btnContainer.appendChild(btn);
        }
      } else {
        // Если карточка фильма ещё не загружена, пробуем снова через 1 секунду
        setTimeout(init, 1000);
      }
    }
    
    // Запуск плагина
    init();
  })();
  