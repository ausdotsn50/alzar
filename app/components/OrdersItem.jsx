import { genStyles } from "@/assets/styles/general.styles.js"
import { Text, TouchableOpacity } from "react-native";
import { ItemCard } from "./ItemCard";
import Feather from '@expo/vector-icons/Feather';

import { COLORS } from "@/constants/color.js"

export const OrdersItem = ({ item, onDelete, delOp }) => {
    const typeDisplay = item.type === "deliver" ? "Deliver" : "Walk-In";
    const costAdd = item.type === "deliver" ? 5.00 : 0;
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    }).format(new Date(item.created_at));

    return (
        <ItemCard
            title={item.name}
            subT={typeDisplay}
            id={item.id}
            rightContent={
                <>
                    <Text style={genStyles.itemAmount}>Php {(parseFloat(item.total_price)).toFixed(2)}</Text>
                    <Text style={genStyles.itemDate}>{formattedDate}</Text>
                </>
            }
            cardAction={() => {
                null
            }}
            iconContent={
                <>
                {/* delete icon */}
                <TouchableOpacity style={genStyles.deleteButton} onPress={() => onDelete(item.id, "order", delOp)}>
                    <Feather name="trash-2" size={22} color={COLORS.redShd} />
                </TouchableOpacity>
                </>
            }
        />
    )
}
