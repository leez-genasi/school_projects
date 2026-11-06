const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

async function request(path, options) {
  const response = await fetch(apiUrl(path), options);
  const body = await response.text();
  let data = {};

  if (body) {
    try {
      data = JSON.parse(body);
    } catch {
      throw new Error('The server returned an invalid response.');
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `The request failed (${response.status} ${response.statusText}).`);
  }

  return data;
}

export function getArtwork() {
  return request('/api/artwork').then((items) => {
    if (!Array.isArray(items)) {
      throw new Error('The server returned an invalid artwork list.');
    }
    return items;
  });
}

export function getShows() {
  return request('/api/shows');
}

export function getShow(showId) {
  return request(`/api/shows/${encodeURIComponent(showId)}`);
}

export function getPerformances(query) {
  return request(`/api/performances?${new URLSearchParams(query)}`);
}

export function getTicketTypes() {
  return request('/api/ticket-types');
}

export function getPerformance(performanceId) {
  return request(`/api/performances/${encodeURIComponent(performanceId)}`);
}

export function createOrder(order) {
  return request('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
}

export async function sendContactMessage(formData) {
  const payload = {
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
  };

  return request('/contactForm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
