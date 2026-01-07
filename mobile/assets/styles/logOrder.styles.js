// styles src: https://gist.github.com/burakorkmez/2df88764ee2ba45672af1b98efd7737a
// styles src: https://www.npmjs.com/package/react-native-element-dropdown
import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/color.js";

export const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: '100%', 
    borderColor: COLORS.border,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: COLORS.card,
    marginBottom: 30,
    zIndex: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontWeight: "bold",
    color: COLORS.border,
    fontSize: 16,
    textAlign: "center",
  },
  selectedTextStyle: {
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.border,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    color: COLORS.borderDrk,
    textAlign: "center",
    height: 40,
    fontSize: 16,
  },
  itemTextStyle: {
    textAlign: "center",
    color: COLORS.borderDrk,
    fontSize: 16,
  },
});
