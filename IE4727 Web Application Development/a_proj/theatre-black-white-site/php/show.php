<?php
require_once __DIR__ . '/common.php';
$showId = request_text($_GET, 'id');
$show = show_by_id($db, $showId);
if (!$show) {
    http_response_code(404);
    $pageTitle = 'Show not found | Theatre';
    $activePage = 'calendar';
} else {
    $pageTitle = $show['title'] . ' | Theatre';
    $posterBackground = $show['poster_image'];
    $bodyClass = 'show-selected';
    $showPerformances = performances($db, '', $show['id'], '', true);
    $activePage = 'calendar';
}
include __DIR__ . '/header.php';
?>
<main class="show-page">
  <?php if (!$show): ?>
    <h1>Show not found</h1>
    <p><a href="calendar.php">Return to the calendar</a></p>
  <?php else: ?>
    <header class="show-hero">
      <p class="eyebrow"><?= e($show['genre']) ?></p>
      <h1><?= e($show['title']) ?></h1>
      <p class="lead"><?= e($show['tagline']) ?></p>
      <div class="button-row">
        <a class="button light" href="calendar.php?show=<?= e($show['id']) ?>">View calendar</a>
        <?php if (count($showPerformances)): ?><a class="button outline" href="cart.php?performance=<?= (int)$showPerformances[0]['id'] ?>">Choose tickets</a><?php endif; ?>
      </div>
    </header>
    <div class="show-description">
      <section>
        <p class="eyebrow">About the show</p>
        <h2>A story for the stage</h2>
        <p><?= e($show['description']) ?></p>
        <p><?= e($show['runtime']) ?></p>
      </section>
      <aside class="show-dates">
        <h2>Performance details</h2>
        <p><strong>Dates</strong><br><?= e(date_text($show['season_start'], false)) ?> – <?= e(date_text($show['season_end'])) ?></p>
        <p><strong>Venue</strong><br><?= e($show['venue']) ?></p>
      </aside>
    </div>
  <?php endif; ?>
</main>
<?php include __DIR__ . '/footer.php'; ?>
