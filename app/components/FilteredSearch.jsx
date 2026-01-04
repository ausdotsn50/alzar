import filter from "lodash.filter";

import { COLORS } from "../constants/color";
import { genStyles } from '@/assets/styles/general.styles.js';
import { TextInput } from 'react-native';
import { useEffect, useState } from "react";

export const FilteredSearch = ({ dataToFilter, onFilter }) => {
    const[searchQuery, setSearchQuery] = useState("Water"); // by default, an empty string

    const handleSearch = (query) => {
        setSearchQuery(query); // searchQuery value changes via setSearchQuery
        
        const formattedQuery = query.toLowerCase(); // query in lower case
        const filteredData = filter(dataToFilter, (data) => { 
            return contains(data, formattedQuery)
        })
        // set to filtered update
        onFilter(filteredData);
    }

    const contains = (cm, query) => { // customer compared to query
        return cm.name?.toLowerCase().includes(query); // lower case to lower case comparison
    }

    // requires useEffect
    useEffect(() => {
        if(searchQuery.trim() === "") { // currently contained in searchQuery
            onFilter(dataToFilter);
        }
    },[dataToFilter]);

    return (
        <TextInput 
            autoCapitalize='none'
            autoComplete={false}
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