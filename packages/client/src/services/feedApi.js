const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const feedApi = {
  async getPublicFeed({ page = 1, limit = 10 } = {}) {
    const response = await fetch(
      `${BASE_URL}/api/feed/public?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || `Server error: ${response.status}`);
    }

    return response.json();
  },
};
