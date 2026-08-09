import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type CustomEmailProps = {
  title: string;
  content: string;
  footerText?: string;
  url?: string;
};

export default function CustomEmail({
  title,
  content,
  footerText = "If you didn’t request this, you can safely ignore this email.",
  url,
}: CustomEmailProps) {
  return (
    <Html>
      <Head />

      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white mx-auto my-10 p-6 rounded-lg max-w-md shadow">
            {/* Title */}
            <Heading className="text-xl font-bold mb-4">{title}</Heading>

            {/* Content */}
            <Text className="text-sm mb-4 whitespace-pre-line">
              {content}
              {url ?? <Button href={url}>Reset password</Button>}
            </Text>

            {/* Footer */}
            <Text className="text-xs text-gray-400 mt-6">{footerText}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
