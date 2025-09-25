import {Button} from "@/components/ui/button.tsx";
import {FaRegCopyright, FaRegEnvelope} from "react-icons/fa";
import {SiGithub, SiLinkedin} from "react-icons/si";
import {Globe} from "lucide-react";

export function Footer() {
    return (
        <>
            <footer className="w-full flex items-end justify-center my-3 static bottom-0">

                <div
                    className={"mb-24 flex w-full flex-col items-center justify-center"}
                >
                    <Button
                        className={"bg-white text-lg text-black"}
                        onClick={() => {
                            window.location.href = "mailto:lbsudo100@gmail.com";
                        }}
                    >
                        <FaRegEnvelope size={20}/> Email
                    </Button>{" "}
                    <span
                        className={
                            "text text-md mt-4 flex select-none items-center justify-center gap-1 accent-neutral-500"
                        }
                    >
            <FaRegCopyright/>
                        {""} 2025 Lawrence Brown
          </span>
                    <ul className={"flex gap-2 pt-2"}>
                        <li>
                            <button onClick={() => window.open("https://github.com/lbsudo")}>
                                <SiGithub size={18}/>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => window.open("https://linkedin.com/in/lbsudo", "_blank")}
                            >
                                <SiLinkedin size={18}/>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => window.open("https://currencycovenant.com")}
                            >
                                <Globe size={18}/>
                            </button>
                        </li>
                    </ul>
                </div>
            </footer>
        </>
    )
}
