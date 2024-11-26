import { Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants";
import { useState } from "react";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [play, setPlay] = useState(false);

  return (
    <View className={"flex flex-col items-center px-4 mb-14"}>
      <View className={"flex flex-row gap-3 items-start"}>
        <View className={"flex flex-row flex-1 justify-center items-center"}>
          <View
            className={
              "w-[46px] h-[46px] border rounded-lg border-secondary flex justify-center items-center p-0.5"
            }
          >
            <Image
              source={{ uri: avatar }}
              className={"w-full h-full rounded-lg"}
              resizeMode={"cover"}
            />
          </View>

          <View className={"flex flex-1 justify-center ml-3 gap-y-1"}>
            <Text
              className={"text-lg text-white font-psemibold"}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className={"text-gray-100 font-sm font-pregular"}
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className={"pt-2"}>
          <Image
            source={icons.menu}
            className={"w-5 h-5"}
            resizeMode={"contain"}
          />
        </View>
      </View>

      {play ? (
        <Text className={"text-white"}>Playing</Text>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className={
            "w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
          }
        >
          <Image
            source={{ uri: thumbnail }}
            className={"w-full h-full rounded-xl mt-3"}
            resizeMode={"cover"}
          />
          <Image
            source={icons.play}
            resizeMode={"contain"}
            className={"w-12 h-12 absolute"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
