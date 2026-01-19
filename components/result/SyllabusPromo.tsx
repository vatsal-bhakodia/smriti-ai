import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const SyllabusPromo = () => {
  return (
    <Link
    href="/resources/ggsipu"
    className="w-full max-w-xl group"
    >
    <div className="flex items-center justify-between p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg hover:border-lime-500/50 hover:bg-zinc-800/80 transition-all duration-300">
        <div className="flex items-center gap-3">
        <div className="p-2 bg-lime-500/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-lime-500" />
        </div>
        <div>
            <p className="text-sm font-medium text-white">GGSIPU Syllabus & Notes</p>
            <p className="text-xs text-zinc-400">Access study materials for all semesters</p>
        </div>
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-lime-500 group-hover:translate-x-1 transition-all duration-300" />
    </div>
    </Link>
  )
}

export default SyllabusPromo
