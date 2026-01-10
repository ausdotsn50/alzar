import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ProductForm } from '@/components/productComp//ProductForm';
import { useTransactions } from '@/database/hooks/useTransactions';

export default function LogExpense() {
  const router = useRouter();

  const { createExpense } = useTransactions();

  const[titleValue, setTitleValue] = useState(null);
  const[amtValue, setAmtValue] = useState(null);

  const[formSubError, setFormSubError] = useState("");
  const[subLoading, setSubLoading] = useState(false);

  const handleReturn = () => {
    if(router.canGoBack()) router.back()
  }
  
  // Input validation before form submission
  const submitForm = async() => {
    const amt = Number(amtValue); // for isNaN checker

    if(!titleValue || !amt) {
        setFormSubError("All fields are required");
    } else if(isNaN(amt) || amt <= 0) {
        setFormSubError("Positive numeric values only");
    } else {
        setSubLoading(true);
        setFormSubError(""); // Clear any previous errors

        try {
            await createExpense(titleValue.trim(), amt);
            handleReturn();
        } catch(error) {
            console.error("Error creating expense:", error);
            setFormSubError(error.message);
        } finally {
            setSubLoading(false);
        }
    }
  }

  // Using product form because of the same structure for expense title + expense amt form
  // Already includes regex validation in the ProductForm 
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
          itemVal={titleValue}
          setItemVal={setTitleValue}
          priceVal={amtValue}
          setPriceVal={setAmtValue}
          itemHolder="Enter expense title"
          priceHolder="Enter expense amount"
      />
  );
}