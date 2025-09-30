import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AnimeCardProps = {
  title: string;
  imageUrl: string;
  episodeInfo?: string;
  status: string;
  rating: number;
  onPress?: () => void;
};

const AnimeCard: React.FC<AnimeCardProps> = ({
  title,
  imageUrl,
  episodeInfo,
  status,
  rating,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text
          style={styles.episode}
          className="text-light-200"
          numberOfLines={1}
        >
          {episodeInfo}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.row}>
          <Text style={styles.status}>{status}</Text>
          <MaterialIcons
            name="star"
            size={16}
            color="#FFA500"
            style={{ marginHorizontal: 2 }}
          />
          <Text style={styles.rating}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "30%",
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 170,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#eee",
  },
  info: {
    padding: 8,
  },
  episode: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
    textAlign: "left",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    color: "#2196F3",
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    color: "#222",
    marginLeft: 2,
  },
});

export default AnimeCard;
