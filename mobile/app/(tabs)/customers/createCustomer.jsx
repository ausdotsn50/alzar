import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { CustomerForm } from '@/components/customerComp/CustomerForm';
import { useCustomers } from '@/database/hooks/useCustomers';

const createCustomer = () => {
    const router = useRouter();
    const { addCustomer } = useCustomers();

    const[nameValue, setNameValue] = useState(null);
    const[addressValue, setAddressValue] = useState(null);
    const[formSubError, setFormSubError] = useState(""); 
    const[subLoading, setSubLoading] = useState(false); 

    const handleReturn = () => {
        if(router.canGoBack()) router.back()
    }

    const submitForm = async() => {
        if(!nameValue || !addressValue) {
            setFormSubError("All fields are required");
        } else {
            setSubLoading(true);
            setFormSubError("");

            try {
                await addCustomer(nameValue, addressValue);
                handleReturn();
            } catch(error) {
                console.error("Error creating customer:", error);
                setFormSubError(error.message);
            } finally {
                setTimeout(() => {
                    setSubLoading(false);
                    handleReturn();
                    Alert.alert("Success", "Customer added successfully");
                }, 1000);
            }
        }
    }

    return (
        <CustomerForm
            formTitle="New Customer"
            subLoading={subLoading}
            submitForm={submitForm}
            toAct="Create Customer"
            currentAct="Creating..."
            formError={formSubError}
            setFormError={setFormSubError}
            handleReturn={handleReturn}
            nameVal={nameValue}
            setNameVal={setNameValue}
            addressVal={addressValue}
            setAddressVal={setAddressValue}
        />
    );
}

export default createCustomer;