import {createFileRoute} from '@tanstack/react-router'
import AdminLayout from "@/layouts/admin.tsx";
import {toast} from "sonner";
import {useEffect, useState} from "react";

export const Route = createFileRoute('/admin/newsletter-subs')({
    component: RouteComponent,
})

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

function RouteComponent() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]); // ✅ always start as array

    async function getContacts() {
        setLoading(true);
        try {
            const res = await fetch(`${SERVER_URL}/api/getResendContacts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await res.json();

            if (result.success) {
                setData(result.data.data); // ✅ ensure array
            } else {
                toast.error(`Error: ${result.error?.message || result.error || "Unknown error"}`);
            }
        } catch (err) {
            toast.error(`Error: ${(err as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getContacts(); // ✅ only call, don’t set state here
    }, []);

    console.log("contacts data:", data);

    return (
        <AdminLayout>
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Newsletter Subscribers</h1>

                {loading && <p>Loading contacts...</p>}

                {!loading && data.length === 0 && (
                    <p className="text-gray-500">No contacts found.</p>
                )}

                <ul className="space-y-2">
                    {Array.isArray(data) &&
                        data.map((contact: any, idx: number) => (
                            <li key={idx} className="p-2 border rounded">
                                {contact.email}
                            </li>
                        ))}
                </ul>
            </div>
        </AdminLayout>
    );
}
