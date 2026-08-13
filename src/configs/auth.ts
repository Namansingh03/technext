import prismaDb from "../server/db/db";
import { betterAuth } from "better-auth";
import resend from "../server/resend/resend";
import { emailOTP, username } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import CustomEmail from "@/src/shared/Emails/CustomEmailSend";
import VerificationEmail from "@/src/shared/Emails/VerificationEmail";
import SendVerificationOtp from "@/src/shared/Emails/SendVerificationOtp";
import { secondaryStorage } from "../server/redis/secondaryStorage";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prismaDb, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }) => {
      void resend.emails.send({
        from: "talentgate <onboarding@resend.dev>",
        to: user.email,
        subject: "Hello world",
        react: CustomEmail({
          content: "Someone is using your email",
          title: "Someone is trying to signup using your email",
          footerText: "If it was you ignore this email",
        }),
      });
    },
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "talentgate <onboarding@resend.dev>",
        to: user.email,
        subject: "Hello world",
        react: CustomEmail({
          content: "Reset your password",
          title: `click on this button to reset your password`,
          url: url,
          footerText: "If it was you ignore this email",
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log("VERIFY EMAIL");
      console.log("USER:", user.email);
      console.log("URL:", url);
      void resend.emails.send({
        from: "talentgate <onboarding@resend.dev>",
        to: user.email,
        subject: "Hello world",
        react: VerificationEmail({ name: user.name, verificationUrl: url }),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account consent",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    username({
      minUsernameLength: 5,
      maxUsernameLength: 50,
      usernameNormalization: false,
    }),
    emailOTP({
      resendStrategy: "rotate",
      async sendVerificationOTP({ email, otp, type }) {
        console.log("verification otp : ", otp);
        if (type === "email-verification") {
          void resend.emails.send({
            from: "talentgate <onboarding@resend.dev>",
            to: email,
            subject: "Hello world",
            react: SendVerificationOtp({ otp, type: "email-verification" }),
          });
        } else if (type === "forget-password") {
          void resend.emails.send({
            from: "talentgate <onboarding@resend.dev>",
            to: email,
            subject: "Hello world",
            react: SendVerificationOtp({ otp, type: "forget-password" }),
          });
        }
      },
      allowedAttempts: 5,
      expiresIn: 600,
      otpLength: 6,
      rateLimit: {
        max: 5,
        window: 60,
      },
    }),
  ],
  secondaryStorage,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 60 * 60 * 60,
      refreshCache: false,
    },
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  account: {
    storeAccountCookie: true,
    storeStateStrategy: "cookie",
  },
});
