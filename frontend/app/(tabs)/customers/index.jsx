import AntDesign from '@expo/vector-icons/AntDesign';
import PageLoader from '@/components/PageLoader';

import { COLORS } from "@/constants/color.js"
import { CustomersItem } from '@/components/CustomersItem';
import { FilteredSearch } from '@/components/FilteredSearch';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { genStyles } from '@/assets/styles/general.styles.js';
import { handleDelete } from "@/utils/helpers";
import { useCustomers } from '@/hooks/useCustomers';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import editCustomer from './editCustomer';

export default function customer() {
    const router = useRouter();

    const { customers, isLoading, loadData, deleteCustomer } = useCustomers("user_30fchKVx5rA45v3VB84XXgJDOvP");
    
    const[filteredCustomers, setfilteredCustomers] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    
    const createCustomer = () => {
        // console.log("Creating customer...");
        router.push("customers/createCustomer");
    }

    const updateCustomer = (id, name, address) => {
        router.push({
            pathname: "/customers/editCustomer",
            params: {
                customerId: id,
                customerName: name,
                customerAddress: address,
            }
        })
    }

    const onRefresh = async() => {
        setRefreshing(true);
        await loadData() // loading the data from scratch
        setRefreshing(false);
    }

    // Call customers hook
    useEffect(() => {
        loadData()
    }, [loadData]);

    if(isLoading) return <PageLoader />;

    return (
        <View style={genStyles.container}>
            <View style={genStyles.content}>
                <FilteredSearch dataToFilter={customers} onFilter={setfilteredCustomers}/>
            </View>
            {/* Add button */}
            <View style={[genStyles.itemCard, { marginHorizontal : 20 }]}>
                <TouchableOpacity onPress={() => createCustomer()} style={[genStyles.itemContent, { alignItems: 'center', justifyContent: 'center' }]}> 
                    <AntDesign name="adduser" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>
            <FlatList
                style={genStyles.itemsList}
                contentContainerStyle={genStyles.itemsListContent}
                data={filteredCustomers}
                renderItem={({item}) => (
                    // Choose customer op
                    // To do: choose products for customer purchase
                    <CustomersItem item={item} onDelete={handleDelete} delOp={deleteCustomer} cardAct={() => {null}} onEdit={updateCustomer}
                    />
                )}
                ListEmptyComponent={
                    <View style={genStyles.emptyState}>
                    <Text style={genStyles.emptyStateTitle}>No customers to display yet</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            />
        </View>
    );
}