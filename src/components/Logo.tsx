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
            {/* Checkmark swoosh part (Navy) */}
            <path d="M 5 55 C 20 60, 35 75, 40 95 C 45 80, 50 40, 55 30 C 50 40, 45 75, 45 75 C 30 55, 10 50, 5 55 Z" fill="#0A1128" />

            {/* Football body (Red outline & fill) */}
            <path d="M 55 30 C 70 5, 95 15, 95 45 C 95 70, 75 80, 50 60 C 50 50, 52 40, 55 30 Z" fill="#C1121F" stroke="#0A1128" strokeWidth="4" />

            {/* Top Stripe (Navy) */}
            <path d="M 60 20 C 65 15, 70 12, 75 12" stroke="#0A1128" strokeWidth="4" strokeLinecap="round" />

            {/* Bottom Stripe (Navy) */}
            <path d="M 85 55 C 90 50, 94 45, 96 40" stroke="#0A1128" strokeWidth="4" strokeLinecap="round" />

            {/* Main Laces Line */}
            <path d="M 65 50 L 80 30" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />

            {/* Cross Laces */}
            <path d="M 65 43 L 72 48" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
            <path d="M 69 38 L 76 43" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
            <path d="M 73 33 L 80 38" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
            <path d="M 77 28 L 84 33" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}
