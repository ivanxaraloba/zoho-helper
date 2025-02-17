import { SidebarProvider } from "@/components/ui/sidebar";
import ReactQueryProvider from "./react-query";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
