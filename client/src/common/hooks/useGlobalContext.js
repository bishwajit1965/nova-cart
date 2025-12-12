import { useContext } from "react";
import GlobalCartWishListContext from "../context/GlobalContext";

const useGlobalContext = () => {
  const cart = useContext(GlobalCartWishListContext);
  if (!cart) {
    throw new Error(
      "useGlobalContext must be used within GlobalContextProvider"
    );
  }
  return cart;
};

export default useGlobalContext;
