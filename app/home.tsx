import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { get } from "../utils/rest";

export default function Home() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

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

  const handleMenuPress = () => {
    setSideMenuVisible(true);
  };

  const handleMenuClose = () => {
    setSideMenuVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header onMenuPress={handleMenuPress} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
        <SideMenu isVisible={sideMenuVisible} onClose={handleMenuClose} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onMenuPress={handleMenuPress} />
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
            onPress={() => {}}
          />
        )}
      />
      <SideMenu isVisible={sideMenuVisible} onClose={handleMenuClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
