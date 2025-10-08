// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Табы для игровых секций
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке и контенту
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Обработка опроса
    const pollOptions = document.querySelectorAll('.poll-option input[type="radio"]');
    const showResultsBtn = document.querySelector('.poll-stats .btn');
    
    if (pollOptions.length > 0 && showResultsBtn) {
        showResultsBtn.addEventListener('click', function() {
            const selectedOption = document.querySelector('input[name="poll"]:checked');
            if (selectedOption) {
                alert('Спасибо за участие в опросе!');
                // Здесь можно добавить логику отправки данных на сервер
            } else {
                alert('Пожалуйста, выберите один из вариантов');
            }
        });
    }

    // Обработка формы отзыва
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        const textarea = reviewForm.querySelector('textarea');
        const submitBtn = reviewForm.querySelector('.btn');
        
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const comment = textarea.value.trim();
            
            if (comment.length < 10) {
                alert('Комментарий должен содержать минимум 10 символов');
                return;
            }
            
            if (comment.length > 500) {
                alert('Комментарий слишком длинный (максимум 500 символов)');
                return;
            }
            
            // Создаем новый отзыв
            const newReview = createReviewItem('Новый пользователь', comment);
            const reviewsList = document.querySelector('.reviews-list');
            reviewsList.insertBefore(newReview, reviewsList.firstChild);
            
            // Очищаем форму
            textarea.value = '';
            
            // Показываем уведомление
            showNotification('Отзыв добавлен!');
        });
    }

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.promo-card, .game-card, .review-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Обработка изменения языка
    const languageSelector = document.querySelector('.language-selector select');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLang = this.value;
            console.log('Выбран язык:', selectedLang);
            // Здесь можно добавить логику смены языка
            showNotification('Язык изменен на ' + selectedLang.toUpperCase());
        });
    }

    // Обработка кнопок скачивания
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Скачать')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Начинается загрузка приложения...');
                // Здесь можно добавить логику загрузки
            });
        }
    });

    // Обработка кнопок регистрации/игры
    document.querySelectorAll('.btn-promo, .btn-bonus, .btn-deposit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const btnText = this.textContent;
            showNotification('Переход к ' + btnText.toLowerCase() + '...');
            // Здесь можно добавить логику перехода на страницу регистрации/игры
        });
    });
});

// Функция создания нового элемента отзыва
function createReviewItem(author, comment) {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    
    const now = new Date();
    const dateString = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
    
    reviewItem.innerHTML = `
        <div class="review-header">
            <strong>${author}</strong>
            <span class="review-date">${dateString}</span>
        </div>
        <p>${comment}</p>
    `;
    
    return reviewItem;
}

// Функция показа уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b35, #ff8c42);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// FAQ аккордеон
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Закрываем все другие FAQ в той же категории
            const category = faqItem.closest('.faq-category');
            const allItems = category.querySelectorAll('.faq-item');
            allItems.forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Переключаем текущий FAQ
            faqItem.classList.toggle('active');
        });
    });
});

// Функция для обработки демо-игр
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-demo')) {
        e.preventDefault();
        showNotification('Запуск демо-версии игры...');
        // Здесь можно добавить логику запуска демо-игры
    }
});

// Обработка кликов по игровым карточкам
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) {
            const gameTitle = this.querySelector('h4').textContent;
            showNotification('Загрузка игры: ' + gameTitle);
            // Здесь можно добавить логику перехода к игре
        }
    });
});

// Добавляем эффект параллакса для промо-секции
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const promoSection = document.querySelector('.promo-section');
    if (promoSection) {
        const rate = scrolled * -0.5;
        promoSection.style.transform = `translateY(${rate}px)`;
    }
});

// Инициализация всех функций
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем эффект печатающегося текста для заголовка
    const mainTitle = document.querySelector('.description-section h1');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                mainTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
});

// Cookie Notification
document.addEventListener('DOMContentLoaded', function() {
    const cookieNotification = document.getElementById('cookie-notification');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    // Проверяем, есть ли уже сохраненное согласие
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        // Показываем уведомление через 2 секунды после загрузки
        setTimeout(() => {
            cookieNotification.classList.add('show');
        }, 2000);
    }
    
    // Обработчик принятия куки
    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieNotification();
    });
    
    // Обработчик отклонения куки
    declineBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        hideCookieNotification();
    });
    
    function hideCookieNotification() {
        cookieNotification.classList.remove('show');
        cookieNotification.classList.add('hide');
        
        // Удаляем элемент из DOM через 0.4 секунды
        setTimeout(() => {
            if (cookieNotification.parentNode) {
                cookieNotification.parentNode.removeChild(cookieNotification);
            }
        }, 400);
    }
});
