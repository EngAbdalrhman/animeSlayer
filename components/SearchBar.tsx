import { Image, TextInput, View } from "react-native";
import { useState } from "react";
import { icons } from "@/constants/icons";

const SearchBar: React.FC<{
  onBlur: () => void;
  onSubmit: (text: string) => void;
}> = ({ onBlur, onSubmit }) => {
  const [searchText, setSearchText] = useState("");

  return (
    <View className="flex-row items-center bg-dark-200 rounded-full h-10 w-64 px-3">
      <Image
        source={icons.search}
        tintColor="#AB8BFF"
        className="size-5 mr-2"
        resizeMode="contain"
      />
      <TextInput
        autoFocus
        value={searchText}
        placeholder="Search"
        placeholderTextColor="#A8B5DB"
        className="flex-1 text-white"
        onChangeText={setSearchText}
        onBlur={onBlur}
        onSubmitEditing={() => {
          onSubmit(searchText);
        }}
        returnKeyType="search"
      />
    </View>
  );
};

export default SearchBar;
