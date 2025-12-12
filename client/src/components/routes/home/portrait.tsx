import propic from "../../../../public/propic.jpg";
import { Card } from "@/components/ui/card.tsx";

export const Portrait = () => {


    return (
        <div className="w-full flex flex-col items-center justify-center text-center">
            {/* Portrait Card */}
            <Card className="w-80 h-80 flex flex-col items-center justify-center gap-4
                border border-neutral-500/40 rounded-2xl
                backdrop-blur-lg bg-white/5 dark:bg-neutral-900/40 shadow-xl
            ">
                <img
                    alt="personal Photo"
                    src={propic}
                    className="w-76 h-76 object-cover rounded-xl filter grayscale"
                />
            </Card>
        </div>
    );
};
