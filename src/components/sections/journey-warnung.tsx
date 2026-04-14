import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  stunden: number;
};

export function JourneyWarnung({ stunden }: Props) {
  const alert = stunden >= 15;

  return (
    <div
      role={alert ? "alert" : undefined}
      aria-live={alert ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-2xl border-2 p-5 transition-colors",
        alert
          ? "border-red-300 bg-red-50 text-red-900"
          : "border-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      <AlertTriangle
        className={cn(
          "mt-0.5 h-6 w-6 shrink-0",
          alert ? "text-red-600" : "text-amber-600",
        )}
        aria-hidden="true"
      />
      <div className="space-y-1 text-sm leading-relaxed">
        <div className="font-bold uppercase tracking-wide">
          {alert ? "Stop! ALG I weg" : "Wichtig: 15-Stunden-Grenze"}
        </div>
        <p>
          {alert
            ? "Bei 15 Stunden/Woche verlierst du den kompletten ALG-I-Anspruch – unabhängig vom Verdienst. Reduziere sofort."
            : "Ab 15 Std./Woche verlierst du den kompletten ALG-I-Anspruch. Halte dich strikt unter 14 Std. 59 Min."}
        </p>
      </div>
    </div>
  );
}
