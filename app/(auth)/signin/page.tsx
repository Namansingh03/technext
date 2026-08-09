import { SignInForm } from "@/src/features/auth/components/signin-form";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-linear-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInForm />
      </div>
    </div>
  );
}
