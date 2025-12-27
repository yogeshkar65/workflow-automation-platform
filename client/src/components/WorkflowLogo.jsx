export default function WorkflowLogo({ size = 26, dark = false }) {
  const primary = dark ? "#90caf9" : "#ffffff";
  const accent = dark ? "#64b5f6" : "#90caf9";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
    >
      {/* Circular flow */}
      <path
        d="M32 6
           A26 26 0 1 1 10 20"
        stroke={primary}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arrow */}
      <polygon
        points="8,22 14,22 11,16"
        fill={primary}
      />

      {/* Nodes */}
      <circle cx="32" cy="6" r="4" fill={primary} />
      <circle cx="54" cy="32" r="4" fill={primary} />
      <circle cx="32" cy="58" r="4" fill={accent} />
    </svg>
  );
}
