import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  deep = false,
}: {
  children: React.ReactNode;
  className?: string;
  deep?: boolean;
}) {
  return (
    <div className={cn(deep ? "glass-deep" : "glass", "rounded-2xl", className)}>
      {children}
    </div>
  );
}
