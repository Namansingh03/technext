import NavbarSkeleton from "@/src/shared/components/Skeleton/NavbarSkeleton";
import { SidebarMenuSkeleton } from "@/src/shared/ui/sidebar";

export default async function Loading() {
  return (
    <div className="w-full">
      <SidebarMenuSkeleton />
      <NavbarSkeleton />
    </div>
  );
}
