<?php
require_once __DIR__ . '/common.php';
require_once __DIR__ . '/email.php';
$pageTitle = 'Getting Here | Theatre';
$activePage = 'visit';
$formMessage = '';
$formType = '';
$errors = [
  'name' => '',
  'email' => '',
  'subject' => '',
  'message' => ''
];

if (isset($_GET['sent']) && !empty($_SESSION['contact_sent'])) {
    if (!empty($_SESSION['contact_email_sent'])) {
        $formMessage = 'Your message was saved. A confirmation email was sent to ' . request_text($_SESSION, 'contact_email_to') . '.';
        $formType = 'success';
    } else {
        $formMessage = 'Your message was saved in MySQL, but the confirmation email could not be sent. Check the mail setup in README.txt.';
        $formType = 'error';
    }
    unset($_SESSION['contact_sent']);
    unset($_SESSION['contact_email_sent']);
    unset($_SESSION['contact_email_to']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send_message'])) {
    $name = request_text($_POST, 'name');
    $email = request_text($_POST, 'email');
    $subject = request_text($_POST, 'subject');
    $message = request_text($_POST, 'message');

    if (empty($name)) {
        $errors['name'] = 'Name is required.';
    }
    if (empty($email)) {
        $errors['email'] = 'Email is required.';
    }
    else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email format.';
    }
    if (empty($subject)) {
        $errors['subject'] = 'Subject is required.';
    }
    if (empty($message)) {
        $errors['message'] = 'Message is required.';
    } 
    
    if (!array_filter($errors)) {
      $save = $db->prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
      $save->bind_param('ssss', $name, $email, $subject, $message);
      if ($save->execute()) {
          $save->close();
          $emailSent = false;
          try {
              $emailSent = send_contact_email($email, $name, $subject);
          } catch (Throwable $mailError) {
              error_log('Theatre contact confirmation email failed.');
          }
          $_SESSION['contact_sent'] = true;
          $_SESSION['contact_email_sent'] = $emailSent;
          $_SESSION['contact_email_to'] = $email;
          header('Location: visit.php?section=contact&sent=1#contact');
          $formMessage = 'Your message was saved. A confirmation email was sent to ' . $email . '.';
          exit;
      }
      $save->close();
      $formMessage = 'We could not save your message. Please try again.';
      $formType = 'error';
    }
}

include __DIR__ . '/header.php';
?>
<main class="visit-page">
  <section class="visit-section" id="getting-here">
    <h1 class="visit-title">Getting Here</h1>
    <p class="visit-address">Theatre, 10 ABC Street, XYZ, Singapore (123456)</p>
    <div class="map-card"><img class="theatre-map" src="../images/theatre-map.jpg" alt="Black image with white text reading: Imagine this a map of the fake theatre"></div>
    <div class="visit-grid">
      <section class="visit-info">
        <h2>Via MRT:</h2>
        <p>Located at Central MRT station (CE1/DT16).</p>
        <p>MRT services to/from Central MRT operate daily from 6am to 12am.</p>
        <h2>Via Bus:</h2>
        <p>Bus Stops:</p>
        <ul class="bus-list">
          <li>03509: XXX Hotel (outside Hotel Tower 2)
            <ul><li>Bus 10, 11, 12, 13</li></ul>
          </li>
          <li>03510: XXX
            <ul><li>Bus 18, 19, 20</li></ul>
          </li>
        </ul>
      </section>
      <section class="visit-info">
        <h2>Parking Options:</h2>
        <p>Theatre is accessible via XYZ Avenue.</p>
        <p>North Entrance: XNV Avenue<br>South Entrance: XYZ Link</p>
        <h3>Parking Rates:</h3>
        <dl class="parking-rates">
          <div><dt>Hourly Rate:</dt><dd>$200</dd></div>
          <div><dt>Max Charge:</dt><dd>$2000/24 hours</dd></div>
        </dl>
      </section>
    </div>
  </section>

  <section class="contact-section" id="contact">
    <p class="eyebrow">Need a hand?</p>
    <h2>FAQs</h2>
    <div class="faq-list">
      <details class="faq-item" open>
        <summary>When should I arrive?</summary>
        <p>Please arrive 30 minutes before the performance.</p>
      </details>
      <details class="faq-item">
        <summary>Can I exchange my ticket?</summary>
        <p>Contact the box office before your performance date to ask about changes.</p>
      </details>
      <details class="faq-item">
        <summary>Is the theatre accessible?</summary>
        <p>Contact us before booking and we’ll help arrange access support.</p>
      </details>
      <details class="faq-item">
        <summary>Is there a dress code?</summary>
        <p>There is no formal dress code. Smart casual clothing is welcome.</p>
      </details>
      <details class="faq-item">
        <summary>Can I bring food or drinks?</summary>
        <p>Outside food and drinks are not allowed inside the auditorium.</p>
      </details>
      <details class="faq-item">
        <summary>Where can I park?</summary>
        <p>Parking is accessible via XYZ Avenue. The hourly rate is $200, with a maximum charge of $2000 per 24 hours.</p>
      </details>
      <details class="faq-item">
        <summary>Can I take photos during the show?</summary>
        <p>Please keep phones and cameras away during performances.</p>
      </details>
      <details class="faq-item">
        <summary>Are latecomers allowed into the auditorium?</summary>
        <p>Late seating may be delayed until a suitable break in the performance.</p>
      </details>
    </div>

    <div class="contact-form">
      <p class="eyebrow">We’re here to help</p>
      <h2>Contact Us</h2>
      <?php if ($formMessage): ?><p class="notice <?= e($formType) ?>"><?= e($formMessage) ?></p><?php endif; ?>
      <form class="check-form contact-form" method="post" action="visit.php?section=contact#contact" novalidate>
        <input type="hidden" name="send_message" value="1">
        <label for="name">Name</label>
        <input id="name" name="name" minlength="2" maxlength="150" value="<?= e($_POST['name'] ?? '') ?>" aria-describedby="name-error" aria-invalid="<?= $errors['name'] ? 'true' : 'false' ?>" required>
        <div class="error-message" id="name-error" aria-live="polite"><?= e($errors['name']) ?></div>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" maxlength="254" value="<?= e($_POST['email'] ?? '') ?>" aria-describedby="email-error" aria-invalid="<?= $errors['email'] ? 'true' : 'false' ?>" required>
        <div class="error-message" id="email-error" aria-live="polite"><?= e($errors['email']) ?></div>
        <label for="subject">Subject</label>
        <input id="subject" name="subject" minlength="2" maxlength="200" value="<?= e($_POST['subject'] ?? '') ?>" aria-describedby="subject-error" aria-invalid="<?= $errors['subject'] ? 'true' : 'false' ?>" required>
        <div class="error-message" id="subject-error" aria-live="polite"><?= e($errors['subject']) ?></div>
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" minlength="10" maxlength="5000" aria-describedby="message-error" aria-invalid="<?= $errors['message'] ? 'true' : 'false' ?>" required><?= e($_POST['message'] ?? '') ?></textarea>
        <div class="error-message" id="message-error" aria-live="polite"><?= e($errors['message']) ?></div>
        <button class="button solid" type="submit">Send message</button>
      </form>
    </div>
  </section>
</main>
<?php include __DIR__ . '/footer.php'; ?>
