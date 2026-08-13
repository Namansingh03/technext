import { Toaster } from "sonner";
import Navbar from "@/src/shared/components/Navbar";
import { getCachedUser } from "@/src/shared/utils/getCachedUser";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const res = await getCachedUser();

  if (!res.success || !res.data) {
    throw new Error(res.message);
  }

  const { name, image } = res.data;

  return (
    <div className="min-w-full h-screen flex flex-col items-centre">
      <Navbar name={name} image={image} />
      <div className="min-w-full flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto h-screen">{children}</div>
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
}
