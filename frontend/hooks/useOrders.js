import { Alert } from "react-native";
import { useCallback, useState } from "react"

export const API_URL = "https://cs50x-fp-api.onrender.com/api";

// react custom hook
export const useOrders = (userId) => {
    const[orders, setOrders] = useState([]); // orders state is going to be an empty array --> array of orders will be stored here
    const[summary, setSummary] = useState({
        revenue: 0,
        delivers: 0,
        walkins: 0,
    }); // state that keeps track of summary --> COALESCE in postgresql
    const[isLoading, setIsLoading] = useState(true); // set to true so it is fetched immediately : after fetching is set to false
    
    /* useCallback 
        - takes two arguments: a function and a dependency array
        - arg1: whole callback func, arg2: userId
        
        It "memoizes" (caches) the provided function, 
        meaning it will only recreate the function if 
        one of the values in its dependency array changes

        - preventing unnecessary re-renders of components
    */
    const fetchOrders = useCallback(async() => {
        try {
            const response = await fetch(`${API_URL}/orders/${userId}`);
            const data = await response.json();
            setOrders(data);
        } catch(error) {
            console.error("Error fetching orders: ", error);
        }
    }, [userId]);
    
    /*
    const fetchSummary = useCallback(async() => {
        try {
            const response = await fetch(`${API_URL}/orders/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch(error) {
            console.error("Error fetching summary: ", error);
        }
    }, [userId]);
    */

    // function to be able to call orders and summary at the same time
    const loadData = useCallback(async() => {
        if (!userId) return;
        setIsLoading(true);

        try {
            await Promise.all([fetchOrders()]);
        } catch(error) {
            console.error("Error loading data: ", error);
        } finally {
            setIsLoading(false); // after fetching set to false
        }
    },[fetchOrders, userId]);

    // loadData used to refresh UI
    // To do: add delete functionality
    const deleteOrder = useCallback(async(id) => {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, { method : "DELETE"});
            if (!response.ok) throw new Error("Failed to delete order"); // note on delete + create

            loadData();
            Alert.alert("Success", "Order deleted successfully");
        } catch(error) {
            console.error("Error deleting order: ", error); 
            Alert.alert("An error occurred", error.message);
        }
    }, [loadData]);
    
    return { orders, isLoading, loadData, deleteOrder };
}