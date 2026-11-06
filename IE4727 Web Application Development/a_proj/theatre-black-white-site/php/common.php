<?php
require_once __DIR__ . '/database.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function e($value)
{
    if (!is_scalar($value) && $value !== null) {
        return '';
    }
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

function request_text($items, $name, $fallback = '')
{
    return isset($items[$name]) && is_string($items[$name]) ? trim($items[$name]) : $fallback;
}

function request_number($items, $name)
{
    if (!isset($items[$name]) || !is_scalar($items[$name])) {
        return 0;
    }
    $value = (string)$items[$name];
    return ctype_digit($value) ? (int)$value : 0;
}

function rows($result)
{
    return $result->fetch_all(MYSQLI_ASSOC);
}

function shows($db)
{
    $sql = "SELECT s.id, s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
                   a.image_path AS poster_image,
                   (SELECT MIN(p.performance_date) FROM performances p WHERE p.show_id = s.id) AS season_start,
                   (SELECT MAX(p.performance_date) FROM performances p WHERE p.show_id = s.id) AS season_end
            FROM shows s
            JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
            ORDER BY (FIELD(s.id, 'moulin-rouge', 'glass-room', 'after-the-rain', 'last-encore') = 0),
                     FIELD(s.id, 'moulin-rouge', 'glass-room', 'after-the-rain', 'last-encore'), s.title";
    return rows($db->query($sql));
}

function show_by_id($db, $id)
{
    if (!preg_match('/^[a-z0-9-]+$/', (string)$id)) {
        return null;
    }

    $id = $db->real_escape_string($id);
    $sql = "SELECT s.id, s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
                   a.image_path AS poster_image,
                   (SELECT MIN(p.performance_date) FROM performances p WHERE p.show_id = s.id) AS season_start,
                   (SELECT MAX(p.performance_date) FROM performances p WHERE p.show_id = s.id) AS season_end
            FROM shows s
            JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
            WHERE s.id = '$id'
            LIMIT 1";
    $result = $db->query($sql);
    return $result->fetch_assoc() ?: null;
}

function banners($db)
{
    $sql = "SELECT title, image_path FROM artwork WHERE image_type = 'banner' ORDER BY id";
    return rows($db->query($sql));
}

function performances($db, $month = '', $showId = '', $date = '', $fromToday = false)
{
    $conditions = array("a.image_type = 'poster'");

    if (is_string($month) && $month && preg_match('/^\d{4}-\d{2}$/', $month)) {
        $month = $db->real_escape_string($month);
        $conditions[] = "DATE_FORMAT(p.performance_date, '%Y-%m') = '$month'";
    }
    if (is_string($showId) && $showId && preg_match('/^[a-z0-9-]+$/', $showId)) {
        $showId = $db->real_escape_string($showId);
        $conditions[] = "p.show_id = '$showId'";
    }
    if (is_string($date) && $date && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        $date = $db->real_escape_string($date);
        $conditions[] = "p.performance_date = '$date'";
    }
    if ($fromToday) {
        $conditions[] = 'p.performance_date >= CURDATE()';
    }

    $where = implode(' AND ', $conditions);
    $sql = "SELECT p.id, p.show_id, DATE_FORMAT(p.performance_date, '%Y-%m-%d') AS show_date,
                   TIME_FORMAT(p.performance_time, '%H:%i') AS show_time,
                   p.seats_available, s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
                   a.image_path AS poster_image
            FROM performances p
            JOIN shows s ON s.id = p.show_id
            JOIN artwork a ON a.show_id = s.id
            WHERE $where
            ORDER BY p.performance_date, p.performance_time, s.title";
    return rows($db->query($sql));
}

function performance_by_id($db, $id)
{
    if (!is_scalar($id) || !ctype_digit((string)$id)) {
        return null;
    }
    $id = (int)$id;

    $sql = "SELECT p.id, p.show_id, DATE_FORMAT(p.performance_date, '%Y-%m-%d') AS show_date,
                   TIME_FORMAT(p.performance_time, '%H:%i') AS show_time,
                   p.seats_available, s.title, s.genre, s.tagline, s.description, s.runtime, s.venue,
                   a.image_path AS poster_image
            FROM performances p
            JOIN shows s ON s.id = p.show_id
            JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
            WHERE p.id = $id AND p.performance_date >= CURDATE()
            LIMIT 1";
    $result = $db->query($sql);
    return $result->fetch_assoc() ?: null;
}

function ticket_types($db)
{
    return rows($db->query('SELECT id, name, price FROM ticket_types ORDER BY price DESC'));
}

function cart_count()
{
    $count = 0;
    if (!empty($_SESSION['cart']) && is_array($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $quantity) {
            $count += (int)$quantity;
        }
    }
    return $count;
}

function cart_rows($db)
{
    $items = array();
    if (empty($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
        return $items;
    }

    foreach ($_SESSION['cart'] as $key => $quantity) {
        $parts = explode(':', (string)$key);
        if (count($parts) !== 2 || !ctype_digit($parts[0]) || !ctype_digit($parts[1])) {
            continue;
        }
        $performanceId = (int)$parts[0];
        $typeId = (int)$parts[1];
        $quantity = (int)$quantity;
        if ($quantity < 1 || $quantity > 10) {
            continue;
        }

        $sql = "SELECT p.id AS performance_id, p.show_id, p.performance_date,
                       TIME_FORMAT(p.performance_time, '%H:%i') AS show_time,
                       s.title, s.venue, t.id AS ticket_type_id, t.name AS ticket_name, t.price
                FROM performances p
                JOIN shows s ON s.id = p.show_id
                JOIN artwork a ON a.show_id = s.id AND a.image_type = 'poster'
                JOIN ticket_types t ON t.id = $typeId
                WHERE p.id = $performanceId AND p.performance_date >= CURDATE()
                LIMIT 1";
        $result = $db->query($sql);
        $item = $result->fetch_assoc();
        if ($item) {
            $item['quantity'] = $quantity;
            $item['subtotal'] = (float)$item['price'] * $quantity;
            $items[] = $item;
        }
    }
    return $items;
}

function money($amount)
{
    return 'S$' . number_format((float)$amount, 2);
}

function date_text($date, $withYear = true)
{
    if (!$date) {
        return 'Dates to be announced';
    }
    $format = $withYear ? 'j F Y' : 'j F';
    return date($format, strtotime($date));
}

function time_text($time)
{
    if (!$time) {
        return '';
    }
    return date('g:i A', strtotime($time));
}
