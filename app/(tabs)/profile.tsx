import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { getUserPosts, signOut } from "@/lib/appwrite";
import useAppwriteHook from "@/lib/appwrite.hook";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { data: posts } = useAppwriteHook(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();

    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View
            className={
              "w-full flex justify-center items-center mt-6 mb-12 px-4"
            }
          >
            <TouchableOpacity
              className={"w-full flex items-end mb-10"}
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode={"contain"}
                className={"w-6 h-6"}
              />
            </TouchableOpacity>

            <View
              className={
                "w-16 h-16 mb-2 border border-secondary rounded-lg flex items-center justify-center"
              }
            >
              <Image
                source={{ uri: user?.avatar }}
                resizeMode={"cover"}
                className={"w-[90%] h-[90%] rounded"}
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles={"mt-5"}
              titleStyles={"text-2xl"}
            />

            <View className={"mt-2 flex-row"}>
              <InfoBox
                title={posts.length || 0}
                subtitle={"Posts"}
                containerStyles={"mr-10"}
                titleStyles={"text-xl"}
              />
              <InfoBox
                title={"1.3k"}
                subtitle={"Followers"}
                titleStyles={"text-xl"}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No videos found"}
            subtitle={`Upload a video and get started`}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
