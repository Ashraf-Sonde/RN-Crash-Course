import { Image, Text, View } from "react-native";
import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className={"flex justify-center items-center px-4"}>
      <Image
        source={images.empty}
        resizeMode={"contain"}
        className={"w-[270px] h-[215px]"}
      />

      <Text className={" text-2xl text-white font-psemibold"}>{title}</Text>
      <Text className={"mt-1 text-gray-100 font-pmediump"}>{subtitle}</Text>

      <CustomButton
        title={"Create a video"}
        handlePress={() => router.push("/create")}
        containerStyles={"w-full my-5"}
      />
    </View>
  );
};

export default EmptyState;
