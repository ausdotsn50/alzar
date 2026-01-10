import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PageLoader from '@/components/PageLoader';

import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS } from "@/constants/color.js";
import { ErrorBox } from '@/components/ErrorBox';
import { genStyles } from '@/assets/styles/general.styles.js';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { CustomDropdown } from '@/components/CustomDropdown';
import { useProducts } from "@/database/hooks/useProducts";
import { useEffect, useState } from 'react';

const addTransaction = () => {
  return (
    <View>
      <Text>Placeholder</Text>
    </View>
  )
}

export default addTransaction;