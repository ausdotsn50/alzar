import { SQLiteProvider } from "expo-sqlite";
import { Slot } from "expo-router";
import { initDB } from "@/database/initDB"; 
import PageLoader from '@/components/PageLoader';
import SafeScreen from '@/components/SafeScreen'

export default function RootLayout() {
  return (
    <SQLiteProvider 
      databaseName="alzar.db" 
      onInit={initDB}
      loadingUi={<PageLoader />} 
    >
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </SQLiteProvider>
  );
}