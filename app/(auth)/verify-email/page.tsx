import VerifyEmailForm from "@/src/features/auth/components/Verify-EmailForm";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a] p-6 md:p-10">
      <div className="w-2xl flex items-center justify-center">
        <VerifyEmailForm />
      </div>
    </div>
  );
}
