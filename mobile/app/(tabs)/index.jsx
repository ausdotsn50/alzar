import PageLoader from "@/components/PageLoader";

import { FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { OrdersItem } from "../../components/OrdersItem";
import { SignOutButton } from '@/components/SignOutButton';
import { genStyles } from "@/assets/styles/general.styles.js";
import { styles } from "@/assets/styles/home.styles.js";
import { useCallback } from 'react';
import { useOrders } from "@/database/hooks/useOrders";
import { handleDelete } from "@/utils/helpers";
import { useFocusEffect } from 'expo-router';

export default function Home() {
  const { orders, summary, isLoading, loadData, deleteOrder } = useOrders();

  // Formatting values
  const currentDate = new Date(); // date today

  const options1 = { year: 'numeric', month: 'long', day: 'numeric' };
  const options2 = { weekday: 'long' }

  const formattedDate = currentDate.toLocaleDateString(undefined, options1);
  const day = currentDate.toLocaleDateString(undefined, options2);

  // Call customers hook
  useFocusEffect(
      useCallback(() => {
          loadData();
      }, [loadData])
  );

  if(isLoading) return <PageLoader />;
  
  const topRevContri = summary.topRevContri;
  const topItemName = topRevContri 
    ? (topRevContri.quantity > 1 ? `${topRevContri.item}s` : topRevContri.item)
    : "";

  return (
    <View style={genStyles.container}>
      <View style={genStyles.content}>
        
        {/* HEADER */}
        <View style={styles.header}>

          {/* Left side of header */}
          <View style={styles.headerLeft}>

            <Image 
              source={require("@/assets/images/waterDispenserBottle.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              {/*<Text style={styles.usernameText}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>*/}
              <Text style={styles.usernameText}>Manager</Text>
            </View>

          </View>

          {/* Right side of header */}
          {/*
          <View style={styles.headerRight}>
            <SignOutButton />
          </View>
          */}

        </View>

          {/* Place for summary card */}
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>{day} Report | {formattedDate}</Text>

            {/* L and R report divisions */}
            <View style={styles.report}>
              
              {<View>
                {summary.revenue ? (
                  <Text style={styles.revenueAmount}>Php {parseFloat(summary.revenue).toFixed(2)}</Text>
                ) : (
                  <Text style={styles.revenueAmount}>NA</Text>
                )}
                
                <Text style={styles.topRevenueTitle}>Top Revenue Contributor</Text>
                {topRevContri ? (
                  <>
                    <Text style={styles.topRevenueText}>
                      {topRevContri.name} | {topRevContri.address} Area
                    </Text>
                    <Text style={styles.topRevenueText}>
                      {topRevContri.quantity} {topItemName}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.topRevenueText}>NA</Text>
                )}
              </View>}

              <View>
                <View style={styles.reportMiniCard}>
                  <Text style={styles.delivers}>Delivers</Text>
                  <Text style={styles.delivers}>{summary.delivers}</Text>
                </View>

                <View style={styles.reportMiniCard}>
                  <Text style={styles.walkins}>Walk-Ins</Text>
                  <Text style={styles.walkins}>{summary.walkins}</Text>
                </View>
              </View>

            </View>
          </View>
        
        {/* Start of logging all orders */}
        <View style={genStyles.itemsHeaderContainer}>
          <Text style={genStyles.sectionTitle}>Recent Orders</Text>
        </View>

          
      </View>
      
      {/* FlastList used for performance reasons, for rendering in particular */}
      <FlatList
        style={genStyles.itemsList}
        contentContainerStyle={genStyles.itemsListContent}
        data={orders}
        renderItem={({item}) => (
          <OrdersItem item={item} onDelete={handleDelete} delOp={deleteOrder}/>
        )}
        ListEmptyComponent={
          <View style={genStyles.emptyState}>
            <Text style={genStyles.emptyStateTitle}>No orders to display yet</Text>
          </View>
        }
      />
    </View>
  );
}