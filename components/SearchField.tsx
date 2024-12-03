import { Alert, Image, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";
import { useState } from "react";

const SearchField = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View
      className={`mt-1 border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-xl flex flex-row items-center focus:border-secondary space-x-4`}
    >
      <TextInput
        className={`text-lg mt-0.5 flex-1 text-white font-pregular`}
        value={query}
        onChangeText={(e) => setQuery(e)}
        placeholder={"Search for a video"}
        placeholderTextColor={"#CDCDE0"}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            Alert.alert("Error", "Search field is empty");
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image
          source={icons.search}
          resizeMode={"contain"}
          className={"w-5 h-5"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchField;
