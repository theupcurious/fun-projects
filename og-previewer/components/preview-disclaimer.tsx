import { Info } from "lucide-react";

export function PreviewDisclaimer() {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-400">
      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-zinc-500" />
      <span>
        Previews based on extracted metadata.{" "}
        Actual platform rendering may differ.
      </span>
    </div>
  );
}
