import { COLORS } from "@/constants/color.js"
import { genStyles } from '@/assets/styles/general.styles.js';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from "react-native";

export const ErrorBox = ({ error, setError }) => {
    return (
        error ? (
        <View style={genStyles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.redShd}/>
                    <Text style={[genStyles.errorText, {textAlign : "center"}]}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                    <Ionicons name="close" size={20} color={COLORS.textLight}/>
                </TouchableOpacity>
            </View>
        ) : null
    );
}

