"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/src/shared/ui/card";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/src/shared/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { authClient } from "@/src/configs/auth-client";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/formatDate";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function VerifyOtp() {
  const [isPending, startTransition] = React.useTransition();
  const [otp, setOtp] = React.useState("");
  const params = useParams();
  const rawEmail = Array.isArray(params?.email)
    ? params.email[0]
    : params?.email;
  const email = rawEmail ? decodeURIComponent(rawEmail) : "";
  const router = useRouter();
  const [timer, setTimer] = useState(0);
  const [stateError, setStateError] = useState<string>("");
  const formattedDate = formatDate();

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = useCallback(() => {
    console.log("Entered OTP:", otp);
    startTransition(async () => {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });

      console.log("verify otp data : ", data);

      if (error) {
        toast.error(
          error.message || "Something went wrong while verifying otp",
          { description: formattedDate },
        );
        setOtp("");
        return;
      }

      toast.success("Otp verified successfully", {
        description: formattedDate,
      });
      router.push("/setUsername");
    });
  }, [email, otp, router, formattedDate]);

  const handleResend = async () => {
    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (res.error) {
        if (res.error.status === 429) {
          setStateError("please wait too many requests");
          setTimer(60);
          return;
        }

        setStateError(
          res.error.message || "something went wrong while resending otp",
        );
        return;
      }

      // ✅ success
      setTimer(60);
      setStateError("");
    } catch (err) {
      setStateError("Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    if (otp.length !== 6) return;

    const verify = async () => {
      await handleVerify();
    };

    verify();
  }, [otp, handleVerify]);

  return (
    <Card className="w-full max-w-md shadow-lg rounded-2xl">
      {/* Header */}
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-semibold">
          Verify Your Email
        </CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to your email
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-col items-center space-y-6">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot className="h-15 w-10" index={0} />
            <InputOTPSlot className="h-15 w-10" index={1} />
            <InputOTPSlot className="h-15 w-10" index={2} />
          </InputOTPGroup>

          <InputOTPSeparator />

          <InputOTPGroup>
            <InputOTPSlot className="h-15 w-10" index={3} />
            <InputOTPSlot className="h-15 w-10" index={4} />
            <InputOTPSlot className="h-15 w-10" index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button className="w-full" onClick={handleVerify} disabled={isPending}>
          Verify OTP
        </Button>
      </CardContent>
      {stateError && (
        <CardDescription className="text-red-600">{stateError}</CardDescription>
      )}
      {/* Footer */}
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Didn’t receive the code?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={handleResend}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
