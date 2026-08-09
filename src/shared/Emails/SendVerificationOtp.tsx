import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components";

interface SendVerificationOtpProps {
  type?: "email-verification" | "forget-password";
  otp?: string;
}

export default function SendVerificationOtp({
  type,
  otp,
}: SendVerificationOtpProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code for Verification</Preview>

      <Body className="bg-gray-100 font-sans">
        <Container className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
          {/* Header */}
          <Section className="text-center mb-6">
            <Heading className="text-2xl font-bold text-gray-800">
              Verify Your Email
            </Heading>
          </Section>

          {/* Greeting */}
          <Section className="mb-4">
            <Text className="text-gray-700 text-base">Hi {type},</Text>
            <Text className="text-gray-700 text-base mt-2">
              Use the OTP below to verify your email address. This code is valid
              for a short time.
            </Text>
          </Section>

          {/* OTP Box */}
          <Section className="text-center my-6">
            <Text className="text-3xl font-bold tracking-widest text-blue-600 bg-blue-50 inline-block px-6 py-3 rounded-lg">
              {otp}
            </Text>
          </Section>

          {/* Footer Info */}
          <Section className="mt-6">
            <Text className="text-gray-600 text-sm">
              If you didn’t request this, you can safely ignore this email.
            </Text>
          </Section>

          {/* Footer */}
          <Section className="mt-8 text-center">
            <Text className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
