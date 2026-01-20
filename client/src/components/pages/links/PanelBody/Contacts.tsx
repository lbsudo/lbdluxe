import { FaEnvelope, FaGlobe } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export const Contacts = () => {
  return (
    <>
      <Card className={"mx-4 mt-2 w-full py-0"}>
        <CardContent
          className={"text-md px-4 py-2 text-left whitespace-pre-line"}
        >
          <div className={"flex items-center gap-2"}>
            <FaGlobe className={"h-5 w-5 text-white"} />
            <Link to={"/"} className={"text-lg font-bold"}>
              lbdluxe.com
            </Link>
          </div>
          <div className={"flex items-center gap-2"}>
            <FaEnvelope className={"h-5 w-5 text-white"} />
            <a className={"text-lg font-bold"}>lbsudo100@gmail.com</a>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
