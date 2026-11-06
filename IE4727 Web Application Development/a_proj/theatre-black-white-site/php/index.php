<?php
require_once __DIR__ . '/common.php';
$pageTitle = 'Theatre | Home';
$activePage = 'home';
$allShows = shows($db);
$featuredShows = array_slice($allShows, 0, 4);
$bannerItems = banners($db);
include __DIR__ . '/header.php';
?>
<main>
  <section class="hero" data-carousel>
    <?php foreach ($bannerItems as $index => $banner): ?>
      <div class="<?= $index === 0 ? 'hero-slide active' : 'hero-slide' ?>">
        <img class="banner" src="<?= e($banner['image_path']) ?>" alt="<?= e($banner['title']) ?> theatre banner">
      </div>
    <?php endforeach; ?>
    <?php if (count($bannerItems) > 1): ?>
      <button class="slide-control slide-prev" type="button" data-slide="prev">Previous</button>
      <button class="slide-control slide-next" type="button" data-slide="next">Next</button>
    <?php endif; ?>
  </section>

  <section class="featured-section">
    <h1>Featured Shows</h1>
    <div class="poster-grid">
      <?php foreach ($featuredShows as $show): ?>
        <article class="show-card">
          <button class="poster-link poster-card" type="button" data-open="mini-<?= e($show['id']) ?>">
            <span class="show-art"><img src="<?= e($show['poster_image']) ?>" alt="<?= e($show['title']) ?> poster"></span>
            <span class="poster-info">
              <strong><?= e($show['title']) ?></strong>
              <span><?= e($show['genre']) ?></span>
            </span>
          </button>
        </article>
      <?php endforeach; ?>
    </div>
    <p class="center"><a class="button outline" href="calendar.php">See all shows</a></p>
  </section>

  <section class="feature-section">
    <div class="feature-grid">
      <article class="feature-card">
        <h2>About Theatre</h2>
        <a class="feature-link" href="behind-the-curtain.php">
          <img src="../images/home-theatre.png" alt="Theatre stage with red curtains">
          <p>Meet the artists, makers and stage crew who bring each live performance to life.</p>
          <span class="button outline">See more</span>
        </a>
      </article>
      <article class="feature-card">
        <h2>Become a Donor</h2>
        <a class="feature-link" href="behind-the-curtain.php#donate">
          <img src="../images/home-donor.png" alt="A volunteer carrying a box of donations">
          <p>Your gift supports new work, emerging artists and a welcoming theatre for everyone.</p>
          <span class="button outline">See more</span>
        </a>
      </article>
    </div>
  </section>
</main>

<?php foreach ($featuredShows as $show): ?>
  <?php
  $showPerformances = performances($db, '', $show['id'], '', true);
  $firstShowTime = count($showPerformances) ? date_text($showPerformances[0]['show_date'], false) . ' · ' . time_text($showPerformances[0]['show_time']) : 'Dates to be announced';
  ?>
  <dialog class="show-dialog" id="mini-<?= e($show['id']) ?>">
    <form method="dialog"><button class="dialog-close" type="submit">Close</button></form>
    <div class="dialog-title">
      <p class="eyebrow"><?= e($show['genre']) ?></p>
      <h2><?= e($show['title']) ?></h2>
      <p><?= e($show['tagline']) ?></p>
    </div>
    <div class="dialog-grid">
      <aside class="dialog-facts">
        <p class="eyebrow">The production</p>
        <p><strong>Genre</strong><?= e($show['genre']) ?></p>
        <p><strong>Run time</strong><?= e($show['runtime']) ?></p>
        <p><strong>Season</strong><?= e(date_text($show['season_start'], false)) ?> – <?= e(date_text($show['season_end'])) ?></p>
        <p><strong>Venue</strong><?= e($show['venue']) ?></p>
      </aside>
      <section class="dialog-copy">
        <p><?= e($show['description']) ?></p>
        <a class="button solid" href="calendar.php?show=<?= e($show['id']) ?>">Book now</a>
      </section>
    </div>
    <section class="details-extra" hidden>
      <div>
        <p class="eyebrow">Performance details</p>
        <h3>Plan your visit</h3>
        <p><strong>Next performance</strong><br><?= e($firstShowTime) ?></p>
        <p><strong>Venue</strong><br><?= e($show['venue']) ?></p>
        <p>Tickets are subject to availability. Please arrive 30 minutes before the performance.</p>
      </div>
      <div>
        <p class="eyebrow">Ticket information</p>
        <h3>Choose your seats</h3>
        <ul>
          <li>Standard and premium seats</li>
          <li>Accessible seating available</li>
          <li>Final prices are shown in the cart</li>
        </ul>
        <a href="calendar.php?show=<?= e($show['id']) ?>">Browse show dates</a>
        <br>
        <a href="show.php?id=<?= e($show['id']) ?>">Read the full show page</a>
      </div>
    </section>
    <div class="dialog-actions">
      <button class="button outline" type="button" data-expand>More details</button>
      <a class="button outline" href="calendar.php?show=<?= e($show['id']) ?>">View calendar</a>
      <a class="button solid" href="cart.php?show=<?= e($show['id']) ?>">Choose tickets</a>
    </div>
  </dialog>
<?php endforeach; ?>

<?php include __DIR__ . '/footer.php'; ?>
