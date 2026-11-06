import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import './BehindTheCurtainPage.css';

const crew = [
  {
    name: 'Arin Vale',
    role: 'Artistic Director',
    image: 'arin-vale.png',
    quote: 'A strong production begins when everyone has room to bring an idea forward.',
  },
  {
    name: 'Zola Mensah',
    role: 'Producer',
    image: 'zola-mensah.png',
    quote: 'The audience sees one evening; the team builds it together over many weeks.',
  },
  {
    name: 'Maya Ellis',
    role: 'Stage Manager',
    image: 'maya-ellis.png',
    quote: 'My job is to help every cue, person and detail meet at the right moment.',
  },
];

const teams = [
  {
    id: 'creative',
    title: 'Creative team',
    intro: 'The creative team shapes the story and decides how it will reach the audience.',
    roles: [
      ['Arin Vale, artistic director', 'guides the theatre’s artistic direction.'],
      ['Elio Marlow, director', 'leads the interpretation and staging of a production.'],
      ['Priya Solen, playwright', 'writes or adapts the script.'],
      ['Zola Mensah, producer', 'coordinates the people, schedule and resources for a show.'],
      ['Jules Aven, music director', 'prepares singers and musicians and shapes the music.'],
      ['Ren Sato, choreographer', 'creates movement and dance for the stage.'],
      ['Calla Wynn, company manager', 'supports the performers and coordinates company needs.'],
    ],
  },
  {
    id: 'performers',
    title: 'Performers',
    intro: 'Performers bring the story to life in front of an audience.',
    roles: [
      ['Nico Fenn and Liora Beck, actors', 'perform the characters and scenes.'],
      ['Samira Quill and Tavi Moss, singers', 'perform the show’s songs.'],
      ['The ensemble', 'supports scenes, music and movement across the production.'],
      ['Oren Vale, musical performer', 'performs the score with the company.'],
      ['Dara Finch, understudy', 'prepares to take over a role when needed.'],
      ['Kit Rowan, dance captain', 'helps performers maintain the choreography.'],
    ],
  },
  {
    id: 'design',
    title: 'Design and build',
    intro: 'Designers and makers create the visual and sound world of a show.',
    roles: [
      ['Beckett Rill, set designer', 'plans the scenery and stage environment.'],
      ['Amaya Crest, costume designer', 'plans clothing that supports the characters and period.'],
      ['Sol Arden, lighting designer', 'creates the lighting plan and atmosphere.'],
      ['Remy Calder, sound designer', 'plans the sound effects and audio environment.'],
      ['Fia North, props maker', 'sources or builds the objects used onstage.'],
      ['Hollis Dane, scenic artist', 'paints and finishes scenery.'],
      ['Rafi Bell and Inez Hart, builders', 'build and assemble the set.'],
      ['The wardrobe team', 'prepares, fits and maintains costumes.'],
    ],
  },
  {
    id: 'operations',
    title: 'Stage operations',
    intro: 'The operations team keeps rehearsals and performances organised and safe.',
    roles: [
      ['Devon Pike, production manager', 'coordinates schedules, departments and technical planning.'],
      ['Maya Ellis, stage manager', 'coordinates rehearsals and calls the show’s cues.'],
      ['Uma Reed, assistant stage manager', 'supports backstage activity and tracks scene changes.'],
      ['Lucian Frost, technical director', 'oversees the technical plan and stage equipment.'],
      ['Jo Bellamy and Ash Venn, operators', 'run lighting and sound cues.'],
      ['Ezra Lake, followspot operator', 'follows performers with a spotlight.'],
      ['The stage crew', 'move scenery and props during scene changes.'],
    ],
  },
  {
    id: 'front-of-house',
    title: 'Front of house',
    intro: 'Front-of-house staff welcome audiences and help them enjoy their visit.',
    roles: [
      ['Nell Harper, house manager', 'oversees audience services in the venue.'],
      ['Ollie Wren and Mina Frost, ushers', 'help guests find their seats and answer questions.'],
      ['Rhea Sol and Bastian Cole, box office team', 'assist with ticket enquiries and bookings.'],
      ['Indira Vale, access coordinator', 'helps arrange access support for visitors.'],
      ['The visitor services team', 'shares practical information before and after the show.'],
    ],
  },
];

const process = [
  ['Planning', 'the team selects the work and develops the production plan.'],
  ['Rehearsals', 'performers and the director develop scenes, music and movement.'],
  ['Build and preparation', 'designers and makers prepare sets, costumes, props and technical equipment.'],
  ['Technical rehearsals', 'the team brings the performance, lighting and sound cues together onstage.'],
  ['Performance', 'the cast and crew work together for each audience.'],
];

export default function BehindTheCurtainPage() {
  const location = useLocation();
  const [curtainVisible, setCurtainVisible] = useState(true);

  useEffect(() => {
    const openTimer = window.setTimeout(() => setCurtainVisible(false), 1200);
    return () => window.clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [location.hash]);

  return (
    <PageLayout mainClassName="container curtain-page">
      {curtainVisible && (
        <div className="curtain-screen" aria-hidden="true">
          <div className="curtain-panel curtain-left" />
          <div className="curtain-panel curtain-right" />
        </div>
      )}
      <div className="behind-layout">
        <aside className="behind-index">
          <h2 className="h5">Contents</h2>
          <ol>
            <li><Link to="/behind-the-curtain#overview">Overview</Link></li>
            <li><Link to="/behind-the-curtain#people">Featured people</Link></li>
            {teams.map((team) => <li key={team.id}><Link to={`/behind-the-curtain#${team.id}`}>{team.title}</Link></li>)}
            <li><Link to="/behind-the-curtain#process">Making a show</Link></li>
            <li><Link to="/behind-the-curtain#donate">Support the theatre</Link></li>
          </ol>
        </aside>
        <article className="behind-article">
          <header className="behind-heading">
            <p className="eyebrow">The people and craft</p>
            <h1>Behind the Curtain</h1>
            <p className="lead">Every performance is made by a team working onstage and behind it.</p>
          </header>

          <section className="behind-section" id="overview">
            <h2>Overview</h2>
            <p>A theatre production brings together performers, designers, makers, technicians and audience services. Each role contributes to the shared experience, from the first planning meeting to the final curtain call.</p>
          </section>

          <section className="behind-section" id="people">
            <h2>Featured people</h2>
            <p className="fiction-note">All names, roles, profiles and quotations are fictional. The supplied portraits are used as visual examples and do not identify the fictional people.</p>
            <div className="crew-grid">
              {crew.map((person) => (
                <article className="crew-card" key={person.name}>
                  <img src={`/images/crew/${person.image}`} alt={`Portrait used for the fictional ${person.name} profile`} loading="lazy" />
                  <div className="crew-copy">
                    <h3>{person.name}</h3>
                    <p className="crew-role">{person.role}</p>
                    <blockquote>“{person.quote}”</blockquote>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {teams.map((team) => (
            <section className="behind-section" id={team.id} key={team.id}>
              <h2>{team.title}</h2>
              <p>{team.intro}</p>
              <ul className="role-list">
                {team.roles.map(([role, description]) => (
                  <li key={role}><strong>{role}:</strong> {description}</li>
                ))}
              </ul>
            </section>
          ))}

          <section className="behind-section" id="process">
            <h2>Making a show</h2>
            <ol className="process-list">
              {process.map(([stage, description]) => (
                <li key={stage}><strong>{stage}:</strong> {description}</li>
              ))}
            </ol>
          </section>

          <section className="behind-section support-section" id="donate">
            <h2>Support the theatre</h2>
            <p>Your support helps us create new work and welcome more people into the theatre.</p>
            <Link className="btn btn-black" to="/visit#contact">Get in touch</Link>
          </section>
        </article>
      </div>
    </PageLayout>
  );
}
