import { ItemCard } from "../ItemCard";
import { TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { genStyles } from "../../assets/styles/general.styles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { COLORS } from "@/constants/color.js"

export const CustomersItem = ({ item, onDelete, delOp, cardAct, onEdit }) => {
    return (
        <ItemCard
            title={item.name}
            subT={item.address}
            rightContent={null}
            id={item.id}
            cardAction={cardAct}
            iconContent={
                <>
                {/* edit icon to be modified */}
                <TouchableOpacity style={genStyles.editButton} onPress={() => onEdit(item.id, item.name, item.address)}>
                    <FontAwesome6 name="edit" size={20} color={COLORS.grnShd} />
                </TouchableOpacity>
                {/* delete icon */}
                <TouchableOpacity style={genStyles.deleteButton} onPress={() => onDelete(item.id, "customer", delOp)}>
                    <Feather name="trash-2" size={22} color={COLORS.redShd} />
                </TouchableOpacity>
                </>
            }
        />
    )
}
