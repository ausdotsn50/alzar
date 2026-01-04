import { Alert } from "react-native";
import { ProductForm } from '@/components/ProductForm';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const createProduct = () => {
    const router = useRouter();

    // Values to be submitted
    const[itemValue, setItemValue] = useState(null);
    const[priceValue, setPriceValue] = useState(null);

    const[formSubError, setFormSubError] = useState(""); // error msg display for form submission
    const[subLoading, setSubLoading] = useState(false); // submission of form loading
    
    // Functions to be used
    const handleReturn = () => {
        if(router.canGoBack()) router.back()
    }

    /* Falsy values return
        - false
        - 0 (number)
        - empty string
        - null
        - undefined 
        - NaN
    */
    const submitForm = async() => {
        const price = Number(priceValue); // for isNaN checker

        if(!itemValue || !priceValue) {
            setFormSubError("All fields are required");
        } else if(isNaN(price) || price <= 0) {
            setFormSubError("Positive numeric values only");
        } else {
            setSubLoading(true);
            try {
                const response = await fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        item: itemValue.trim(),
                        base_price: price,
                    }),
                });
                    if(!response.ok) throw new Error("Failed to create product");
                    Alert.alert("Success", "Product created succesfully");

            } catch(error) {
                console.error("Error creating product: ", error);
                Alert.alert("An error occurred", error.message);
            } finally {
                setSubLoading(false);
                handleReturn();
            }
        }
    }

    return (
        <ProductForm 
            formTitle="New Product" 
            subLoading={subLoading} 
            submitForm={submitForm} 
            toAct="Create Product"
            currentAct="Creating..." 
            formError={formSubError}
            setFormError={setFormSubError}
            handleReturn={handleReturn}
            itemVal={itemValue}
            setItemVal={setItemValue}
            priceVal={priceValue}
            setPriceVal={setPriceValue}
            itemHolder="Enter product item"
            priceHolder="Enter product base price"
        />
    );
}

// on submit order: use order route to create a new order for
export default createProduct;