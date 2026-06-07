import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { width: 180, height: 240 },
  md: { width: 300, height: 400 },
  lg: { width: 450, height: 600 },
};

export function CardImage({ src, alt, size = "md", className = "" }: Props) {
  const { width, height } = sizes[size];

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface-hover ${className}`}>
        <span className={size === "lg" ? "text-8xl" : "text-4xl"}>🃏</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      sizes={
        size === "sm"
          ? "(max-width: 768px) 50vw, 25vw"
          : size === "md"
            ? "(max-width: 768px) 100vw, 50vw"
            : "(max-width: 768px) 100vw, 50vw"
      }
    />
  );
}
