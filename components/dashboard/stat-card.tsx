import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <span className="text-muted-foreground flex size-10 items-center justify-center rounded-full border">
          {icon}
        </span>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-muted-foreground mt-1 text-sm">{label}</p>
          {hint && <p className="text-muted-foreground/70 mt-1 text-xs">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
