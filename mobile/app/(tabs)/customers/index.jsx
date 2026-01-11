import AntDesign from '@expo/vector-icons/AntDesign';
import PageLoader from '@/components/PageLoader';

import { COLORS } from "@/constants/color.js"
import { CustomersItem } from '@/components/customerComp/CustomersItem';
import { FilteredSearch } from '@/components/FilteredSearch';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { genStyles } from '@/assets/styles/general.styles.js';
import { handleDelete } from "@/utils/helpers";
import { useCustomers } from "@/database/hooks/useCustomers.js";
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

export default function customer() {
    const router = useRouter();
    const { customers, isLoading, loadData, deleteCustomer } = useCustomers();
    const[filteredCustomers, setfilteredCustomers] = useState([]);
    
    const createCustomer = () => {
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

    // Call customers hook for loadingData
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    if(isLoading) return <PageLoader />;
    return (
        <View style={genStyles.container}>
            <View style={genStyles.content}>
                <FilteredSearch dataToFilter={customers} onFilter={setfilteredCustomers} searchKey="name"/>
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
                    <CustomersItem item={item} onDelete={handleDelete} delOp={deleteCustomer} cardAct={() => {null}} onEdit={updateCustomer}
                    />
                )}
                ListEmptyComponent={
                    <View style={genStyles.emptyState}>
                    <Text style={genStyles.emptyStateTitle}>No customers to display yet</Text>
                    </View>
                }
            />
        </View>
    );
}