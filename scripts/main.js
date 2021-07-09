'use strict';

// выбор города начало
const headerCityButton = document.querySelector('.header__city-button'); // кнопка: ваш город?
const cartListGoods = document.querySelector('.cart__list-goods');
const cartTotalCost = document.querySelector('.cart__total-cost');

let hash = location.hash.substring(1);

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?'; // присвоит либо данные пользователя или строку ваш город

headerCityButton.addEventListener('click', () => {//добавляем слушатель событий на клик
    const city = prompt('Укажите ваш город'); //выводим окно посетителю
    headerCityButton.textContent = city; //подставляем результат пользователя в кнопку
    localStorage.setItem('lomoda-location', city); //сохраняем в хранилище браузера (что бы при обновении страницы данные пользователя остались)
});
// выбор города конец

//корзина начало

const getLocalStorage = () => JSON?.parse(localStorage.getItem('card-lomoda')) || [];
const setLocalStorage = data => localStorage.setItem('card-lomoda', JSON.stringify(data));

const renderCart = () => {
    cartListGoods.textContent = '';

    const cartItem = getLocalStorage();

    let totalPrice = 0;

    cartItem.forEach((item, i) => {

        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${item.brand} ${item.name}</td>
            ${item.color ? `<td>${item.color}</td>` : `<td>-</td>`}
            ${item.size ? `<td>${item.size}</td>` : `<td>-</td>`}
            <td>${item.cost} &#8381;</td>
            <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
        `;

        totalPrice += item.cost;
        cartListGoods.append(tr);
    });

    cartTotalCost.textContent = totalPrice + ' ₽';
};

const deleteItemCart = id => {
    const cartItems = getLocalStorage();
    const newCartItems = cartItems.filter(item => item.id !== id);
    setLocalStorage(newCartItems);
}

cartListGoods.addEventListener('click', e => {
    if(e.target.matches('.btn-delete')){
        deleteItemCart(e.target.dataset.id);
        renderCart();
    }
});

//корзина конец

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
    renderCart();
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

const getGoods = (callback, prop, value) => {
    getData()
        .then(data => {//then функция, вызовет колбек функцию когда getData отработает
            if(value){
                callback(data.filter(item => item[prop] === value));
            } else{
                callback(data); // callback будет вызвана в тот момент когда мы получим товары сервера
            }
        })
        .catch(err => { // магия  catch(отлавливает ошибки)
            console.error(err);//  что это и зачем не понятно
        });

};


// херь не понятная начало
// страница категорий
try{
    const goodsList = document.querySelector('.goods__list');

    if(!goodsList){ // сработает если на странице нет списка goodsList
        throw 'это не страница с товарами';
    }
// переключение заголовка начало
    const goodsTitle = document.querySelector('.goods__title');

    const changeTitle = () => {
        goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
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
        getGoods(renderGoodsList, 'category', hash);
        changeTitle(); //моя
    });

    getGoods(renderGoodsList, 'category', hash);
    changeTitle(); //моя

} catch (err){
    console.warn(err);
}
// херь не понятная конец

//страница товара

try{
    if(document.querySelector('.card__good')){
        throw 'это не card__good';
    }
    const cardGoodImage = document.querySelector('.card-good__image');
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodPrice = document.querySelector('.card-good__price');
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
    const cardGoodColorList = document.querySelector('.card-good__color-list');
    const cardGoodSizes = document.querySelector('.card-good__sizes');
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
    const cardGoodBuy = document.querySelector('.card-good__buy');

    const generateList = data => data.reduce((html, item, i) => html + 
    `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');

    const renderCardGood = ([{ id, brand, name, cost, color, sizes, photo }]) => {

        const data = { brand, name, cost ,id };

        cardGoodImage.src = `goods-image/${photo}`;
        console.dir(cardGoodImage.src);
        cardGoodImage.alt = `${brand} ${name}`;
        cardGoodBrand.textContent = brand;
        cardGoodTitle.textContent = name;
        cardGoodPrice.textContent = `${cost} ₽`;
        if(color){
            cardGoodColor.textContent = color[0];
            cardGoodColor.dataset.id = 0;
            cardGoodColorList.innerHTML = generateList(color);
        }else{
            cardGoodColor.style.display = 'none';
        }

        if(sizes){
            cardGoodSizes.textContent = sizes[0];
            cardGoodSizes.dataset.id = 0;
            cardGoodSizesList.innerHTML = generateList(sizes);
        }else{
            cardGoodSizes.style.display = 'none';
        }

        if(getLocalStorage().some(item => item.id ===  id)){
            cardGoodBuy.classList.add('delete');
            cardGoodBuy.textContent = 'Удалить из корзины';
        }

        cardGoodBuy.addEventListener('click', () => {
            if(cardGoodBuy.classList.contains('delete')){
                deleteItemCart(id);
                cardGoodBuy.classList.remove('delete');
                cardGoodBuy.textContent = 'Добавить в корзину';
                return;
            }
            if(color) data.color = cardGoodColor.textContent;
            if(sizes) data.size = cardGoodSizes.textContent;

            cardGoodBuy.classList.add('delete');
            cardGoodBuy.textContent = 'Удалить из корзины';

            const cardData = getLocalStorage();
            cardData.push(data);
            setLocalStorage(cardData);
        });
    };

    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', (e) => {
            const target = e.target;

            if(target.closest('.card-good__select')){
                target.classList.toggle('card-good__select__open');
            }
            if(target.closest('.card-good__select-item')){
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        });
    });

    getGoods(renderCardGood, 'id', hash);

} catch(err){
    console.warn(err);
}