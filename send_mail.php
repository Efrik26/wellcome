<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit('Неверный метод запроса.');
}

// Защита от спам-ботов: проверяем, что запрос пришёл с вашего сайта
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
if (strpos($referer, $host) === false) {
    exit('Неверный источник запроса.');
}

// Защита от автоматических отправок: скрытое поле-ловушка
if (!empty($_POST['honeypot'])) {
    exit('Спам-запрос.');
}

// Ограничение длины полей
$name = isset($_POST['name']) ? mb_substr(htmlspecialchars(trim($_POST['name'])), 0, 100) : '';
$phone = isset($_POST['phone']) ? mb_substr(htmlspecialchars(trim($_POST['phone'])), 0, 20) : '';

if (empty($name) || empty($phone)) {
    exit('Заполните обязательные поля.');
}

// ... дальше ваш текущий код

$name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '';
$formType = isset($_POST['form_type']) ? $_POST['form_type'] : 'calculator';

$to = 'efremov_stav@mail.ru';
$from = 'info@w-26.ru';

if ($formType === 'contact') {
    $comment = isset($_POST['comment']) ? htmlspecialchars($_POST['comment']) : '';
    $subject = 'Новая заявка с сайта Wellcome от ' . $name;
    $message = "Новая заявка с Wellcome (связь через сайт)!\n\n";
    $message .= "Имя: " . $name . "\n";
    $message .= "Телефон: " . $phone . "\n";
    $message .= "Комментарий: " . $comment . "\n";
} else {
    $items = isset($_POST['items']) ? htmlspecialchars($_POST['items']) : '';
    $total = isset($_POST['total']) ? htmlspecialchars($_POST['total']) : '';
    $dates = isset($_POST['dates']) ? htmlspecialchars($_POST['dates']) : '';
    $subject = 'Новая заявка Wellcome (калькулятор) от ' . $name;
    $message = "Новая заявка с Wellcome (калькулятор)!\n\n";
    $message .= "Имя: " . $name . "\n";
    $message .= "Телефон: " . $phone . "\n\n";
    $message .= "Даты аренды: " . $dates . "\n\n";
    $message .= "Товары:\n" . $items . "\n\n";
    $message .= "Итого: " . $total . "\n";
}

$headers = 'From: ' . $from . "\r\n";
$headers .= 'Reply-To: ' . $from . "\r\n";
$headers .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

if (mail($to, $subject, $message, $headers, '-f' . $from)) {
    echo 'success';
} else {
    echo 'error';
}
?>
