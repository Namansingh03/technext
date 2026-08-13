import { Toaster } from "sonner";
import Navbar from "@/src/shared/components/Navbar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-w-full h-screen flex flex-col items-centre">
      <Navbar />
      <div className="min-w-full flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">{children}</div>
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
}
