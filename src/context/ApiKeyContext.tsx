import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(() => {
    return localStorage.getItem('groqApiKey');
  });

  const setApiKey = (key: string | null) => {
    setApiKeyInternal(key);
    if (key) {
      localStorage.setItem('groqApiKey', key);
    } else {
      localStorage.removeItem('groqApiKey');
    }
  };
  
  useEffect(() => {
    const storedKey = localStorage.getItem('groqApiKey');
    if (storedKey) {
      setApiKeyInternal(storedKey);
    }
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};