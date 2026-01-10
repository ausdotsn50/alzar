import { ItemCard } from "../ItemCard";
import { TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { genStyles } from "../../assets/styles/general.styles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { COLORS } from "@/constants/color.js"

export const ProductsItem = ({ item, onDelete, delOp, cardAct, onEdit}) => {
    return (
        <ItemCard
            title={item.item}
            subT={"Php " + parseFloat(item.base_price).toFixed(2)}
            rightContent={null}
            id={item.id}
            cardAction={cardAct}
            iconContent={
                <>
                {/* edit icon to be modified */}
                <TouchableOpacity style={genStyles.editButton} onPress={() => onEdit(item.id, item.item, item.base_price)}>
                    <FontAwesome6 name="edit" size={20} color={COLORS.grnShd} />
                </TouchableOpacity>
                {/* delete icon */}
                <TouchableOpacity style={genStyles.deleteButton} onPress={() => onDelete(item.id, "product", delOp)}>
                    <Feather name="trash-2" size={22} color={COLORS.redShd} />
                </TouchableOpacity>
                </>
            }
        />
    )
}
