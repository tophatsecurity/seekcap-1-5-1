
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
type JsonDataContextType = {
  jsonData: any;
  treeData: any[];
  setJsonData: (data: any) => void;
  setTreeData: (data: any[]) => void;
  clearJsonData: () => void;
};

// Create the context with default values
const JsonDataContext = createContext<JsonDataContextType>({
  jsonData: null,
  treeData: [],
  setJsonData: () => {},
  setTreeData: () => {},
  clearJsonData: () => {},
});

// Create a provider component
export const JsonDataProvider = ({ children }: { children: ReactNode }) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [treeData, setTreeData] = useState<any[]>([]);

  const clearJsonData = () => {
    setJsonData(null);
    setTreeData([]);
  };

  return (
    <JsonDataContext.Provider
      value={{
        jsonData,
        treeData,
        setJsonData,
        setTreeData,
        clearJsonData,
      }}
    >
      {children}
    </JsonDataContext.Provider>
  );
};

// Create a hook to use the context
export const useJsonData = () => useContext(JsonDataContext);
