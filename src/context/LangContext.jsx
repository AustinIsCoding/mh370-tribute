import { createContext, useState } from 'react';

export const LangContext = createContext(null); // eslint-disable-line react-refresh/only-export-components

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}
