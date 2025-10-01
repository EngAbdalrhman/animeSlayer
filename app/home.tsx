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
import { ContentType, useSearch } from "../contexts/SearchContext";
import { fetchMovies } from "../service/fetchMovies";
import { updateSearchCount } from "../utils/appwrite";
import { get } from "../utils/restful";
import MovieCard from "@/components/MovieCard";

export default function Home() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, activeTab, setActiveTab } = useSearch();

  // Anime state
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [animeLoading, setAnimeLoading] = useState(true);
  const [animeLoadingMore, setAnimeLoadingMore] = useState(false);
  const [animePage, setAnimePage] = useState(1);
  const [animeHasMore, setAnimeHasMore] = useState(true);

  // Movie state
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movieError, setMovieError] = useState<string | null>(null);

  // Load anime on initial mount
  useEffect(() => {
    setAnimeLoading(true);
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
      setAnimeHasMore(data.pagination?.has_next_page ?? false);
      setAnimeLoading(false);
    });
  }, []);

  // Load more anime data
  const loadMoreAnime = useCallback(() => {
    if (animeLoadingMore || animeLoading || !animeHasMore) return;
    setAnimeLoadingMore(true);
    get<any>(`https://api.jikan.moe/v4/top/anime?page=${animePage + 1}`).then(
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
        setAnimePage((prev) => prev + 1);
        setAnimeHasMore(data.pagination?.has_next_page ?? false);
        setAnimeLoadingMore(false);
      }
    );
  }, [animeLoadingMore, animeLoading, animeHasMore, animePage]);

  // Debounced movie search effect
  useEffect(() => {
    if (activeTab !== "movies") return;

    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setMovieLoading(true);
          setMovieError(null);
          const movies = await fetchMovies({ query: searchQuery });
          setMovieList(movies);

          // Update search count if there are results
          if (movies?.length > 0 && movies[0]) {
            await updateSearchCount(searchQuery, movies[0]);
          }
        } catch (err) {
          setMovieError(
            err instanceof Error ? err.message : "Failed to fetch movies"
          );
        } finally {
          setMovieLoading(false);
        }
      } else {
        // Load popular movies when no search query
        try {
          setMovieLoading(true);
          setMovieError(null);
          const movies = await fetchMovies({ query: "" });
          setMovieList(movies);
        } catch (err) {
          setMovieError(
            err instanceof Error ? err.message : "Failed to fetch movies"
          );
        } finally {
          setMovieLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

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

  // Handle tab change
  const handleTabChange = (tab: ContentType) => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
  };

  // Show loading for initial anime load
  if (animeLoading && animeList.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f5f5f5]">
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "anime" && styles.activeTab]}
          onPress={() => handleTabChange("anime")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "anime" && styles.activeTabText,
            ]}
          >
            Anime
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "movies" && styles.activeTab]}
          onPress={() => handleTabChange("movies")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "movies" && styles.activeTabText,
            ]}
          >
            Movies
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === "anime" ? (
        <FlatList
          data={filteredAnimeList}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            searchQuery && filteredAnimeList.length > 0 ? (
              <View style={styles.searchResultHeader}>
                <Text style={styles.searchResultText}>
                  Results for {searchQuery}
                </Text>
              </View>
            ) : null
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
          onEndReached={loadMoreAnime}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            animeLoadingMore ? (
              <View style={{ padding: 16 }}>
                <ActivityIndicator size="small" color="#2196F3" />
              </View>
            ) : null
          }
        />
      ) : (
        <FlatList
          data={movieList}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              {movieLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#2196F3" />
                </View>
              )}
              {movieError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Error: {movieError}</Text>
                </View>
              )}
              {!movieLoading &&
                !movieError &&
                searchQuery.trim() &&
                movieList.length > 0 && (
                  <View style={styles.searchResultHeader}>
                    <Text style={styles.searchResultText}>
                      Search Results for {searchQuery}
                    </Text>
                  </View>
                )}
            </>
          }
          ListEmptyComponent={
            !movieLoading && !movieError ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery.trim()
                    ? "No movies found"
                    : "Start typing to search for movies"}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <MovieCard {...item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2196F3",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  list: {
    padding: 8,
    backgroundColor: "#f5f5f5",
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
  searchResultHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  searchResultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#f44336",
    textAlign: "center",
  },
});
