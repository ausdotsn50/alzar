import { ProductForm } from '@/components/productComp/ProductForm';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/database/hooks/useProducts';
import { Alert } from 'react-native';

const editProduct = () => {
  const router = useRouter();

  const { updateProduct } = useProducts(); 
  const { productId, productItem, productPrice } = useLocalSearchParams();

  const[subLoading, setSubLoading] = useState(false);
  const[formSubError, setFormSubError] = useState("");
  const[newItemValue, setNewItemValue] = useState(productItem);
  const[newPriceValue, setNewPriceValue] = useState(productPrice);
  
  const handleReturn = () => {
    if(router.canGoBack()) router.back()
  }

  const submitForm = async () => {
    const price = Number(newPriceValue);

    // If both are blank or just whitespace
    if (!newItemValue && !newPriceValue) {
      setFormSubError("Fill up at least one field");
    } else if(newPriceValue && (isNaN(price) || price <= 0)) {
      setFormSubError("Positive numeric values only");
    } else {
      setSubLoading(true);
      
      try {
        await updateProduct(productId, newItemValue, newPriceValue);
      } catch (error) {
        console.error("Error updating product:", error);
        setFormSubError(error.message);
      } finally {
        setTimeout(() => {
            setSubLoading(false);
            handleReturn();
            Alert.alert("Success", "Product updated successfully");
        }, 500);
      }
    }
  }


  return (
    <ProductForm
      formTitle="Modify Product"
      subLoading={subLoading}
      submitForm={submitForm}
      toAct="Update Product"
      currentAct="Updating..."
      formError={formSubError}
      setFormError={setFormSubError}
      handleReturn={handleReturn}
      itemVal={newItemValue}
      setItemVal={setNewItemValue}
      priceVal={newPriceValue}
      setPriceVal={setNewPriceValue}
      itemHolder="Enter modified product item"
      priceHolder="Enter modified product base price"
    />
  );
}

export default editProduct;