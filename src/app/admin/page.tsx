import { RouteGuard } from "@/features/auth/route-guard";
import { AdminModerationPanel } from "@/features/properties/admin-moderation-panel";

export default function AdminPage() {
  return (
    <main className="protected-shell">
      <RouteGuard allowedRoles={["admin"]}>
        <AdminModerationPanel />
      </RouteGuard>
    </main>
  );
}
