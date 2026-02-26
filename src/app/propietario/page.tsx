import { RouteGuard } from "@/features/auth/route-guard";
import { PropertyManagementPanel } from "@/features/properties/property-management-panel";

export default function PropietarioPage() {
  return (
    <main className="protected-shell">
      <RouteGuard allowedRoles={["propietario", "admin"]}>
        <PropertyManagementPanel />
      </RouteGuard>
    </main>
  );
}
