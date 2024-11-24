import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "@/components/FormField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignUp = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await createUser(form.email, form.password, form.username);

      // Set user in global state
      setUser(user);
      setIsLoggedIn(true);

      // Redirect user to home screen
      router.replace("/home");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className={"w-full h-full px-4 my-6 flex flex-1 justify-center"}>
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode={"contain"}
          />

          <Text className="mt-10 text-2xl text-white font-psemibold">
            Sign up to Aora
          </Text>

          <FormField
            title={"Username"}
            value={form.username}
            handleChangeText={(e: string) => setForm({ ...form, username: e })}
            otherStyles={"mt-7"}
          />

          <FormField
            title={"Email"}
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles={"mt-7"}
            keyboardType={"email-address"}
          />

          <FormField
            title={"Password"}
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            otherStyles={"mt-7"}
          />

          <CustomButton
            title={"Sign Up"}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />

          <View className={"pt-5 flex flex-row gap-2 justify-center"}>
            <Text className={"text-lg text-gray-100 font-pregular"}>
              Already have an account?
            </Text>
            <Link
              href={"/sign-in"}
              className={"text-lg text-secondary font-pmedium"}
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
