<?php
$current = isset($activePage) ? $activePage : '';
$cartTotal = cart_count();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($pageTitle ?? 'Theatre') ?></title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="<?= e($bodyClass ?? '') ?>"<?= !empty($posterBackground) ? ' style="--poster-bg: url(&quot;' . e($posterBackground) . '&quot;)"' : '' ?>>
<?php if (!empty($showCurtain)): ?>
  <div class="curtain-screen">
    <div class="curtain-panel curtain-left"></div>
    <div class="curtain-panel curtain-right"></div>
  </div>
<?php endif; ?>
<nav class="site-nav">
  <div class="nav-wrap">
    <a class="brand" href="index.php">theatre</a>
    <button class="nav-toggle" type="button" data-menu>Menu</button>
    <div class="nav-menu" id="navMenu">
      <a class="<?= $current === 'home' ? 'nav-link active' : 'nav-link' ?>" href="index.php">Home</a>
      <a class="<?= $current === 'calendar' ? 'nav-link active' : 'nav-link' ?>" href="calendar.php">Upcoming Shows</a>
      <a class="<?= $current === 'visit' && (!isset($_GET['section']) || $_GET['section'] !== 'contact') ? 'nav-link active' : 'nav-link' ?>" href="visit.php#getting-here">Getting Here</a>
      <a class="<?= $current === 'visit' && isset($_GET['section']) && $_GET['section'] === 'contact' ? 'nav-link active' : 'nav-link' ?>" href="visit.php?section=contact#contact">Contact Us</a>
      <a class="<?= $current === 'behind' ? 'nav-link active' : 'nav-link' ?>" href="behind-the-curtain.php">Behind the Curtain</a>
      <a class="<?= $current === 'cart' ? 'nav-link active' : 'nav-link' ?>" href="cart.php">Cart<?= $cartTotal ? ' (' . $cartTotal . ')' : '' ?></a>
    </div>
  </div>
</nav>
