import TabIcon from "@/components/TabIcon";
import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import "react-native-reanimated";
// import { Image } from "react-native-reanimated/lib/typescript/Animated";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    // <SafeAreaView>
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
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }) => (
            // <MaterialIcons name="home" size={24} color={color} />
            <TabIcon icon={icons.home} title={"Home"} focused={focused} />
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
    // </SafeAreaView>
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
