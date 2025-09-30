import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { get } from "../../utils/restful";

interface AnimeDetail {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  status: string;
  episodes: number;
  duration: string;
  rating: string;
  source: string;
  studios: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  themes: Array<{ name: string }>;
  demographics: Array<{ name: string }>;
  aired: {
    from: string;
    to: string;
    string: string;
  };
  season: string;
  year: number;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
}

export default function AnimeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnimeDetail();
    }
  }, [id]);

  const fetchAnimeDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await get<{ data: AnimeDetail }>(
        `https://api.jikan.moe/v4/anime/${id}`
      );
      setAnime(data.data);
    } catch (err) {
      setError("Failed to load anime details");
      console.error("Error fetching anime detail:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error || !anime) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error" size={48} color="#f44336" />
        <Text style={styles.errorText}>{error || "Anime not found"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAnimeDetail}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "Currently Airing":
        return "مستمر";
      case "Finished Airing":
        return "مكتمل";
      case "Not yet aired":
        return "لم يعرض بعد";
      default:
        return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {anime.title}
        </Text>
      </View>

      {/* Hero Image */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: anime.images.jpg.large_image_url }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.title}>{anime.title}</Text>
          {anime.title_english && (
            <Text style={styles.englishTitle}>{anime.title_english}</Text>
          )}
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFA500" />
            <Text style={styles.score}>{anime.score || "N/A"}</Text>
            <Text style={styles.scoredBy}>
              ({anime.scored_by?.toLocaleString()} votes)
            </Text>
          </View>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{formatStatus(anime.status)}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Episodes</Text>
            <Text style={styles.infoValue}>{anime.episodes || "Unknown"}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{anime.duration || "Unknown"}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Rating</Text>
            <Text style={styles.infoValue}>{anime.rating || "Unknown"}</Text>
          </View>
        </View>
      </View>

      {/* Synopsis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Synopsis</Text>
        <Text style={styles.synopsis}>
          {anime.synopsis || "No synopsis available."}
        </Text>
      </View>

      {/* Genres */}
      {anime.genres && anime.genres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.genreContainer}>
            {anime.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Studios */}
      {anime.studios && anime.studios.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Studios</Text>
          <Text style={styles.studioText}>
            {anime.studios.map((studio) => studio.name).join(", ")}
          </Text>
        </View>
      )}

      {/* Additional Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoText}>
            <Text style={styles.bold}>Rank:</Text> #{anime.rank || "N/A"}
          </Text>
          <Text style={styles.additionalInfoText}>
            <Text style={styles.bold}>Popularity:</Text> #
            {anime.popularity || "N/A"}
          </Text>
          <Text style={styles.additionalInfoText}>
            <Text style={styles.bold}>Members:</Text>{" "}
            {anime.members?.toLocaleString() || "N/A"}
          </Text>
          <Text style={styles.additionalInfoText}>
            <Text style={styles.bold}>Favorites:</Text>{" "}
            {anime.favorites?.toLocaleString() || "N/A"}
          </Text>
          {anime.aired && (
            <Text style={styles.additionalInfoText}>
              <Text style={styles.bold}>Aired:</Text>{" "}
              {anime.aired.string || "Unknown"}
            </Text>
          )}
          {anime.source && (
            <Text style={styles.additionalInfoText}>
              <Text style={styles.bold}>Source:</Text> {anime.source}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  heroSection: {
    height: 300,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  englishTitle: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 4,
  },
  scoredBy: {
    fontSize: 14,
    color: "#e0e0e0",
    marginLeft: 8,
  },
  infoSection: {
    padding: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreTag: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  studioText: {
    fontSize: 14,
    color: "#444",
  },
  additionalInfo: {
    gap: 8,
  },
  additionalInfoText: {
    fontSize: 14,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 20,
  },
});
