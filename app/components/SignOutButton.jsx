import AntDesign from '@expo/vector-icons/AntDesign';

import { Alert, Text, TouchableOpacity } from 'react-native';
import { COLORS } from "@/constants/color.js";
import { styles } from "@/assets/styles/home.styles.js";
import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router';

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  // const { signOut } = useClerk()
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    { text: "Logout", style: "destructive",
        onPress: async () => {
          await signOut(); // signs out from Clerk
          router.replace("/sign-in"); // navigates login
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <AntDesign name="logout" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
}