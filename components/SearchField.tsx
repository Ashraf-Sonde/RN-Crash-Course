import { Image, Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { icons } from "../constants";

const SearchField = ({
  value,
  handleChangeText,
  otherStyles,
  keyboardType,
  ...props
}) => {
  return (
    <View
      className={`mt-1 border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-xl flex flex-row items-center focus:border-secondary space-x-4`}
    >
      <TextInput
        className={`text-lg mt-0.5 flex-1 text-white font-pregular`}
        value={value}
        onChangeText={handleChangeText}
        placeholder={"Search for a video"}
        placeholderTextColor={"#7b7b8b"}
        keyboardType={keyboardType}
      />

      <TouchableOpacity>
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
