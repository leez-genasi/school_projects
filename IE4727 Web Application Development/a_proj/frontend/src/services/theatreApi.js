async function request(path, options) {
  const response = await fetch(`${path}`, options);
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
  return request('http://localhost:3000/api/artwork').then((items) => {
    if (!Array.isArray(items)) {
      throw new Error('The server returned an invalid artwork list.');
    }
    return items;
  });
}

export function getShows() {
  return request('http://localhost:3000/api/shows');
}

export function getShow(showId) {
  return request(`http://localhost:3000/api/shows/${encodeURIComponent(showId)}`);
}

export function getPerformances(query) {
  return request(`http://localhost:3000/api/performances?${new URLSearchParams(query)}`);
}

export function getPerformance(performanceId) {
  // TODO: Implement GET /api/performances/:performanceId using the MySQL performances table.
  return request(`http://localhost:3000/api/performance/${encodeURIComponent(performanceId)}`);
}

export async function sendContactMessage(formData) {
  const payload = {
    name: formData.name,
    targetEmail: formData.email,
    body: formData.message
  }

  console.log(payload)

  try {
    const response = await fetch("http://localhost:3000/contactForm", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || "Failed to send message")
    }
    return result
  } catch (error) {
    console.error("Error: ", error)
    return result
  }
}
