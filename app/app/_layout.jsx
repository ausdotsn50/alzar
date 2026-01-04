import { useEffect, useState } from "react";
import { Slot } from "expo-router";
import { SQLiteProvider, openDatabaseAsync } from "expo-sqlite";
import { initDB } from "@/database/initDB"; 
import PageLoader from '@/components/PageLoader';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Manually open and init the DB first
        const db = await openDatabaseAsync("alzar.db");
        await initDB(db);
        
        // 2. Signal that we are ready
        setIsDbReady(true);
      } catch (error) {
        console.error("Database prep failed:", error);
      }
    }

    prepare();
  }, []); // Run only ONCE on mount

  if (!isDbReady) {
    return <PageLoader />;
  }

  return (
    <SQLiteProvider databaseName="alzar.db">
      <Slot />
    </SQLiteProvider>
  );
}