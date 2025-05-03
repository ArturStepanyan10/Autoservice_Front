import React, {useState, createContext} from 'react';

export const GlobalContext = createContext();

export const Provider = ({children}) => {
  const [user, setUser] = useState(null);
  console.log('Context: ', user);

  return (
    <GlobalContext.Provider value={{user, setUser}}>
      {children}
    </GlobalContext.Provider>
  );
};
