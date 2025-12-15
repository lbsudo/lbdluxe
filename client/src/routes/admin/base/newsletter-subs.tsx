import AdminLayout from "@/layouts/admin-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useGetResendContacts } from "@/hooks/resend/useGetResendContacts";

export const Route = createFileRoute("/admin/base/newsletter-subs")({
  component: RouteComponent,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:8787";

function RouteComponent() {
  const { data: contacts, isLoading, error } = useGetResendContacts(SERVER_URL);

  return (
    <AdminLayout>
      <h1 className="mb-6 text-xl font-semibold">Newsletter Subscribers</h1>

      {/* Loading */}
      {isLoading && (
        <p className="text-muted-foreground">Loading subscribers…</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500">
          {error instanceof Error
            ? error.message
            : "Failed to load subscribers"}
        </p>
      )}

      {/* Empty */}
      {contacts && contacts.length === 0 && (
        <p className="text-muted-foreground">No subscribers found.</p>
      )}

      {/* List */}
      {contacts && contacts.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">First Name</th>
                <th className="px-3 py-2 text-left font-medium">Last Name</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Joined</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-t hover:bg-muted/50">
                  <td className="px-3 py-2">{contact.email}</td>

                  <td className="px-3 py-2">{contact.first_name ?? "—"}</td>

                  <td className="px-3 py-2">{contact.last_name ?? "—"}</td>

                  <td className="px-3 py-2">
                    {contact.unsubscribed ? (
                      <span className="text-red-500">Unsubscribed</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </td>

                  <td className="px-3 py-2 text-muted-foreground">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
