import { RouteGuard } from "@/features/auth/route-guard";

export default function PropietarioPage() {
  return (
    <main className="protected-shell">
      <RouteGuard allowedRoles={["propietario", "admin"]}>
        <section className="guard-panel">
          <h1>Panel propietario</h1>
          <p className="guard-message">Disponible para propietario y admin.</p>
        </section>
      </RouteGuard>
    </main>
  );
}
