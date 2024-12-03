import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchField from "@/components/SearchField";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { useState } from "react";
import { images } from "../../constants";
import { getAllPosts, getTrendingPosts } from "@/lib/appwrite";
import useAppwriteHook from "@/lib/appwrite.hook";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  const { data: posts, refetch } = useAppwriteHook(getAllPosts);
  const { data: trendingPosts } = useAppwriteHook(getTrendingPosts);
  const { user } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className={"my-6 px-4 space-y-6"}>
            <View className={"flex flex-row items-start justify-between mb-6"}>
              <View>
                <Text className={"text-gray-100 text-xl mb-1"}>
                  Hey, Welcome!
                </Text>
                <Text className={"text-2xl text-white font-pmedium"}>
                  {user?.username}
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  resizeMode={"contain"}
                  className={"w-9 h-10"}
                />
              </View>
            </View>

            <SearchField />

            <View className={"w-full flex flex-1 pt-5 pb-8"}>
              <Text className={"text-xl text-gray-100 font-pmedium"}>
                Trending Videos
              </Text>

              <Trending posts={trendingPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No videos found"}
            subtitle={"Be the first to upload a video"}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
