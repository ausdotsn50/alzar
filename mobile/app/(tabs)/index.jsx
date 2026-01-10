import PageLoader from "@/components/PageLoader";

import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { TransactionItem } from '@/components/transactionComp/TransactionItem'
import { SignOutButton } from '@/components/SignOutButton';
import { genStyles } from "@/assets/styles/general.styles.js";
import { styles } from "@/assets/styles/home.styles.js";
import { useCallback, useState } from 'react';
import { useTransactions } from "@/database/hooks/useTransactions";
import { handleDelete } from "@/utils/helpers";
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/color.js'
//import { CustomDropdown } from '@/components/CustomDropdown';

export default function Home() {
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions();

  const [expanded, setExpanded] = useState(false);

  // Formatting values
  const currentDate = new Date(); // date today

  const options1 = { year: 'numeric', month: 'long', day: 'numeric' };
  const options2 = { month: 'long' }

  const formattedDate = currentDate.toLocaleDateString(undefined, options1);
  const month = currentDate.toLocaleDateString(undefined, options2);

  // Call customers hook
  useFocusEffect(
      useCallback(() => {
          loadData();
      }, [loadData])
  );
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

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
          <View style={styles.headerRight}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={toggleExpanded}
                delayLongPress={10000}
              >
                <Ionicons name="add" size={20} color={COLORS.card}></Ionicons>
                <Text style={styles.addButtonText}>Add Transaction</Text>
              </TouchableOpacity>
              
              {/* Moved OUTSIDE TouchableOpacity */}
              {expanded && (
                <View style={styles.dropdownMenu}>
                  <FlatList
                    data={[
                      {color: COLORS.grnShd, icon: "cash-outline", path: "/addTransaction/logOrder", label: 'Log Order'},
                      {color: COLORS.redShd, icon: "receipt-outline", path: '/addTransaction/logExpense', label: 'Log Expense'},
                    ]}
                    renderItem={({item}) => (
                      <TouchableOpacity 
                        style={styles.dropdownItem}
                        onPress={() => {
                          toggleExpanded();
                          router.push(item.path);
                        }}
                        delayLongPress={10000}
                      >
                        <Ionicons name={item.icon} size={20} color={item.color}/>
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </View>

        </View>

          {/* Place for summary card */}
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>Net Income | Month of {month}</Text>

            {/* L and R report divisions */}
            <View style={styles.report}>
              
              {<View>
                {summary.revenue ? (
                  <Text style={styles.revenueAmount}>₱ {parseFloat(summary.revenue).toFixed(2)}</Text>
                ) : (
                  <Text style={styles.revenueAmount}>NA</Text>
                )}
                
                
              </View>}

              <View style={styles.reportBottom}>
                {/* Add an income and expense left and right division here*/}
                <View style={styles.incomeExpense}>
                  <Text style={styles.incomeText}>Income</Text>
                  <Text style={styles.incomeCurr}>₱ 200.00</Text>
                </View>

                <View style={styles.incomeExpense}>
                  <Text style={styles.expenseText}>Expenses</Text>
                  <Text style={styles.expenseCurr}>₱ 300.00</Text>
                </View>
                
              </View>

            </View>
          </View>
        
        {/* Start of logging all orders */}
        <View style={genStyles.itemsHeaderContainer}>
          <Text style={genStyles.sectionTitle}>Recent Transactions</Text>
        </View>

          
      </View>
      
      {/* FlastList used for performance reasons, for rendering in particular */}
      <FlatList
        style={genStyles.itemsList}
        contentContainerStyle={genStyles.itemsListContent}
        data={transactions}
        keyExtractor={(item) => item.unique_key} // req. keyExtractor for unique key identified bug fix
        renderItem={({ item }) => (
          <TransactionItem 
            item={item}
            onDelete={handleDelete} 
            delOp={deleteTransaction}
          />
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