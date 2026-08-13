"use client";

import Link from "next/link";
import Socials from "./Socials";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/shared/utils/utils";
import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/src/configs/auth-client";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  SignInSchema,
  SignInSchemaType,
} from "@/src/features/auth/schemas/signinSchema";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onResetPassword = () => {
    startTransition(async () => {
      const email = getValues("email");
      await authClient.requestPasswordReset({
        email,
        redirectTo: `/reset-password/${email}`,
      });
    });
  };

  const onSubmit: SubmitHandler<SignInSchemaType> = (data) => {
    startTransition(async () => {
      setServerError("");

      const { data: signInData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
        fetchOptions: {
          onSuccess: () => router.replace("/redirect"),
        },
      });

      if (error) {
        setServerError(error.message ?? "Something went wrong");
        return;
      }

      if (!signInData?.user) {
        setServerError("Invalid response from server");
        return;
      }
    });
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="font-serif text-lg tracking-tight">TechNext</span>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-serif font-medium tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={cn(
                errors.email && "border-destructive dark:border-destructive",
              )}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <button
                type="button"
                onClick={onResetPassword}
                className="text-xs text-muted-foreground hover:text-foreground dark:hover:text-neutral-100"
              >
                Forgot password?
              </button>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={cn(
                errors.password && "border-destructive dark:border-destructive",
              )}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-destructive text-center">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            or continue with
            <div className="flex-1 h-px bg-border" />
          </div>

          <Socials />
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline text-foreground dark:text-neutral-100"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
