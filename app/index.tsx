import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { images } from "../constants";

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar barStyle={"light-content"} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full flex items-center justify-center px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode={"contain"}
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode={"contain"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
