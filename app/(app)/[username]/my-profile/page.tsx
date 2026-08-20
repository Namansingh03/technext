import { getUserProfile } from "@/src/features/User/actions/getActions";
import ProfilePage from "@/src/features/User/components/Profile/ProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const res = await getUserProfile();

  if (!res.success || !res.data) {
    throw new Error("user profile not found");
  }

  return (
    <div className="flex flex-col items-centre mb-16">
      <ProfilePage user={res.data} username={username} />
    </div>
  );
}
