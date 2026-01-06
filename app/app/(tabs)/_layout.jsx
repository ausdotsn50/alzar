import { BlurView } from 'expo-blur';
import { COLORS } from "@/constants/color.js";
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary, // passed down to props.color for active
        tabBarInactiveTintColor: COLORS.primReduc, // passed down to props.color for inactive
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '300',
        },

        // Cp from react navigation doc
        tabBarStyle: { position: 'absolute' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="logOrder"
        options={{
          tabBarLabel: "Log Order",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="cash-register" size={21} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="products"
        options={{
          tabBarLabel: "Products",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="bottle-water" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="customers"
        options={{
          tabBarLabel: "Customers",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={23} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
