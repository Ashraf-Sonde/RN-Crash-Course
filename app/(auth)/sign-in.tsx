import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "@/components/FormField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);

      // Get logged in user
      const currentUser = await getCurrentUser();

      // Set user to global state
      setUser(currentUser);
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
            Login to Aora
          </Text>

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
            title={"Sign In"}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />

          <View className={"pt-5 flex flex-row gap-2 justify-center"}>
            <Text className={"text-lg text-gray-100 font-pregular"}>
              Don't have an account?
            </Text>
            <Link
              href={"/sign-up"}
              className={"text-lg text-secondary font-pmedium"}
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
