import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PageLoader from '@/components/PageLoader';

import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS } from "@/constants/color.js";
import { ErrorBox } from '@/components/ErrorBox';
import { genStyles } from '@/assets/styles/general.styles.js';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { CustomDropdown } from '@/components/CustomDropdown';
import { useProducts } from "@/database/hooks/useProducts.js";
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';

const orderFor = () => {
  const router = useRouter();
  const { user } = useUser();
  
  const { products, isLoading, loadData } = useProducts(user.id); 
  const { customerId, customerName } = useLocalSearchParams(); // local params passed from logOrder/index.jsx

  // Values for form submission
  const[productValue, setProductValue] = useState(null);
  const[pTypeValue, setPTypeValue] = useState(null);
  const[pQuantValue, setPQuantValue] = useState(null);
  
  const[formSubError, setFormSubError] = useState("");
  const[subLoading, setSubLoading] = useState(false);

  // products data
  const newProdMap = products.map(product => ({
    label: product.item,
    value: product.id,
  }));

  // product ids only
  const productIds = products.map(product => product.id);

  // types data
  const types = [
    { label: 'Walk-in', value: 'walk in' },
    { label: 'Deliver', value: 'deliver' },
  ]

  // type values only
  const typeValues = types.map(type => type.value);

  const handleReturn = () => {
    if(router.canGoBack()) router.back()
  }
  
  // Form submission logic and validation
  // Note: includes is an array function
  const submitForm = async() => {
    // Input validation section 
    const quantity = Number(pQuantValue);

    if(!productValue || !pTypeValue || !pQuantValue) {
      setFormSubError("All fields are required");
    } else if(!productIds.includes(productValue)) {
      setFormSubError("Invalid product selected");
    } else if(!typeValues.includes(pTypeValue)) {
      setFormSubError("Invalid type selected");
    } else if(isNaN(quantity) || quantity <= 0) {
      setFormSubError("Quantity should be a positive integer");
    } else {
      // If validation has been passed
      setSubLoading(true);
      try {
        const response = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              userId : user.id,
              product_id : productValue,
              customer_id : customerId,
              quantity: pQuantValue,
              type: pTypeValue,
          }),
      });
          if (!response.ok) throw new Error("Failed to create order"); // note on delete + create
          Alert.alert("Success", "Order created successfully");
      } catch(error) {
        console.error("Error creating order: ", error); 
        Alert.alert("An error occurred", error.message);
      } finally {
        setSubLoading(false);
        handleReturn();
      }
    }
  }

  // Call products hook
  useEffect(() => {
      loadData()
  }, [loadData]);

  // console.log(newProdMap);
  // console.log(customerId, customerName);

  if(isLoading) return <PageLoader />;

  return (
    <View style={genStyles.container}>
      <View style={genStyles.content}>
        <View style={genStyles.header}>
            <TouchableOpacity>
              <MaterialIcons name="cancel" size={24} color={COLORS.text} onPress={handleReturn}/>
            </TouchableOpacity>
        </View>

        {/* Container for customer order interface  */}
        <View style={genStyles.form}>
          <Text style={genStyles.formTitle}>Create an order for {customerName}</Text>
          <CustomDropdown 
            data={newProdMap} 
            placeholderText="Select product to order"
            passedValue={productValue}
            onChangeAct={(item) => {
              setProductValue(item.value);
            }}
          />
          <CustomDropdown 
            data={types}  
            placeholderText="Select type of order"
            passedValue={pTypeValue}
            onChangeAct={(item) => {
              setPTypeValue(item.value);
            }}
          />
          <TextInput 
              autoCapitalize='none'
              autoComplete={false}
              autoCorrect={false}
              clearButtonMode='always' 
              keyboardType="number-pad"
              style={[genStyles.searchBar, { marginBottom : 0, color: COLORS.borderDrk}]}
              placeholder="Enter order quantity"
              value={pQuantValue}
              onChangeText={(numInput) =>  {
                  // allow 0-9 value for typing
                  const onlyDigits = numInput.replace(/[^0-9]/g, ''); // arguments for replace method string.replace(searchValue, replacement)
                  setPQuantValue(onlyDigits);
              }}
          />
          <TouchableOpacity style={[genStyles.submitButton, subLoading && {backgroundColor : COLORS.card}]} onPress={submitForm} disabled={subLoading}>
              <Text style={genStyles.subButtonTxt}>{subLoading ? "Submitting..." : "Submit Order"}</Text>
          </TouchableOpacity>
        </View>

        <ErrorBox error={formSubError} setError={setFormSubError}/>

      </View>
    </View>
  )
}

// on submit order: use order route to create a new order for
export default orderFor;