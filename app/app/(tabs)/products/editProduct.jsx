import { Alert } from 'react-native';
import { ProductForm } from '@/components/ProductForm';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

const editProduct = () => {
  const router = useRouter();

  const[subLoading, setSubLoading] = useState(false);
  const[formSubError, setFormSubError] = useState("");

  const { productId, productItem, productPrice } = useLocalSearchParams();

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
        const response = await fetch(`${API_URL}/products`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: productId,
            item: newItemValue.trim(),
            base_price: price,
          }),
        });
        
        if (!response.ok) throw new Error("Failed to update product");
        Alert.alert("Success", "Product updated successfully");      
      } catch (error) {
        console.error("Error updating product: ", error);
        Alert.alert("An error occurred", error.message);
      } finally {
        setSubLoading(false);
        handleReturn();
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