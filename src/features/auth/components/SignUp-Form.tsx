"use client";

import Link from "next/link";
import { toast } from "sonner";
import Socials from "./Socials";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/input";
import { cn } from "@/src/shared/utils/utils";
import { Button } from "@/src/shared/ui/button";
import { useState, useTransition } from "react";
import { authClient } from "@/src/configs/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { formatDate } from "@/src/shared/utils/formatDate";
import { SignUpSchema, SignUpSchemaType } from "../schemas/signUpSchema";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formattedDate = formatDate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => {
    startTransition(async () => {
      setServerError("");

      const { error } = await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
        callbackURL: "/setUsername",
      });

      if (error) {
        console.log("signup error : ", error.message);
        setServerError(error.message ?? "Something went wrong");
        return;
      }

      toast.success("Account created! Please verify your email.", {
        description: formattedDate,
      });

      router.push(`/verify-email/${data.email}`);
    });
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      {/* Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="font-serif text-lg tracking-tight">Talentgate</span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-serif font-medium tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join Talentgate today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Role selector */}
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              Full name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Johnson"
              {...register("name")}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(errors.password && "border-destructive")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm-password"
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Confirm
              </label>
              <Input
                id="confirm-password"
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
          </div>

          {/* Server error */}
          {serverError && (
            <p className="text-sm text-destructive text-center">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full mt-1">
            {isPending ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              "Create account"
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            or continue with
            <div className="flex-1 h-px bg-border" />
          </div>

          <Socials />
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-white px-6">
        By creating an account you agree to our{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
