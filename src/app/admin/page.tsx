import { RouteGuard } from "@/features/auth/route-guard";

export default function AdminPage() {
  return (
    <main className="protected-shell">
      <RouteGuard allowedRoles={["admin"]}>
        <section className="guard-panel">
          <h1>Panel admin</h1>
          <p className="guard-message">Solo usuarios con rol admin pueden ver esta seccion.</p>
        </section>
      </RouteGuard>
    </main>
  );
}
