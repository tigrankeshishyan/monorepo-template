export default function NotFoundPage(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-2 p-6">
      <h1 className="text-2xl font-semibold text-text-DEFAULT">404 — Page not found</h1>
      <a href="/" className="text-brand-500 underline text-sm">
        Go home
      </a>
    </main>
  );
}
