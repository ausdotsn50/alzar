import filter from "lodash.filter";

import { COLORS } from "../constants/color";
import { genStyles } from '@/assets/styles/general.styles.js';
import { TextInput } from 'react-native';
import { useEffect, useState } from "react";

export const FilteredSearch = ({ dataToFilter, onFilter, searchKey }) => {
    const [searchQuery, setSearchQuery] = useState(""); // Default to empty string

    const handleSearch = (query) => {
        setSearchQuery(query);
        
        if (!query.trim()) {
            onFilter(dataToFilter); // Reset to full list if empty
            return;
        }

        const formattedQuery = query.toLowerCase();
        const filteredData = filter(dataToFilter, (item) => { 
            // Using item.name to match your 'contains' logic
            const valueToSearch = item[searchKey]?.toLowerCase() ?? "";
            return valueToSearch.includes(formattedQuery);
        });
        
        onFilter(filteredData);
    };

    // Ensure the list updates if the parent data changes (e.g., after a delete)
    useEffect(() => {
        handleSearch(searchQuery);
    }, [dataToFilter]);

    return (
        <TextInput 
            autoCapitalize='none'
            autoComplete="off" 
            autoCorrect={false} 
            placeholder="Search" 
            placeholderTextColor={COLORS.grnShd}
            clearButtonMode='always' 
            style={genStyles.searchBar}
            value={searchQuery}
            onChangeText={(query) => handleSearch(query) }
        />
    );
}