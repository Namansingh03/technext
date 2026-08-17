import { Toaster } from "sonner";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="min-w-full h-screen flex flex-col items-center">
      {children}
      <Toaster />
    </main>
  );
}
