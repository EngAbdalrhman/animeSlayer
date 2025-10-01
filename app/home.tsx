import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnimeCard from "../components/AnimeCard";
import { useSearch } from "../contexts/SearchContext";
import { get } from "../utils/restful";

export default function Home() {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Initial load
  useEffect(() => {
    setLoading(true);
    get<any>("https://api.jikan.moe/v4/top/anime").then((data) => {
      setAnimeList(
        data.data.map((item: any) => ({
          id: String(item.mal_id),
          title: item.title,
          imageUrl: item.images.jpg.image_url,
          status: item.status === "Currently Airing" ? "مستمر" : "مكتمل",
          rating: item.score,
        }))
      );
      setHasMore(data.pagination?.has_next_page ?? false);
      setLoading(false);
    });
  }, []);

  // Load more data
  const loadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore) return;
    setLoadingMore(true);
    get<any>(`https://api.jikan.moe/v4/top/anime?page=${page + 1}`).then(
      (data) => {
        setAnimeList((prev) => [
          ...prev,
          ...data.data.map((item: any) => ({
            id: String(item.mal_id),
            title: item.title,
            imageUrl: item.images.jpg.image_url,
            status: item.status === "Currently Airing" ? "مستمر" : "مكتمل",
            rating: item.score,
          })),
        ]);
        setPage((prev) => prev + 1);
        setHasMore(data.pagination?.has_next_page ?? false);
        setLoadingMore(false);
      }
    );
  }, [loadingMore, loading, hasMore, page]);

  // Filter anime list based on search query
  const filteredAnimeList = useMemo(() => {
    if (!searchQuery.trim()) {
      return animeList;
    }
    const query = searchQuery.toLowerCase();
    return animeList.filter((anime) =>
      anime.title.toLowerCase().includes(query)
    );
  }, [animeList, searchQuery]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-start items-center gap-4 mt-4">
        <TouchableOpacity>
          <Text className="text-l ml-3 p-3 text-center bg-gray-500 rounded-full">
            Anime List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-l p-3 text-center bg-gray-500 rounded-full">
            Movie List
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredAnimeList}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.emptyText}>
              {searchQuery && filteredAnimeList.length > 0
                ? `Results for "${searchQuery}"`
                : null}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No anime found for "${searchQuery}"`
                : "No anime available"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AnimeCard
            title={item.title}
            imageUrl={item.imageUrl}
            status={item.status}
            rating={item.rating}
            onPress={() => router.push(`/anime/${item.id}` as any)}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" color="#2196F3" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  list: {
    padding: 8,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
