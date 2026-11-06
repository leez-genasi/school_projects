<?php
require_once __DIR__ . '/common.php';
require_once __DIR__ . '/email.php';
$pageTitle = 'Choose Tickets | Theatre';
$activePage = 'cart';
$message = '';
$messageType = '';
$checkoutErrors = array();
$checkoutValues = array('customer_name' => '', 'customer_email' => '', 'phone' => '');
$checkoutNotice = '';
$showList = shows($db);
$defaultShow = count($showList) ? $showList[0]['id'] : '';
$requestedPerformance = request_number($_GET, 'performance');
$requestedRow = $requestedPerformance ? performance_by_id($db, $requestedPerformance) : null;
$showFallback = $requestedRow ? $requestedRow['show_id'] : $defaultShow;
$showFilter = request_text($_GET, 'show', $showFallback);
if (!show_by_id($db, $showFilter)) {
    $showFilter = $defaultShow;
}
$monthFallback = $requestedRow ? substr($requestedRow['show_date'], 0, 7) : date('Y-m');
$month = request_text($_GET, 'month', $monthFallback);
$monthDate = DateTime::createFromFormat('Y-m-d', $month . '-01');
if (!$monthDate || $monthDate->format('Y-m') !== $month) {
    $monthDate = new DateTime(date('Y-m-01'));
    $month = $monthDate->format('Y-m');
}
$upcomingShows = performances($db, '', $showFilter, '', true);
if (!isset($_GET['month']) && !$requestedRow && count($upcomingShows)) {
    $month = substr($upcomingShows[0]['show_date'], 0, 7);
    $monthDate = DateTime::createFromFormat('Y-m-d', $month . '-01');
}
$dateFallback = $requestedRow ? $requestedRow['show_date'] : '';
$selectedDate = request_text($_GET, 'date', $dateFallback);
$dateObject = DateTime::createFromFormat('Y-m-d', $selectedDate);
if (!$dateObject || $dateObject->format('Y-m-d') !== $selectedDate || substr($selectedDate, 0, 7) !== $month) {
    $selectedDate = '';
}
if (!$selectedDate) {
    foreach ($upcomingShows as $row) {
        if (substr($row['show_date'], 0, 7) === $month) {
            $selectedDate = $row['show_date'];
            break;
        }
    }
}
if (!$selectedDate) {
    $selectedDate = $monthDate->format('Y-m-01');
}
$monthRows = performances($db, $month, $showFilter, '', true);
$dayRows = array();
foreach ($monthRows as $row) {
    if ($row['show_date'] === $selectedDate) {
        $dayRows[] = $row;
    }
}
$selectedPerformance = null;
foreach ($dayRows as $row) {
    if ((int)$row['id'] === $requestedPerformance) {
        $selectedPerformance = $row;
        break;
    }
}
if (!$selectedPerformance && count($dayRows)) {
    $selectedPerformance = $dayRows[0];
}

function cart_page_redirect($month, $date, $show, $performance, $success = false)
{
    $query = array('month' => $month, 'date' => $date, 'show' => $show);
    if ($performance) {
        $query['performance'] = $performance;
    }
    if ($success) {
        $query['success'] = 1;
    }
    header('Location: cart.php?' . http_build_query($query));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = request_text($_POST, 'action');
    $returnShow = request_text($_POST, 'show_id', $showFilter);
    $returnMonth = request_text($_POST, 'month', $month);
    $returnDate = request_text($_POST, 'date', $selectedDate);
    $returnPerformance = request_number($_POST, 'performance_id');

    if ($action === 'add') {
        $performanceId = $returnPerformance;
        $typeId = request_number($_POST, 'ticket_type_id');
        $quantity = request_number($_POST, 'quantity');
        $itemPerformance = performance_by_id($db, $performanceId);
        $typeResult = $db->query("SELECT id FROM ticket_types WHERE id = $typeId LIMIT 1");
        if (!$itemPerformance || !$typeResult->fetch_assoc() || $quantity < 1 || $quantity > 10) {
            $message = 'Choose an upcoming performance, a ticket type and a quantity from 1 to 10.';
            $messageType = 'error';
            $_SESSION['cart_message'] = $message;
            $_SESSION['cart_message_type'] = 'error';
            cart_page_redirect($returnMonth, $returnDate, $returnShow, $performanceId);
        } else {
            if (empty($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
                $_SESSION['cart'] = array();
            }
            $key = $performanceId . ':' . $typeId;
            $existing = isset($_SESSION['cart'][$key]) ? (int)$_SESSION['cart'][$key] : 0;
            if ($existing + $quantity > 10) {
                $message = 'A maximum of 10 tickets of this type can be selected for one performance.';
                $messageType = 'error';
                $_SESSION['cart_message'] = $message;
                $_SESSION['cart_message_type'] = 'error';
                cart_page_redirect($returnMonth, $returnDate, $returnShow, $performanceId);
            } else {
                $_SESSION['cart'][$key] = $existing + $quantity;
                $_SESSION['cart_message'] = 'Tickets added to your cart.';
                cart_page_redirect($returnMonth, $returnDate, $returnShow, $performanceId);
            }
        }
    } elseif ($action === 'remove') {
        $key = request_text($_POST, 'cart_key');
        if ($key && preg_match('/^\d+:\d+$/', $key) && isset($_SESSION['cart'][$key])) {
            unset($_SESSION['cart'][$key]);
            $_SESSION['cart_message'] = 'Ticket selection removed.';
            cart_page_redirect($returnMonth, $returnDate, $returnShow, $returnPerformance);
        }
    } elseif ($action === 'clear') {
        unset($_SESSION['cart']);
        $_SESSION['cart_message'] = 'Your cart is empty.';
        cart_page_redirect($returnMonth, $returnDate, $returnShow, $returnPerformance);
    } elseif ($action === 'checkout') {
        $name = request_text($_POST, 'customer_name');
        $email = request_text($_POST, 'customer_email');
        $phone = request_text($_POST, 'phone');
        $checkoutErrors = array();
        if (strlen($name) < 2 || strlen($name) > 150 || preg_match('/[\r\n]/', $name)) {
            $checkoutErrors['customer_name'] = 'Enter a name.';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
            $checkoutErrors['customer_email'] = 'Enter a valid email address.';
        }
        if (!preg_match('/^[0-9+ ()-]{7,25}$/', $phone)) {
            $checkoutErrors['phone'] = 'Enter a phone number.';
        }
        if ($checkoutErrors) {
            $_SESSION['checkout_errors'] = $checkoutErrors;
            $_SESSION['checkout_values'] = array(
                'customer_name' => $name,
                'customer_email' => $email,
                'phone' => $phone
            );
            cart_page_redirect($returnMonth, $returnDate, $returnShow, $returnPerformance);
        } else {
            unset($_SESSION['checkout_errors'], $_SESSION['checkout_values']);
            $cartLines = cart_rows($db);
            if (!count($cartLines)) {
                $_SESSION['checkout_notice'] = 'Add tickets before checking out.';
                cart_page_redirect($returnMonth, $returnDate, $returnShow, $returnPerformance);
            } else {
                try {
                    $db->begin_transaction();
                    $lockedLines = array();
                    $total = 0;
                    foreach ($cartLines as $line) {
                        $performanceId = (int)$line['performance_id'];
                        $typeId = (int)$line['ticket_type_id'];
                        $quantity = (int)$line['quantity'];
                        $check = $db->prepare("SELECT p.seats_available, t.price
                                               FROM performances p
                                               JOIN ticket_types t ON t.id = ?
                                               WHERE p.id = ? AND p.performance_date >= CURDATE()
                                               FOR UPDATE");
                        $check->bind_param('ii', $typeId, $performanceId);
                        $check->execute();
                        $availability = $check->get_result()->fetch_assoc();
                        $check->close();
                        if (!$availability || (int)$availability['seats_available'] < $quantity) {
                            throw new Exception('There are not enough seats left for one of the selected performances.');
                        }
                        $line['price'] = (float)$availability['price'];
                        $line['quantity'] = $quantity;
                        $line['performance_id'] = $performanceId;
                        $line['ticket_type_id'] = $typeId;
                        $lockedLines[] = $line;
                        $total += $line['price'] * $quantity;
                    }

                    $order = $db->prepare('INSERT INTO orders (customer_name, customer_email, phone, total) VALUES (?, ?, ?, ?)');
                    $order->bind_param('sssd', $name, $email, $phone, $total);
                    $order->execute();
                    $orderId = $db->insert_id;
                    $order->close();

                    foreach ($lockedLines as $line) {
                        $item = $db->prepare('INSERT INTO order_items (order_id, performance_id, ticket_type_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)');
                        $item->bind_param('iiiid', $orderId, $line['performance_id'], $line['ticket_type_id'], $line['quantity'], $line['price']);
                        $item->execute();
                        $item->close();

                        $update = $db->prepare('UPDATE performances SET seats_available = seats_available - ? WHERE id = ? AND seats_available >= ?');
                        $update->bind_param('iii', $line['quantity'], $line['performance_id'], $line['quantity']);
                        $update->execute();
                        if ($update->affected_rows !== 1) {
                            $update->close();
                            throw new Exception('A performance sold out while your order was being placed. Please review your cart.');
                        }
                        $update->close();
                    }
                    $db->commit();
                    $emailSent = false;
                    try {
                        $emailSent = send_ticket_email($email, $name, $phone, $orderId, $lockedLines, $total);
                    } catch (Throwable $mailError) {
                        error_log('Theatre ticket confirmation email failed for order #' . (int)$orderId);
                    }
                    unset($_SESSION['cart']);
                    $_SESSION['order_success'] = $orderId;
                    $_SESSION['order_email_sent'] = $emailSent;
                    $_SESSION['order_email_to'] = $email;
                    cart_page_redirect($returnMonth, $returnDate, $returnShow, $returnPerformance, true);
                } catch (Throwable $error) {
                    $db->rollback();
                    $checkoutNotice = $error instanceof mysqli_sql_exception
                        ? 'The order could not be saved. Check that the database tables have been created.'
                        : $error->getMessage();
                    $_SESSION['checkout_notice'] = $checkoutNotice;
                    cart_page_redirect($returnMonth, $returnDate, $returnShow, $returnPerformance);
                }
            }
        }
    }
}

if (!$message && !empty($_SESSION['cart_message'])) {
    $message = $_SESSION['cart_message'];
    $messageType = isset($_SESSION['cart_message_type']) ? $_SESSION['cart_message_type'] : 'success';
    unset($_SESSION['cart_message']);
    unset($_SESSION['cart_message_type']);
}
if (!empty($_SESSION['checkout_errors'])) {
    $checkoutErrors = $_SESSION['checkout_errors'];
    unset($_SESSION['checkout_errors']);
}
if (!empty($_SESSION['checkout_values'])) {
    $checkoutValues = array_merge($checkoutValues, $_SESSION['checkout_values']);
    unset($_SESSION['checkout_values']);
}
if (!empty($_SESSION['checkout_notice'])) {
    $checkoutNotice = $_SESSION['checkout_notice'];
    unset($_SESSION['checkout_notice']);
}

$previousMonth = clone $monthDate;
$previousMonth->modify('-1 month');
$nextMonth = clone $monthDate;
$nextMonth->modify('+1 month');
$monthDays = (int)$monthDate->format('t');
$offset = (int)$monthDate->format('N') - 1;
$ticketOptions = ticket_types($db);
$cartItems = cart_rows($db);
$cartTotal = 0;
foreach ($cartItems as $item) {
    $cartTotal += $item['subtotal'];
}
$successText = '';
$emailWarning = '';
$successOrder = isset($_GET['success']) && isset($_SESSION['order_success']) ? (int)$_SESSION['order_success'] : 0;
if ($successOrder) {
    $orderResult = $db->query("SELECT total FROM orders WHERE id = $successOrder LIMIT 1");
    $orderRow = $orderResult->fetch_assoc();
    if ($orderRow) {
        $successText = 'Your ticket reservation was saved. Order #' . $successOrder . ' · ' . money($orderRow['total']) . '.';
        if (!empty($_SESSION['order_email_sent'])) {
            $successText .= ' XAMPP accepted the confirmation email for ' . request_text($_SESSION, 'order_email_to') . '.';
        } else {
            $emailWarning = 'The reservation is saved in MySQL, but the confirmation email could not be sent. Check the mail setup in README.txt.';
        }
    }
    unset($_SESSION['order_success']);
    unset($_SESSION['order_email_sent']);
    unset($_SESSION['order_email_to']);
}
$posterBackground = $selectedPerformance ? $selectedPerformance['poster_image'] : '';
$bodyClass = $selectedPerformance ? 'show-selected' : '';
include __DIR__ . '/header.php';
?>
<main class="checkout">
  <header class="page-head">
    <p class="eyebrow">Your tickets</p>
    <h1>Choose a performance</h1>
  </header>
  <?php if ($successText): ?><p class="notice success"><?= e($successText) ?></p><?php endif; ?>
  <?php if ($emailWarning): ?><p class="notice error"><?= e($emailWarning) ?></p><?php endif; ?>
  <?php if ($message): ?><p class="notice <?= e($messageType) ?>"><?= e($message) ?></p><?php endif; ?>
  <section class="show-picker">
    <h2>Shows</h2>
    <div class="show-grid">
      <?php foreach ($showList as $show): ?>
        <a class="<?= $show['id'] === $showFilter ? 'show-button active' : 'show-button' ?>" href="cart.php?show=<?= e($show['id']) ?>">
          <strong><?= e($show['title']) ?></strong>
          <span><?= e($show['genre']) ?> · Choose dates</span>
        </a>
      <?php endforeach; ?>
    </div>
  </section>
    <div class="cal-layout checkout-layout">
    <section class="cal-left">
      <div class="month-head">
        <a class="month-btn" href="cart.php?month=<?= e($previousMonth->format('Y-m')) ?>&amp;show=<?= e($showFilter) ?>">‹</a>
        <h2><?= e($monthDate->format('F Y')) ?></h2>
        <a class="month-btn" href="cart.php?month=<?= e($nextMonth->format('Y-m')) ?>&amp;show=<?= e($showFilter) ?>">›</a>
      </div>
      <div class="weekdays">
        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
      </div>
      <div class="day-grid">
        <?php for ($blank = 0; $blank < $offset; $blank++): ?><span></span><?php endfor; ?>
        <?php for ($day = 1; $day <= $monthDays; $day++): ?>
          <?php
          $dateKey = $month . '-' . str_pad((string)$day, 2, '0', STR_PAD_LEFT);
          $marked = false;
          foreach ($monthRows as $row) {
              if ($row['show_date'] === $dateKey) {
                  $marked = true;
                  break;
              }
          }
          $selected = $dateKey === $selectedDate;
          $dayClass = $marked ? ($selected ? 'selected-show' : 'has-show') : ($selected ? 'selected' : 'day');
          ?>
          <a class="<?= $dayClass ?>" href="cart.php?month=<?= e($month) ?>&amp;date=<?= e($dateKey) ?>&amp;show=<?= e($showFilter) ?>"><?= $day ?></a>
        <?php endfor; ?>
      </div>
      <p class="dim"><span class="show-dot"></span> Show dates</p>
    </section>

    <section class="cal-right">
      <div class="checkout-head">
        <div>
          <p class="eyebrow"><?= e(date_text($selectedDate)) ?></p>
          <h2><?= $selectedPerformance ? e($selectedPerformance['title']) : 'Choose a show' ?></h2>
        </div>
        <button class="button solid" type="button" data-open="cartDialog">View cart (<?= cart_count() ?>)</button>
      </div>
      <?php if (count($dayRows) > 1): ?>
        <div class="time-tabs">
          <?php foreach ($dayRows as $row): ?>
            <a class="<?= (int)$row['id'] === (int)$selectedPerformance['id'] ? 'time-tab active' : 'time-tab' ?>"
               href="cart.php?month=<?= e($month) ?>&amp;date=<?= e($selectedDate) ?>&amp;show=<?= e($showFilter) ?>&amp;performance=<?= (int)$row['id'] ?>">
              <strong><?= e(time_text($row['show_time'])) ?></strong>
              <small><?= e($row['title']) ?></small>
            </a>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
      <?php if ($selectedPerformance): ?>
        <div class="ticket">
          <p class="performance"><?= e($selectedPerformance['genre']) ?> · <?= e(date_text($selectedPerformance['show_date'])) ?> · <?= e(time_text($selectedPerformance['show_time'])) ?></p>
          <p><?= e($selectedPerformance['tagline']) ?></p>
          <p class="note"><?= (int)$selectedPerformance['seats_available'] ?> seats available · <?= e($selectedPerformance['venue']) ?></p>
          <form class="ticket-form" method="post" action="cart.php" novalidate>
            <input type="hidden" name="action" value="add">
            <input type="hidden" name="month" value="<?= e($month) ?>">
            <input type="hidden" name="date" value="<?= e($selectedDate) ?>">
            <input type="hidden" name="show_id" value="<?= e($showFilter) ?>">
            <input type="hidden" name="performance_id" value="<?= (int)$selectedPerformance['id'] ?>">
            <label for="ticketType">Ticket type</label>
            <select id="ticketType" name="ticket_type_id" required>
              <?php foreach ($ticketOptions as $ticket): ?>
                <option value="<?= (int)$ticket['id'] ?>"><?= e($ticket['name']) ?> · <?= e(money($ticket['price'])) ?></option>
              <?php endforeach; ?>
            </select>
            <label for="quantity">Quantity</label>
            <input id="quantity" name="quantity" type="number" min="1" max="10" value="1" required>
            <button class="button solid" type="submit">Add to cart</button>
          </form>
          <p class="note">Ticket prices are examples for this project. Payment is not collected.</p>
        </div>
      <?php else: ?>
        <div class="calendar-empty">No performance is scheduled on this date. Choose a marked date or another show.</div>
      <?php endif; ?>
    </section>
  </div>
</main>

<dialog class="cart-dialog" id="cartDialog" data-auto-open="<?= $checkoutErrors || $checkoutNotice ? 'true' : 'false' ?>">
  <form method="dialog"><button class="dialog-close" type="submit">Close</button></form>
  <h2>Your Cart</h2>
  <?php if ($checkoutNotice): ?><p class="notice error" role="alert"><?= e($checkoutNotice) ?></p><?php endif; ?>
  <?php if (count($cartItems)): ?>
    <div class="cart-table">
      <table class="show-table">
        <thead><tr><th>Show</th><th>Ticket</th><th>Qty</th><th>Total</th><th></th></tr></thead>
        <tbody>
          <?php foreach ($cartItems as $item): ?>
            <?php $key = (int)$item['performance_id'] . ':' . (int)$item['ticket_type_id']; ?>
            <tr>
              <td><?= e($item['title']) ?><br><small><?= e(date_text($item['performance_date'])) ?> · <?= e(time_text($item['show_time'])) ?></small></td>
              <td><?= e($item['ticket_name']) ?><br><small><?= e(money($item['price'])) ?> each</small></td>
              <td><?= (int)$item['quantity'] ?></td>
              <td><?= e(money($item['subtotal'])) ?></td>
              <td>
                <form method="post" action="cart.php">
                  <input type="hidden" name="action" value="remove">
                  <input type="hidden" name="cart_key" value="<?= e($key) ?>">
                  <input type="hidden" name="month" value="<?= e($month) ?>">
                  <input type="hidden" name="date" value="<?= e($selectedDate) ?>">
                  <input type="hidden" name="show_id" value="<?= e($showFilter) ?>">
                  <input type="hidden" name="performance_id" value="<?= $selectedPerformance ? (int)$selectedPerformance['id'] : 0 ?>">
                  <button class="text-button" type="submit">Remove</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <p class="cart-total">Total: <strong><?= e(money($cartTotal)) ?></strong></p>
      <form method="post" action="cart.php" class="cart-actions">
        <input type="hidden" name="action" value="clear">
        <input type="hidden" name="month" value="<?= e($month) ?>">
        <input type="hidden" name="date" value="<?= e($selectedDate) ?>">
        <input type="hidden" name="show_id" value="<?= e($showFilter) ?>">
        <input type="hidden" name="performance_id" value="<?= $selectedPerformance ? (int)$selectedPerformance['id'] : 0 ?>">
        <button class="button outline" type="submit">Clear cart</button>
      </form>
      <form class="customer-form check-form" method="post" action="cart.php" novalidate>
        <input type="hidden" name="action" value="checkout">
        <input type="hidden" name="month" value="<?= e($month) ?>">
        <input type="hidden" name="date" value="<?= e($selectedDate) ?>">
        <input type="hidden" name="show_id" value="<?= e($showFilter) ?>">
        <input type="hidden" name="performance_id" value="<?= $selectedPerformance ? (int)$selectedPerformance['id'] : 0 ?>">
        <h3>Reserve tickets</h3>
        <p>Enter your details to complete your booking. An asterisk * indicates required fields.</p>
        <label for="customerName">Full name *</label>
        <input id="customerName" name="customer_name" minlength="2" maxlength="150" required
               value="<?= e($checkoutValues['customer_name']) ?>"
               aria-invalid="<?= isset($checkoutErrors['customer_name']) ? 'true' : 'false' ?>"
               aria-describedby="customerNameError">
        <p class="error-message" id="customerNameError" role="alert"><?= isset($checkoutErrors['customer_name']) ? e($checkoutErrors['customer_name']) : '' ?></p>
        <label for="customerEmail">Email *</label>
        <input id="customerEmail" name="customer_email" type="email" maxlength="254" required
               value="<?= e($checkoutValues['customer_email']) ?>"
               aria-invalid="<?= isset($checkoutErrors['customer_email']) ? 'true' : 'false' ?>"
               aria-describedby="customerEmailError">
        <p class="error-message" id="customerEmailError" role="alert"><?= isset($checkoutErrors['customer_email']) ? e($checkoutErrors['customer_email']) : '' ?></p>
        <label for="phone">Phone *</label>
        <input id="phone" name="phone" type="tel" pattern="[0-9+ ()-]{7,25}" minlength="7" maxlength="25" required
               value="<?= e($checkoutValues['phone']) ?>"
               aria-invalid="<?= isset($checkoutErrors['phone']) ? 'true' : 'false' ?>"
               aria-describedby="phoneError">
        <p class="error-message" id="phoneError" role="alert"><?= isset($checkoutErrors['phone']) ? e($checkoutErrors['phone']) : '' ?></p>
        <button class="button solid" type="submit">Reserve tickets</button>
      </form>
    </div>
  <?php else: ?>
    <div class="calendar-empty">Your cart is empty. Add a ticket from the selected performance.</div>
  <?php endif; ?>
</dialog>
<?php include __DIR__ . '/footer.php'; ?>
