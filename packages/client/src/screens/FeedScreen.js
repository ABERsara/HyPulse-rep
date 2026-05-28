import { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import StreamCard from '../components/StreamCard';
import EmptyFeed from '../components/EmptyFeed';
import { feedApi } from '../services/feedApi';

export default function FeedScreen() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async () => {
    try {
      const data = await feedApi.getPublicFeed();
      setStreams(data.streams ?? []);
    } catch (err) {
      console.error('[FeedScreen]', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const onRefresh = () => {
    setRefreshing(true);
    loadFeed();
  };

  if (loading) return <View />; // TODO: להחליף ב-LoadingSkeletonCard.

  return (
    <FlatList
      data={streams}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <StreamCard
          stream={item}
          onPress={() => {
            /* TODO T53: guardedAction */
          }}
        />
      )}
      ListEmptyComponent={<EmptyFeed />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 12, flexGrow: 1 }}
    />
  );
}
