import AntDesign from '@expo/vector-icons/AntDesign';

import { BackHandler, TouchableOpacity } from 'react-native';
import { COLORS } from "@/constants/color.js";
import { styles } from "@/assets/styles/home.styles.js";
export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  // const { signOut } = useClerk()
  const handleSignOut = () => {
    BackHandler.exitApp();
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <AntDesign name="logout" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
}