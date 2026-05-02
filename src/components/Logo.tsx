export function LogoIcon({ className, size = 40 }: { className?: string, size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ flexShrink: 0 }}
        >
            {/* Shield outline */}
            <path
                d="M 50 5 L 88 22 L 88 55 C 88 72, 70 88, 50 95 C 30 88, 12 72, 12 55 L 12 22 Z"
                fill="none"
                stroke="#F5A623"
                strokeWidth="6"
                strokeLinejoin="round"
            />
            {/* Inner shield fill */}
            <path
                d="M 50 14 L 80 27 L 80 55 C 80 69, 65 82, 50 88 C 35 82, 20 69, 20 55 L 20 27 Z"
                fill="rgba(245,166,35,0.08)"
            />
            {/* Checkmark */}
            <path
                d="M 30 52 L 44 66 L 72 36"
                stroke="#F5A623"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}