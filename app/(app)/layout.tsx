import { Toaster } from "sonner";
import Navbar from "@/src/shared/components/Navbar";
import { getCachedUser } from "@/src/shared/utils/getCachedUser";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const res = await getCachedUser();

  if (!res.success || !res.data) {
    throw new Error(res.message);
  }

  const { name, image, companySlug, memberRole, username } = res.data;

  return (
    <main className="min-w-full h-screen flex flex-col items-center">
      <Navbar
        username={username}
        name={name}
        image={image}
        companySlug={companySlug ?? null}
        role={memberRole ?? null}
      />
      <div className="min-w-full flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">{children}</div>
        <Toaster richColors position="top-right" />
      </div>
    </main>
  );
}
