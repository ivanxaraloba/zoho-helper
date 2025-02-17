import type { Metadata } from "next";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Providers from "@/providers/_providers";
import { inter } from "@/assets/fonts/_index";

export const metadata: Metadata = {
  title: "Zoho Desk Migration",
  description: "by ivanxara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", inter.className)}>
        <Providers>
          <div className="w-full h-screen flex flex-col">{children}</div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
