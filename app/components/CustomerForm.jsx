import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { COLORS } from "@/constants/color.js";
import { genStyles } from '@/assets/styles/general.styles.js';
import { ErrorBox } from '@/components/ErrorBox';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
export const CustomerForm = ({ formTitle, subLoading, submitForm, toAct, currentAct, formError, setFormError, handleReturn, nameVal, setNameVal, addressVal, setAddressVal }) => {
    return (
        <View style={genStyles.container}>
            <View style={genStyles.content}>
                <View style={genStyles.header}>
                    <TouchableOpacity>
                        <MaterialIcons name="cancel" size={24} color={COLORS.text} onPress={handleReturn}/>
                    </TouchableOpacity>
                </View>

                {/* Container for create/add customers interface */}
                <View style={genStyles.form}>
                    <Text style={genStyles.formTitle}>{formTitle}</Text>
                    <TextInput
                        autoCapitalize="none"
                        autocomplete={false}
                        autoCorrect={false}
                        clearButtonMode="always"
                        style={[genStyles.searchBar, { marginBottom : 20, color: COLORS.borderDrk}, formError && genStyles.errorInput]}
                        placeholder="Enter customer name"
                        placeholderTextColor={COLORS.grnShd}
                        value={nameVal}
                        onChangeText={(name) => {
                            setNameVal(name);
                        }}
                    />
                    <TextInput
                        autoCapitalize="none"
                        autocomplete={false}
                        autoCorrect={false}
                        clearButtonMode="always"
                        style={[genStyles.searchBar, { marginBottom : 0, color: COLORS.borderDrk}, formError && genStyles.errorInput]}
                        placeholder="Enter customer address"
                        placeholderTextColor={COLORS.grnShd}
                        value={addressVal}
                        onChangeText={(address) => {
                            setAddressVal(address);
                        }}
                    />
                    <TouchableOpacity style={[genStyles.submitButton, subLoading && {backgroundColor : COLORS.card}]} onPress={submitForm} disabled={subLoading}>
                        <Text style={genStyles.subButtonTxt}>{subLoading ? currentAct : toAct}</Text>
                    </TouchableOpacity>
                </View>

                <ErrorBox error={formError} setError={setFormError}/>
            </View>
        </View>
    );
}