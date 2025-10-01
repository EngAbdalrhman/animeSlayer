import { images } from "@/constants/images";
import { Link } from "expo-router";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

let MaskedView: any = null;
if (Platform.OS !== "web") {
  MaskedView = require("@react-native-masked-view/masked-view").default;
}

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  return (
    <Link href={`./movie/${movie_id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-5">
        <Image
          source={{ uri: poster_url }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
          {Platform.OS !== "web" && MaskedView ? (
            <MaskedView
              maskElement={
                <Text className="font-bold text-white text-6xl">
                  {index + 1}
                </Text>
              }
            >
              <Image
                source={images.rankingGradient}
                className="size-14"
                resizeMode="cover"
              />
            </MaskedView>
          ) : (
            <Text className="font-bold text-white text-4xl">{index + 1}</Text>
          )}
        </View>

        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
