import { ReactNode } from "react";

interface ImageBackgroundProps {
  imageUrl?: string | null;
  children: ReactNode;
  className?: string;
}

export default function ImageBackground({
  imageUrl,
  children,
  className = "",
}: ImageBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)),
              url(${imageUrl})
            `,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-b from-blue-500 to-blue-100" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
