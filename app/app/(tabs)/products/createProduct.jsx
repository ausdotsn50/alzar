import { ProductForm } from '@/components/ProductForm';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useProducts } from '@/database/hooks/useProducts';

const createProduct = () => {
    const { addProduct } = useProducts(); 
    const router = useRouter();

    // Values to be submitted
    const [itemValue, setItemValue] = useState("");
    const [priceValue, setPriceValue] = useState("");

    const [formSubError, setFormSubError] = useState(""); // error msg display for form submission
    const [subLoading, setSubLoading] = useState(false); // submission of form loading
    
    // Uses expo router to navigate to a prev screen layer
    const handleReturn = () => {
        if(router.canGoBack()) router.back();
    }

    const submitForm = async() => {
        const price = Number(priceValue); // for isNaN checker

        if(!itemValue || !priceValue) {
            setFormSubError("All fields are required");
        } else if(isNaN(price) || price <= 0) {
            setFormSubError("Positive numeric values only");
        } else {
            setSubLoading(true);
            setFormSubError(""); // Clear any previous errors
            
            try {
                await addProduct(itemValue.trim(), price);
                handleReturn();
            } catch(error) {
                console.error("Error creating product:", error);
                setFormSubError(error.message);
            } finally {
                setSubLoading(false);
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

export default createProduct;