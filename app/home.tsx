import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import AnimeCard from "../components/AnimeCard";
import { get } from "../utils/rest";

export default function Home() {
  const router = useRouter();
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <FlatList
      data={animeList}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.list}
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
});
