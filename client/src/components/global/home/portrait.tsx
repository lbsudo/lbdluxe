import propic from "../../../../public/propic.jpg";
import {Card} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";

function useTypewriter(words: string[], speed = 90, deleteSpeed = 40, pause = 1200) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const interval = setInterval(() => setBlink((v) => !v), 500);
        return () => clearInterval(interval);
    }, []);

    // Typing / deleting logic
    useEffect(() => {
        const current = words[index];

        // When finished deleting → next word
        if (!deleting && subIndex === current.length) {
            setTimeout(() => setDeleting(true), pause);
            return;
        }

        // When finished deleting → switch word
        if (deleting && subIndex === 0) {
            setDeleting(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (deleting ? -1 : 1));
        }, deleting ? deleteSpeed : speed);

        return () => clearTimeout(timeout);
    }, [subIndex, deleting, index]);

    return `${words[index].substring(0, subIndex)}${blink ? "|" : ""}`;
}


export const Portrait = () => {
    const roles = [
        "Systems Engineer",
        "Web/Mobile Developer",
        "AppSec Engineer",
        "BioMaxer",
    ];

    const typewriter = useTypewriter(roles);
    return (
        <>
        <Card className="w-80 h-80 flex flex-col items-center justify-center gap-4 border border-neutral-500">
            <img
                alt="personal Photo"
                src={propic}
                className="w-76 h-76 object-cover rounded-lg filter grayscale"
            />
        </Card>
    <div className="
		mt-4 px-6 py-4 rounded-2xl backdrop-blur-xl
		bg-transparent dark:border-neutral-500/50 dark:bg-neutral-900/50
		border border-white/20
		shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]
		flex flex-col items-center gap-1
	">

        {/* NAME */}
        <h1 className="
			text-3xl font-bold tracking-tight
			text-foreground drop-shadow-sm
		">
            Lawrence Brown
        </h1>

        {/* TYPEWRITER */}
        <p className="
			text-lg font-medium
			text-[#8F4BD2] dark:text-[#8F4BD2]
			h-6 tracking-wide select-none
		">
            {typewriter}
        </p>

    </div>
    </>
    )
}