import { Image, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
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

          <View className="relative mt-5 mx-14">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora!</Text>
            </Text>

            <Image
              source={images.path}
              className="absolute w-[94px] h-[15px] -bottom-3.5 -right-5"
              resizeMode={"contain"}
            />
          </View>

          <Text className="font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark On a Journey of Limitless
            Possiblities with Aora
          </Text>

          <CustomButton
            title={"Continue with Email"}
            handlePress={() => router.push("/sign-in")}
            containerStyles={"w-full mt-10"}
          />
        </View>
      </ScrollView>

      <StatusBar style={"light"} backgroundColor={"#161622"} />
    </SafeAreaView>
  );
};

export default Home;
