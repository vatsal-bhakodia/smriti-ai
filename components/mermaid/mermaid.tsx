import mermaid from "mermaid";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadAsPNG } from "./downloadPNG";

mermaid.initialize({});

const Mermaid = ({ chart, id }: { chart: string; id: string }) => {
  useEffect(() => {
    document.getElementById(id)?.removeAttribute("data-processed");
    mermaid.contentLoaded();
  }, [chart, id]);

  return (
    <div className="relative group">
      <div className="mermaid" id={id}>
        {chart}
      </div>
      <Button
        onClick={() => {
          downloadAsPNG(id);
        }}
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700 text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        Download PNG
      </Button>
    </div>
  );
};

export default Mermaid;
