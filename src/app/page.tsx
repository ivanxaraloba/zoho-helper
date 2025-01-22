"use client";

import { TypographyH1 } from "@/components/typography/typography-h1";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";

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
import { ArrowUpRight, Play } from "lucide-react";

export default function Home() {
  const mutationMigrateDesk = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/migrate/desk");
      console.log(response.data);
    },
  });

  return (
    <div className="mx-auto justify-center py-3">
      <TypographyH1 className="text-center">API Services</TypographyH1>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Link href="/convert/xml-to-json">
          <Button variant="outline" className="font-bold flex-col size-48">
            <div className="grid place-items-center rounded-full border-white">
              <ArrowUpRight />
            </div>
            <span>XML TO JSON</span>
          </Button>
        </Link>
        <Link href="/convert/json-to-xml">
          <Button variant="outline" className="font-bold flex-col size-48">
            <div className="grid place-items-center rounded-full border-white">
              <ArrowUpRight />
            </div>
            <span>JSON TO XML</span>
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="font-bold flex-col size-48"
            >
              <div className="grid place-items-center rounded-full border-white">
                <Play />
              </div>
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
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <ButtonLoading
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
