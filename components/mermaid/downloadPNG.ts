import { toast } from "sonner";

export const downloadAsPNG = async (id: string) => {
  try {
    const element = document.getElementById(id);
    if (!element) {
      toast.error("Diagram not found");
      return;
    }

    // Get the SVG element from the mermaid container
    const svgElement = element.querySelector("svg");
    if (!svgElement) {
      toast.error("Unable to find diagram");
      return;
    }

    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;

    // Get dimensions
    const bbox = svgElement.getBoundingClientRect();
    const width = bbox.width || 800;
    const height = bbox.height || 600;

    // Set explicit dimensions on cloned SVG
    clonedSvg.setAttribute("width", String(width));
    clonedSvg.setAttribute("height", String(height));

    // Inline all styles to avoid external dependencies
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    const styleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style"
    );
    styleElement.textContent = styles;
    clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

    // Convert SVG to data URL using base64
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const base64Data = btoa(unescape(encodeURIComponent(svgData)));
    const dataUrl = `data:image/svg+xml;base64,${base64Data}`;

    // Create canvas and draw SVG
    const canvas = document.createElement("canvas");
    canvas.width = width * 2; // 2x for better quality
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Failed to create canvas");
      return;
    }

    // Fill with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw image
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to create image");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `diagram-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Diagram downloaded successfully!");
      }, "image/png");
    };

    img.onerror = () => {
      toast.error("Failed to load diagram");
    };

    img.src = dataUrl;
  } catch (error) {
    console.error("Error downloading diagram:", error);
    toast.error("Failed to download diagram");
  }
};
