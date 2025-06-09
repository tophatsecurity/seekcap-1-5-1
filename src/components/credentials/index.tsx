
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Key, AlertCircle } from "lucide-react";
import { fetchCredentialSets } from "@/lib/db/credentials";
import CredentialsList from "./CredentialsList";
import CreateCredentialModal from "./CreateCredentialModal";
import EditCredentialModal from "./EditCredentialModal";
import { CredentialSet } from "@/lib/db/types";

const CredentialsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState<CredentialSet | null>(null);

  const { data: credentials, isLoading, error, refetch } = useQuery({
    queryKey: ["credentialSets"],
    queryFn: fetchCredentialSets,
  });

  const handleCredentialUpdated = () => {
    refetch();
  };

  const handleEditCredential = (credential: CredentialSet) => {
    setEditingCredential(credential);
  };

  const handleCloseEdit = () => {
    setEditingCredential(null);
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading credentials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error Loading Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load credential sets. Please try refreshing the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Key className="mr-3 h-8 w-8" />
            Credentials Management
          </h1>
          <p className="text-muted-foreground">
            Manage authentication credentials for network devices
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Credential Set
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credential Sets</CardTitle>
          <CardDescription>
            Configure authentication credentials for accessing network devices during discovery and capture operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CredentialsList 
            credentials={credentials || []}
            onEdit={handleEditCredential}
            onUpdated={handleCredentialUpdated}
          />
        </CardContent>
      </Card>

      <CreateCredentialModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCredentialCreated={handleCredentialUpdated}
      />

      {editingCredential && (
        <EditCredentialModal
          open={!!editingCredential}
          credential={editingCredential}
          onClose={handleCloseEdit}
          onCredentialUpdated={handleCredentialUpdated}
        />
      )}
    </div>
  );
};

export default CredentialsPage;
