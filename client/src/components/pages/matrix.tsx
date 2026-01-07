import React, { useEffect, useRef } from "react";
import { useTheme } from "@/components/global/constants/theme/use-themes";

interface MatrixBackgroundProps {
    color?: string;
    fontSize?: number;
    className?: string;
    speed?: number;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
    color,
    fontSize = 14,
    className = "",
    speed = 1,
}) => {
    const { theme } = useTheme();
    const effectiveColor = color ?? (theme === "dark" ? "#ffffff" : "#1F1F1F");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let animationFrameId: number;

        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = new Array(columns).fill(1);

        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+";

        let lastTime = 0;
        const interval = 33; // ~30 fps

        const draw = (currentTime: number) => {
            animationFrameId = requestAnimationFrame(draw);

            if (currentTime - lastTime < interval) return;
            lastTime = currentTime;

            // ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            // ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillStyle =(theme === "dark" ? "rgba(0, 0, 0, 0.05)" :"rgba(31, 31, 31, 0.05)")
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = effectiveColor;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += speed; // Use the speed prop to control fall rate
            }
        };

        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [effectiveColor, fontSize, speed, theme]);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none z-0 ${className}`}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
            }}
        />
    );
};

export default MatrixBackground;
