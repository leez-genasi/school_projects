<?php
// Match this address with the account configured on the mail server.
define('THEATRE_MAIL_FROM', 'goldfishkaran@gmail.com');

function send_ticket_email($recipient, $name, $phone, $orderId, $lines, $total)
{
    if (!filter_var(THEATRE_MAIL_FROM, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $name = str_replace(array("\r", "\n"), ' ', $name);
    $subject = 'Theatre ticket reservation #' . (int)$orderId;
    $body = "Hello $name,\r\n\r\n";
    $body .= "Your ticket reservation has been saved.\r\n";
    $body .= 'Order number: #' . (int)$orderId . "\r\n";
    $body .= "Name: $name\r\n";
    $body .= "Email: $recipient\r\n";
    $body .= "Phone: $phone\r\n\r\n";
    $body .= "TICKETS\r\n";

    foreach ($lines as $line) {
        $quantity = (int)$line['quantity'];
        $lineTotal = (float)$line['price'] * $quantity;
        $body .= "\r\n" . $line['title'] . "\r\n";
        $body .= 'Performance: ' . date_text($line['performance_date']) . ' at ' . time_text($line['show_time']) . "\r\n";
        $body .= 'Venue: ' . $line['venue'] . "\r\n";
        $body .= 'Ticket: ' . $line['ticket_name'] . "\r\n";
        $body .= 'Quantity: ' . $quantity . "\r\n";
        $body .= 'Price each: ' . money($line['price']) . "\r\n";
        $body .= 'Line total: ' . money($lineTotal) . "\r\n";
    }

    $body .= "\r\nReservation total: " . money($total) . "\r\n\r\n";
    $body .= "This theatre project saves reservations but does not collect payment.\r\n";
    $body .= "We look forward to welcoming you.\r\n";

    $headers = 'From: Theatre Tickets <' . THEATRE_MAIL_FROM . ">\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (!@mail($recipient, $subject, $body, $headers)) {
        error_log('Theatre ticket confirmation email failed for order #' . (int)$orderId);
        return false;
    }

    return true;
}

function send_contact_email($recipient, $name, $subject)
{
    if (!filter_var(THEATRE_MAIL_FROM, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $name = str_replace(array("\r", "\n"), ' ', $name);
    $subject = str_replace(array("\r", "\n"), ' ', $subject);
    $mailSubject = 'We received your message - Theatre';
    $body = "Hello $name,\r\n\r\n";
    $body .= "We received your message and saved it. Our team will review it and get back to you if a reply is needed.\r\n\r\n";
    $body .= "Your subject: $subject\r\n\r\n";
    $body .= "Thank you for contacting the Theatre.\r\n";

    $headers = 'From: Theatre <' . THEATRE_MAIL_FROM . ">\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (!@mail($recipient, $mailSubject, $body, $headers)) {
        error_log('Theatre contact confirmation email failed.');
        return false;
    }

    return true;
}
