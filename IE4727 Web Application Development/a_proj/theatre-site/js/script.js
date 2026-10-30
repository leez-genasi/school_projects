const api = async path => {
  const response = await fetch(path);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not load theatre data.');
  return data;
};

const dateKey = date => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
const monthKey = date => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
const formatDate = (value, year = false) => value ? new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'long', ...(year ? { year: 'numeric' } : {}) }).format(new Date(value + 'T12:00:00')) : 'Dates to be announced';
const formatTime = value => {
  const [hour, minute] = value.split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' });
};
const dateRange = show => show.season_start ? formatDate(show.season_start) + ' – ' + formatDate(show.season_end, true) : 'Dates to be announced';
const cartStorageKey = 'theatreCart';
const ticketTypes = [
  { name: 'Diamond with Pre-Show Lounge Access', price: 240 },
  { name: 'Sparkling VIP', price: 200 },
  { name: 'A Reserve', price: 180 },
  { name: 'B Reserve', price: 150 },
  { name: 'C Reserve', price: 120 },
  { name: 'D Reserve', price: 90 },
  { name: 'Grand Circle Box (4 seats)', price: 600, unit: 'box' }
];

function readCart() {
  try {
    const items = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(cartStorageKey, JSON.stringify(items));
  updateCartCount();
  renderCartPopup();
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount);
}

function updateCartCount() {
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.navbar .nav-link[href="cart.html"]').forEach(link => {
    let badge = link.querySelector('.cart-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count';
      link.append(badge);
    }
    badge.textContent = count ? ' (' + count + ')' : '';
  });
  const popupCount = document.querySelector('#purchaseCartCount');
  if (popupCount) popupCount.textContent = count ? '(' + count + ')' : '';
}

function addToCart(performance, ticket) {
  const items = readCart();
  const existing = items.find(item => item.performanceId === performance.id && item.ticketType === ticket.name);
  if (existing) existing.quantity += 1;
  else items.push({
    performanceId: performance.id,
    showId: performance.show_id,
    title: performance.title,
    date: performance.date,
    time: performance.time,
    venue: performance.venue,
    ticketType: ticket.name,
    unit: ticket.unit || 'ticket',
    price: ticket.price,
    quantity: 1
  });
  saveCart(items);
}

function renderCartPopup() {
  const list = document.querySelector('#cartModalItems');
  if (!list) return;
  const empty = document.querySelector('#cartModalEmpty');
  const totalLabel = document.querySelector('#cartModalTotal');
  const clearButton = document.querySelector('#clearCart');
  const items = readCart();
  list.replaceChildren();
  empty.hidden = items.length > 0;
  clearButton.hidden = items.length === 0;
  let total = 0;

  items.forEach((item, index) => {
    const row = document.createElement('article');
    row.className = 'cart-item';
    const details = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = item.title;
    const date = document.createElement('p');
    date.textContent = formatDate(item.date, true) + ' · ' + formatTime(item.time);
    const ticket = document.createElement('p');
    ticket.textContent = item.ticketType + ' · ' + formatMoney(item.price) + (item.unit === 'box' ? ' per box' : ' each');
    details.append(title, date, ticket);

    const controls = document.createElement('div');
    controls.className = 'cart-controls';
    const quantity = document.createElement('span');
    quantity.textContent = item.quantity + ' ×';
    const subtotal = document.createElement('strong');
    subtotal.textContent = formatMoney(item.price * item.quantity);
    total += item.price * item.quantity;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn outline';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      const updated = readCart();
      updated.splice(index, 1);
      saveCart(updated);
    });
    controls.append(quantity, subtotal, remove);
    row.append(details, controls);
    list.append(row);
  });

  totalLabel.textContent = formatMoney(total);
}

updateCartCount();

function showTimes(show) {
  const byDay = new Map();
  show.performances.forEach(item => {
    const day = new Date(item.date + 'T12:00:00').getDay();
    if (!byDay.has(day)) byDay.set(day, new Set());
    byDay.get(day).add(item.time);
  });
  return [...byDay].sort((a, b) => a[0] - b[0]).map(([day, times]) => {
    const dayName = new Intl.DateTimeFormat('en-SG', { weekday: 'long' }).format(new Date(2026, 0, 4 + day));
    return dayName + ' at ' + [...times].sort().map(formatTime).join(' and ');
  }).join('; ') || 'Performance times to be announced';
}

let activeShow = null;

function fillShowModal(show) {
  activeShow = show;
  const moreButton = document.querySelector('#moreShowDetails');
  if (moreButton) moreButton.disabled = false;
  document.querySelector('#modalGenre').textContent = show.genre;
  document.querySelector('#modalTitle').textContent = show.title;
  document.querySelector('#modalFactGenre').textContent = show.genre;
  document.querySelector('#modalTagline').textContent = show.tagline;
  document.querySelector('#modalDescription').textContent = show.description;
  document.querySelector('#modalDates').textContent = dateRange(show);
  document.querySelector('#modalRuntime').textContent = show.runtime;
  document.querySelector('#modalShowtimes').textContent = showTimes(show);
  document.querySelector('#modalVenue').textContent = show.venue;
  document.querySelector('#modalBookNow').href = 'calendar.html?show=' + encodeURIComponent(show.id);
  document.querySelector('#modalCalendar').href = 'calendar.html?show=' + encodeURIComponent(show.id);
  document.querySelector('#modalCalendarFooter').href = 'calendar.html?show=' + encodeURIComponent(show.id);
  document.querySelector('#modalCheckout').href = 'cart.html?show=' + encodeURIComponent(show.id);
}

function fillFullDetails(show) {
  document.querySelector('#detailsTitle').textContent = show.title;
  document.querySelector('#detailsGenre').textContent = show.genre;
  document.querySelector('#detailsFactGenre').textContent = show.genre;
  document.querySelector('#detailsDates').textContent = dateRange(show);
  document.querySelector('#detailsVenue').textContent = show.venue;
  document.querySelector('#detailsTagline').textContent = show.tagline;
  document.querySelector('#detailsDescription').textContent = show.description;
  document.querySelector('#detailsRuntime').textContent = show.runtime;
  document.querySelector('#detailsTimes').textContent = showTimes(show);
  document.querySelector('#detailsVenueFull').textContent = show.venue;
  const prices = document.querySelector('#detailsPrices');
  prices.replaceChildren(...ticketTypes.map(ticket => {
    const row = document.createElement('li');
    const name = document.createElement('span');
    const amount = document.createElement('strong');
    name.textContent = ticket.name;
    amount.textContent = formatMoney(ticket.price) + (ticket.unit === 'box' ? ' per box' : '');
    row.append(name, amount);
    return row;
  }));
  document.querySelector('#detailsBook').href = 'calendar.html?show=' + encodeURIComponent(show.id);
  document.querySelector('#detailsCalendar').href = 'calendar.html?show=' + encodeURIComponent(show.id);
}

async function openFullDetails(showId, showData) {
  const modalElement = document.querySelector('#fullDetailsModal');
  if (!modalElement) {
    location.href = 'show.html?show=' + encodeURIComponent(showId);
    return;
  }
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
  document.querySelector('#detailsTitle').textContent = 'Loading show details…';
  try {
    fillFullDetails(showData || await api('/api/shows/' + encodeURIComponent(showId)));
  } catch (error) {
    document.querySelector('#detailsTitle').textContent = 'Show details unavailable';
    document.querySelector('#detailsDescription').textContent = error.message + ' Start the site with npm start.';
  }
}

document.addEventListener('click', async event => {
  const button = event.target.closest?.('.poster-trigger');
  if (!button) return;
  const id = button.dataset.showId;
  const modalElement = document.querySelector('#showModal');
  if (!modalElement) return;
  activeShow = null;
  const moreButton = document.querySelector('#moreShowDetails');
  if (moreButton) moreButton.disabled = true;
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
  document.querySelector('#modalTitle').textContent = 'Loading show details…';
  try {
    // Each button sends its show ID; the server reads that show from MySQL.
    fillShowModal(await api('/api/shows/' + encodeURIComponent(id)));
  } catch (error) {
    document.querySelector('#modalTitle').textContent = 'Show details unavailable';
    document.querySelector('#modalDescription').textContent = error.message + ' Start the site with npm start.';
  }
});

const moreShowDetails = document.querySelector('#moreShowDetails');
if (moreShowDetails) moreShowDetails.addEventListener('click', async () => {
  if (!activeShow) return;
  const show = activeShow;
  const modalElement = document.querySelector('#showModal');
  const hidden = new Promise(resolve => modalElement.addEventListener('hidden.bs.modal', resolve, { once: true }));
  bootstrap.Modal.getOrCreateInstance(modalElement).hide();
  await hidden;
  openFullDetails(show.id, show);
});

const posterGrid = document.querySelector('#showPosterGrid');
if (posterGrid) api('/api/artwork').then(items => {
  posterGrid.textContent = '';
  const featuredTitles = ['Moulin Rouge', 'Hamilton', 'Hadestown', 'Six'];
  const posters = items.filter(item => item.image_type === 'poster');
  featuredTitles.forEach(titleText => {
    const poster = posters.find(item => item.title === titleText);
    if (!poster) return;

    const card = document.createElement('article');
    card.className = 'show-card poster-card';
    const content = poster.show_id ? document.createElement('button') : document.createElement('div');
    content.className = 'poster-link';
    if (poster.show_id) {
      content.type = 'button';
      content.classList.add('poster-trigger');
      content.dataset.showId = poster.show_id;
    } else content.classList.add('poster-display');
    const art = document.createElement('div');
    art.className = 'show-art';
    const image = document.createElement('img');
    image.src = poster.image_path;
    image.loading = 'lazy';
    art.append(image);
    content.append(art);

    const details = document.createElement('div');
    details.className = 'poster-info';
    const title = document.createElement('h3');
    title.textContent = poster.title;
    details.append(title);
    content.append(details);
    card.append(content);
    posterGrid.append(card);
  });
}).catch(error => {
  console.error('Show list could not load:', error);
});

const showTitle = document.querySelector('#showTitle');
if (showTitle) {
  const id = new URLSearchParams(location.search).get('show') || 'moulin-rouge';
  api('/api/shows/' + encodeURIComponent(id)).then(show => {
    document.title = show.title + ' | Theatre';
    document.querySelector('#showGenre').textContent = show.genre;
    showTitle.textContent = show.title;
    document.querySelector('#showTagline').textContent = show.tagline;
    document.querySelector('#showDescription').textContent = show.description;
    document.querySelector('#showRuntime').textContent = 'Run time: ' + show.runtime;
    document.querySelector('#showDates').textContent = dateRange(show);
    document.querySelector('#showCalendar').href = 'calendar.html?show=' + encodeURIComponent(id);
    document.querySelector('#showCheckout').href = 'cart.html?show=' + encodeURIComponent(id);
  }).catch(error => { showTitle.textContent = 'Show details unavailable'; console.error(error); });
}

const calendarGrid = document.querySelector('#calendarGrid');
if (calendarGrid) {
  const monthLabel = document.querySelector('#monthName');
  const dateLabel = document.querySelector('#selectedDate');
  const info = document.querySelector('#showInfo');
  const params = new URLSearchParams(location.search);
  const requestedDate = params.get('date');
  const activeShowId = params.get('show');
  let selected = requestedDate ? new Date(requestedDate + 'T12:00:00') : new Date();
  let month = new Date(selected.getFullYear(), selected.getMonth(), 1);
  let monthPerformances = [];

  function showPerformance(item) {
    if (item.poster_image) {
      document.body.style.setProperty('--show-poster-background', 'url("' + item.poster_image + '")');
      document.body.classList.add('show-selected');
    } else {
      document.body.style.removeProperty('--show-poster-background');
      document.body.classList.remove('show-selected');
    }
    const card = document.createElement('article');
    card.className = 'date-card';
    if (item.poster_image) {
      card.classList.add('has-poster');
      const art = document.createElement('div');
      art.className = 'date-art show-art';
      const image = document.createElement('img');
      image.src = item.poster_image;
      image.loading = 'lazy';
      art.append(image);
      card.append(art);
    }

    const copy = document.createElement('div');
    copy.className = 'show-copy';
    const genre = document.createElement('p');
    genre.className = 'eyebrow';
    genre.textContent = item.genre + ' · ' + formatTime(item.time);
    const title = document.createElement('h3');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = item.description;
    const runtime = document.createElement('p');
    runtime.className = 'small text-secondary';
    runtime.textContent = 'Run time: ' + item.runtime + ' · ' + item.venue;
    const actions = document.createElement('div');
    actions.className = 'button-row';
    const details = document.createElement('button');
    details.type = 'button';
    details.className = 'btn outline';
    details.textContent = 'More details';
    details.addEventListener('click', () => openFullDetails(item.show_id));
    const checkout = document.createElement('a');
    checkout.className = 'btn btn-black';
    checkout.href = 'cart.html?performance=' + item.id;
    checkout.textContent = 'Book now';
    actions.append(details, checkout);
    copy.append(genre, title, description, runtime, actions);
    card.append(copy);
    return card;
  }

  function updateSelectedDate() {
    dateLabel.textContent = new Intl.DateTimeFormat('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(selected);
    info.replaceChildren();
    const list = monthPerformances.filter(item => item.date === dateKey(selected) && (!activeShowId || item.show_id === activeShowId));
    if (!list.length) {
      document.body.style.removeProperty('--show-poster-background');
      document.body.classList.remove('show-selected');
      const message = document.createElement('div');
      message.className = 'calendar-empty';
      message.textContent = 'No performance is scheduled on this date. Choose a marked date to see its shows.';
      info.append(message);
      return;
    }

    if (list.length > 1) {
      const tabs = document.createElement('div');
      tabs.className = 'time-tabs';
      list.forEach((item, index) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'time-tab' + (index === 0 ? ' active' : '');
        tab.tabIndex = index === 0 ? 0 : -1;
        const time = document.createElement('strong');
        time.textContent = formatTime(item.time);
        const show = document.createElement('small');
        show.textContent = item.title;
        tab.append(time, show);
        tab.addEventListener('click', () => {
          tabs.querySelectorAll('.time-tab').forEach((button, tabIndex) => {
            const active = tabIndex === index;
            button.classList.toggle('active', active);
            button.tabIndex = active ? 0 : -1;
          });
          const panel = showPerformance(item);
          info.querySelector('.date-card').replaceWith(panel);
        });
        tabs.append(tab);
      });
      info.append(tabs);
    }
    const panel = showPerformance(list[0]);
    if (list.length > 1) {
    }
    info.append(panel);
  }

  function renderCalendar() {
    const year = month.getFullYear(), monthIndex = month.getMonth();
    const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const dayCount = new Date(year, monthIndex + 1, 0).getDate();
    monthLabel.textContent = new Intl.DateTimeFormat('en-SG', { month: 'long', year: 'numeric' }).format(month);
    calendarGrid.replaceChildren();
    for (let i = 0; i < offset; i++) calendarGrid.append(document.createElement('span'));
    for (let day = 1; day <= dayCount; day++) {
      const date = new Date(year, monthIndex, day);
      const key = dateKey(date);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = day;
      const dayShows = monthPerformances.filter(item => item.date === key && (!activeShowId || item.show_id === activeShowId));
      const isSelected = key === dateKey(selected);
      button.className = dayShows.length ? (isSelected ? 'selected-show' : 'has-show') : (isSelected ? 'selected' : 'day');
      button.addEventListener('click', () => {
        selected = date;
        renderCalendar();
      });
      calendarGrid.append(button);
    }
    updateSelectedDate();
  }

  async function loadMonth() {
    monthLabel.textContent = 'Loading…';
    calendarGrid.replaceChildren();
    try {
      monthPerformances = await api('/api/performances?month=' + monthKey(month));
      renderCalendar();
    } catch (error) {
      monthLabel.textContent = 'Calendar unavailable';
      const message = document.createElement('p');
      message.className = 'text-danger';
      message.textContent = error.message + ' Start the site with npm start.';
      calendarGrid.append(message);
    }
  }

  async function chooseInitialDate() {
    if (!requestedDate) {
      try {
        const today = dateKey(new Date());
        const path = params.get('show')
          ? '/api/performances?show_id=' + encodeURIComponent(params.get('show')) + '&from=' + today
          : '/api/performances?from=' + today;
        const upcoming = await api(path);
        if (upcoming.length) selected = new Date(upcoming[0].date + 'T12:00:00');
      } catch (error) { console.error('Could not find an upcoming performance:', error); }
    }
    month = new Date(selected.getFullYear(), selected.getMonth(), 1);
    loadMonth();
  }

  document.querySelector('#prevMonth').addEventListener('click', () => {
    month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    selected = new Date(month.getFullYear(), month.getMonth(), 1);
    loadMonth();
  });
  document.querySelector('#nextMonth').addEventListener('click', () => {
    month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    selected = new Date(month.getFullYear(), month.getMonth(), 1);
    loadMonth();
  });
  chooseInitialDate();
}

const purchaseCalendar = document.querySelector('#purchaseCalendarGrid');
if (purchaseCalendar) {
  const monthLabel = document.querySelector('#purchaseMonthName');
  const dateLabel = document.querySelector('#purchaseSelectedDate');
  const showHeading = document.querySelector('#purchaseShowTitle');
  const showInfo = document.querySelector('#purchaseShowInfo');
  const showSelector = document.querySelector('#purchaseShowSelector');
  const params = new URLSearchParams(location.search);
  const requestedDate = params.get('date');
  const performanceId = params.get('performance');
  let activeShowId = params.get('show') || 'moulin-rouge';
  let selectedPerformanceId = performanceId;
  let selected = requestedDate ? new Date(requestedDate + 'T12:00:00') : new Date();
  let month = new Date(selected.getFullYear(), selected.getMonth(), 1);
  let performances = [];
  let shows = [];

  function setPosterBackground(item) {
    if (item && item.poster_image) {
      document.body.style.setProperty('--show-poster-background', 'url("' + item.poster_image + '")');
      document.body.classList.add('show-selected');
    } else {
      document.body.style.removeProperty('--show-poster-background');
      document.body.classList.remove('show-selected');
    }
  }

  function makeTicketPanel(item) {
    setPosterBackground(item);
    const panel = document.createElement('section');
    panel.className = 'ticket';

    const performance = document.createElement('p');
    performance.className = 'performance';
    performance.textContent = formatDate(item.date, true) + ' · ' + formatTime(item.time) + ' · ' + item.venue;

    const note = document.createElement('p');
    note.className = 'small note';
    note.textContent = 'Example ticket prices. Add a ticket to save it in your cart.';

    const options = document.createElement('div');
    options.className = 'ticket-list';
    ticketTypes.forEach(ticket => {
      const row = document.createElement('div');
      row.className = 'ticket-option';
      const details = document.createElement('div');
      details.className = 'option-details';
      const name = document.createElement('strong');
      name.textContent = ticket.name;
      const price = document.createElement('span');
      price.textContent = formatMoney(ticket.price) + (ticket.unit === 'box' ? ' per box' : ' each');
      details.append(name, price);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn outline';
      button.textContent = 'Add to Cart';
      button.addEventListener('click', () => {
        addToCart(item, ticket);
        button.textContent = 'Added';
        button.className = 'btn added';
        window.setTimeout(() => {
          button.textContent = 'Add to Cart';
          button.className = 'btn outline';
        }, 1000);
      });
      row.append(details, button);
      options.append(row);
    });
    panel.append(performance, note, options);
    return panel;
  }

  function updateSelectedDate() {
    const show = shows.find(item => item.id === activeShowId);
    showHeading.textContent = show ? show.title : 'Choose a show';
    dateLabel.textContent = new Intl.DateTimeFormat('en-SG', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(selected);
    showInfo.replaceChildren();

    const today = dateKey(new Date());
    const dayPerformances = performances.filter(item =>
      item.date === dateKey(selected) && item.date >= today && item.show_id === activeShowId
    );
    if (!dayPerformances.length) {
      setPosterBackground(null);
      const message = document.createElement('div');
      message.className = 'calendar-empty';
      message.textContent = 'No performance for this show on this date. Choose a marked date or another show.';
      showInfo.append(message);
      return;
    }

    const activeItem = dayPerformances.find(item => String(item.id) === String(selectedPerformanceId)) || dayPerformances[0];
    selectedPerformanceId = String(activeItem.id);

    if (dayPerformances.length > 1) {
      const tabs = document.createElement('div');
      tabs.className = 'time-tabs';
      dayPerformances.forEach(item => {
        const tab = document.createElement('button');
        const active = String(item.id) === String(activeItem.id);
        tab.type = 'button';
        tab.className = 'time-tab' + (active ? ' active' : '');
        tab.tabIndex = active ? 0 : -1;
        tab.textContent = formatTime(item.time);
        tab.addEventListener('click', () => {
          selectedPerformanceId = String(item.id);
          tabs.querySelectorAll('.time-tab').forEach(button => {
            const isActive = button === tab;
            button.classList.toggle('active', isActive);
            button.tabIndex = isActive ? 0 : -1;
          });
          showInfo.querySelector('.ticket').replaceWith(makeTicketPanel(item));
        });
        tabs.append(tab);
      });
      showInfo.append(tabs);
    }
    showInfo.append(makeTicketPanel(activeItem));
  }

  function renderCalendar() {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const dayCount = new Date(year, monthIndex + 1, 0).getDate();
    monthLabel.textContent = new Intl.DateTimeFormat('en-SG', { month: 'long', year: 'numeric' }).format(month);
    purchaseCalendar.replaceChildren();

    for (let i = 0; i < offset; i++) purchaseCalendar.append(document.createElement('span'));
    for (let day = 1; day <= dayCount; day++) {
      const date = new Date(year, monthIndex, day);
      const key = dateKey(date);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = day;
      const dayShows = performances.filter(item =>
        item.date === key && item.date >= dateKey(new Date()) && item.show_id === activeShowId
      );
      const isSelected = key === dateKey(selected);
      button.className = dayShows.length ? (isSelected ? 'selected-show' : 'has-show') : (isSelected ? 'selected' : 'day');
      button.addEventListener('click', () => {
        selected = date;
        selectedPerformanceId = null;
        renderCalendar();
      });
      purchaseCalendar.append(button);
    }
    updateSelectedDate();
  }

  async function loadMonth() {
    monthLabel.textContent = 'Loading…';
    purchaseCalendar.replaceChildren();
    try {
      performances = await api('/api/performances?month=' + monthKey(month));
      renderCalendar();
    } catch (error) {
      monthLabel.textContent = 'Calendar unavailable';
      const message = document.createElement('p');
      message.className = 'text-danger';
      message.textContent = error.message + ' Start the site with npm start.';
      purchaseCalendar.append(message);
    }
  }

  function renderShowSelector() {
    showSelector.replaceChildren();
    const order = ['moulin-rouge', 'glass-room', 'after-the-rain', 'last-encore', 'les-miserables', 'pagliacci', 'idol-of-my-dreams', 'gatekeepers-lament', 'beetlejuice', 'romeo-and-juliet'];
    shows.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    shows.forEach(show => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'show-button' + (show.id === activeShowId ? ' active' : '');
      const title = document.createElement('strong');
      title.textContent = show.title;
      const genre = document.createElement('p');
      genre.className = 'mb-0 mt-2';
      genre.textContent = show.genre + ' · Choose dates';
      button.append(title, genre);
      button.addEventListener('click', async () => {
        activeShowId = show.id;
        selectedPerformanceId = null;
        renderShowSelector();
        try {
          const upcoming = await api('/api/performances?show_id=' + encodeURIComponent(show.id) + '&from=' + dateKey(new Date()));
          if (upcoming.length) selected = new Date(upcoming[0].date + 'T12:00:00');
          month = new Date(selected.getFullYear(), selected.getMonth(), 1);
          loadMonth();
        } catch (error) {
          showInfo.textContent = error.message;
        }
      });
      showSelector.append(button);
    });
  }

  async function initializePurchasePage() {
    try {
      shows = await api('/api/shows');
      if (performanceId) {
        const performance = await api('/api/performances/' + encodeURIComponent(performanceId));
        activeShowId = performance.show_id;
        selected = new Date(performance.date + 'T12:00:00');
      } else if (!shows.some(show => show.id === activeShowId) && shows.length) {
        activeShowId = shows[0].id;
      }

      if (!requestedDate && !performanceId && activeShowId) {
        const upcoming = await api('/api/performances?show_id=' + encodeURIComponent(activeShowId) + '&from=' + dateKey(new Date()));
        if (upcoming.length) selected = new Date(upcoming[0].date + 'T12:00:00');
      }

      month = new Date(selected.getFullYear(), selected.getMonth(), 1);
      showHeading.textContent = shows.find(show => show.id === activeShowId)?.title || 'Choose a show';
      renderShowSelector();
      renderCartPopup();
      loadMonth();
    } catch (error) {
      monthLabel.textContent = 'Shows unavailable';
      showInfo.textContent = error.message + ' Start the site with npm start.';
    }
  }

  document.querySelector('#purchasePrevMonth').addEventListener('click', () => {
    month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    selected = new Date(month.getFullYear(), month.getMonth(), 1);
    selectedPerformanceId = null;
    loadMonth();
  });
  document.querySelector('#purchaseNextMonth').addEventListener('click', () => {
    month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    selected = new Date(month.getFullYear(), month.getMonth(), 1);
    selectedPerformanceId = null;
    loadMonth();
  });
  document.querySelector('#clearCart').addEventListener('click', () => saveCart([]));
  initializePurchasePage();
}

const form = document.querySelector('.contact-form');
if (form) form.addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#formMessage');
  const button = form.querySelector('button[type="submit"]');
  status.textContent = 'Sending...';
  button.disabled = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not send your message.');
    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.textContent = error.message || 'Could not reach the server. Please try again.';
  } finally {
    button.disabled = false;
  }
});

const visitNavLinks = [...document.querySelectorAll('.navbar .nav-link[href^="#"]')];
if (visitNavLinks.length) {
  const visitSections = visitNavLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function setActiveVisitLink(hash) {
    visitNavLinks.forEach(link => {
      const active = link.getAttribute('href') === hash;
      link.classList.toggle('active', active);
    });
  }

  function updateActiveVisitLink() {
    const line = window.innerHeight * 0.35;
    const current = visitSections.filter(section => section.getBoundingClientRect().top <= line).at(-1);
    if (current) setActiveVisitLink('#' + current.id);
  }

  visitNavLinks.forEach(link => link.addEventListener('click', () => setActiveVisitLink(link.getAttribute('href'))));
  window.addEventListener('scroll', updateActiveVisitLink, { passive: true });
  window.addEventListener('hashchange', updateActiveVisitLink);
  updateActiveVisitLink();
}

const curtainPage = document.querySelector('.curtain-page');
if (curtainPage) {
  const curtainScreen = curtainPage.querySelector('.curtain-screen');
  const openCurtain = () => {
    const left = curtainScreen.querySelector('.curtain-left');
    const right = curtainScreen.querySelector('.curtain-right');
    if (typeof left.animate === 'function' && typeof right.animate === 'function') {
      const settings = { duration: 1200, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' };
      const leftMove = left.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-102%)' }], settings);
      const rightMove = right.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(102%)' }], settings);
      Promise.all([leftMove.finished, rightMove.finished])
        .then(() => curtainScreen.remove())
        .catch(() => curtainScreen.remove());
      setTimeout(() => curtainScreen.remove(), 3000);
    } else {
      curtainPage.classList.add('curtain-open');
      setTimeout(() => curtainScreen.remove(), 3000);
    }
  };
  const startCurtain = () => requestAnimationFrame(() => requestAnimationFrame(openCurtain));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCurtain, { once: true });
  } else startCurtain();
}
