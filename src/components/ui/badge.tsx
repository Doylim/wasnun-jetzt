import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-navy-800 text-white",
        teal: "bg-teal-500 text-white",
        navy: "bg-navy-50 text-navy-800",
        amber: "bg-amber-50 text-amber-700 border border-amber-200",
        success: "bg-teal-50 text-teal-700 border border-teal-200",
        outline: "border border-navy-200 text-navy-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
