<?php
// Проверяем, что запрос пришел методом POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit('Неверный метод запроса.');
}

// Получаем данные из формы
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '';
$items = isset($_POST['items']) ? htmlspecialchars($_POST['items']) : '';
$total = isset($_POST['total']) ? htmlspecialchars($_POST['total']) : '';
$dates = isset($_POST['dates']) ? htmlspecialchars($_POST['dates']) : '';

// --- НАСТРОЙКИ (ЗАМЕНИТЕ НА СВОИ) ---
$to = 'efremov_stav@mail.ru'; // Ваша почта
$subject = 'Новая заявка Wellcome от ' . $name;
$from = 'info@w-26.ru'; // Ящик, созданный в Timeweb

// Формируем тело письма
$message = "Новая заявка с Wellcome!\n\n";
$message .= "Имя: " . $name . "\n";
$message .= "Телефон: " . $phone . "\n\n";
$message .= "Даты аренды: " . $dates . "\n\n";
$message .= "Товары:\n" . $items . "\n\n";
$message .= "Итого: " . $total . "\n";

// Заголовки письма
$headers = 'From: ' . $from . "\r\n";
$headers .= 'Reply-To: ' . $from . "\r\n";
$headers .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

// Отправляем письмо
if (mail($to, $subject, $message, $headers, '-f' . $from)) {
    echo 'success';
} else {
    echo 'error';
}
?>