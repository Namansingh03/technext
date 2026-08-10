"use client";

import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/src/shared/utils/utils";
import { Loader2 } from "lucide-react";
import { Input } from "@/src/shared/ui/input";
import { authClient } from "@/src/configs/auth-client";
import { useState, useTransition } from "react";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/src/features/auth/schemas/resetPasswordSchema";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formattedDate = formatDate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  if (!token) {
    toast.error("Token not found", { description: formattedDate });
    router.push("/signin");
    return null;
  }

  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = (data) => {
    startTransition(async () => {
      setServerError("");

      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (error) {
        setServerError(error.message ?? "Something went wrong");
        return;
      }

      toast.success("Password reset successfully", {
        description: formattedDate,
      });
      router.push("/signin");
    });
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      <div className="bg-white border dark:bg-neutral-900 dark:border-neutral-800  border-stone-200 rounded-2xl p-8 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="font-serif text-lg tracking-tight">Talentgate</span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-serif font-medium tracking-tight">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new secure password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="newPassword"
              className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              New password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register("newPassword")}
              className={cn(errors.newPassword && "border-destructive")}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={cn(errors.confirmPassword && "border-destructive")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-destructive text-center">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full mt-1">
            {isPending ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              "Reset password"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember it?{" "}
          <Link
            href="/signin"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
