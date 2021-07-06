'use strict';

// выбор города начало
const headerCityButton = document.querySelector('.header__city-button'); // кнопка: ваш город?

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?'; // присвоит либо данные пользователя или строку ваш город
console.log(headerCityButton.textContent);
headerCityButton.addEventListener('click', () => {//добавляем слушатель событий на клик
    const city = prompt('Укажите ваш город'); //выводим окно посетителю
    headerCityButton.textContent = city; //подставляем результат пользователя в кнопку
    localStorage.setItem('lomoda-location', city); //сохраняем в хранилище браузера (что бы при обновении страницы данные пользователя остались)
});
// выбор города конец

// блокировка скрола начало
const disableScroll = () => { // функция для отключения скрола
    const widthScroll = window.innerWidth - document.body.offsetWidth; //от ширины браузера отнял ширину body и получил ширину скрола
    document.body.dbScrollY = window.scrollY; // создал новое свойство в нутри тега body и записал туда сколько px от top отмотанно
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
};

const enableScroll = () => { // функция для включения скрола
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    });
};
// блокировка скрола конец

// модальное окно корзина начало
const subheaderCart = document.querySelector('.subheader__cart'); //корзина
const cartOverlay = document.querySelector('.cart-overlay');    // модальное окно

const cardModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open'); // добавление класса к корзине
    disableScroll(); // откл скрол
};

const cardModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open'); // удаление класса в корзине 
    enableScroll(); // вкл скрол
};

subheaderCart.addEventListener('click', cardModalOpen);// обработчик на корзину, вызывает функцию

cartOverlay.addEventListener('click', (event) => { //обработчик на модальное окно
    const target = event.target; // присвоить элемент на который кликаем

    if (target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay')){ // если данный класс есть у элемента
        cardModalClose(); // вызываем функцию
    }
});
// модальное окно корзина конец