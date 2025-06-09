
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createCredentialSet } from "@/lib/db/credentials";
import { toast } from "@/hooks/use-toast";

const credentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  user_name: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  enable_required: z.boolean().default(false),
  enable_password: z.string().optional(),
});

type CredentialFormData = z.infer<typeof credentialSchema>;

interface CreateCredentialModalProps {
  open: boolean;
  onClose: () => void;
  onCredentialCreated: () => void;
}

const CreateCredentialModal: React.FC<CreateCredentialModalProps> = ({
  open,
  onClose,
  onCredentialCreated,
}) => {
  const form = useForm<CredentialFormData>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      name: "",
      user_name: "",
      password: "",
      enable_required: false,
      enable_password: "",
    },
  });

  const enableRequired = form.watch("enable_required");

  const onSubmit = async (data: CredentialFormData) => {
    try {
      const credentialData = {
        name: data.name,
        user_name: data.user_name,
        password: data.password,
        enable_required: data.enable_required,
        enable_password: data.enable_required ? data.enable_password : undefined,
      };

      const success = await createCredentialSet(credentialData);
      if (success) {
        toast({
          title: "Credential set created",
          description: `"${data.name}" has been successfully created.`,
        });
        form.reset();
        onClose();
        onCredentialCreated();
      }
    } catch (error) {
      toast({
        title: "Error creating credential set",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Credential Set</DialogTitle>
          <DialogDescription>
            Add a new set of credentials for network device authentication.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Production SSH" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this credential set
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enable_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Required</FormLabel>
                    <FormDescription>
                      Device requires enable mode authentication
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {enableRequired && (
              <FormField
                control={form.control}
                name="enable_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enable Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password for enable mode access
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Credential Set</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCredentialModal;
