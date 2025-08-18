"use client"

import { useEffect } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
  id: string;
  theme?: "light" | "dark"; // optional prop for theme
}

const Mermaid = ({ chart, id, theme = "dark" }: MermaidProps) => {
  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = chart;
      element.removeAttribute("data-processed");

      mermaid.initialize({
        startOnLoad: true,
        theme: theme === "light" ? "neutral" : "base", // light theme: neutral, dark theme: base
        themeVariables:
          theme === "light"
            ? {
                primaryColor: "#4ade80", // green accents
                primaryTextColor: "#111827",
                secondaryColor: "#f3f4f6",
                lineColor: "#6b7280",
                background: "#ffffff",
              }
            : {
                primaryColor: "#adff2f",
                primaryTextColor: "#ffffff",
                secondaryColor: "#1e1e2f",
                lineColor: "#4ade80",
                background: "#1e1e2f",
              },
      });

      mermaid.init(undefined, element);
    }
  }, [chart, id, theme]);

  return (
    <div className="mermaid" id={id}>
      {chart}
    </div>
  );
};

export default Mermaid;
