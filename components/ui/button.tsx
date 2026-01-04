import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary = Blue accent (CTA principal)
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-[var(--primary-hover)]",
          "active:bg-[var(--primary-active)]",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        ],

        // Secondary = Gray surface (actions secondaires)
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-[var(--secondary-hover)]",
          "active:bg-[var(--secondary-active)]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        ],

        // Outline = Border subtil (tertiary actions)
        outline: [
          "border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        ],

        // Ghost = Transparent (navigation, menu)
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        ],

        // Link = Texte souligné
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        ],

        // Destructive = Actions dangereuses
        destructive: [
          "bg-destructive text-white",
          "hover:bg-destructive/90",
          "active:bg-destructive/80",
          "focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        ],
      },
      size: {
        // SM = Micro-actions, tags
        sm: "h-9 px-4 text-sm rounded-[var(--radius-sm)]", // 36px height, 6px radius

        // MD = Default buttons
        default: "h-11 px-6 text-base rounded-[var(--radius-md)]", // 44px height, 8px radius

        // LG = CTA principal (hero, conversions)
        lg: "h-14 px-8 text-lg rounded-[var(--radius-md)]", // 56px height, 8px radius

        // Icon variants (carrés)
        icon: "size-11 rounded-[var(--radius-md)]",
        "icon-sm": "size-9 rounded-[var(--radius-sm)]",
        "icon-lg": "size-14 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
