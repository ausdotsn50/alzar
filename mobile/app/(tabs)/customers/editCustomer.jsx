import { CustomerForm } from '@/components/customerComp/CustomerForm';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useCustomers } from '@/database/hooks/useCustomers';

const editCustomer = () => {
  const router = useRouter();

  const { updateCustomer } = useCustomers();
  const { customerId, customerName, customerAddress } = useLocalSearchParams();

  const[subLoading, setSubLoading] = useState(false);
  const[formSubError, setFormSubError] = useState("");
  const[newNameValue, setNewNameValue] = useState(customerName);
  const[newAddressValue, setNewAddressValue] = useState(customerAddress);
  
  const handleReturn = () => {
    if(router.canGoBack()) router.back()
  }

  const submitForm = async () => {
    if (!newNameValue && !newAddressValue) {
      setFormSubError("Fill up at least one field");
    } else {
      setSubLoading(true);

      try {
        await updateCustomer(customerId, newNameValue, newAddressValue);
        handleReturn();
      } catch (error) {
        console.error("Error updating customer:", error);
        setFormSubError(error.message);
      } finally {
        setSubLoading(false);
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