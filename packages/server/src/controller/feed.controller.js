import feedService from '../services/feed.service.js';

export const getPublicFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const streams = await feedService.getPopularFeed({ page, limit });
    res.json({ streams, page, limit });
  } catch (err) {
    console.error('[Feed] getPublicFeed error:', err);
    res.status(500).json({ message: 'Failed to fetch feed' });
  }
};

export const getLiveFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const liveStreams = await feedService.fetchActiveStreams(userId);

    res.status(200).json(liveStreams);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};
