<?php
require_once __DIR__ . '/common.php';
$pageTitle = 'Upcoming Shows | Theatre';
$activePage = 'calendar';
$month = request_text($_GET, 'month', date('Y-m'));
$monthDate = DateTime::createFromFormat('Y-m-d', $month . '-01');
if (!$monthDate || $monthDate->format('Y-m') !== $month) {
    $monthDate = new DateTime(date('Y-m-01'));
    $month = $monthDate->format('Y-m');
}
$showFilter = request_text($_GET, 'show');
$monthRows = performances($db, $month, $showFilter);
$selectedDate = request_text($_GET, 'date');
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $selectedDate) || substr($selectedDate, 0, 7) !== $month) {
    $selectedDate = '';
}
if (!$selectedDate) {
    foreach ($monthRows as $row) {
        if ($row['show_date'] >= date('Y-m-d')) {
            $selectedDate = $row['show_date'];
            break;
        }
    }
}
if (!$selectedDate) {
    $selectedDate = $monthDate->format('Y-m-01');
}
$dayRows = array();
foreach ($monthRows as $row) {
    if ($row['show_date'] === $selectedDate) {
        $dayRows[] = $row;
    }
}
$selectedPerformance = null;
$requestedPerformance = request_number($_GET, 'performance');
foreach ($dayRows as $row) {
    if ((int)$row['id'] === $requestedPerformance) {
        $selectedPerformance = $row;
        break;
    }
}
if (!$selectedPerformance && count($dayRows)) {
    $selectedPerformance = $dayRows[0];
}
$previousMonth = clone $monthDate;
$previousMonth->modify('-1 month');
$nextMonth = clone $monthDate;
$nextMonth->modify('+1 month');
$monthDays = (int)$monthDate->format('t');
$offset = (int)$monthDate->format('N') - 1;
$ticketList = ticket_types($db);
$posterBackground = $selectedPerformance ? $selectedPerformance['poster_image'] : '';
$bodyClass = $selectedPerformance ? 'show-selected' : '';
include __DIR__ . '/header.php';
?>
<main class="cal-page">
  <div class="cal-layout">
    <section class="cal-left">
      <div class="month-head">
        <a class="month-btn" href="calendar.php?month=<?= e($previousMonth->format('Y-m')) ?>&amp;show=<?= e($showFilter) ?>">‹</a>
        <h1><?= e($monthDate->format('F Y')) ?></h1>
        <a class="month-btn" href="calendar.php?month=<?= e($nextMonth->format('Y-m')) ?>&amp;show=<?= e($showFilter) ?>">›</a>
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
          <a class="<?= $dayClass ?>" href="calendar.php?month=<?= e($month) ?>&amp;date=<?= e($dateKey) ?>&amp;show=<?= e($showFilter) ?>"><?= $day ?></a>
        <?php endfor; ?>
      </div>
      <p class="dim"><span class="show-dot"></span> Show dates</p>
    </section>

    <section class="cal-right">
      <div class="cal-title">
        <p class="eyebrow"><?= e(date_text($selectedDate)) ?></p>
        <h2>Performances</h2>
      </div>
      <?php if (count($dayRows) > 1): ?>
        <div class="time-tabs">
          <?php foreach ($dayRows as $row): ?>
            <a class="<?= (int)$row['id'] === (int)$selectedPerformance['id'] ? 'time-tab active' : 'time-tab' ?>"
               href="calendar.php?month=<?= e($month) ?>&amp;date=<?= e($selectedDate) ?>&amp;performance=<?= (int)$row['id'] ?>&amp;show=<?= e($showFilter) ?>">
              <strong><?= e(time_text($row['show_time'])) ?></strong>
              <small><?= e($row['title']) ?></small>
            </a>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
      <?php if ($selectedPerformance): ?>
        <div class="date-card has-poster">
          <div class="date-art"><img src="<?= e($selectedPerformance['poster_image']) ?>" alt="<?= e($selectedPerformance['title']) ?> poster"></div>
          <div class="show-copy">
            <p class="eyebrow"><?= e($selectedPerformance['genre']) ?> · <?= e(time_text($selectedPerformance['show_time'])) ?></p>
            <h2><?= e($selectedPerformance['title']) ?></h2>
            <p><?= e($selectedPerformance['description']) ?></p>
            <table class="show-table">
              <tbody>
                <tr><th>Date</th><td><?= e(date_text($selectedPerformance['show_date'])) ?></td></tr>
                <tr><th>Time</th><td><?= e(time_text($selectedPerformance['show_time'])) ?></td></tr>
                <tr><th>Run time</th><td><?= e($selectedPerformance['runtime']) ?></td></tr>
                <tr><th>Venue</th><td><?= e($selectedPerformance['venue']) ?></td></tr>
              </tbody>
            </table>
            <div class="button-row">
              <button class="button outline" type="button" data-open="calendarDetails">More details</button>
              <a class="button solid" href="cart.php?performance=<?= (int)$selectedPerformance['id'] ?>">Choose tickets</a>
            </div>
          </div>
        </div>
      <?php else: ?>
        <div class="calendar-empty">No performance is scheduled on this date. Choose a marked date to see its shows.</div>
      <?php endif; ?>
    </section>
  </div>
</main>

<?php if ($selectedPerformance): ?>
  <dialog class="details-dialog" id="calendarDetails">
    <form method="dialog"><button class="dialog-close" type="submit">Close</button></form>
    <header class="details-title">
      <p><?= e($selectedPerformance['genre']) ?></p>
      <h2><?= e($selectedPerformance['title']) ?></h2>
    </header>
    <div class="details-body">
      <div class="details-top">
        <aside class="details-facts">
          <p class="detail-label">Production details</p>
          <p><strong>Genre</strong><?= e($selectedPerformance['genre']) ?></p>
          <p><strong>Run time</strong><?= e($selectedPerformance['runtime']) ?></p>
          <p><strong>Venue</strong><?= e($selectedPerformance['venue']) ?></p>
        </aside>
        <section class="details-story">
          <blockquote><?= e($selectedPerformance['tagline']) ?></blockquote>
          <p><?= e($selectedPerformance['description']) ?></p>
          <a class="button outline" href="cart.php?performance=<?= (int)$selectedPerformance['id'] ?>">Book this show</a>
        </section>
      </div>
      <div class="details-bottom">
        <section class="details-performance">
          <p class="detail-label">Performance details</p>
          <p><strong>Date</strong><?= e(date_text($selectedPerformance['show_date'])) ?></p>
          <p><strong>Time</strong><?= e(time_text($selectedPerformance['show_time'])) ?></p>
          <p><strong>Terms</strong>Tickets are subject to availability. Please arrive 30 minutes before the performance.</p>
        </section>
        <section class="details-prices">
          <p class="detail-label">Ticket pricing</p>
          <h3>Choose your seats</h3>
          <ul>
            <?php foreach ($ticketList as $ticket): ?>
              <li><span><?= e($ticket['name']) ?></span><strong><?= e(money($ticket['price'])) ?></strong></li>
            <?php endforeach; ?>
          </ul>
          <a href="cart.php?performance=<?= (int)$selectedPerformance['id'] ?>">Choose tickets</a>
        </section>
      </div>
    </div>
  </dialog>
<?php endif; ?>

<?php include __DIR__ . '/footer.php'; ?>
