
import React from 'react';
import CredentialsPage from '@/components/credentials';
import { RequireAuth } from '@/lib/auth';

const Credentials = () => {
  return (
    <RequireAuth>
      <CredentialsPage />
    </RequireAuth>
  );
};

export default Credentials;
