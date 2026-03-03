import { useId } from "react";

interface LogoProps {
  size?: number;
  className?: string;
  white?: boolean;
}

export function Logo({ size = 28, className, white }: LogoProps) {
  const id = useId();
  const gradientId = `logo-gradient-${id}`;
  const strokeRef = white ? "white" : `url(#${gradientId})`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="5"
        stroke={strokeRef}
        strokeWidth="2.5"
      />
      <path
        d="M10 13L16 10L22 13"
        stroke={strokeRef}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19L16 22L22 19"
        stroke={strokeRef}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!white && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
