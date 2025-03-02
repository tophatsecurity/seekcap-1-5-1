
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
type JsonDataContextType = {
  jsonData: any;
  treeData: any[];
  bannersData: any;
  setJsonData: (data: any) => void;
  setTreeData: (data: any[] | ((prevData: any[]) => any[])) => void;
  setBannersData: (data: any) => void;
  clearJsonData: () => void;
};

// Create the context with default values
const JsonDataContext = createContext<JsonDataContextType>({
  jsonData: null,
  treeData: [],
  bannersData: null,
  setJsonData: () => {},
  setTreeData: () => {},
  setBannersData: () => {},
  clearJsonData: () => {},
});

// Create a provider component
export const JsonDataProvider = ({ children }: { children: ReactNode }) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [bannersData, setBannersData] = useState<any>(null);

  const clearJsonData = () => {
    setJsonData(null);
    setTreeData([]);
    setBannersData(null);
  };

  return (
    <JsonDataContext.Provider
      value={{
        jsonData,
        treeData,
        bannersData,
        setJsonData,
        setTreeData,
        setBannersData,
        clearJsonData,
      }}
    >
      {children}
    </JsonDataContext.Provider>
  );
};

// Create a hook to use the context
export const useJsonData = () => useContext(JsonDataContext);
