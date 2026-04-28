export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4" role="status" aria-label={label}>
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-12 rounded" />
        <div className="skeleton h-12 rounded" />
        <div className="skeleton h-12 rounded" />
      </div>
    </div>
  );
}
