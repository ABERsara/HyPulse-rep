import { handleResponse } from './apiHelpers';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const feedApi = {
  async getPublicFeed({ page = 1, limit = 10 } = {}) {
    const response = await fetch(
      `${BASE_URL}/api/feed/public?page=${page}&limit=${limit}`
    );
    return handleResponse(response);
  },
};
