export async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }

  const body = await response.json().catch(() => ({}));
  throw new Error(body.message || `Error ${response.status}`);
}
