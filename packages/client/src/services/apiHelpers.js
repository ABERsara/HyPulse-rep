export async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Server error: ${response.status}`);
  }
  return response.json();
}
