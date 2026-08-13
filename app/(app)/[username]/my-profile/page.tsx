import { getUserProfile } from "@/src/features/User/actions/getActions";
import ProfilePage from "@/src/features/User/components/Profile/ProfilePage";

export default async function Page() {
  const res = await getUserProfile();

  return (
    <div className="flex flex-col items-centre p-5 h-screen">
      <ProfilePage user={res.data ?? null} />
    </div>
  );
}
