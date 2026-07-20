/**
 * Next.js instrumentation hook — runs once when the server starts.
 * We use it to auto-create database tables and seed demo data.
 */
export async function register() {
  // Only run on the Node.js server runtime (not during build or edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initDatabase } = await import("@/db/init");
    try {
      await initDatabase();
    } catch (err) {
      console.error("[db] Auto-init failed:", err);
    }
  }
}
