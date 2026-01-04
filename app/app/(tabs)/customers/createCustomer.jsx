import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { CustomerForm } from '@/components/CustomerForm';

const createCustomer = () => {
    const router = useRouter();
    
    const[nameValue, setNameValue] = useState(null);
    const[addressValue, setAddressValue] = useState(null);

    const[formSubError, setFormSubError] = useState(""); // error msg display for form submission
    const[subLoading, setSubLoading] = useState(false); // submission of form loading

    const handleReturn = () => {
        if(router.canGoBack()) router.back()
    }

    const submitForm = async() => {
        if(!nameValue || !addressValue) {
            setFormSubError("All fields are required");
        } else {
            setSubLoading(true);
            try {
                const response = await fetch(`${API_URL}/customers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        name: nameValue,
                        address: addressValue,
                    }),
                });
                    if(!response.ok) throw new Error("Failed to create customer");
                    Alert.alert("Success", "Customer created succesfully");
            } catch(error) {
                console.error("Error creating customer: ", error);
                Alert.alert("An error occurred", error.message);
            } finally {
                setSubLoading(false);
                handleReturn();
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

// on submit order: use order route to create a new order for
export default createCustomer;