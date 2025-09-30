import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
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

  useEffect(() => {
    get<any>("https://api.jikan.moe/v4/top/anime").then((data) => {
      // Map data to your card props
      setAnimeList(
        data.data.map((item: any) => ({
          id: String(item.mal_id),
          title: item.title,
          imageUrl: item.images.jpg.image_url,
          status: item.status === "Currently Airing" ? "مستمر" : "مكتمل",
          rating: item.score,
        }))
      );
      setLoading(false);
    });
  }, []);

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
    <FlatList
      data={filteredAnimeList}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.list}
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
    />
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
