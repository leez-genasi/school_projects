<?php
require_once __DIR__ . '/common.php';
$pageTitle = 'Behind the Curtain | Theatre';
$activePage = 'behind';
$showCurtain = true;
$bodyClass = 'curtain-page';
include __DIR__ . '/header.php';
?>
<main class="behind-page">
  <div class="behind-layout">
    <aside class="behind-index">
      <h2>Contents</h2>
      <ol>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#people">Featured people</a></li>
        <li><a href="#creative">Creative team</a></li>
        <li><a href="#performers">Performers</a></li>
        <li><a href="#design">Design and build</a></li>
        <li><a href="#operations">Stage operations</a></li>
        <li><a href="#front-of-house">Front of house</a></li>
        <li><a href="#process">Making a show</a></li>
        <li><a href="#donate">Support the theatre</a></li>
      </ol>
    </aside>

    <article class="behind-article">
      <header class="behind-heading">
        <p class="eyebrow">The people and craft</p>
        <h1>Behind the Curtain</h1>
        <p class="lead">Every performance is made by a team working onstage and behind it.</p>
      </header>

      <section id="overview" class="behind-section">
        <h2>Overview</h2>
        <p>A theatre production brings together performers, designers, makers, technicians and audience services. Each role contributes to the shared experience, from the first planning meeting to the final curtain call.</p>
      </section>

      <section id="people" class="behind-section">
        <h2>Featured people</h2>
        <p class="fiction-note">All names, roles, profiles and quotations are fictional. The supplied portraits are used as visual examples and do not identify the fictional people.</p>
        <div class="crew-grid">
          <article class="crew-card">
            <img src="../images/crew/arin-vale.png" alt="Portrait photo used for the fictional Artistic Director profile">
            <div class="crew-copy">
              <h3>Arin Vale</h3>
              <p class="crew-role">Artistic Director</p>
              <blockquote>“A strong production begins when everyone has room to bring an idea forward.”</blockquote>
            </div>
          </article>
          <article class="crew-card">
            <img src="../images/crew/zola-mensah.png" alt="Portrait photo used for the fictional Producer profile">
            <div class="crew-copy">
              <h3>Zola Mensah</h3>
              <p class="crew-role">Producer</p>
              <blockquote>“The audience sees one evening; the team builds it together over many weeks.”</blockquote>
            </div>
          </article>
          <article class="crew-card">
            <img src="../images/crew/maya-ellis.png" alt="Portrait photo used for the fictional Stage Manager profile">
            <div class="crew-copy">
              <h3>Maya Ellis</h3>
              <p class="crew-role">Stage Manager</p>
              <blockquote>“My job is to help every cue, person and detail meet at the right moment.”</blockquote>
            </div>
          </article>
        </div>
      </section>

      <section id="creative" class="behind-section">
        <h2>Creative team</h2>
        <p>The creative team shapes the story and decides how it will reach the audience.</p>
        <ul class="role-list">
          <li><strong>Arin Vale, artistic director:</strong> guides the theatre’s artistic direction.</li>
          <li><strong>Elio Marlow, director:</strong> leads the interpretation and staging of a production.</li>
          <li><strong>Priya Solen, playwright:</strong> writes or adapts the script.</li>
          <li><strong>Zola Mensah, producer:</strong> coordinates the people, schedule and resources for a show.</li>
          <li><strong>Jules Aven, music director:</strong> prepares singers and musicians and shapes the music.</li>
          <li><strong>Ren Sato, choreographer:</strong> creates movement and dance for the stage.</li>
          <li><strong>Calla Wynn, company manager:</strong> supports the performers and coordinates company needs.</li>
        </ul>
      </section>

      <section id="performers" class="behind-section">
        <h2>Performers</h2>
        <p>Performers bring the story to life in front of an audience.</p>
        <ul class="role-list">
          <li><strong>Nico Fenn and Liora Beck, actors:</strong> perform the characters and scenes.</li>
          <li><strong>Samira Quill and Tavi Moss, singers:</strong> perform the show’s songs.</li>
          <li><strong>The ensemble:</strong> supports scenes, music and movement across the production.</li>
          <li><strong>Oren Vale, musical performer:</strong> performs the score with the company.</li>
          <li><strong>Dara Finch, understudy:</strong> prepares to take over a role when needed.</li>
          <li><strong>Kit Rowan, dance captain:</strong> helps performers maintain the choreography.</li>
        </ul>
      </section>

      <section id="design" class="behind-section">
        <h2>Design and build</h2>
        <p>Designers and makers create the visual and sound world of a show.</p>
        <ul class="role-list">
          <li><strong>Beckett Rill, set designer:</strong> plans the scenery and stage environment.</li>
          <li><strong>Amaya Crest, costume designer:</strong> plans clothing that supports the characters and period.</li>
          <li><strong>Sol Arden, lighting designer:</strong> creates the lighting plan and atmosphere.</li>
          <li><strong>Remy Calder, sound designer:</strong> plans the sound effects and audio environment.</li>
          <li><strong>Fia North, props maker:</strong> sources or builds the objects used onstage.</li>
          <li><strong>Hollis Dane, scenic artist:</strong> paints and finishes scenery.</li>
          <li><strong>Rafi Bell and Inez Hart, builders:</strong> build and assemble the set.</li>
          <li><strong>The wardrobe team:</strong> prepares, fits and maintains costumes.</li>
        </ul>
      </section>

      <section id="operations" class="behind-section">
        <h2>Stage operations</h2>
        <p>The operations team keeps rehearsals and performances organised and safe.</p>
        <ul class="role-list">
          <li><strong>Devon Pike, production manager:</strong> coordinates schedules, departments and technical planning.</li>
          <li><strong>Maya Ellis, stage manager:</strong> coordinates rehearsals and calls the show’s cues.</li>
          <li><strong>Uma Reed, assistant stage manager:</strong> supports backstage activity and tracks scene changes.</li>
          <li><strong>Lucian Frost, technical director:</strong> oversees the technical plan and stage equipment.</li>
          <li><strong>Jo Bellamy and Ash Venn, operators:</strong> run lighting and sound cues.</li>
          <li><strong>Ezra Lake, followspot operator:</strong> follows performers with a spotlight.</li>
          <li><strong>The stage crew:</strong> move scenery and props during scene changes.</li>
        </ul>
      </section>

      <section id="front-of-house" class="behind-section">
        <h2>Front of house</h2>
        <p>Front-of-house staff welcome audiences and help them enjoy their visit.</p>
        <ul class="role-list">
          <li><strong>Nell Harper, house manager:</strong> oversees audience services in the venue.</li>
          <li><strong>Ollie Wren and Mina Frost, ushers:</strong> help guests find their seats and answer questions.</li>
          <li><strong>Rhea Sol and Bastian Cole, box office team:</strong> assist with ticket enquiries and bookings.</li>
          <li><strong>Indira Vale, access coordinator:</strong> helps arrange access support for visitors.</li>
          <li><strong>The visitor services team:</strong> shares practical information before and after the show.</li>
        </ul>
      </section>

      <section id="process" class="behind-section">
        <h2>Making a show</h2>
        <ol class="process-list">
          <li><strong>Planning:</strong> the team selects the work and develops the production plan.</li>
          <li><strong>Rehearsals:</strong> performers and the director develop scenes, music and movement.</li>
          <li><strong>Build and preparation:</strong> designers and makers prepare sets, costumes, props and technical equipment.</li>
          <li><strong>Technical rehearsals:</strong> the team brings the performance, lighting and sound cues together onstage.</li>
          <li><strong>Performance:</strong> the cast and crew work together for each audience.</li>
        </ol>
      </section>

      <section id="donate" class="behind-section support-section">
        <h2>Support the theatre</h2>
        <p>Support helps the theatre develop new work, welcome artists and make performances accessible to more people.</p>
        <a class="button solid" href="visit.php?section=contact#contact">Get in touch</a>
      </section>
    </article>
  </div>
</main>
<?php include __DIR__ . '/footer.php'; ?>
