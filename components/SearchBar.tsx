import { icons } from "@/constants/icons";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const SearchBar: React.FC<{
  onBlur: () => void;
  onSubmit: (text: string) => void;
}> = ({ onBlur, onSubmit }) => {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <View className="flex-row items-center bg-[#1C1B2E] rounded-full h-10 w-72 px-4 border border-[#AB8BFF] shadow-lg mx-2">
      <Image
        source={icons.search}
        tintColor="#AB8BFF"
        className="w-5 h-5 mr-3"
        resizeMode="contain"
      />
      <TextInput
        autoFocus
        value={searchText}
        placeholder="ابحث عن أنمي..."
        placeholderTextColor="#A8B5DB"
        className="flex-1 text-white text-[13px] tracking-wide"
        onChangeText={setSearchText}
        onBlur={onBlur}
        onSubmitEditing={() => onSubmit(searchText)}
        returnKeyType="search"
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Text className="text-[#AB8BFF] text-sm ml-2">❌</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
