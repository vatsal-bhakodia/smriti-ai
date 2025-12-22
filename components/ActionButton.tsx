import Link from "next/link";
import { Button } from "@/components/ui/button";

export type ActionButtonProps = {
  href: string;
  label: string;
  icon?: React.ElementType;
  variant?: "ghost" | "outline" | "default";
  className?: string;
  external?: boolean;
};

export const ActionButton = ({
  href,
  label,
  icon: Icon,
  variant = "ghost",
  className = "",
  external = false,
}: ActionButtonProps) => {
  const content = (
    <Button
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Button>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href}>{content}</Link>
  );
};
