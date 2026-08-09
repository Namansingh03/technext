import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Heading,
  Preview,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type VerifyEmailProps = {
  name?: string;
  verificationUrl: string;
};

export default function VerificationEmail({
  name = "user",
  verificationUrl,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>

      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white mx-auto my-10 p-6 rounded-lg max-w-md shadow">
            <Heading className="text-xl font-bold mb-4">
              Verify your email
            </Heading>

            <Text className="text-sm mb-3">Hi {name},</Text>

            <Text className="text-sm mb-4">
              Thanks for signing up! Please confirm your email address by
              clicking the button below.
            </Text>

            <Button
              href={verificationUrl}
              className="bg-black text-white px-5 py-3 rounded-md text-sm no-underline block text-center"
            >
              Verify Email
            </Button>

            <Text className="text-sm mt-4">
              Or copy and paste this link into your browser:
            </Text>

            <Text className="text-xs text-gray-600 break-all">
              {verificationUrl}
            </Text>

            <Text className="text-xs text-gray-400 mt-6">
              If you didn’t create an account, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
