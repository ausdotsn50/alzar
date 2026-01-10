// styles src: https://gist.github.com/burakorkmez/2df88764ee2ba45672af1b98efd7737a
import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/color.js";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 0,
    paddingVertical: 12,
    zIndex: 1000,
    position: 'relative',
  },
  headerLogo: {
    width: 75,
    height: 75,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  report: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    minHeight: 100,
  },
  reportBottom: {
    flexDirection: "row",
    justifyContent: "space-evenly", // This distributes space evenly
    alignItems: "flex-end",
    width: '100%',
  },
  reportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
  },
  incomeExpense: {
    flexDirection: "column",
    alignItems: "center"
  },
  incomeText: {
    fontSize: 14,
    color: COLORS.grnShd,
  },
  incomeCurr: {
    fontSize: 20, 
    
    color: COLORS.grnShd,
  },
  expenseText: {
    fontSize: 14,
    color: COLORS.redShd,
  },
  expenseCurr: {
    fontSize: 20, 
    
    color: COLORS.redShd,
  },
  // Additions for v2.0.1
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: COLORS.card,
    fontWeight: "600",
    marginLeft: 4,
  },
  // Dropdown to be modified + cleaned
  dropdownContainer: {
    position: 'relative',
    zIndex: 1002, // Increase this
  },
  dropdownMenu: {
    position: 'absolute',
    top: '70%',
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8, // Increase elevation for Android
    minWidth: '100%',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 22,
  },
  dropdownItemText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
