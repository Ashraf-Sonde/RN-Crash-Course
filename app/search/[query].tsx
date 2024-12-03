import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchField from "@/components/SearchField";
import EmptyState from "@/components/EmptyState";
import { useEffect } from "react";
import { searchPosts } from "@/lib/appwrite";
import useAppwriteHook from "@/lib/appwrite.hook";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwriteHook(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className={"my-6 px-4"}>
            <Text className={"text-gray-100 text-xl mb-1"}>Search</Text>
            <Text className={"text-2xl text-white font-pmedium"}>{query}</Text>
            <View className={"my-6"}>
              <SearchField initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No videos found"}
            subtitle={`No video found for "${query}"`}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
