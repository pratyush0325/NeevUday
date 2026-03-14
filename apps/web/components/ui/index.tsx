import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const badgeVariants = {
  queued:      "bg-gray-100 text-gray-600",
  matched:     "bg-forest-50 text-forest-800",
  in_transit:  "bg-amber-50 text-amber-800",
  delivered:   "bg-teal-50 text-teal-800",
  fulfilled:   "bg-teal-50 text-teal-800",
  pending:     "bg-gray-100 text-gray-600",
  active:      "bg-forest-50 text-forest-800",
  approved:    "bg-forest-50 text-forest-800",
  rejected:    "bg-red-100 text-red-700",
  under_review:"bg-amber-50 text-amber-800",
  critical:    "bg-red-100 text-red-700",
  high:        "bg-coral-50 text-coral-800",
  medium:      "bg-amber-50 text-amber-800",
  low:         "bg-gray-100 text-gray-600",
  available:   "bg-forest-50 text-forest-800",
  assigned:    "bg-ocean-50 text-ocean-800",
};

export function Badge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const styles = badgeVariants[value as keyof typeof badgeVariants] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={cn("badge", styles, className)}>
      {value.replace(/_/g, " ")}
    </span>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
export function MetricCard({
  label,
  value,
  sub,
  subColor = "text-forest-600",
}: {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="metric-card">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-serif text-2xl font-medium leading-none">{value}</p>
      {sub && <p className={cn("text-xs mt-1", subColor)}>{sub}</p>}
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="section-title">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const avatarColors: Record<string, string> = {
  donor:    "bg-amber-50 text-amber-800",
  platform: "bg-forest-50 text-forest-800",
  ngo:      "bg-teal-50 text-teal-800",
  worker:   "bg-ocean-50 text-ocean-800",
  village:  "bg-coral-50 text-coral-800",
};

export function Avatar({
  initials,
  role,
  size = "md",
}: {
  initials: string;
  role?: string;
  size?: "sm" | "md" | "lg";
}) {
  const colors = role ? avatarColors[role] ?? "bg-gray-100 text-gray-700" : "bg-gray-100 text-gray-700";
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={cn("rounded-full flex items-center justify-center font-medium flex-shrink-0", colors, sizes[size])}>
      {initials}
    </div>
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = "bg-forest-600" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10 text-gray-400 text-sm">{message}</div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-6 h-6 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
