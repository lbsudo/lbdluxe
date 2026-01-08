import {ShimmerButton} from "../../../../@/components/ui/shimmer-button.tsx";

export default function PageHeader() {
    return (
        <div className={'z-2 flex flex-col items-center justify-start h-full w-2/3 text-center'}>
            <ShimmerButton className={'py-0 '}>Learning Projects</ShimmerButton>
            <h1>RECENT WORK</h1>
            <p>I'm thrilled to showcase some of my recent projects that demonstrate my passion for crafting intuitive user experiences and robust, efficient software solutions.</p>
        </div>
    )
}
