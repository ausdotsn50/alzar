// styles src: https://gist.github.com/burakorkmez/2df88764ee2ba45672af1b98efd7737a
import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/color.js";

export const genStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end", 
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  content: {
    padding: 20,
    paddingBottom: 0,
  },
  itemCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  itemsList: {
    flex: 1,
    marginHorizontal: 20,
  },
  itemsListContent: {
    paddingBottom: 80,
  },
  itemLeft: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.grnShd,
  },
  itemDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  itemsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 5,
  },
  deleteButton: {
    marginRight: 15,
  },
  editButton: {
    marginRight: 15,
  },
  emptyState: {
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },
  // 🔴 Error styles
  errorBox: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.redShd,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  errorInput: {
    borderColor: COLORS.redShd,
  },
  form: {
    backgroundColor: COLORS.card,
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 20,
    zIndex: 1,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 30,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: COLORS.background,
    marginTop: 30,
    borderRadius: 12,
    width: '90%',
    height: 50,
    justifyContent: "center", 
    alignItems: "center",     
    alignSelf: "center",
  },
  subButtonTxt: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 8, // adjust based on list container
    borderColor: COLORS.borderDrk,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingBottom: 5,
    fontSize: 16,
    color: COLORS.borderDrk,
    width: "100%",
    textAlign: "center"
  },
});
