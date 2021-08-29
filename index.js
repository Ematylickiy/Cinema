let price_row_1 = 6;
let price_row_2 = 7;
let price_row_3 = 8;
let price_row_4 = 9;

let sessionTime = '17:00';

let selectedPlaces = [];
let total_price = 0;

///////// MAIN WINDOW /////////

let btn_addOrder = document.querySelector('#bnt-addOrder');

let row_4 = document.querySelector('.row_4');
let row_3 = document.querySelector('.row_3');
let row_2 = document.querySelector('.row_2');
let row_1 = document.querySelector('.row_1');

let UI_price = document.querySelector('#price');
let UI_countSeats = document.querySelector('.countSeats');
let date_session = document.querySelector('.session-date');

function innerDateSession() {
    let daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    let months = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    let getCurrentDate = new Date();
    let currentDayOfWeek = daysOfWeek[getCurrentDate.getDay()];
    let currentDayOfMonth = getCurrentDate.getDate();
    let currentMonth = months[getCurrentDate.getMonth()]
    let createCurrentDate = `Дата показа: ${currentDayOfWeek}, ${currentDayOfMonth} ${currentMonth}, ${sessionTime}`
    date_session.innerHTML = `<h5>${createCurrentDate}</h5>`
}

window.onload = innerDateSession;

row_4.addEventListener('click', event => addSeats(price_row_4, event));
row_3.addEventListener('click', event => addSeats(price_row_3, event));
row_2.addEventListener('click', event => addSeats(price_row_2, event));
row_1.addEventListener('click', event => addSeats(price_row_1, event));

function createObjSeat(place, price) {
    let ticket = {};
    ticket.id = place.id;
    ticket.price = price;
    ticket.row = place.dataset.row;
    ticket.seat = place.dataset.seat;
    let createObjTicket = Object.assign({}, ticket);
    return createObjTicket
}

function addSeats(price, event) {
    let currentPlace = event.target;
    if (currentPlace.classList.contains('buy')) {
        return
    }
    let createObjTicket = createObjSeat(currentPlace, price);
    let removeTicket = selectedPlaces.findIndex(item => item.seat === currentPlace.dataset.seat && item.row === currentPlace.dataset.row);
    let catchEvent = currentPlace.dataset.wrap !== 'not-event';

    catchEvent ? currentPlace.classList.toggle('selectedPlace') : '';

    if (removeTicket > -1) {
        selectedPlaces.splice(removeTicket, 1);
        total_price -= price;
    } else if (catchEvent) {
        selectedPlaces = [...selectedPlaces, createObjTicket];
        total_price += price;
    }

    selectedPlaces.length ? btn_addOrder.removeAttribute("disabled") : btn_addOrder.setAttribute("disabled", "disabled");
    updateUI()
}

function updateUI () {
    UI_price.innerHTML = `${total_price}руб. 00коп.`
    UI_countSeats.innerHTML = selectedPlaces.length
}

/////////////// MODAL WINDOW ///////////

let modal_overlay = document.querySelector('.modal-overlay');
let modal_window = document.querySelector('.modal-window');
let wrap_tickets = document.querySelector('.wrap-tickets');
let count_tickets = document.querySelector('.count-tickets');

btn_addOrder.addEventListener('click', () => {
    setVisibilityToModal(modal_overlay, 'visible')
    count_tickets.innerHTML = `<h3 class="text-center">Количество билетов: ${selectedPlaces.length} шт.</h3>
                               <h3 class="text-center">Итого к оплате: <span>${total_price}руб. 00коп.</span></h3>`
    wrap_tickets.innerHTML = selectedPlaces.map((item, index) => getTicketHTML(item, index + 1)).join("");
})


function getTicketHTML(ticketInfo, ticketNumber) {
    return (
        `<div class = 'ticket'>
            <h3 class="text-center">Билет ${ticketNumber}:</h3>
            <p>ряд: <span>${ticketInfo.row}</span></p>
            <p>место: <span>${ticketInfo.seat}</span></p>
            <p>время: ${sessionTime}</p>
            <p>цена: <span>${ticketInfo.price} руб.</span></p>
        </div>`
    )
}

let btn_buy = document.querySelector('#btn-buy');
let btn_close = document.querySelector('#btn-close');
let btn_cancel = document.querySelector('#btn-cancel');
let modal_succeed = document.querySelector('.modal-succeed');

let spinner = document.querySelector('.spinner');

btn_buy.addEventListener('click', () => {
    setVisibilityToModal(spinner, 'visible');
    setTimeout(() => showSucceed(), 1500);
})

function showSucceed() {
    selectedPlaces.map(item => document.querySelector(`#${item.id}`).classList.add('buy'));
    
    resetPriceAndSelectedPlaces();

    setVisibilityToModal(modal_overlay);
    setVisibilityToModal(modal_succeed, 'visible');
    setVisibilityToModal(spinner);

    btn_addOrder.setAttribute("disabled", "disabled");
}

function resetPriceAndSelectedPlaces() {
    selectedPlaces = [];
    total_price = 0;
    updateUI();
}

btn_cancel.addEventListener('click', ()=> setVisibilityToModal(modal_overlay));
btn_close.addEventListener('click', () => setVisibilityToModal(modal_succeed));

function setVisibilityToModal(modal, status = 'hidden') {
    modal.style.visibility = status
}











