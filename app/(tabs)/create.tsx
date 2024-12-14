import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "../../constants";
import CustomButton from "@/components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { uploadVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const [uploading, setUploading] = useState(false);

  const player = useVideoPlayer(form.video, (player) => {});

  const openPicker = async (type) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        type === "image"
          ? ["image/png", "image/jpeg", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (type === "image") {
        // @ts-ignore
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (type === "video") {
        // @ts-ignore
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      return Alert.alert("Error", "Please enter all the details");
    }

    setUploading(true);

    try {
      // Submit the video to appwrite
      await uploadVideo({ ...form, userId: user.$id });

      Alert.alert("Success!", "Video uploaded successfully");
      router.push("/home");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <ScrollView className={"px-4 my-6"}>
        <Text className={"text-white text-2xl font-psemibold"}>
          Upload a video
        </Text>

        <FormField
          title={"Video Title"}
          value={form.title}
          placeholder={"Enter a title for your video"}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles={"mt-10"}
        />

        <View className={"mt-7 space-y-2"}>
          <Text className={"text-lg text-gray-100 font-medium"}>
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <VideoView
                player={player}
                contentFit={"cover"}
                style={{
                  width: "100%",
                  height: 210,
                  borderRadius: 12,
                }}
              />
            ) : (
              <View
                className={
                  "w-full h-40 px-4 bg-black-100 rounded-xl justify-center items-center"
                }
              >
                <View
                  className={
                    "w-14 h-14 border border-dashed border-secondary-100 justify-center items-center "
                  }
                >
                  <Image
                    source={icons.upload}
                    resizeMode={"contain"}
                    className={"w-1/2 h-1/2"}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className={"mt-7 space-y-2"}>
          <Text className={"text-lg text-gray-100 font-medium"}>
            Upload Thumbnail
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode={"cover"}
                className={"w-full h-64 rounded-xl "}
              />
            ) : (
              <View
                className={
                  "w-full h-16 px-4 bg-black-100 rounded-xl flex-row justify-center items-center border-2 border-black-200 space-x-2"
                }
              >
                <Image
                  source={icons.upload}
                  resizeMode={"contain"}
                  className={"w-6 h-6 mr-2"}
                />
                <Text className={"text-base text-gray-400 font-pmedium"}>
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title={"AI Prompt"}
          value={form.prompt}
          placeholder={"Prompt used to generate the video"}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles={"mt-7"}
        />

        <CustomButton
          title={"Submit & Publish"}
          handlePress={submit}
          containerStyles={"mt-7"}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
