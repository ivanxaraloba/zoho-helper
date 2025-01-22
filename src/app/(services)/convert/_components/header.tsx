import { TypographyH1 } from "@/components/typography/typography-h1";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { TypographyMuted } from "@/components/typography/typography-muted";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { Check, ChevronLeft, Copy } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

export default function Header({
  title,
  apiRoute,
}: {
  title: string;
  apiRoute: string;
}) {
  const { copied, copy } = useCopy();

  return (
    <div className="mx-auto text-center sticky top-0 bg-background z-10 py-3">
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-2">
          {/* <Link href="/">
            <ChevronLeft className="size-4" />
          </Link> */}
          <TypographyH3>{title}</TypographyH3>
        </div>
        {/* <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="!h-7 shadow-none"
            onClick={() => copy(apiRoute)}
          >
            <span>{apiRoute}</span>
            {copied ? (
              <Check className="!size-3" />
            ) : (
              <Copy className="!size-3" />
            )}
          </Button>
        </div> */}
      </div>
    </div>
  );
}
