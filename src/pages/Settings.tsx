
import React from 'react';
import SettingsPage from '@/components/settings';
import { RequireAuth } from '@/lib/auth';

const Settings = () => {
  return (
    <RequireAuth>
      <SettingsPage />
    </RequireAuth>
  );
};

export default Settings;
