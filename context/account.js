import { createContext, useContext, useState } from "react";

const Context = createContext();

export function AccountProvider({ children }) {
  const [account, setaccount] = useState(null);
  return (
    <Context.Provider value={[account, setaccount]}>{children}</Context.Provider>
  );
}

export function useAccountContext() {
  return useContext(Context);
}