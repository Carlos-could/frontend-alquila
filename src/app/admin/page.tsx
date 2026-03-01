import { RouteGuard } from "@/features/auth/route-guard";
import { AdminModerationPanel } from "@/features/properties/admin-moderation-panel";

export default function AdminPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <RouteGuard allowedRoles={["admin"]}>
        <AdminModerationPanel />
      </RouteGuard>
    </main>
  );
}
