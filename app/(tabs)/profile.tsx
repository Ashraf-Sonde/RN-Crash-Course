import { StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView className="flex items-center justify-center">
      <StatusBar barStyle={"dark-content"} />
      <Text className="text-xl">Profile Screen</Text>
    </SafeAreaView>
  );
};

export default Profile;
