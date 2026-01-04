import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({ children }) => {
    const insets = useSafeAreaInsets();
    return (
    // uses a preinstalled external package in package.json
    <View style={{ paddingTop : insets.top, flex : 1, backgroundColor : "gray" }}>
      {children}
    </View>
  );
};

export default SafeScreen;