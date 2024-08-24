import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle } from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm roundend-md shadow-md flex w-full items-center",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-300 text-primary",
        success: "bg-emerald-700/80 border-emerald-300 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

import React from "react";

const Banner = ({ variant, label }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" /> {label}
    </div>
  );
};

export default Banner;
