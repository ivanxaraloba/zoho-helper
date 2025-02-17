"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";

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
import { useMutation } from "@tanstack/react-query";
import ButtonLoading from "@/components/ui/button-loading";
import { Play } from "lucide-react";

export default function Home() {
  const mutationMigrateDesk = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/migrate/desk");
      console.log(response.data);
    },
  });

  return (
    <div className="h-svh grid place-items-center">
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="font-bold flex-col size-48 rounded-2xl"
            >
              <Play />
              <span>MIGRATE DESK</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will migrate all your
                contacts and tickets from the origin desk to the target desk
                account.
              </DialogDescription>
              <DialogFooter>
                <DialogClose>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <ButtonLoading
                  variant="destructive"
                  loading={mutationMigrateDesk.isPending}
                  onClick={() => mutationMigrateDesk.mutate()}
                >
                  Execute
                </ButtonLoading>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
