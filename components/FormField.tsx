import { Image, Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useState } from "react";
import { icons } from "../constants";

// @ts-ignore
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={"text-base text-gray-100 font-pmedium"}>{title}</Text>

      <View
        className={`mt-1 border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-xl flex flex-row items-center focus:border-secondary`}
      >
        <TextInput
          className={`flex-1 text-white font-psemibold text-base`}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          keyboardType={keyboardType}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && (
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className={`w-8 h-8`}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
