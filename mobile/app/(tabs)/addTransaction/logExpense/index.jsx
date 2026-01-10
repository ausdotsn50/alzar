import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ProductForm } from '@/components/productComp//ProductForm';
import { useTransactions } from '@/database/hooks/useTransactions';
import { Alert } from 'react-native';

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

  const postSubmit = () => {
    Alert.alert(
        "Success",
        "Expense created successfully!",
        [
            {
                text: "OK",
                onPress: () => {
                    setTitleValue("");
                    setAmtValue("");
                }
            }
        ]
    );
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
            await createExpense(titleValue.trim(), amt); // possible err throw (here)
            
        } catch(error) {
            console.error("Error creating expense:", error);
            setFormSubError(error.message);
        } finally {
            
            setTimeout(() => {
                setSubLoading(false);
                postSubmit();
            }, 3000); 
        }
    }
  }

  // Using product form because of the same structure for expense title + expense amt form
  // Already includes regex validation in the ProductForm 
  return (
      <ProductForm 
          formTitle="Record Expense" 
          subLoading={subLoading} 
          submitForm={submitForm} 
          toAct="Log Expense"
          currentAct="Logging..." 
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