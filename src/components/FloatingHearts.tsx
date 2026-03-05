import { memo } from "react";

interface FloatingHeartsProps {
    count?: number;
}

const FloatingHearts = memo(({ count = 12 }: FloatingHeartsProps) => {
    return (
        <div className="floating-hearts-container" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className="floating-heart"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 8}s`,
                        animationDuration: `${6 + Math.random() * 6}s`,
                        fontSize: `${10 + Math.random() * 14}px`,
                        opacity: 0.15 + Math.random() * 0.15,
                    }}
                >
                    ❤
                </span>
            ))}
        </div>
    );
});

FloatingHearts.displayName = "FloatingHearts";
export default FloatingHearts;
