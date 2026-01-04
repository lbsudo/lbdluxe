import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Contact } from "resend";
import AdminLayout from "@/layouts/admin-layout";
import { useGetAllResendContacts } from "@/hooks/server/resend/useGetAllResendContacts";

export const Route = createFileRoute("/admin/base/newsletter-subs")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  const [isClient, setIsClient] = useState(false);
  const { data: contacts, isLoading, error } = useGetAllResendContacts();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const columnHelper = createColumnHelper<Contact>();

  const columns = [
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("first_name", {
      header: "First Name",
      cell: (info) => info.getValue() ?? "—",
    }),
    columnHelper.accessor("last_name", {
      header: "Last Name",
      cell: (info) => info.getValue() ?? "—",
    }),
    columnHelper.accessor("unsubscribed", {
      header: "Status",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-red-500">Unsubscribed</span>
        ) : (
          <span className="text-green-600">Active</span>
        ),
    }),
    columnHelper.accessor("created_at", {
      header: "Joined",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
  ];

  const table = useReactTable({
    data: contacts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AdminLayout>
      <h1 className="mb-6 text-xl font-semibold">Newsletter Subscribers</h1>

      {!isClient ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          {isLoading && (
            <p className="text-muted-foreground">Loading subscribers…</p>
          )}

          {error && <p className="text-red-500">{error.message}</p>}

          {contacts && contacts.length === 0 && (
            <p className="text-muted-foreground">No subscribers found.</p>
          )}

          {contacts && contacts.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 py-2 text-left font-medium"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
