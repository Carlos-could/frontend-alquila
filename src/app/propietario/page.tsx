import { RouteGuard } from "@/features/auth/route-guard";
import { PropertyManagementPanel } from "@/features/properties/property-management-panel";

export default function PropietarioPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <RouteGuard allowedRoles={["propietario", "admin"]}>
        <PropertyManagementPanel />
      </RouteGuard>
    </main>
  );
}
