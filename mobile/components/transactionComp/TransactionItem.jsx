import { genStyles } from "@/assets/styles/general.styles.js"
import { Text, TouchableOpacity } from "react-native";
import { ItemCard } from "../ItemCard";
import Feather from '@expo/vector-icons/Feather';

import { COLORS } from "@/constants/color.js"

export const TransactionItem = ({ item, onDelete, delay }) => {
    const typeDisplay = item.order_type === "deliver" ? "Deliver" : "Walk-in";
    const description = item.quantity 
        ? `${item.quantity} ${item.description}${item.quantity > 1 ? "s" : ""}`
        : item.description;
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    }).format(new Date(item.created_at));

    // Transaction_type based content rendering
    if(item.transaction_type === "order") {
        return (
            <ItemCard
                title={item.customer_name}
                subT={description}
                id={item.id}
                rightContent={
                    <>
                        <Text style={genStyles.itemAmount}>
                            + ₱ {parseFloat(item.amount).toFixed(2)}
                        </Text>
                        <Text style={genStyles.itemDate}>
                            {formattedDate}
                        </Text>
                    </>
                }
                cardAction={() => {
                    null
                }}
            />
        );
    } else {
        // Expense layout
        return (
            <ItemCard
                title={item.description}
                subT="Expense"
                id={item.id}
                rightContent={
                    <>
                        <Text style={[genStyles.itemAmount, { color: COLORS.redShd }]}>
                            - ₱ {parseFloat(item.amount).toFixed(2)}
                        </Text>
                        <Text style={genStyles.itemDate}>
                            {formattedDate}
                        </Text>
                    </>
                }
                cardAction={() => {
                    // Handle expense action
                }}
            />
        );
    }
}