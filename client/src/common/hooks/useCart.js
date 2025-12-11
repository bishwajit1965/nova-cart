import { useContext } from "react";
import CartContext from "../context/CartContext";

const useCart = () => {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within CartContextProvider");
  }
  return cart;
};

export default useCart;
