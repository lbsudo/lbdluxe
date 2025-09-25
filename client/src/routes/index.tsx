import {createFileRoute} from "@tanstack/react-router";
import propic from "@/assets/propic.jpg";
import DefaultLayout from "@/layouts/default.tsx";
import {Card} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    const words = [
        "DESIGNER",
        "DEVELOPER",
    ];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 4000); // Change word every 2 seconds
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <>
            <DefaultLayout>
                <div className={"flex w-full items-center justify-center"}>
                    <Card
                        className="w-80 h-80 flex flex-col items-center justify-center gap-4 border border-neutral-500">
                        <img alt={'personal Photo'} src={propic}
                             className="w-76 h-76 object-cover rounded-xl filter grayscale"/>
                    </Card>
                </div>

                <section
                    className={"mt-4 flex w-full flex-col items-center justify-center"}
                >
                    <h1
                        className={
                            "flex w-full items-center justify-center text-4xl  font-bold md:text-6xl"
                        }
                    >
                        LAWRENCE BROWN
                    </h1>
                    <div className=" flex h-16 w-full items-center justify-center">
                        {" "}
                        {/* Container for height consistency */}
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={currentWordIndex} // Ensure unique keys for the animation
                                className="absolute text-4xl font-bold md:text-6xl"
                                initial={{opacity: 0, y: 20}} // Starting position and opacity
                                animate={{opacity: 1, y: 0}} // Animate to visible and aligned
                                exit={{opacity: 0, y: -20}} // Animate out upwards
                                transition={{duration: 0.4}} // Animation duration
                            >
                                {words[currentWordIndex]}
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                </section>
                <section
                    className={
                        "flex flex-col items-center justify-center py-6 text-center text-4xl"
                    }
                >
                    <p className={"text-center text-4xl font-bold "}>
                        I&apos;M <span className={"font-light italic"}>Lawrence</span>
                    </p>
                    <p className={"text-center text-4xl font-bold "}>
                        FULL-STACK <span className={"font-light italic"}>Developer</span>
                    </p>
                    <p className={"text-center text-4xl font-bold "}>
                        BASED IN <span className={"font-light italic"}>California🌴</span>
                    </p>
                </section>

                <section className={" flex w-full items-center justify-center"}>
                    <Card
                        className="mx-4 flex w-full items-center rounded-xl justify-center border border-neutral-500 p-2 md:mx-0 md:w-1/2 lg:w-1/3 xl:w-1/4">
                        <Card
                            className="flex w-full items-center justify-center rounded-lg bg-neutral-950 py-6 px-6 gap-2">
                            <p className={"text-3xl text-nowrap font-semibold w-full text-center"}>
                                Subscribe to Newsletter
                            </p>
                            <p className={"text-neutral-300 px-2 mb-2 text-center text-xl"}>
                                A newsletter for entrepreneurs, developers, and those who want to continuously learn.
                            </p>
                            {/*<Form*/}
                            {/*    className="w-full px-3"*/}
                            {/*    validationBehavior="native"*/}
                            {/*    onSubmit={onSubmit}*/}
                            {/*>*/}
                            <Input
                                name="email"
                                placeholder="name@example.com"
                                type="email"
                            />
                            <Button
                                type="submit"
                                variant="bar"
                                className={"w-full bg-white text-black"}
                            >
                                Subscribe
                            </Button>
                        </Card>
                    </Card>
                </section>
            </DefaultLayout>

        </>
    );
}

