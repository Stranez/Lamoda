'use strict';

// выбор города начало
const headerCityButton = document.querySelector('.header__city-button'); // кнопка: ваш город?

let hash = location.hash.substring(1);

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?'; // присвоит либо данные пользователя или строку ваш город

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


// запрос базы данных

const getData = async () => { // async асинхронная функция
    const data = await fetch('db.json'); // await(не будет выполнять присваевание пока не вернёт ответ fetch) fetch(получение данных)

    if (data.ok){ //если успешно выполнился запрос
        return data.json();//вернём данные
    } else{
        throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`);// магия
        // throw (исключение) что это и зачем не понятно
    }
};

const getGoods = (callback, value) => {
    getData()
        .then(data => {//then функция, вызовет колбек функцию когда getData отработает
            if(value){
                callback(data.filter(item => item.category === value));
            } else{
                callback(data); // callback будет вызвана в тот момент когда мы получим товары сервера
            }
        })
        .catch(err => { // магия  catch(отлавливает ошибки)
            console.error(err);//  что это и зачем не понятно
        });

};


// херь не понятная начало

try{
    const goodsList = document.querySelector('.goods__list');

    if(!goodsList){
        throw 'это не страница с товарами';
    }
// переключение заголовка начало
    const toggleGoodsTitle = (category) => {
        const goodsTitle = document.querySelector('.goods__title');
        let title = '';
        switch(category) {
            case 'men': 
                title = 'Мужчинам';
                break;
            case 'women':
                title = 'Женщинам';
                break;
            case 'kids': 
                title = 'Детям';
                break;  
          }
        goodsTitle.textContent = title;

    };
//переключение заголовка конец

// генирация карточек товаров начало
    const createCard = ({ id, preview, cost, brand, name, sizes }) => {

        const li = document.createElement('li');

        li.classList.add('goods__item');
        li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#${id}">
                    <img class="good__img" src="goods-image/${preview}" alt="">
                </a>
                <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                    ${sizes ?
                        `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
                        ''
                    }
                    
                    <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                </div>
            </article>
        `;
        return li;
    };
// генирация карточек товаров конец

    const renderGoodsList = data => {
        goodsList.textContent = '';
        console.log(data);
        data.forEach(item => {
            const card = createCard(item);
            goodsList.append(card);
        });
    };

    window.addEventListener('hashchange', () =>{
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, hash);
        toggleGoodsTitle(hash); //моя
    });

    getGoods(renderGoodsList, hash);
    toggleGoodsTitle(hash); //моя

} catch (err){
    console.warn(err);
}

// херь не понятная конец