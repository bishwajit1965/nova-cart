import GlobalContext from "../context/GlobalContext";

import useCart from "../hooks/useCart";

const GlobalContextProvider = ({ children }) => {
  const cartLogic = useCart();

  return (
    <GlobalContext.Provider value={cartLogic}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
