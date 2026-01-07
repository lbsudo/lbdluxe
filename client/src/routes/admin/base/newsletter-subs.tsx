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
import {  useContacts } from "@/hooks/server/resend/GET/useContacts";
import { useSegments} from "@/hooks/server/resend/GET/useSegments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/base/newsletter-subs" as any)({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  const [isClient, setIsClient] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const { data: segments, isLoading: segmentsLoading, error: segmentsError } = useSegments();
  const { data: contacts, isLoading: contactsLoading, error: contactsError } = useContacts(selectedSegment);

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
          {/* Segment Selector */}
          <div className="mb-6">
            <label htmlFor="segment-select" className="block text-sm font-medium mb-2">
              Select Segment:
            </label>
            <Select
              value={selectedSegment}
              onValueChange={(value) => setSelectedSegment(value || "")}
              disabled={segmentsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {segments?.find((segment: any) => segment.id === selectedSegment)?.name || "Choose a segment..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {segments?.map((segment: any) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {segmentsLoading && <span className="ml-2 text-muted-foreground">Loading segments...</span>}
            {segmentsError && (
              <div className="mt-2">
                <p className="text-red-500">Error loading segments: {segmentsError.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  This may be due to API authentication issues. Check your Resend API key configuration.
                </p>
              </div>
            )}
          </div>

          {/* Contacts Table */}
          {selectedSegment && (
            <>
              {contactsLoading && (
                <p className="text-muted-foreground">Loading subscribers…</p>
              )}

              {contactsError && (
                <div>
                  <p className="text-red-500">Error loading contacts: {contactsError.message}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              )}

              {contacts && contacts.length === 0 && (
                <p className="text-muted-foreground">No subscribers found in this segment.</p>
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
        </>
      )}
    </AdminLayout>
  );
}