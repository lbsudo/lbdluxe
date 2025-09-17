import {createFileRoute} from "@tanstack/react-router";
// import { useState } from "react";
// import beaver from "@/assets/beaver.svg";
// import { Button } from "@/components/ui/button";
// import { hcWithType } from "server/dist/client";
// import { useMutation } from "@tanstack/react-query";
import DefaultLayout from "@/layouts/default.tsx";
import {HomeHero} from "@/components/home/hero.tsx";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {

    return (
        <>
            <DefaultLayout>
                <HomeHero/>
            </DefaultLayout>

        </>
    );
}

