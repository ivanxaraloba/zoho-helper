import { cn } from "@/lib/utils";

export function TypographyMuted({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}
