import { genStyles } from "@/assets/styles/general.styles.js"
import { Text, TouchableOpacity, View } from "react-native";

// actual rendering * actual func calls
export const ItemCard = ({ title, subT, rightContent, id, cardAction, iconContent }) => {
    return (
        <View style={genStyles.itemCard}>
            <TouchableOpacity style={genStyles.itemContent} onPress={() => cardAction(id, title)}> 
                <View style={genStyles.itemLeft}>
                    <Text style={genStyles.itemTitle}>{title}</Text>
                    <Text style={genStyles.itemType}>{subT}</Text>
                </View>

                {rightContent && (
                    <View style={genStyles.itemRight}>
                        {rightContent}
                    </View>
                )}
            </TouchableOpacity>
            
            {iconContent}
        </View>
    );
}
