import { COLORS } from "@/constants/color.js";
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from "@/assets/styles/logOrder.styles.js";
import { useState } from 'react';

export const CustomDropdown = ({ placeholderText, data, passedValue, onChangeAct }) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: COLORS.borderDrk }]}
            placeholderStyle={[
                styles.placeholderStyle,
                isFocus && { color: COLORS.borderDrk }
            ]}
            selectedTextStyle={[styles.selectedTextStyle, isFocus && {color : COLORS.borderDrk}]}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            itemTextStyle={styles.itemTextStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? placeholderText : '...'}
            searchPlaceholder="Search"
            value={passedValue}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
                onChangeAct(item);
                setIsFocus(false);
            }}
            renderRightIcon={() => {
                null
            }}
        />
    )   
}