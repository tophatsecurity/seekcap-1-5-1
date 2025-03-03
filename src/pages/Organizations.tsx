
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Building, Network, Cpu, Edit, Save, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  fetchOrganizations, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization,
  fetchOrganizationIpRanges,
  addOrganizationIpRange,
  deleteOrganizationIpRange,
  fetchOrganizationVendors,
  addOrganizationVendor,
  deleteOrganizationVendor
} from "@/lib/db/organization";
import { Organization, OrganizationIpRange, OrganizationVendor } from "@/lib/db/types";

const Organizations = () => {
  const queryClient = useQueryClient();
  const [isAddOrgDialogOpen, setIsAddOrgDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  // IP Range form state
  const [newNetwork, setNewNetwork] = useState("");
  const [newNetmask, setNewNetmask] = useState("255.255.255.0");
  const [newRangeDescription, setNewRangeDescription] = useState("");
  
  // Vendor form state
  const [newVendor, setNewVendor] = useState("");
  const [newVendorDescription, setNewVendorDescription] = useState("");

  // Fetch all organizations
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });

  // Fetch IP ranges for selected organization
  const { data: ipRanges = [] } = useQuery({
    queryKey: ["organization-ip-ranges", selectedOrganization?.id],
    queryFn: () => selectedOrganization ? fetchOrganizationIpRanges(selectedOrganization.id) : Promise.resolve([]),
    enabled: !!selectedOrganization,
  });

  // Fetch vendors for selected organization
  const { data: vendors = [] } = useQuery({
    queryKey: ["organization-vendors", selectedOrganization?.id],
    queryFn: () => selectedOrganization ? fetchOrganizationVendors(selectedOrganization.id) : Promise.resolve([]),
    enabled: !!selectedOrganization,
  });

  // Create organization mutation
  const createOrgMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setIsAddOrgDialogOpen(false);
    },
  });

  // Update organization mutation
  const updateOrgMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Omit<Organization, 'id' | 'created_at'>> }) => 
      updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setIsEditMode(false);
    },
  });

  // Delete organization mutation
  const deleteOrgMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setSelectedOrganization(null);
    },
  });

  // Add IP range mutation
  const addIpRangeMutation = useMutation({
    mutationFn: addOrganizationIpRange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-ip-ranges", selectedOrganization?.id] });
      setNewNetwork("");
      setNewNetmask("255.255.255.0");
      setNewRangeDescription("");
    },
  });

  // Delete IP range mutation
  const deleteIpRangeMutation = useMutation({
    mutationFn: deleteOrganizationIpRange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-ip-ranges", selectedOrganization?.id] });
    },
  });

  // Add vendor mutation
  const addVendorMutation = useMutation({
    mutationFn: addOrganizationVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-vendors", selectedOrganization?.id] });
      setNewVendor("");
      setNewVendorDescription("");
    },
  });

  // Delete vendor mutation
  const deleteVendorMutation = useMutation({
    mutationFn: deleteOrganizationVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-vendors", selectedOrganization?.id] });
    },
  });

  // Set up initial edit form values when selected organization changes
  useEffect(() => {
    if (selectedOrganization) {
      setEditName(selectedOrganization.name);
      setEditDescription(selectedOrganization.description || "");
    }
  }, [selectedOrganization]);

  const handleAddOrganization = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    createOrgMutation.mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string
    });
  };

  const handleSaveEdit = () => {
    if (!selectedOrganization) return;
    
    updateOrgMutation.mutate({
      id: selectedOrganization.id,
      data: {
        name: editName,
        description: editDescription || undefined
      }
    });
  };

  const handleDeleteOrganization = () => {
    if (!selectedOrganization) return;
    
    if (window.confirm(`Are you sure you want to delete "${selectedOrganization.name}"? This action cannot be undone.`)) {
      deleteOrgMutation.mutate(selectedOrganization.id);
    }
  };

  const handleAddIpRange = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrganization) return;
    
    addIpRangeMutation.mutate({
      organization_id: selectedOrganization.id,
      network: newNetwork,
      netmask: newNetmask,
      description: newRangeDescription || undefined
    });
  };

  const handleDeleteIpRange = (id: number) => {
    if (window.confirm("Are you sure you want to remove this IP range?")) {
      deleteIpRangeMutation.mutate(id);
    }
  };

  const handleAddVendor = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrganization) return;
    
    addVendorMutation.mutate({
      organization_id: selectedOrganization.id,
      vendor: newVendor,
      description: newVendorDescription || undefined
    });
  };

  const handleDeleteVendor = (id: number) => {
    if (window.confirm("Are you sure you want to remove this vendor?")) {
      deleteVendorMutation.mutate(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Organizations</h2>
            <p className="text-muted-foreground">
              Manage organizations and their associated IP ranges and Ethernet vendors
            </p>
          </div>
          <Button onClick={() => setIsAddOrgDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Organization
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Organizations List */}
          <Card className="col-span-12 md:col-span-4">
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
              <CardDescription>Select an organization to view and edit details</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center">Loading organizations...</div>
              ) : organizations.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">No organizations found</p>
                  <Button 
                    onClick={() => setIsAddOrgDialogOpen(true)} 
                    variant="outline" 
                    className="mt-2"
                  >
                    Add your first organization
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {organizations.map((org) => (
                    <div 
                      key={org.id}
                      className={`
                        p-3 rounded-md cursor-pointer flex items-center justify-between
                        ${selectedOrganization?.id === org.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
                      `}
                      onClick={() => setSelectedOrganization(org)}
                    >
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>{org.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization Details */}
          {selectedOrganization ? (
            <Card className="col-span-12 md:col-span-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {isEditMode ? (
                  <div className="space-y-2 w-full">
                    <Label htmlFor="editName">Organization Name</Label>
                    <Input
                      id="editName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full"
                      placeholder="Organization Name"
                    />
                  </div>
                ) : (
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>{selectedOrganization.name}</span>
                  </CardTitle>
                )}
                <div className="flex space-x-2">
                  {isEditMode ? (
                    <>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsEditMode(false)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveEdit}
                        disabled={!editName.trim()}
                      >
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsEditMode(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleDeleteOrganization}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              {isEditMode ? (
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="editDescription">Description</Label>
                    <Textarea
                      id="editDescription"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Organization Description (optional)"
                    />
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedOrganization.description || "No description provided."}
                  </p>
                  
                  <Tabs defaultValue="ip-ranges">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="ip-ranges" className="flex items-center">
                        <Network className="h-4 w-4 mr-2" /> IP Ranges
                      </TabsTrigger>
                      <TabsTrigger value="vendors" className="flex items-center">
                        <Cpu className="h-4 w-4 mr-2" /> Vendors
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* IP Ranges Tab */}
                    <TabsContent value="ip-ranges" className="space-y-4 mt-4">
                      <form onSubmit={handleAddIpRange} className="space-y-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-5">
                            <Label htmlFor="network">Network</Label>
                            <Input
                              id="network"
                              value={newNetwork}
                              onChange={(e) => setNewNetwork(e.target.value)}
                              placeholder="192.168.1.0"
                              required
                            />
                          </div>
                          <div className="col-span-4">
                            <Label htmlFor="netmask">Netmask</Label>
                            <Input
                              id="netmask"
                              value={newNetmask}
                              onChange={(e) => setNewNetmask(e.target.value)}
                              placeholder="255.255.255.0"
                              required
                            />
                          </div>
                          <div className="col-span-3 flex items-end">
                            <Button type="submit" className="w-full">
                              <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="rangeDescription">Description (optional)</Label>
                          <Input
                            id="rangeDescription"
                            value={newRangeDescription}
                            onChange={(e) => setNewRangeDescription(e.target.value)}
                            placeholder="e.g., Production Network"
                          />
                        </div>
                      </form>
                      
                      <Separator />
                      
                      {ipRanges.length === 0 ? (
                        <div className="py-4 text-center">
                          <p className="text-muted-foreground">No IP ranges defined</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Network</TableHead>
                              <TableHead>Netmask</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ipRanges.map((range) => (
                              <TableRow key={range.id}>
                                <TableCell>{range.network}</TableCell>
                                <TableCell>{range.netmask}</TableCell>
                                <TableCell>{range.description || "—"}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteIpRange(range.id)}
                                    className="text-destructive h-8 w-8"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </TabsContent>
                    
                    {/* Vendors Tab */}
                    <TabsContent value="vendors" className="space-y-4 mt-4">
                      <form onSubmit={handleAddVendor} className="space-y-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-9">
                            <Label htmlFor="vendor">Vendor Name</Label>
                            <Input
                              id="vendor"
                              value={newVendor}
                              onChange={(e) => setNewVendor(e.target.value)}
                              placeholder="e.g., Cisco, Siemens, etc."
                              required
                            />
                          </div>
                          <div className="col-span-3 flex items-end">
                            <Button type="submit" className="w-full">
                              <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="vendorDescription">Description (optional)</Label>
                          <Input
                            id="vendorDescription"
                            value={newVendorDescription}
                            onChange={(e) => setNewVendorDescription(e.target.value)}
                            placeholder="e.g., SCADA Controllers"
                          />
                        </div>
                      </form>
                      
                      <Separator />
                      
                      {vendors.length === 0 ? (
                        <div className="py-4 text-center">
                          <p className="text-muted-foreground">No vendors defined</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vendor</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vendors.map((vendor) => (
                              <TableRow key={vendor.id}>
                                <TableCell>{vendor.vendor}</TableCell>
                                <TableCell>{vendor.description || "—"}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteVendor(vendor.id)}
                                    className="text-destructive h-8 w-8"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          ) : (
            <Card className="col-span-12 md:col-span-8">
              <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Organization Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Select an organization from the list or create a new one to view and manage its details.
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => setIsAddOrgDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Organization
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Organization Dialog */}
        <Dialog open={isAddOrgDialogOpen} onOpenChange={setIsAddOrgDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>
                Create a new organization to group and manage assets.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddOrganization}>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter a description of this organization"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOrgDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Organization</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Organizations;
