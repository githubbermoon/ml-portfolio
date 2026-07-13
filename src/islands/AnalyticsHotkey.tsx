import { useEffect, useState } from "react";

type Props = {
  goatCounterCode?: string;
};

export default function AnalyticsHotkey({ goatCounterCode }: Props) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(window.location.pathname);

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "h" && (event.metaKey || event.ctrlKey || event.altKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  const counterUrl = goatCounterCode
    ? `https://${goatCounterCode}.goatcounter.com/counter/${encodeURIComponent(path)}.svg`
    : null;
  const dashboardUrl = goatCounterCode ? `https://${goatCounterCode}.goatcounter.com/` : null;

  return (
    <aside className="fixed bottom-5 right-5 z-[9999] w-[min(92vw,24rem)] rounded-2xl border border-white/10 bg-black/85 p-5 text-sm text-mist shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-mist/60">Private analytics</p>
          <h2 className="mt-2 text-xl text-glass">Visitor counter</h2>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-mist transition hover:text-white"
          onClick={() => setOpen(false)}
        >
          Hide
        </button>
      </div>

      {goatCounterCode ? (
        <div className="mt-4 space-y-3">
          <p className="leading-6">
            GoatCounter is active. It gives privacy-friendly page views and unique visitor estimates without storing full IP addresses.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-mist/50">This page</p>
            {counterUrl && <img src={counterUrl} alt={`Visitor count for ${path}`} className="h-6 invert" />}
          </div>
          {dashboardUrl && (
            <a className="inline-flex text-glow transition hover:text-white" href={dashboardUrl} target="_blank" rel="noreferrer">
              Open analytics dashboard →
            </a>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="leading-6">
            Analytics panel is installed, but no GoatCounter code is configured yet.
          </p>
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-mist/70">
            Add a GitHub Pages environment variable named <code>PUBLIC_GOATCOUNTER_CODE</code> with your GoatCounter site code to activate counting.
          </p>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-5 text-mist/45">
        Toggle with Cmd+H, Ctrl+H, or Option+H. On macOS, Cmd+H may be captured by the browser/OS; Option+H is the reliable fallback.
      </p>
    </aside>
  );
}
