"use client";

interface SkipLinksProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export function SkipLinks({ links }: SkipLinksProps) {
  const defaultLinks = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#navigation", label: "Skip to navigation" },
  ];

  const skipLinks = links || defaultLinks;

  return (
    <nav aria-label="Skip navigation" className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-0 focus-within:left-0 focus-within:right-0 focus-within:z-60">
      <ul className="flex gap-2 p-4 bg-background border-b">
        {skipLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/90 transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
