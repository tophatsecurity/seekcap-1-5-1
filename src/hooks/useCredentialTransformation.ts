
import React from "react";

export const useCredentialTransformation = (credentials: any) => {
  return React.useMemo(() => {
    if (!credentials) return {};
    
    const transformed: Record<string, any> = {};
    Object.entries(credentials).forEach(([key, cred]: [string, any]) => {
      transformed[key] = {
        ...cred,
        username: cred.username || cred.user_name || '',
      };
    });
    return transformed;
  }, [credentials]);
};
