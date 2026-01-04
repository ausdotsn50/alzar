import SafeScreen from "@/components/SafeScreen"; // created comp

import { Slot } from "expo-router";

// ClerkProvidercomponent provides session and user context to Clerk's hooks and components
// wrap your entire app at the entry point with ClerkProvider to make authentication globally accessible
export default function RootLayout() {
  return (
    /*
      tokenCache:
      - recommended way to store sensitive data, such as tokens, is by using expo-secure-store
    */
    <SafeScreen>
      <Slot />
    </SafeScreen>
  );  
};