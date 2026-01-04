import { Alert } from 'react-native';
import { CustomerForm } from '@/components/CustomerForm';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

const editCustomer = () => {
  const router = useRouter();

  const[subLoading, setSubLoading] = useState(false);
  const[formSubError, setFormSubError] = useState("");

  const { customerId, customerName, customerAddress } = useLocalSearchParams();

  const[newNameValue, setNewNameValue] = useState(customerName);
  const[newAddressValue, setNewAddressValue] = useState(customerAddress);
  
  const handleReturn = () => {
    if(router.canGoBack()) router.back()
  }

  const submitForm = async () => {
    // If both are blank or just whitespace
    if (!newNameValue && !newAddressValue) {
      setFormSubError("Fill up at least one field");
    } else {
      setSubLoading(true);

      try {
        const response = await fetch(`${API_URL}/customers`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: customerId,
            name: newNameValue.trim(),
            address: newAddressValue.trim(),
          }),
        });
        
        if (!response.ok) throw new Error("Failed to update customer");
        Alert.alert("Success", "Customer updated successfully");      
      } catch (error) {
        console.error("Error updating customer: ", error);
        Alert.alert("An error occurred", error.message);
      } finally {
        setSubLoading(false);
        handleReturn();
      }
    }
  }


  return (
    <CustomerForm
      formTitle="Modify Customer"
      subLoading={subLoading}
      submitForm={submitForm}
      toAct="Update Customer"
      currentAct="Updating..."
      formError={formSubError}
      setFormError={setFormSubError}
      handleReturn={handleReturn}
      nameVal={newNameValue}
      setNameVal={setNewNameValue}
      addressVal={newAddressValue}
      setAddressVal={setNewAddressValue}
      itemHolder="Enter modified customer name"
      priceHolder="Enter modified customer address"
    />
  );
}

export default editCustomer;