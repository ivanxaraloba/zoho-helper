"use client";

import React from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import ButtonLoading from "../ui/button-loading";

const formSchema = z.object({
  name: z.string().min(3),
  access_token: z.string().min(3),
  refresh_token: z.string().min(3),
  client_id: z.string().min(3),
  client_secret: z.string().min(3),
  org_id: z.string().min(3),
});

export default function DialogCreateProject() {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const mutationCreateProject = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("zohodesk_oauth").insert(data);
      if (error) throw error;
      return data;
    },
    onSuccess: async (data: any) => {
      toast.success("Project created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error creating project");
    },
  });

  const onSubmit = (data: any) => {
    mutationCreateProject.mutate(data);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto text-start">
          <CirclePlus className="size-4" />
          <span>New project</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
              <DialogDescription>
                Create a new Self Client with the the scopes below
                <p className="text-muted-foreground text-[8px] bg-secondary px-2 py-1 rounded-md mt-2">
                  Desk.tickets.ALL Desk.tasks.ALL Desk.settings.ALL
                  Desk.events.ALL Desk.search.READ Desk.contacts.ALL
                </p>
              </DialogDescription>
            </DialogHeader>
            <hr />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="Name *" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="access_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Access Token *"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refresh_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Refresh Token *"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="Client Id *" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Client Secret *"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="org_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="Org Id *" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <ButtonLoading
                type="submit"
                loading={mutationCreateProject.isPending}
              >
                Create
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
