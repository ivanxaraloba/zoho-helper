import { useState } from "react";

export const useCopy = (timeout: number = 2000) => {
  const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const isCopied = (value?: string) => {
    if (value) return copiedMap[value] ?? false;
    return copied;
  };

  const copy = async (value: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);

        if (copyTimeout && !value) {
          clearTimeout(copyTimeout);
        }

        setCopied(true);
        if (value) setCopiedMap((prev) => ({ ...prev, [value]: true }));

        const newTimeout = setTimeout(() => {
          setCopied(false);
          if (value) setCopiedMap((prev) => ({ ...prev, [value]: false }));
        }, timeout);

        setCopyTimeout(newTimeout);
      } else {
        throw new Error("Clipboard not supported");
      }
    } catch (e) {
      throw new Error(
        e instanceof Error
          ? e.message
          : "Unknown error occurred while copying.",
      );
    }
  };

  return { copy, copied, isCopied };
};
