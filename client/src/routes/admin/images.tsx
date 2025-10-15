import {createFileRoute} from '@tanstack/react-router';
import AdminLayout from "@/layouts/admin.tsx";
// import {useState} from "react";
// import {useMutation, useQuery} from "@tanstack/react-query";
// import {Button} from "@/components/ui/button.tsx";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter
// } from "@/components/ui/dialog.tsx";
// import {X} from "lucide-react";
import {CoverImageManagement} from "@/components/admin/images/cover-image-management.tsx";
import {PostImageManagement} from "@/components/admin/images/post-image-mangement.tsx";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const Route = createFileRoute('/admin/images')({
    component: RouteComponent,
});

function RouteComponent() {


    return (
        <AdminLayout>
            <CoverImageManagement/>
            <PostImageManagement/>
        </AdminLayout>
    );
}
