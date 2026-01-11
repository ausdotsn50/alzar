import Ionicons from '@expo/vector-icons/Ionicons';
import PageLoader from '@/components/PageLoader';

import { COLORS } from "@/constants/color.js"
import { FilteredSearch } from '@/components/FilteredSearch';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { genStyles } from '@/assets/styles/general.styles.js';
import { handleDelete } from "@/utils/helpers";
import { ProductsItem } from '@/components/productComp/ProductsItem';
import { useCallback, useState } from 'react';
import { useProducts } from "@/database/hooks/useProducts.js";
import { useFocusEffect, useRouter } from 'expo-router';

export default function Products() {
    const router = useRouter(); 
    const { products, isLoading, loadData, deleteProduct } = useProducts(); // custom products hook
    const[filteredProducts, setFilteredProducts] = useState([]); // used for search functionality

    const createProduct = () => {
        router.push("products/createProduct");
    }

    const editProduct = (id, item, price) => {
        router.push({
            pathname: "/products/editProduct",
            params: {
                productId: id,
                productItem: item,
                productPrice: price,
            }
        });
    };

    // Call customers hook
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    if(isLoading) return <PageLoader />;

    return (
        <View style={genStyles.container}>
            <View style={genStyles.content}>
                <FilteredSearch dataToFilter={products} onFilter={setFilteredProducts} searchKey="item"/>
            </View>
            {/* Add button */}
            <View style={[genStyles.itemCard, { marginHorizontal : 20 }]}>
                <TouchableOpacity onPress={() => createProduct()}style={[genStyles.itemContent, { alignItems: 'center', justifyContent: 'center' }]}> 
                    <Ionicons name="bag-add-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>
            <FlatList
                style={genStyles.itemsList}d
                contentContainerStyle={genStyles.itemsListContent}
                data={filteredProducts}
                renderItem={({item}) => (
                    // Custom products item component thats lists item and its base price
                    <ProductsItem item={item} onDelete={handleDelete} delOp={deleteProduct} cardAct={() => {null}} onEdit={editProduct}
                    />
                )}
                ListEmptyComponent={
                    <View style={genStyles.emptyState}>
                    <Text style={genStyles.emptyStateTitle}>No products to display yet</Text>
                    </View>
                }
            />
            
        </View>
    );
}