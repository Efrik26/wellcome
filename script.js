// Данные о продуктах
const products = [
    { id: 1, name: 'Коктейльный стол (110×80 см)', price: 600, image: 'images/cocktail-table.jpg' },
    { id: 2, name: 'Стрейч-чехол на кокт. стол (чёрный)', price: 500, image: 'images/stretch-cover-black.jpg' },
    { id: 3, name: 'Стрейч-чехол на кокт. стол (белый)', price: 500, image: 'images/stretch-cover-white.jpg' },
    { id: 4, name: 'Скатерть на кокт. стол (белая)', price: 800, icon: '⬜' },
    { id: 5, name: 'Скатерть на кокт. стол (чёрная)', price: 800, icon: '⬛' },
    { id: 6, name: 'Прямоугольный стол складной (180×75 см)', price: 1000, image: 'images/rectangular-table.jpg' },
    { id: 7, name: 'Стрейч-чехол на прям. стол (чёрный)', price: 800, image: 'images/stretch-rect-black.jpg' },
    { id: 8, name: 'Стрейч-чехол на прям. стол (белый)', price: 800, icon: '🤍' },
    { id: 9, name: 'Скатерть на прям. стол (белая)', price: 1000, icon: '⬜' },
    { id: 10, name: 'Скатерть на прям. стол (чёрная)', price: 1000, icon: '⬛' },
    { id: 11, name: 'Стул прозрачный кьявари', price: 350, image: 'images/chiavari-chair.jpg' },
    { id: 12, name: 'Стул деревянный складной', price: 250, icon: '🪑' },
];

// Корзина: { id: quantity }
let cart = {};

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(p => {
        const qty = cart[p.id] || 0;
        return `
            <div class="product-card">
                <div class="product-img">${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:48px;">${p.icon}</span>`}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-price">${p.price} <small>₽/сут</small></div>
                <div class="quantity-input">
                    <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                    <input type="number" class="qty-input" value="${qty}" min="0" readonly>
                    <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                </div>
            </div>
        `;
    }).join('');
    updateTotalPerDay();
}

function changeQty(id, delta) {
    if (!cart[id]) cart[id] = 0;
    cart[id] = Math.max(0, cart[id] + delta);
    renderProducts();
}

function updateTotalPerDay() {
    const total = products.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
    document.getElementById('totalPerDay').textContent = total.toLocaleString('ru-RU');
    return total;
}

function goToStep2() {
    const total = updateTotalPerDay();
    if (total === 0) {
        alert('Выберите хотя бы одну позицию.');
        return;
    }
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    renderSummary();

    // Установка дат по умолчанию
    const today = new Date().toISOString().split('T')[0];
    if (!document.getElementById('pickupDate').value) {
        document.getElementById('pickupDate').value = today;
    }
    if (!document.getElementById('returnDate').value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('returnDate').value = tomorrow.toISOString().split('T')[0];
    }

    recalculate();
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
}

function goToStep1() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
}

function renderSummary() {
    const list = document.getElementById('summaryList');
    const items = products.filter(p => (cart[p.id] || 0) > 0);
    list.innerHTML = items.map(p => `
        <div class="summary-item">
            <div class="summary-item-img">${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">` : p.icon}</div>
            <div class="summary-item-info">
                <div class="summary-item-name">${p.name}</div>
                <div class="summary-item-qty">Количество: ${cart[p.id]} × ${p.price} ₽/сут</div>
            </div>
            <div class="summary-item-price">${(cart[p.id] * p.price).toLocaleString('ru-RU')} ₽</div>
        </div>
    `).join('');
}

function recalculate() {
    const pickup = document.getElementById('pickupDate').value;
    const returnD = document.getElementById('returnDate').value;
    if (!pickup || !returnD) {
        document.getElementById('finalPrice').textContent = '0';
        return;
    }
    const start = new Date(pickup);
    const end = new Date(returnD);
    const diffMs = end - start;
    if (diffMs <= 0) {
        document.getElementById('finalPrice').textContent = '0';
        return;
    }
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const dailyTotal = products.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
    let totalPrice = 0;
    for (let d = 1; d <= days; d++) {
        if (d === 1) totalPrice += dailyTotal;
        else if (d === 2) totalPrice += dailyTotal * 0.8;
        else totalPrice += dailyTotal * 0.5;
    }
    document.getElementById('finalPrice').textContent = Math.round(totalPrice).toLocaleString('ru-RU');
}

function openModal() {
    const total = updateTotalPerDay();
    if (total === 0) return;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function submitBooking() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    if (!name || !phone) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const agreement = document.getElementById('calcAgreement');
    if (!agreement.checked) {
    alert('Пожалуйста, подтвердите согласие на обработку персональных данных.');
    return;
    }

    const items = products.filter(p => (cart[p.id] || 0) > 0)
        .map(p => `${p.name} × ${cart[p.id]}`).join(', ');
    const final = document.getElementById('finalPrice').textContent;
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;

    // Формируем данные для отправки
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('dates', `с ${pickupDate} по ${returnDate}`);
    formData.append('items', items);
    formData.append('total', final + ' руб.');

    // Отправляем на наш PHP-обработчик (укажите правильный путь к файлу!)
    fetch('/send_mail.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'success') {
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            closeModal();
            cart = {};
            renderProducts();
            goToStep1();
        } else {
            alert('Ошибка при отправке заявки. Пожалуйста, позвоните нам.');
            console.error('Server error:', data);
        }
    })
    .catch(error => {
        alert('Ошибка при отправке заявки. Пожалуйста, позвоните нам.');
        console.error('Network error:', error);
    });
}

function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const comment = form.querySelector('textarea').value.trim();

    if (!name || !phone) {
        alert('Пожалуйста, заполните обязательные поля.');
        return;
    }

    const agreement = document.getElementById('contactAgreement');
    if (!agreement.checked) {
    alert('Пожалуйста, подтвердите согласие на обработку персональных данных.');
    return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('comment', comment || 'Не указан');
    formData.append('form_type', 'contact');

    fetch('/send_mail.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'success') {
            alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
            form.reset();
        } else {
            alert('Ошибка при отправке. Пожалуйста, позвоните нам.');
            console.error('Server error:', data);
        }
    })
    .catch(error => {
        alert('Ошибка при отправке. Пожалуйста, позвоните нам.');
        console.error('Network error:', error);
    });
}

// FAQ
function toggleFaq(item) {
    item.classList.toggle('open');
}

// Мобильное меню
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}
function closeMenu() {
    document.getElementById('navMenu').classList.remove('active');
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Плавное появление фона при прокрутке в пределах hero
    if (scrollY < heroHeight) {
        const opacity = Math.min(scrollY / (heroHeight * 0.5), 0.95);
        header.style.backgroundColor = `rgba(26, 26, 26, ${opacity})`;
    } else {
        header.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
    }
});

// Инициализация
renderProducts();
