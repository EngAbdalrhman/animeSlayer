import SearchBar from "@/components/SearchBar";
import TabIcon from "@/components/TabIcon";
import { icons } from "@/constants/icons";
import { useSearch } from "@/contexts/SearchContext";
import { Tabs } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import "react-native-reanimated";

export default function Layout() {
  const { searchQuery, setSearchQuery, showSearch, setShowSearch } =
    useSearch();

  const handleSearchToggle = () => {
    setShowSearch(true);
  };

  const handleSearchBlur = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (text: string) => {
    setSearchQuery(text);
    setShowSearch(false);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItems,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} title={"Home"} focused={focused} />
          ),
          headerRight: () =>
            showSearch ? (
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onBlur={handleSearchBlur}
                onSubmit={handleSearchSubmit}
              />
            ) : (
              <TouchableOpacity onPress={handleSearchToggle}>
                <Image
                  source={icons.search}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.person} title={"Profile"} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.save} title={"Saved"} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItems: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  tabBar: {
    backgroundColor: "#0f0d23",
  },
});
