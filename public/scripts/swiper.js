// Инициализируем Swiper
const swiper = new Swiper('.swiper-container', {
    // Показываем 3 слайда одновременно
    slidesPerView: 3,
    // Между слайдами 30 пикселей
    spaceBetween: 30,
    // После последнего слайда идет первый
    loop: false,
    loopAdditionalSlides: 1,

    navigation: {
        // Кнопка для переключения на следующий слайд
        nextEl: '.swiper-button-next',
        // Кнопка для переключения на предыдущий слайд
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        // Настройки для экрана шириной до 800px
        800: {
            slidesPerView: 3,
        },
        // Настройки для экрана шириной до 480px
        480: {
            slidesPerView: 1,
        },
    }
});
