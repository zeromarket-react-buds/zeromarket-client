// purchase-context.js
import { createContext, useContext, useState, useEffect } from "react";

const PurchaseContext = createContext(null);

export const usePurchase = () => useContext(PurchaseContext);

export const PurchaseProvider = ({ children }) => {
  const [tradeType, setTradeType] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    console.log("PurchaseProvider MOUNT");
    return () => {
      console.log("PurchaseProvider UNMOUNT");
    };
  }, []);

  const reset = () => {
    setTradeType(null);
    setAddressId(null);
    setTerms(null);
  };

  return (
    <PurchaseContext.Provider
      value={{
        tradeType,
        setTradeType,
        addressId,
        setAddressId,
        terms,
        setTerms,
        reset,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
