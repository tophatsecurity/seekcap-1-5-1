
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CredentialsFormProps {
  credentialSets: string[];
  selectedCredentials: string[];
  onCredentialToggle: (credential: string) => void;
}

const CredentialsForm: React.FC<CredentialsFormProps> = ({
  credentialSets,
  selectedCredentials,
  onCredentialToggle,
}) => {
  if (credentialSets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium mb-2">Credentials to Try</h3>
      <div className="grid grid-cols-2 gap-2">
        {credentialSets.map((credential) => (
          <div key={credential} className="flex items-center space-x-2">
            <Checkbox
              id={`cred-${credential}`}
              checked={selectedCredentials.includes(credential)}
              onCheckedChange={() => onCredentialToggle(credential)}
            />
            <label
              htmlFor={`cred-${credential}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {credential}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialsForm;
